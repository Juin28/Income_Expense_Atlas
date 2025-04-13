import { Link, useLocation } from "react-router-dom";

export default function Header() {
    const location = useLocation();

    return (
        <div className="bg-gray-800 p-4 flex justify-around">
            <Link
                to="/Income_Expense_Atlas"
                className={`text-gray-300 hover:text-white transition duration-300 ${location.pathname === "/Income_Expense_Atlas" ? "font-bold text-white underline" : ""}`}
            >
                Earn & Spend Map
            </Link>
            <Link
                to="/Income_Expense_Atlas/country-compare"
                className={`text-gray-300 hover:text-white transition duration-300 ${location.pathname === "/Income_Expense_Atlas/country-compare" ? "font-bold text-white underline" : ""}`}
            >
                Compare
            </Link>
            <Link
                to="/Income_Expense_Atlas/country-statistics/country?countryCode=USA"
                className={`text-gray-300 hover:text-white transition duration-300 ${location.pathname.startsWith("/Income_Expense_Atlas/country-statistics") ? "font-bold text-white underline" : ""}`}
            >
                Country Statistics
            </Link>
            <Link
                to="Income_Expense_Atlas/budget-visualizer"
                className={`text-gray-300 hover:text-white transition duration-300 ${location.pathname === "/Income_Expense_Atlas/budget-visualizer" ? "font-bold text-white underline" : ""}`}
            >
                Budget Visualizer
            </Link>
            <Link
                to="/Income_Expense_Atlas/information"
                className={`text-gray-300 hover:text-white transition duration-300 ${location.pathname === "/Income_Expense_Atlas/information" ? "font-bold text-white underline" : ""}`}
            >
                Information & About Us
            </Link>
        </div>
    );
}