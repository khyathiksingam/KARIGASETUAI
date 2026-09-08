import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams, Link } from 'react-router-dom';
import { 
  Sparkles, 
  Layers, 
  ArrowLeft, 
  Upload, 
  Scan, 
  CheckCircle2, 
  AlertCircle, 
  Info 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';

export const AddProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { addProduct, updateProduct, getProductById, currentUser } = useApp();

  const prefill = (location.state as any)?.prefill;
  const existingProduct = id ? getProductById(id) : null;

  const [formData, setFormData] = useState({
    name: existingProduct?.name || prefill?.name || '',
    description: existingProduct?.description || prefill?.description || '',
    category: existingProduct?.category || prefill?.category || 'Wood Craft',
    material: existingProduct?.material || prefill?.material || 'Teak Wood',
    model_style: existingProduct?.model_style || prefill?.model || 'Traditional Indian Style',
    length: existingProduct?.dimensions.length || prefill?.length || 25,
    width: existingProduct?.dimensions.width || prefill?.width || 15,
    height: existingProduct?.dimensions.height || prefill?.height || 10,
    unit: 'cm',
    primary_color: existingProduct?.primary_color || prefill?.primaryColor || 'Natural Brown',
    secondary_color: existingProduct?.secondary_color || prefill?.secondaryColor || '',
    price: existingProduct?.price || prefill?.price || 2499,
    quantity: existingProduct?.quantity || 5,
    crafting_time_days: existingProduct?.crafting_time_days || 7,
    image: existingProduct?.images[0] || prefill?.image || 'https://images.unsplash.com/photo-1606744824163-985d376605aa?w=800&auto=format&fit=crop&q=80',
    state: existingProduct?.state || currentUser?.state || 'Telangana',
    city: existingProduct?.city || currentUser?.city || 'Warangal',
    quality_score: existingProduct?.quality_score || prefill?.qualityScore || 4.8,
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const categories = [
    'Wood Craft', 'Pottery', 'Terracotta', 'Handloom', 'Bamboo', 
    'Metal Craft', 'Silk Craft', 'Jewellery', 'Paintings', 'Home Decor'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (existingProduct) {
      updateProduct(existingProduct.id, {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        material: formData.material,
        model_style: formData.model_style,
        dimensions: {
          length: Number(formData.length),
          width: Number(formData.width),
          height: Number(formData.height),
          unit: formData.unit,
        },
        primary_color: formData.primary_color,
        secondary_color: formData.secondary_color,
        price: Number(formData.price),
        quantity: Number(formData.quantity),
        crafting_time_days: Number(formData.crafting_time_days),
        images: [formData.image],
        state: formData.state,
        city: formData.city,
      });
      setSavedSuccess(true);
      setTimeout(() => navigate('/seller/products'), 1200);
    } else {
      const newProd = addProduct({
        name: formData.name,
        description: formData.description,
        category: formData.category,
        material: formData.material,
        model_style: formData.model_style,
        dimensions: {
          length: Number(formData.length),
          width: Number(formData.width),
          height: Number(formData.height),
          unit: formData.unit,
        },
        is_dimensions_estimated: true,
        primary_color: formData.primary_color,
        secondary_color: formData.secondary_color,
        quality_score: formData.quality_score,
        market_price_min: Math.round(Number(formData.price) * 0.9),
        market_price_max: Math.round(Number(formData.price) * 1.2),
        suggested_price: Number(formData.price),
        price: Number(formData.price),
        quantity: Number(formData.quantity),
        crafting_time_days: Number(formData.crafting_time_days),
        images: [formData.image],
        state: formData.state,
        city: formData.city,
      });

      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      setSavedSuccess(true);
      setTimeout(() => navigate(`/product/${newProd.id}`), 1500);
    }
  };

  return (
    <div className="min-h-screen bg-heritage-ivory py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            to="/seller/products"
            className="inline-flex items-center text-xs font-bold text-heritage-brown hover:text-heritage-terracotta transition"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back to Products Catalog
          </Link>
          <Link
            to="/seller/ai-analyzer"
            className="inline-flex items-center text-xs font-bold text-heritage-terracotta hover:underline"
          >
            <Scan className="w-3.5 h-3.5 mr-1" />
            Use AI Image Analyzer Instead
          </Link>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-heritage-terracotta/20 shadow-3d">
          <div className="mb-6 pb-4 border-b border-heritage-sand flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h1 className="font-serif font-black text-2xl sm:text-3xl text-heritage-brown">
                {existingProduct ? 'Edit Craft Listing' : 'List New Handcrafted Product'}
              </h1>
              <p className="text-xs text-heritage-charcoal/70 mt-1">
                Your artisan identity (<strong>{currentUser?.full_name}</strong> &bull; @{currentUser?.username}) will automatically be stamped as the authentic maker.
              </p>
            </div>
            {prefill && (
              <span className="inline-flex items-center text-[10px] font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full border border-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                Pre-filled from AI Analysis
              </span>
            )}
          </div>

          {savedSuccess && (
            <div className="mb-6 p-4 bg-emerald-100 border border-emerald-300 rounded-2xl text-emerald-900 text-xs font-bold flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-700" />
              <span>
                {existingProduct ? 'Changes saved!' : 'Product successfully published! Redirecting...'}
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Preview & URL */}
            <div>
              <label className="block text-xs font-bold text-heritage-brown mb-1.5">
                Product Image URL *
              </label>
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-24 h-24 rounded-2xl object-cover border border-heritage-sand shadow-sm"
                />
                <div className="w-full">
                  <input
                    type="url"
                    required
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-heritage-sand text-xs font-medium focus:border-heritage-terracotta outline-none"
                    placeholder="https://..."
                  />
                  <p className="text-[10px] text-heritage-charcoal/60 mt-1">
                    Direct photo URL of your handmade piece.
                  </p>
                </div>
              </div>
            </div>

            {/* Product Name */}
            <div>
              <label className="block text-xs font-bold text-heritage-brown mb-1">
                Product Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Hand-Carved Teakwood Krishna"
                className="w-full px-4 py-2.5 rounded-xl border border-heritage-sand text-xs font-medium focus:border-heritage-terracotta outline-none"
              />
            </div>

            {/* Category & Material */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-heritage-brown mb-1">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-heritage-sand text-xs font-medium focus:border-heritage-terracotta outline-none"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-heritage-brown mb-1">
                  Raw Material *
                </label>
                <input
                  type="text"
                  required
                  value={formData.material}
                  onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                  placeholder="e.g. Teak Wood, Quartz Powder, Pure Mulberry Silk"
                  className="w-full px-4 py-2.5 rounded-xl border border-heritage-sand text-xs font-medium focus:border-heritage-terracotta outline-none"
                />
              </div>
            </div>

            {/* Model/Style & Colors */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-heritage-brown mb-1">
                  Traditional Model / Style
                </label>
                <input
                  type="text"
                  value={formData.model_style}
                  onChange={(e) => setFormData({ ...formData, model_style: e.target.value })}
                  placeholder="e.g. Traditional Krishna Sculpture"
                  className="w-full px-4 py-2.5 rounded-xl border border-heritage-sand text-xs font-medium focus:border-heritage-terracotta outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-heritage-brown mb-1">
                  Primary Color
                </label>
                <input
                  type="text"
                  value={formData.primary_color}
                  onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                  placeholder="e.g. Natural Brown"
                  className="w-full px-4 py-2.5 rounded-xl border border-heritage-sand text-xs font-medium focus:border-heritage-terracotta outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-heritage-brown mb-1">
                  Secondary Color
                </label>
                <input
                  type="text"
                  value={formData.secondary_color}
                  onChange={(e) => setFormData({ ...formData, secondary_color: e.target.value })}
                  placeholder="e.g. Golden Honey"
                  className="w-full px-4 py-2.5 rounded-xl border border-heritage-sand text-xs font-medium focus:border-heritage-terracotta outline-none"
                />
              </div>
            </div>

            {/* Dimensions (Length, Width, Height) */}
            <div>
              <label className="block text-xs font-bold text-heritage-brown mb-1">
                Dimensions (Length × Width × Height in cm)
              </label>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <input
                    type="number"
                    min="1"
                    value={formData.length}
                    onChange={(e) => setFormData({ ...formData, length: Number(e.target.value) })}
                    placeholder="Length (cm)"
                    className="w-full px-4 py-2.5 rounded-xl border border-heritage-sand text-xs font-medium focus:border-heritage-terracotta outline-none"
                  />
                  <span className="text-[10px] text-heritage-charcoal/50 mt-0.5 block">Length (cm)</span>
                </div>
                <div>
                  <input
                    type="number"
                    min="1"
                    value={formData.width}
                    onChange={(e) => setFormData({ ...formData, width: Number(e.target.value) })}
                    placeholder="Width (cm)"
                    className="w-full px-4 py-2.5 rounded-xl border border-heritage-sand text-xs font-medium focus:border-heritage-terracotta outline-none"
                  />
                  <span className="text-[10px] text-heritage-charcoal/50 mt-0.5 block">Width (cm)</span>
                </div>
                <div>
                  <input
                    type="number"
                    min="1"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: Number(e.target.value) })}
                    placeholder="Height (cm)"
                    className="w-full px-4 py-2.5 rounded-xl border border-heritage-sand text-xs font-medium focus:border-heritage-terracotta outline-none"
                  />
                  <span className="text-[10px] text-heritage-charcoal/50 mt-0.5 block">Height (cm)</span>
                </div>
              </div>
            </div>

            {/* Pricing, Quantity, Crafting Time */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-heritage-brown mb-1">
                  Listing Price (₹ INR) *
                </label>
                <input
                  type="number"
                  min="100"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 rounded-xl border border-heritage-sand text-xs font-bold text-heritage-terracotta focus:border-heritage-terracotta outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-heritage-brown mb-1">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 rounded-xl border border-heritage-sand text-xs font-medium focus:border-heritage-terracotta outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-heritage-brown mb-1">
                  Crafting Time (Days)
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={formData.crafting_time_days}
                  onChange={(e) => setFormData({ ...formData, crafting_time_days: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 rounded-xl border border-heritage-sand text-xs font-medium focus:border-heritage-terracotta outline-none"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-heritage-brown mb-1">
                Detailed Craft Story & Description *
              </label>
              <textarea
                rows={4}
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe how this piece was crafted, tools used, seasoning process, cultural significance..."
                className="w-full px-4 py-2.5 rounded-xl border border-heritage-sand text-xs font-medium focus:border-heritage-terracotta outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-heritage-terracotta hover:bg-heritage-terracotta-dark text-white font-bold text-sm shadow-3d transition"
            >
              {existingProduct ? 'Update Product Listing' : 'Publish Product to Marketplace (+50 Credits)'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
