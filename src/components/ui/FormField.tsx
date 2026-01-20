import React from 'react';

interface FormFieldProps {
    label: string;
    children: React.ReactNode;
    helpText?: string;
    className?: string;
}

export function FormField({ label, children, helpText, className = '' }: FormFieldProps) {
    return (
        <div className={`space-y-2 ${className}`}>
            <label className="block text-sm font-medium text-slate-700">{label}</label>
            {children}
            {helpText && <p className="text-xs text-slate-500 mt-1">{helpText}</p>}
        </div>
    );
}
