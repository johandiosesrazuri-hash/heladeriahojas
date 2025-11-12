import { createContext, useContext, useReducer } from 'react';

const CartContext = createContext();

const initialState = () => {
  try {
    const raw = localStorage.getItem('cart');
    return raw ? JSON.parse(raw) : { items: [], total: 0 };
  } catch { return { items: [], total: 0 }; }
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM':
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
          total: state.total + (action.payload.price * action.payload.quantity)
        };
      }
      return {
        ...state,
        items: [...state.items, action.payload],
        total: state.total + (action.payload.price * action.payload.quantity)
      };
    
    case 'REMOVE_ITEM':
      const item = state.items.find(item => item.id === action.payload);
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
        total: state.total - (item.price * item.quantity)
      };
    
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
        total: state.items.reduce((acc, item) => {
          if (item.id === action.payload.id) {
            return acc + (item.price * action.payload.quantity);
          }
          return acc + (item.price * item.quantity);
        }, 0)
      };
    
    case 'CLEAR_CART':
      return initialState;
    
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState());

  // Persist cart to localStorage on change
  const saveCart = (s) => {
    try { localStorage.setItem('cart', JSON.stringify(s)); } catch {}
  };

  // Wrap dispatch to persist
  const dispatchAndSave = (action) => {
    dispatch(action);
    // Small timeout to allow state update
    setTimeout(() => saveCart({ items: (action.type === 'CLEAR_CART' ? [] : undefined) }), 0);
  };

  const addItem = (item) => { dispatch({ type: 'ADD_ITEM', payload: item }); saveCart({ ...state, items: [...state.items, item], total: state.total + (item.price * item.quantity) }); };

  const removeItem = (itemId) => { dispatch({ type: 'REMOVE_ITEM', payload: itemId }); saveCart({ ...state, items: state.items.filter(i => i.id !== itemId) }); };

  const updateQuantity = (itemId, quantity) => { dispatch({ type: 'UPDATE_QUANTITY', payload: { id: itemId, quantity } }); };

  const clearCart = () => { dispatch({ type: 'CLEAR_CART' }); saveCart({ items: [], total: 0 }); };

  return (
    <CartContext.Provider value={{ ...state, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};