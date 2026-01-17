# Documentación del Proyecto: Simulador de Hipotecas

## 1. Descripción del Proyecto

Aplicación web para simular y calcular todos los aspectos relacionados con una hipoteca, incluyendo la evaluación de productos bancarios asociados que reducen el tipo de interés.

## 2. Funcionalidades Principales

### 2.1 Cálculo de Hipoteca
- **Tipos de interés soportados:**
  - Fijo: tasa constante durante toda la vida del préstamo
  - Variable: tasa que varía según Euríbor + diferencial
  - Mixto: combinación de período fijo inicial + período variable posterior

- **Cálculos incluidos:**
  - Cuota mensual (sistema de amortización francés)
  - Intereses totales pagados
  - Capital total amortizado
  - Tabla de amortización detallada mes a mes

### 2.2 Gestión de Productos Bancarios
- Añadir productos personalizados con:
  - Nombre del producto (ej: "Domiciliación de nómina", "Seguro de hogar")
  - Coste mensual del producto
  - Bonificación en el tipo de interés (% de reducción)
  
- Los productos se contratan al inicio y permanecen durante toda la hipoteca

### 2.3 Análisis de Rentabilidad de Productos
Para cada producto bancario, calcular:
- **Ahorro total en intereses** generado por la bonificación
- **Coste total del producto** durante la vida de la hipoteca
- **Rentabilidad neta** (ahorro - coste)
- **Punto de equilibrio** (mes en el que el ahorro acumulado supera el coste acumulado)
- **Recomendación visual** de si merece la pena contratarlo

### 2.4 Visualizaciones
- Gráfico de evolución del capital pendiente vs intereses pagados
- Gráfico comparativo con/sin productos contratados
- Gráfico del punto de equilibrio de cada producto

### 2.5 Amortizaciones Anticipadas
- Simular pagos extraordinarios
- Opciones: reducir plazo o reducir cuota
- Impacto en intereses totales

## 3. Stack Tecnológico Recomendado

### 3.1 Framework Principal
**Astro con TypeScript**
- Justificación: rendimiento excepcional, carga mínima de JavaScript, arquitectura de islas para interactividad selectiva, soporte nativo para TypeScript
- Configuración: SSG (Static Site Generation) ya que no necesitamos backend

### 3.2 Framework UI para Islas Interactivas
**React** (integrado en Astro)
- Justificación: para los componentes que necesitan interactividad (formularios, calculadora, gráficos)
- Directiva: `client:load` para componentes que necesitan hidratación inmediata

### 3.3 Gestión de Estado
**Nanostores**
- Justificación: librería de estado minimalista diseñada para Astro, permite compartir estado entre diferentes islas de componentes
- Alternativa: React Hooks dentro de cada isla si no necesitas compartir estado

### 3.4 Estilos
**Tailwind CSS**
- Justificación: desarrollo rápido, diseño responsivo, integración perfecta con Astro, clases utilitarias

### 3.5 Librería de Gráficos
**Chart.js** con react-chartjs-2
- Justificación: ligera, funciona bien con la arquitectura de islas de Astro, rendimiento óptimo para gráficos financieros
- Alternativa: Recharts si prefieres sintaxis más declarativa

### 3.6 Componentes UI
**Tailwind CSS + componentes custom**
- Justificación: con Astro es mejor mantener componentes simples y ligeros
- Puedes usar shadcn/ui adaptado para Astro si lo prefieres

### 3.7 Librería de Cálculos Financieros
**TypeScript nativo** + funciones personalizadas
- Justificación: los cálculos hipotecarios son relativamente simples, no requieren librería externa

### 3.8 Validación de Formularios
**Zod** para validación de schemas
- Justificación: validación tipada, se puede usar en cliente y servidor, no necesitas react-hook-form necesariamente en Astro

## 4. Estructura del Proyecto

```
src/
├── components/
│   ├── react/                    # Componentes interactivos (islas)
│   │   ├── MortgageCalculator.tsx    # Calculadora principal (island)
│   │   ├── ProductManager.tsx        # Gestor de productos (island)
│   │   ├── AmortizationTable.tsx     # Tabla interactiva (island)
│   │   └── Charts/
│   │       ├── EvolutionChart.tsx
│   │       ├── ComparisonChart.tsx
│   │       └── BreakevenChart.tsx
│   └── astro/                    # Componentes estáticos de Astro
│       ├── Layout.astro
│       ├── Header.astro
│       ├── Footer.astro
│       └── Section.astro
├── stores/
│   └── mortgageStore.ts          # Nanostores para estado global
├── utils/
│   ├── mortgageCalculations.ts
│   ├── productAnalysis.ts
│   └── formatters.ts
├── types/
│   └── index.ts
├── layouts/
│   └── MainLayout.astro
├── pages/
│   └── index.astro               # Página principal
└── styles/
    └── global.css
public/
astro.config.mjs
package.json
tsconfig.json
tailwind.config.mjs
```

## 5. Tipos de Datos Principales

