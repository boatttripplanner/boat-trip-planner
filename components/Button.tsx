import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', className = '', ...props }, ref) => {
    let base = 'inline-flex items-center justify-center font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 transition-all duration-150 px-5 py-2.5 shadow-md';
    let variants = {
      primary: 'bg-gradient-to-r from-teal-500 via-sky-500 to-teal-400 text-white hover:from-teal-600 hover:to-teal-500 hover:shadow-lg',
      secondary: 'bg-white border-2 border-teal-400 text-teal-700 hover:bg-teal-50 hover:border-teal-500',
      danger: 'bg-red-500 text-white hover:bg-red-600',
      disabled: 'bg-slate-200 text-slate-400 cursor-not-allowed',
    };
    let variantClass = variants[variant] || variants.primary;
    return (
      <button
        ref={ref}
        className={`${base} ${variantClass} ${props.disabled ? variants.disabled : ''} ${className}`}
        {...props}
      />
    );
  }
);
