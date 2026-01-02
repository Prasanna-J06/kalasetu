
import React, { useState } from 'react';
import { Product } from '../types';
import ProductListingForm from './ProductListingForm';
import VoiceAssistant from './VoiceAssistant';

interface ArtisanPortalProps {
  onBack: () => void;
  onAddProduct: (p: Product) => void;
  products: Product[];
}

const ArtisanPortal: React.FC<ArtisanPortalProps> = ({ onBack, onAddProduct, products }) => {
  const [showListing, setShowListing] = useState(false);
  const totalEarnings = products.reduce((acc, p) => acc + p.price, 0) * 0.8; // Simulated

  return (
    <div className="min-h-screen pb-24">
      <div className="bg-[#8B4513] text-white p-6 pb-12 rounded-b-3xl shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <button onClick={onBack} className="p-2 -ml-2"><i className="fas fa-chevron-left text-xl"></i></button>
          <h2 className="text-xl font-bold">Namaste, Amit</h2>
          <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center text-[#8B4513]">
             <i className="fas fa-user"></i>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
            <p className="text-sm opacity-80">Earnings</p>
            <p className="text-2xl font-bold">$ {totalEarnings.toFixed(2)}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
            <p className="text-sm opacity-80">Products</p>
            <p className="text-2xl font-bold">{products.length}</p>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-6">
        <button 
          onClick={() => setShowListing(true)}
          className="w-full bg-[#E67E22] text-white py-4 rounded-2xl shadow-lg flex items-center justify-center space-x-3 font-bold text-lg active:scale-95 transition-transform"
        >
          <i className="fas fa-plus-circle"></i>
          <span>List New Product</span>
        </button>
      </div>

      <div className="p-6">
        <h3 className="text-lg font-bold text-[#8B4513] mb-4">Your Recent Craftwork</h3>
        {products.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-[#8B4513]/20">
            <p className="text-gray-500">No products listed yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {products.map(p => (
              <div key={p.id} className="bg-white p-3 rounded-2xl shadow-sm border border-orange-50 flex space-x-4">
                <img src={p.imageUrl} className="w-20 h-20 rounded-xl object-cover" />
                <div className="flex-1">
                  <h4 className="font-bold text-[#8B4513]">{p.name}</h4>
                  <p className="text-sm text-gray-500">{p.category}</p>
                  <p className="text-[#E67E22] font-bold mt-1">${p.price}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <VoiceAssistant />

      {showListing && (
        <div className="fixed inset-0 z-50 bg-[#FDFBF7] overflow-y-auto">
          <ProductListingForm 
            onClose={() => setShowListing(false)} 
            onSave={(p) => {
              onAddProduct(p);
              setShowListing(false);
            }} 
          />
        </div>
      )}
    </div>
  );
};

export default ArtisanPortal;
