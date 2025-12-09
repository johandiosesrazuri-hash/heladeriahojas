Instalación y Ejecución

--------Backend (Spring Boot)

-Compilar y ejecutar

cd backend
mvn clean package -DskipTests
mvn spring-boot:run
-El backend estará disponible en: `http://localhost:8080`

-------Frontend (React + Vite)

-Instalar dependencias
cd frontend
npm install
-Ejecutar en modo desarrollo
npm run dev

El frontend estará disponible en: `http://localhost:5173`


------Gmail API (Recuperación de Contraseña)

El sistema utiliza Gmail API para enviar correos de recuperación de contraseña.

-Importante:
Las credenciales OAuth están configuradas en el proyecto
Solo el propietario del proyecto (Johan) puede autorizar el envío de correos

-Para probar esta funcionalidad:
  1. Al intentar enviar un correo, se abrirá un navegador
  2. Contacta al propietario para que autorice la aplicación
  3. Una vez autorizado, funcionará para todos

-Configurar tus propias credenciales (opcional):
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un proyecto y habilita **Gmail API**
3. Crea credenciales OAuth 2.0 de tipo **"Web application"**
4. Configura redirect URI: `http://localhost:8888/Callback`
5. Agrega tu email en "Test users"
6. Actualiza las credenciales en `application.properties`:
   gmail.client.id=TU_CLIENT_ID
   gmail.client.secret=TU_CLIENT_SECRET
   gmail.project.id=TU_PROJECT_ID


--------Google Maps API (Cálculo de Delivery)

El sistema usa Google Maps para calcular distancias y costos de delivery.

Importante:
- El frontend requiere una API Key de Google Maps
- Revise API Key en `frontend/.env`:
  VITE_GOOGLE_MAPS_API_KEY=APIJOHAN
