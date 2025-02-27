import React, { useState } from "react";
import { ChevronDown, ArrowUpDown, Minus } from 'lucide-react';
import { Tooltip } from "react-tooltip";
// import countriesData from "C:\\Users\\User\\DH2321_Project\\src\\data\\data_latest.json"
import countriesData from "../data/data_latest.json"
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

export default function CountryComparePage() {
    const [selectedCountries, setSelectedCountries] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [baseLocation, setBaseLocation] = useState('United States');
    const [isBaseDropdownOpen, setIsBaseDropdownOpen] = useState(false);
    const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
    const [sortOption, setSortOption] = useState(false);
    const [levelType, setLevelType] = useState('country'); // 'country' or 'city'
    const [isLevelDropdownOpen, setIsLevelDropdownOpen] = useState(false);

    // Country-level data
    const countryData = {};
    const countries = [];

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
    // console.log(countryData);

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
            console.log(countryData[baseLocation]);
            const locationValue = countryData[location][metric];
            const percentDiff = ((locationValue - baseValue) / baseValue * 100).toFixed(0);
            if (isNaN(percentDiff)) {
                return 'NaN';
            }
            // Return with +/- sign
            const sign = percentDiff > 0 ? "+" : "-";
            return `${sign} ${Math.abs(percentDiff)}%`;
        } else {
            // City level comparison
            if (location === baseLocation) return "0%";

            const baseValue = cityData[baseLocation][metric];
            const locationValue = cityData[location][metric];
            const percentDiff = ((locationValue - baseValue) / baseValue * 100).toFixed(0);
            console.log(percentDiff);
            if (isNaN(percentDiff)) {
                return 'NaN';
            }
            // Return with +/- sign
            const sign = percentDiff > 0 ? "+" : "-";
            return `${sign} ${Math.abs(percentDiff)}%`;
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
            setBaseLocation('USA');
        } else {
            setBaseLocation('New York');
        }
        setIsLevelDropdownOpen(false);
    };

    return (
        <div className="min-h-screen bg-black text-white p-4">

            <div className="flex gap-8">
                {/* Left Section - Chart */}
                <div className="flex-1">
                    {/* Controls */}
                    <div className="flex gap-4 mb-8">
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

                    {/* Header for the chart section */}
                    <div className="flex mb-2 px-4">
                        <div className="w-32"></div> {/* Space for location names */}
                        <div className="flex-1"></div> {/* Space for bars */}
                        <div className="w-32 text-center">%Difference</div>
                        <div className="w-32 text-center">Purchasing<br />Power<br />Score</div>
                    </div>

                    {/* Chart with location data */}
                    <div className="h-220 overflow-y-auto">
                        {selectedCountries.length > 0 ? (
                            <>
                                {displayData.map((location, index) => (
                                    <div key={index} className="flex items-center mb-8">
                                        {/* Location name */}
                                        <div className="w-32 font-medium">
                                            {location.name}
                                            {levelType === 'city' && (
                                                <div className="text-xs text-gray-400">{location.country}</div>
                                            )}
                                        </div>

                                        {/* Bar chart section */}
                                        <div className="flex-1 relative">
                                            {/* Income bar */}
                                            <div
                                                className="h-6 bg-green-400 absolute"
                                                style={{ width: `${(location.income / 8000) * 100}%` }}
                                                data-tooltip-id={`income-tooltip-${index}`}
                                            ></div>
                                            <Tooltip id={`income-tooltip-${index}`} place="top" content={`Income: ${location.income.toLocaleString()}`} />

                                            {/* Income value */}
                                            <div className="absolute right-2 top-[-10px] text-xs text-black font-bold">
                                                {location.income.toLocaleString()}
                                            </div>

                                            {/* Spending bar */}
                                            <div
                                                className="h-6 bg-pink-400 absolute mt-8"
                                                style={{ width: `${(location.spending / 8000) * 100}%` }}
                                                data-tooltip-id={`spending-tooltip-${index}`}
                                            ></div>
                                            <Tooltip id={`spending-tooltip-${index}`} place="top" content={`Spending: ${location.spending.toLocaleString()}`} />

                                            {/* Spending value */}
                                            <div className="absolute right-2 top-8 text-xs text-black font-bold">
                                                {location.spending.toLocaleString()}
                                            </div>
                                        </div>

                                        {/* Percentage difference column - only show if not base location */}
                                        <div className="w-32 text-center">
                                            {location.name !== baseLocation ? (
                                                <>
                                                    <div className={location.isIncomePositive ? "text-green-400" : "text-red-500"}>
                                                        {location.incomeDiff}
                                                    </div>
                                                    <div className={location.isSpendingPositive ? "text-green-400" : "text-red-500"}>
                                                        {location.spendingDiff}
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="text-green-400">++ 0%</div>
                                                    <div className="text-green-400">++ 0%</div>
                                                </>
                                            )}
                                        </div>

                                        {/* Purchasing Power Score */}
                                        <div className="w-32 text-center">
                                            <div className="font-bold text-xl">{location.pps}</div>
                                        </div>
                                    </div>
                                ))}
                            </>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-500">
                                Select {levelType === 'country' ? 'Countries' : 'Cities'} on the right bar to start...
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Section - Location Selector & Settings */}
                <div className="w-84">
                    {/* Currency Selector */}
                    {/*<div className="mb-4">
                        <div className="text-sm text-gray-400">Currency</div>
                        <div className="bg-gray-800 p-2 rounded flex justify-between items-center">
                            <div className="flex items-center">
                                <span className="mr-2">🇺🇸</span>
                                <span>USD</span>
                            </div>
                            <ChevronDown size={16} />
                        </div>
                    </div>*/}

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