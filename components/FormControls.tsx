import React from 'react';
import { MapPinIcon } from './icons/MapPinIcon';
import { WindIcon } from './icons/WindIcon';
import { AlertTriangleIcon } from './icons/AlertTriangleIcon';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  error?: string;
  icon?: React.ReactNode;
}

export const InputField: React.FC<InputFieldProps> = ({ label, id, error, icon, ...props }) => (
  <div className="mb-7 relative group">
    <label htmlFor={id} className="block text-base font-bold text-primary mb-3">
      {icon ? <span className="inline-block align-middle mr-2 text-secondary">{icon}</span> : null}
      {label} {props.required && <span className="text-accent">*</span>}
    </label>
    <div className="relative">
      <input
        id={id}
        className={`mt-1 block w-full px-6 py-4 bg-white/80 border-2 rounded-2xl shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-base text-primary placeholder:text-secondary/70 disabled:bg-bg-wave disabled:text-secondary/60 transition-all duration-300 font-bold backdrop-blur-md ${error ? 'border-red-400 focus:ring-red-400 focus:border-red-400 animate-shake' : 'border-bg-wave'}`}
        aria-required={props.required}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      />
      {error && (
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500 animate-pulse" id={`${id}-error`} aria-live="polite">
          <AlertTriangleIcon className="w-5 h-5 inline-block mr-1" />
        </span>
      )}
    </div>
    {error && (
      <div className="text-red-500 text-sm mt-1 flex items-center gap-1 animate-fade-in" aria-live="polite">
        <AlertTriangleIcon className="w-4 h-4" /> {error}
      </div>
    )}
  </div>
);

interface TextAreaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  id: string;
  error?: string;
  icon?: React.ReactNode;
}

export const TextAreaField: React.FC<TextAreaFieldProps> = ({ label, id, error, icon, ...props }) => (
  <div className="mb-7 relative group">
    <label htmlFor={id} className="block text-base font-bold text-primary mb-3">
      {icon ? <span className="inline-block align-middle mr-2 text-secondary">{icon}</span> : null}
      {label} {props.required && <span className="text-accent">*</span>}
    </label>
    <div className="relative">
      <textarea
        id={id}
        className={`mt-1 block w-full px-6 py-4 bg-white/80 border-2 rounded-2xl shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-base text-primary placeholder:text-secondary/70 disabled:bg-bg-wave disabled:text-secondary/60 transition-all duration-300 font-bold backdrop-blur-md ${error ? 'border-red-400 focus:ring-red-400 focus:border-red-400 animate-shake' : 'border-bg-wave'}`}
        aria-required={props.required}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      />
      {error && (
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500 animate-pulse" id={`${id}-error`} aria-live="polite">
          <AlertTriangleIcon className="w-5 h-5 inline-block mr-1" />
        </span>
      )}
    </div>
    {error && (
      <div className="text-red-500 text-sm mt-1 flex items-center gap-1 animate-fade-in" aria-live="polite">
        <AlertTriangleIcon className="w-4 h-4" /> {error}
      </div>
    )}
  </div>
);

interface SelectFieldProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'value' | 'onChange'> {
  label: string;
  id: string;
  options: { value: string; label: string }[];
  value: string; // HTML select element value is always a string
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
  icon?: React.ReactNode;
}

