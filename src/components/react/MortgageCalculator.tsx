import React, { useState, useEffect, useMemo } from 'react';
import { useStore } from '@nanostores/react';
import { mortgageData, updateMortgageData } from '../../stores/mortgageStore';
import type { MortgageData } from '../../types';
import { formatNumber } from '../../utils/format';
import { debounce } from '../../utils/debounce';

type FormattedField = 'amount' | 'propertyPrice' | 'downPayment';

export default function MortgageCalculator() {
    const data = useStore(mortgageData);
    const [localFields, setLocalFields] = useState({
        amount: '',
        propertyPrice: '',
        downPayment: ''
    });

    const formatValue = (val: number | undefined) => {
        if (val === undefined || val === null) return '';
        return formatNumber(val);
    };

    const debouncedUpdate = useMemo(
        () => debounce((data: Partial<MortgageData>) => updateMortgageData(data), 300),
        []
    );

    // Generic sync function
    useEffect(() => {
        // We sync if store values diverge from local PARSED values.
        // This handles external updates (like one field updating another in store logic)
        // while preventing overwrite of user typing if they match.

        const syncField = (key: FormattedField, storeVal: number | undefined) => {
            if (storeVal === undefined) return;

            // Get current local valid number
            const localRaw = localFields[key].replace(/\./g, '').replace(',', '.');
            const localParsed = parseFloat(localRaw);

            if (localParsed !== storeVal) {
                setLocalFields(prev => ({
                    ...prev,
                    [key]: formatValue(storeVal)
                }));
            }
        };

        syncField('amount', data.amount);
        syncField('propertyPrice', data.propertyPrice);
        syncField('downPayment', data.downPayment);

    }, [data.amount, data.propertyPrice, data.downPayment]);


    const handleFormattedChange = (field: FormattedField) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (!/^[\d.,]*$/.test(val)) return;

        // Parse
        const cleanForParse = val.replace(/\./g, '').replace(',', '.');
        const numValue = parseFloat(cleanForParse);

        // Update Store
        if (!isNaN(numValue)) {
            debouncedUpdate({ [field]: numValue });
        } else if (val === '') {
            debouncedUpdate({ [field]: 0 });
        }

        // Format Display
        const parts = val.split(',');
        let integerPart = parts[0].replace(/\./g, '');
        if (integerPart) {
            const parsedInt = parseFloat(integerPart);
            if (!isNaN(parsedInt)) {
                integerPart = formatNumber(parsedInt);
            }
        }
        let newDisplay = integerPart;
        if (parts.length > 1) newDisplay += ',' + parts[1];
        else if (val.endsWith(',')) newDisplay += ',';

        setLocalFields(prev => ({ ...prev, [field]: newDisplay }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (name === 'interestType') {
            updateMortgageData({ interestType: value as MortgageData['interestType'] });
            return;
        }

        if (type === 'number') {
            updateMortgageData({ [name]: parseFloat(value) } as Partial<MortgageData>);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100">
            <h2 className="text-2xl font-bold mb-6 text-slate-800">Datos de la Hipoteca</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* New Fields */}
                <div className="space-y-2">
                    <label htmlFor="propertyPrice" className="block text-sm font-medium text-slate-700">Precio Inmueble (€)</label>
                    <input
                        id="propertyPrice"
                        type="text"
                        value={localFields.propertyPrice}
                        onChange={handleFormattedChange('propertyPrice')}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="downPayment" className="block text-sm font-medium text-slate-700">Aportación Inicial (€)</label>
                    <input
                        id="downPayment"
                        type="text"
                        value={localFields.downPayment}
                        onChange={handleFormattedChange('downPayment')}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="amount" className="block text-sm font-medium text-slate-700">Importe Préstamo (€)</label>
                    <input
                        id="amount"
                        type="text"
                        aria-describedby="amount-helper"
                        value={localFields.amount}
                        onChange={handleFormattedChange('amount')}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-slate-50"
                    />
                    <p id="amount-helper" className="text-xs text-slate-500 mt-1">Calculado automáticamente (Precio - Aportación)</p>
                </div>

                <div className="space-y-2">
                    <label htmlFor="years" className="block text-sm font-medium text-slate-700">Plazo (Años)</label>
                    <input
                        id="years"
                        type="number"
                        name="years"
                        value={data.years}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="interestType" className="block text-sm font-medium text-slate-700">Tipo de Interés</label>
                    <select
                        id="interestType"
                        name="interestType"
                        value={data.interestType}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                        <option value="fixed">Fijo</option>
                        <option value="variable">Variable</option>
                        <option value="mixed">Mixto</option>
                    </select>
                </div>

                {data.interestType === 'fixed' && (
                    <div className="space-y-2">
                        <label htmlFor="fixedRate" className="block text-sm font-medium text-slate-700">Tipo Fijo (%)</label>
                        <input
                            id="fixedRate"
                            type="number"
                            name="fixedRate"
                            step="0.01"
                            value={data.fixedRate}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                    </div>
                )}

                {(data.interestType === 'variable' || data.interestType === 'mixed') && (
                    <>
                        <div className="space-y-2">
                            <label htmlFor="euribor" className="block text-sm font-medium text-slate-700">Euríbor (%)</label>
                            <input
                                id="euribor"
                                type="number"
                                name="euribor"
                                step="0.01"
                                value={data.euribor}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="spread" className="block text-sm font-medium text-slate-700">Diferencial (%)</label>
                            <input
                                id="spread"
                                type="number"
                                name="spread"
                                step="0.01"
                                value={data.spread}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            />
                        </div>
                    </>
                )}

                {data.interestType === 'mixed' && (
                    <div className="space-y-2">
                        <label htmlFor="fixedYears" className="block text-sm font-medium text-slate-700">Años a Tipo Fijo</label>
                        <input
                            id="fixedYears"
                            type="number"
                            name="fixedYears"
                            value={data.fixedYears}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
