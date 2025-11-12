# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Uso del proyecto Heladería Chocco (Frontend)

Variables de entorno:

- Crea un archivo `.env` en la carpeta raíz del frontend con:

```
VITE_API_URL=http://localhost:8080
```

Instalación y ejecución:

```bash
npm install
npm run dev
```

El frontend correrá por defecto en http://localhost:5173 y se comunicará con el backend en `VITE_API_URL`.

Notas:
- El login y registro guardan el token JWT en localStorage. Asegúrate de tener el backend corriendo en http://localhost:8080.
- El carrito también se persiste en localStorage.
