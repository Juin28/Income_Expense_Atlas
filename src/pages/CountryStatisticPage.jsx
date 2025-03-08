import React, { useState, useEffect } from "react";

// Reference: Recharts Documentation (https://recharts.org/en-US/guide/getting-started)
// Used Recharts library for PieChart and BarChart visualization
import {
    Tooltip,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Legend,
    ResponsiveContainer,
    LabelList, Label, ReferenceLine, CartesianGrid
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
    "Utilities": "Utilities",
    "Net_Salary": "Monthly salary"
};
const COLOR_MAP = {
    "Markets": "#CA498C",
    "Clothing_And_Shoes": "#8B2F8A",
    "Rent_Per_Month": "#A2539B",
    "Restaurants": "#B977AC",
    "Sports_And_Leisure": "#CF9BBD",
    "Public_Transportation": "#E6BFCE",
    "Utilities": "#FDE3DF",
    "Net_Salary": "#87A45D"
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
        navigate(`/DH2321_Project/country-statistics/country?countryCode=${countryCode}`);
    };

    const expenseCategories = Object.keys(CATEGORY_MAP);

    // Filter countries that have valid processedData for pie chart
    const validCountries = Object.keys(processedData).filter(code => {
        const wholeData = processedData[code] || { country: {}, cities: {} };
        const latestData = wholeData.country || {};

        /*
        Reference: MDN Web Docs (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)
        Used Array.map to transform data for visualization.
        */
        const countryData = expenseCategories.map((category, index) => ({
            name: category.replace(/_/g, " ").toUpperCase(),
            value: latestData[category] || 0,
        })).filter(item => item.value > 0);

        return countryData.length > 0; // Only include countries with valid countryData
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


    const wholeData = processedData[selectedCountry] || { country: {}, cities: {} };
    const latestData = wholeData.country || {};

    const countryData = expenseCategories.map((category, index) => ({
        name: CATEGORY_MAP[category] || category, // Use mapped name
        value: latestData[category] || 0,
        color: COLOR_MAP[category]
    })).filter(item => item.value > 0);

    if (countryData.length === 0) {
        return null; // Skip rendering this country if no valid data
    }

    /**
     * Dealing with missing values for cities
     * For those cities with no less than 3 categories than its country, append the missing values of these categories with the country values.
     * Otherwise, eliminate this city for display.
     * Discussed and Agreed by the Group on 24 Feb
     */
    // Step 1: Get the full list of categories available in the country
    const countryCategories = Object.keys(latestData).filter(category => latestData[category] > 0);

    // Step 2: Check each city's category coverage
    const citiesToDisplay = Object.keys(wholeData.cities).filter(city => {
        const cityCategories = Object.keys(wholeData.cities[city]).filter(category => wholeData.cities[city][category] > 0);
        const missingCategories = countryCategories.filter(category => !cityCategories.includes(category));

        // Keep the city if it's missing fewer than 3 categories
        return missingCategories.length < 3;
    });

    // Step 3: Generate `barData` for cities, appending missing values from country data
    const barData = [
        {
            city: selectedCountry,
            ...Object.fromEntries(
                countryCategories.map(category => [
                    CATEGORY_MAP[category] || category,
                    latestData[category] ?? 0
                ])
            )
        },
        ...citiesToDisplay.map(city => {
            let cityData = { city };

            countryCategories.forEach(category => {
                // Use the city's value if available; otherwise, use the country's value
                cityData[CATEGORY_MAP[category]] = wholeData.cities[city]?.[category] ?? latestData[category] ?? 0;
            });
            return cityData;
        })
    ];




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
                    {currencies.map((currencyOption) => (
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
                        .filter((code) =>
                            processedData[code].country_name
                                .toLowerCase()
                                .includes(searchTerm.toLowerCase())
                        )
                        .sort((a, b) =>
                            processedData[a].country_name.localeCompare(
                                processedData[b].country_name
                            )
                        )
                        .map((code) => (
                            <button
                                key={code}
                                className={`block w-full text-left p-1 pl-8 transition-transform duration-200 transform my-auto 
                                ${
                                    selectedCountry === code
                                        ? "bg-blue-400 text-white font-bold"
                                        : "hover:bg-cyan-200 hover:text-black hover:font-bold hover:scale-105"
                                }`}
                                onClick={() => handleCountrySelection(code)}
                            >
                                {processedData[code].country_name}
                            </button>
                        ))}
                </div>
            </div>

            <div className="w-4/5 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-5xl font-bold">{wholeData.country_name} (2024)</h1>
                    {latestData.Net_Salary && (
                        <h2 className="text-xl">
                            Salary after tax (Country):{" "}
                            {(
                                latestData.Net_Salary *
                                (currencies.find(
                                    (currencyOption) => currencyOption.code === currency
                                )?.exchange_rate || 1)
                            ).toFixed(2)}{" "}
                            {currency}
                        </h2>
                    )}
                </div>
                <hr className="border-t border-white my-4" />

                <div className="flex flex-col gap-6">
                    <div className="bg-black p-4 shadow rounded-lg relative">
                        <>
                            <h2 className="text-lg font-semibold mb-4">
                                Detailed City Salary & Expenditure
                            </h2>
                            {/* Dropdown Container */}
                            <div className="absolute top-0 right-0 mt-2 mr-4">
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="border p-2 w-24 bg-black text-left text-sm"
                                >
                                    {CATEGORY_MAP[selectedCategory] ||
                                        selectedCategory.replace(/_/g, " ")}{" "}
                                    ▼
                                </button>
                                {dropdownOpen && (
                                    <div className="absolute bg-black border mt-1 w-24 shadow-lg max-h-40 overflow-y-auto z-10 text-sm">
                                        <div
                                            className="p-2 hover:bg-blue-400"
                                            onClick={() => {
                                                setSelectedCategory("All");
                                                setDropdownOpen(false);
                                            }}
                                        >
                                            All
                                        </div>
                                        {expenseCategories.map((category) => (
                                            <div
                                                key={category}
                                                className="p-2 hover:bg-blue-400"
                                                onClick={() => {
                                                    setSelectedCategory(category);
                                                    setDropdownOpen(false);
                                                }}
                                            >
                                                {CATEGORY_MAP[category] || category}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <ResponsiveContainer width="100%" height={500}>
                                <BarChart
                                    data={updatedBarData}
                                    barGap = {-25}
                                    margin={{ top: 20, right: 40, left: 60, bottom: 80 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="city" angle={-75} textAnchor="end" xAxisId={0} />
                                    <XAxis dataKey="city" angle={-75} textAnchor="end" xAxisId={1} hide/>
                                    <YAxis />
                                    <Tooltip contentStyle={{ backgroundColor: "#222" }} />
                                    <Legend layout="horizontal" verticalAlign="top" align="center" />

                                    {/* Reference line for the selected category */}
                                    {selectedCategory !== "All" && (
                                        <ReferenceLine
                                            y={
                                                (latestData[selectedCategory] *
                                                    (currencies.find(
                                                        (currencyOption) => currencyOption.code === currency
                                                    )?.exchange_rate || 1)
                                                ).toFixed(2) || 0
                                            }
                                            stroke="white"
                                            strokeDasharray="4 4"
                                            label={{
                                                value: `${wholeData.country_code} AVG: ${
                                                    (latestData[selectedCategory] *
                                                        (currencies.find(
                                                            (currencyOption) => currencyOption.code === currency
                                                        )?.exchange_rate || 1)
                                                    ).toFixed(2) || 0
                                                }`,
                                                position: "left",
                                                fill: "white",
                                                fontSize: 12,
                                            }}
                                        />
                                    )}


                                    <Bar
                                        dataKey="Monthly salary"
                                        fill="#87A45D"
                                        // fillOpacity={data.city === selectedCountry ? 0.7 : 1}
                                        barSize={30}
                                        radius={[10, 10, 10, 10]} // Rounded edges
                                        stackId="a" // Use the same stackId to stack this bar with expense
                                        xAxisId={1}
                                    >
                                        <LabelList position="top" fill="#fff" fontSize={10} />
                                    </Bar>

                                    {(selectedCategory === "All"
                                            ? expenseCategories.filter(category => category !== "Net_Salary") // Exclude "Net_Salary"
                                            : [selectedCategory]
                                    ).map((category) => (
                                        <Bar
                                            key={CATEGORY_MAP[category] || category}
                                            dataKey={CATEGORY_MAP[category] || category}
                                            fill={COLOR_MAP[category]}
                                            barSize={20}
                                            stackId="b" // Make sure expense bars are stacked with income bar
                                            xAxisId={1}
                                        >
                                            <LabelList
                                                dataKey={CATEGORY_MAP[category] || category}
                                                position="center"
                                                fill="#fff"
                                                fontSize={10}
                                            />
                                        </Bar>
                                    ))}
                                </BarChart>
                            </ResponsiveContainer>


                        </>
                    </div>
                </div>
            </div>
        </div>
    );
}
