import React, { useState, useEffect } from "react";

// Reference: Recharts Documentation (https://recharts.org/en-US/guide/getting-started)
// Used Recharts library for PieChart and BarChart visualization
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Legend,
    ResponsiveContainer,
    LabelList, Label, ReferenceLine
} from "recharts";
import {useNavigate, useLocation} from "react-router-dom";
import data from "../data/data_latest.json";
import currencies from "../data/currencies_data.json";

const COLORS = ["#8B2F8A", "#A2539B", "#B977AC", "#CA498C", "#CF9BBD", "#E6BFCE", "#FDE3DF"];
const CATEGORY_MAP = {
    "Markets": "Groceries",
    "Clothing_And_Shoes": "Clothings",
    "Rent_Per_Month": "Rent",
    "Restaurants": "Dine-out",
    "Sports_And_Leisure": "Leisure",
    "Public_Transportation": "Transport",
    "Utilities": "Utilities"
};
const COLOR_MAP = {
    "Markets": "#CA498C",
    "Clothing_And_Shoes": "#8B2F8A",
    "Rent_Per_Month": "#A2539B",
    "Restaurants": "#B977AC",
    "Sports_And_Leisure": "#CF9BBD",
    "Public_Transportation": "#E6BFCE",
    "Utilities": "#FDE3DF"
}


