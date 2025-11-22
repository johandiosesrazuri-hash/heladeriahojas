import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const CartModal = () => {
    const { isCartOpen, toggleCart, items, total, removeItem, updateQuantity } = useCart();
    const navigate = useNavigate();

    if (!isCartOpen) return null;

    const handleCheckout = () => {
        toggleCart();
        navigate('/pedidos');
    };

    return (
        <div className="fixed inset-0 z-[60] flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
                onClick={toggleCart}
            ></div>

            {/* Modal Content - Side Drawer */}
            <div className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col animate-slide-in-right">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="text-2xl font-bold text-[#904939] flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        Tu Carrito
                    </h2>
                    <button
                        onClick={toggleCart}
                        className="p-2 text-gray-400 hover:text-[#C1583B] hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Items List */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {items.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-gray-400">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </div>
                            <p className="font-medium">Tu carrito está vacío</p>
                            <button
                                onClick={toggleCart}
                                className="text-[#C1583B] font-bold hover:underline"
                            >
                                Empezar a comprar
                            </button>
                        </div>
                    ) : (
                        items.map((item) => (
                            <div key={item.id} className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex gap-4 items-center shadow-sm hover:shadow-md transition-shadow">
                                {/* Image */}
                                <div className="w-20 h-20 flex-shrink-0 bg-white rounded-xl overflow-hidden border border-gray-200">
                                    <img
                                        src={item.image || '/img/placeholder.png'}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="font-bold text-gray-800 truncate pr-2">{item.name}</h3>
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                    <p className="text-[#C1583B] font-bold text-sm mb-2">S/ {item.price}</p>

                                    {/* Quantity Selector */}
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center bg-white border border-gray-200 rounded-lg overflow-hidden">
                                            <button
                                                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                className="px-2 py-1 text-gray-500 hover:bg-gray-100 hover:text-[#C1583B] transition-colors"
                                            >
                                                -
                                            </button>
                                            <span className="px-2 text-sm font-bold text-gray-700 min-w-[1.5rem] text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="px-2 py-1 text-gray-500 hover:bg-gray-100 hover:text-[#C1583B] transition-colors"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <p className="text-xs text-gray-500 font-medium ml-auto">
                                            Subtotal: <span className="text-gray-800">${(item.price * item.quantity).toFixed(2)}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="p-6 bg-white border-t border-gray-100 space-y-4">
                        <div className="flex justify-between items-end">
                            <span className="text-gray-500 font-medium">Total</span>
                            <span className="text-3xl font-bold text-[#C1583B]">S/ {total.toFixed(2)}</span>
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={handleCheckout}
                                className="w-full py-3.5 bg-[#C1583B] text-white rounded-full font-bold shadow-lg shadow-[#C1583B]/20 hover:bg-[#904939] hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                            >
                                Proceder al Pago
                            </button>
                            <button
                                onClick={toggleCart}
                                className="w-full py-3.5 bg-white text-gray-500 border border-gray-200 rounded-full font-bold hover:bg-gray-50 hover:text-gray-700 transition-colors"
                            >
                                Continuar Comprando
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartModal;
