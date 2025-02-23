import React, { useState, useRef, useEffect } from 'react';
import { select, geoPath, geoMercator, scaleLinear } from 'd3';
import allData from '../data/final_data_with_salary.json';
import Sidebar from '../components/EarnAndSpend/Sidebar';

const EarnAndSpendPage = () => {
    const [activeTab, setActiveTab] = useState('earn');
    const [selectedCurrency, setSelectedCurrency] = useState('USD');
    const [worldData, setWorldData] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const mapRef = useRef();

    const [countrySalaries, setcountrySalaries] = useState({});
    const [countryExpenses, setcountryExpenses] = useState({});

    const salaryColorScale = scaleLinear()
        .domain([30, 6700]) 
        .range(["#EBF7ED", "#66FF00"]);
        // .range(["8EED8E", "379137"]);
    
    const expenseColorScale = scaleLinear()
        .domain([18, 134])
        .range(["#FFB6C1", "#BA0000"]);

    function getMinAndMaxValues(data) {
        let salaryMin = Infinity;
        let salaryMax = -Infinity;
        
        for (const countryCode in data) {
            const salary = data[countryCode].net_salary;
            if (salary < salaryMin) salaryMin = salary;
            if (salary > salaryMax) salaryMax = salary;
        }
        // Development console log
        console.log(`Earn\t\tMin: ${salaryMin}, Max: ${salaryMax}`);

        let expenseMin = Infinity;
        let expenseMax = -Infinity;

        for (const countryCode in data) {
            const expense = data[countryCode].country[2024]?.cost_of_living_index;
            if (expense < expenseMin) expenseMin = expense;
            if (expense > expenseMax) expenseMax = expense;
        }
        // Development console log
        console.log(`Spend\t\tMin: ${expenseMin}, Max: ${expenseMax}`);
    }

    // Fetch world map data
    useEffect(() => {
        const fetchWorldData = async () => {
            const worldResponse = await fetch('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson');
            const worldData = await worldResponse.json();

            const salaryValues = {};
            const expenseValues = {};
            if (activeTab === 'earn') {
                for (const countryCode in allData) {
                    salaryValues[countryCode] = allData[countryCode].net_salary; 
                }
                // Development note: console.log(min, max);
            } else if (activeTab === 'spend') {
                for (const countryCode in allData) {
                    expenseValues[countryCode] = allData[countryCode].country[2024]?.cost_of_living_index;
                }
                // Development note: console.log(min, max);
            }
            getMinAndMaxValues(allData);

            setWorldData(worldData);

            if (activeTab === 'earn') {
                setcountrySalaries(salaryValues);
            } else if (activeTab === 'spend') {
                setcountryExpenses(expenseValues);
            }
        };

        fetchWorldData();
    }, [activeTab]);

    // Color scales matching the image
    const earnColorScale = scaleLinear()
        .domain([500, 9000])
        .range(['#ffffff', '#006400']);

    const spendColorScale = scaleLinear()
        .domain([500, 9000])
        .range(['#ffffff', '#640000']);

    // Currency options
    const currencies = [
        { code: 'USD', name: 'US Dollar', flag: '🇺🇸' },
        { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
        { code: 'GBP', name: 'British Pound', flag: '🇬🇧' },
        { code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵' },
        { code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺' },
        { code: 'CAD', name: 'Canadian Dollar', flag: '🇨🇦' },
        { code: 'CHF', name: 'Swiss Franc', flag: '🇨🇭' },
        { code: 'CNY', name: 'Chinese Yuan', flag: '🇨🇳' },
        { code: 'INR', name: 'Indian Rupee', flag: '🇮🇳' },
        { code: 'SGD', name: 'Singapore Dollar', flag: '🇸🇬' }
    ];

    // Currency selector component
    const CurrencySelector = () => (
        <div className="absolute top-4 right-4">
            <div className="relative">
                <button
                    className="bg-white rounded-md px-4 py-2 flex items-center space-x-2"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                    <span>{currencies.find(c => c.code === selectedCurrency).flag}</span>
                    <span className="text-black">{selectedCurrency}</span>
                    <span className="text-black">▼</span>
                </button>
                {dropdownOpen && (
                    <div className="absolute mt-2 w-full bg-white rounded-md shadow-lg z-10">
                        {currencies.map(currency => (
                            <div
                                key={currency.code}
                                className="px-4 py-2 cursor-pointer hover:bg-gray-200 flex items-center space-x-2"
                                onClick={() => {
                                    setSelectedCurrency(currency.code);
                                    setDropdownOpen(false);
                                }}
                            >
                                <span>{currency.flag}</span>
                                <span>{currency.name}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );

    // Toggle button component
    const ToggleButton = () => (
        <div className="inline-flex rounded-md border-2 border-white overflow-hidden">
            <button
                className={`px-8 py-2 ${activeTab === 'earn'
                    ? 'bg-green-200 text-black'
                    : 'bg-transparent text-white'
                    }`}
                onClick={() => setActiveTab('earn')}
            >
                <em>Earn</em>
            </button>
            <button
                className={`px-8 py-2 ${activeTab === 'spend'
                    ? 'bg-red-200 text-black'
                    : 'bg-transparent text-white'
                    }`}
                onClick={() => setActiveTab('spend')}
            >
                Spend
            </button>
        </div>
    );

    // Legend component
    // const Legend = ({ selectedCurrency }) => (
    //     <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
    //         <div className="text-right mb-2">
    //             <p className="text-white italic">Average</p>
    //             <p className="text-white italic">Monthly</p>
    //             <p className="text-white italic">Income ({selectedCurrency})</p>
    //         </div>
    //         <div className="flex flex-col space-y-4">
    //             {[9000, 7000, 5000, 3000, 1000, 500].map((value) => (
    //                 <div key={value} className="flex items-center justify-end space-x-2">
    //                     <span className="text-white text-sm">{value.toLocaleString()}</span>
    //                     <div
    //                         className="w-8 h-4"
    //                         style={{
    //                             backgroundColor: activeTab === "earn" 
    //                             ? earnColorScale(value)
    //                             : spendColorScale(value)
    //                         }}
    //                     />
    //                 </div>
    //             ))}
    //         </div>
    //     </div>
    // );

    // World Map component
    const WorldMap = () => {
        const [hoveredCountry, setHoveredCountry] = useState(null);

        useEffect(() => {
            // if (!worldData || Object.keys(countrySalaries).length === 0) return;
            if (!worldData
                || (activeTab === 'earn' && Object.keys(countrySalaries).length === 0)
                || (activeTab === 'spend' && Object.keys(countryExpenses).length === 0)
            ) return;

            const svg = select(mapRef.current);
            const width = 1200;
            const height = 600;

            const projection = geoMercator()
                .scale(180)
                .center([0, 30])
                .translate([width / 2, height / 2]);

            const path = geoPath().projection(projection);

            svg.selectAll('*').remove(); // Clear previous SVG elements

            // Draw countries
            svg
                .selectAll('path.country')
                .data(worldData.features)
                .enter()
                .append('path')
                .attr('class', 'country')
                .attr('d', path)
                .attr('fill', (d) => {
                    const countryId = d.id;
                    if (activeTab === 'earn') {
                        const salaryValue = countrySalaries[countryId] || 0; // Default to 0 if not found
                        return salaryValue > 0 ? salaryColorScale(salaryValue) : '#808080'; // Gray out countries with no data
                    } else if (activeTab === 'spend') {
                        const expenseValue = countryExpenses[countryId] || 0; // Default to 0 if not found
                        return expenseValue > 0 ? expenseColorScale(expenseValue) : '#808080'; // Gray out countries with no data
                    }
                })
                .attr('stroke', '#333') // Default stroke color
                .attr('stroke-width', 0.5) // Default stroke width
                .style('opacity', 1) // Default opacity
                .on('mouseenter', (event, d) => {
                    if (activeTab === 'earn') {
                        const salaryValue = countrySalaries[d.id] || 0;
                        if (salaryValue > 0) {
                            setHoveredCountry(d.id);
                            console.log(`Country: ${d.id}, Salary: ${salaryValue}`);
                        }
                    } else if (activeTab === 'spend') {
                        const expenseValue = countryExpenses[d.id] || 0;
                        if (expenseValue > 0) {
                            setHoveredCountry(d.id);
                            console.log(`Country: ${d.id}, Expense: ${expenseValue}`);
                        }
                    }
                })
                .on('mouseleave', () => {
                    setHoveredCountry(null);
                });

            // Update styles based on hovered country
            svg.selectAll('path.country')
                .style('opacity', (d) => (hoveredCountry && hoveredCountry !== d.id ? 0.6 : 1)) // Make other countries transparent
                .attr('stroke', (d) => {
                    if (activeTab === 'earn') {
                        const salaryValue = countrySalaries[d.id] || 0;
                        return hoveredCountry === d.id && salaryValue > 0 ? '#ffcc00' : '#333'; // Highlight border for hovered country
                    } else if (activeTab === 'spend') {
                        const expenseValue = countryExpenses[d.id] || 0;
                        return hoveredCountry === d.id && expenseValue > 0 ? '#ffcc00' : '#333'; // Highlight border for hovered country
                    }
                })
                .attr('stroke-width', (d) => {
                    if (activeTab === 'earn') {
                        const salaryValue = countrySalaries[d.id] || 0;
                        return hoveredCountry === d.id && salaryValue > 0 ? 2 : 0.5; // Increase border width for hovered country
                    } else if (activeTab === 'spend') {
                        const expenseValue = countryExpenses[d.id] || 0;
                        return hoveredCountry === d.id && expenseValue > 0 ? 2 : 0.5; // Increase border width for hovered country
                    }
                });

        }, [worldData, countrySalaries, hoveredCountry]);

        return (
            <svg
                ref={mapRef}
                className="w-full h-full"
                style={{ backgroundColor: '#000' }} // Keep background black
            />
        );
    };

    // Fetch world map data
    useEffect(() => {
        fetch('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson')
            .then(response => response.json())
            .then(data => {
                setWorldData(data);
            });
    }, []);

    return (
        <div className="min-h-screen bg-black">
            <div className="max-w-7xl mx-auto p-8 relative">
                <CurrencySelector />
                <div className="mb-8">
                    <h1 className="text-3xl text-white mb-4 flex items-center">
                        How much do we
                        <span className="mx-2">
                            <ToggleButton />
                        </span>
                        in different countries?
                    </h1>
                </div>
                <div className="relative h-[600px]">
                    <WorldMap />
                    {/* <Legend selectedCurrency={selectedCurrency} /> */}
                </div>
                {/* <Sidebar />    */}
            </div>
        </div>
    );
};

export default EarnAndSpendPage;