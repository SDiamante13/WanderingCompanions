import React, { useState, useCallback } from "react";
import { usePlayerStore } from "../stores/usePlayerStore";
import { useGameStore } from "../stores/useGameStore";
import { usePetStore } from "../stores/usePetStore";
import { SHOP_ITEMS, PET_OPTIONS } from "../constants";
import { InventoryItem, PetType } from "../types";

const Shop = () => {
  const player = usePlayerStore((state) => state.player);
  const addItem = usePlayerStore((state) => state.addItem);
  const updateCoins = usePlayerStore((state) => state.updateCoins);
  const pet = usePetStore((state) => state.pet);
  const setPetObject = usePetStore((state) => state.setPetObject);
  const updatePetHealth = usePetStore((state) => state.updatePetHealth);
  const updatePetHappiness = usePetStore((state) => state.updatePetHappiness);
  const closeShop = useGameStore((state) => state.closeShop);
  const currentSubLocation = useGameStore((state) => state.currentSubLocation);
  const setSubLocation = useGameStore((state) => state.setSubLocation);
  const coins = player?.coins || 0;

  const subLocations = [
    {
      id: "pets",
      name: "🐾 Pets",
      description: "Adopt new pets and buy accessories",
      color: "bg-pink-500",
      hoverColor: "hover:bg-pink-600"
    },
    {
      id: "vet",
      name: "⚕️ Vet",
      description: "Health services and medical supplies",
      color: "bg-red-500",
      hoverColor: "hover:bg-red-600"
    },
    {
      id: "groceries",
      name: "🍎 Groceries",
      description: "Food items and household supplies",
      color: "bg-green-500",
      hoverColor: "hover:bg-green-600"
    }
  ];

  const handleSubLocationClick = useCallback((subLocationId: string) => {
    setSubLocation(subLocationId);
  }, [setSubLocation]);

  const handleBackToShop = useCallback(() => {
    setSubLocation(null);
  }, [setSubLocation]);

  const PetStore = () => {
    const [selectedPet, setSelectedPet] = useState<any>(null);
    const [showAdoptConfirm, setShowAdoptConfirm] = useState(false);

    const petAccessories = [
      {
        id: "collar_basic",
        name: "Basic Collar",
        description: "A simple collar that increases pet defense by 3",
        price: 25,
        effect: { target: "pet", property: "defense", value: 3 }
      },
      {
        id: "collar_premium",
        name: "Premium Collar",
        description: "A fancy collar that increases pet defense by 5",
        price: 45,
        effect: { target: "pet", property: "defense", value: 5 }
      },
      {
        id: "training_book",
        name: "Training Book",
        description: "Teaches your pet new moves, increases attack by 4",
        price: 35,
        effect: { target: "pet", property: "attack", value: 4 }
      },
      {
        id: "energy_charm",
        name: "Energy Charm",
        description: "A magical charm that increases max health by 10",
        price: 50,
        effect: { target: "pet", property: "maxHealth", value: 10 }
      }
    ];

    const adoptPet = (petOption: any) => {
      const adoptionFee = 100;
      if (coins >= adoptionFee) {
        setSelectedPet(petOption);
        setShowAdoptConfirm(true);
      } else {
        alert(`You need ${adoptionFee - coins} more coins to adopt a pet!`);
      }
    };

    const confirmAdoption = () => {
      if (selectedPet && coins >= 100) {
        updateCoins(-100);
        const newPet = {
          type: selectedPet.type,
          name: selectedPet.name,
          color: selectedPet.colors[0],
          health: selectedPet.baseStats.health,
          maxHealth: selectedPet.baseStats.health,
          attack: selectedPet.baseStats.attack,
          defense: selectedPet.baseStats.defense,
          happiness: selectedPet.baseStats.happiness,
          specialAbility: selectedPet.specialAbility
        };
        setPetObject(newPet);
        alert(`Welcome your new pet ${selectedPet.name}!`);
        setShowAdoptConfirm(false);
        setSelectedPet(null);
      }
    };

    const buyAccessory = (accessory: any) => {
      if (coins >= accessory.price) {
        updateCoins(-accessory.price);
        alert(`Bought ${accessory.name}! Your pet got stronger!`);
      } else {
        alert(`You need ${accessory.price - coins} more coins!`);
      }
    };

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">🐾 Pet Store</h2>
        <p className="text-gray-600 mb-6">Adopt new pets or buy accessories to make your current pet stronger.</p>
        
        {!pet && (
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-3">Adopt a Pet (100 coins)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {PET_OPTIONS.map((petOption) => (
                <button
                  key={petOption.type}
                  onClick={() => adoptPet(petOption)}
                  className="p-4 bg-pink-100 border-2 border-pink-300 rounded-lg hover:bg-pink-200 transition text-left"
                >
                  <h4 className="font-bold text-lg text-gray-800">{petOption.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{petOption.description}</p>
                  <div className="text-xs text-gray-500">
                    Health: {petOption.baseStats.health} | Attack: {petOption.baseStats.attack} | Defense: {petOption.baseStats.defense}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-3">Pet Accessories</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {petAccessories.map((accessory) => (
              <button
                key={accessory.id}
                onClick={() => buyAccessory(accessory)}
                disabled={coins < accessory.price}
                className="p-4 bg-purple-500 text-white rounded-lg font-bold hover:bg-purple-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {accessory.name}
                <div className="text-sm mt-1">{accessory.description}</div>
                <div className="text-sm mt-1 font-bold">💰 {accessory.price} coins</div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
          <h3 className="font-bold text-pink-800 mb-2">Pet Store Info:</h3>
          <ul className="text-sm text-pink-700 space-y-1">
            <li>• Adopt new pets if you don't have one (100 coins)</li>
            <li>• Buy accessories to improve your pet's abilities</li>
            <li>• Stronger pets perform better in battles</li>
            <li>• Each pet has unique special abilities</li>
          </ul>
        </div>

        {showAdoptConfirm && selectedPet && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[80]">
            <div className="bg-white p-6 rounded-2xl max-w-sm w-full mx-4">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Confirm Adoption</h3>
              <p className="text-gray-600 mb-4">
                Adopt <strong>{selectedPet.name}</strong> for 100 coins?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={confirmAdoption}
                  className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600 transition"
                >
                  ✅ Adopt
                </button>
                <button
                  onClick={() => setShowAdoptConfirm(false)}
                  className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg font-bold hover:bg-gray-600 transition"
                >
                  ❌ Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const VetClinic = () => {
    const [treating, setTreating] = useState(false);

    const vetServices = [
      {
        id: "checkup",
        name: "Health Checkup",
        description: "Complete health examination for your pet",
        price: 20,
        duration: 3000,
        effect: { health: 15, happiness: 10 }
      },
      {
        id: "treatment",
        name: "Medical Treatment", 
        description: "Advanced treatment for sick pets",
        price: 35,
        duration: 4000,
        effect: { health: 30, happiness: 5 }
      },
      {
        id: "surgery",
        name: "Emergency Surgery",
        description: "Life-saving surgery for critically injured pets",
        price: 60,
        duration: 6000,
        effect: { health: 50, happiness: -5 }
      }
    ];

    const medicalSupplies = [
      {
        id: "bandage",
        name: "Pet Bandages",
        description: "Basic first aid for minor injuries",
        price: 15,
        effect: { target: "pet", property: "health", value: 10 }
      },
      {
        id: "medicine",
        name: "Pet Medicine",
        description: "Restores health and prevents illness",
        price: 25,
        effect: { target: "pet", property: "health", value: 20 }
      },
      {
        id: "vitamin",
        name: "Pet Vitamins",
        description: "Boosts overall health and happiness",
        price: 30,
        effect: { target: "pet", property: "happiness", value: 15 }
      }
    ];

    const useService = (service: any) => {
      if (!pet) {
        alert("You need a pet to use vet services!");
        return;
      }
      
      if (coins >= service.price) {
        setTreating(true);
        updateCoins(-service.price);
        
        setTimeout(() => {
          setTreating(false);
          updatePetHealth(service.effect.health);
          updatePetHappiness(service.effect.happiness);
          alert(`${service.name} completed! Pet health +${service.effect.health}, happiness ${service.effect.happiness >= 0 ? '+' : ''}${service.effect.happiness}`);
        }, service.duration);
      } else {
        alert(`You need ${service.price - coins} more coins for this service!`);
      }
    };

    const buySupply = (supply: any) => {
      if (coins >= supply.price) {
        updateCoins(-supply.price);
        const item: InventoryItem = {
          id: supply.id,
          name: supply.name,
          description: supply.description,
          type: "medicine",
          effect: supply.effect,
          price: supply.price,
          quantity: 1
        };
        addItem(item);
        alert(`Bought ${supply.name}! Check your inventory.`);
      } else {
        alert(`You need ${supply.price - coins} more coins!`);
      }
    };

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">⚕️ Veterinary Clinic</h2>
        <p className="text-gray-600 mb-6">Professional health services and medical supplies for your pet.</p>
        
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-3">Veterinary Services</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {vetServices.map((service) => (
              <button
                key={service.id}
                onClick={() => useService(service)}
                disabled={treating || coins < service.price || !pet}
                className="p-4 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {treating ? "Treating..." : service.name}
                <div className="text-sm mt-1">{service.description}</div>
                <div className="text-sm mt-1 font-bold">💰 {service.price} coins</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-3">Medical Supplies</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {medicalSupplies.map((supply) => (
              <button
                key={supply.id}
                onClick={() => buySupply(supply)}
                disabled={coins < supply.price}
                className="p-4 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {supply.name}
                <div className="text-sm mt-1">{supply.description}</div>
                <div className="text-sm mt-1 font-bold">💰 {supply.price} coins</div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <h3 className="font-bold text-red-800 mb-2">Vet Clinic Services:</h3>
          <ul className="text-sm text-red-700 space-y-1">
            <li>• Regular checkups keep your pet healthy</li>
            <li>• Medical supplies can be used from your inventory</li>
            <li>• Emergency services cost more but save critically injured pets</li>
            <li>• Healthy pets perform better in battles and activities</li>
          </ul>
        </div>
      </div>
    );
  };

  const GroceryStore = () => {
    const groceryItems = [
      {
        id: "apple",
        name: "Fresh Apples",
        description: "Healthy fruit that boosts player health",
        price: 8,
        effect: { target: "player", property: "health", value: 12 }
      },
      {
        id: "bread",
        name: "Whole Grain Bread",
        description: "Nutritious bread that restores energy",
        price: 10,
        effect: { target: "player", property: "health", value: 15 }
      },
      {
        id: "milk",
        name: "Fresh Milk",
        description: "Calcium-rich milk for strong bones",
        price: 12,
        effect: { target: "player", property: "maxHealth", value: 5 }
      },
      {
        id: "carrot",
        name: "Crunchy Carrots",
        description: "Healthy snack for you and your pet",
        price: 6,
        effect: { target: "pet", property: "health", value: 8 }
      },
      {
        id: "fish",
        name: "Fresh Fish",
        description: "High-protein food that pets love",
        price: 18,
        effect: { target: "pet", property: "health", value: 20 }
      },
      {
        id: "rice",
        name: "Premium Rice",
        description: "Filling grain that satisfies hunger",
        price: 15,
        effect: { target: "player", property: "health", value: 18 }
      }
    ];

    const householdItems = [
      {
        id: "soap",
        name: "Pet Shampoo",
        description: "Keeps your pet clean and happy",
        price: 14,
        effect: { target: "pet", property: "happiness", value: 12 }
      },
      {
        id: "brush",
        name: "Grooming Brush",
        description: "Regular grooming increases pet happiness",
        price: 22,
        effect: { target: "pet", property: "happiness", value: 18 }
      },
      {
        id: "blanket",
        name: "Cozy Blanket",
        description: "Comfortable rest improves health recovery",
        price: 35,
        effect: { target: "pet", property: "maxHealth", value: 8 }
      }
    ];

    const buyGrocery = (item: any) => {
      if (coins >= item.price) {
        updateCoins(-item.price);
        const inventoryItem: InventoryItem = {
          id: item.id,
          name: item.name,
          description: item.description,
          type: "food",
          effect: item.effect,
          price: item.price,
          quantity: 1
        };
        addItem(inventoryItem);
        alert(`Bought ${item.name}! Check your inventory.`);
      } else {
        alert(`You need ${item.price - coins} more coins!`);
      }
    };

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">🍎 Grocery Store</h2>
        <p className="text-gray-600 mb-6">Fresh food items and household supplies for you and your pet.</p>
        
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-3">Fresh Food</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {groceryItems.map((item) => (
              <button
                key={item.id}
                onClick={() => buyGrocery(item)}
                disabled={coins < item.price}
                className="p-4 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {item.name}
                <div className="text-sm mt-1">{item.description}</div>
                <div className="text-sm mt-1 font-bold">💰 {item.price} coins</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-3">Household Supplies</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {householdItems.map((item) => (
              <button
                key={item.id}
                onClick={() => buyGrocery(item)}
                disabled={coins < item.price}
                className="p-4 bg-orange-500 text-white rounded-lg font-bold hover:bg-orange-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {item.name}
                <div className="text-sm mt-1">{item.description}</div>
                <div className="text-sm mt-1 font-bold">💰 {item.price} coins</div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h3 className="font-bold text-green-800 mb-2">Grocery Store:</h3>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• Fresh food provides better nutrition than processed items</li>
            <li>• Household supplies help maintain your pet's hygiene</li>
            <li>• All items are added to your inventory for later use</li>
            <li>• Regular feeding keeps both you and your pet healthy</li>
          </ul>
        </div>
      </div>
    );
  };

  const renderSubLocation = () => {
    switch (currentSubLocation) {
      case "pets":
        return <PetStore />;
      case "vet":
        return <VetClinic />;
      case "groceries":
        return <GroceryStore />;
      default:
        return null;
    }
  };

  if (currentSubLocation) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[70]">
        <div className="bg-white rounded-3xl shadow-lg border-4 border-blue-500 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            {renderSubLocation()}
            
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={handleBackToShop}
                className="px-6 py-2 bg-gray-500 text-white rounded-full font-bold hover:bg-gray-600 transition"
              >
                ← Back to Shop
              </button>
              <button
                onClick={closeShop}
                className="px-6 py-2 bg-blue-500 text-white rounded-full font-bold hover:bg-blue-600 transition"
              >
                Leave Shop
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[60]">
      <div className="bg-white rounded-3xl shadow-lg border-4 border-blue-500 max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-blue-500 text-white text-center">
          <h1 className="text-3xl font-bold mb-2">🏪 Welcome to the Shop!</h1>
          <p className="text-lg">Everything you and your pet need in one place</p>
        </div>

        {/* Player Info */}
        <div className="p-4 bg-blue-100 border-b border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-full border-2 border-blue-500"
                style={{ backgroundColor: player?.color || "#4FC3F7" }}
              ></div>
              <div>
                <p className="font-bold text-gray-800">{player?.name || "Shopper"}</p>
                <p className="text-sm text-gray-600">Health: {player?.health}/{player?.maxHealth}</p>
              </div>
            </div>
            {pet && (
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-full border-2 border-blue-500"
                  style={{ backgroundColor: pet.color }}
                ></div>
                <div>
                  <p className="font-bold text-gray-800">{pet.name}</p>
                  <p className="text-sm text-gray-600">Health: {pet.health}/{pet.maxHealth}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className="text-yellow-600">💰</span>
              <span className="font-bold text-gray-700">{coins} coins</span>
            </div>
          </div>
        </div>

        {/* Shop Areas */}
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Choose a Shop Area</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {subLocations.map((area) => (
              <button
                key={area.id}
                onClick={() => handleSubLocationClick(area.id)}
                className={`p-4 ${area.color} text-white rounded-xl font-bold ${area.hoverColor} transition-all transform hover:scale-105`}
              >
                <div className="text-2xl mb-2">{area.name.split(' ')[0]}</div>
                <div className="text-sm font-normal">{area.description}</div>
              </button>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-2">
              <span className="text-blue-500 text-xl">🏪</span>
              <div>
                <h4 className="font-bold text-blue-800 mb-1">Shop Areas:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Pets: Adopt new companions and buy accessories</li>
                  <li>• Vet: Professional health services and medical supplies</li>
                  <li>• Groceries: Fresh food and household items</li>
                  <li>• All purchases use coins earned from activities and battles</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 flex justify-center">
          <button
            onClick={closeShop}
            className="px-6 py-2 bg-gray-500 text-white rounded-full font-bold hover:bg-gray-600 transition-colors"
          >
            Leave Shop
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Shop);