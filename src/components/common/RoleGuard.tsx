import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRole?: UserRole;
  requireAuth?: boolean;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  allowedRole,
  requireAuth = true,
}) => {
  const { currentUser, currentRole, isAuthenticated } = useApp();
  const location = useLocation();

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRole && currentRole !== allowedRole) {
    // If seller attempts to access buyer-only route or buyer attempts seller route
    if (currentRole === 'seller') {
      return <Navigate to="/seller/dashboard" replace />;
    } else {
      return <Navigate to="/buyer/marketplace" replace />;
    }
  }

  return <>{children}</>;
};
