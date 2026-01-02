
import React, { useState } from 'react';
import { Product } from '../types';

interface BuyerPortalProps {
  products: Product[];
  onBack: () => void;
}

type BuyerStep = 'CATEGORY_INTEREST' | 'BROWSING' | 'CHECKOUT_ADDRESS' | 'CHECKOUT_PAYMENT' | 'ORDER_SUCCESS' | 'ORDER_HISTORY';

interface OrderRecord {
  id: string;
  trackingId: string;
  product: Product;
  date: number;
  status: 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered';
}

const BuyerPortal: React.FC<BuyerPortalProps> = ({ products, onBack }) => {
  const [step, setStep] = useState<BuyerStep>('CATEGORY_INTEREST');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [checkoutProduct, setCheckoutProduct] = useState<Product | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [latestOrder, setLatestOrder] = useState<OrderRecord | null>(null);
  
  // Checkout Form State
  const [address, setAddress] = useState({ name: '', phone: '', street: '', city: '', zip: '' });
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'Online' | null>(null);

  const categories = ['Pottery', 'Textiles', 'Jewelry', 'Painting', 'Woodwork'];

  const toggleInterest = (cat: string) => {
    setSelectedInterests(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => 
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const handleBuyNow = (product: Product) => {
    setCheckoutProduct(product);
    setViewingProduct(null);
    setStep('CHECKOUT_ADDRESS');
  };

  const generateTrackingId = () => {
    return `KS-${Math.floor(100000 + Math.random() * 900000)}`;
  };

  const placeOrder = () => {
    if (!checkoutProduct) return;
    const newOrder: OrderRecord = {
      id: Date.now().toString(),
      trackingId: generateTrackingId(),
      product: checkoutProduct,
      date: Date.now(),
      status: 'Processing'
    };
    setOrders([newOrder, ...orders]);
    setLatestOrder(newOrder);
    setStep('ORDER_SUCCESS');
  };

  const filteredProducts = selectedInterests.length === 0 
    ? products 
    : products.filter(p => selectedInterests.includes(p.category));

  if (step === 'CATEGORY_INTEREST') {
    return (
      <div className="min-h-screen bg-[#FDFBF7] p-8 flex flex-col justify-center">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-[#8B4513] rounded-[2rem] mx-auto mb-6 flex items-center justify-center shadow-xl rotate-3">
             <span className="text-white text-3xl font-black">KS</span>
          </div>
          <h2 className="text-3xl font-black text-[#8B4513] serif mb-2">Tailor Your Bazaar</h2>
          <p className="text-[#A0522D] text-sm font-medium">Which categories interest you today?</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-12">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => toggleInterest(cat)}
              className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center justify-center space-y-2 ${
                selectedInterests.includes(cat) 
                ? 'bg-[#8B4513] border-[#8B4513] text-white shadow-lg scale-105' 
                : 'bg-white border-orange-50 text-[#8B4513] hover:border-orange-200'
              }`}
            >
              <i className={`fas ${
                cat === 'Pottery' ? 'fa-jug-detergent' : 
                cat === 'Textiles' ? 'fa-shirt' : 
                cat === 'Jewelry' ? 'fa-gem' : 
                cat === 'Painting' ? 'fa-palette' : 'fa-tree'
              } text-xl`}></i>
              <span className="font-bold text-xs uppercase tracking-widest">{cat}</span>
            </button>
          ))}
        </div>

        <button 
          onClick={() => setStep('BROWSING')}
          className="w-full bg-[#E67E22] text-white py-6 rounded-[2rem] font-bold text-xl shadow-xl active:scale-95 transition-all"
        >
          {selectedInterests.length > 0 ? `Explore ${selectedInterests.length} Categories` : 'Explore All Crafts'}
        </button>
      </div>
    );
  }

  if (step === 'ORDER_HISTORY') {
    return (
      <div className="min-h-screen bg-[#FDFBF7] pb-24">
        <header className="p-6 bg-white border-b border-orange-50 sticky top-0 z-10 flex items-center">
          <button onClick={() => setStep('BROWSING')} className="w-10 h-10 flex items-center justify-center text-[#8B4513] mr-4"><i className="fas fa-arrow-left"></i></button>
          <h2 className="text-2xl font-black text-[#8B4513] serif">My Orders</h2>
        </header>
        <div className="p-6 space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-20 opacity-40">
              <i className="fas fa-box-open text-4xl mb-4"></i>
              <p className="font-bold">No orders yet.</p>
            </div>
          ) : (
            orders.map(order => (
              <div key={order.id} className="bg-white p-5 rounded-[2.5rem] border border-orange-50 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <img src={order.product.imageUrl} className="w-14 h-14 rounded-2xl object-cover" />
                    <div>
                      <h4 className="font-bold text-[#8B4513] text-sm">{order.product.name}</h4>
                      <p className="text-[10px] text-gray-400">{new Date(order.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className="bg-orange-50 text-[#E67E22] text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-orange-100">{order.status}</span>
                </div>
                <div className="bg-[#FDFBF7] p-3 rounded-2xl flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Tracking ID</span>
                    <span className="font-mono text-xs font-bold text-[#8B4513]">{order.trackingId}</span>
                  </div>
                  <button className="text-[#E67E22] text-xs font-black uppercase tracking-widest">Track <i className="fas fa-chevron-right ml-1"></i></button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  if (step === 'CHECKOUT_ADDRESS') {
    return (
      <div className="min-h-screen bg-[#FDFBF7] p-6">
        <header className="mb-8">
          <button onClick={() => setStep('BROWSING')} className="mb-4 text-[#8B4513] font-bold flex items-center">
            <i className="fas fa-arrow-left mr-2"></i> Back to Bazaar
          </button>
          <h2 className="text-3xl font-black text-[#8B4513] serif">Delivery Details</h2>
          <p className="text-gray-500 text-sm">Where should we send your craft?</p>
        </header>

        <div className="space-y-4">
          <div className="bg-white p-4 rounded-3xl border border-orange-50 flex items-center space-x-4 mb-6 shadow-sm">
            <img src={checkoutProduct?.imageUrl} className="w-16 h-16 rounded-2xl object-cover" />
            <div>
              <p className="font-bold text-[#8B4513]">{checkoutProduct?.name}</p>
              <p className="text-[#E67E22] font-black">${checkoutProduct?.price}</p>
            </div>
          </div>

          <input 
            type="text" placeholder="Full Name" 
            className="w-full bg-white border border-orange-100 rounded-2xl p-4 focus:ring-2 focus:ring-[#8B4513]/20 outline-none"
            value={address.name} onChange={e => setAddress({...address, name: e.target.value})}
          />
          <input 
            type="tel" placeholder="Phone Number" 
            className="w-full bg-white border border-orange-100 rounded-2xl p-4 focus:ring-2 focus:ring-[#8B4513]/20 outline-none"
            value={address.phone} onChange={e => setAddress({...address, phone: e.target.value})}
          />
          <textarea 
            placeholder="Complete Address" 
            className="w-full bg-white border border-orange-100 rounded-2xl p-4 focus:ring-2 focus:ring-[#8B4513]/20 outline-none h-32"
            value={address.street} onChange={e => setAddress({...address, street: e.target.value})}
          />
          <div className="grid grid-cols-2 gap-4">
            <input 
              type="text" placeholder="City" 
              className="w-full bg-white border border-orange-100 rounded-2xl p-4 focus:ring-2 focus:ring-[#8B4513]/20 outline-none"
              value={address.city} onChange={e => setAddress({...address, city: e.target.value})}
            />
            <input 
              type="text" placeholder="Zip Code" 
              className="w-full bg-white border border-orange-100 rounded-2xl p-4 focus:ring-2 focus:ring-[#8B4513]/20 outline-none"
              value={address.zip} onChange={e => setAddress({...address, zip: e.target.value})}
            />
          </div>

          <button 
            disabled={!address.name || !address.street || !address.phone}
            onClick={() => setStep('CHECKOUT_PAYMENT')}
            className="w-full bg-[#8B4513] text-white py-6 rounded-[2rem] font-bold text-xl shadow-xl mt-8 disabled:opacity-50"
          >
            Continue to Payment
          </button>
        </div>
      </div>
    );
  }

  if (step === 'CHECKOUT_PAYMENT') {
    return (
      <div className="min-h-screen bg-[#FDFBF7] p-6">
        <header className="mb-12">
          <button onClick={() => setStep('CHECKOUT_ADDRESS')} className="mb-4 text-[#8B4513] font-bold flex items-center">
            <i className="fas fa-arrow-left mr-2"></i> Back to Address
          </button>
          <h2 className="text-3xl font-black text-[#8B4513] serif">Payment Method</h2>
          <p className="text-gray-500 text-sm">Choose how you want to pay</p>
        </header>

        <div className="space-y-4">
          <button 
            onClick={() => setPaymentMethod('Online')}
            className={`w-full p-6 rounded-[2.5rem] border-2 text-left flex items-center transition-all ${
              paymentMethod === 'Online' ? 'bg-[#8B4513] border-[#8B4513] text-white' : 'bg-white border-orange-50 text-[#8B4513]'
            }`}
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mr-4 ${paymentMethod === 'Online' ? 'bg-white/20' : 'bg-orange-50'}`}>
              <i className="fas fa-credit-card"></i>
            </div>
            <div>
              <p className="font-bold">Online Payment</p>
              <p className="text-xs opacity-60">UPI, Cards, Net Banking</p>
            </div>
          </button>

          <button 
            onClick={() => setPaymentMethod('COD')}
            className={`w-full p-6 rounded-[2.5rem] border-2 text-left flex items-center transition-all ${
              paymentMethod === 'COD' ? 'bg-[#8B4513] border-[#8B4513] text-white' : 'bg-white border-orange-50 text-[#8B4513]'
            }`}
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mr-4 ${paymentMethod === 'COD' ? 'bg-white/20' : 'bg-orange-50'}`}>
              <i className="fas fa-truck"></i>
            </div>
            <div>
              <p className="font-bold">Cash on Delivery</p>
              <p className="text-xs opacity-60">Pay when you receive the craft</p>
            </div>
          </button>

          <div className="mt-12 bg-white p-6 rounded-[2.5rem] shadow-sm border border-orange-50 space-y-3">
             <div className="flex justify-between text-sm">
                <span className="text-gray-400 font-medium uppercase tracking-widest text-[10px]">Product Total</span>
                <span className="font-bold text-[#8B4513]">${checkoutProduct?.price}</span>
             </div>
             <div className="flex justify-between text-sm">
                <span className="text-gray-400 font-medium uppercase tracking-widest text-[10px]">Shipping</span>
                <span className="font-bold text-green-600 uppercase text-[10px]">Free</span>
             </div>
             <div className="h-[1px] bg-orange-50 my-2"></div>
             <div className="flex justify-between items-center">
                <span className="font-black text-[#8B4513] uppercase tracking-[0.2em] text-xs">Final Amount</span>
                <span className="text-2xl font-black text-[#E67E22]">${checkoutProduct?.price}</span>
             </div>
          </div>

          <button 
            disabled={!paymentMethod}
            onClick={placeOrder}
            className="w-full bg-[#E67E22] text-white py-6 rounded-[2rem] font-bold text-xl shadow-2xl mt-8 disabled:opacity-50"
          >
            Place Order
          </button>
        </div>
      </div>
    );
  }

  if (step === 'ORDER_SUCCESS') {
    return (
      <div className="min-h-screen bg-[#FDFBF7] p-8 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl mb-8 animate-bounce shadow-inner">
          <i className="fas fa-check"></i>
        </div>
        <h2 className="text-4xl font-black text-[#8B4513] serif mb-4">Order Placed!</h2>
        <p className="text-[#A0522D] font-medium leading-relaxed mb-6">
          Thank you for supporting {latestOrder?.product.artisanName}. Your unique craft will be delivered soon!
        </p>
        
        <div className="w-full bg-white p-6 rounded-[2.5rem] shadow-sm border border-orange-50 mb-12">
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-2">Your Tracking ID</p>
           <p className="text-2xl font-mono font-black text-[#8B4513]">{latestOrder?.trackingId}</p>
           <div className="h-[1px] bg-orange-50 my-4"></div>
           <button 
            onClick={() => setStep('ORDER_HISTORY')}
            className="text-[#E67E22] text-sm font-bold flex items-center justify-center w-full"
           >
             Track this order <i className="fas fa-arrow-right ml-2"></i>
           </button>
        </div>

        <button 
          onClick={() => {
            setStep('BROWSING');
            setCheckoutProduct(null);
            setPaymentMethod(null);
            setLatestOrder(null);
          }}
          className="w-full bg-[#8B4513] text-white py-6 rounded-[2rem] font-bold text-xl shadow-xl"
        >
          Return to Bazaar
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 bg-[#FDFBF7] relative">
      {/* Profile Drawer Overlay */}
      {isProfileOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity"
          onClick={() => setIsProfileOpen(false)}
        >
          <div 
            className="w-4/5 h-full bg-[#FDFBF7] shadow-2xl p-8 animate-in slide-in-from-left duration-300"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center space-x-3">
                 <div className="w-12 h-12 bg-[#8B4513] rounded-2xl flex items-center justify-center text-white text-xl font-black">KS</div>
                 <h2 className="text-2xl font-black text-[#8B4513] serif">My KalaSetu</h2>
              </div>
              <button onClick={() => setIsProfileOpen(false)} className="text-gray-400 text-xl"><i className="fas fa-times"></i></button>
            </div>

            <div className="space-y-6">
              <button 
                onClick={() => { setStep('ORDER_HISTORY'); setIsProfileOpen(false); }}
                className="w-full flex items-center space-x-5 group"
              >
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#8B4513] shadow-sm border border-orange-50 group-hover:bg-[#8B4513] group-hover:text-white transition-colors">
                  <i className="fas fa-box-open"></i>
                </div>
                <div className="text-left">
                  <p className="font-black text-[#8B4513] text-sm uppercase tracking-widest">My Orders</p>
                  <p className="text-[10px] text-gray-400 font-medium">{orders.length} active orders</p>
                </div>
              </button>

              <button className="w-full flex items-center space-x-5 group">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#8B4513] shadow-sm border border-orange-50 group-hover:bg-[#8B4513] group-hover:text-white transition-colors">
                  <i className="fas fa-heart"></i>
                </div>
                <div className="text-left">
                  <p className="font-black text-[#8B4513] text-sm uppercase tracking-widest">Wishlist</p>
                  <p className="text-[10px] text-gray-400 font-medium">{wishlist.length} saved crafts</p>
                </div>
              </button>

              <button className="w-full flex items-center space-x-5 group">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#8B4513] shadow-sm border border-orange-50 group-hover:bg-[#8B4513] group-hover:text-white transition-colors">
                  <i className="fas fa-ticket"></i>
                </div>
                <div className="text-left">
                  <p className="font-black text-[#8B4513] text-sm uppercase tracking-widest">Coupons</p>
                  <p className="text-[10px] text-gray-400 font-medium">2 active discounts</p>
                </div>
              </button>

              <button className="w-full flex items-center space-x-5 group">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#8B4513] shadow-sm border border-orange-50 group-hover:bg-[#8B4513] group-hover:text-white transition-colors">
                  <i className="fas fa-headset"></i>
                </div>
                <div className="text-left">
                  <p className="font-black text-[#8B4513] text-sm uppercase tracking-widest">Help Center</p>
                  <p className="text-[10px] text-gray-400 font-medium">FAQs & Customer Care</p>
                </div>
              </button>
            </div>

            <div className="absolute bottom-10 left-8 right-8">
               <button 
                onClick={onBack}
                className="w-full py-4 rounded-2xl border border-red-100 text-red-500 font-bold text-sm uppercase tracking-[0.2em] flex items-center justify-center space-x-2"
               >
                 <i className="fas fa-sign-out-alt"></i>
                 <span>Exit Bazaar</span>
               </button>
            </div>
          </div>
        </div>
      )}

      <header className="p-6 sticky top-0 bg-[#FDFBF7]/90 backdrop-blur-md z-10 border-b border-orange-50">
        <div className="flex justify-between items-center mb-6">
          <button onClick={onBack} className="w-10 h-10 flex items-center justify-center text-[#8B4513] bg-white shadow-sm border border-orange-50 rounded-full"><i className="fas fa-chevron-left"></i></button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#8B4513] rounded-lg flex items-center justify-center text-white text-xs font-black">KS</div>
            <h1 className="text-xl font-black text-[#8B4513] tracking-tighter">KalaSetu</h1>
          </div>
          <button className="w-10 h-10 flex items-center justify-center text-[#8B4513] bg-white shadow-sm border border-orange-50 rounded-full relative">
            <i className="fas fa-shopping-cart"></i>
            {(wishlist.length > 0 || orders.length > 0) && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center">{wishlist.length + orders.length}</span>}
          </button>
        </div>
        
        <div className="flex items-center space-x-3 mb-6">
          <button 
            onClick={() => setIsProfileOpen(true)}
            className="w-12 h-12 bg-white border border-orange-100 rounded-2xl flex items-center justify-center text-[#8B4513] shadow-sm active:scale-90 transition-transform"
          >
            <i className="fas fa-user-circle text-xl"></i>
          </button>
          <div className="relative flex-1">
            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-[#8B4513]/30"></i>
            <input 
              type="text" 
              placeholder="Search by craft, region..." 
              className="w-full bg-white border border-[#8B4513]/10 rounded-2xl py-3.5 pl-12 pr-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8B4513]/20 text-[#8B4513] text-sm"
            />
          </div>
        </div>

        <div className="flex space-x-3 overflow-x-auto pb-1 no-scrollbar">
          <button 
            onClick={() => setSelectedInterests([])}
            className={`whitespace-nowrap px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
              selectedInterests.length === 0 
              ? 'bg-[#8B4513] text-white border-[#8B4513] shadow-md' 
              : 'bg-white text-[#8B4513] border-[#8B4513]/10'
            }`}
          >
            All Bazaar
          </button>
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => toggleInterest(cat)}
              className={`whitespace-nowrap px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                selectedInterests.includes(cat) 
                ? 'bg-[#8B4513] text-white border-[#8B4513] shadow-md' 
                : 'bg-white text-[#8B4513] border-[#8B4513]/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      <main className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-black text-[#8B4513] serif">
            {selectedInterests.length === 1 ? `${selectedInterests[0]} Collection` : 'Featured Bazaar'}
          </h3>
          <p className="text-[10px] font-bold text-[#A0522D] opacity-40 uppercase tracking-[0.2em]">{filteredProducts.length} Items</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {filteredProducts.map(product => (
            <div 
              key={product.id} 
              className="group bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-orange-50 flex flex-col active:scale-95 transition-all hover:shadow-xl relative"
            >
              <button 
                onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
                className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  wishlist.includes(product.id) ? 'bg-red-500 text-white' : 'bg-white/50 backdrop-blur-md text-[#8B4513]'
                }`}
              >
                <i className={`fa-heart ${wishlist.includes(product.id) ? 'fas' : 'far'} text-xs`}></i>
              </button>
              <div className="aspect-square overflow-hidden relative" onClick={() => setViewingProduct(product)}>
                <img src={product.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-3 left-3 flex flex-col space-y-2">
                  {product.originalPrice && product.originalPrice > product.price && (
                    <div className="bg-[#E67E22] text-white text-[8px] font-black px-2.5 py-1 rounded-full shadow-lg uppercase tracking-tighter">
                      Save
                    </div>
                  )}
                </div>
              </div>
              <div className="p-4" onClick={() => setViewingProduct(product)}>
                <p className="text-[8px] text-[#A0522D] font-black uppercase tracking-[0.2em] mb-1 opacity-50">{product.category}</p>
                <h3 className="font-bold text-[#8B4513] text-xs leading-tight mb-2 h-7 overflow-hidden line-clamp-2">{product.name}</h3>
                <div className="flex items-center space-x-2">
                  <p className="text-[#E67E22] font-black text-sm">${product.price}</p>
                  {product.originalPrice && (
                    <p className="text-[#8B4513]/30 line-through text-[9px] font-bold">${product.originalPrice}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-orange-100">
             <i className="fas fa-ghost text-[#8B4513]/20 text-4xl mb-4"></i>
             <p className="text-gray-400 font-bold">No crafts found here yet.</p>
          </div>
        )}
      </main>

      {viewingProduct && (
        <div className="fixed inset-0 z-50 bg-[#FDFBF7] overflow-y-auto animate-in slide-in-from-bottom duration-500">
          <div className="relative pb-32">
            <button 
              onClick={() => setViewingProduct(null)}
              className="absolute top-6 left-6 z-10 bg-white/80 backdrop-blur-md p-4 rounded-full text-[#8B4513] shadow-xl border border-white"
            >
              <i className="fas fa-arrow-left text-xl"></i>
            </button>
            <img src={viewingProduct.imageUrl} className="w-full aspect-[4/5] object-cover" />
            
            <div className="p-8 -mt-16 bg-[#FDFBF7] rounded-t-[3.5rem] shadow-[0_-30px_60px_rgba(0,0,0,0.1)] relative">
              <div className="flex justify-between items-start mb-8">
                <div className="flex-1 pr-4">
                  <p className="text-xs font-black text-[#A0522D] uppercase mb-2 tracking-[0.3em] opacity-40">{viewingProduct.category}</p>
                  <h2 className="text-3xl font-bold text-[#8B4513] leading-tight serif">{viewingProduct.name}</h2>
                </div>
                <div className="bg-orange-50 p-5 rounded-[2.5rem] border border-orange-100 text-center shadow-inner">
                  {viewingProduct.originalPrice && viewingProduct.originalPrice > viewingProduct.price && (
                    <p className="text-[#8B4513]/40 line-through text-xs font-bold mb-1">${viewingProduct.originalPrice}</p>
                  )}
                  <p className="text-[#E67E22] font-black text-3xl">${viewingProduct.price}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 mb-10 bg-white p-6 rounded-[2.5rem] shadow-sm border border-orange-50">
                <div className="w-14 h-14 bg-[#8B4513] rounded-2xl flex items-center justify-center text-white text-xl shadow-lg">
                  <i className="fas fa-certificate"></i>
                </div>
                <div>
                  <p className="font-bold text-[#8B4513] text-lg">{viewingProduct.artisanName}</p>
                  <p className="text-xs font-black text-orange-400 uppercase tracking-widest"><i className="fas fa-map-marker-alt mr-1"></i> {viewingProduct.location}</p>
                </div>
              </div>

              <div className="mb-10 p-8 bg-[#8B4513] text-white rounded-[3rem] relative shadow-2xl overflow-hidden">
                 <h4 className="font-bold mb-5 italic serif text-2xl border-b border-white/10 pb-4 flex items-center justify-between">
                   <span className="flex items-center"><i className="fas fa-scroll mr-3 text-orange-200"></i> The Legacy</span>
                 </h4>
                 <p className="leading-relaxed opacity-90 text-sm font-medium italic mb-6">
                   "{viewingProduct.story}"
                 </p>
              </div>

              <div className="mb-12">
                 <h4 className="font-black text-[#8B4513] mb-4 text-xs uppercase tracking-[0.3em] flex items-center">
                    Craft Details
                    <span className="flex-1 h-[1px] bg-orange-100 ml-4"></span>
                 </h4>
                 <p className="text-gray-600 leading-relaxed text-sm">
                   {viewingProduct.description}
                 </p>
              </div>

              <div className="fixed bottom-8 left-6 right-6 max-w-md mx-auto z-20 flex space-x-4">
                <button 
                  onClick={() => toggleWishlist(viewingProduct.id)}
                  className={`w-16 h-16 rounded-[2rem] flex items-center justify-center shadow-xl transition-all ${
                    wishlist.includes(viewingProduct.id) ? 'bg-red-500 text-white' : 'bg-white text-[#8B4513] border border-orange-50'
                  }`}
                >
                  <i className={`fa-heart text-2xl ${wishlist.includes(viewingProduct.id) ? 'fas' : 'far'}`}></i>
                </button>
                <button 
                  onClick={() => handleBuyNow(viewingProduct)}
                  className="flex-1 bg-[#8B4513] text-white py-6 rounded-[2.5rem] font-bold text-xl shadow-[0_25px_50px_rgba(139,69,19,0.4)] flex items-center justify-center space-x-3 active:scale-95 transition-all"
                >
                  <i className="fas fa-bag-shopping"></i>
                  <span>Buy Now</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Persistent Nav */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur-2xl border-t border-gray-100 flex justify-around p-5 rounded-t-[3rem] shadow-[0_-15px_50px_rgba(0,0,0,0.08)] z-10">
        <button className="text-[#8B4513] flex flex-col items-center" onClick={() => setStep('BROWSING')}><i className="fas fa-layer-group text-xl mb-1"></i><span className="text-[9px] font-black uppercase tracking-tighter">Bazaar</span></button>
        <button className="text-gray-300 flex flex-col items-center" onClick={() => setIsProfileOpen(true)}><i className="fas fa-heart text-xl mb-1"></i><span className="text-[9px] font-black uppercase tracking-tighter">Wishlist</span></button>
        <button className="text-gray-300 flex flex-col items-center" onClick={() => { setStep('ORDER_HISTORY'); setIsProfileOpen(false); }}><i className="fas fa-clock-rotate-left text-xl mb-1"></i><span className="text-[9px] font-black uppercase tracking-tighter">Orders</span></button>
        <button className="text-gray-300 flex flex-col items-center" onClick={() => setIsProfileOpen(true)}><i className="fas fa-user text-xl mb-1"></i><span className="text-[9px] font-black uppercase tracking-tighter">Profile</span></button>
      </nav>
    </div>
  );
};

export default BuyerPortal;
