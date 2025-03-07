import { Link, useLocation } from "react-router-dom";

export default function Header() {
    const location = useLocation();

    return (
        <div className="bg-gray-800 p-4 flex justify-around">
            <Link
                to="/DH2321_Project"
                className={`text-gray-300 hover:text-white transition duration-300 ${location.pathname === "/DH2321_Project" ? "font-bold text-white underline" : ""}`}
            >
                Earn & Spend Map
            </Link>
            <Link
                to="/DH2321_Project/country-compare"
                className={`text-gray-300 hover:text-white transition duration-300 ${location.pathname === "/DH2321_Project/country-compare" ? "font-bold text-white underline" : ""}`}
            >
                Compare
            </Link>
            <Link
                to="/DH2321_Project/country-statistics/country?countryCode=USA"
                className={`text-gray-300 hover:text-white transition duration-300 ${location.pathname.startsWith("/DH2321_Project/country-statistics") ? "font-bold text-white underline" : ""}`}
            >
                Country Statistics
            </Link>
            <Link
                to="DH2321_Project/budget-visualizer"
                className={`text-gray-300 hover:text-white transition duration-300 ${location.pathname === "/DH2321_Project/budget-visualizer" ? "font-bold text-white underline" : ""}`}
            >
                Budget Visualizer
            </Link>
            <Link
                to="/DH2321_Project/information"
                className={`text-gray-300 hover:text-white transition duration-300 ${location.pathname === "/DH2321_Project/information" ? "font-bold text-white underline" : ""}`}
            >
                Information & About Us
            </Link>
        </div>
    );
}