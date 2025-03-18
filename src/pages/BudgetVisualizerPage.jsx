import React, { useState, useEffect } from 'react';
import { ChevronDown, Minus, AlertTriangle } from 'lucide-react';
import countriesData from "../data/data_latest.json";
import currencyData from "../data/currencies_data.json";

const BudgetVisualiserPage = () => {
  // Initial state setup
  const [totalBudget, setTotalBudget] = useState(1600);
  const [currency, setCurrency] = useState('USD');
  const [selectedCountry, setSelectedCountry] = useState('United States');
  const [searchTerm, setSearchTerm] = useState('');
  const [isBudgetWarning, setIsBudgetWarning] = useState(false);
  const [savings, setSavings] = useState(0);
  const [isCountryChanging, setIsCountryChanging] = useState(false);
  const [avgBudget, setAvgBudget] = useState(1600)

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
    'Rent': 5000, 
    'Dine-out': 200,
    'Leisure': 300,
    'Transport': 200,
    'Utilities': 400
  };

  // Initial categories with default values
  const [categories, setCategories] = useState({
    'Rent': { value: 399.66, max: 1200, average: 399.66 },
    'Groceries': { value: 73.36, max: 400, average: 73.36 },
    'Dine-out': { value: 73.28, max: 200, average: 73.28 },
    'Transport': { value: 28.98, max: 200, average: 28.98 },
    'Clothing': { value: 279.59, max: 500, average: 279.59 },
    'Leisure': { value: 97.54, max: 300, average: 97.54 },
    'Utilities': { value: 145.66, max: 400, average: 145.66 },
  });

  const conversionRates = {};
  for(const [no, currency] of Object.entries(currencyData)){
    conversionRates[currency.code] = currency.exchange_rate;
  }
  

  // Get all country names from the imported data
  const getCountriesFromData = () => {
    const countries = [];
    for (const countryCode in countriesData) {
      if (countriesData[countryCode].country_name) {
        countries.push(countriesData[countryCode].country_name);
      }
    }
    return countries;
  };

  // Get country data by name
  const getCountryDataByName = (countryName) => {
    for (const countryCode in countriesData) {
      if (countriesData[countryCode].country_name === countryName) {
        var selectedCountryData = countriesData[countryCode].country;
        //console.log(selectedCountryData)
        return selectedCountryData;
      }
    }
    return null;
  };

  // Set initial data when component mounts
  useEffect(() => {
    // Load data for initial country
    const initialCountryData = getCountryDataByName(selectedCountry);
    if (initialCountryData) {
      const newCategories = updateCategoriesFromCountryData(initialCountryData);
      const newBudget = parseFloat((initialCountryData['Total_Expenses'] || 1600).toFixed(2));
      setAvgBudget(parseFloat((initialCountryData['Total_Expenses'] || 1600).toFixed(2)))
      setTotalBudget(newBudget);
      
      // Calculate initial savings after categories are updated
      setTimeout(() => {
        const totalExpenses = calculateTotalExpensesFromCategories(newCategories);
        setSavings(Math.max(0, newBudget - totalExpenses));
        setIsCountryChanging(false);
      }, 0);
    }
  }, []);

  // Update categories when country changes
  useEffect(() => {
    setIsCountryChanging(true);
    const countryData = getCountryDataByName(selectedCountry);
    if (countryData) {
      const newCategories = updateCategoriesFromCountryData(countryData);
      const newBudget = parseFloat(countryData['Total_Expenses'] || 1600).toFixed(2);
      
      // Convert new budget to the selected currency
      const conversionFactor = conversionRates[currency] / conversionRates['USD']; 
      const convertedBudget = Math.ceil(parseFloat(newBudget * conversionFactor) * 100) / 100;
      
      // Set the updated values
      setAvgBudget(convertedBudget);
      setTotalBudget(convertedBudget);
      
      // Convert all category values based on the current currency
      const convertedCategories = {};
      Object.entries(newCategories).forEach(([category, data]) => {
        convertedCategories[category] = {
          value: Math.round(data.value * conversionFactor * 100) / 100,
          max: Math.round(data.max * conversionFactor),
          average: Math.round(data.average * conversionFactor * 100) / 100
        };
      });
      
      // Update the categories state
      setCategories(convertedCategories);
      
      // Calculate new savings after categories are updated
      setTimeout(() => {
        const totalExpenses = calculateTotalExpensesFromCategories(convertedCategories);
        setSavings(Math.max(0, convertedBudget - totalExpenses));
        setIsCountryChanging(false);
      }, 0);
    }
  }, [selectedCountry]); 

  // Helper function to calculate expenses from a categories object
  const calculateTotalExpensesFromCategories = (categoriesObj) => {
    return Object.values(categoriesObj).reduce((sum, cat) => sum + cat.value, 0);
  };

  // Update categories from country data
  const updateCategoriesFromCountryData = (countryData) => {
    if (!countryData) return {};
    
    const newCategories = {};
    
    // Map API data to our category structure
    for (const [apiKey, displayName] of Object.entries(categoryMapping)) {
      const value = countryData[apiKey] || 0; // Provide fallback value
      
      newCategories[displayName] = {
        value: value,
        max: Math.max(categoryMaxValues[displayName], value * 4)>1000? 
        Math.round(Math.max(categoryMaxValues[displayName], value * 4)/1000)*1000
        :
        Math.round(Math.max(categoryMaxValues[displayName], value * 4)/100)*100 ,
        average: value  // Store average as the original country value
      };
    }
    setAvgBudget(parseFloat(countryData["Total_Expenses"]).toFixed(2))
    setCategories(newCategories);
    return newCategories; // Return the new categories for immediate use
  };


  // Calculate total expenses across all categories
  const calculateTotalExpenses = () => {
    return parseFloat(Object.values(categories).reduce((sum, cat) => sum + cat.value, 0)).toFixed(2);
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

  // Update savings and budget warning when total budget changes
  useEffect(() => {
    if (isCountryChanging) return; 
    var updatedCategories={ ...categories };
    const countryData = getCountryDataByName(selectedCountry);
    if(totalBudget > avgBudget) {
      // console.log("Input budget larger than average, setting categories to average values")
      
       updatedCategories = updateCategoriesFromCountryData(countryData);
      setCategories(updatedCategories);
    };

    // Proportionally adjust categories when budget is below expenses
    if (avgBudget > totalBudget ) {
      // console.log("input budget smaller than average, setting categories to proportion")
      const proportion = totalBudget / avgBudget;
      
      Object.entries(updateCategoriesFromCountryData(countryData)).forEach(([category, data]) => {
        updatedCategories[category] = {
          ...data,
          value: Math.round(data.value * proportion * 100) / 100
        };
      });
      
      setCategories(updatedCategories);
    }
    console.log("Categories:" ,updatedCategories)
    const totalExpenses = parseFloat(Object.values(updatedCategories).reduce((sum, cat) => sum + cat.value, 0)).toFixed(2);
    // const totalRecommendedExpense = calculateRecommendedBudget();
    // console.log("Total Expense:" ,totalExpenses);
    // console.log("Average budget: ", avgBudget);
    // console.log("Total budget: ", totalBudget)
    const newSavings = Math.max(0, totalBudget - totalExpenses)<1? 0: totalBudget - totalExpenses;
    
    setSavings(newSavings);
    if (avgBudget > totalBudget) {
      setIsBudgetWarning(Math.abs(avgBudget - totalBudget) > 1);
  } else {
      setIsBudgetWarning(false); // Don't set the warning if budget is larger than expenses
  }
    
  }, [totalBudget, isCountryChanging, avgBudget]);

  
  // Handle category value changes
  const handleCategoryChange = (category, newValue) => {
    const parsedNewValue = parseFloat(newValue);
    
    if (isNaN(parsedNewValue)) return;
    
    // Skip checks during country change
    if (isCountryChanging) {
      const updatedCategories = {
        ...categories,
        [category]: {
          ...categories[category],
          value: parsedNewValue
        }
      };
      setCategories(updatedCategories);
      return;
    }
    
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
    
    // Direct conversion from current currency to new currency
    const conversionFactor = conversionRates[newCurrency] / conversionRates[currency];
    
    setCurrency(newCurrency);
    
    // Convert the average budget
    const newAvgBudget = Math.ceil(avgBudget * conversionFactor * 100) / 100;
    setAvgBudget(newAvgBudget);
  
    // Convert the total budget maintaining the same value in real terms
    const newTotalBudget = Math.ceil(totalBudget * conversionFactor * 100) / 100;
    setTotalBudget(newTotalBudget);
    
    // Convert all category values directly using the same conversion factor
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
  const newBudget = numericValue === '' ? 0 : parseInt(numericValue);

  // Convert the new budget to the current currency
  const conversionFactor = conversionRates[currency] / conversionRates['USD'];
  const convertedBudget = Math.ceil(parseFloat(newBudget * conversionFactor) * 100) / 100;
  
  setTotalBudget(convertedBudget);
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

  // List of countries from data
  const countries = getCountriesFromData();

  // Filter countries based on search term
  const filteredCountries = countries.filter(country =>
    country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  //Place the selected country on the top if there is one
  const orderedCountries = selectedCountry
  ? [selectedCountry, ...filteredCountries.filter(country => country !== selectedCountry)]
  : filteredCountries;

  // Sankey Diagram Component with labels on the right side
  const SankeyDiagram = () => {
    const totalCategoryValues = Object.values(categories).reduce((sum, cat) => sum + cat.value, 0);

    return (
      <svg width="100%" height="600" viewBox="0 0 900 600" preserveAspectRatio="xMidYMid meet">
        {/* Adjusted viewBox width to accommodate labels on the right */}
        
        {Object.entries(categories).map(([category, { value }], index) => {
          const yPos = 75 + index * 60;
          const color = getCategoryColor(category);

          return (
            <g key={category}>
              <path
                d={`M 40 250 C 250 250, 250 ${yPos}, 650 ${yPos}`}
                stroke={color}
                strokeWidth={(value / totalBudget) * 100}
                fill="none"
                opacity="0.7"
              />
              {/* Text positioned to the right of path end */}
              <text x="670" y={yPos} dominantBaseline="middle" fill="white" textAnchor="start">
                {category}: {value.toFixed(2)} {currency}
              </text>
            </g>
          );
        })}

        {savings > 0 && (
          <g>
            <path
              d={`M 40 250 C 250 250, 250 550, 650 550`}
              stroke="#ffbb78"
              strokeWidth={(savings / totalBudget) * 120}
              fill="none"
              opacity="0.7"
            />
            {/* Savings text to the right */}
            <text x="670" y="550" dominantBaseline="middle" fill="white" textAnchor="start">
              Savings: {savings.toFixed(2)} {currency}
            </text>
          </g>
        )}
        <rect x="0" y="50" width="40" height="500" fill="#8884d8" />
        <text x="45" y="250" dominantBaseline="middle" fill="white">Budget: {totalBudget} {currency}</text>
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
          {isCountryChanging && (
            <div className="mb-4 p-2 bg-blue-600 text-white rounded">
              Loading country data...
            </div>
          )}
          {Object.entries(categories).map(([category, { value, max, average }]) => {
            // Calculate dynamic max value based on current savings
            const effectiveMax = savings <= 0 && !isCountryChanging
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
                    {savings <= 0 && !isCountryChanging && (
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
                    className="absolute top-0 left-0 w-full opacity-0 cursor-pointer h-6 z-10"
                    // Always allow input during country change regardless of savings
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
                  Your total budget ({totalBudget} {currency}) is less than the recommended expenses ({parseFloat(avgBudget)} {currency}) for {selectedCountry}. 
                  Your spending has been proportionally adjusted to fit within your budget.
                </p>
              </div>
            </div>
          )}

          {/*Country Selected*/}
          <div className='mb-4 '>
            <p className='text-sm font-medium text-gray-300 mb-1'>Selected Country</p>
            <p className='text-3xl font-bold text-white mb-2'>{selectedCountry}</p>
          </div>

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
                Recommended budget for {selectedCountry}: {avgBudget} {currency}
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
              {savings <= 0 && !isCountryChanging && (
                <p className="text-xs text-gray-400 mt-1">No savings available. You can't increase category values.</p>
              )}
              {isCountryChanging && (
                <p className="text-xs text-blue-400 mt-1">Updating country data...</p>
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
              {orderedCountries.map((country) => (
                <div
                  key={country}
                  className={`flex justify-between items-center p-2 rounded cursor-pointer transition-colors duration-150 ${
                    selectedCountry === country 
                      ? 'bg-blue-600 text-white' //selected country style
                      : 'hover:bg-gray-700' //hover style
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
