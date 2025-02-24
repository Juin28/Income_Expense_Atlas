import React, { useState, useEffect } from "react";
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

const COLORS = ["#8B2F8A", "#A2539B", "#B977AC", "#CA498C", "#CF9BBD", "#E6BFCE", "#FDE3DF"];
const CATEGORY_MAP = {
    "Markets": "Groceries",
    "Clothing And Shoes": "Clothings",
    "Rent Per Month": "Rent",
    "Restaurants": "Dine-out",
    "Sports And Leisure": "Leisure",
    "Public Transportation": "Transport",
    "Utilities (Monthly)": "Utilities"
};
const COLOR_MAP = {
    "Markets": "#CA498C",
    "Clothing And Shoes": "#8B2F8A",
    "Rent Per Month": "#A2539B",
    "Restaurants": "#B977AC",
    "Sports And Leisure": "#CF9BBD",
    "Public Transportation": "#E6BFCE",
    "Utilities (Monthly)": "#FDE3DF"
}


export default function CountryStatisticPage() {
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

    const cityCategoryCounts = Object.keys(countryData.cities).map(city => ({
        city,
        count: Object.keys(countryData.cities[city]).filter(category => countryData.cities[city][category] > 0).length
    }));

    const maxCategoryCount = Math.max(...cityCategoryCounts.map(city => city.count), 0);

    const citiesToDisplay = selectedCategory === "All"
        ? cityCategoryCounts.filter(city => city.count === maxCategoryCount).map(city => city.city)
        : Object.keys(countryData.cities).filter(city => countryData.cities[city]?.[selectedCategory] > 0);

    // Generate bar data for cities, excluding those with no non-zero values
    const barData = citiesToDisplay
        .map(city => {
            let cityData = { city };
            let hasNonZeroValue = false;

            if (selectedCategory === "All") {
                expenseCategories.forEach(category => {
                    const value = countryData.cities[city]?.[category] || 0;
                    cityData[CATEGORY_MAP[category]] = value;
                    if (value > 0) hasNonZeroValue = true;
                });
            } else {
                const value = countryData.cities[city]?.[selectedCategory] || 0;
                cityData[CATEGORY_MAP[selectedCategory]] = value;
                if (value > 0) hasNonZeroValue = true;
            }

            return hasNonZeroValue ? cityData : null;  // Return null for cities with no non-zero values
        })
        .filter(cityData => cityData !== null); // Remove cities with null values



    // Add the country-level data for comparison (directly using the country data)
    let countryDataEntry = { city: "Country" };  // Use "Country" or another label for the country-level bar
    if (selectedCategory === "All") {
        expenseCategories.forEach(category => {
            // Use the country data directly for each category
            countryDataEntry[CATEGORY_MAP[category]] = latestData[category] || 0;
        });
    } else {
        // Use the selected category for the country data
        countryDataEntry[CATEGORY_MAP[selectedCategory]] = latestData[selectedCategory] || 0;
    }

    // Add the country data to the barData
    barData.unshift(countryDataEntry);  // Adds the country bar as the first element

    return (
        <div className="flex min-h-screen bg-black text-white">
            <div className="w-1/5 p-4 bg-gray-900 border-l overflow-y-auto fixed right-0 h-full">
                <h2 className="text-lg font-semibold mb-4">Currency</h2>
                <select className="border p-2 w-full mb-4" value={currency} onChange={(e) => setCurrency(e.target.value)}>
                    <option value="EUR">EUR</option>
                    <option value="USD">USD</option>
                    <option value="GBP">GBP</option>
                </select>
                <h2 className="text-lg font-semibold mb-4">Select Country</h2>
                <input type="text" placeholder="Search..." className="border p-2 w-full mb-2" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                {validCountries
                    .filter(code => processedData[code].country_name.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map(code => (
                        <button key={code} className={`block w-full p-2 text-left ${selectedCountry === code ? "bg-blue-400 text-white" : "bg-black"}`}
                                onClick={() => handleCountrySelection(code)}>
                            {processedData[code].country_name}
                        </button>
                    ))}
            </div>
            <div className="w-4/5 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-5xl font-bold">{countryData.country_name}(2024)</h1>
                    <h2 className="text-xl">Salary after tax (Country): {latestData.net_salary} {currency}</h2>
                </div>
                <hr className="border-t border-white my-4" />
                <div className="grid grid-cols-2 gap-6 relative">
                    <div className="bg-black p-4 shadow rounded-lg">
                        <h2 className="text-lg font-semibold mb-4">Expenditure Breakdown</h2>
                        <ResponsiveContainer width="100%" height={600}>
                            <PieChart>
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
                                    return [`${value} (${percentage}%)`,name];
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
                        <ResponsiveContainer width="100%" height={600}>
                            <BarChart data={barData}>
                                <XAxis dataKey="city" />
                                <YAxis />
                                <Tooltip />
                                <Legend />

                                {/* Add ReferenceLine for Country Value */}
                                {selectedCategory !== "All" && (
                                    <ReferenceLine
                                        y={latestData[selectedCategory] || 0}  // Country's value
                                        stroke="white"
                                        strokeDasharray="4 4"  // Makes it dotted
                                        label={{
                                            value: `Country: ${latestData[(selectedCategory === "All" ? ["Total_Expenses"] : [selectedCategory])] || 0}`,
                                            position: "right",
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
                                            valueAccessor={({ value }) => Math.round(value)} // Explicit rounding before displaying
                                            fill="#fff" // White text to contrast with dark bars
                                            fontSize={10} // Smaller font size to fit inside bars
                                        />
                                    </Bar>
                                ))}
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    {/* City-wise Pie Charts */}
                    {Object.keys(countryData.cities).map(city => {
                        const cityData = expenseCategories.map((category, index) => ({
                            name: CATEGORY_MAP[category] || category, // Use mapped name
                            value: countryData.cities[city][category] || 0,
                            color: COLOR_MAP[category]
                        })).filter(item => item.value > 0);

                        if (cityData.length > 0) {
                            return (
                                <div key={city} className="bg-black p-4 shadow rounded-lg">
                                    <h3 className="text-lg font-semibold mb-4">{city} Expenditure Breakdown</h3>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={cityData}
                                                dataKey="value"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={100}
                                                label={({ name, value }) => {
                                                    const total = cityData.reduce((sum, entry) => sum + entry.value, 0);
                                                    const percentage = ((value / total) * 100).toFixed(2); // Calculate percentage
                                                    return `${name}: ${percentage}%`; // Display category and percentage
                                                }}
                                            >
                                                {cityData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(value, name) => {
                                                const total = cityData.reduce((sum, entry) => sum + entry.value, 0);
                                                const percentage = ((value / total) * 100).toFixed(2);
                                                return [`${value} (${percentage}%)`, name];
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
