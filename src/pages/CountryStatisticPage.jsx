import React, { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, Legend, ResponsiveContainer } from "recharts";
import data from "../data/data_latest.json";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28DFF", "#FF6699", "#FF4500", "#32CD32", "#FFD700", "#8A2BE2"];

export default function CountryStatisticPage() {
    const [selectedCountry, setSelectedCountry] = useState("GRC");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [currency, setCurrency] = useState("EUR");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const expenseCategories = [
        "Markets", "Clothing And Shoes", "Rent Per Month", "Restaurants",
        "Sports And Leisure", "Public Transportation", "Utilities (Monthly)"
    ];

    // Filter countries that have valid data for pie chart
    const validCountries = Object.keys(data).filter(code => {
        const countryData = data[code] || { country: {}, cities: {} };
        const latestData = countryData.country || {};

        const pieData = expenseCategories.map((category, index) => ({
            name: category.replace(/_/g, " ").toUpperCase(),
            value: latestData[category] || 0,
        })).filter(item => item.value > 0);

        return pieData.length > 0; // Only include countries with valid pieData
    });

    const countryData = data[selectedCountry] || { country: {}, cities: {} };
    const latestData = countryData.country || {};

    const pieData = expenseCategories.map((category, index) => ({
        name: category.replace(/_/g, " ").toUpperCase(),
        value: latestData[category] || 0,
        color: COLORS[index % COLORS.length]
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

    // Generate bar data for cities
    const barData = citiesToDisplay.map(city => {
        let cityData = { city };
        if (selectedCategory === "All") {
            expenseCategories.forEach(category => {
                cityData[category] = countryData.cities[city]?.[category] || 0;
            });
        } else {
            cityData[selectedCategory] = countryData.cities[city]?.[selectedCategory] || 0;
        }
        return cityData;
    });

    // Add the country-level data for comparison (directly using the country data)
    let countryDataEntry = { city: "Country" };  // Use "Country" or another label for the country-level bar
    if (selectedCategory === "All") {
        expenseCategories.forEach(category => {
            // Use the country data directly for each category
            countryDataEntry[category] = latestData[category] || 0;
        });
    } else {
        // Use the selected category for the country data
        countryDataEntry[selectedCategory] = latestData[selectedCategory] || 0;
    }

    // Add the country data to the barData
    barData.unshift(countryDataEntry);  // Adds the country bar as the first element

    return (
        <div className="flex h-screen">
            <div className="w-1/5 p-4 bg-gray-100 border-l overflow-y-auto fixed right-0 h-full">
                <h2 className="text-lg font-semibold mb-4">Currency</h2>
                <select className="border p-2 w-full mb-4" value={currency} onChange={(e) => setCurrency(e.target.value)}>
                    <option value="EUR">EUR</option>
                    <option value="USD">USD</option>
                    <option value="GBP">GBP</option>
                </select>
                <h2 className="text-lg font-semibold mb-4">Select Country</h2>
                <input type="text" placeholder="Search..." className="border p-2 w-full mb-2" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                {validCountries
                    .filter(code => data[code].country_name.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map(code => (
                        <button key={code} className={`block w-full p-2 text-left ${selectedCountry === code ? "bg-blue-500 text-white" : "bg-white"}`} onClick={() => setSelectedCountry(code)}>
                            {data[code].country_name}
                        </button>
                    ))}
            </div>
            <div className="w-4/5 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold">{countryData.country_name}</h1>
                    <h2 className="text-xl">Net Salary: {latestData.net_salary} {currency}</h2>
                    <h2 className="text-xl">Total Expenses: {latestData.Total_Expenses} {currency}</h2>
                </div>
                <div className="grid grid-cols-2 gap-6 relative">
                    <div className="bg-white p-4 shadow rounded-lg">
                        <h2 className="text-lg font-semibold mb-4">Expenditure Breakdown</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="bg-white p-4 shadow rounded-lg relative">
                        <h2 className="text-lg font-semibold mb-4">City Expenditure Comparison</h2>
                        <div className="absolute top-0 right-0 mt-2 mr-4">
                            <button onClick={() => setDropdownOpen(!dropdownOpen)} className="border p-2 w-full bg-white text-left">
                                {selectedCategory.replace(/_/g, " ")} ▼
                            </button>
                            {dropdownOpen && (
                                <div className="absolute bg-white border mt-1 w-full shadow-lg max-h-40 overflow-y-auto z-10">
                                    <div className="p-2 hover:bg-gray-200" onClick={() => { setSelectedCategory("All"); setDropdownOpen(false); }}>All</div>
                                    {expenseCategories.map((category, index) => (
                                        <div key={category} className="p-2 hover:bg-gray-200" onClick={() => { setSelectedCategory(category); setDropdownOpen(false); }}>
                                            {category.replace(/_/g, " ")}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <ResponsiveContainer width="80%" height={300}>
                            <BarChart data={barData}>
                                <XAxis dataKey="city" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                {(selectedCategory === "All" ? expenseCategories : [selectedCategory]).map((category, index) => (
                                    <Bar
                                        key={category}
                                        dataKey={category}
                                        stackId={selectedCategory === "All" ? "a" : undefined}
                                        fill={COLORS[index % COLORS.length]}
                                        barSize={20}
                                    />
                                ))}
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    {/* City-wise Pie Charts */}
                    {Object.keys(countryData.cities).map(city => {
                        const cityData = expenseCategories.map((category, index) => ({
                            name: category.replace(/_/g, " ").toUpperCase(),
                            value: countryData.cities[city][category] || 0,
                            color: COLORS[index % COLORS.length]
                        })).filter(item => item.value > 0);

                        if (cityData.length > 0) {
                            return (
                                <div key={city} className="bg-white p-4 shadow rounded-lg">
                                    <h3 className="text-lg font-semibold mb-4">{city} Expenditure Breakdown</h3>
                                    <ResponsiveContainer width="100%" height={200}>
                                        <PieChart>
                                            <Pie data={cityData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                                {cityData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
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
