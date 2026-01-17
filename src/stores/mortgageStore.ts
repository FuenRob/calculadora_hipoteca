import { atom, computed } from 'nanostores';
import type { MortgageData, BankProduct, CalculationResult, ProductAnalysis } from '../types';
import { calculateMortgage } from '../utils/mortgageCalculations';
import { analyzeProducts, calculateWithSelectedProducts } from '../utils/productAnalysis';

export const mortgageData = atom<MortgageData>({
    amount: 200000,
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
export const productAnalysis = computed([mortgageData, products], (data, currentProducts) => {
    return analyzeProducts(data, currentProducts);
});

export function updateMortgageData(newData: Partial<MortgageData>) {
    mortgageData.set({ ...mortgageData.get(), ...newData });
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
