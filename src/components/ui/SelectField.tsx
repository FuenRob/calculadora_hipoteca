import React from 'react';

interface SelectOption {
    value: string;
    label: string;
}

interface SelectFieldProps {
    name: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: SelectOption[];
    className?: string;
}

export function SelectField({ name, value, onChange, options, className = '' }: SelectFieldProps) {
    return (
        <select
            name={name}
            value={value}
            onChange={onChange}
            className={`w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${className}`}
        >
            {options.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
        </select>
    );
}
