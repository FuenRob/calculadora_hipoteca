import React, { useState } from 'react';
import { useStore } from '@nanostores/react';
import { products, addProduct, toggleProductSelection, removeProduct } from '../../stores/mortgageStore';

export default function ProductManager() {
    const allProducts = useStore(products);
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
                {allProducts.map(product => (
                    <div
                        key={product.id}
                        className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer flex justify-between items-center
              ${product.selected
                                ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500'
                                : 'bg-white border-slate-200 hover:border-blue-300'}`}
                        onClick={() => toggleProductSelection(product.id)}
                    >
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={product.selected}
                                onChange={() => { }} // Handled by div click
                                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <div>
                                <h3 className="font-semibold text-slate-800">{product.name}</h3>
                                <p className="text-sm text-slate-500">
                                    Coste: <span className="font-medium text-slate-700">{new Intl.NumberFormat('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(product.monthlyCost)} €/mes</span>
                                    {' • '}
                                    Bonificación: <span className="font-medium text-green-600">-{new Intl.NumberFormat('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 2 }).format(product.interestReduction)}%</span>
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={(e) => { e.stopPropagation(); removeProduct(product.id); }}
                            className="px-2 py-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                        >
                            Eliminar
                        </button>
                    </div>
                ))}
                {allProducts.length === 0 && (
                    <p className="text-center text-slate-400 py-4">No hay productos definidos</p>
                )}
            </div>
        </div>
    );
}
