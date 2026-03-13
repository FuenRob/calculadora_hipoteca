
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

    const labels: string[] = [];
    const balanceData: number[] = [];
    const interestData: number[] = [];
    let accumulatedInterest = 0;

    for (const r of calculation.amortizationSchedule) {
        accumulatedInterest += r.interest;
        if (r.month % 12 === 0) {
            labels.push(`Año ${r.month / 12}`);
            balanceData.push(r.remainingBalance);
            interestData.push(accumulatedInterest);
        }
    }

    const data = {
        labels,
        datasets: [
            {
                label: 'Capital Pendiente',
                data: balanceData,
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
                fill: true,
            },
            {
                label: 'Intereses Pagados (Acumulado)',
                data: interestData,
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

    const labels: string[] = [];
    const basePaymentData: number[] = [];
    let accumulatedBasePayment = 0;

    for (const r of base.amortizationSchedule) {
        accumulatedBasePayment += r.payment;
        if (r.month % 12 === 0) {
            labels.push(`Año ${r.month / 12}`);
            basePaymentData.push(accumulatedBasePayment);
        }
    }

    const currentPaymentData: number[] = [];
    let accumulatedCurrentPayment = 0;

    for (const r of current.amortizationSchedule) {
        accumulatedCurrentPayment += r.payment;
        if (r.month % 12 === 0) {
            currentPaymentData.push(accumulatedCurrentPayment);
        }
    }

    const data = {
        labels,
        datasets: [
            {
                label: 'Total Pagado (Base)',
                data: basePaymentData,
                borderColor: 'rgb(156, 163, 175)', // Gray for base
                backgroundColor: 'rgba(156, 163, 175, 0.5)',
            },
            {
                label: 'Total Pagado (Con Productos)',
                data: currentPaymentData,
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
