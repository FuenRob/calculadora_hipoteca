import React, { useState } from 'react';
import { useStore } from '@nanostores/react';
import { productAnalysis, addProduct, toggleProductSelection, removeProduct } from '../../stores/mortgageStore';
import { formatCurrencyCompact, formatPercent, formatCurrencyWhole } from '../../utils/format';

export default function ProductManager() {
    const analysis = useStore(productAnalysis);
    const [isAdding, setIsAdding] = useState(false);
    const [newProduct, setNewProduct] = useState({ name: '', monthlyCost: 0, interestReduction: 0 });

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        addProduct(newProduct);
        setNewProduct({ name: '', monthlyCost: 0, interestReduction: 0 });
        setIsAdding(false);
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100 mt-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Productos Bancarios</h2>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                >
                    {isAdding ? 'Cancelar' : 'Añadir Producto'}
                </button>
            </div>

            {isAdding && (
                <form onSubmit={handleAdd} className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200 animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Nombre</label>
                            <input
                                type="text"
                                required
                                placeholder="Ej: Seguro Vida"
                                className="w-full px-3 py-2 border rounded-md"
                                value={newProduct.name}
                                onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Coste Mensual (€)</label>
                            <input
                                type="number"
                                step="0.01"
                                required
                                className="w-full px-3 py-2 border rounded-md"
                                value={newProduct.monthlyCost}
                                onChange={e => setNewProduct({ ...newProduct, monthlyCost: parseFloat(e.target.value) })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Rebaja Interés (%)</label>
                            <input
                                type="number"
                                step="0.01"
                                required
                                className="w-full px-3 py-2 border rounded-md"
                                value={newProduct.interestReduction}
                                onChange={e => setNewProduct({ ...newProduct, interestReduction: parseFloat(e.target.value) })}
                            />
                        </div>
                    </div>
                    <button type="submit" className="mt-4 w-full bg-slate-800 text-white py-2 rounded-lg hover:bg-slate-900">
                        Guardar Producto
                    </button>
                </form>
            )}

            <div className="grid gap-4">
                {analysis.map((item) => {
                    const { product, netBenefit, recommended, breakevenMonth, totalSavings, totalCost } = item;
                    return (
                        <div
                            key={product.id}
                            className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer
                                ${product.selected
                                    ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500'
                                    : 'bg-white border-slate-200 hover:border-blue-300'}`}
                            onClick={() => toggleProductSelection(product.id)}
                        >
                            <div className="flex flex-col sm:flex-row justify-between gap-4">
                                <div className="flex items-start gap-3 flex-1">
                                    <input
                                        type="checkbox"
                                        checked={product.selected}
                                        onChange={() => { }} // Handled by div click
                                        className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-blue-500 flex-shrink-0"
                                    />
                                    <div className="w-full">
                                        <div className="flex justify-between items-start flex-wrap gap-2">
                                            <h3 className="font-semibold text-slate-800">{product.name}</h3>
                                            {recommended ? (
                                                <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-bold whitespace-nowrap">
                                                    ✓ Recomendado
                                                </span>
                                            ) : (
                                                <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap">
                                                    ✗ No compensa
                                                </span>
                                            )}
                                        </div>

                                        <div className="text-sm text-slate-500 mt-2 space-y-1">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                                                <div>
                                                    Coste: <span className="font-medium text-slate-700">{formatCurrencyCompact(product.monthlyCost)} €/mes</span>
                                                </div>
                                                <div>
                                                    Bonificación: <span className="font-medium text-green-600">-{formatPercent(product.interestReduction)}%</span>
                                                </div>
                                            </div>

                                            <div className="pt-2 mt-2 border-t border-slate-100 text-xs space-y-1">
                                                <div className="flex justify-between">
                                                    <span>Ahorro total en intereses:</span>
                                                    <span className="font-semibold text-green-600">{formatCurrencyWhole(totalSavings)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Coste total del producto:</span>
                                                    <span className="font-semibold text-red-600">{formatCurrencyWhole(totalCost)}</span>
                                                </div>
                                                <div className="flex justify-between pt-1 border-t border-slate-100">
                                                    <span className="font-bold">Beneficio neto:</span>
                                                    <span className={`font-bold ${netBenefit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                        {formatCurrencyWhole(netBenefit)}
                                                    </span>
                                                </div>
                                                {breakevenMonth && (
                                                    <div className="text-slate-400 italic">
                                                        Se amortiza en el mes {breakevenMonth}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={(e) => { e.stopPropagation(); removeProduct(product.id); }}
                                    className="self-start sm:self-center px-3 py-1 text-red-500 hover:bg-red-50 rounded transition-colors text-sm whitespace-nowrap"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    );
                })}
                {analysis.length === 0 && (
                    <p className="text-center text-slate-400 py-4">No hay productos definidos</p>
                )}
            </div>
        </div>
    );
}
