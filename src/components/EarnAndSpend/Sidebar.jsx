import React, { useState, useEffect } from 'react';
import allData from '../../data/final_data_with_salary.json';

const Sidebar = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredCountries, setFilteredCountries] = useState([]);
    const [currency, setCurrency] = useState('USD'); // Default currency

    useEffect(() => {
        const countryList = Object.values(allData).map(country => ({
            name: country.country_name,
            code: country.country_code,
        }));
        setFilteredCountries(countryList);
    }, []);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleCurrencyChange = (event) => {
        setCurrency(event.target.value);
    };

    const filtered = filteredCountries.filter(country =>
        country.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="w-64 h-screen bg-gray-800 text-white overflow-hidden">
            <div className="p-4 sticky top-0 bg-gray-800 z-10">
                <h2 className="text-lg font-semibold">Choose your currency</h2>
                <select
                    value={currency}
                    onChange={handleCurrencyChange}
                    className="mt-2 w-full p-2 rounded border border-gray-600 bg-gray-700 focus:outline-none focus:border-cyan-500"
                >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="JPY">JPY</option>
                    {/* Add more currencies as needed */}
                </select>

                <h2 className="mt-4 text-lg font-semibold">Search country</h2>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearch}
                    placeholder="Type country name..."
                    className="mt-2 w-full p-2 rounded border border-gray-600 focus:outline-none focus:border-cyan-500"
                />
            </div>
            <ul className="mt-4 overflow-y-auto h-[calc(100vh-200px)]"> {/* Adjust height as needed */}
                {filtered.map((country) => (
                    <li
                        key={country.code}
                        className="p-2 transition-transform duration-200 transform hover:bg-cyan-200 hover:text-black hover:font-bold hover:scale-105"
                    >
                        {country.name}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;