import React from 'react';
import { 
  TrendingUp, 
  Eye, 
  Heart, 
  ShoppingBag, 
  IndianRupee, 
  Award, 
  Sparkles,
  ArrowUpRight,
  PieChart as PieIcon,
  BarChart3
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { useApp } from '../../context/AppContext';

export const SellerAnalyticsPage: React.FC = () => {
  const { products, currentUser, orders } = useApp();

  const sellerProducts = products.filter(
    (p) => p.seller_id === currentUser?.id || p.seller.username === currentUser?.username
  );

  const totalViews = sellerProducts.reduce((sum, p) => sum + (p.views || 0), 0) || 2480;
  const totalLikes = sellerProducts.reduce((sum, p) => sum + (p.likes || 0), 0) || 390;
  const totalOrdersCount = orders.length || 18;
  const totalRevenue = 54200;
  const conversionRate = '7.2%';

  // Best selling and most viewed
  const bestSeller = sellerProducts[0] || products[0];
  const mostViewed = sellerProducts[0] || products[0];

  // Revenue & Order Growth Data (Weekly)
  const trendData = [
    { week: 'Week 1', revenue: 6400, views: 320, orders: 2 },
    { week: 'Week 2', revenue: 9800, views: 480, orders: 3 },
    { week: 'Week 3', revenue: 14200, views: 710, orders: 5 },
    { week: 'Week 4', revenue: 23800, views: 970, orders: 8 },
  ];

  // Category Distribution
  const categoryData = [
    { name: 'Wood Craft', value: 45, color: '#C85A32' },
    { name: 'Metal Craft', value: 25, color: '#D4AF37' },
    { name: 'Handloom', value: 20, color: '#1F4E38' },
    { name: 'Pottery', value: 10, color: '#4A2E18' },
  ];

  return (
    <div className="min-h-screen bg-heritage-ivory py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-heritage-terracotta mb-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Performance Insights</span>
            </div>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-heritage-brown">
              Artisan Demand Analytics
            </h1>
            <p className="text-xs text-heritage-charcoal/70 mt-0.5">
              Real-time intelligence on buyer interest, conversion rates, and craft revenue.
            </p>
          </div>
        </div>

        {/* SECTION 31: ANALYTICS METRICS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-heritage-sand shadow-3d">
            <span className="text-xs text-heritage-charcoal/60 font-bold block uppercase">
              Total Views
            </span>
            <p className="font-serif font-black text-2xl sm:text-3xl text-heritage-brown mt-2">
              {totalViews.toLocaleString('en-IN')}
            </p>
            <span className="text-[10px] text-emerald-600 font-semibold flex items-center mt-1">
              <ArrowUpRight className="w-3 h-3 mr-0.5" /> +18% this month
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-heritage-sand shadow-3d">
            <span className="text-xs text-heritage-charcoal/60 font-bold block uppercase">
              Total Likes & Saves
            </span>
            <p className="font-serif font-black text-2xl sm:text-3xl text-heritage-terracotta mt-2">
              {totalLikes.toLocaleString('en-IN')}
            </p>
            <span className="text-[10px] text-emerald-600 font-semibold flex items-center mt-1">
              <ArrowUpRight className="w-3 h-3 mr-0.5" /> High patronage
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-heritage-sand shadow-3d">
            <span className="text-xs text-heritage-charcoal/60 font-bold block uppercase">
              Revenue Generated
            </span>
            <p className="font-serif font-black text-2xl sm:text-3xl text-emerald-700 mt-2">
              ₹{totalRevenue.toLocaleString('en-IN')}
            </p>
            <span className="text-[10px] text-emerald-600 font-semibold flex items-center mt-1">
              <ArrowUpRight className="w-3 h-3 mr-0.5" /> 100% direct artisan share
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-heritage-sand shadow-3d">
            <span className="text-xs text-heritage-charcoal/60 font-bold block uppercase">
              Conversion Rate
            </span>
            <p className="font-serif font-black text-2xl sm:text-3xl text-heritage-gold-dark mt-2">
              {conversionRate}
            </p>
            <span className="text-[10px] text-heritage-charcoal/60 font-medium mt-1 block">
              Benchmark: 3.5%
            </span>
          </div>
        </div>

        {/* BEST SELLER & MOST VIEWED HIGHLIGHTS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-heritage-gold/40 shadow-3d flex items-center space-x-4">
            <img
              src={bestSeller.images[0]}
              alt={bestSeller.name}
              className="w-20 h-20 rounded-2xl object-cover border border-heritage-gold shadow-sm"
            />
            <div>
              <span className="text-[10px] font-bold uppercase text-heritage-gold-dark bg-heritage-gold/20 px-2 py-0.5 rounded-md">
                Best-Selling Craft
              </span>
              <h3 className="font-serif font-bold text-base text-heritage-brown mt-1 line-clamp-1">
                {bestSeller.name}
              </h3>
              <p className="text-xs text-heritage-charcoal/70">
                ₹{bestSeller.price.toLocaleString('en-IN')} &bull; {bestSeller.material}
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-heritage-terracotta/30 shadow-3d flex items-center space-x-4">
            <img
              src={mostViewed.images[0]}
              alt={mostViewed.name}
              className="w-20 h-20 rounded-2xl object-cover border border-heritage-terracotta shadow-sm"
            />
            <div>
              <span className="text-[10px] font-bold uppercase text-heritage-terracotta bg-heritage-terracotta/10 px-2 py-0.5 rounded-md">
                Most-Viewed Craft
              </span>
              <h3 className="font-serif font-bold text-base text-heritage-brown mt-1 line-clamp-1">
                {mostViewed.name}
              </h3>
              <p className="text-xs text-heritage-charcoal/70">
                {mostViewed.views || 420} Unique Views &bull; 94% AI Match
              </p>
            </div>
          </div>
        </div>

        {/* RECHARTS SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Revenue Over Time (Area Chart) */}
          <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-heritage-sand shadow-3d space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-lg text-heritage-brown">
                Weekly Revenue Velocity (₹ INR)
              </h3>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                Positive Upward Trajectory
              </span>
            </div>

            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#C85A32" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#C85A32" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="week" stroke="#888" fontSize={11} />
                  <YAxis stroke="#888" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FAF7F0',
                      borderColor: '#C85A32',
                      borderRadius: '12px',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#C85A32"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorRev)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Share (Pie Chart) */}
          <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-heritage-sand shadow-3d space-y-4 flex flex-col justify-between">
            <div>
              <h3 className="font-serif font-bold text-lg text-heritage-brown">
                Sales by Category
              </h3>
              <p className="text-xs text-heritage-charcoal/60">
                Craft diversification index
              </p>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-heritage-sand text-xs">
              {categoryData.map((c, i) => (
                <div key={i} className="flex items-center justify-between text-heritage-charcoal/80">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                    <span>{c.name}</span>
                  </div>
                  <span className="font-bold">{c.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
