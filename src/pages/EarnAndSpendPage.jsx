import React, { useState, useRef, useEffect, use } from "react";
import { select, geoPath, geoMercator, scaleLinear } from "d3";
import { useNavigate } from "react-router-dom"; 
import allData from "../data/data_latest.json";
import Sidebar from "../components/EarnAndSpend/Sidebar";
import ToggleButton from "../components/EarnAndSpend/ToggleButton";
import HeatmapBar from "../components/EarnAndSpend/HeatMapBar";
import printMinAndMaxValues from "../components/EarnAndSpend/PrintMinMax";

const EarnAndSpendPage = () => {
    const navigate = useNavigate(); 
    const [activeTab, setActiveTab] = useState("earn");
    // const [selectedCurrency, setSelectedCurrency] = useState("USD");
    const [worldData, setWorldData] = useState(null);
    const [countrySalaries, setcountrySalaries] = useState({});
    const [countryExpenses, setcountryExpenses] = useState({});
    const [hoveredCountry, setHoveredCountry] = useState(null);
    const [fieldOfSpending, setFieldOfSpending] = useState("All");
    const [selectedCountry, setSelectedCountry] = useState(null);

    const mapRef = useRef();

    let salaryMinHex = "#BDF9BD";
    let salaryMaxHex = "#379137";
    let expenseMinHex = "#FFB6C1";
    let expenseMaxHex = "#BA0000";

    const salaryColorScale = scaleLinear()
        .domain([30, 6700])
        .range([salaryMinHex, salaryMaxHex]);

    const expenseColorScale = scaleLinear()
        .domain([0, 4700])
        .range([expenseMinHex, expenseMaxHex]);

    const marketExpenseColorScale = scaleLinear()
        .domain([0, 200])
        .range([expenseMinHex, expenseMaxHex]);

    const clothingExpenseColorScale = scaleLinear()
        .domain([0, 500])
        .range([expenseMinHex, expenseMaxHex]);

    const rentExpenseColorScale = scaleLinear()
        .domain([0, 4000])
        .range([expenseMinHex, expenseMaxHex]);

    const restaurantExpenseColorScale = scaleLinear()
        .domain([0, 200])
        .range([expenseMinHex, expenseMaxHex]);

    const sportExpenseColorScale = scaleLinear()
        .domain([0, 200])
        .range([expenseMinHex, expenseMaxHex]);

    const publicTransportationExpenseColorScale = scaleLinear()
        .domain([0, 125])
        .range([expenseMinHex, expenseMaxHex]);

    const utilityExpenseColorScale = scaleLinear()
        .domain([0, 450])
        .range([expenseMinHex, expenseMaxHex]);

    // Fetch world map data
    useEffect(() => {
        const fetchWorldData = async () => {
            const worldResponse = await fetch("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson");
            const worldData = await worldResponse.json();

            const salaryValues = {};
            const expenseValues = {};
            if (activeTab === "earn") {
                for (const countryCode in allData) {
                    salaryValues[countryCode] = allData[countryCode].country.Net_Salary;
                }
            } else if (activeTab === "spend") {
                for (const countryCode in allData) {
                    expenseValues[countryCode] = {};
                    expenseValues[countryCode].Total_Expenses = allData[countryCode].country.Total_Expenses;
                    expenseValues[countryCode].Markets = allData[countryCode].country.Markets;
                    expenseValues[countryCode].Clothing = allData[countryCode].country.Clothing_And_Shoes;
                    expenseValues[countryCode].Rent = allData[countryCode].country.Rent_Per_Month;
                    expenseValues[countryCode].Restaurants = allData[countryCode].country.Restaurants;
                    expenseValues[countryCode].Public_Transportation = allData[countryCode].country.Public_Transportation;
                    expenseValues[countryCode].Utilities = allData[countryCode].country.Utilities;
                    expenseValues[countryCode].Sports = allData[countryCode].country.Sports_And_Leisure;
                }
            }

            setWorldData(worldData);
            if (activeTab === "earn") {
                setcountrySalaries(salaryValues);
            } else if (activeTab === "spend") {
                setcountryExpenses(expenseValues);
            }
        };

        fetchWorldData();
        printMinAndMaxValues(allData);
    }, [activeTab]);

    useEffect(() => {
        if (!selectedCountry) return;

        navigate(`/DH2321_Project/country-statistics/country?countryCode=${selectedCountry}`);
    }, [selectedCountry]);

    // World Map component
    const WorldMap = () => {
        useEffect(() => {
            if (!worldData
                || (activeTab === "earn" && Object.keys(countrySalaries).length === 0)
                || (activeTab === "spend" && Object.keys(countryExpenses).length === 0)
            ) return;

            const svg = select(mapRef.current);
            const width = 1200;
            const height = 600;

            const projection = geoMercator()
                .scale(180)
                .center([0, 30])
                .translate([width / 2, height / 2]);

            const path = geoPath().projection(projection);

            svg.selectAll("*").remove(); // Clear previous SVG elements

            // Draw countries
            svg
                .selectAll("path.country")
                .data(worldData.features)
                .enter()
                .append("path")
                .attr("class", "country")
                .attr("d", path)
                .attr("fill", (d) => {
                    const countryId = d.id;
                    if (activeTab === "earn") {
                        const salaryValue = countrySalaries[countryId] || 0;
                        return salaryValue > 0 ? salaryColorScale(salaryValue) : "#808080";
                    } else if (activeTab === "spend") {
                        if (fieldOfSpending === "All") {
                            const expenseValue = countryExpenses[countryId]?.Total_Expenses || 0;
                            return expenseValue > 0 ? expenseColorScale(expenseValue) : "#808080";
                        } else if (fieldOfSpending === "Clothings") {
                            const expenseValue = countryExpenses[countryId]?.Clothing || 0;
                            return expenseValue > 0 ? clothingExpenseColorScale(expenseValue) : "#808080";
                        } else if (fieldOfSpending === "Groceries") {
                            const expenseValue = countryExpenses[countryId]?.Markets || 0;
                            return expenseValue > 0 ? marketExpenseColorScale(expenseValue) : "#808080";
                        } else if (fieldOfSpending === "Transport") {
                            const expenseValue = countryExpenses[countryId]?.Public_Transportation || 0;
                            return expenseValue > 0 ? publicTransportationExpenseColorScale(expenseValue) : "#808080";
                        } else if (fieldOfSpending === "Rent") {
                            const expenseValue = countryExpenses[countryId]?.Rent || 0;
                            return expenseValue > 0 ? rentExpenseColorScale(expenseValue) : "#808080";
                        } else if (fieldOfSpending === "Dine-out") {
                            const expenseValue = countryExpenses[countryId]?.Restaurants || 0;
                            return expenseValue > 0 ? restaurantExpenseColorScale(expenseValue) : "#808080";
                        } else if (fieldOfSpending === "Leisure") {
                            const expenseValue = countryExpenses[countryId]?.Sports || 0;
                            return expenseValue > 0 ? sportExpenseColorScale(expenseValue) : "#808080";
                        } else if (fieldOfSpending === "Utilities") {
                            const expenseValue = countryExpenses[countryId]?.Utilities || 0;
                            return expenseValue > 0 ? utilityExpenseColorScale(expenseValue) : "#808080";
                        }
                    }
                })
                .attr("stroke", "#333")
                .attr("stroke-width", 0.5)
                .style("opacity", 1)
                .on("mouseenter", (event, d) => {
                    const countryId = d.id;
                    // Only set hovered country if it has data
                    if (activeTab === "earn" && countrySalaries[countryId] > 0) {
                        setHoveredCountry(countryId);
                    // } else if (activeTab === "spend" && countryExpenses[countryId] > 0) {
                    } else if (activeTab === "spend") {
                        if (fieldOfSpending === "All" && countryExpenses[countryId]?.Total_Expenses > 0) {
                            setHoveredCountry(countryId);
                        } else if (fieldOfSpending === "Clothings" && countryExpenses[countryId]?.Clothing > 0) {
                            setHoveredCountry(countryId);
                        } else if (fieldOfSpending === "Groceries" && countryExpenses[countryId]?.Markets > 0) {
                            setHoveredCountry(countryId);
                        } else if (fieldOfSpending === "Transport" && countryExpenses[countryId]?.Public_Transportation > 0) {
                            setHoveredCountry(countryId);
                        } else if (fieldOfSpending === "Rent" && countryExpenses[countryId]?.Rent > 0) {
                            setHoveredCountry(countryId);
                        } else if (fieldOfSpending === "Dine-out" && countryExpenses[countryId]?.Restaurants > 0) {
                            setHoveredCountry(countryId);
                        } else if (fieldOfSpending === "Leisure" && countryExpenses[countryId]?.Sports > 0) {
                            setHoveredCountry(countryId);
                        } else if (fieldOfSpending === "Utilities" && countryExpenses[countryId]?.Utilities > 0) {
                            setHoveredCountry(countryId);
                        } else {
                            setHoveredCountry(null);
                        }
                    }
                })
                .on("mouseleave", () => {
                    setHoveredCountry(null);
                })
                .on("click", (event, d) => {
                    const countryId = d.id;
                    // Only navigate if the country has data
                    if (activeTab === "earn" && countrySalaries[countryId] > 0) {
                        setSelectedCountry(countryId);
                    // } else if (activeTab === "spend" && countryExpenses[countryId] > 0) {
                    } else if (activeTab === "spend" ) {
                        if (fieldOfSpending === "All" && countryExpenses[countryId]?.Total_Expenses > 0) {
                            setSelectedCountry(countryId);
                        } else if (fieldOfSpending === "Clothings" && countryExpenses[countryId]?.Clothing > 0) {
                            setSelectedCountry(countryId);
                        } else if (fieldOfSpending === "Groceries" && countryExpenses[countryId]?.Markets > 0) {
                            setSelectedCountry(countryId);
                        } else if (fieldOfSpending === "Transport" && countryExpenses[countryId]?.Public_Transportation > 0) {
                            setSelectedCountry(countryId);
                        } else if (fieldOfSpending === "Rent" && countryExpenses[countryId]?.Rent > 0) {
                            setSelectedCountry(countryId);
                        } else if (fieldOfSpending === "Dine-out" && countryExpenses[countryId]?.Restaurants > 0) {
                            setSelectedCountry(countryId);
                        } else if (fieldOfSpending === "Leisure" && countryExpenses[countryId]?.Sports > 0) {
                            setSelectedCountry(countryId);
                        } else if (fieldOfSpending === "Utilities" && countryExpenses[countryId]?.Utilities > 0) {
                            setSelectedCountry(countryId);
                        } else {
                            setSelectedCountry(null);
                        }
                        // setSelectedCountry(countryId);
                    }
                });

            svg.selectAll("path.country")
                .style("opacity", (d) => {
                    const countryId = d.id;
                    return (hoveredCountry && hoveredCountry !== countryId && (activeTab === "earn" ? countrySalaries[countryId] > 0 : countryExpenses[countryId]?.Total_Expenses > 0)) ? 0.6 : 1;
                })
                .attr("stroke", (d) => {
                    const countryId = d.id;
                    return (hoveredCountry === countryId && (activeTab === "earn" ? countrySalaries[countryId] > 0 : countryExpenses[countryId]?.Total_Expenses > 0)) ? "#ffcc00" : "#333";
                })
                .attr("stroke-width", (d) => {
                    const countryId = d.id;
                    return (hoveredCountry === countryId && (activeTab === "earn" ? countrySalaries[countryId] > 0 : countryExpenses[countryId]?.Total_Expenses > 0)) ? 2 : 0.5;
                });

        }, [worldData, countrySalaries, hoveredCountry]);

        return (
            <svg
                ref={mapRef}
                className="w-full h-full"
                style={{ backgroundColor: "#000" }} // Keep background black
            />
        );
    };

    return (
        <div className="min-h-screen bg-black flex">
            <div className="flex-grow w-full mx-auto p-8 relative">
                <div className="mb-8">
                    <h1 className="text-4xl text-white mb-4 flex items-center justify-center">
                        How much do we
                        <span className="mx-2">
                            <ToggleButton
                                activeTab={activeTab}
                                setActiveTab={setActiveTab}
                            />
                        </span>
                        in different countries?
                    </h1>
                </div>
                <div className="relative h-[600px]">
                    <WorldMap />
                </div>
                <HeatmapBar
                    activeTab={activeTab}
                    salaryMinHex={salaryMinHex}
                    salaryMaxHex={salaryMaxHex}
                    expenseMinHex={expenseMinHex}
                    expenseMaxHex={expenseMaxHex}
                    fieldOfSpending={fieldOfSpending}
                />
            </div>
            <div>
                <Sidebar
                    hoveredCountry={hoveredCountry}
                    activeTab={activeTab}
                    fieldOfSpending={fieldOfSpending}
                    // selectedCurrency={selectedCurrency}
                    // setSelectedCurrency={setSelectedCurrency}
                    setFieldOfSpending={setFieldOfSpending}
                    setHoveredCountry={setHoveredCountry}
                    setSelectedCountry={setSelectedCountry}
                />
            </div>
        </div>
    );
};

export default EarnAndSpendPage;