```typescript
interface MortgageData {
  amount: number;              // Capital prestado
  years: number;               // Plazo en años
  interestType: 'fixed' | 'variable' | 'mixed';
  fixedRate?: number;          // Para fijo/mixto
  euribor?: number;            // Para variable/mixto
  spread?: number;             // Diferencial para variable
  fixedYears?: number;         // Años fijos en hipoteca mixta
}

interface BankProduct {
  id: string;
  name: string;
  monthlyCost: number;         // Coste mensual
  interestReduction: number;   // % de bonificación
}

interface ProductAnalysis {
  product: BankProduct;
  totalCost: number;           // Coste total durante hipoteca
  totalSavings: number;        // Ahorro en intereses
  netBenefit: number;          // Beneficio neto
  breakevenMonth: number;      // Mes de equilibrio
  recommended: boolean;        // Si merece la pena
}

interface MonthlyPayment {
  month: number;
  payment: number;             // Cuota total
  principal: number;           // Amortización capital
  interest: number;            // Intereses
  remainingBalance: number;    // Capital pendiente
  rate: number;                // Tipo aplicado ese mes
}
```

## 6. Algoritmos Clave

### 6.1 Cuota Mensual (Sistema Francés)
```
C = P * [r(1+r)^n] / [(1+r)^n - 1]

Donde:
C = Cuota mensual
P = Capital prestado
r = Tipo de interés mensual (TIN anual / 12 / 100)
n = Número total de pagos (años * 12)
```

### 6.2 Análisis de Producto
```
Ahorro mensual = Cuota sin producto - Cuota con producto
Ahorro acumulado = Σ(Ahorro mensual * mes)
Coste acumulado = Coste producto * mes
Punto equilibrio = mes donde Ahorro acumulado > Coste acumulado
```

## 7. Características de UX/UI

- **Diseño responsive**: mobile-first
- **Validación en tiempo real** de campos
- **Tooltips informativos** en términos financieros
- **Actualización dinámica** de resultados al cambiar valores
- **Exportación a PDF** de resultados (opcional fase 2)
- **Modo claro/oscuro** (opcional)

## 8. Fases de Desarrollo

### Fase 1 (MVP)
- Formulario básico de hipoteca
- Cálculo para tipo fijo
- Tabla de amortización simple
- Sin productos bancarios

### Fase 2
- Tipos variable y mixto
- Gestión de productos bancarios
- Análisis de rentabilidad
- Gráfico básico de evolución

### Fase 3
- Todos los gráficos
- Amortizaciones anticipadas
- Comparativas múltiples
- Optimización y pulido UI

## 9. Comandos de Inicio Rápido

```bash
# Crear proyecto con Astro
npm create astro@latest mortgage-simulator
# Seleccionar: Empty project, TypeScript (strict), Yes para todas las configuraciones

# Navegar al proyecto
cd mortgage-simulator

# Instalar dependencias adicionales
npm install nanostores @nanostores/react
npm install chart.js react-chartjs-2
npm install zod

# Instalar Tailwind CSS
npx astro add tailwind

# Instalar integración de React
npx astro add react

# Iniciar desarrollo
npm run dev
```

## 10. Configuración de Astro

El archivo `astro.config.mjs` debe incluir:

```javascript
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [
    react(),
    tailwind()
  ],
  output: 'static'
});
```

## 10. Consideraciones Adicionales con Astro

- **Arquitectura de Islas**: usar `client:load` solo en componentes que necesitan interactividad inmediata (formularios, gráficos), el resto puede ser estático
- **Optimización**: Astro envía 0 JS por defecto, solo hidrata las islas necesarias
- **Nanostores**: ideal para compartir estado entre diferentes islas React sin prop drilling
- **Precisión decimal**: usar `toFixed(2)` para cantidades monetarias
- **Rendimiento**: los cálculos pesados se pueden hacer en el servidor y pasarse como props
- **Accesibilidad**: labels en formularios, navegación por teclado
- **SEO**: Astro es excelente para SEO al generar HTML estático
- **Testing**: añadir tests unitarios para funciones de cálculo (opcional pero recomendado)

## 11. Ejemplo de Uso de Nanostores

```typescript
// src/stores/mortgageStore.ts
import { atom, computed } from 'nanostores';
import type { MortgageData } from '../types';

export const mortgageData = atom<MortgageData | null>(null);

export const monthlyPayment = computed(mortgageData, (data) => {
  if (!data) return 0;
  // Cálculo de cuota mensual
  const monthlyRate = data.fixedRate / 12 / 100;
  const payments = data.years * 12;
  return data.amount * (monthlyRate * Math.pow(1 + monthlyRate, payments)) / 
         (Math.pow(1 + monthlyRate, payments) - 1);
});
```

```tsx
// En un componente React
import { useStore } from '@nanostores/react';
import { mortgageData, monthlyPayment } from '../stores/mortgageStore';

export default function MortgageCalculator() {
  const data = useStore(mortgageData);
  const payment = useStore(monthlyPayment);
  
  // Resto del componente...
}
```

## 12. Mejoras Futuras (Post-MVP)

- Guardar simulaciones en localStorage (usando nanostores persistor)
- Comparar múltiples escenarios lado a lado
- Incluir gastos de apertura, tasación, notaría
- Calculadora de capacidad de endeudamiento
- Integración con APIs de Euríbor en tiempo real
- View Transitions de Astro para navegación fluida
- Modo isla para renderizado parcial
- PWA con service workers (Astro lo soporta nativamente)