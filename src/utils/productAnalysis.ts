import type { MortgageData, BankProduct, ProductAnalysis } from '../types';
import { calculateMortgage } from './mortgageCalculations';

export function analyzeProducts(data: MortgageData, products: BankProduct[]): ProductAnalysis[] {
    // 1. Escenario base sin productos
    const baseResult = calculateMortgage(data);
    const baseTotalInterest = baseResult.totalInterest;

    // 2. Analizar cada producto individualmente (o acumulado, según instrucciones)
    // Las instrucciones sugieren evaluar si "merece la pena", usualmente es incremental.
    // Vamos a asumir un análisis marginal para cada producto: ¿Qué pasa si añado este producto?

    return products.map(product => {
        // Clonar data y aplicar bonificación
        const specificData = { ...data };

        // Aplicar reducción según el tipo de interés
        if (specificData.interestType === 'fixed') {
            if (specificData.fixedRate) specificData.fixedRate -= product.interestReduction;
        } else if (specificData.interestType === 'variable') {
            if (specificData.spread) specificData.spread -= product.interestReduction;
        } else if (specificData.interestType === 'mixed') {
            if (specificData.fixedRate) specificData.fixedRate -= product.interestReduction;
            if (specificData.spread) specificData.spread -= product.interestReduction;
        }

        const withProductResult = calculateMortgage(specificData);
        const withProductTotalInterest = withProductResult.totalInterest;

        const totalSavings = baseTotalInterest - withProductTotalInterest;
        const totalProductCost = product.monthlyCost * data.years * 12;
        const netBenefit = totalSavings - totalProductCost;

        // Calcular punto de equilibrio
        // Buscar mes donde Ahorro acumulado > Coste acumulado
        let breakevenMonth: number | null = null;
        let accumulatedSavings = 0;

        for (let i = 0; i < baseResult.amortizationSchedule.length; i++) {
            const basePayment = baseResult.amortizationSchedule[i];
            const withProductPayment = withProductResult.amortizationSchedule[i];

            const monthlySavings = basePayment.payment - withProductPayment.payment;
            accumulatedSavings += monthlySavings;
            const accumulatedCost = product.monthlyCost * (i + 1);

            if (accumulatedSavings > accumulatedCost) {
                breakevenMonth = i + 1;
                break;
            }
        }

        return {
            product,
            totalCost: totalProductCost,
            totalSavings,
            netBenefit,
            breakevenMonth,
            recommended: netBenefit > 0
        };
    });
}

export function calculateWithSelectedProducts(data: MortgageData, products: BankProduct[]): CalculationResult {
    const selectedProducts = products.filter(p => p.selected);
    const finalData = { ...data };

    const totalReduction = selectedProducts.reduce((acc, curr) => acc + curr.interestReduction, 0);

    if (finalData.interestType === 'fixed') {
        if (finalData.fixedRate) finalData.fixedRate = Math.max(0, finalData.fixedRate - totalReduction);
    } else if (finalData.interestType === 'variable') {
        if (finalData.spread) finalData.spread = Math.max(0, finalData.spread - totalReduction);
    } else if (finalData.interestType === 'mixed') {
        if (finalData.fixedRate) finalData.fixedRate = Math.max(0, finalData.fixedRate - totalReduction);
        if (finalData.spread) finalData.spread = Math.max(0, finalData.spread - totalReduction);
    }

    return calculateMortgage(finalData);
}
