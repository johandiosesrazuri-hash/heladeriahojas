import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = ({ embedded = false, onSuccess }) => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [notification, setNotification] = useState({ show: false, message: "", type: "" });
    const [animate, setAnimate] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setTimeout(() => setAnimate(true), 10);
    }, []);

    useEffect(() => {
        if (notification.show) {
            const timer = setTimeout(() => {
                setNotification({ show: false, message: "", type: "" });
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [notification.show]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsProcessing(true);
        setError('');

        try {
            const response = await fetch('http://localhost:8080/api/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                setNotification({
                    show: true,
                    message: "Recibirás un enlace de recuperación.",
                    type: "success"
                });
                if (embedded && onSuccess) {
                    onSuccess();
                } else {
                    setTimeout(() => navigate('/login'), 3000);
                }
            } else {
                const data = await response.json();
                setError(data.error || "Error al procesar la solicitud. Inténtalo de nuevo.");
            }
        } catch (error) {
            setError("Error de conexión. Inténtalo más tarde.");
        } finally {
            setIsProcessing(false);
        }
    };

    if (embedded) {
        return (
            <div className="space-y-4">
                {notification.show && notification.type === 'success' && (
                    <div className="p-4 bg-gradient-to-r from-secondary-light to-secondary-light/50 border-l-4 border-secondary rounded-r shadow-sm animate-fade-in">
                        <div className="flex items-center">
                            <svg className="h-5 w-5 mr-2 text-secondary-dark" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <p className="font-bold text-secondary-dark">Éxito</p>
                        </div>
                        <p className="text-sm mt-1 ml-7 text-secondary-dark">{notification.message}</p>
                    </div>
                )}

                {error && (
                    <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r shadow-sm animate-fade-in">
                        <div className="flex items-center">
                            <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <p className="font-bold">Error</p>
                        </div>
                        <p className="text-sm mt-1 ml-7">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email-embedded" className="block text-sm font-bold text-neutral-700 mb-2 font-body">
                            Correo Electrónico
                        </label>
                        <input
                            type="email"
                            id="email-embedded"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-200 font-body bg-white"
                            placeholder="tu@email.com"
                        />
                        <p className="text-xs text-neutral-500 mt-2 font-body">
                            Recibirás un enlace para restablecer tu contraseña
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={isProcessing}
                        className={`w-full py-3 px-4 rounded-full font-bold text-white shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-primary/20 font-title ${isProcessing
                            ? 'bg-neutral-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-primary to-secondary hover:shadow-xl'
                            }`}
                    >
                        {isProcessing ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Enviando...
                            </span>
                        ) : 'Enviar Enlace de Recuperación'}
                    </button>
                </form>
            </div>
        );
    }

    // Renderizado normal (página completa)
    return (
        <section className="py-16 px-4 md:px-8 lg:px-16 min-h-screen relative overflow-hidden bg-neutral-50">
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 left-0 w-full h-full gradient-hero"></div>
            </div>

            {notification.show && notification.type === 'success' && (
                <div className="fixed top-4 right-4 z-50 animate-fade-in">
                    <div className="px-6 py-4 rounded-xl shadow-lg flex items-center bg-secondary-light text-secondary-dark">
                        <span className="font-medium font-body">{notification.message}</span>
                    </div>
                </div>
            )}

            <div className="relative z-10 container-custom flex flex-col items-center justify-center min-h-[70vh]">
                <div
                    className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-3xl shadow-card p-8 md:p-10 border border-white/50"
                    style={{
                        animation: animate ? `fadeInUp 0.6s ease-out 0.1s both` : 'none',
                        opacity: animate ? 1 : 0
                    }}
                >
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-neutral-900 mb-2 font-title">Recuperar Contraseña</h2>
                        <p className="text-neutral-500 font-body">Ingresa tu email para recibir un enlace de recuperación</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r shadow-sm animate-fade-in">
                            <div className="flex items-center">
                                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                <p className="font-bold">Error</p>
                            </div>
                            <p className="text-sm mt-1 ml-7">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-bold text-neutral-700 mb-2 font-body">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-200 font-body bg-white"
                                placeholder="tu@email.com"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isProcessing}
                            className={`w-full py-3.5 px-4 rounded-full font-bold text-white shadow-lg transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-primary/20 font-title ${isProcessing
                                ? 'bg-neutral-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-primary to-secondary hover:shadow-xl'
                                }`}
                        >
                            {isProcessing ? 'Enviando...' : 'Enviar Enlace'}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <button
                            onClick={() => navigate('/login')}
                            className="font-bold text-primary hover:text-primary-dark font-title"
                        >
                            Volver al Inicio de Sesión
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ForgotPassword;
