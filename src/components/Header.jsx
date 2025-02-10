import { Link, useLocation } from "react-router-dom";

export default function Header() {
    const location = useLocation();

    return (
        <div className="bg-gray-800 p-4 flex justify-around">
            <Link
                to="/"
                className={`text-gray-300 hover:text-white transition duration-300 ${location.pathname === '/' ? 'font-bold text-white underline' : ''}`}
            >
                Earn/Spend Global
            </Link>
            <Link
                to="/country-compare"
                className={`text-gray-300 hover:text-white transition duration-300 ${location.pathname === '/country-compare' ? 'font-bold text-white underline' : ''}`}
            >
                Country Compare
            </Link>
            <Link
                to="/country-statistics"
                className={`text-gray-300 hover:text-white transition duration-300 ${location.pathname === '/country-statistics' ? 'font-bold text-white underline' : ''}`}
            >
                Country Statistics
            </Link>
        </div>
    );
}