export const SelectField: React.FC<SelectFieldProps> = ({ label, id, options, value, onChange, error, icon, ...rest }) => (
  <div className="mb-7 relative group">
    <label htmlFor={id} className="block text-base font-bold text-primary mb-3">
      {icon ? <span className="inline-block align-middle mr-2 text-secondary">{icon}</span> : null}
      {label} {rest.required && <span className="text-accent">*</span>}
    </label>
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={onChange}
        className={`mt-1 block w-full pl-6 py-4 text-base border-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary rounded-2xl shadow-md bg-white/80 text-primary placeholder:text-secondary/70 disabled:bg-bg-wave disabled:text-secondary/60 transition-all duration-300 font-bold backdrop-blur-md ${error ? 'border-red-400 focus:ring-red-400 focus:border-red-400 animate-shake' : 'border-bg-wave'}`}
        aria-required={rest.required}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        {...rest}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {icon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary pointer-events-none">
          {icon}
        </span>
      )}
      {error && (
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500 animate-pulse" id={`${id}-error`} aria-live="polite">
          <AlertTriangleIcon className="w-5 h-5 inline-block mr-1" />
        </span>
      )}
    </div>
    {error && (
      <div className="text-red-500 text-sm mt-1 flex items-center gap-1 animate-fade-in" aria-live="polite">
        <AlertTriangleIcon className="w-4 h-4" /> {error}
      </div>
    )}
  </div>
);

interface CheckboxGroupProps {
  label: string;
  options: string[];
  selectedOptions: string[];
  onChange: (option: string) => void;
  disabled?: boolean;
}

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({ label, options, selectedOptions, onChange, disabled }) => (
  <fieldset className={disabled ? 'opacity-70 mb-7' : 'mb-7'}>
    <legend className="block text-base font-bold text-primary mb-3">{label}</legend>
    <div className="mt-2 space-y-2 grid grid-cols-1 sm:grid-cols-2 gap-x-4 max-h-48 overflow-y-auto p-2 border-2 rounded-2xl border-bg-wave custom-scrollbar bg-white">
      {options.map(option => (
        <div key={option} className="flex items-center">
          <input
            id={option.replace(/\s+/g, '-')}
            name={option.replace(/\s+/g, '-')}
            type="checkbox"
            checked={selectedOptions.includes(option)}
            onChange={() => onChange(option)}
            className="h-6 w-6 text-primary border-bg-wave rounded focus:ring-2 focus:ring-primary transition-all duration-200 font-bold"
            disabled={disabled}
          />
          <label htmlFor={option.replace(/\s+/g, '-')} className={`ml-4 block text-base font-bold text-primary ${disabled ? 'text-secondary/60' : ''}`}>
            {option}
          </label>
        </div>
      ))}
    </div>
  </fieldset>
);

interface DateFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
}

export const DateField: React.FC<DateFieldProps> = ({ label, id, ...props }) => (
  <div className="mb-7">
    <label htmlFor={id} className="block text-base font-bold text-primary mb-3">
      {label} {props.required && <span className="text-accent">*</span>}
    </label>
    <input
      id={id}
      type="date"
      className="mt-1 block w-full px-6 py-4 bg-white border-2 border-bg-wave rounded-2xl shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-base text-primary placeholder:text-secondary/70 disabled:bg-bg-wave disabled:text-secondary/60 transition-all duration-200 font-bold"
      aria-required={props.required}
      {...props}
    />
  </div>
);

interface RadioGroupProps {
  label: string;
  name: string;
  options: { value: string; label: string }[];
  selectedValue: string;
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({ label, name, options, selectedValue, onChange, required, disabled }) => (
  <fieldset className={`space-y-2 mb-7 ${disabled ? 'opacity-70' : ''}`}>
    <legend className="block text-base font-bold text-primary mb-3">
      {label} {required && <span className="text-accent">*</span>}
    </legend>
    <div className="space-y-2 sm:space-y-0 sm:flex sm:space-x-6">
      {options.map(option => (
        <div key={option.value} className="flex items-center">
          <input
            id={`${name}-${option.value}`}
            name={name}
            type="radio"
            value={option.value}
            checked={selectedValue === option.value}
            onChange={(e) => onChange(e.target.value)}
            className="h-6 w-6 text-primary border-bg-wave focus:ring-2 focus:ring-primary transition-all duration-200 font-bold"
            aria-required={required}
            disabled={disabled}
          />
          <label htmlFor={`${name}-${option.value}`} className={`ml-4 block text-base font-bold text-primary ${disabled ? 'text-secondary/60' : ''}`}>
            {option.label}
          </label>
        </div>
      ))}
    </div>
  </fieldset>
);