import { Link, useLocation } from "react-router-dom";

export default function Header() {
    const location = useLocation();

    return (
        <div className="bg-gray-800 p-4 flex justify-around">
            <Link
                to="/"
                className={`text-gray-300 hover:text-white transition duration-300 ${location.pathname === "/" ? "font-bold text-white underline" : ""}`}
            >
                Earn & Spend Map
            </Link>
            <Link
                to="/country-compare"
                className={`text-gray-300 hover:text-white transition duration-300 ${location.pathname === "/country-compare" ? "font-bold text-white underline" : ""}`}
            >
                Compare
            </Link>
            <Link
                to="/country-statistics/country?countryCode=USA"
                className={`text-gray-300 hover:text-white transition duration-300 ${location.pathname.startsWith("/country-statistics") ? "font-bold text-white underline" : ""}`}
            >
                Country Statistics
            </Link>
            <Link
                to="/budget-visualizer"
                className={`text-gray-300 hover:text-white transition duration-300 ${location.pathname === "/budget-visualizer" ? "font-bold text-white underline" : ""}`}
            >
                Budget Visualizer
            </Link>
            <Link
                to="/information"
                className={`text-gray-300 hover:text-white transition duration-300 ${location.pathname === "/information" ? "font-bold text-white underline" : ""}`}
            >
                Information & About Us
            </Link>
        </div>
    );
}