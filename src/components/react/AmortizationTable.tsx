import { useStore } from '@nanostores/react';
import { currentCalculation } from '../../stores/mortgageStore';

export default function AmortizationTable() {
    const calculation = useStore(currentCalculation);

    if (!calculation) return null;

    const { amortizationSchedule } = calculation;

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100 mt-6 overflow-hidden">
            <h2 className="text-2xl font-bold mb-6 text-slate-800">Tabla de Amortización</h2>

            <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                <table className="min-w-full text-sm">
                    <thead className="bg-slate-50 sticky top-0">
                        <tr>
                            <th className="px-4 py-3 text-left font-medium text-slate-500">Mes</th>
                            <th className="px-4 py-3 text-right font-medium text-slate-500">Cuota</th>
                            <th className="px-4 py-3 text-right font-medium text-slate-500">Capital</th>
                            <th className="px-4 py-3 text-right font-medium text-slate-500">Interés</th>
                            <th className="px-4 py-3 text-right font-medium text-slate-500">Pendiente</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {amortizationSchedule.map((row) => (
                            <tr key={row.month} className="hover:bg-slate-50 transition-colors">
                                <td className="px-4 py-2 font-medium text-slate-900">{row.month}</td>
                                <td className="px-4 py-2 text-right font-mono text-slate-600">{row.payment.toFixed(2)} €</td>
                                <td className="px-4 py-2 text-right font-mono text-slate-600">{row.principal.toFixed(2)} €</td>
                                <td className="px-4 py-2 text-right font-mono text-red-500">{row.interest.toFixed(2)} €</td>
                                <td className="px-4 py-2 text-right font-mono text-slate-600">{row.remainingBalance.toFixed(2)} €</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
