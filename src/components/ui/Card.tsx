import React from 'react';

interface CardProps {
    title?: string;
    children: React.ReactNode;
    className?: string;
}

export function Card({ title, children, className = '' }: CardProps) {
    return (
        <div className={`bg-white p-6 rounded-xl shadow-lg border border-slate-100 ${className}`}>
            {title && <h2 className="text-2xl font-bold mb-6 text-slate-800">{title}</h2>}
            {children}
        </div>
    );
}
