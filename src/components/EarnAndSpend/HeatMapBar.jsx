export default function HeatmapBar(props) {
    const { activeTab, salaryMinHex, salaryMaxHex, expenseMinHex, expenseMaxHex, fieldOfSpending } = props;
    const gradientColors = activeTab === "earn"
        ? [salaryMinHex, salaryMaxHex]      // Colors for earnings
        : [expenseMinHex, expenseMaxHex];   // Colors for spending

    let minValue = 0;
    let maxValue = 0;

    if (activeTab === "earn") {
        minValue = 0;
        maxValue = 10000;
    } else if (activeTab === "spend") {
        if (fieldOfSpending === "General") {
            minValue = 0;
            maxValue = 150;
        } else if (fieldOfSpending === "Clothing & Shoes") {
            minValue = 0;
            maxValue = 500;
        } else if (fieldOfSpending === "Groceries") {
            minValue = 0;
            maxValue = 200;
        } else if (fieldOfSpending === "Public Transport") {
            minValue = 0;
            maxValue = 125;
        } else if (fieldOfSpending === "Rent") {
            minValue = 0;
            maxValue = 4000;
        } else if (fieldOfSpending === "Restaurants") {
            minValue = 0;
            maxValue = 200;
        } else if (fieldOfSpending === "Sports & Leisure") {
            minValue = 0;
            maxValue = 200;
        } else if (fieldOfSpending === "Utilities") {
            minValue = 0;
            maxValue = 450;
        }
    }

    // Create an array of evenly spaced intermediate values
    const steps = 6; // Number of steps in the gradient
    const increment = (maxValue - minValue) / (steps - 1); // Calculate increment
    const values = Array.from({ length: steps }, (_, i) => {
        return Math.round(minValue + increment * i); // Round to make them whole numbers
    });

    return (
        <div className="flex items-center mt-8">
            <div className="flex flex-col justify-center align-middle w-1/6 mr-4">
                <h2 className="text-white text-lg font-bold mr-2 w-full text-center">Average Monthly</h2>
                <h2 className="text-white text-lg font-bold mr-2 w-full text-center">{activeTab === "earn" ? "Salary" : "Expenses"}</h2>
                <span className="text-white text-md font-semibold text-center">{`(${fieldOfSpending})`}</span>
            </div>

            <div className="flex flex-col justify-center align-middle items-center w-full mt-3">
                <div className="flex-grow h-4 w-full bg-gray-300 rounded">
                    <div
                        className="h-full"
                        style={{
                            background: `linear-gradient(to right, ${gradientColors[0]}, ${gradientColors[1]})`,
                        }}
                    />
                </div>

                <div className="flex justify-between w-full mt-2">
                    {values.map((value, index) => (
                        <span key={index} className="text-white text-sm">
                            {value}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};