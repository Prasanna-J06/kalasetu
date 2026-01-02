
import React, { useState, useEffect } from 'react';
import { UserRole, Product, Language } from './types';
import RoleSelector from './components/RoleSelector';
import LanguageSelector from './components/LanguageSelector';
import ArtisanPortal from './components/ArtisanPortal';
import BuyerPortal from './components/BuyerPortal';

const App: React.FC = () => {
  const [role, setRole] = useState<UserRole>(null);
  const [lang, setLang] = useState<Language | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedProducts = localStorage.getItem('kala_products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      const defaultProducts: Product[] = [
        {
          id: '1',
          name: 'Warli Painted Terracotta Pot',
          category: 'Pottery',
          price: 35,
          originalPrice: 45,
          description: 'Hand-painted pot with traditional Warli art from Maharashtra. Features intricate patterns of daily tribal life.',
          artisanName: 'Savita Devi',
          location: 'Palghar, India',
          imageUrl: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=800',
          story: 'Warli art is a sacred tradition of the tribal people living in the mountains. This pot tells the story of the harvest dance and the circle of life.',
          createdAt: Date.now()
        },
        {
          id: '2',
          name: 'Blue Pottery Vase',
          category: 'Pottery',
          price: 42,
          description: 'Exquisite Jaipur blue pottery vase with traditional floral motifs.',
          artisanName: 'Ram Singh',
          location: 'Jaipur, Rajasthan',
          imageUrl: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=800',
          story: 'Jaipur Blue Pottery is unique because it is made of Egyptian paste, not clay.',
          createdAt: Date.now()
        },
        {
          id: '3',
          name: 'Black Clay Cooking Pot',
          category: 'Pottery',
          price: 28,
          description: 'Handcrafted black clay pot from Longpi, Manipur. Retains heat perfectly for traditional cooking.',
          artisanName: 'Vungneihoi',
          location: 'Longpi, Manipur',
          imageUrl: 'https://images.unsplash.com/photo-1604071302894-3a5250428d00?auto=format&fit=crop&q=80&w=800',
          story: 'Longpi pottery is made without a pottery wheel, using a mixture of serpentinite stone and clay.',
          createdAt: Date.now()
        },
        {
          id: '4',
          name: 'Glazed Ceramic Pitcher',
          category: 'Pottery',
          price: 30,
          description: 'Modern minimalist glazed pitcher handcrafted by rural artisans.',
          artisanName: 'Kiran Patel',
          location: 'Kutch, Gujarat',
          imageUrl: 'https://images.unsplash.com/photo-1590422443081-379e4d1d9482?auto=format&fit=crop&q=80&w=800',
          story: 'A blend of traditional firing techniques with modern utility designs.',
          createdAt: Date.now()
        },
        {
          id: '5',
          name: 'Dhokra Brass Elephant',
          category: 'Jewelry',
          price: 95,
          originalPrice: 120,
          description: 'Lost-wax casting metal craft from Chhattisgarh. A sturdy and detailed elephant figure symbolizing wisdom.',
          artisanName: 'Babulal Netam',
          location: 'Bastar, India',
          imageUrl: 'https://images.unsplash.com/photo-1590424753042-3e7465ef444a?auto=format&fit=crop&q=80&w=800',
          story: 'Dhokra craft dates back 4000 years to the Indus Valley Civilization. Each piece is unique as the wax mold is broken after casting.',
          createdAt: Date.now() - 86400000
        },
        {
          id: '6',
          name: 'Pattachitra Silk Scroll',
          category: 'Painting',
          price: 150,
          originalPrice: 200,
          description: 'Intricate mythological storytelling on pure silk using natural mineral colors.',
          artisanName: 'Ranjan Mahapatra',
          location: 'Raghurajpur, Odisha',
          imageUrl: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&q=80&w=800',
          story: 'Pattachitra is a traditional cloth-based scroll painting. The name comes from the Sanskrit words Patta (canvas) and Chitra (picture).',
          createdAt: Date.now() - 172800000
        }
      ];
      setProducts(defaultProducts);
      localStorage.setItem('kala_products', JSON.stringify(defaultProducts));
    }
    setLoading(false);
  }, []);

  const handleAddProduct = (newProduct: Product) => {
    const updated = [newProduct, ...products];
    setProducts(updated);
    localStorage.setItem('kala_products', JSON.stringify(updated));
  };

  const handleReset = () => {
    setRole(null);
    setLang(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B4513]"></div>
      </div>
    );
  }

  // Step 1: Language Selection
  if (!lang) {
    return (
      <div className="max-w-md mx-auto min-h-screen bg-[#FDFBF7] shadow-xl relative overflow-hidden flex flex-col">
        <LanguageSelector onSelect={setLang} />
      </div>
    );
  }

  // Step 2: Role Selection
  if (!role) {
    return (
      <div className="max-w-md mx-auto min-h-screen bg-[#FDFBF7] shadow-xl relative overflow-hidden flex flex-col">
        <RoleSelector 
          onSelect={setRole} 
          onBack={() => setLang(null)} 
          lang={lang}
        />
      </div>
    );
  }

  // Step 3: Main Portal
  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#FDFBF7] shadow-xl relative overflow-hidden flex flex-col">
      {role === 'ARTISAN' && (
        <ArtisanPortal 
          onBack={handleReset} 
          onAddProduct={handleAddProduct}
          products={products.filter(p => p.artisanName === 'Amit the Artisan')}
        />
      )}
      {role === 'BUYER' && (
        <BuyerPortal 
          products={products} 
          onBack={handleReset} 
        />
      )}
    </div>
  );
};

export default App;
