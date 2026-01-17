
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useStore } from '@nanostores/react';
import { currentCalculation, baseCalculation } from '../../stores/mortgageStore';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export function EvolutionChart() {
    const calculation = useStore(currentCalculation);

    if (!calculation) return null;

    const data = {
        labels: calculation.amortizationSchedule.filter((_, i) => i % 12 === 0).map(r => `Año ${r.month / 12}`),
        datasets: [
            {
                label: 'Capital Pendiente',
                data: calculation.amortizationSchedule.filter((_, i) => i % 12 === 0).map(r => r.remainingBalance),
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
                fill: true,
            },
            {
                label: 'Intereses Pagados (Acumulado)',
                data: calculation.amortizationSchedule.filter((_, i) => i % 12 === 0).map(r => {
                    // Calculamos acumulado hasta ese punto
                    // Esto es aproximado para visualizar, idealmente podríamos tener el dato acumulado en el store
                    return calculation.amortizationSchedule.slice(0, r.month).reduce((acc, curr) => acc + curr.interest, 0);
                }),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                fill: true,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top' as const },
            title: { display: true, text: 'Evolución de la Hipoteca' },
        },
    };

    return <Line options={options} data={data} />;
}

export function ComparisonChart() {
    const base = useStore(baseCalculation);
    const current = useStore(currentCalculation);

    if (!base || !current) return null;

    // Comparar cuota mensual (promedio para simplificar si varia)
    // O mejor, comparar total pagado acumulado año a año

    const data = {
        labels: base.amortizationSchedule.filter((_, i) => i % 12 === 0).map(r => `Año ${r.month / 12}`),
        datasets: [
            {
                label: 'Total Pagado (Base)',
                data: base.amortizationSchedule.filter((_, i) => i % 12 === 0).map((_, idx) => {
                    // Suma de cuotas hasta el año idx
                    const months = (idx + 1) * 12;
                    return base.amortizationSchedule.slice(0, months).reduce((acc, curr) => acc + curr.payment, 0);
                }),
                borderColor: 'rgb(156, 163, 175)', // Gray for base
                backgroundColor: 'rgba(156, 163, 175, 0.5)',
            },
            {
                label: 'Total Pagado (Con Productos)',
                data: current.amortizationSchedule.filter((_, i) => i % 12 === 0).map((_, idx) => {
                    const months = (idx + 1) * 12;
                    return current.amortizationSchedule.slice(0, months).reduce((acc, curr) => acc + curr.payment, 0);
                }),
                borderColor: 'rgb(34, 197, 94)', // Green for optimized
                backgroundColor: 'rgba(34, 197, 94, 0.5)',
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top' as const },
            title: { display: true, text: 'Comparativa de Coste Acumulado' },
        },
    };

    return <Line options={options} data={data} />;
}
