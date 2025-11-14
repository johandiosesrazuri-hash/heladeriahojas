import { createContext, useContext, useReducer, useEffect } from "react";
import { useAuth } from "../context/AuthContext"; // AJUSTA ESTA RUTA

const CartContext = createContext();

const getInitialState = (email) => {
  try {
    const raw = localStorage.getItem(`cart_${email}`);
    return raw ? JSON.parse(raw) : { items: [], total: 0 };
  } catch {
    return { items: [], total: 0 };
  }
};

const cartReducer = (state, action) => {
  switch (action.type) {

    case "SET_CART":
      return action.payload;

    case "ADD_ITEM": {
      const existing = state.items.find((i) => i.id === action.payload.id);

      let newItems;
      if (existing) {
        newItems = state.items.map((i) =>
          i.id === action.payload.id
            ? { ...i, quantity: i.quantity + action.payload.quantity }
            : i
        );
      } else {
        newItems = [...state.items, action.payload];
      }

      const newTotal = newItems.reduce(
        (acc, it) => acc + it.price * it.quantity,
        0
      );

      return { items: newItems, total: newTotal };
    }

    case "REMOVE_ITEM": {
      const newItems = state.items.filter((i) => i.id !== action.payload);
      const newTotal = newItems.reduce(
        (acc, it) => acc + it.price * it.quantity,
        0
      );

      return { items: newItems, total: newTotal };
    }

    case "UPDATE_QUANTITY": {
      const newItems = state.items.map((i) =>
        i.id === action.payload.id
          ? { ...i, quantity: action.payload.quantity }
          : i
      );

      const newTotal = newItems.reduce(
        (acc, it) => acc + it.price * it.quantity,
        0
      );

      return { items: newItems, total: newTotal };
    }

    case "CLEAR_CART":
      return { items: [], total: 0 };

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {

  const { user } = useAuth();          // OBTENER EMAIL DE USUARIO
  const email = user?.email || "guest";

  const [state, dispatch] = useReducer(cartReducer, getInitialState(email));

  // 🔥 Cargar carrito correcto cuando cambia el usuario
  useEffect(() => {
    const data = getInitialState(email);
    dispatch({ type: "SET_CART", payload: data });
  }, [email]);

  // 🔥 Guardar el carrito asociado a un usuario
  useEffect(() => {
    localStorage.setItem(`cart_${email}`, JSON.stringify(state));
  }, [state, email]);

  // Métodos públicos
  const addItem = (item) => dispatch({ type: "ADD_ITEM", payload: item });
  const removeItem = (id) => dispatch({ type: "REMOVE_ITEM", payload: id });
  const updateQuantity = (id, quantity) =>
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  const clearCart = () => dispatch({ type: "CLEAR_CART" });

  return (
    <CartContext.Provider
      value={{ ...state, addItem, removeItem, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
