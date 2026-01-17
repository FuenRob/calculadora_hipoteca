export interface MortgageData {
    propertyPrice: number;       // Precio del inmueble
    downPayment: number;         // Aportación inicial
    amount: number;              // Capital prestado (propertyPrice - downPayment)
    years: number;               // Plazo en años
    interestType: 'fixed' | 'variable' | 'mixed';
    fixedRate?: number;          // Para fijo/mixto (TIN)
    euribor?: number;            // Para variable/mixto
    spread?: number;             // Diferencial para variable
    fixedYears?: number;         // Años fijos en hipoteca mixta
}

export interface BankProduct {
    id: string;
    name: string;
    monthlyCost: number;         // Coste mensual
    interestReduction: number;   // % de bonificación
    selected: boolean;
}

export interface ProductAnalysis {
    product: BankProduct;
    totalCost: number;           // Coste total durante hipoteca
    totalSavings: number;        // Ahorro en intereses
    netBenefit: number;          // Beneficio neto
    breakevenMonth: number | null;// Mes de equilibrio (null si nunca rentabiliza)
    recommended: boolean;        // Si merece la pena
}

export interface MonthlyPayment {
    month: number;
    payment: number;             // Cuota total
    principal: number;           // Amortización capital
    interest: number;            // Intereses
    remainingBalance: number;    // Capital pendiente
    rate: number;                // Tipo aplicado ese mes
}

export interface CalculationResult {
    monthlyPayment: number;      // Cuota inicial
    totalInterest: number;       // Intereses totales
    totalPayment: number;        // Total pagado (Capital + Intereses)
    amortizationSchedule: MonthlyPayment[];
}
