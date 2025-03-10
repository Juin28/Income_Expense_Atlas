export default function ToggleButton(props) {
    const { activeTab, setActiveTab } = props;
    
    return (
        <div className="inline-flex rounded-md border-2 border-white overflow-hidden">
            <button
                className={`px-8 py-2 ${activeTab === "earn"
                    ? "bg-green-200 text-black"
                    : "bg-transparent text-white"
                    }`}
                onClick={() => setActiveTab("earn")}
            >
                <em>Earn</em>
            </button>
            <button
                className={`px-8 py-2 ${activeTab === "spend"
                    ? "bg-red-200 text-black"
                    : "bg-transparent text-white"
                    }`}
                onClick={() => setActiveTab("spend")}
            >
                Spend
            </button>
            <button
            className={`px-8 py-2 ${activeTab === "saving"
            ? "bg-blue-200 text-black"
            : "bg-transparent text-white"
            }`}
            onClick={() => setActiveTab("saving")}>
            Saving
            </button>
        </div>
    )
};