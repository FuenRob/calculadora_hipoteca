# Simulador de Hipotecas

Aplicación web para simular y calcular todos los aspectos relacionados con una hipoteca, incluyendo la evaluación de productos bancarios asociados que reducen el tipo de interés.

## 🚀 Características Principales

- **Cálculo de Hipoteca**: Soporte para tipos de interés fijo, variable y mixto. Cálculo de cuota mensual, intereses totales y amortización.
- **Gestión de Productos Bancarios**: Análisis de productos que ofrecen bonificaciones en el tipo de interés (ej. domiciliación de nómina, seguros).
- **Análisis de Rentabilidad**: Evaluación de si merece la pena contratar productos bancarios vinculados, calculando el ahorro total vs el coste del producto y su punto de equilibrio.
- **Visualización de Datos**: Gráficos interactivos para la evolución del capital, intereses pagados, comparativas y más.
- **Amortizaciones Anticipadas**: Simulación de pagos extraordinarios reduciendo cuota o reduciendo plazo.

## 🛠️ Stack Tecnológico

- **Framework**: [Astro](https://astro.build/) - Rendimiento excepcional usando SSG y arquitectura de islas.
- **UI Interactiva**: [React](https://reactjs.org/) - Componentes interactivos para calculadoras y gráficos.
- **Gestión de Estado**: [Nanostores](https://github.com/nanostores/nanostores) - Ligero e ideal para compartir estado entre islas de React.
- **Estilación**: [Tailwind CSS](https://tailwindcss.com/) - Diseño responsivo (mobile-first).
- **Gráficos**: [Chart.js](https://www.chartjs.org/) mediante `react-chartjs-2`.
- **Validación**: [Zod](https://zod.dev/) - Validación de formularios y tipos estrictos.

## 🧞 Comandos de Desarrollo

Desde el directorio raíz del proyecto, puedes ejecutar los siguientes comandos en tu terminal:

| Comando                   | Acción                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Instala todas las dependencias del proyecto      |
| `npm run dev`             | Inicia el servidor de desarrollo en `localhost:4321` |
| `npm run build`           | Construye la versión de producción en `./dist/`  |
| `npm run preview`         | Previsualiza el proyecto construido localmente   |
| `npm run astro -- --help` | Obtiene ayuda sobre el CLI de Astro              |

## 📁 Estructura del Proyecto

```text
/
├── public/                # Archivos estáticos e imágenes
├── src/
│   ├── components/
│   │   ├── astro/         # Componentes UI estáticos (Header, Layout, etc.)
│   │   └── react/         # Islas interactivas principales (calculadoras, gráficos)
│   ├── layouts/           # Diseños base compartidos
│   ├── pages/             # Rutas (ej. index.astro)
│   ├── stores/            # Estado de Nanostores
│   ├── types/             # Definiciones de TypeScript (.ts)
│   └── utils/             # Lógica de cálculo financiero
└── package.json           # Dependencias y scripts
```
