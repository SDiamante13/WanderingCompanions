# Pet Adventure Game - Next 3 Features Implementation

## 🎯 **FEATURE 1: SHOP SYSTEM** [CHECKPOINT 1]
**Acceptance Test:** Player can click on shop building, see tabbed interface with items, purchase items with coins, items appear in inventory

### Implementation Tasks:
- [ ] Create `Shop.tsx` component with tabbed UI (Food, Toys, Medicine, Accessories)
- [ ] Connect shop data from `constants.ts` SHOP_ITEMS
- [ ] Implement purchase logic with coin deduction in player store
- [ ] Add purchased items to player inventory
- [ ] Create shop interaction in Town.tsx location handler
- [ ] Add confirmation dialogs for purchases
- [ ] Add "insufficient funds" error handling

**Expected Outcome:** Functional shop where players can spend coins and receive items

---

## 🎯 **FEATURE 2: BASIC MATH LEARNING GAME** [CHECKPOINT 2]  
**Acceptance Test:** Player can click on school building, access math mini-game, solve addition/subtraction problems, earn coins as rewards

### Implementation Tasks:
- [ ] Create `School.tsx` component with learning activity selection
- [ ] Create `MathGame.tsx` component for addition/subtraction (1-20)
- [ ] Generate random math problems appropriate for age 7
- [ ] Implement scoring system with coin rewards
- [ ] Add encouraging feedback for correct/incorrect answers
- [ ] Connect school interaction in Town.tsx location handler
- [ ] Track progress in player store (problems solved, coins earned)

**Expected Outcome:** Working math mini-game that rewards players with coins for correct answers

---

## 🎯 **FEATURE 3: HOME ACTIVITIES SYSTEM** [CHECKPOINT 3]
**Acceptance Test:** Player can click on home building, access pet care activities (feeding, playing), see pet happiness increase, use inventory items

### Implementation Tasks:
- [ ] Create `Home.tsx` component with pet care interface
- [ ] Implement pet feeding system using food items from inventory
- [ ] Create simple pet play activity (clicking/interaction)
- [ ] Update pet happiness and health based on activities  
- [ ] Add visual feedback for pet mood changes
- [ ] Connect home interaction in Town.tsx location handler
- [ ] Add item consumption from inventory when feeding

**Expected Outcome:** Interactive home where players can care for their pet using items and see stat changes

---

## 📋 **Development Approach**
- Implement one feature completely before moving to the next
- Each feature must pass acceptance test before proceeding
- Focus on core functionality over visual polish
- Ensure age-appropriate design and interaction patterns

## 🎮 **Current Progress Status**
- [x] **CHECKPOINT 1:** Shop System - COMPLETED ✅
- [ ] **CHECKPOINT 2:** Math Learning Game - Not Started  
- [ ] **CHECKPOINT 3:** Home Activities - Not Started