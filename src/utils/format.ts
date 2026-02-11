const currencyFormatter = new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
});

const currencyCompactFormatter = new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
});

const percentFormatter = new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 2
});

const numberFormatter = new Intl.NumberFormat('es-ES');

export function formatCurrency(value: number): string {
    return currencyFormatter.format(value);
}

export function formatCurrencyCompact(value: number): string {
    return currencyCompactFormatter.format(value);
}

export function formatPercent(value: number): string {
    return percentFormatter.format(value);
}

export function formatNumber(value: number): string {
    return numberFormatter.format(value);
}
