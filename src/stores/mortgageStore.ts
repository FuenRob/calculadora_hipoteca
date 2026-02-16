import { atom, computed } from 'nanostores';
import type { MortgageData, BankProduct, CalculationResult, ProductAnalysis } from '../types';
import { calculateMortgage } from '../utils/mortgageCalculations';
import { analyzeProducts, calculateWithSelectedProducts } from '../utils/productAnalysis';

export const mortgageData = atom<MortgageData>({
    propertyPrice: 250000,
    downPayment: 50000,
    amount: 200000, // 250k - 50k
    years: 25,
    interestType: 'fixed',
    fixedRate: 3.5,
    euribor: 3.0,
    spread: 1.0,
    fixedYears: 5
});

export const products = atom<BankProduct[]>([
    { id: '1', name: 'Nómina', monthlyCost: 0, interestReduction: 0.5, selected: false },
    { id: '2', name: 'Seguro de Hogar', monthlyCost: 20, interestReduction: 0.2, selected: false },
    { id: '3', name: 'Seguro de Vida', monthlyCost: 30, interestReduction: 0.3, selected: false },
]);

// Resultado base (sin bonificaciones)
export const baseCalculation = computed(mortgageData, (data) => {
    return calculateMortgage(data);
});

// Resultado con productos seleccionados
export const currentCalculation = computed([mortgageData, products], (data, currentProducts) => {
    return calculateWithSelectedProducts(data, currentProducts);
});

// Análisis de productos
export const productAnalysis = computed([mortgageData, products, baseCalculation], (data, currentProducts, base) => {
    return analyzeProducts(data, currentProducts, base);
});

export function updateMortgageData(newData: Partial<MortgageData>) {
    const current = mortgageData.get();
    let updated = { ...current, ...newData };

    // Logic to keep Price, Down Payment and Loan Amount in sync
    // Case 1: Updating Property Price -> update Loan Amount (keeping Down Payment constant)
    if (newData.propertyPrice !== undefined && newData.downPayment === undefined && newData.amount === undefined) {
        updated.amount = Math.max(0, newData.propertyPrice - current.downPayment);
    }
    // Case 2: Updating Down Payment -> update Loan Amount (keeping Price constant)
    else if (newData.downPayment !== undefined && newData.propertyPrice === undefined && newData.amount === undefined) {
        updated.amount = Math.max(0, current.propertyPrice - newData.downPayment);
    }
    // Case 3: Updating Loan Amount -> update Down Payment (keeping Price constant)
    else if (newData.amount !== undefined && newData.propertyPrice === undefined && newData.downPayment === undefined) {
        // Prevent negative down payment if loan > price? Or allow it? 
        // Let's assume Price is the anchor.
        if (newData.amount > current.propertyPrice) {
            // If loan exceeds price, maybe update price? Or set down payment to 0 and clamp loan?
            // Let's clamp loan to price for sanity, or update price. 
            // Common behavior: Loan is what it is. If Loan > Price, Price must increase.
            updated.propertyPrice = newData.amount;
            updated.downPayment = 0;
        } else {
            updated.downPayment = current.propertyPrice - newData.amount;
        }
    }

    mortgageData.set(updated);
}

export function addProduct(product: Omit<BankProduct, 'id' | 'selected'>) {
    const newProduct: BankProduct = {
        ...product,
        id: crypto.randomUUID(),
        selected: false
    };
    products.set([...products.get(), newProduct]);
}

export function toggleProductSelection(id: string) {
    const current = products.get();
    products.set(current.map(p =>
        p.id === id ? { ...p, selected: !p.selected } : p
    ));
}

export function removeProduct(id: string) {
    products.set(products.get().filter(p => p.id !== id));
}
