import React, { useState, useEffect } from 'react';
import { ChevronDown, Minus, AlertTriangle } from 'lucide-react';
import countriesData from "../data/data_latest.json";
import currencyData from "../data/currencies_data.json";

const BudgetVisualiserPage = () => {
  // Initial state setup
  const [totalBudget, setTotalBudget] = useState(1600);
  const [currency, setCurrency] = useState('USD');
  const [selectedCountry, setSelectedCountry] = useState('Japan');
  const [searchTerm, setSearchTerm] = useState('');
  const [isBudgetWarning, setIsBudgetWarning] = useState(false);
  const [savings, setSavings] = useState(0);

  // Map API data keys to display names
  const categoryMapping = {
    'Markets': 'Groceries',
    'Clothing_And_Shoes': 'Clothing',
    'Rent_Per_Month': 'Rent',
    'Restaurants': 'Dine-out',
    'Sports_And_Leisure': 'Leisure',
    'Public_Transportation': 'Transport',
    'Utilities': 'Utilities'
  };

  // Initial default category max values
  const categoryMaxValues = {
    'Groceries': 400,
    'Clothing': 500,
    'Rent': 1200, 
    'Dine-out': 200,
    'Leisure': 300,
    'Transport': 200,
    'Utilities': 400
  };

  // Initial categories with default values (will be updated from country data)
  const [categories, setCategories] = useState({
    'Rent': { value: 399.66, max: 1200, average: 399.66 },
    'Groceries': { value: 73.36, max: 400, average: 73.36 },
    'Dine-out': { value: 73.28, max: 200, average: 73.28 },
    'Transport': { value: 28.98, max: 200, average: 28.98 },
    'Clothing': { value: 279.59, max: 500, average: 279.59 },
    'Leisure': { value: 97.54, max: 300, average: 97.54 },
    'Utilities': { value: 145.66, max: 400, average: 145.66 },
  });

  // Dynamic conversion rates from imported data
  const conversionRates = {};
  for(const [no, currency] of Object.entries(currencyData)){
    conversionRates[currency.code] = currency.exchange_rate;
  }
  
  // If conversionRates is empty, provide fallback values for demo
  if (Object.keys(conversionRates).length === 0) {
    Object.assign(conversionRates, {
      'USD': 1,
      'EUR': 0.85,
      'GBP': 0.75,
      'JPY': 110.15,
      'CNY': 6.45
    });
  }

  // Simulate loading country-specific data
  useEffect(() => {
    // Sample dataset for demonstration - in production, this would come from countriesData
    const mockCountryData = {
      'Japan': {
        'Markets': 73.36,
        'Clothing_And_Shoes': 279.59,
        'Rent_Per_Month': 399.66,
        'Restaurants': 73.28,
        'Sports_And_Leisure': 97.54,
        'Public_Transportation': 28.98,
        'Utilities': 145.66,
        'Net_Salary': 646.31,
        'Total_Expenses': 1098.07
      }
    };
    
    // Add variations for other countries (just for demo purposes)
    countries.forEach(country => {
      if (country !== 'Japan') {
        const multiplier = 0.8 + (country.charCodeAt(0) % 15) / 10; // Creates a range between 0.8 and 2.3
        
        mockCountryData[country] = {
          'Markets': mockCountryData['Japan']['Markets'] * multiplier,
          'Clothing_And_Shoes': mockCountryData['Japan']['Clothing_And_Shoes'] * multiplier,
          'Rent_Per_Month': mockCountryData['Japan']['Rent_Per_Month'] * multiplier,
          'Restaurants': mockCountryData['Japan']['Restaurants'] * multiplier,
          'Sports_And_Leisure': mockCountryData['Japan']['Sports_And_Leisure'] * multiplier,
          'Public_Transportation': mockCountryData['Japan']['Public_Transportation'] * multiplier,
          'Utilities': mockCountryData['Japan']['Utilities'] * multiplier,
          'Total_Expenses': mockCountryData['Japan']['Total_Expenses'] * multiplier
        };
      }
    });
    
    // Update categories based on selected country data
    updateCategoriesFromCountryData(mockCountryData[selectedCountry]);
    
    // Set initial budget to match recommended budget for selected country
    setTotalBudget(Math.round(mockCountryData[selectedCountry]['Total_Expenses']));
  }, []);

  // Update categories when country changes
  useEffect(() => {
    // In a real implementation, this would fetch data for the selected country
    // For demo, we'll just simulate this by reloading the mock data
    const mockCountryData = {
      'Japan': {
        'Markets': 73.36,
        'Clothing_And_Shoes': 279.59,
        'Rent_Per_Month': 399.66,
        'Restaurants': 73.28,
        'Sports_And_Leisure': 97.54,
        'Public_Transportation': 28.98,
        'Utilities': 145.66,
        'Net_Salary': 646.31,
        'Total_Expenses': 1098.07
      }
    };
    
    // Add variations for other countries (for demo)
    countries.forEach(country => {
      if (country !== 'Japan') {
        const multiplier = 0.8 + (country.charCodeAt(0) % 15) / 10;
        
        mockCountryData[country] = {
          'Markets': mockCountryData['Japan']['Markets'] * multiplier,
          'Clothing_And_Shoes': mockCountryData['Japan']['Clothing_And_Shoes'] * multiplier,
          'Rent_Per_Month': mockCountryData['Japan']['Rent_Per_Month'] * multiplier,
          'Restaurants': mockCountryData['Japan']['Restaurants'] * multiplier,
          'Sports_And_Leisure': mockCountryData['Japan']['Sports_And_Leisure'] * multiplier,
          'Public_Transportation': mockCountryData['Japan']['Public_Transportation'] * multiplier,
          'Utilities': mockCountryData['Japan']['Utilities'] * multiplier,
          'Total_Expenses': mockCountryData['Japan']['Total_Expenses'] * multiplier
        };
      }
    });
    
    // Update categories if data exists
    if (mockCountryData[selectedCountry]) {
      updateCategoriesFromCountryData(mockCountryData[selectedCountry]);
      // Update budget to match recommended for the country
      setTotalBudget(Math.round(mockCountryData[selectedCountry]['Total_Expenses']));
    }
  }, [selectedCountry]);

  // Update categories from country data
  const updateCategoriesFromCountryData = (countryData) => {
    if (!countryData) return;
    
    const newCategories = {};
    
    // Map API data to our category structure
    for (const [apiKey, displayName] of Object.entries(categoryMapping)) {
      const value = countryData[apiKey] || 0; // Provide fallback value
      
      newCategories[displayName] = {
        value: value,
        max: categoryMaxValues[displayName] || value * 2, // Fallback max value
        average: value  // Store average as the original country value
      };
    }
    
    setCategories(newCategories);
  };

  // Calculate total expenses across all categories
  const calculateTotalExpenses = () => {
    return Object.values(categories).reduce((sum, cat) => sum + cat.value, 0);
  };

  // Calculate total average expenses (recommended budget)
  const calculateRecommendedBudget = () => {
    return Object.values(categories).reduce((sum, cat) => sum + cat.average, 0);
  };

  // Calculate savings
  const calculateSavings = () => {
    const totalSpending = calculateTotalExpenses();
    return Math.max(0, totalBudget - totalSpending);
  };

  // Calculate maximum possible category value based on current savings
  const calculateMaxCategoryValue = (category) => {
    // Current expenses
    const currentExpenses = calculateTotalExpenses();
    
    // How much we can spend in total
    const maxPossibleExpenses = totalBudget;
    
    // How much room we have to increase this category
    const room = maxPossibleExpenses - currentExpenses;
    
    // Current value plus available room
    return categories[category].value + room;
  };

  // Update savings and budget warning when categories or total budget changes
  useEffect(() => {
    const totalExpenses = calculateTotalExpenses();
    const newSavings = Math.max(0, totalBudget - totalExpenses);
    
    setSavings(newSavings);
    setIsBudgetWarning(totalExpenses > totalBudget);
    
    // Proportionally adjust categories when budget is below expenses
    if (totalExpenses > totalBudget && totalExpenses > 0) {
      const proportion = totalBudget / totalExpenses;
      
      const adjustedCategories = {};
      Object.entries(categories).forEach(([category, data]) => {
        adjustedCategories[category] = {
          ...data,
          value: Math.round(data.value * proportion * 100) / 100
        };
      });
      
      setCategories(adjustedCategories);
    }
  }, [totalBudget]);

  // Handle category value changes
  const handleCategoryChange = (category, newValue) => {
    const parsedNewValue = parseFloat(newValue);
    
    if (isNaN(parsedNewValue)) return;
    
    // If savings is 0, we need to enforce the constraint that
    // increasing one category must decrease others proportionally
    const currentExpenses = calculateTotalExpenses();
    const currentSavings = totalBudget - currentExpenses;
    
    // If we have no savings and trying to increase a category value, prevent it
    if (
      currentSavings <= 0 && 
      parsedNewValue > categories[category].value && 
      currentExpenses >= totalBudget
    ) {
      return; // Prevent increasing value when no savings available
    }
    
    // Calculate maximum allowed value based on budget
    const maxAllowedValue = categories[category].value + Math.max(0, totalBudget - currentExpenses);
    
    // Limit the new value to max allowed value or category max
    const limitedNewValue = Math.min(
      parsedNewValue, 
      Math.min(maxAllowedValue, categories[category].max)
    );
    
    // Update category value
    const updatedCategories = {
      ...categories,
      [category]: {
        ...categories[category],
        value: limitedNewValue
      }
    };
    
    setCategories(updatedCategories);
    
    // Recalculate total after change
    const newTotal = Object.values(updatedCategories).reduce((sum, cat) => sum + cat.value, 0);
    
    // Update savings
    setSavings(Math.max(0, totalBudget - newTotal));
  };

  // Reset categories to average values
  const handleReset = () => {
    const resetCategories = {};
    Object.keys(categories).forEach(cat => {
      resetCategories[cat] = {
        ...categories[cat],
        value: categories[cat].average
      };
    });
    setCategories(resetCategories);
    
    // Update savings after reset
    const resetTotal = Object.values(resetCategories).reduce((sum, cat) => sum + cat.value, 0);
    setSavings(Math.max(0, totalBudget - resetTotal));
  };

  // Currency conversion handler
  const handleCurrencyChange = (event) => {
    const newCurrency = event.target.value;
    const conversionFactor = conversionRates[newCurrency] / conversionRates[currency];
    
    setCurrency(newCurrency);
    
    // Convert all budget values
    setTotalBudget(Math.round(totalBudget * conversionFactor));
    
    // Convert all category values
    const convertedCategories = {};
    Object.entries(categories).forEach(([category, data]) => {
      convertedCategories[category] = {
        value: Math.round(data.value * conversionFactor * 100) / 100,
        max: Math.round(data.max * conversionFactor),
        average: Math.round(data.average * conversionFactor * 100) / 100
      };
    });
    
    setCategories(convertedCategories);
  };

  const handleTotalBudgetChange = (event) => {
    // Remove any non-numeric characters
    const numericValue = event.target.value.replace(/[^\d]/g, '');
    setTotalBudget(numericValue === '' ? 0 : parseInt(numericValue));
  };

  // Color mapping for Sankey diagram
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

  // List of countries for selection
  const countries = [
    'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola',
    'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia',
    'Austria', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia',
    'Bosnia', 'Botswana', 'Brazil', 'Japan'
  ];

  // Filter countries based on search term
  const filteredCountries = countries.filter(country =>
    country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sankey Diagram Component
  const SankeyDiagram = () => {
    const totalCategoryValues = Object.values(categories).reduce((sum, cat) => sum + cat.value, 0);

    return (
      <svg width="100%" height="600" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid meet">
        <rect x="0" y="50" width="40" height="500" fill="#8884d8" />
        <text x="45" y="250" dominantBaseline="middle" fill="white">Budget: {totalBudget} {currency}</text>

        {Object.entries(categories).map(([category, { value }], index) => {
          const yPos = 75 + index * 60;
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

  // Calculate the position for the average indicator on the slider
  const getAveragePosition = (average, max) => {
    return (average / max) * 100;
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <div className="p-8 flex">
        {/* Left Section: Slider and Budget Adjustments */}
        <div className="w-1/4 bg-gray-800 p-6 border-r border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-4">Adjust Categories</h2>
          {Object.entries(categories).map(([category, { value, max, average }]) => {
            // Calculate dynamic max value based on current savings
            const effectiveMax = savings <= 0 
              ? value  // If no savings, can't increase
              : Math.min(max, value + savings);  // Can increase up to value + savings
              
            // Calculate effective percentage for the slider's visual fill
            const fillPercentage = (value / max) * 100;
            const maxAllowedPercentage = (effectiveMax / max) * 100;
            
            return (
              <div key={category} className="mb-6">
                <div className="flex justify-between mb-1">
                  <p className="text-sm font-medium text-white">{category}</p>
                  <p className="text-sm text-gray-300">{value.toFixed(2)} {currency}</p>
                </div>
                
                <div className="relative mb-3">
                  {/* Improved slider track */}
                  <div className="w-full h-2 bg-gray-700 rounded-lg">
                    {/* Filled portion of the slider */}
                    <div 
                      className="absolute h-2 bg-blue-500 rounded-lg" 
                      style={{ width: `${fillPercentage}%` }}
                    ></div>
                    
                    {/* Maximum allowed area indicator when savings is 0 */}
                    {savings <= 0 && (
                      <div 
                        className="absolute top-0 right-0 h-full bg-gray-800 rounded-r-lg" 
                        style={{ 
                          width: `${100 - fillPercentage}%`,
                          opacity: 0.7
                        }}
                      ></div>
                    )}
                    
                    {/* Average value indicator */}
                    <div 
                      className="absolute h-6 w-1 bg-green-400"
                      style={{ 
                        left: `${getAveragePosition(average, max)}%`,
                        top: '-2px'
                      }}
                    ></div>
                    
                    {/* Enhanced thumb */}
                    <div 
                      className="absolute h-6 w-6 bg-white rounded-full shadow-lg -mt-2 -ml-3 flex items-center justify-center cursor-pointer"
                      style={{
                        left: `${fillPercentage}%`,
                        top: "-2px",
                        boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5), 0 0 0 4px rgba(59, 130, 246, 0.25)"
                      }}
                    >
                      <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                    </div>
                  </div>
                  
                  {/* Actual range input with disabled state when no savings */}
                  <input
                    type="range"
                    min="0"
                    max={max}
                    step="0.01"
                    value={value}
                    onChange={(e) => handleCategoryChange(category, e.target.value)}
                    className={`absolute top-0 left-0 w-full opacity-0 cursor-pointer h-6 z-10 ${savings <= 0 && value >= effectiveMax ? 'cursor-not-allowed' : ''}`}
                    style={{ 
                      pointerEvents: savings <= 0 && value >= effectiveMax ? 'none' : 'auto'
                    }}
                  />
                </div>
                
                <div className="flex justify-between text-xs text-gray-400">
                  <span>0</span>
                  <span className="text-green-400">Avg: {average.toFixed(0)}</span>
                  <span>Max: {max}</span>
                </div>
              </div>
            );
          })}
          <button
            onClick={handleReset}
            className="mt-6 w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-200 font-medium"
          >
            Reset to Average Values
          </button>
        </div>

        {/* Middle Section: Sankey Diagram */}
        <div className="w-1/2 px-8">
          <h1 className="text-4xl font-bold mb-1">The BUDGET VISUALISER</h1>
          <p className="text-gray-400 mb-6">Welcome to the Budget Visualiser! This tool helps you estimate your spending across different categories while living in your chosen country or city.</p>

          {/* Budget Warning */}
          {isBudgetWarning && (
            <div className="bg-red-600 text-white p-4 rounded mb-4 flex items-center">
              <AlertTriangle className="mr-2" />
              <div>
                <p className="font-bold">Budget Too Low!</p>
                <p className="text-sm">
                  Your total budget ({totalBudget} {currency}) is less than the recommended expenses ({calculateRecommendedBudget().toFixed(2)} {currency}) for {selectedCountry}. 
                  Your spending has been proportionally adjusted to fit within your budget.
                </p>
              </div>
            </div>
          )}

          <div className="mb-4">
            <p className="text-sm font-medium text-gray-300 mb-1">Select Currency</p>
            <select
              value={currency}
              onChange={handleCurrencyChange}
              className="bg-gray-800 border border-gray-700 p-2 rounded text-white text-xl"
            >
              {Object.keys(conversionRates).map((currencyOption) => (
                <option key={currencyOption} value={currencyOption}>
                  {currencyOption}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <p className="text-sm font-medium text-gray-300 mb-1">Monthly Budget</p>
            <div className="flex items-center">
              <input
                type="text"
                value={totalBudget}
                onChange={handleTotalBudgetChange}
                className="bg-gray-800 border border-gray-700 p-2 w-32 text-white text-xl rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              <div className="ml-4 text-xl text-white">{currency}</div>
            </div>
            {isBudgetWarning && (
              <p className="text-red-400 text-sm mt-1">
                Recommended budget for {selectedCountry}: {calculateRecommendedBudget().toFixed(2)} {currency}
              </p>
            )}
            
            {/* Current Savings Display */}
            <div className="mt-3 bg-gray-800 p-3 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Available Savings:</span>
                <span className={`text-lg font-bold ${savings > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {savings.toFixed(2)} {currency}
                </span>
              </div>
              {savings <= 0 && (
                <p className="text-xs text-gray-400 mt-1">No savings available. You can't increase category values.</p>
              )}
            </div>
          </div>

          <SankeyDiagram />
        </div>

        {/* Right Section - Country Selector */}
        <div className="w-1/4">
          <div className="bg-gray-800 p-4 rounded shadow-lg">
            <h3 className="font-bold text-lg mb-3">Select Country</h3>
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search country"
                className="w-full bg-gray-900 p-2 rounded border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="space-y-1 max-h-96 overflow-y-auto">
              {filteredCountries.map((country) => (
                <div
                  key={country}
                  className={`flex justify-between items-center p-2 rounded cursor-pointer transition-colors duration-150 ${
                    selectedCountry === country 
                      ? 'bg-blue-600 text-white' 
                      : 'hover:bg-gray-700'
                  }`}
                  onClick={() => setSelectedCountry(country)}
                >
                  <span>{country}</span>
                  {selectedCountry === country && (
                    <button
                      className="w-6 h-6 bg-blue-700 rounded-full flex items-center justify-center hover:bg-blue-800 transition-colors duration-150"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCountry('');
                      }}
                    >
                      <Minus size={14} />
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