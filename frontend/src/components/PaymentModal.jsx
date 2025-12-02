import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const PaymentModal = ({ isOpen, onClose, metodoPago, pedidoId, montoTotal }) => {
  const { token } = useAuth();
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    if (isOpen && (metodoPago === 'yape' || metodoPago === 'transferencia')) {
      fetchPaymentInfo();
    }
  }, [isOpen, metodoPago]);

  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification.show]);

  const fetchPaymentInfo = async () => {
    try {
      const api = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      const response = await axios.get(`${api}/api/payment/info`);
      setPaymentInfo(response.data);
    } catch (error) {
      console.error('Error al obtener información de pago:', error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setNotification({
          show: true,
          message: 'Solo se permiten imágenes',
          type: 'error'
        });
        return;
      }
      
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setNotification({
        show: true,
        message: 'Por favor selecciona un comprobante',
        type: 'error'
      });
      return;
    }

    setIsUploading(true);
    try {
      const api = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      const formData = new FormData();
      formData.append('file', selectedFile);

      await axios.post(`${api}/api/payment/comprobante/${pedidoId}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setNotification({
        show: true,
        message: '¡Comprobante enviado! Tu pedido será validado pronto.',
        type: 'success'
      });

      setTimeout(() => {
        onClose(true); // true indica que se subió el comprobante
      }, 2000);

    } catch (error) {
      console.error('Error al subir comprobante:', error);
      setNotification({
        show: true,
        message: 'Error al subir el comprobante. Intenta de nuevo.',
        type: 'error'
      });
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-primary to-secondary p-6 rounded-t-3xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white font-title flex items-center">
              {metodoPago === 'yape' ? '📱 Pago con Yape/Plin' : '🏦 Transferencia Bancaria'}
            </h2>
            <button
              onClick={() => onClose(false)}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Notification */}
        {notification.show && (
          <div className="mx-6 mt-4 animate-fade-in">
            <div
              className={`px-4 py-3 rounded-xl shadow-lg flex items-center ${
                notification.type === 'success'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {notification.type === 'success' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                )}
              </svg>
              <span className="font-medium font-body">{notification.message}</span>
            </div>
          </div>
        )}

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Monto */}
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-6 text-center">
            <p className="text-neutral-600 font-body mb-2">Monto a Pagar:</p>
            <p className="text-4xl font-bold text-primary font-title">
              S/ {montoTotal.toFixed(2)}
            </p>
          </div>

          {metodoPago === 'yape' && paymentInfo?.yape && (
            <div className="space-y-4">
              <div className="bg-white border-2 border-primary/20 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-neutral-800 mb-4 font-title flex items-center">
                  <span className="bg-primary/10 p-2 rounded-lg mr-2">📱</span>
                  Escanea el código QR
                </h3>
                
                <div className="flex justify-center mb-4">
                  <div className="bg-white p-4 rounded-2xl shadow-lg border-2 border-neutral-100">
                    <img
                      src={`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}${paymentInfo.yape.qrPath}`}
                      alt="QR Yape"
                      className="w-64 h-64 object-contain"
                      onError={(e) => {
                        console.error('Error cargando QR desde:', e.target.src);
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="256" height="256"%3E%3Crect fill="%23f0f0f0" width="256" height="256"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="monospace" font-size="16" fill="%23999"%3EQR No Disponible%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  </div>
                </div>

                <div className="bg-secondary-light rounded-xl p-4 text-center">
                  <p className="text-sm text-neutral-700 font-body">
                    💡 <strong>Instrucciones:</strong>
                  </p>
                  <ol className="text-sm text-neutral-600 mt-2 space-y-1 text-left font-body">
                    <li>1. Abre tu app de Yape o Plin</li>
                    <li>2. Escanea el código QR</li>
                    <li>3. Transfiere el monto exacto</li>
                    <li>4. Toma un screenshot del comprobante</li>
                    <li>5. Súbelo aquí abajo</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {metodoPago === 'transferencia' && paymentInfo?.bank && (
            <div className="space-y-4">
              <div className="bg-white border-2 border-primary/20 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-neutral-800 mb-4 font-title flex items-center">
                  <span className="bg-primary/10 p-2 rounded-lg mr-2">🏦</span>
                  Datos Bancarios
                </h3>
                
                <div className="space-y-3 font-body">
                  <div className="flex justify-between items-center p-3 bg-neutral-50 rounded-xl">
                    <span className="text-neutral-600 font-medium">Banco:</span>
                    <span className="font-bold text-neutral-800">{paymentInfo.bank.name}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-neutral-50 rounded-xl">
                    <span className="text-neutral-600 font-medium">Tipo:</span>
                    <span className="font-bold text-neutral-800">{paymentInfo.bank.type}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-neutral-50 rounded-xl">
                    <span className="text-neutral-600 font-medium">Cuenta:</span>
                    <span className="font-bold text-neutral-800 font-mono">{paymentInfo.bank.account}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-neutral-50 rounded-xl">
                    <span className="text-neutral-600 font-medium">CCI:</span>
                    <span className="font-bold text-neutral-800 font-mono text-sm">{paymentInfo.bank.cci}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-neutral-50 rounded-xl">
                    <span className="text-neutral-600 font-medium">Titular:</span>
                    <span className="font-bold text-neutral-800">{paymentInfo.bank.holder}</span>
                  </div>
                </div>

                <div className="bg-secondary-light rounded-xl p-4 mt-4">
                  <p className="text-sm text-neutral-700 font-body">
                    💡 <strong>Instrucciones:</strong>
                  </p>
                  <ol className="text-sm text-neutral-600 mt-2 space-y-1 font-body">
                    <li>1. Ingresa a tu banca móvil o app del banco</li>
                    <li>2. Realiza una transferencia al número de cuenta o CCI</li>
                    <li>3. Transfiere el monto EXACTO mostrado arriba</li>
                    <li>4. Guarda el comprobante de la transferencia</li>
                    <li>5. Súbelo aquí abajo</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {/* Upload Section */}
          <div className="bg-white border-2 border-dashed border-neutral-300 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-neutral-800 mb-4 font-title flex items-center">
              <span className="bg-primary/10 p-2 rounded-lg mr-2">📸</span>
              Sube tu Comprobante de Pago
            </h3>

            {!preview ? (
              <label className="cursor-pointer block">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="border-2 border-dashed border-primary/30 rounded-xl p-8 text-center hover:bg-primary/5 transition-all">
                  <svg className="w-16 h-16 mx-auto text-primary mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-neutral-700 font-semibold font-body mb-1">
                    Click aquí para subir tu comprobante
                  </p>
                  <p className="text-sm text-neutral-500 font-body">
                    PNG, JPG hasta 10MB
                  </p>
                </div>
              </label>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <img src={preview} alt="Preview" className="w-full h-64 object-contain rounded-xl bg-neutral-50" />
                  <button
                    onClick={() => {
                      setPreview(null);
                      setSelectedFile(null);
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className={`w-full py-3 rounded-xl font-semibold font-title transition-all ${
                    isUploading
                      ? 'bg-neutral-300 cursor-not-allowed'
                      : 'bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg hover:-translate-y-1'
                  }`}
                >
                  {isUploading ? 'Subiendo...' : '✅ Confirmar y Enviar Comprobante'}
                </button>
              </div>
            )}
          </div>

          {/* Warning */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700 font-body">
                  <strong>Importante:</strong> Tu pedido será procesado una vez que validemos tu pago. 
                  Esto puede tomar unos minutos. Te notificaremos cuando esté confirmado.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
