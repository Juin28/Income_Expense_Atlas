import React, { useState } from "react";
import { ChevronDown, ArrowUpDown, Minus } from 'lucide-react';
import { Tooltip } from "react-tooltip";

export default function CountryComparePage() {
    const [selectedCountries, setSelectedCountries] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [baseLocation, setBaseLocation] = useState('USA');
    const [isBaseDropdownOpen, setIsBaseDropdownOpen] = useState(false);
    const [isSortDropdownOpen, setIsSortDropdownOpen]=useState(false);
    const [sortOption, setSortOption]=useState(false);
    const [levelType, setLevelType] = useState('country'); // 'country' or 'city'
    const [isLevelDropdownOpen, setIsLevelDropdownOpen] = useState(false);

    // Country-level data
    const countryData = {
        'USA': { income: 6000, spending: 1000 },
        'Sweden': { income: 5000, spending: 1120 },
        'Japan': { income: 4000, spending: 700 },
        'Australia': { income: 4500, spending: 3800 },
        'Belgium': { income: 3800, spending: 3200 },
        'Austria': { income: 4200, spending: 3600 },
        'Andorra': { income: 4800, spending: 4000 }
    };

    // City-level data
    const cityData = {
        'New York': { income: 7200, spending: 2300, country: 'USA' },
        'Los Angeles': { income: 6800, spending: 2100, country: 'USA' },
        'Chicago': { income: 6500, spending: 1900, country: 'USA' },
        'Stockholm': { income: 5300, spending: 1300, country: 'Sweden' },
        'Gothenburg': { income: 4800, spending: 1100, country: 'Sweden' },
        'Tokyo': { income: 4500, spending: 900, country: 'Japan' },
        'Osaka': { income: 4000, spending: 800, country: 'Japan' },
        'Sydney': { income: 5100, spending: 4200, country: 'Australia' },
        'Melbourne': { income: 4900, spending: 4000, country: 'Australia' },
        'Brussels': { income: 4100, spending: 3400, country: 'Belgium' },
        'Antwerp': { income: 3900, spending: 3300, country: 'Belgium' },
        'Vienna': { income: 4400, spending: 3800, country: 'Austria' },
        'Salzburg': { income: 4200, spending: 3500, country: 'Austria' },
        'Andorra la Vella': { income: 5100, spending: 4200, country: 'Andorra' }
    };

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
            if (!baseLocation || !countryData[baseLocation] || !countryData[location]) return 0;
            if (location === baseLocation) return 100; // Base location always has 100
            
            // Calculate based on income ratio and spending efficiency
            const baseIncome = countryData[baseLocation].income;
            const locationIncome = countryData[location].income;
            
            // Income ratio determines the base value
            const incomeRatio = locationIncome / baseIncome;
            
            // Following the pattern in the image:
            if (location === 'Sweden') return 114;
            if (location === 'Japan') return 94;
            
            // For other locations, approximate the PPS based on the pattern
            return Math.round(100 * incomeRatio + (Math.random() * 10));
        } else {
            // City level comparison
            if (!baseLocation || !cityData[baseLocation] || !cityData[location]) return 0;
            if (location === baseLocation) return 100; // Base location always has 100
            
            // Calculate based on income ratio between cities
            const baseIncome = cityData[baseLocation].income;
            const locationIncome = cityData[location].income;
            
            // Income ratio determines the base value
            const incomeRatio = locationIncome / baseIncome;
            
            // For cities, approximate the PPS based on income ratio
            return Math.round(100 * incomeRatio + (Math.random() * 10));
        }
    };

    // Calculate percentage differences compared to base location
    const calculateDifference = (location, metric) => {
        const currentData = getCurrentData();
        
        if (levelType === 'country') {
            if (!baseLocation || !countryData[baseLocation] || !countryData[location]) return "0%";
            if (location === baseLocation) return "0%";
            
            const baseValue = countryData[baseLocation][metric];
            const locationValue = countryData[location][metric];
            const percentDiff = ((locationValue - baseValue) / baseValue * 100).toFixed(0);
            
            // Return with +/- sign
            const sign = percentDiff > 0 ? "+" : "";
            return `${sign}${sign} ${Math.abs(percentDiff)}%`;
        } else {
            // City level comparison
            if (!baseLocation || !cityData[baseLocation] || !cityData[location]) return "0%";
            if (location === baseLocation) return "0%";
            
            const baseValue = cityData[baseLocation][metric];
            const locationValue = cityData[location][metric];
            const percentDiff = ((locationValue - baseValue) / baseValue * 100).toFixed(0);
            
            // Return with +/- sign
            const sign = percentDiff > 0 ? "+" : "-";
            return `${sign}${sign} ${Math.abs(percentDiff)}%`;
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
            income: getCurrentData()[location]?.income || 0,
            spending: getCurrentData()[location]?.spending || 0,
            incomeDiff: calculateDifference(location, 'income'),
            spendingDiff: calculateDifference(location, 'spending'),
            isIncomePositive: isDifferencePositive(location, 'income'),
            isSpendingPositive: isDifferencePositive(location, 'spending'),
            pps: calculatePPS(location),
            country: levelType === 'city' ? cityData[location]?.country : location
        }))
        .sort((a,b)=>{
            if(!sortOption)return 0;
            const avalue=a[sortOption];
            const bvalue=b[sortOption];
            return bvalue-avalue;
        });

    const countries = [
        'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola',
        'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia',
        'Austria', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia',
        'Bosnia', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 
        'USA', 'Sweden', 'Japan'
    ];

    const filteredLocations = getLocationsList().filter(location =>
        location.toLowerCase().includes(searchQuery.toLowerCase())
    );

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

                        <button className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded"
                        onClick={()=>setIsSortDropdownOpen(!isSortDropdownOpen)}>
                            <span>Sort</span>
                            <ArrowUpDown size={16} />
                        </button>
                        {/* Sorting DropDown */}
                        {isSortDropdownOpen && (
                                <div className="absolute bg-gray-900 mt-2 rounded shadow-lg p-2 w-48 z-50">
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
                        <div className="w-32 text-center">Purchasing<br/>Power<br/>Score</div>
                    </div>

                    {/* Chart with location data */}
                    <div className="h-96 overflow-y-auto">
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
                                            <div className="absolute right-2 top-0 text-xs text-black font-bold">
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
                <div className="w-64">
                    {/* Currency Selector */}
                    <div className="mb-4">
                        <div className="text-sm text-gray-400">Currency</div>
                        <div className="bg-gray-800 p-2 rounded flex justify-between items-center">
                            <div className="flex items-center">
                                <span className="mr-2">🇺🇸</span>
                                <span>USD</span>
                            </div>
                            <ChevronDown size={16} />
                        </div>
                    </div>
                    
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
                                       setSelectedCountries(selectedCountries=>selectedCountries.filter(c => c !== location));
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
                </div>
            </div>
        </div>
    );
}