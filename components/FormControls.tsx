import React from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
}

export const InputField: React.FC<InputFieldProps> = ({ label, id, ...props }) => (
  <div className="mb-4">
    {label && <label className="block text-slate-700 font-medium mb-1">{label}</label>}
    <input
      id={id}
      className="w-full px-4 py-2 rounded-lg border border-slate-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all duration-150 bg-white text-black placeholder-black disabled:text-black"
      aria-required={props.required}
      {...props}
    />
  </div>
);

interface TextAreaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  id: string;
}

export const TextAreaField: React.FC<TextAreaFieldProps> = ({ label, id, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">
      {label} {props.required && <span className="text-red-500">*</span>}
    </label>
    <textarea
      id={id}
      className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 text-base text-black placeholder-black disabled:bg-slate-50 disabled:text-black"
      aria-required={props.required}
      {...props}
    />
  </div>
);


interface SelectFieldProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'value' | 'onChange'> {
  label: string;
  id: string;
  options: { value: string; label: string }[];
  value: string; // HTML select element value is always a string
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const SelectField: React.FC<SelectFieldProps> = ({ label, id, options, value, onChange, ...rest }) => (
  <div className="mb-4">
    {label && <label className="block text-slate-700 font-medium mb-1">{label}</label>}
    <select
      id={id}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 rounded-lg border border-slate-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all duration-150 bg-white text-black disabled:text-black"
      aria-required={rest.required}
      {...rest}
    >
      {options.map(option => (
        <option key={option.value} value={option.value} className="text-black">
          {option.label}
        </option>
      ))}
    </select>
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
  <fieldset className={disabled ? 'opacity-70' : ''}>
    <legend className="block text-sm font-medium text-slate-700 mb-1">{label}</legend>
    <div className="mt-2 space-y-2 grid grid-cols-1 sm:grid-cols-2 gap-x-4 max-h-48 overflow-y-auto p-1 border rounded-md border-slate-200 custom-scrollbar">
      {options.map(option => (
        <div key={option} className="flex items-center">
          <input
            id={option.replace(/\s+/g, '-')}
            name={option.replace(/\s+/g, '-')}
            type="checkbox"
            checked={selectedOptions.includes(option)}
            onChange={() => onChange(option)}
            className="h-4 w-4 text-teal-600 border-slate-300 rounded focus:ring-teal-500 disabled:text-slate-400"
            disabled={disabled}
          />
          <label htmlFor={option.replace(/\s+/g, '-')} className={`ml-2 block text-sm text-slate-800 ${disabled ? 'text-slate-500' : ''}`}>
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

export const DateField: React.FC<DateFieldProps> = ({ label, id, ...props }) => {
  // Obtener la fecha de hoy en formato YYYY-MM-DD
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const todayStr = `${yyyy}-${mm}-${dd}`;

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">
        {label} {props.required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={id}
        type="date"
        min={props.min || todayStr}
        className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 text-base text-black placeholder-black disabled:bg-slate-50 disabled:text-black"
        aria-required={props.required}
        {...props}
      />
    </div>
  );
};

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
  <fieldset className={`space-y-2 ${disabled ? 'opacity-70' : ''}`}>
    <legend className="block text-sm font-medium text-slate-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </legend>
    <div className="space-y-2 sm:space-y-0 sm:flex sm:space-x-4">
      {options.map(option => (
        <div key={option.value} className="flex items-center">
          <input
            id={`${name}-${option.value}`}
            name={name}
            type="radio"
            value={option.value}
            checked={selectedValue === option.value}
            onChange={(e) => onChange(e.target.value)}
            className="h-4 w-4 text-teal-600 border-slate-300 focus:ring-teal-500 disabled:text-slate-400"
            aria-required={required}
            disabled={disabled}
          />
          <label htmlFor={`${name}-${option.value}`} className={`ml-2 block text-sm text-slate-800 ${disabled ? 'text-slate-500' : ''}`}>
            {option.label}
          </label>
        </div>
      ))}
    </div>
  </fieldset>
);