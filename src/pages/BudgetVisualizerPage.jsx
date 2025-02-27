import React, { useState, useEffect } from 'react';
import { ChevronDown, Minus } from 'lucide-react'; // Ensure you're importing the necessary icons

const BudgetVisualiserPage = () => {
  const [totalBudget, setTotalBudget] = useState(1600);
  const [currency, setCurrency] = useState('USD');
  const [selectedCountry, setSelectedCountry] = useState('Japan'); // Only one country selected at a time
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState({
    Rent: { value: 764.64, max: 1200, average: 764.64 },
    Groceries: { value: 100, max: 400, average: 86.42 },
    'Dine-out': { value: 40, max: 200, average: 57.87 },
    Transport: { value: 55.08, max: 200, average: 55.08 },
    Clothing: { value: 218.78, max: 400, average: 218.78 },
    Leisure: { value: 150, max: 300, average: 85.92 },
    Utilities: { value: 233.30, max: 400, average: 233.30 },
  });

  const conversionRates = {
    USD: 1,
    EUR: 0.92,
    JPY: 135.72,
    GBP: 0.82,
  };

  const calculateSavings = () => {
    const totalSpending = Object.values(categories).reduce((sum, cat) => sum + cat.value, 0);
    return Math.max(0, totalBudget - totalSpending);
  };

  const [savings, setSavings] = useState(calculateSavings());

  useEffect(() => {
    setSavings(calculateSavings());
  }, [totalBudget, categories]);

  const handleCategoryChange = (category, value) => {
    setCategories({
      ...categories,
      [category]: {
        ...categories[category],
        value: parseFloat(value)
      }
    });
  };

  const countries = [
    'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola',
    'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia',
    'Austria', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia',
    'Bosnia', 'Botswana', 'Brazil'
  ];

  const filteredCountries = countries.filter(country =>
    country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleReset = () => {
    const resetCategories = {};
    Object.keys(categories).forEach(cat => {
      resetCategories[cat] = {
        ...categories[cat],
        value: categories[cat].average
      };
    });
    setCategories(resetCategories);
  };

  const SankeyDiagram = () => {
    const totalCategoryValues = Object.values(categories).reduce((sum, cat) => sum + cat.value, 0);

    return (
      <svg width="100%" height="600" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid meet">
        <rect x="0" y="50" width="40" height="500" fill="#8884d8" />
        <text x="45" y="250" dominantBaseline="middle" fill="white">Budget: {totalBudget} {currency}</text>

        {Object.entries(categories).map(([category, { value }], index) => {
          const yPos = 75 + index * 60;
          const width = (value / totalBudget) * 700;
          const color = getCategoryColor(category);

          return (
            <g key={category}>
              <path
                d={`M 40 250 C 250 250, 250 ${yPos}, 800 ${yPos}`}
                stroke={color}
                strokeWidth={(value / totalBudget) * 120}
                fill="none"
                opacity="0.7"
              />
              <text x="810" y={yPos} dominantBaseline="middle" fill="white" textAnchor="end">
                {category}: {value.toFixed(2)} {currency}
              </text>
            </g>
          );
        })}

        {savings > 0 && (
          <g>
            <path
              d={`M 40 250 C 250 250, 250 550, 800 550`}
              stroke="#ffbb78"
              strokeWidth={(savings / totalBudget) * 120}
              fill="none"
              opacity="0.7"
            />
            <text x="810" y="550" dominantBaseline="middle" fill="white" textAnchor="end">
              Savings: {savings.toFixed(2)} {currency}
            </text>
          </g>
        )}
      </svg>
    );
  };

  const getCategoryColor = (category) => {
    const colorMap = {
      Rent: '#ff8c9d',
      Groceries: '#82ca9d',
      'Dine-out': '#a4de6c',
      Transport: '#d0ed57',
      Clothing: '#ffc658',
      Leisure: '#ff8c9d',
      Utilities: '#8dd1e1'
    };

    return colorMap[category] || '#8884d8';
  };

  const handleCurrencyChange = (event) => {
    const newCurrency = event.target.value;
    setCurrency(newCurrency);

    const newCategories = {};
    Object.keys(categories).forEach(cat => {
      newCategories[cat] = {
        ...categories[cat],
        value: categories[cat].value * conversionRates[newCurrency] / conversionRates[currency]
      };
    });
    setCategories(newCategories);
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <div className="p-8 flex">
        {/* Left Section: Slider and Budget Adjustments */}
        <div className="w-1/4 bg-gray-800 p-6 border-r border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-4">Adjust Categories</h2>
          {Object.entries(categories).map(([category, { value, max }]) => (
            <div key={category} className="mb-4">
              <p className="text-xs text-gray-400">{category}</p>
              <input
                type="range"
                min="0"
                max={max}
                value={value}
                onChange={(e) => handleCategoryChange(category, e.target.value)}
                className="w-64 h-1 bg-gray-600 rounded-lg"
              />
              <div className="flex justify-between text-sm text-gray-400">
                <span>{value.toFixed(2)} {currency}</span>
                <span>Max: {max} {currency}</span>
              </div>
            </div>
          ))}
          <button
            onClick={handleReset}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Reset Categories to Average
          </button>
        </div>

        {/* Middle Section: Sankey Diagram */}
        <div className="w-6/8 px-8">
          <h1 className="text-4xl font-bold mb-1">The BUDGET VISUALISER</h1>
          <p className="text-gray-400 mb-6">Welcome to the Budget Visualiser! This tool helps you estimate your spending across different categories while living in your chosen country or city.</p>

          <div className="mb-4">
            <p className="text-xs text-gray-400">Select Currency</p>
            <select
              value={currency}
              onChange={handleCurrencyChange}
              className="bg-green-900 border border-green-700 p-2 text-white text-xl"
            >
              {Object.keys(conversionRates).map((currencyOption) => (
                <option key={currencyOption} value={currencyOption}>
                  {currencyOption}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <p className="text-xs text-gray-400">Monthly Budget</p>
            <div className="flex">
              <input
                type="number"
                value={totalBudget}
                onChange={(e) => setTotalBudget(Number(e.target.value))}
                className="bg-green-900 border border-green-700 p-2 w-32 text-white text-xl"
              />
              <div className="ml-4 text-xl text-white">{currency}</div>
            </div>
          </div>

          <SankeyDiagram />
        </div>

        {/* Right Section - Country Selector */}
        <div className="w-60">
          {/* Country Selection */}
          <div className="bg-gray-900 p-4 rounded">
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search country"
                className="w-full bg-black p-2 rounded"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="space-y-1 max-h-64 overflow-y-auto">
              {filteredCountries.map((country) => (
                <div
                  key={country}
                  className="flex justify-between items-center hover:bg-gray-800 p-2 rounded cursor-pointer"
                  onClick={() => setSelectedCountry(country)}
                >
                  <span>{country}</span>
                  {selectedCountry === country && (
                    <button
                      className="w-6 h-6 border border-gray-600 rounded flex items-center justify-center"
                      onClick={() => setSelectedCountry('')}
                    >
                      <Minus size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetVisualiserPage;
