export function formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-ES', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
}

export function formatCurrencyCompact(value: number): string {
    return new Intl.NumberFormat('es-ES', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }).format(value);
}

export function formatPercent(value: number): string {
    return new Intl.NumberFormat('es-ES', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 2
    }).format(value);
}

export function formatNumber(value: number): string {
    return new Intl.NumberFormat('es-ES').format(value);
}
