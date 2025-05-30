export default function HeatmapBar(props) {
    const { activeTab, salaryMinHex, salaryMaxHex, expenseMinHex, expenseMaxHex, fieldOfSpending, savingMaxHex, savingMinHex, savingZeroHex } = props;
    const gradientColors = activeTab === "earn"
    ? [salaryMinHex, salaryMaxHex]          // Colors for earnings
    : activeTab === "saving"
        ? [savingMinHex, savingZeroHex, savingMaxHex]      // Colors for savings
        : [expenseMinHex, expenseMaxHex];   // Colors for spending
    // console.log(`Colors for ${activeTab}: ${gradientColors}`);
    let minValue = 0;
    let maxValue = 0;

    if (activeTab === "earn") {
        minValue = 0;
        maxValue = 10000;
    } else if (activeTab === "spend") {
        if (fieldOfSpending === "All") {
            minValue = 0;
            maxValue = 5000;
        } else if (fieldOfSpending === "Clothings") {
            minValue = 0;
            maxValue = 500;
        } else if (fieldOfSpending === "Groceries") {
            minValue = 0;
            maxValue = 200;
        } else if (fieldOfSpending === "Transport") {
            minValue = 0;
            maxValue = 125;
        } else if (fieldOfSpending === "Rent") {
            minValue = 0;
            maxValue = 4000;
        } else if (fieldOfSpending === "Dine-out") {
            minValue = 0;
            maxValue = 200;
        } else if (fieldOfSpending === "Leisure") {
            minValue = 0;
            maxValue = 200;
        } else if (fieldOfSpending === "Utilities") {
            minValue = 0;
            maxValue = 450;
        } 
    } else if (activeTab === "saving"){
        minValue = -3000;
        maxValue = 3000;
    }

    // Create an array of evenly spaced intermediate values
    
    let steps = 6; // Number of steps in the gradient
    let increment = (maxValue - minValue) / (steps - 1); // Calculate increment
    let values = Array.from({ length: steps }, (_, i) => {
        return Math.round(minValue + increment * i);
         // Round to make them whole numbers
    });

    if (activeTab==="saving"){
        // Calculate the number of steps to ensure 0 is included
         steps = 7; // Total steps, including 0
         increment = (maxValue - minValue) / (steps - 1); // Calculate increment
         values = Array.from({ length: steps }, (_, i) => {
            return Math.round(minValue + increment * i); // Create values array
        });
         // Ensure 0 is included and positioned correctly
        if (!values.includes(0)) {
            const zeroIndex = Math.floor((0 - minValue) / increment);
            values[zeroIndex] = 0; // Ensure 0 is in the array
        }
    }


    return (
        <div className="flex items-center mt-8">
            <div className="flex flex-col justify-center align-middle w-1/6 mr-4">
                <h2 className="text-white text-lg font-bold mr-2 w-full text-center">Average Monthly</h2>
                <h2 className="text-white text-lg font-bold mr-2 w-full text-center">{activeTab === "earn" ? "Salary" : activeTab==="saving"? "Saving": "Expenses"}</h2>
                <span className="text-white text-md font-semibold text-center">{activeTab === "earn" ||"saving" ? "" :`(${fieldOfSpending})`}</span>
            </div>

            <div className="flex flex-col justify-center align-middle items-center w-full mt-3">
                <div className="flex-grow h-4 w-full bg-gray-300 rounded">
                    <div
                        className="h-full"
                        style={{
                            background: `linear-gradient(to right, ${gradientColors.join(', ')})`,
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