export default function CountryStatisticPage() {
    /**
     * Rounds all numerical values in a JSON object to two decimal places.
     * Inspired by Stack Overflow discussion: https://stackoverflow.com/questions/44181348/round-off-decimals-values-in-all-objects-of-a-json-object
     * @param {Object} obj - The object to process.
     * @returns {Object} - The rounded object.
     */
    const roundValues = (obj) => {
        if (typeof obj === "number") {
            return Math.round(obj * 100) / 100; // Round to 2 decimal places
        } else if (Array.isArray(obj)) {
            return obj.map(roundValues);
        } else if (typeof obj === "object" && obj !== null) {
            return Object.fromEntries(
                Object.entries(obj).map(([key, value]) => [key, roundValues(value)])
            );
        }
        return obj;
    };

    const processedData = roundValues(data);

    const navigate = useNavigate();
    const { search } = useLocation();  // Get the search query from the URL
    const [selectedCountry, setSelectedCountry] = useState("SWE");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [currency, setCurrency] = useState("USD");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    // Function to update selected country and update URL
    const handleCountrySelection = (countryCode) => {
        setSelectedCountry(countryCode);
        navigate(`/country-statistics/country?countryCode=${countryCode}`);
    };

    const expenseCategories = Object.keys(CATEGORY_MAP);

    // Filter countries that have valid processedData for pie chart
    const validCountries = Object.keys(processedData).filter(code => {
        const countryData = processedData[code] || { country: {}, cities: {} };
        const latestData = countryData.country || {};

        /*
        Reference: MDN Web Docs (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)
        Used Array.map to transform data for visualization.
        */
        const pieData = expenseCategories.map((category, index) => ({
            name: category.replace(/_/g, " ").toUpperCase(),
            value: latestData[category] || 0,
        })).filter(item => item.value > 0);

        return pieData.length > 0; // Only include countries with valid pieData
    });

    // Extract the countryCode from URL query parameter
    useEffect(() => {
        const params = new URLSearchParams(search);
        const countryCode = params.get("countryCode");

        if (validCountries.includes(countryCode)) {
            handleCountrySelection(countryCode);
        }
        else{
            handleCountrySelection("SWE");
        }
    }, [search]); // This hook will run whenever the URL changes


    const countryData = processedData[selectedCountry] || { country: {}, cities: {} };
    const latestData = countryData.country || {};

    const pieData = expenseCategories.map((category, index) => ({
        name: CATEGORY_MAP[category] || category, // Use mapped name
        value: latestData[category] || 0,
        color: COLOR_MAP[category]
    })).filter(item => item.value > 0);

    if (pieData.length === 0) {
        return null; // Skip rendering this country if no valid data
    }

    // Step 1: Get the full list of categories available in the country
    const countryCategories = Object.keys(latestData).filter(category => latestData[category] > 0);

    // Step 2: Check each city's category coverage
    const citiesToDisplay = Object.keys(countryData.cities).filter(city => {
        const cityCategories = Object.keys(countryData.cities[city]).filter(category => countryData.cities[city][category] > 0);
        const missingCategories = countryCategories.filter(category => !cityCategories.includes(category));

        // Keep the city if it's missing fewer than 3 categories
        return missingCategories.length < 3;
    });

    // Step 3: Generate `barData` for cities, appending missing values from country data
    const barData = citiesToDisplay.map(city => {
        let cityData = { city };

        countryCategories.forEach(category => {
            // Use the city's value if available; otherwise, use the country's value
            cityData[CATEGORY_MAP[category]] = countryData.cities[city]?.[category] ?? latestData[category] ?? 0;
        });

        return cityData;
    });


    /**
     * Update the bar data by dealing with missing values
     * For those cities with no less than 3 categories than its country, append the missing values of these categories with the country values.
     * Otherwise, eliminate this city for display.
     * Discussed and Agreed by the Group on 24 Feb
     * @param barData - The original bar data.
     * @returns updatedBarData - The updated bar data with missing values handled.
     */
    const updatedBarData = barData.map((entry) => {
        return {
            ...entry,
            // Multiply each numerical category by the exchange rate of the selected currency
            ...Object.keys(entry).reduce((acc, key) => {
                if (typeof entry[key] === "number") {
                    // Multiply only the numerical values by the exchange rate
                    acc[key] = Math.round(entry[key] * (currencies.find(currencyOption => currencyOption.code === currency)?.exchange_rate || 1));
                } else {
                    // Keep non-numerical values like city names intact
                    acc[key] = entry[key];
                }
                return acc;
            }, {}),
        };
    });

    return (
        <div className="flex min-h-screen bg-black text-white">
            <div className="w-1/5 p-4 bg-gray-900 border-l overflow-y-auto fixed right-0 h-full">
                <h2 className="text-sm font-semibold mt-4">Currency</h2>
                <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="mt-2 w-full p-2 rounded border border-gray-600 bg-gray-700 focus:outline-none focus:border-cyan-500"
                >
                    {currencies.map(currencyOption => (
                        <option key={currencyOption.code} value={currencyOption.code}>
                            {currencyOption.flag} {currencyOption.name} ({currencyOption.code})
                        </option>
                    ))}
                </select>
                <h2 className="text-sm font-semibold mt-4">Select Country</h2>
                <input
                    type="text"
                    placeholder="🔎   Search country"
                    className="mt-2 w-full p-2 rounded border border-gray-600 bg-gray-700 focus:outline-none focus:border-cyan-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="mt-4 overflow-y-auto h-[calc(100vh-200px)]">
                    {validCountries
                        .filter(code =>
                            processedData[code].country_name.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .sort((a, b) =>
                            processedData[a].country_name.localeCompare(processedData[b].country_name)
                        ) // Sort alphabetically
                        .map(code => (
                            <button
                                key={code}
                                className={`block w-full text-left p-1 pl-8 transition-transform duration-200 transform my-auto 
                ${selectedCountry === code ? "bg-blue-400 text-white font-bold" : "hover:bg-cyan-200 hover:text-black hover:font-bold hover:scale-105"}`}
                                onClick={() => handleCountrySelection(code)}
                            >
                                {processedData[code].country_name}
                            </button>
                        ))}
                </div>
            </div>
            <div className="w-4/5 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-5xl font-bold">{countryData.country_name}(2024)</h1>
                    <h2 className="text-xl">
                        Salary after tax (Country):{" "}
                        {latestData.Net_Salary ?
                            ( (latestData.Net_Salary * (currencies.find(currencyOption => currencyOption.code === currency)?.exchange_rate || 1))
                                .toFixed(2) )
                            : "N/A"}{" "}
                        {currency}
                    </h2>
                </div>
                <hr className="border-t border-white my-4" />
                <div className="grid grid-cols-2 gap-6 relative">
                    <div className="bg-black p-4 shadow rounded-lg">
                        <h2 className="text-lg font-semibold mb-4">Expenditure Breakdown</h2>
                        <ResponsiveContainer width="100%" height={500}>
                            <PieChart margin={{ top: 20, right: 60, left: 40, bottom: 20 }}>
                                <Pie
                                    data={pieData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    label={({ name, value }) => {
                                        const total = pieData.reduce((sum, entry) => sum + entry.value, 0);
                                        const percentage = ((value / total) * 100).toFixed(2); // Calculate percentage
                                        return `${name}: ${percentage}%`; // Display category and percentage
                                    }}
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value, name) => {
                                    const total = pieData.reduce((sum, entry) => sum + entry.value, 0);
                                    const percentage = ((value / total) * 100).toFixed(2);
                                    const currency_value = (value * (currencies.find(currencyOption => currencyOption.code === currency)?.exchange_rate || 1)).toFixed(2);
                                    return [`${currency_value}(${percentage}%)`,name];
                                }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="bg-black p-4 shadow rounded-lg relative">
                        <h2 className="text-lg font-semibold mb-4">City Expenditure Comparison</h2>
                        <div className="absolute top-0 right-0 mt-2 mr-4">
                            <button onClick={() => setDropdownOpen(!dropdownOpen)} className="border p-2 w-24 bg-black text-left text-sm">
                                {CATEGORY_MAP[selectedCategory] || selectedCategory.replace(/_/g, " ")} ▼
                            </button>
                            {dropdownOpen && (
                                <div className="absolute bg-black border mt-1 w-24 shadow-lg max-h-40 overflow-y-auto z-10 text-sm">
                                    <div className="p-2 hover:bg-blue-400" onClick={() => { setSelectedCategory("All"); setDropdownOpen(false); }}>All</div>
                                    {expenseCategories.map((category, index) => (
                                        <div key={category} className="p-2 hover:bg-blue-400" onClick={() => { setSelectedCategory(category); setDropdownOpen(false); }}>
                                            {CATEGORY_MAP[category] || category} {/* Show mapped name */}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        {updatedBarData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={500}>
                                <BarChart data={updatedBarData} margin={{ top: 20, right: 40, left: 60, bottom: 20 }}>
                                    <XAxis dataKey="city" />
                                    <YAxis />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "#222"
                                        }}
                                    />
                                    <Legend />

                                    {/* Add ReferenceLine for Country Value */}
                                    {selectedCategory !== "Allan" && (
                                        <ReferenceLine
                                            y={(latestData[selectedCategory] * (currencies.find(currencyOption => currencyOption.code === currency)?.exchange_rate || 1)).toFixed(2) || 0}  // Country's value
                                            stroke="white"
                                            strokeDasharray="4 4"  // Makes it dotted
                                            label={{
                                                value: `${countryData.country_code} AVG: ${(latestData[selectedCategory] * (currencies.find(currencyOption => currencyOption.code === currency)?.exchange_rate || 1)).toFixed(2) || 0}`,
                                                position: "left",
                                                fill: "white",
                                                fontSize: 12
                                            }}
                                        />
                                    )}

                                    {(selectedCategory === "All" ? expenseCategories : [selectedCategory]).map((category, index) => (
                                        <Bar
                                            key={CATEGORY_MAP[category] || category}
                                            dataKey={CATEGORY_MAP[category] || category}
                                            stackId={selectedCategory === "All" ? "a" : undefined}
                                            fill={COLOR_MAP[category]}
                                            barSize={30}
                                        >
                                            {/* Use Label to display inside the bar */}
                                            <LabelList
                                                dataKey={CATEGORY_MAP[category] || category}
                                                position="center" // Places label at the center of the bar
                                                valueAccessor="value"
                                                fill="#fff" // White text to contrast with dark bars
                                                fontSize={10} // Smaller font size to fit inside bars
                                            />
                                        </Bar>
                                    ))}
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <p style={{ textAlign: "center", color: "white", fontSize: "16px" }}>
                                No eligible city data available. Showing country-level analysis only.
                            </p>
                        )}

                    </div>
                    {/* City-wise Pie Charts */}
                    {citiesToDisplay.map(city => {
                        const cityData = expenseCategories
                            .map(category => ({
                                name: category, // Keep the original category name
                                value: countryData.cities[city]?.[category] > 0
                                    ? countryData.cities[city][category]
                                    : latestData[category] || 0, // Fill missing values with country data
                                color: COLOR_MAP[category] || "#ccc" // Get the correct color
                            }))
                            .filter(item => item.value > 0); // Exclude zero values

                        if (cityData.length > 0) {
                            return (
                                <div key={city} className="bg-black p-4 shadow rounded-lg">
                                    <h3 className="text-lg font-semibold mb-4">{city} Expenditure Breakdown</h3>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart margin={{ top: 20, right: 40, left: 40, bottom: 20 }}>
                                            <Pie
                                                data={cityData}
                                                dataKey="value"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={80}
                                                label={({ name, value }) => {
                                                    const total = cityData.reduce((sum, entry) => sum + entry.value, 0);
                                                    const percentage = ((value / total) * 100).toFixed(2); // Calculate percentage
                                                    return `${CATEGORY_MAP[name]}: ${percentage}%`; // Display category and percentage
                                                }}
                                            >
                                                {cityData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(value, name) => {
                                                const total = cityData.reduce((sum, entry) => sum + entry.value, 0);
                                                const percentage = ((value / total) * 100).toFixed(2);
                                                const currency_value = (value * (currencies.find(currencyOption => currencyOption.code === currency)?.exchange_rate || 1)).toFixed(2);
                                                return [`${currency_value}(${percentage}%)`,name];
                                            }} />
                                        </PieChart>
                                    </ResponsiveContainer>

                                </div>
                            );
                        }
                        return null;
                    })}
                </div>
            </div>
        </div>
    );
}
