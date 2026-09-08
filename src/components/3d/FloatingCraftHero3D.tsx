import React, { useState } from 'react';
import { Sparkles, Award, ShieldCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CraftItem3D {
  id: string;
  name: string;
  craft: string;
  region: string;
  image: string;
  depthOffset: string;
  rotation: string;
  delay: string;
  badge: string;
}

const FLOATING_CRAFTS: CraftItem3D[] = [
  {
    id: 'wood',
    name: 'Teakwood Krishna',
    craft: 'Wooden Sculpture',
    region: 'Warangal, Telangana',
    image: 'https://images.unsplash.com/photo-1606744824163-985d376605aa?w=600&auto=format&fit=crop&q=80',
    depthOffset: 'translateZ(60px)',
    rotation: '-rotate-3',
    delay: 'animate-float-slow',
    badge: 'GI Recognized',
  },
  {
    id: 'pottery',
    name: 'Cobalt Floral Urn',
    craft: 'Jaipur Blue Pottery',
    region: 'Jaipur, Rajasthan',
    image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=600&auto=format&fit=crop&q=80',
    depthOffset: 'translateZ(90px)',
    rotation: 'rotate-2',
    delay: 'animate-float-delayed',
    badge: 'Quartz Ceramic',
  },
  {
    id: 'handloom',
    name: 'Nizam Zari Saree',
    craft: 'Mangalagiri Handloom',
    region: 'Mangalagiri, AP',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80',
    depthOffset: 'translateZ(40px)',
    rotation: 'rotate-6',
    delay: 'animate-float-slow',
    badge: 'Pit-Loom Pure Cotton',
  },
  {
    id: 'bamboo',
    name: 'Lattice Fruit Basket',
    craft: 'Majuli Bamboo Craft',
    region: 'Majuli Island, Assam',
    image: 'https://images.unsplash.com/photo-1584589167171-541ce45f1eea?w=600&auto=format&fit=crop&q=80',
    depthOffset: 'translateZ(75px)',
    rotation: '-rotate-6',
    delay: 'animate-float-delayed',
    badge: 'Eco Wild-Harvested',
  },
  {
    id: 'metal',
    name: 'Engraved Peacock Diya',
    craft: 'Moradabad Metal Craft',
    region: 'Moradabad, UP',
    image: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?w=600&auto=format&fit=crop&q=80',
    depthOffset: 'translateZ(105px)',
    rotation: 'rotate-3',
    delay: 'animate-float-slow',
    badge: 'Lost-Wax Cast Brass',
  },
];

export const FloatingCraftHero3D: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeCraft, setActiveCraft] = useState<CraftItem3D>(FLOATING_CRAFTS[0]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20; // -10deg to 10deg
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -20;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-[520px] lg:h-[600px] flex items-center justify-center perspective-1000 select-none overflow-hidden"
    >
      {/* Ambient background glow & radial mandala decoration */}
      <div className="absolute inset-0 bg-radial-gradient pointer-events-none flex items-center justify-center opacity-40">
        <div className="w-[500px] h-[500px] rounded-full border border-heritage-gold/30 animate-spin-slow" />
        <div className="absolute w-[360px] h-[360px] rounded-full border border-dashed border-heritage-terracotta/30" />
      </div>

      {/* 3D Perspective Container */}
      <div
        style={{
          transform: `rotateX(${mousePos.y}deg) rotateY(${mousePos.x}deg)`,
          transition: 'transform 0.15s ease-out',
        }}
        className="relative w-full max-w-[540px] h-[480px] preserve-3d flex items-center justify-center"
      >
        {/* Center Main Spotlight Stage */}
        <div
          style={{ transform: 'translateZ(120px)' }}
          className="relative z-30 w-72 sm:w-80 bg-white/95 rounded-3xl p-4 shadow-3d-lg border-2 border-heritage-gold/50 backdrop-blur-xl transition-all duration-300"
        >
          <div className="relative h-64 rounded-2xl overflow-hidden shadow-inner group">
            <img
              src={activeCraft.image}
              alt={activeCraft.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute top-3 left-3 bg-heritage-brown/90 backdrop-blur-md text-heritage-gold-light text-[10px] font-bold px-2.5 py-1 rounded-full border border-heritage-gold/40 flex items-center space-x-1 shadow-sm">
              <Sparkles className="w-3 h-3 text-heritage-gold" />
              <span>{activeCraft.badge}</span>
            </div>

            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-heritage-brown-dark via-heritage-brown/60 to-transparent p-3 pt-6 text-white">
              <p className="text-xs uppercase tracking-wider font-semibold text-heritage-gold-light">
                {activeCraft.craft}
              </p>
              <h3 className="font-serif font-bold text-lg leading-tight">
                {activeCraft.name}
              </h3>
              <p className="text-[11px] text-white/80 font-medium">
                {activeCraft.region}
              </p>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between px-1">
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-bold text-heritage-brown">
                AI Vision Verified
              </span>
            </div>
            <Link
              to="/marketplace"
              className="inline-flex items-center text-xs font-bold text-heritage-terracotta hover:text-heritage-terracotta-dark transition"
            >
              <span>Explore</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>
        </div>

        {/* Orbiting 3D Floating Handicraft Cards (The 5 Mandatory Crafts) */}
        
        {/* 1. Wooden sculpture (Top Left) */}
        <div
          onClick={() => setActiveCraft(FLOATING_CRAFTS[0])}
          style={{ transform: 'translate3d(-140px, -110px, 50px)' }}
          className="absolute z-20 cursor-pointer group hover:scale-110 transition-all duration-300"
        >
          <div className="w-32 sm:w-36 bg-white/90 backdrop-blur-md p-2 rounded-2xl shadow-3d border border-heritage-terracotta/30 rotate-[-6deg] hover:rotate-0">
            <div className="h-24 rounded-xl overflow-hidden">
              <img
                src={FLOATING_CRAFTS[0].image}
                alt="Wood Craft"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-[11px] font-bold text-heritage-brown mt-1 truncate">
              Wood Sculpture
            </p>
            <p className="text-[9px] text-heritage-terracotta font-medium">
              Warangal Teak
            </p>
          </div>
        </div>

        {/* 2. Pottery (Top Right) */}
        <div
          onClick={() => setActiveCraft(FLOATING_CRAFTS[1])}
          style={{ transform: 'translate3d(145px, -120px, 80px)' }}
          className="absolute z-20 cursor-pointer group hover:scale-110 transition-all duration-300"
        >
          <div className="w-32 sm:w-36 bg-white/90 backdrop-blur-md p-2 rounded-2xl shadow-3d border border-heritage-gold/40 rotate-[6deg] hover:rotate-0">
            <div className="h-24 rounded-xl overflow-hidden">
              <img
                src={FLOATING_CRAFTS[1].image}
                alt="Pottery"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-[11px] font-bold text-heritage-brown mt-1 truncate">
              Blue Pottery
            </p>
            <p className="text-[9px] text-heritage-terracotta font-medium">
              Jaipur Cobalt Urn
            </p>
          </div>
        </div>

        {/* 3. Handloom (Bottom Left) */}
        <div
          onClick={() => setActiveCraft(FLOATING_CRAFTS[2])}
          style={{ transform: 'translate3d(-150px, 120px, 60px)' }}
          className="absolute z-20 cursor-pointer group hover:scale-110 transition-all duration-300"
        >
          <div className="w-32 sm:w-36 bg-white/90 backdrop-blur-md p-2 rounded-2xl shadow-3d border border-heritage-green/40 rotate-[-4deg] hover:rotate-0">
            <div className="h-24 rounded-xl overflow-hidden">
              <img
                src={FLOATING_CRAFTS[2].image}
                alt="Handloom"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-[11px] font-bold text-heritage-brown mt-1 truncate">
              Handloom Saree
            </p>
            <p className="text-[9px] text-heritage-green-light font-medium">
              Mangalagiri Pit-Loom
            </p>
          </div>
        </div>

        {/* 4. Bamboo Craft (Bottom Right) */}
        <div
          onClick={() => setActiveCraft(FLOATING_CRAFTS[3])}
          style={{ transform: 'translate3d(140px, 110px, 70px)' }}
          className="absolute z-20 cursor-pointer group hover:scale-110 transition-all duration-300"
        >
          <div className="w-32 sm:w-36 bg-white/90 backdrop-blur-md p-2 rounded-2xl shadow-3d border border-amber-600/30 rotate-[5deg] hover:rotate-0">
            <div className="h-24 rounded-xl overflow-hidden">
              <img
                src={FLOATING_CRAFTS[3].image}
                alt="Bamboo Craft"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-[11px] font-bold text-heritage-brown mt-1 truncate">
              Bamboo & Cane
            </p>
            <p className="text-[9px] text-heritage-terracotta font-medium">
              Majuli Island
            </p>
          </div>
        </div>

        {/* 5. Metal Craft (Floating Center-Top Crown) */}
        <div
          onClick={() => setActiveCraft(FLOATING_CRAFTS[4])}
          style={{ transform: 'translate3d(0px, -180px, 110px)' }}
          className="absolute z-10 cursor-pointer group hover:scale-110 transition-all duration-300 hidden sm:block"
        >
          <div className="w-28 bg-heritage-brown text-white p-2 rounded-2xl shadow-3d border border-heritage-gold/60">
            <div className="h-16 rounded-lg overflow-hidden">
              <img
                src={FLOATING_CRAFTS[4].image}
                alt="Metal Craft"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-[10px] font-bold text-heritage-gold mt-1 truncate text-center">
              Moradabad Brass
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
