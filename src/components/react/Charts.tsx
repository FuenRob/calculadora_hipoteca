
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
import type { MonthlyPayment } from '../../types';
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

    if (!calculation || calculation.amortizationSchedule.length === 0) {
        return <div className="h-64 flex items-center justify-center text-gray-400">No hay datos disponibles</div>;
    }

    const data = {
        labels: calculation.amortizationSchedule.filter((r: MonthlyPayment) => r.month % 12 === 0).map((r: MonthlyPayment) => `Año ${r.month / 12}`),
        datasets: [
            {
                label: 'Capital Pendiente',
                data: calculation.amortizationSchedule.filter((r: MonthlyPayment) => r.month % 12 === 0).map((r: MonthlyPayment) => r.remainingBalance),
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
                fill: true,
            },
            {
                label: 'Intereses Pagados (Acumulado)',
                data: calculation.amortizationSchedule.filter((r: MonthlyPayment) => r.month % 12 === 0).map((r: MonthlyPayment) => {
                    // Calculamos acumulado hasta ese punto
                    // Esto es aproximado para visualizar, idealmente podríamos tener el dato acumulado en el store
                    return calculation.amortizationSchedule.slice(0, r.month).reduce((acc: number, curr: MonthlyPayment) => acc + curr.interest, 0);
                }),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                fill: true,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top' as const },
            title: { display: true, text: 'Evolución de la Hipoteca' },
        },
    };

    return (
        <div className="h-64 w-full">
            <Line options={options} data={data} />
        </div>
    );
}

export function ComparisonChart() {
    const base = useStore(baseCalculation);
    const current = useStore(currentCalculation);

    if (!base || !current || base.amortizationSchedule.length === 0) {
        return <div className="h-64 flex items-center justify-center text-gray-400">No hay datos para comparar</div>;
    }

    const data = {
        labels: base.amortizationSchedule.filter((r: MonthlyPayment) => r.month % 12 === 0).map((r: MonthlyPayment) => `Año ${r.month / 12}`),
        datasets: [
            {
                label: 'Total Pagado (Base)',
                data: base.amortizationSchedule.filter((r: MonthlyPayment) => r.month % 12 === 0).map((r: MonthlyPayment) => {
                    // Suma de cuotas hasta el año actual
                    const months = r.month;
                    return base.amortizationSchedule.slice(0, months).reduce((acc: number, curr: MonthlyPayment) => acc + curr.payment, 0);
                }),
                borderColor: 'rgb(156, 163, 175)', // Gray for base
                backgroundColor: 'rgba(156, 163, 175, 0.5)',
            },
            {
                label: 'Total Pagado (Con Productos)',
                data: current.amortizationSchedule.filter((r: MonthlyPayment) => r.month % 12 === 0).map((r: MonthlyPayment) => {
                    const months = r.month;
                    return current.amortizationSchedule.slice(0, months).reduce((acc: number, curr: MonthlyPayment) => acc + curr.payment, 0);
                }),
                borderColor: 'rgb(34, 197, 94)', // Green for optimized
                backgroundColor: 'rgba(34, 197, 94, 0.5)',
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top' as const },
            title: { display: true, text: 'Comparativa de Coste Acumulado' },
        },
    };

    return (
        <div className="h-64 w-full">
            <Line options={options} data={data} />
        </div>
    );
}
