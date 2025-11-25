import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

const CartModal = () => {
    const { isCartOpen, toggleCart, items, total, removeItem, updateQuantity } = useCart();
    const navigate = useNavigate();
    const toast = useToast();

    if (!isCartOpen) return null;

    const handleCheckout = () => {
        toggleCart();
        navigate('/pedidos');
    };

    const handleRemoveItem = (itemId, itemName) => {
        removeItem(itemId);
        toast.warning(`${itemName} eliminado del carrito`);
    };

    return (
        <div className="fixed inset-0 z-[60] flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm transition-opacity"
                onClick={toggleCart}
            ></div>

            {/* Modal Content - Side Drawer */}
            <div className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col animate-slide-in-right">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-neutral-100 bg-neutral-50/50">
                    <h2 className="text-2xl font-bold text-neutral-900 flex items-center gap-2 font-title">
                        <div className="bg-primary/10 p-2 rounded-full text-primary">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        Tu Carrito
                    </h2>
                    <button
                        onClick={toggleCart}
                        className="p-2 text-neutral-400 hover:text-primary hover:bg-primary/5 rounded-full transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Items List */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white">
                    {items.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-neutral-400">
                            <div className="w-24 h-24 bg-neutral-50 rounded-full flex items-center justify-center mb-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-neutral-900 font-title">Tu carrito está vacío</h3>
                            <p className="font-body text-neutral-500 max-w-xs">Parece que aún no has agregado ningún helado delicioso.</p>
                            <button
                                onClick={toggleCart}
                                className="mt-4 px-6 py-2 bg-primary text-white rounded-full font-bold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20"
                            >
                                Empezar a comprar
                            </button>
                        </div>
                    ) : (
                        items.map((item) => (
                            <div key={item.id} className="bg-white p-4 rounded-2xl border border-neutral-100 flex gap-4 items-center shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 group">
                                {/* Image */}
                                <div className="w-20 h-20 flex-shrink-0 bg-neutral-50 rounded-xl overflow-hidden border border-neutral-100 group-hover:border-primary/30 transition-colors">
                                    <img
                                        src={item.image || '/img/placeholder.png'}
                                        alt={item.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="font-bold text-neutral-800 truncate pr-2 font-title">{item.name}</h3>
                                        <button
                                            onClick={() => handleRemoveItem(item.id, item.name)}
                                            className="text-neutral-400 hover:text-red-500 transition-colors p-1 hover:bg-red-50 rounded-full"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                    <p className="text-primary font-bold text-sm mb-2 font-body">S/ {item.price}</p>

                                    {/* Quantity Selector */}
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center bg-neutral-50 border border-neutral-200 rounded-lg overflow-hidden">
                                            <button
                                                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                className="px-2 py-1 text-neutral-500 hover:bg-white hover:text-primary transition-colors"
                                            >
                                                -
                                            </button>
                                            <span className="px-2 text-sm font-bold text-neutral-700 min-w-[1.5rem] text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="px-2 py-1 text-neutral-500 hover:bg-white hover:text-primary transition-colors"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <p className="text-xs text-neutral-500 font-medium ml-auto font-body">
                                            Subtotal: <span className="text-neutral-800 font-bold">S/ {(item.price * item.quantity).toFixed(2)}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="p-6 bg-neutral-50 border-t border-neutral-100 space-y-4">
                        <div className="flex justify-between items-end">
                            <span className="text-neutral-500 font-medium font-body">Total</span>
                            <span className="text-3xl font-bold text-primary font-title">S/ {total.toFixed(2)}</span>
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={handleCheckout}
                                className="w-full py-3.5 bg-primary text-white rounded-full font-bold shadow-lg shadow-primary/20 hover:bg-primary-dark hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 font-title"
                            >
                                Proceder al Pago
                            </button>
                            <button
                                onClick={toggleCart}
                                className="w-full py-3.5 bg-white text-neutral-500 border border-neutral-200 rounded-full font-bold hover:bg-neutral-50 hover:text-neutral-700 transition-colors font-title"
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
