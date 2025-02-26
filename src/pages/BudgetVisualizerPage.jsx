import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const BudgetVisualiserPage = () => {
  // State management
  const [totalBudget, setTotalBudget] = useState(1600);
  const [currency, setCurrency] = useState('USD');
  const [countryLevel, setCountryLevel] = useState('Country-level');
  const [selectedCountry, setSelectedCountry] = useState('Japan');
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
  
  // Calculate remaining budget (savings)
  const calculateSavings = () => {
    const totalSpending = Object.values(categories).reduce((sum, cat) => sum + cat.value, 0);
    return Math.max(0, totalBudget - totalSpending);
  };
  
  const [savings, setSavings] = useState(calculateSavings());
  
  // Update savings when budget or categories change
  useEffect(() => {
    setSavings(calculateSavings());
  }, [totalBudget, categories]);
  
  // Handle category value change
  const handleCategoryChange = (category, value) => {
    setCategories({
      ...categories,
      [category]: {
        ...categories[category],
        value: parseFloat(value)
      }
    });
  };
  
  // Countries list
  const countries = [
    'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 
    'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 
    'Austria', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia', 
    'Bosnia', 'Botswana', 'Brazil'
    // Original list continued with more countries
  ];
  
  // Filter countries based on search term
  const filteredCountries = countries.filter(country => 
    country.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Reset all category values to average
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

  // Custom Sankey diagram component (simplified SVG version)
  const SankeyDiagram = () => {
    const totalCategoryValues = Object.values(categories).reduce((sum, cat) => sum + cat.value, 0);
    
    return (
      <svg width="100%" height="100%" viewBox="0 0 600 500" preserveAspectRatio="xMidYMid meet">
        {/* Budget column (left side) */}
        <rect x="0" y="50" width="30" height="400" fill="#8884d8" />
        <text x="40" y="250" dominantBaseline="middle" fill="white">Budget: {totalBudget}</text>
        
        {/* Category flows */}
        {Object.entries(categories).map(([category, { value }], index) => {
          const yPos = 75 + index * 50;
          const width = (value / totalBudget) * 500;
          const color = getCategoryColor(category);
          
          return (
            <g key={category}>
              <path 
                d={`M 30 250 C 200 250, 200 ${yPos}, 600 ${yPos}`} 
                stroke={color} 
                strokeWidth={(value / totalBudget) * 100} 
                fill="none" 
                opacity="0.7"
              />
              <text x="610" y={yPos} dominantBaseline="middle" fill="white" textAnchor="end">
                {category}: {value.toFixed(2)}
              </text>
            </g>
          );
        })}
        
        {/* Savings flow */}
        {savings > 0 && (
          <g>
            <path 
              d={`M 30 250 C 200 250, 200 450, 600 450`} 
              stroke="#ffbb78" 
              strokeWidth={(savings / totalBudget) * 100} 
              fill="none" 
              opacity="0.7"
            />
            <text x="610" y="450" dominantBaseline="middle" fill="white" textAnchor="end">
              Savings: {savings.toFixed(2)}
            </text>
          </g>
        )}
      </svg>
    );
  };
  
  // Get color for different categories
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

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {/* Navigation bar */}
      <div className="flex bg-gray-800 p-4 border-b border-gray-700">
        <Link to="/DH2321_Project" className="mx-4 text-gray-400 hover:text-white">Earn/Spend Global</Link>
        <Link to="/DH2321_Project/country-compare" className="mx-4 text-gray-400 hover:text-white">Compare By Country</Link>
        <Link to="/DH2321_Project/country-statistics/country" className="mx-4 text-gray-400 hover:text-white">Single Country Statistics</Link>
        <Link to="/DH2321_Project/budget-visualizer" className="mx-4 text-white underline font-bold">Budget Visualiser</Link>
        <Link to="/DH2321_Project/information" className="mx-4 text-gray-400 hover:text-white">Help/ Methodologies</Link>
      </div>
      
      <div className="p-8 flex">
        {/* Left side content */}
        <div className="w-2/3 pr-8">
          <h1 className="text-4xl font-bold mb-1">The BUDGET VISUALISER</h1>
          <p className="text-gray-400 mb-6">Welcome to the Budget Visualiser! This tool helps you estimate your spending across different categories while living in your chosen country or city.</p>
          
          {/* Instructions */}
          <div className="mb-6">
            <h2 className="font-bold mb-2">Here's how to use it:</h2>
            <ol className="list-decimal ml-5 text-gray-300 text-sm">
              <li>Enter Your Budget: Simply type in your monthly budget below.</li>
              <li>Select Your Location: Use the sidebar on the right to choose the country or city you're interested in. (Please note that you can only view either countries or cities at one time, not both.)</li>
              <li>Adjust Spending Categories: Adjust the sliders for different spending categories as needed.</li>
              <li>Visualize Your Budget: A Sankey diagram will dynamically illustrate how your budget is allocated across categories and show your potential savings.</li>
              <li>Make Adjustments: Adjust the sliders to see how changes in your spending can affect your savings.</li>
              <li>You'll receive helpful messages to guide your adjustments if the budget is lower than the average or if the spending exceeds your budget!</li>
            </ol>
          </div>
          
          {/* Budget input */}
          <div className="mb-4">
            <p className="text-xs text-gray-400">Monthly Budget</p>
            <div className="flex">
              <input
                type="number"
                value={totalBudget}
                onChange={(e) => setTotalBudget(Number(e.target.value))}
                className="bg-green-900 border border-green-700 p-2 w-32 text-white text-xl"
              />
              <div className="bg-green-900 border border-green-700 p-2 text-white text-xl">USD</div>
            </div>
          </div>
          
          {/* Category sliders - Black box section */}
          <div className="bg-black border border-gray-800 p-4">
            {/* Rent */}
            <div className="mb-4">
              <div className="flex justify-between">
                <span>Rent</span>
                <span>{categories.Rent.value.toFixed(2)} USD</span>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max={categories.Rent.max}
                  step="0.01"
                  value={categories.Rent.value}
                  onChange={(e) => handleCategoryChange('Rent', e.target.value)}
                  className="w-full h-1 bg-pink-900 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Min: 0 USD</span>
                  <span>Average: {categories.Rent.average.toFixed(2)} USD</span>
                  <span>Max: {categories.Rent.max} USD</span>
                </div>
              </div>
            </div>
            
            {/* Groceries */}
            <div className="mb-4">
              <div className="flex justify-between">
                <span>Groceries</span>
                <span>{categories.Groceries.value.toFixed(2)} USD</span>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max={categories.Groceries.max}
                  step="0.01"
                  value={categories.Groceries.value}
                  onChange={(e) => handleCategoryChange('Groceries', e.target.value)}
                  className="w-full h-1 bg-pink-900 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Min: 0 USD</span>
                  <span>Average: {categories.Groceries.average.toFixed(2)} USD</span>
                  <span>Max: {categories.Groceries.max} USD</span>
                </div>
              </div>
            </div>
            
            {/* Dine-out */}
            <div className="mb-4">
              <div className="flex justify-between">
                <span>Dine-out</span>
                <span>{categories['Dine-out'].value.toFixed(2)} USD</span>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max={categories['Dine-out'].max}
                  step="0.01"
                  value={categories['Dine-out'].value}
                  onChange={(e) => handleCategoryChange('Dine-out', e.target.value)}
                  className="w-full h-1 bg-pink-900 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Min: 0 USD</span>
                  <span>Average: {categories['Dine-out'].average.toFixed(2)} USD</span>
                  <span>Max: {categories['Dine-out'].max} USD</span>
                </div>
              </div>
            </div>
            
            {/* Transport */}
            <div className="mb-4">
              <div className="flex justify-between">
                <span>Transport</span>
                <span>{categories.Transport.value.toFixed(2)} USD</span>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max={categories.Transport.max}
                  step="0.01"
                  value={categories.Transport.value}
                  onChange={(e) => handleCategoryChange('Transport', e.target.value)}
                  className="w-full h-1 bg-pink-900 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Min: 0 USD</span>
                  <span>Average: {categories.Transport.average.toFixed(2)} USD</span>
                  <span>Max: {categories.Transport.max} USD</span>
                </div>
              </div>
            </div>
            
            {/* Clothing */}
            <div className="mb-4">
              <div className="flex justify-between">
                <span>Clothing</span>
                <span>{categories.Clothing.value.toFixed(2)} USD</span>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max={categories.Clothing.max}
                  step="0.01"
                  value={categories.Clothing.value}
                  onChange={(e) => handleCategoryChange('Clothing', e.target.value)}
                  className="w-full h-1 bg-pink-900 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Min: 0 USD</span>
                  <span>Average: {categories.Clothing.average.toFixed(2)} USD</span>
                  <span>Max: {categories.Clothing.max} USD</span>
                </div>
              </div>
            </div>
            
            {/* Leisure */}
            <div className="mb-4">
              <div className="flex justify-between">
                <span>Leisure</span>
                <span>{categories.Leisure.value.toFixed(2)} USD</span>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max={categories.Leisure.max}
                  step="0.01"
                  value={categories.Leisure.value}
                  onChange={(e) => handleCategoryChange('Leisure', e.target.value)}
                  className="w-full h-1 bg-pink-900 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Min: 0 USD</span>
                  <span>Average: {categories.Leisure.average.toFixed(2)} USD</span>
                  <span>Max: {categories.Leisure.max} USD</span>
                </div>
              </div>
            </div>
            
            {/* Utilities */}
            <div className="mb-4">
              <div className="flex justify-between">
                <span>Utilities</span>
                <span>{categories.Utilities.value.toFixed(2)} USD</span>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max={categories.Utilities.max}
                  step="0.01"
                  value={categories.Utilities.value}
                  onChange={(e) => handleCategoryChange('Utilities', e.target.value)}
                  className="w-full h-1 bg-pink-900 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Min: 0 USD</span>
                  <span>Average: {categories.Utilities.average.toFixed(2)} USD</span>
                  <span>Max: {categories.Utilities.max} USD</span>
                </div>
              </div>
            </div>
            
            {/* Reset button */}
            <button 
              onClick={handleReset} 
              className="mt-2 px-4 py-1 bg-gray-700 text-white rounded hover:bg-gray-600"
            >
              Reset
            </button>
          </div>
        </div>
        
        {/* Right sidebar */}
        <div className="w-1/3">
          {/* Currency selector */}
          <div className="mb-4">
            <p className="text-xs text-gray-400">Choose your currency</p>
            <select 
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-gray-800 border border-gray-700 p-2 rounded w-full text-white"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="JPY">JPY</option>
            </select>
          </div>
          
          {/* Country/City level selector */}
          <div className="mb-4">
            <p className="text-xs text-gray-400">Country-level / City-level</p>
            <select 
              value={countryLevel}
              onChange={(e) => setCountryLevel(e.target.value)}
              className="bg-gray-800 border border-gray-700 p-2 rounded w-full text-white"
            >
              <option value="Country-level">Country-level</option>
              <option value="City-level">City-level</option>
            </select>
          </div>
          
          {/* Country dropdown */}
          <div className="mb-4">
            <select 
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="bg-gray-800 border border-gray-700 p-2 rounded w-full text-white"
            >
              <option value="Japan">Japan</option>
              {/* Other countries would be dynamically populated */}
            </select>
          </div>
          
          {/* Country search */}
          <div className="mb-4 relative">
            <input
              type="text"
              placeholder="Search country"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-800 border border-gray-700 p-2 pl-8 rounded w-full text-white"
            />
            <svg 
              className="w-4 h-4 absolute left-2 top-3 text-gray-400"
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          
          {/* Countries list */}
          <div className="bg-gray-800 border border-gray-700 rounded h-96 overflow-y-auto mb-8">
            {filteredCountries.map(country => (
              <div 
                key={country} 
                className={`p-2 cursor-pointer hover:bg-gray-700 flex justify-between ${selectedCountry === country ? 'bg-gray-700' : ''}`}
                onClick={() => setSelectedCountry(country)}
              >
                <span>{country}</span>
                <span>+</span>
              </div>
            ))}
          </div>
          
          {/* Sankey diagram visualization */}
          <div className="bg-white rounded p-4 h-96">
            <div className="h-full w-full bg-gray-100">
              {/* Custom Sankey diagram implementation */}
              <div className="h-full" style={{ background: 'linear-gradient(to right, #ddd, #eee)' }}>
                <div className="relative h-full">
                  {/* Budget bar */}
                  <div className="absolute left-0 top-0 bottom-0 w-8 bg-blue-400"></div>
                  
                  {/* Flow lines and category boxes */}
                  <div className="absolute right-0 top-16 h-16 w-32 bg-red-300 flex items-center justify-end pr-2">
                    <span className="text-xs text-gray-700">Rent: {categories.Rent.value.toFixed(2)}</span>
                  </div>
                  
                  <div className="absolute right-0 top-40 h-16 w-20 bg-green-300 flex items-center justify-end pr-2">
                    <span className="text-xs text-gray-700">Groceries: {categories.Groceries.value.toFixed(2)}</span>
                  </div>
                  
                  <div className="absolute right-0 top-64 h-12 w-16 bg-pink-200 flex items-center justify-end pr-2">
                    <span className="text-xs text-gray-700">Leisure: {categories.Leisure.value.toFixed(2)}</span>
                  </div>
                  
                  <div className="absolute right-0 top-80 h-8 w-16 bg-purple-200 flex items-center justify-end pr-2">
                    <span className="text-xs text-gray-700">Savings: {savings.toFixed(2)}</span>
                  </div>
                  
                  <div className="absolute right-0 top-92 h-12 w-20 bg-yellow-200 flex items-center justify-end pr-2">
                    <span className="text-xs text-gray-700">Utilities: {categories.Utilities.value.toFixed(2)}</span>
                  </div>
                  
                  <div className="absolute right-0 top-108 h-8 w-16 bg-purple-300 flex items-center justify-end pr-2">
                    <span className="text-xs text-gray-700">Dine-out: {categories['Dine-out'].value.toFixed(2)}</span>
                  </div>
                  
                  <div className="absolute right-0 top-120 h-12 w-20 bg-blue-200 flex items-center justify-end pr-2">
                    <span className="text-xs text-gray-700">Clothing: {categories.Clothing.value.toFixed(2)}</span>
                  </div>
                  
                  <div className="absolute right-0 top-136 h-8 w-16 bg-yellow-300 flex items-center justify-end pr-2">
                    <span className="text-xs text-gray-700">Transport: {categories.Transport.value.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetVisualiserPage;