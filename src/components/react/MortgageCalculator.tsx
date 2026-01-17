import React from 'react';
import { useStore } from '@nanostores/react';
import { mortgageData, updateMortgageData } from '../../stores/mortgageStore';

export default function MortgageCalculator() {
    const data = useStore(mortgageData);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        // @ts-ignore
        const val = type === 'number' ? parseFloat(value) : value;
        updateMortgageData({ [name]: val });
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100">
            <h2 className="text-2xl font-bold mb-6 text-slate-800">Datos de la Hipoteca</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">Importe Préstamo (€)</label>
                    <input
                        type="number"
                        name="amount"
                        value={data.amount}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">Plazo (Años)</label>
                    <input
                        type="number"
                        name="years"
                        value={data.years}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">Tipo de Interés</label>
                    <select
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
                        <label className="block text-sm font-medium text-slate-700">Tipo Fijo (%)</label>
                        <input
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
                            <label className="block text-sm font-medium text-slate-700">Euríbor (%)</label>
                            <input
                                type="number"
                                name="euribor"
                                step="0.01"
                                value={data.euribor}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-700">Diferencial (%)</label>
                            <input
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
                        <label className="block text-sm font-medium text-slate-700">Años a Tipo Fijo</label>
                        <input
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
