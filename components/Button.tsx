import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  className, 
  variant = 'primary', 
  size = 'md',
  ...props 
}) => {
  const coreStyles = "font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all ease-in-out duration-200 transform hover:-translate-y-0.5 disabled:transform-none";
  
  const variantStyles = {
    primary: "bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white focus:ring-teal-400 disabled:from-teal-400 disabled:to-teal-500 disabled:opacity-70",
    secondary: "bg-slate-200 hover:bg-slate-300 text-slate-800 focus:ring-teal-500 disabled:bg-slate-100 disabled:text-slate-400",
  };

  const sizeSpecificStyles = {
    md: "py-2 px-4",
    sm: "py-1.5 px-3 text-sm",
  };

  return (
    <button
      className={`${coreStyles} ${sizeSpecificStyles[size]} ${variantStyles[variant]} ${className || ''}`}
      {...props}
    >
      {children}
    </button>
  );
};
