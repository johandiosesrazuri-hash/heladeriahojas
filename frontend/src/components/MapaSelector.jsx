import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    height: '400px',
    borderRadius: '1rem'
};

const defaultCenter = {
    lat: -12.046374,
    lng: -77.042793
};

const libraries = ['places'];

const MapaSelector = ({ onLocationSelect }) => {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY || '',
        libraries
    });

    const [map, setMap] = useState(null);
    const [markerPosition, setMarkerPosition] = useState(null);
    const [center, setCenter] = useState(defaultCenter);
    const [isGeocoding, setIsGeocoding] = useState(false);

    // Función para hacer geocodificación inversa
    const reverseGeocode = useCallback(async (lat, lng) => {
        if (!window.google) return null;

        setIsGeocoding(true);
        try {
            const geocoder = new window.google.maps.Geocoder();
            const response = await geocoder.geocode({
                location: { lat, lng }
            });

            if (response.results && response.results[0]) {
                const result = response.results[0];
                const addressComponents = result.address_components;

                // Extraer componentes de la dirección
                let direccion = '';
                let ciudad = '';
                let codigoPostal = '';

                // Obtener dirección completa sin país
                const addressParts = [];
                for (let component of addressComponents) {
                    if (component.types.includes('street_number')) {
                        addressParts.unshift(component.long_name);
                    } else if (component.types.includes('route')) {
                        addressParts.push(component.long_name);
                    } else if (component.types.includes('locality')) {
                        ciudad = component.long_name;
                    } else if (component.types.includes('administrative_area_level_2') && !ciudad) {
                        ciudad = component.long_name;
                    } else if (component.types.includes('postal_code')) {
                        codigoPostal = component.long_name;
                    }
                }

                direccion = addressParts.join(' ') || result.formatted_address.split(',')[0];

                return {
                    direccion,
                    ciudad,
                    codigoPostal,
                    direccionCompleta: result.formatted_address
                };
            }
        } catch (error) {
            console.error('Error en geocodificación inversa:', error);
        } finally {
            setIsGeocoding(false);
        }
        return null;
    }, []);

    // Intentar obtener la ubicación actual del usuario (solo una vez)
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const userPos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    setCenter(userPos);
                    setMarkerPosition(userPos);

                    // Geocodificar la ubicación inicial
                    const addressData = await reverseGeocode(userPos.lat, userPos.lng);

                    if (onLocationSelect && addressData) {
                        onLocationSelect({
                            ...userPos,
                            ...addressData
                        });
                    }
                },
                () => {
                    console.log("No se pudo obtener la ubicación del usuario, usando default.");
                }
            );
        }
    }, []);

    const onLoad = useCallback(function callback(map) {
        setMap(map);
    }, []);

    const onUnmount = useCallback(function callback(map) {
        setMap(null);
    }, []);

    const handleMapClick = useCallback(async (e) => {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        const newPos = { lat, lng };

        setMarkerPosition(newPos);

        // Obtener dirección de las coordenadas
        const addressData = await reverseGeocode(lat, lng);

        if (onLocationSelect) {
            onLocationSelect({
                ...newPos,
                ...addressData
            });
        }
    }, [onLocationSelect, reverseGeocode]);

    const handleMarkerDragEnd = useCallback(async (e) => {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        const newPos = { lat, lng };

        setMarkerPosition(newPos);

        // Obtener dirección de las coordenadas
        const addressData = await reverseGeocode(lat, lng);

        if (onLocationSelect) {
            onLocationSelect({
                ...newPos,
                ...addressData
            });
        }
    }, [onLocationSelect, reverseGeocode]);

    if (!isLoaded) {
        return (
            <div className="w-full h-[400px] bg-neutral-100 rounded-xl flex items-center justify-center animate-pulse">
                <p className="text-neutral-400 font-medium">Cargando mapa...</p>
            </div>
        );
    }

    if (!import.meta.env.VITE_GOOGLE_MAPS_KEY) {
        return (
            <div className="w-full h-[400px] bg-red-50 rounded-xl flex flex-col items-center justify-center p-6 border border-red-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="text-red-600 font-bold text-center mb-2">Falta la API Key de Google Maps</p>
                <p className="text-red-500 text-sm text-center">Agrega VITE_GOOGLE_MAPS_KEY en tu archivo .env</p>
            </div>
        );
    }

    return (
        <div className="w-full relative">
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={15}
                onLoad={onLoad}
                onUnmount={onUnmount}
                onClick={handleMapClick}
                options={{
                    streetViewControl: false,
                    mapTypeControl: false,
                    fullscreenControl: true,
                }}
            >
                {markerPosition && (
                    <Marker
                        position={markerPosition}
                        draggable={true}
                        onDragEnd={handleMarkerDragEnd}
                    />
                )}
            </GoogleMap>

            <div className="mt-3 bg-blue-50 text-blue-700 px-4 py-3 rounded-lg text-sm flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                    <p>Haz clic en el mapa o arrastra el marcador rojo para indicar tu ubicación exacta de entrega.</p>
                    {isGeocoding && (
                        <p className="mt-1 text-xs italic">Obteniendo dirección...</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default React.memo(MapaSelector);
