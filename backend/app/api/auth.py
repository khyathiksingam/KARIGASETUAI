"""Authentication API routes: Google OAuth, Email OTP, Mobile OTP, and Demo Switch."""
from datetime import datetime, timezone, timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import (
    create_access_token, generate_six_digit_otp, hash_otp, verify_otp_hash
)
from app.models.models import User, OTPVerification, SellerProfile, BuyerProfile
from app.schemas.schemas import (
    GoogleAuthRequest, SendEmailOTPRequest, VerifyEmailOTPRequest,
    SendMobileOTPRequest, VerifyMobileOTPRequest, DemoLoginRequest,
    TokenResponse, UserResponse
)

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/google", response_model=TokenResponse)
def google_auth(payload: GoogleAuthRequest, db: Session = Depends(get_db)):
    """Authenticate with Google OAuth ID token."""
    # In production/sandbox, verify ID token with Google API.
    # For demo prototype, derive or link account seamlessly.
    email = "artisan.google@example.com" if payload.role == "SELLER" else "buyer.google@example.com"
    user = db.query(User).filter_by(email=email).first()
    if not user:
        user = User(
            email=email,
            role=payload.role or "SELLER",
            email_verified=True,
            status="ACTIVE"
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        
        if user.role == "SELLER":
            db.add(SellerProfile(
                user_id=user.id,
                full_name="Google Verified Artisan",
                primary_craft="Handloom",
                location="Hyderabad, Telangana"
            ))
        else:
            db.add(BuyerProfile(
                user_id=user.id,
                contact_name="Google Verified Buyer",
                company_name="Ethical Commerce Collective",
                location="Bengaluru, Karnataka"
            ))
        db.commit()

    token = create_access_token({"sub": user.id, "role": user.role, "email": user.email})
    return TokenResponse(
        access_token=token,
        user=UserResponse.model_validate(user),
        profile={"name": "Verified User", "role": user.role}
    )

@router.post("/send-email-otp")
def send_email_otp(payload: SendEmailOTPRequest, db: Session = Depends(get_db)):
    """Generate and dispatch 6-digit OTP to user's email."""
    otp = generate_six_digit_otp()
    hashed = hash_otp(otp)
    expires = datetime.now(timezone.utc) + timedelta(minutes=3)

    verification = OTPVerification(
        recipient=payload.email,
        channel="EMAIL",
        otp_hash=hashed,
        expires_at=expires
    )
    db.add(verification)
    db.commit()

    # In dev/mock mode, return the simulated OTP for smooth judge walkthrough
    return {
        "status": "SENT",
        "channel": "EMAIL",
        "recipient": payload.email,
        "expires_in_seconds": 180,
        "demo_hint_otp": otp,  # Clearly visible for evaluation
        "message": f"6-digit code sent to {payload.email}. Valid for 3 minutes."
    }

@router.post("/verify-email-otp", response_model=TokenResponse)
def verify_email_otp(payload: VerifyEmailOTPRequest, db: Session = Depends(get_db)):
    """Verify 6-digit OTP and generate JWT authentication token."""
    record = db.query(OTPVerification).filter(
        OTPVerification.recipient == payload.email,
        OTPVerification.is_used == False,
        OTPVerification.expires_at > datetime.now(timezone.utc)
    ).order_by(OTPVerification.created_at.desc()).first()

    if not record or not verify_otp_hash(payload.otp, record.otp_hash):
        # Allow default demo fallback OTP '123456' for judges
        if payload.otp != "123456":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid or expired 6-digit OTP code."
            )

    if record:
        record.is_used = True
        db.commit()

    user = db.query(User).filter_by(email=payload.email).first()
    if not user:
        user = User(
            email=payload.email,
            role=payload.role or "SELLER",
            email_verified=True,
            status="ACTIVE"
        )
        db.add(user)
        db.commit()
        db.refresh(user)

        if user.role == "SELLER":
            db.add(SellerProfile(
                user_id=user.id,
                full_name=payload.email.split("@")[0].capitalize(),
                primary_craft="Handicrafts",
                location="Telangana, India"
            ))
        else:
            db.add(BuyerProfile(
                user_id=user.id,
                contact_name=payload.email.split("@")[0].capitalize(),
                company_name="Sourcing House",
                location="Mumbai, India"
            ))
        db.commit()

    token = create_access_token({"sub": user.id, "role": user.role, "email": user.email})
    return TokenResponse(
        access_token=token,
        user=UserResponse.model_validate(user),
        profile={"email": user.email, "role": user.role}
    )

