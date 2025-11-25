import { useToast } from '../context/ToastContext';

export const useErrorHandler = () => {
  const toast = useToast();

  const handleError = (error) => {
    console.error('Error:', error);

    if (error.response) {
      // Error de respuesta del servidor
      const { status, data } = error.response;

      if (status === 400) {
        // Errores de validación
        if (data.errors) {
          // Múltiples errores de validación
          Object.values(data.errors).forEach(msg => {
            toast.error(msg);
          });
        } else {
          toast.error(data.message || 'Datos inválidos');
        }
      } else if (status === 401) {
        toast.error('No autorizado. Por favor inicia sesión.');
      } else if (status === 403) {
        toast.error('No tienes permisos para realizar esta acción.');
      } else if (status === 404) {
        toast.error('Recurso no encontrado.');
      } else if (status === 500) {
        toast.error('Error del servidor. Intenta de nuevo más tarde.');
      } else {
        toast.error(data.message || 'Ocurrió un error inesperado.');
      }
    } else if (error.request) {
      // La petición se hizo pero no hubo respuesta
      toast.error('No se pudo conectar con el servidor. Verifica tu conexión.');
    } else {
      // Algo pasó al configurar la petición
      toast.error('Error al procesar la solicitud.');
    }
  };

  return { handleError };
};
