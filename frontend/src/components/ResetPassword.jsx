import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const [isProcessing, setIsProcessing] = useState(false);
    const [notification, setNotification] = useState({ show: false, message: "", type: "" });
    const [animate, setAnimate] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setTimeout(() => setAnimate(true), 10);
        if (!token) {
            setNotification({ show: true, message: "Token inválido o faltante.", type: "error" });
        }
    }, [token]);

    useEffect(() => {
        if (notification.show) {
            const timer = setTimeout(() => {
                setNotification({ show: false, message: "", type: "" });
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [notification.show]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmPassword) {
            setNotification({ show: true, message: "Las contraseñas no coinciden.", type: "error" });
            return;
        }

        setIsProcessing(true);

        try {
            const response = await fetch('http://localhost:8080/api/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token, newPassword: formData.newPassword }),
            });

            if (response.ok) {
                setNotification({
                    show: true,
                    message: "Contraseña restablecida con éxito.",
                    type: "success"
                });
                setTimeout(() => navigate('/login'), 2000);
            } else {
                const data = await response.json();
                setNotification({
                    show: true,
                    message: data.error || "Error al restablecer la contraseña.",
                    type: "error"
                });
            }
        } catch (error) {
            setNotification({
                show: true,
                message: "Error de conexión. Inténtalo más tarde.",
                type: "error"
            });
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <section className="py-16 px-4 md:px-8 lg:px-16 min-h-screen relative overflow-hidden bg-neutral-50">
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 left-0 w-full h-full gradient-hero"></div>
            </div>

            {notification.show && (
                <div className="fixed top-4 right-4 z-50 animate-fade-in">
                    <div className={`px-6 py-4 rounded-xl shadow-lg flex items-center ${notification.type === 'success' ? 'bg-secondary-light text-secondary-dark' : 'bg-red-100 text-red-800'}`}>
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
                        <h2 className="text-3xl font-bold text-neutral-900 mb-2 font-title">Nueva Contraseña</h2>
                        <p className="text-neutral-500 font-body">Ingresa tu nueva contraseña</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="newPassword" className="block text-sm font-bold text-neutral-700 mb-2 font-body">
                                Nueva Contraseña
                            </label>
                            <input
                                type="password"
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-200 font-body bg-white"
                                placeholder="••••••••"
                            />
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-bold text-neutral-700 mb-2 font-body">
                                Confirmar Contraseña
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-200 font-body bg-white"
                                placeholder="••••••••"
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
                            {isProcessing ? 'Restableciendo...' : 'Restablecer Contraseña'}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default ResetPassword;
