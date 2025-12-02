# 🚚 Configuración del Sistema de Delivery

## 📍 Ubicación de tu Heladería

Para que el sistema calcule correctamente los costos de delivery, necesitas configurar las coordenadas de tu heladería.

### Paso 1: Obtener tus Coordenadas

1. Ve a [Google Maps](https://www.google.com/maps)
2. Busca la dirección de tu heladería
3. Haz clic derecho en el marcador
4. Selecciona las coordenadas que aparecen (ejemplo: -12.0464, -77.0428)
5. Cópialas

### Paso 2: Actualizar la Configuración

Abre el archivo `backend/src/main/resources/application.properties` y modifica estas líneas:

```properties
# Delivery Configuration
delivery.precio.base=5.00                    # Precio base del delivery
delivery.precio.por.km=2.50                  # Precio adicional por kilómetro
delivery.radio.maximo.km=10                  # Radio máximo de entrega en km
delivery.heladeria.latitud=-12.0464         # 👈 CAMBIA ESTO por tu latitud
delivery.heladeria.longitud=-77.0428        # 👈 CAMBIA ESTO por tu longitud
```

## 💰 Ajustar Precios de Delivery

Puedes modificar estos valores según tu negocio:

- **`delivery.precio.base`**: Costo fijo por cualquier pedido (ej: S/ 5.00)
- **`delivery.precio.por.km`**: Costo adicional por cada kilómetro (ej: S/ 2.50/km)
- **`delivery.radio.maximo.km`**: Distancia máxima que aceptas entregar (ej: 10 km)

### Ejemplos de Configuración:

#### Delivery Económico:
```properties
delivery.precio.base=3.00
delivery.precio.por.km=1.50
delivery.radio.maximo.km=15
```

#### Delivery Premium:
```properties
delivery.precio.base=8.00
delivery.precio.por.km=3.50
delivery.radio.maximo.km=8
```

#### Delivery Precio Fijo:
```properties
delivery.precio.base=10.00
delivery.precio.por.km=0.00
delivery.radio.maximo.km=20
```

## 🔧 Aplicar los Cambios

Después de modificar el archivo, reinicia el servidor backend:

```bash
cd backend
mvn spring-boot:run
```

## 🧪 Probar el Sistema

1. Ve a tu aplicación web
2. Agrega productos al carrito
3. Ve a "Finalizar Pedido"
4. Selecciona una ubicación en el mapa
5. El sistema calculará automáticamente el costo de delivery

## 🗄️ Base de Datos

El sistema agregará automáticamente las siguientes columnas a tu tabla `deliveries`:
- `costo_delivery`: Costo calculado del delivery
- `distancia_km`: Distancia en kilómetros

Y estas columnas a la tabla `pedidos`:
- `metodo_pago`: Método de pago seleccionado
- `pagado`: Estado del pago

## 📊 Cómo Funciona

1. **Cliente selecciona ubicación** en el mapa
2. **Sistema calcula distancia** desde tu heladería usando la fórmula de Haversine
3. **Sistema verifica** si está dentro del radio de entrega
4. **Sistema calcula costo**: `Precio Base + (Distancia × Precio por Km)`
5. **Muestra el total** incluyendo productos + delivery

## ⚠️ Solución de Problemas

### El costo no se calcula:
- Verifica que las coordenadas de tu heladería estén correctas
- Asegúrate de seleccionar una ubicación en el mapa
- Revisa la consola del navegador para errores

### "Fuera del área de entrega":
- Aumenta el valor de `delivery.radio.maximo.km`
- Verifica que las coordenadas del cliente sean correctas

### El precio parece incorrecto:
- Revisa los valores de `precio.base` y `precio.por.km`
- Verifica que los valores sean números decimales válidos (usa punto, no coma)

## 🎯 Funcionalidades Adicionales

Si quieres implementar precios por zonas fijas en lugar de por distancia, avísame y te muestro cómo hacerlo.
