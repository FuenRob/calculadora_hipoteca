
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
import { useMemo } from 'react';
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

    const data = useMemo(() => {
        const labels: string[] = [];
        const balances: number[] = [];
        const cumulativeInterest: number[] = [];
        let accumulatedInterest = 0;

        for (let i = 0; i < calculation.amortizationSchedule.length; i++) {
            const r = calculation.amortizationSchedule[i];
            accumulatedInterest += r.interest;

            if (r.month % 12 === 0) {
                labels.push(`Año ${r.month / 12}`);
                balances.push(r.remainingBalance);
                cumulativeInterest.push(accumulatedInterest);
            }
        }

        return {
            labels,
            datasets: [
                {
                    label: 'Capital Pendiente',
                    data: balances,
                    borderColor: 'rgb(53, 162, 235)',
                    backgroundColor: 'rgba(53, 162, 235, 0.5)',
                    fill: true,
                },
                {
                    label: 'Intereses Pagados (Acumulado)',
                    data: cumulativeInterest,
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    fill: true,
                },
            ],
        };
    }, [calculation.amortizationSchedule]);

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

    const data = useMemo(() => {
        const labels: string[] = [];
        const baseCumulativePayment: number[] = [];
        let baseAccumulated = 0;
        const currentCumulativePayment: number[] = [];
        let currentAccumulated = 0;

        const maxLength = Math.max(base.amortizationSchedule.length, current.amortizationSchedule.length);

        for (let i = 0; i < maxLength; i++) {
            const baseRow = base.amortizationSchedule[i];
            const currentRow = current.amortizationSchedule[i];

            let shouldPush = false;
            let month = 0;

            if (baseRow) {
                baseAccumulated += baseRow.payment;
                shouldPush = baseRow.month % 12 === 0;
                month = baseRow.month;
            }

            if (currentRow) {
                currentAccumulated += currentRow.payment;
                shouldPush = shouldPush || currentRow.month % 12 === 0;
                if (!baseRow) month = currentRow.month;
            }

            if (shouldPush) {
                labels.push(`Año ${month / 12}`);
                baseCumulativePayment.push(baseAccumulated);
                currentCumulativePayment.push(currentAccumulated);
            }
        }

        return {
            labels,
            datasets: [
                {
                    label: 'Total Pagado (Base)',
                    data: baseCumulativePayment,
                    borderColor: 'rgb(156, 163, 175)', // Gray for base
                    backgroundColor: 'rgba(156, 163, 175, 0.5)',
                },
                {
                    label: 'Total Pagado (Con Productos)',
                    data: currentCumulativePayment,
                    borderColor: 'rgb(34, 197, 94)', // Green for optimized
                    backgroundColor: 'rgba(34, 197, 94, 0.5)',
                },
            ],
        };
    }, [base.amortizationSchedule, current.amortizationSchedule]);

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
