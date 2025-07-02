import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Check } from 'lucide-react';

interface Option {
  value: string;
  label: string;
  avatar?: string;
  subtitle?: string;
}

interface SearchableSelectProps {
  options: Option[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  className?: string;
  disabled?: boolean;
  multiple?: boolean;
  values?: string[];
  onMultiChange?: (values: string[]) => void;
}

export default function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = "Tanlang...",
  searchPlaceholder = "Qidirish...",
  className = "",
  disabled = false,
  multiple = false,
  values = [],
  onMultiChange
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    option.subtitle?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOption = options.find(opt => opt.value === value);
  const selectedOptions = multiple ? options.filter(opt => values.includes(opt.value)) : [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelect = (optionValue: string) => {
    if (multiple && onMultiChange) {
      const newValues = values.includes(optionValue)
        ? values.filter(v => v !== optionValue)
        : [...values, optionValue];
      onMultiChange(newValues);
    } else {
      onChange(optionValue);
      setIsOpen(false);
      setSearchTerm('');
    }
  };

  const getDisplayText = () => {
    if (multiple) {
      if (selectedOptions.length === 0) return placeholder;
      if (selectedOptions.length === 1) return selectedOptions[0].label;
      return `${selectedOptions.length} ta tanlangan`;
    }
    return selectedOption ? selectedOption.label : placeholder;
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full px-3 py-2 text-left bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-400 dark:hover:border-gray-500'
        } ${isOpen ? 'ring-2 ring-primary-500 border-transparent' : ''}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {multiple && selectedOptions.length > 0 ? (
              <div className="flex items-center gap-1 flex-wrap">
                {selectedOptions.slice(0, 2).map((option) => (
                  <span
                    key={option.value}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded text-xs"
                  >
                    {option.avatar && (
                      <img src={option.avatar} alt="" className="w-4 h-4 rounded-full" />
                    )}
                    {option.label}
                  </span>
                ))}
                {selectedOptions.length > 2 && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    +{selectedOptions.length - 2} ko'proq
                  </span>
                )}
              </div>
            ) : selectedOption ? (
              <div className="flex items-center gap-2">
                {selectedOption.avatar && (
                  <img src={selectedOption.avatar} alt="" className="w-6 h-6 rounded-full" />
                )}
                <div className="min-w-0 flex-1">
                  <div className="text-gray-900 dark:text-white truncate">{selectedOption.label}</div>
                  {selectedOption.subtitle && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {selectedOption.subtitle}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <span className="text-gray-500 dark:text-gray-400">{getDisplayText()}</span>
            )}
          </div>
          <ChevronDown
            size={16}
            className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-hidden">
          <div className="p-2 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              />
            </div>
          </div>
          
          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="p-3 text-center text-gray-500 dark:text-gray-400 text-sm">
                Hech narsa topilmadi
              </div>
            ) : (
              filteredOptions.map((option) => {
                const isSelected = multiple ? values.includes(option.value) : value === option.value;
                
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className={`w-full px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                      isSelected ? 'bg-primary-50 dark:bg-primary-900/20' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {option.avatar && (
                        <img src={option.avatar} alt="" className="w-8 h-8 rounded-full" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm truncate ${
                          isSelected ? 'text-primary-700 dark:text-primary-300 font-medium' : 'text-gray-900 dark:text-white'
                        }`}>
                          {option.label}
                        </div>
                        {option.subtitle && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {option.subtitle}
                          </div>
                        )}
                      </div>
                      {isSelected && (
                        <Check size={16} className="text-primary-600 dark:text-primary-400" />
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}