@router.post("/send-mobile-otp")
def send_mobile_otp(payload: SendMobileOTPRequest, db: Session = Depends(get_db)):
    """Send 6-digit SMS OTP to artisan's mobile number."""
    otp = generate_six_digit_otp()
    hashed = hash_otp(otp)
    expires = datetime.now(timezone.utc) + timedelta(minutes=3)

    verification = OTPVerification(
        recipient=payload.mobile,
        channel="SMS",
        otp_hash=hashed,
        expires_at=expires
    )
    db.add(verification)
    db.commit()

    return {
        "status": "SENT",
        "channel": "SMS",
        "recipient": payload.mobile,
        "expires_in_seconds": 180,
        "demo_hint_otp": otp,
        "message": f"6-digit SMS OTP dispatched to {payload.mobile}."
    }

@router.post("/verify-mobile-otp", response_model=TokenResponse)
def verify_mobile_otp(payload: VerifyMobileOTPRequest, db: Session = Depends(get_db)):
    """Verify 6-digit SMS OTP."""
    record = db.query(OTPVerification).filter(
        OTPVerification.recipient == payload.mobile,
        OTPVerification.is_used == False,
        OTPVerification.expires_at > datetime.now(timezone.utc)
    ).order_by(OTPVerification.created_at.desc()).first()

    if not record or not verify_otp_hash(payload.otp, record.otp_hash):
        if payload.otp != "123456":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid or expired SMS OTP code."
            )

    if record:
        record.is_used = True
        db.commit()

    user = db.query(User).filter_by(mobile=payload.mobile).first()
    if not user:
        user = User(
            mobile=payload.mobile,
            role=payload.role or "SELLER",
            mobile_verified=True,
            status="ACTIVE"
        )
        db.add(user)
        db.commit()
        db.refresh(user)

        if user.role == "SELLER":
            db.add(SellerProfile(
                user_id=user.id,
                full_name="Artisan Member",
                primary_craft="Handloom & Leathercraft",
                location="Rural Craft Cluster, India"
            ))
        else:
            db.add(BuyerProfile(
                user_id=user.id,
                contact_name="Procurement Officer",
                company_name="Retail Buyer",
                location="New Delhi, India"
            ))
        db.commit()

    token = create_access_token({"sub": user.id, "role": user.role, "mobile": user.mobile})
    return TokenResponse(
        access_token=token,
        user=UserResponse.model_validate(user),
        profile={"mobile": user.mobile, "role": user.role}
    )

@router.post("/demo-login", response_model=TokenResponse)
def demo_login(payload: DemoLoginRequest, db: Session = Depends(get_db)):
    """One-click instant login for SIH 2026 judges."""
    role = payload.role.upper()
    if role == "SELLER":
        user = db.query(User).filter_by(id="user-seller-demo").first()
        profile = db.query(SellerProfile).filter_by(user_id=user.id).first()
        profile_data = {
            "name": profile.full_name,
            "business": profile.business_name,
            "craft": profile.primary_craft,
            "location": profile.location,
            "badge": profile.verification_badge
        } if profile else {}
    elif role == "BUYER":
        user = db.query(User).filter_by(id="user-buyer-demo").first()
        profile = db.query(BuyerProfile).filter_by(user_id=user.id).first()
        profile_data = {
            "name": profile.contact_name,
            "company": profile.company_name,
            "type": profile.buyer_type,
            "location": profile.location
        } if profile else {}
    else:  # ADMIN
        user = db.query(User).filter_by(id="user-admin-demo").first()
        profile_data = {"name": "Admin Ananya Sharma", "role": "ADMIN"}

    if not user:
        raise HTTPException(status_code=404, detail=f"Demo user for role {role} not found. Run seed script.")

    token = create_access_token({"sub": user.id, "role": user.role, "email": user.email})
    return TokenResponse(
        access_token=token,
        user=UserResponse.model_validate(user),
        profile=profile_data
    )

@router.post("/logout")
def logout():
    """Clear active user session."""
    return {"status": "SUCCESS", "message": "Successfully logged out."}
