import React from 'react';
import { useCart } from '../context/CartContext'; // Assurez-vous que ce chemin est correct
import FeatureRow from './FeatureRow';

const TarifsContent = () => {
  const { addToCart, productDetails } = useCart(); // Utilisez productDetails depuis useCart

  const handleAddToCart = (productId) => {
    const product = productDetails[productId];
    if (product) {
      addToCart({ ...product, id: productId }); // Utilisez productDetails pour obtenir les informations du produit
      alert(`Service ${product.name} ajouté au panier`);
    } else {
      alert('Produit non trouvé!');
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <h2 className="text-center text-4xl font-extrabold text-white mb-12">
        Voici les options disponibles
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Object.entries(productDetails).map(([productId, product]) => (
          <div key={productId} className="bg-white rounded-lg shadow overflow-hidden transform transition duration-500 hover:scale-105">
            <img src={product.imgUrl} alt={`Service ${product.name}`} className="w-full h-40 object-cover" />
            <div className="p-4 space-y-2">
              {product.features.map((feature, index) => (
                <FeatureRow key={index} title={feature} imgSrc="/check.png" />
              ))}
            </div>
            <button
              type="button"
              onClick={() => handleAddToCart(productId)}
              className="bg-green-500 text-white text-sm px-4 py-2 rounded hover:bg-green-600 transition-colors duration-300 w-full"
            >
              Ajouter au panier
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TarifsContent;
