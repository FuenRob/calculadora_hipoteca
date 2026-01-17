import type { MortgageData, MonthlyPayment, CalculationResult } from '../types';

export function calculateMortgage(data: MortgageData): CalculationResult {
    const { amount, years, interestType, fixedRate, euribor, spread, fixedYears } = data;
    const totalMonths = years * 12;
    const schedule: MonthlyPayment[] = [];

    let currentBalance = amount;
    let totalInterest = 0;

    // Determinamos la tasa mensual inicial
    let annualRate = 0;

    if (interestType === 'fixed') {
        annualRate = (fixedRate || 0);
    } else if (interestType === 'variable') {
        annualRate = (euribor || 0) + (spread || 0);
    } else if (interestType === 'mixed') {
        // Para simplificar el cálculo inicial, usamos la parte fija
        // En una implementación más completa, esto debería ser más dinámico
        annualRate = (fixedRate || 0);
    }

    // Si la tasa es 0, no hay intereses (caso borde) / evita división por cero
    if (annualRate <= 0 && amount > 0) {
        const monthlyPayment = amount / totalMonths;
        for (let i = 1; i <= totalMonths; i++) {
            schedule.push({
                month: i,
                payment: monthlyPayment,
                principal: monthlyPayment,
                interest: 0,
                remainingBalance: amount - (monthlyPayment * i),
                rate: 0
            });
        }
        return {
            monthlyPayment,
            totalInterest: 0,
            totalPayment: amount,
            amortizationSchedule: schedule
        };
    }

    // Cálculo de cuota mensual (Fórmula francesa) para tramo fijo inicial
    // C = P * [r(1+r)^n] / [(1+r)^n - 1]
    const calculatePayment = (principal: number, annualRate: number, remainingMonths: number) => {
        const monthlyRate = annualRate / 100 / 12;
        return principal * (monthlyRate * Math.pow(1 + monthlyRate, remainingMonths)) / (Math.pow(1 + monthlyRate, remainingMonths) - 1);
    };

    let currentPayment = calculatePayment(currentBalance, annualRate, totalMonths);
    const initialPayment = currentPayment;

    for (let month = 1; month <= totalMonths; month++) {
        // Ajuste de tasa para mixta
        let currentAnnualRate = annualRate;
        if (interestType === 'mixed' && fixedYears && month > fixedYears * 12) {
            currentAnnualRate = (euribor || 0) + (spread || 0);
            // Recalcular cuota si cambia el tipo
            if (month === (fixedYears * 12) + 1) {
                currentPayment = calculatePayment(currentBalance, currentAnnualRate, totalMonths - month + 1);
            }
        }

        const monthlyRate = currentAnnualRate / 100 / 12;
        const interest = currentBalance * monthlyRate;
        const principal = currentPayment - interest;

        currentBalance -= principal;
        if (currentBalance < 0) currentBalance = 0; // Evitar decimales negativos finales

        totalInterest += interest;

        schedule.push({
            month,
            payment: currentPayment,
            principal,
            interest,
            remainingBalance: currentBalance,
            rate: currentAnnualRate
        });
    }

    return {
        monthlyPayment: initialPayment,
        totalInterest,
        totalPayment: amount + totalInterest,
        amortizationSchedule: schedule
    };
}
