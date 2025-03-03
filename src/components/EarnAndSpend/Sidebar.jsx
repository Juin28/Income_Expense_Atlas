// import { useState, useEffect, useRef } from 'react';
// import allData from '../../data/data_latest.json';
// import currencies from '../../data/currencies_data.json';

// export default function Sidebar(props) {
//     const [searchTerm, setSearchTerm] = useState('');
//     const [filteredCountries, setFilteredCountries] = useState([]);
//     const {
//         hoveredCountry,
//         activeTab,
//         fieldOfSpending, 
//         setFieldOfSpending, 
//         setHoveredCountry,
//         setSelectedCountry 
//     } = props;

//     const countryRefs = useRef({});

//     useEffect(() => {
//         const countryList = Object.entries(allData).reduce((acc, [countryCode, country]) => {
//             if (activeTab === "earn" && country.country.Net_Salary) {
//                 acc.push({
//                     name: country.country_name,
//                     code: countryCode,
//                 });
//             } else if (activeTab === "spend" && country.country.Total_Expenses) {
//                 acc.push({
//                     name: country.country_name,
//                     code: countryCode,
//                 });
//             }
//             return acc;
//         }, []);

//         // Sort the country list alphabetically
//         countryList.sort((a, b) => a.name.localeCompare(b.name));

//         setFilteredCountries(countryList);
//     }, [activeTab]); // Dependency on activeTab

//     const handleSearch = (event) => {
//         setSearchTerm(event.target.value);
//     };

//     const handleFieldOfSpendingChange = (event) => {
//         setFieldOfSpending(event.target.value);
//     };

//     const filtered = filteredCountries.filter(country =>
//         country.name.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     const fieldsOfSpending = [
//         "All",
//         "Clothings",
//         "Groceries",
//         "Transport",
//         "Rent",
//         "Dine-out",
//         "Leisure",
//         "Utilities",
//     ];

//     useEffect(() => {
//         if (hoveredCountry && countryRefs.current[hoveredCountry]) {
//             countryRefs.current[hoveredCountry].scrollIntoView({
//                 behavior: 'smooth',
//                 block: 'center',
//             });
//         }
//     }, [hoveredCountry]);

//     return (
//         <div className="w-64 h-screen bg-gray-800 text-white overflow-hidden">
//             <div className="p-4 sticky top-0 bg-gray-800 z-10">
//                 {activeTab === "spend" && (
//                     <div>
//                         <h2 className="mt-4 text-sm font-semibold">Field Of Spending</h2>
//                         <select
//                             value={fieldOfSpending}
//                             onChange={handleFieldOfSpendingChange}
//                             className="mt-2 w-full p-2 rounded border border-gray-600 bg-gray-700 focus:outline-none focus:border-cyan-500"
//                         >
//                             {fieldsOfSpending.map(field => (
//                                 <option key={field} value={field}>
//                                     {field}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>
//                 )}

//                 <h2 className="mt-4 text-sm font-semibold">Search country</h2>
//                 <input
//                     type="text"
//                     value={searchTerm}
//                     onChange={handleSearch}
//                     placeholder="🔎   Search country"
//                     className="mt-2 w-full p-2 rounded border border-gray-600 focus:outline-none focus:border-cyan-500"
//                 />
//             </div>
//             <ul className="mt-4 overflow-y-auto h-[calc(100vh-200px)]">
//                 {filtered.map((country) => (
//                     <li
//                         key={country.code}
//                         ref={(el) => (countryRefs.current[country.code] = el)}
//                         className={`p-1 pl-8 transition-transform duration-200 transform my-auto 
//                             ${hoveredCountry === country.code ? "bg-cyan-200 text-black font-bold" : "hover:bg-cyan-200 hover:text-black hover:font-bold hover:scale-105"}`}
//                         onMouseEnter={() => setHoveredCountry(country.code)}
//                         onMouseLeave={() => setHoveredCountry(null)}
//                         onClick={() => setSelectedCountry(country.code)}
//                     >
//                         {country.name}
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// };

import { useState, useEffect, useRef } from 'react';
import allData from '../../data/data_latest.json';

export default function Sidebar(props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredCountries, setFilteredCountries] = useState([]);
    const {
        hoveredCountry,
        activeTab,
        fieldOfSpending, 
        setFieldOfSpending, 
        setHoveredCountry,
        setSelectedCountry 
    } = props;

    useEffect(() => {
        const countryList = Object.entries(allData).reduce((acc, [countryCode, country]) => {
            if (activeTab === "earn" && country.country.Net_Salary) {
                acc.push({ 
                    name: country.country_name, 
                    code: countryCode 
                });
            } else if (activeTab === "spend" && country.country.Total_Expenses) {
                acc.push({ 
                    name: country.country_name, 
                    code: countryCode 
                });
            }
            return acc;
        }, []);

        // Sort the country list alphabetically
        countryList.sort((a, b) => a.name.localeCompare(b.name));

        setFilteredCountries(countryList);
    }, [activeTab]);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleFieldOfSpendingChange = (event) => {
        setFieldOfSpending(event.target.value);
    };

    const filtered = filteredCountries.filter(country =>
        country.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const fieldsOfSpending = [
        "All",
        "Clothings",
        "Groceries",
        "Transport",
        "Rent",
        "Dine-out",
        "Leisure",
        "Utilities",
    ];

    return (
        <div className="w-64 h-screen bg-gray-800 text-white overflow-hidden">
            <div className="p-4 sticky top-0 bg-gray-800 z-10">
                {activeTab === "spend" && (
                    <div>
                        <h2 className="mt-4 text-sm font-semibold">Field Of Spending</h2>
                        <select
                            value={fieldOfSpending}
                            onChange={handleFieldOfSpendingChange}
                            className="mt-2 w-full p-2 rounded border border-gray-600 bg-gray-700 focus:outline-none focus:border-cyan-500"
                        >
                            {fieldsOfSpending.map(field => (
                                <option key={field} value={field}>
                                    {field}
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
                        className={`p-1 pl-8 transition-transform duration-200 transform my-auto 
                            ${hoveredCountry === country.code ? "bg-cyan-200 text-black font-bold" : "hover:bg-cyan-200 hover:text-black hover:font-bold hover:scale-105"}`}
                        onMouseEnter={() => setHoveredCountry(country.code)}
                        onMouseLeave={() => setHoveredCountry(null)}
                        onClick={() => setSelectedCountry(country.code)}
                    >
                        {country.name}
                    </li>
                ))}
            </ul>
        </div>
    );
}