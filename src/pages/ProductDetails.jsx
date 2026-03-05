import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import './ProductDetails.css';

const menuItems = [
  { id: 1, name: 'Kacchi Biryani', category: 'Rice & Curry', price: 350, description: 'Fragrant basmati rice cooked with tender mutton, aromatic spices, and caramelized onions. A signature dish that captures the authentic flavors of Rangpur.', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500', badges: ['Chef\'s Pick ⭐'], veg: false, spicy: false },
  { id: 2, name: 'Chicken Biryani', category: 'Rice & Curry', price: 280, description: 'Delicious basmati rice layered with spiced chicken, boiled eggs, and fresh herbs. Cooked in traditional dum style for authentic taste.', image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=500', badges: ['Popular 🔥'], veg: false, spicy: false },
  { id: 3, name: 'Beef Bhuna', category: 'Rice & Curry', price: 320, description: 'Tender beef slow-cooked in a rich gravy of tomatoes, onions, and traditional spices. Perfect with steamed rice or paratha.', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500', badges: ['Spicy 🌶️'], veg: false, spicy: true },
  { id: 4, name: 'Mutton Curry', category: 'Rice & Curry', price: 380, description: 'Classic Bangladeshi mutton curry cooked with potatoes, onions, and a blend of seven spices. Rich, flavorful, and authentic.', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500', badges: ['Chef\'s Pick ⭐'], veg: false, spicy: false },
  { id: 5, name: 'Grilled Chicken', category: 'Grills', price: 450, description: 'Juicy chicken marinated in yogurt and spices, grilled to perfection. Served with grilled vegetables and mint chutney.', image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=500', badges: ['Popular 🔥'], veg: false, spicy: false },
  { id: 6, name: 'Tandoori Chicken', category: 'Grills', price: 420, description: 'Whole chicken marinated in tandoori masala and yogurt, cooked in traditional clay oven. smoky, tender, and full of flavor.', image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=500', badges: ['Chef\'s Pick ⭐'], veg: false, spicy: false },
  { id: 7, name: 'Seekh Kebab', category: 'Grills', price: 280, description: 'Minced meat mixed with onions, coriander, and spices, grilled on skewers. Perfect appetizer with rumali roti.', image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500', badges: [], veg: false, spicy: false },
  { id: 8, name: 'Chicken Shawarma', category: 'Grills', price: 250, description: 'Sliced chicken wrapped in fresh pita bread with vegetables, garlic sauce, and pickles. A Middle Eastern delight.', image: 'https://images.unsplash.com/photo-1561651823-34feb02250e4?w=500', badges: ['Popular 🔥'], veg: false, spicy: false },
  { id: 9, name: 'Classic Cheese Burger', category: 'Burgers', price: 220, description: 'Juicy beef patty with melted cheese, fresh lettuce, tomato, and special sauce. Served with crispy fries.', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500', badges: ['Popular 🔥'], veg: false, spicy: false },
  { id: 10, name: 'Chicken Burger', category: 'Burgers', price: 200, description: 'Grilled chicken patty with mayo, lettuce, and tomato in a toasted bun. Light and delicious.', image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=500', badges: [], veg: false, spicy: false },
  { id: 11, name: 'Double Patty Burger', category: 'Burgers', price: 320, description: 'Two beef patties with cheese, bacon, and special sauce. For those who want extra indulgence.', image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=500', badges: ['Chef\'s Pick ⭐'], veg: false, spicy: false },
  { id: 12, name: 'Veggie Burger', category: 'Burgers', price: 180, description: 'Crispy vegetable patty with lettuce, tomato, and tangy sauce. A delicious vegetarian option.', image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=500', badges: ['Veg ✅'], veg: true, spicy: false },
  { id: 13, name: 'Chicken Chowmein', category: 'Noodles', price: 200, description: 'Stir-fried noodles with chicken, vegetables, and soy sauce. A classic Indo-Chinese favorite.', image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500', badges: ['Popular 🔥'], veg: false, spicy: false },
  { id: 14, name: 'Egg Chowmein', category: 'Noodles', price: 170, description: 'Noodles stir-fried with eggs, vegetables, and aromatic spices. Simple yet satisfying.', image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=500', badges: [], veg: false, spicy: false },
  { id: 15, name: 'Vegetable Chowmein', category: 'Noodles', price: 150, description: 'Crispy noodles with fresh seasonal vegetables and tangy sauce. Light and flavorful.', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500', badges: ['Veg ✅'], veg: true, spicy: false },
  { id: 16, name: 'Chicken Thai Curry', category: 'Noodles', price: 280, description: 'Thai-style curry with chicken, coconut milk, and vegetables. Served with steamed rice.', image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=500', badges: ['Chef\'s Pick ⭐'], veg: false, spicy: true },
  { id: 17, name: 'Fresh Lime Juice', category: 'Drinks', price: 50, description: 'Refreshing lime juice with a hint of mint. Perfect to beat the heat.', image: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=500', badges: ['Veg ✅'], veg: true, spicy: false },
  { id: 18, name: 'Mango Lassi', category: 'Drinks', price: 80, description: 'Sweet yogurt drink blended with ripe mango. Creamy, refreshing, and beloved by all ages.', image: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=500', badges: ['Popular 🔥', 'Veg ✅'], veg: true, spicy: false },
  { id: 19, name: 'Cold Coffee', category: 'Drinks', price: 120, description: 'Creamy cold coffee with ice and frothy milk. Perfect caffeine kick for hot days.', image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500', badges: ['Veg ✅'], veg: true, spicy: false },
  { id: 20, name: 'Soft Drinks', category: 'Drinks', price: 40, description: 'Choose from Coca-Cola, Pepsi, or Sprite. Ice cold and refreshing.', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500', badges: ['Veg ✅'], veg: true, spicy: false },
  { id: 21, name: 'Gulab Jamun', category: 'Desserts', price: 60, description: 'Soft milk dumplings soaked in rose-flavored sugar syrup. A classic Indian dessert.', image: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?w=500', badges: ['Popular 🔥', 'Veg ✅'], veg: true, spicy: false },
  { id: 22, name: 'Rasgulla', category: 'Desserts', price: 50, description: 'Spongy cottage cheese balls in light sugar syrup. Delicate and delicious.', image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500', badges: ['Veg ✅'], veg: true, spicy: false },
  { id: 23, name: 'Ice Cream (Scoop)', category: 'Desserts', price: 80, description: 'Choose from Vanilla, Chocolate, or Strawberry. Creamy and indulgent.', image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=500', badges: ['Veg ✅'], veg: true, spicy: false },
  { id: 24, name: 'Fruit Cocktail', category: 'Desserts', price: 120, description: 'Fresh seasonal fruits served with a scoop of ice cream. Light and refreshing.', image: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=500', badges: ['Popular 🔥', 'Veg ✅'], veg: true, spicy: false },
];

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const foundProduct = menuItems.find(item => item.id === parseInt(id));
    setProduct(foundProduct);
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      showToast(`Added ${quantity} × ${product.name} to cart! 🛒`);
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addToCart(product, quantity);
      showToast(`Added ${quantity} × ${product.name} to cart! 🛒`);
      navigate('/order');
    }
  };

  if (!product) {
    return (
      <div className="product-details-page">
        <div className="product-not-found">
          <div className="not-found-icon">🍽️</div>
          <h2>Product Not Found</h2>
          <p>The dish you're looking for doesn't exist or has been removed.</p>
          <button className="clay-btn primary" onClick={() => navigate('/menu')}>
            Browse Menu
          </button>
        </div>
      </div>
    );
  }

  const relatedProducts = menuItems
    .filter(item => item.category === product.category && item.id !== product.id)
    .slice(0, 4);

  return (
    <div className="product-details-page">
      <div className="product-details-container">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <span>←</span> Back
        </button>

        <div className="product-main">
          <div className="product-gallery">
            <div className="main-image-container">
              <div className="main-image-frame">
                <img src={product.image} alt={product.name} />
              </div>
              {product.badges && product.badges.length > 0 && (
                <div className="product-badges">
                  {product.badge && <span className="badge highlight">{product.badge}</span>}
                  {product.badges.map((badge, index) => (
                    <span key={index} className="badge">{badge}</span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="product-info">
            <div className="product-category">{product.category}</div>
            <h1 className="product-title">{product.name}</h1>
            
            <div className="product-price">
              <span className="price-amount">BDT {product.price}</span>
              <span className="price-per">per portion</span>
            </div>

            <div className="product-tags">
              {product.veg && <span className="tag veg">✅ Veg</span>}
              {product.spicy && <span className="tag spicy">🌶️ Spicy</span>}
              {product.badges && product.badges.map((badge, idx) => (
                <span key={idx} className="tag badge-tag">{badge}</span>
              ))}
            </div>

            <div className="product-description">
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>

            <div className="product-quantity">
              <h3>Quantity</h3>
              <div className="quantity-selector">
                <button 
                  className="qty-btn"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                >
                  −
                </button>
                <span className="qty-value">{quantity}</span>
                <button 
                  className="qty-btn"
                  onClick={() => setQuantity(q => q + 1)}
                >
                  +
                </button>
              </div>
            </div>

            <div className="product-actions">
              <button className="clay-btn secondary" onClick={handleAddToCart}>
                🛒 Add to Cart
              </button>
              <button className="clay-btn primary" onClick={handleBuyNow}>
                ⚡ Buy Now
              </button>
            </div>

            <div className="product-meta">
              <div className="meta-item">
                <span className="meta-icon">🚚</span>
                <span>Free delivery on orders above BDT 300</span>
              </div>
              <div className="meta-item">
                <span className="meta-icon">⏱️</span>
                <span>Preparation time: 15-20 mins</span>
              </div>
              <div className="meta-item">
                <span className="meta-icon">📞</span>
                <span>Order: 01744-750870</span>
              </div>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="related-products">
            <h2>You Might Also Like</h2>
            <div className="related-grid">
              {relatedProducts.map(item => (
                <div 
                  key={item.id} 
                  className="related-card"
                  onClick={() => navigate(`/product/${item.id}`)}
                >
                  <div className="related-image">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="related-info">
                    <h4>{item.name}</h4>
                    <span className="related-price">BDT {item.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
