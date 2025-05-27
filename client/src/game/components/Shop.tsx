import { useState } from "react";
import { usePlayerStore } from "../stores/usePlayerStore";
import { useGameStore } from "../stores/useGameStore";
import { SHOP_ITEMS } from "../constants";
import { InventoryItem } from "../types";

const Shop = () => {
  const [activeTab, setActiveTab] = useState<string>("food");
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  const { player, addItem, updateCoins } = usePlayerStore();
  const coins = player?.coins || 0;
  const { closeShop } = useGameStore();

  const tabs = [
    { id: "food", name: "Food", items: SHOP_ITEMS.food },
    { id: "toys", name: "Toys", items: SHOP_ITEMS.toys },
    { id: "medicine", name: "Medicine", items: SHOP_ITEMS.medicine },
    { id: "accessories", name: "Accessories", items: SHOP_ITEMS.accessories },
  ];

  const handlePurchase = (item: InventoryItem) => {
    if (coins >= item.price) {
      setSelectedItem(item);
      setShowConfirmation(true);
    } else {
      alert(`You need ${item.price - coins} more coins to buy this item!`);
    }
  };

  const confirmPurchase = () => {
    if (selectedItem && coins >= selectedItem.price) {
      // Deduct coins
      updateCoins(-selectedItem.price);
      
      // Add item to inventory
      addItem(selectedItem);
      
      alert(`You bought ${selectedItem.name}! Check your inventory.`);
      setShowConfirmation(false);
      setSelectedItem(null);
    }
  };

  const cancelPurchase = () => {
    setShowConfirmation(false);
    setSelectedItem(null);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#f0f8ff',
        borderRadius: '20px',
        padding: '30px',
        maxWidth: '800px',
        maxHeight: '600px',
        width: '90%',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        border: '3px solid #4FC3F7'
      }}>
        {/* Shop Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '20px',
          borderBottom: '2px solid #4FC3F7',
          paddingBottom: '15px'
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            color: '#4FC3F7',
            margin: '0 0 10px 0',
            fontFamily: 'Comic Sans MS, cursive'
          }}>
            🏪 Pet Shop
          </h1>
          <div style={{
            fontSize: '1.4rem',
            color: '#333',
            fontWeight: 'bold'
          }}>
            💰 Your Coins: {coins}
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          marginBottom: '20px',
          gap: '10px',
          justifyContent: 'center'
        }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '10px 20px',
                border: 'none',
                borderRadius: '15px',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                backgroundColor: activeTab === tab.id ? '#4FC3F7' : '#e0e0e0',
                color: activeTab === tab.id ? 'white' : '#666',
                transition: 'all 0.3s ease'
              }}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {/* Shop Items */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '15px',
          maxHeight: '300px',
          overflowY: 'auto',
          padding: '10px'
        }}>
          {tabs.find(tab => tab.id === activeTab)?.items.map((item) => (
            <div
              key={item.id}
              style={{
                backgroundColor: 'white',
                border: '2px solid #ddd',
                borderRadius: '15px',
                padding: '15px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s ease, border-color 0.2s ease',
                userSelect: 'none'
              }}
              onClick={() => {
                console.log('Clicked item:', item.name);
                handlePurchase(item);
              }}
            >
              <h3 style={{
                fontSize: '1.2rem',
                color: '#333',
                margin: '0 0 8px 0'
              }}>
                {item.name}
              </h3>
              <p style={{
                fontSize: '0.9rem',
                color: '#666',
                margin: '0 0 10px 0',
                minHeight: '40px'
              }}>
                {item.description}
              </p>
              <div style={{
                fontSize: '1.3rem',
                fontWeight: 'bold',
                color: coins >= item.price ? '#4CAF50' : '#f44336'
              }}>
                💰 {item.price} coins
              </div>
            </div>
          ))}
        </div>

        {/* Close Button */}
        <div style={{
          textAlign: 'center',
          marginTop: '20px'
        }}>
          <button
            onClick={closeShop}
            style={{
              padding: '12px 30px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '25px',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Close Shop
          </button>
        </div>

        {/* Purchase Confirmation Modal */}
        {showConfirmation && selectedItem && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '20px'
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '30px',
              borderRadius: '20px',
              textAlign: 'center',
              minWidth: '300px'
            }}>
              <h2 style={{ color: '#333', marginBottom: '15px' }}>
                Confirm Purchase
              </h2>
              <p style={{ fontSize: '1.1rem', marginBottom: '10px' }}>
                <strong>{selectedItem.name}</strong>
              </p>
              <p style={{ color: '#666', marginBottom: '20px' }}>
                Cost: {selectedItem.price} coins
              </p>
              <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                <button
                  onClick={confirmPurchase}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '15px',
                    fontSize: '1.1rem',
                    cursor: 'pointer'
                  }}
                >
                  ✅ Buy It!
                </button>
                <button
                  onClick={cancelPurchase}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#f44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: '15px',
                    fontSize: '1.1rem',
                    cursor: 'pointer'
                  }}
                >
                  ❌ Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;