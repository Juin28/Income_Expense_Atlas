import { useState, useEffect, useRef } from 'react';
import allData from '../../data/data_latest.json';
import currencies from '../../data/currencies_data.json';

export default function Sidebar(props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredCountries, setFilteredCountries] = useState([]);
    const {
        hoveredCountry,
        activeTab,
        fieldOfSpending, 
        // selectedCurrency, 
        // setSelectedCurrency, 
        setFieldOfSpending, 
        setHoveredCountry,
        setSelectedCountry 
    } = props;

    // Create refs for each country
    const countryRefs = useRef({});

    useEffect(() => {
        const countryList = Object.values(allData).map(country => ({
            name: country.country_name,
            code: country.country_code,
        }));

        // Sort the country list alphabetically
        countryList.sort((a, b) => a.name.localeCompare(b.name));

        setFilteredCountries(countryList);
    }, []);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    // const handleCurrencyChange = (event) => {
    //     setSelectedCurrency(event.target.value);
    // };

    const handleFieldOfSpendingChange = (event) => {
        setFieldOfSpending(event.target.value);
    };

    const filtered = filteredCountries.filter(country =>
        country.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const fieldsOfSpending = [
        "General",
        "Clothing & Shoes",
        "Groceries",
        "Public Transport",
        "Rent",
        "Restaurants",
        "Sports & Leisure",
        "Utilities",
    ]

    useEffect(() => {
        if (hoveredCountry && countryRefs.current[hoveredCountry]) {
            // Scroll to the hovered country, centering it in the view
            countryRefs.current[hoveredCountry].scrollIntoView({
                behavior: 'smooth',
                block: 'center', // Center the item in the view
            });
        }
    }, [hoveredCountry]);

    return (
        <div className="w-64 h-screen bg-gray-800 text-white overflow-hidden">
            <div className="p-4 sticky top-0 bg-gray-800 z-10">
                {/* <h2 className="text-sm font-semibold">Currency</h2>
                <select
                    value={selectedCurrency}
                    onChange={handleCurrencyChange}
                    className="mt-2 w-full p-2 rounded border border-gray-600 bg-gray-700 focus:outline-none focus:border-cyan-500"
                >
                    {currencies.map(currencyOption => (
                        <option key={currencyOption.code} value={currencyOption.code}>
                            {currencyOption.flag} {currencyOption.name} ({currencyOption.code})
                        </option>
                    ))}
                </select> */}

                {activeTab === "spend" && (
                    <div>
                        <h2 className="mt-4 text-sm font-semibold">Field Of Spending</h2>
                        <select
                            value={fieldOfSpending}
                            onChange={handleFieldOfSpendingChange}
                            className="mt-2 w-full p-2 rounded border border-gray-600 bg-gray-700 focus:outline-none focus:border-cyan-500"
                        >
                            {fieldsOfSpending.map(fieldOfSpending => (
                                <option key={fieldOfSpending} value={fieldOfSpending}>
                                    {fieldOfSpending}
                                </option>
                            ))}
                        </select>
                    </div>

                )}

                <h2 className="mt-4 text-sm font-semibold">Search country</h2>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearch}
                    placeholder="🔎   Search country"
                    className="mt-2 w-full p-2 rounded border border-gray-600 focus:outline-none focus:border-cyan-500"
                />
            </div>
            <ul className="mt-4 overflow-y-auto h-[calc(100vh-200px)]">
                {filtered.map((country) => (
                    <li
                        key={country.code}
                        ref={(el) => (countryRefs.current[country.code] = el)} // Assign ref to each country
                        className={`p-1 pl-8 transition-transform duration-200 transform my-auto 
                            ${hoveredCountry === country.code ? "bg-cyan-200 text-black font-bold" : "hover:bg-cyan-200 hover:text-black hover:font-bold hover:scale-105"}`}
                        onMouseEnter={() => setHoveredCountry(country.code)} // Set hovered country on mouse enter
                        onMouseLeave={() => setHoveredCountry(null)} // Reset hovered country on mouse leave
                        onClick={() => setSelectedCountry(country.code)} // Set hovered country on click
                    >
                        {country.name}
                    </li>
                ))}
            </ul>
        </div>
    );
};