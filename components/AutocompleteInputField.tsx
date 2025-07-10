import React, { useState, useCallback, useRef, useEffect } from 'react';

interface AutocompleteInputFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  suggestions: string[];
}

export const AutocompleteInputField: React.FC<AutocompleteInputFieldProps> = ({
  label,
  id,
  value,
  onChange,
  suggestions,
  required,
  placeholder,
  disabled,
  ...props
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    setInputValue(value); // Sync internal input with external value prop
  }, [value]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const userInput = e.target.value;
    setInputValue(userInput);
    onChange(userInput); // Allow form state to update with typed value immediately

    if (userInput.length > 1) {
      const newFilteredSuggestions = suggestions.filter(
        suggestion => suggestion.toLowerCase().includes(userInput.toLowerCase())
      );
      setFilteredSuggestions(newFilteredSuggestions);
      setShowSuggestions(true);
      setActiveSuggestionIndex(-1); // Reset active suggestion
    } else {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
    }
  }, [suggestions, onChange]);

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    onChange(suggestion); // Final selection updates form state
    setFilteredSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || filteredSuggestions.length === 0) return;

    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        if (activeSuggestionIndex >= 0 && activeSuggestionIndex < filteredSuggestions.length) {
          handleSuggestionClick(filteredSuggestions[activeSuggestionIndex]);
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveSuggestionIndex(prev => (prev > 0 ? prev - 1 : filteredSuggestions.length - 1));
        break;
      case 'ArrowDown':
        e.preventDefault();
        setActiveSuggestionIndex(prev => (prev < filteredSuggestions.length - 1 ? prev + 1 : 0));
        break;
      case 'Escape':
        setShowSuggestions(false);
        setFilteredSuggestions([]);
        break;
      default:
        break;
    }
  }, [activeSuggestionIndex, filteredSuggestions, showSuggestions, handleSuggestionClick]);
  
  useEffect(() => {
    if (activeSuggestionIndex >= 0 && suggestionsRef.current) {
      const activeItem = suggestionsRef.current.children[activeSuggestionIndex] as HTMLLIElement;
      activeItem?.scrollIntoView({ block: 'nearest' });
    }
  }, [activeSuggestionIndex]);


  const getHighlightedText = (text: string, highlight: string) => {
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <strong key={i} className="font-bold text-teal-600">{part}</strong>
          ) : (
            part
          )
        )}
      </>
    );
  };
  
  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node) &&
          suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  return (
    <div className="relative">
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={id}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => {
             // Show suggestions if input has value and there are suggestions
             if (inputValue.length > 1 && filteredSuggestions.length > 0) {
                setShowSuggestions(true);
             }
        }}
        className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 text-base text-slate-900 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none placeholder:text-slate-500"
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        ref={inputRef}
        autoComplete="off" // Important for custom autocomplete
        {...props}
      />
      {showSuggestions && filteredSuggestions.length > 0 && (
        <ul 
          ref={suggestionsRef}
          className="absolute z-10 w-full bg-white border border-slate-300 rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto"
          role="listbox"
          aria-labelledby={`${id}-label`}
        >
          {filteredSuggestions.map((suggestion, index) => (
            <li
              key={suggestion}
              onClick={() => handleSuggestionClick(suggestion)}
              onMouseEnter={() => setActiveSuggestionIndex(index)}
              className={`px-3 py-2 cursor-pointer hover:bg-teal-100 text-slate-700 text-sm ${
                index === activeSuggestionIndex ? 'bg-teal-100' : ''
              }`}
              role="option"
              aria-selected={index === activeSuggestionIndex}
              id={`${id}-suggestion-${index}`}
            >
              {getHighlightedText(suggestion, inputValue)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};