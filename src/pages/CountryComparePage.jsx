import React, { useState } from "react";
import { ChevronDown, ArrowUpDown, Minus } from 'lucide-react';
import { Tooltip } from "react-tooltip";
import countriesData from "../data/data_latest.json";
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import currencyData from "../data/currencies_data.json";
import { 
    BarChart, 
    Bar, 
    LineChart,
    Line,
    XAxis, 
    YAxis, 
    CartesianGrid, 
    ResponsiveContainer,
    Legend, 
    Tooltip as RechartsTooltip
} from 'recharts';

export default function CountryComparePage() {
    const [selectedCountries, setSelectedCountries] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [baseLocation, setBaseLocation] = useState('United States');
    const [isBaseDropdownOpen, setIsBaseDropdownOpen] = useState(false);
    const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
    const [sortOption, setSortOption] = useState(false);
    const [levelType, setLevelType] = useState('country'); // 'country' or 'city'
    const [isLevelDropdownOpen, setIsLevelDropdownOpen] = useState(false);
    // Improved currency state
    const [selectedCurrency, setSelectedCurrency] = useState('USD');
    const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);

    // Country-level data
    const countryData = {};
    const countries = [];
    
    // Setup currency conversion rates
    const conversionRates = {};
    const currenciesList = [];
    
    // Process currency data
    for(const currency of currencyData){
      conversionRates[currency.code] = currency.exchange_rate;
      currenciesList.push({
        code: currency.code,
        name: currency.name,
        flag: currency.flag,
        exchange_rate: currency.exchange_rate
      });
    }
    
    // City-level data
    const cityData = {};
    for (const [countryCode, countryInfo] of Object.entries(countriesData)) {
        if(countryInfo.country.Net_Salary!=null&&countryInfo.country.Total_Expenses!=null){
            countries.push(countryInfo.country_name);
            countryData[countryInfo.country_name] = { ...countryInfo.country };
            if (countryInfo.cities) {
                for (const [cityName, cityInfo] of Object.entries(countryInfo.cities)) {
                    if(cityInfo.Net_Salary!=null&&cityInfo.Total_Expenses!=null){
                        cityData[cityName] = { ...cityInfo, country: countryCode };
                    }
                }
            }
        }
    }

    // Get the current data set based on level type
    const getCurrentData = () => {
        return levelType === 'country' ? countryData : cityData;
    };

    // Get the current location list based on level type
    const getLocationsList = () => {
        if (levelType === 'country') {
            return countries;
        } else {
            return Object.keys(cityData);
        }
    };

    // Convert currency value
    const convertCurrency = (value) => {
        // Assuming all values in the data are in USD
        if (selectedCurrency === 'USD') return value;
        
        // Get the conversion rate for the selected currency
        const rate = conversionRates[selectedCurrency] || 1;
        return value * rate;
    };

    // Get currency symbol
    const getCurrencySymbol = () => {
        const currency = currenciesList.find(c => c.code === selectedCurrency);
        return currency ? currency.code : 'USD';
    };

    // Get currency flag
    const getCurrencyFlag = () => {
        const currency = currenciesList.find(c => c.code === selectedCurrency);
        return currency ? currency.flag : '🇺🇸';
    };

    // Format currency value with proper symbol
    const formatCurrency = (value) => {
        if (!value && value !== 0) return '--';
        
        // Round to 2 decimal places
        const roundedValue = Math.round(value * 100) / 100;
        
        // Format with thousands separators
        return roundedValue.toLocaleString();
    };

    // Calculate PPS (Purchasing Power Score)
    const calculatePPS = (location) => {
        const currentData = getCurrentData();

        if (levelType === 'country') {
            if (!currentData[location]) return 0;
            if (location === baseLocation) return 100; // Base location always has 100

            // Calculate based on income ratio and spending efficiency
            const baseIncomeExpensesRatio = countryData[baseLocation].Net_Salary / countryData[baseLocation].Total_Expenses;
            const locationIncomeExpensesRatio = countryData[location].Net_Salary / countryData[location].Total_Expenses;

            // Income ratio determines the base value
            const incomeRatio = locationIncomeExpensesRatio / baseIncomeExpensesRatio;

            // For other locations, approximate the PPS based on the pattern
            return Math.round(100 * incomeRatio);
        } else {
            // City level comparison
            if (!currentData[location]) return 0;
            if (location === baseLocation) return 100; // Base location always has 100

            // Calculate based on income ratio between cities
            const baseIncomeExpensesRatio = cityData[baseLocation].Net_Salary/cityData[baseLocation].Total_Expenses;
            const locationIncomeExpensesRatio = cityData[location].Net_Salary/cityData[location].Total_Expenses;
            
            // Income ratio determines the base value
            const incomeRatio = locationIncomeExpensesRatio / baseIncomeExpensesRatio;
            
            // For cities, approximate the PPS based on income ratio
            return Math.round(100 * incomeRatio );
        }
    };

    // Calculate percentage differences compared to base location
    const calculateDifference = (location, metric) => {
        const currentData = getCurrentData();

        if (levelType === 'country') {
            if (!currentData[location]) return "0%";
            if (location === baseLocation) return "0%";

            const baseValue = countryData[baseLocation][metric];
            const locationValue = countryData[location][metric];
            const percentDiff = ((locationValue - baseValue) / baseValue * 100).toFixed(0);
            if (isNaN(percentDiff)) {
                return 'NaN';
            }
            // Return with +/- sign
            const sign = percentDiff > 0 ? "+" : "";
            return `${sign}${percentDiff}%`;
        } else {
            // City level comparison
            if (location === baseLocation) return "0%";

            const baseValue = cityData[baseLocation][metric];
            const locationValue = cityData[location][metric];
            const percentDiff = ((locationValue - baseValue) / baseValue * 100).toFixed(0);
            if (isNaN(percentDiff)) {
                return 'NaN';
            }
            // Return with +/- sign
            const sign = percentDiff > 0 ? "+" : "";
            return `${sign}${percentDiff}%`;
        }
    };

    // Determine if difference is positive or negative
    const isDifferencePositive = (location, metric) => {
        const currentData = getCurrentData();

        if (levelType === 'country') {
            if (!baseLocation || !countryData[baseLocation] || !countryData[location]) return true;
            if (location === baseLocation) return true;

            const baseValue = countryData[baseLocation][metric];
            const locationValue = countryData[location][metric];
            return locationValue >= baseValue;
        } else {
            // City level comparison
            if (!baseLocation || !cityData[baseLocation] || !cityData[location]) return true;
            if (location === baseLocation) return true;

            const baseValue = cityData[baseLocation][metric];
            const locationValue = cityData[location][metric];
            return locationValue >= baseValue;
        }
    };

    // Prepare data for display
    const displayData = selectedCountries
        .filter(location => getCurrentData()[location])
        .map(location => ({
            name: location,
            income: getCurrentData()[location]?.Net_Salary || 0,
            spending: getCurrentData()[location]?.Total_Expenses || 0,
            incomeDiff: calculateDifference(location, 'Net_Salary'),
            spendingDiff: calculateDifference(location, 'Total_Expenses'),
            isIncomePositive: isDifferencePositive(location, 'Net_Salary'),
            isSpendingPositive: isDifferencePositive(location, 'Total_Expenses'),
            pps: calculatePPS(location),
            country: levelType === 'city' ? cityData[location]?.country : location
        }))
        .sort((a, b) => {
            if (!sortOption) return 0;
            const avalue = a[sortOption];
            const bvalue = b[sortOption];
            return bvalue - avalue;
        });

    // Prepare data for Recharts components with converted currency values
    const prepareBarChartData = () => {
        return displayData.map(location => ({
            name: location.name,
            income: convertCurrency(location.income),
            spending: convertCurrency(location.spending)
        }));
    };

    const preparePPSChartData = () => {
        return [{
            name: 'Purchasing Power Score',
            data: displayData.map(location => ({
                name: location.name,
                pps: location.pps
            }))
        }];
    };

    const filteredLocations = getLocationsList()
        .filter(location =>
            location.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => a.localeCompare(b));

    // Handle level type change
    const handleLevelChange = (newLevel) => {
        setLevelType(newLevel);
        // Clear selected countries when switching level types
        setSelectedCountries([]);
        // Reset base location appropriately
        if (newLevel === 'country') {
            setBaseLocation('United States');
        } else {
            setBaseLocation('New York');
        }
        setIsLevelDropdownOpen(false);
    };

    // Custom tooltip for recharts
    const CustomBarTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-gray-800 p-3 rounded shadow-lg border border-gray-700">
                    <p className="font-medium mb-1">{label}</p>
                    {payload.map((item, index) => (
                        <p key={index} className="text-sm" style={{ color: item.color }}>
                            {item.name}: {getCurrencySymbol()} {formatCurrency(item.value)}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    const CustomPPSTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-gray-800 p-3 rounded shadow-lg border border-gray-700">
                    <p className="font-medium mb-1">{label}</p>
                    {payload.map((item, index) => (
                        <p key={index} className="text-sm" style={{ color: item.color }}>
                            {item.name}: {item.value}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="min-h-screen bg-black text-white p-4">
            <div className="flex gap-8">
                {/* Left Section - Charts */}
                <div className="flex-1">
                    {/* Controls */}
                    <div className="flex gap-4 mb-8 flex-wrap">
                        <div className="relative">
                            <button
                                className="flex items-center bg-gray-800 gap-2 px-4 py-2 rounded"
                                onClick={() => setIsBaseDropdownOpen(!isBaseDropdownOpen)}
                            >
                                <span>Base {levelType === 'country' ? 'Country' : 'City'}</span>
                                <ChevronDown size={16} />
                            </button>

                            {/* Dropdown */}
                            {isBaseDropdownOpen && (
                                <div className="absolute bg-gray-900 mt-2 rounded shadow-lg p-2 w-48 z-50">
                                    {selectedCountries.map(location => (
                                        <div
                                            key={location}
                                            className="p-2 hover:bg-gray-700 cursor-pointer rounded"
                                            onClick={() => {
                                                setBaseLocation(location);
                                                setIsBaseDropdownOpen(false);
                                            }}
                                        >
                                            {location}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Improved Currency Selector */}
                        <div className="relative">
                            <button
                                className="flex items-center bg-gray-800 gap-2 px-4 py-2 rounded"
                                onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
                            >
                                <span>{selectedCurrency}</span>
                                <ChevronDown size={16} />
                            </button>

                            {/* Currency Dropdown */}
                            {isCurrencyDropdownOpen && (
                                <div className="absolute bg-gray-900 mt-2 rounded shadow-lg p-2 w-64 z-50 max-h-64 overflow-y-auto">
                                    {currenciesList.map(currency => (
                                        <div
                                            key={currency.code}
                                            className="p-2 hover:bg-gray-700 cursor-pointer rounded flex items-center"
                                            onClick={() => {
                                                setSelectedCurrency(currency.code);
                                                setIsCurrencyDropdownOpen(false);
                                            }}
                                        >
                                            <span className="font-medium mr-2">{currency.code}</span>
                                            <span className="text-gray-400 text-sm">{currency.name}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button className="relative flex items-center gap-2 bg-gray-800 px-4 py-2 rounded"
                        onClick={()=>setIsSortDropdownOpen(!isSortDropdownOpen)}>
                            <span>Sort</span>
                            <ArrowUpDown size={16} />
                        </button>
                        
                        {/* Sorting DropDown */}
                        {isSortDropdownOpen && (
                            <div className="absolute bg-gray-900 mt-10 rounded shadow-lg p-2 w-48 z-50 left-45">
                                <div 
                                    className="p-2 hover:bg-gray-700 cursor-pointer rounded"
                                    onClick={() => {
                                        setSortOption('income');
                                        setIsSortDropdownOpen(false);
                                    }}
                                >
                                    Income
                                </div>
                                <div 
                                    className="p-2 hover:bg-gray-700 cursor-pointer rounded"
                                    onClick={() => {
                                        setSortOption('spending');
                                        setIsSortDropdownOpen(false);
                                    }}
                                >
                                    Spending
                                </div>
                                <div 
                                    className="p-2 hover:bg-gray-700 cursor-pointer rounded"
                                    onClick={() => {
                                        setSortOption('pps');
                                        setIsSortDropdownOpen(false);
                                    }}
                                >
                                    Purchasing Power Score
                                </div>
                            </div>
                        )}
                        
                        <div className="flex items-center ml-4">
                            <div className="w-4 h-4 bg-green-400 mr-2"></div>
                            <span>Avg Monthly Income</span>
                        </div>
                        <div className="flex items-center ml-4">
                            <div className="w-4 h-4 bg-pink-400 mr-2"></div>
                            <span>Avg Monthly Spending</span>
                        </div>
                    </div>

                    {/* Chart Section */}
                    {selectedCountries.length > 0 ? (
                        <div className="space-y-8">
                            {/* Income/Expense Bar Chart */}
                            <div className="bg-gray-900 p-4 rounded">
                                <h3 className="text-lg font-medium mb-4">
                                    Income vs. Expenses Comparison ( {getCurrencySymbol()})
                                </h3>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            data={prepareBarChartData()}
                                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                                            <XAxis dataKey="name" stroke="#fff" />
                                            <YAxis stroke="#fff" />
                                            <RechartsTooltip content={<CustomBarTooltip />} />
                                            <Legend />
                                            <Bar dataKey="income" name="Income" fill="#4ade80" />
                                            <Bar dataKey="spending" name="Spending" fill="#f472b6" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Purchasing Power Score Chart */}
                            <div className="bg-gray-900 p-4 rounded">
                                <h3 className="text-lg font-medium mb-4">Purchasing Power Score Comparison</h3>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                                            <XAxis 
                                                dataKey="name" 
                                                type="category" 
                                                allowDuplicatedCategory={false}
                                                stroke="#fff" 
                                            />
                                            <YAxis stroke="#fff" domain={[0, 'dataMax + 20']} />
                                            <RechartsTooltip content={<CustomPPSTooltip />} />
                                            <Legend />
                                            {preparePPSChartData().map((s) => (
                                                <Line 
                                                    key={s.name}
                                                    dataKey="pps"
                                                    data={s.data}
                                                    name={s.name}
                                                    stroke="#3b82f6"
                                                    strokeWidth={2}
                                                    dot={{ r: 6, fill: '#3b82f6' }}
                                                    activeDot={{ r: 8 }}
                                                />
                                            ))}
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Detailed Comparison Table */}
                            <div className="bg-gray-900 p-4 rounded overflow-x-auto">
                                <h3 className="text-lg font-medium mb-4">Detailed Comparison</h3>
                                <table className="min-w-full divide-y divide-gray-700">
                                    <thead>
                                        <tr>
                                            <th className="px-4 py-2 text-left">Location</th>
                                            <th className="px-4 py-2 text-right">Income ( {getCurrencySymbol()})</th>
                                            <th className="px-4 py-2 text-right">Income Diff</th>
                                            <th className="px-4 py-2 text-right">Spending ( {getCurrencySymbol()})</th>
                                            <th className="px-4 py-2 text-right">Spending Diff</th>
                                            <th className="px-4 py-2 text-right">PPS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {displayData.map((location, index) => (
                                            <tr key={index} className={index % 2 === 0 ? 'bg-gray-800' : ''}>
                                                <td className="px-4 py-2">
                                                    {location.name}
                                                    {levelType === 'city' && (
                                                        <div className="text-xs text-gray-400">{location.country}</div>
                                                    )}
                                                </td>
                                                <td className="px-4 py-2 text-right">
                                                    {formatCurrency(convertCurrency(location.income))}
                                                </td>
                                                <td className={`px-4 py-2 text-right ${location.isIncomePositive ? 'text-green-400' : 'text-red-500'}`}>
                                                    {location.incomeDiff}
                                                </td>
                                                <td className="px-4 py-2 text-right">
                                                    {formatCurrency(convertCurrency(location.spending))}
                                                </td>
                                                <td className={`px-4 py-2 text-right ${location.isSpendingPositive ? 'text-red-500' : 'text-green-400'}`}>
                                                    {location.spendingDiff}
                                                </td>
                                                <td className="px-4 py-2 text-right font-bold">{location.pps}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="h-64 flex items-center justify-center text-gray-500">
                            Select {levelType === 'country' ? 'Countries' : 'Cities'} on the right bar to start...
                        </div>
                    )}
                </div>

                {/* Right Section - Location Selector & Settings */}
                <div className="w-84">
                    {/* Level Type Selector */}
                    <div className="mb-4">
                        <div className="text-sm text-gray-400">Data Level</div>
                        <div
                            className="bg-gray-800 p-2 rounded flex justify-between items-center cursor-pointer"
                            onClick={() => setIsLevelDropdownOpen(!isLevelDropdownOpen)}
                        >
                            <span>{levelType === 'country' ? 'Country-level' : 'City-level'}</span>
                            <ChevronDown size={16} />
                        </div>
                        {isLevelDropdownOpen && (
                            <div className="absolute bg-gray-900 mt-1 rounded shadow-lg p-2 w-48 z-50">
                                <div
                                    className={`p-2 hover:bg-gray-700 cursor-pointer rounded ${levelType === 'country' ? 'bg-gray-700' : ''}`}
                                    onClick={() => handleLevelChange('country')}
                                >
                                    Country-level
                                </div>
                                <div
                                    className={`p-2 hover:bg-gray-700 cursor-pointer rounded ${levelType === 'city' ? 'bg-gray-700' : ''}`}
                                    onClick={() => handleLevelChange('city')}
                                >
                                    City-level
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Selected Locations */}
                    <div className="mb-4 max-h-48 overflow-y-auto">
                        {selectedCountries.map(location => (
                            <div key={location} className="bg-gray-800 p-2 rounded mb-1 flex justify-between items-center">
                                <div>
                                    <span>{location}</span>
                                    {levelType === 'city' && cityData[location] && (
                                        <div className="text-xs text-gray-400">{cityData[location].country}</div>
                                    )}
                                </div>
                                <button
                                    className="text-red-500"
                                    onClick={() => {
                                        setSelectedCountries(selectedCountries => selectedCountries.filter(c => c !== location));
                                    }}>
                                    <Minus size={16} />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Location Selection */}
                    <div className="bg-gray-900 p-4 rounded">
                        <div className="relative mb-4">
                            <input
                                type="text"
                                placeholder={`Search ${levelType === 'country' ? 'country' : 'city'}`}
                                className="w-full bg-black p-2 rounded"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="space-y-1 max-h-64 overflow-y-auto">
                            {filteredLocations.map(location => (
                                <div
                                    key={location}
                                    className="flex justify-between items-center hover:bg-gray-800 p-2 rounded cursor-pointer"
                                    onClick={() => setSelectedCountries(prev =>
                                        prev.includes(location) ? prev.filter(c => c !== location) : [...prev, location]
                                    )}
                                >
                                    <div>
                                        <span>{location}</span>
                                        {levelType === 'city' && cityData[location] && (
                                            <div className="text-xs text-gray-400">{cityData[location].country}</div>
                                        )}
                                    </div>
                                    <button className="w-6 h-6 border border-gray-600 rounded flex items-center justify-center">
                                        {selectedCountries.includes(location) ? "" : "+"}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Formula Explanation */}
                    <div className="mt-10 p-4 text-center text-gray-400 text-sm">
                        This chart compares the purchasing power and net salaries of different countries, highlighting the differences in income levels and cost of living. The initial income differences are measured relative to US(Country Level) and New York City(City Level). The PPI is computed as follows:
                        <div className="mt-5 text-center">
                            <div className="flex justify-center items-center">
                                <BlockMath
                                    math={`\\text{Ratio1} = \\frac{\\text{Net Salary in City or Country}}{\\text{Total Expenses in City or Country}}`}
                                    renderError={(error) => <span>{error}</span>}
                                />
                            </div>
                            <div className="flex justify-center items-center">
                                <BlockMath
                                    math={`\\text{Ratio2} = \\frac{\\text{Net Salary in New York City}}{\\text{Total Expenses in New York City}}`}
                                    renderError={(error) => <span>{error}</span>}
                                />
                            </div>
                            <div className="flex justify-center items-center">
                                <BlockMath
                                    math={`\\text{PPS} = \\frac{\\text{Ratio1}}{\\text{Ratio2}}`}
                                    renderError={(error) => <span>{error}</span>}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}