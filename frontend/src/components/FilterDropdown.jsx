import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

const FilterDropdown = ({ 
  label, 
  options = [], 
  selectedValues = [], 
  onSelect,
  type = 'multi-select',
  placeholder = 'Select...'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [ageMin, setAgeMin] = useState('');
  const [ageMax, setAgeMax] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [dropdownPosition, setDropdownPosition] = useState('bottom');
  const dropdownRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && 
          menuRef.current &&
          !dropdownRef.current.contains(event.target) && 
          !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Calculate dropdown position (open upward if not enough space below)
  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      const estimatedHeight = 300; // max-h-[300px]
      
      // Open upward if not enough space below but enough space above
      if (spaceBelow < estimatedHeight && spaceAbove > estimatedHeight) {
        setDropdownPosition('top');
      } else {
        setDropdownPosition('bottom');
      }
    }
  }, [isOpen]);

  // Get dropdown position for portal rendering
  const getDropdownStyle = () => {
    if (!isOpen || !dropdownRef.current) return {};
    
    const rect = dropdownRef.current.getBoundingClientRect();
    const isTop = dropdownPosition === 'top';
    const maxHeight = 300;
    
    // Calculate position
    let top, bottom, left, right;
    
    if (isTop) {
      bottom = window.innerHeight - rect.top + 4;
      top = 'auto';
    } else {
      top = rect.bottom + 4;
      bottom = 'auto';
    }
    
    left = rect.left;
    right = 'auto';
    
    // Ensure dropdown doesn't go off-screen horizontally
    const dropdownWidth = rect.width;
    if (left + dropdownWidth > window.innerWidth) {
      left = window.innerWidth - dropdownWidth - 10;
    }
    if (left < 10) {
      left = 10;
    }
    
    return {
      position: 'fixed',
      left: `${left}px`,
      top: isTop ? 'auto' : `${top}px`,
      bottom: isTop ? `${bottom}px` : 'auto',
      width: `${rect.width}px`,
      maxHeight: `${maxHeight}px`,
      zIndex: 9999
    };
  };

  useEffect(() => {
    if (type === 'range' && selectedValues) {
      setAgeMin(selectedValues.min || '');
      setAgeMax(selectedValues.max || '');
    }
    if (type === 'date-range' && selectedValues) {
      setDateFrom(selectedValues.from || '');
      setDateTo(selectedValues.to || '');
    }
  }, [selectedValues, type]);

  const handleToggle = (value) => {
    if (selectedValues.includes(value)) {
      onSelect(selectedValues.filter(v => v !== value));
    } else {
      onSelect([...selectedValues, value]);
    }
  };

  const handleRangeApply = () => {
    if (type === 'range') {
      onSelect({ min: ageMin, max: ageMax });
    } else if (type === 'date-range') {
      onSelect({ from: dateFrom, to: dateTo });
    }
    setIsOpen(false);
  };

  const getDisplayText = () => {
    if (type === 'range') {
      if (selectedValues.min || selectedValues.max) {
        return `${selectedValues.min || 'Min'} - ${selectedValues.max || 'Max'}`;
      }
      return placeholder;
    }
    if (type === 'date-range') {
      if (selectedValues.from || selectedValues.to) {
        return `${selectedValues.from || 'From'} - ${selectedValues.to || 'To'}`;
      }
      return placeholder;
    }
    if (selectedValues.length === 0) {
      return placeholder;
    }
    if (selectedValues.length === 1) {
      return selectedValues[0];
    }
    return `${selectedValues.length} selected`;
  };

  const hasSelection = () => {
    if (type === 'range') {
      return selectedValues.min || selectedValues.max;
    }
    if (type === 'date-range') {
      return selectedValues.from || selectedValues.to;
    }
    return selectedValues.length > 0;
  };

  return (
    <div className="relative w-[150px] flex-shrink-0 z-[100]" ref={dropdownRef}>
      <button
        className={`w-full px-3 py-2 border rounded text-left flex flex-col gap-1 transition-colors ${
          hasSelection() 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 bg-white hover:border-blue-500'
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-xs text-gray-600 font-medium truncate">{label}</span>
        <div className="flex items-center justify-between gap-1">
          <span className="text-xs text-gray-800 truncate flex-1">{getDisplayText()}</span>
          <span className={`text-[10px] text-gray-600 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}>▼</span>
        </div>
      </button>
      
      {isOpen && createPortal(
        <div 
          ref={menuRef}
          className="bg-white border border-gray-300 rounded shadow-xl max-h-[300px] overflow-y-auto"
          style={getDropdownStyle()}
        >
          {type === 'multi-select' && (
            <div className="p-2 flex flex-col gap-1">
              {options && options.length > 0 ? (
                options.map(option => (
                  <label key={option} className="flex items-center gap-2 px-3 py-2 cursor-pointer rounded hover:bg-gray-50 text-sm text-gray-800">
                    <input
                      type="checkbox"
                      checked={selectedValues.includes(option)}
                      onChange={() => handleToggle(option)}
                      className="w-4 h-4 cursor-pointer"
                    />
                    <span>{option}</span>
                  </label>
                ))
              ) : (
                <div className="px-3 py-2 text-sm text-gray-500 text-center">No options available</div>
              )}
            </div>
          )}
          
          {type === 'range' && (
            <div className="p-3">
              <div className="flex items-center gap-2 mb-3">
                <input
                  type="number"
                  placeholder="Min"
                  value={ageMin}
                  onChange={(e) => setAgeMin(e.target.value)}
                  className="flex-1 px-2 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                />
                <span className="text-sm text-gray-600">to</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={ageMax}
                  onChange={(e) => setAgeMax(e.target.value)}
                  className="flex-1 px-2 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <button 
                className="w-full px-2 py-2 bg-blue-500 text-white rounded text-sm cursor-pointer hover:bg-blue-600 transition-colors"
                onClick={handleRangeApply}
              >
                Apply
              </button>
            </div>
          )}
          
          {type === 'date-range' && (
            <div className="p-3">
              <div className="flex items-center gap-2 mb-3">
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="flex-1 px-2 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                />
                <span className="text-sm text-gray-600">to</span>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="flex-1 px-2 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <button 
                className="w-full px-2 py-2 bg-blue-500 text-white rounded text-sm cursor-pointer hover:bg-blue-600 transition-colors"
                onClick={handleRangeApply}
              >
                Apply
              </button>
            </div>
          )}
        </div>,
        document.body
      )}
    </div>
  );
};

export default FilterDropdown;
