export default function printMinAndMaxValues(data) {
    let salaryMin = Infinity;
    let salaryMax = -Infinity;
    let expenseMin = Infinity;
    let expenseMax = -Infinity;
    let marketsMin = Infinity;
    let marketsMax = -Infinity;
    let clothingMin = Infinity;
    let clothingMax = -Infinity;
    let rentMin = Infinity;
    let rentMax = -Infinity;
    let restaurantsMin = Infinity;
    let restaurantsMax = -Infinity;
    let publicTransportationMin = Infinity;
    let publicTransportationMax = -Infinity;
    let utilitiesMin = Infinity;
    let utilitiesMax = -Infinity;
    let sportsMin = Infinity;
    let sportsMax = -Infinity;

    for (const countryCode in data) {
        const salaryValue = data[countryCode].country.Net_Salary;
        const expenseValue = data[countryCode].country.Total_Expenses;
        const marketsValue = data[countryCode].country.Markets;
        const clothingValue = data[countryCode].country.Clothing_And_Shoes;
        const rentValue = data[countryCode].country.Rent_Per_Month;
        const restaurantsValue = data[countryCode].country.Restaurants;
        const publicTransportationValue = data[countryCode].country.Public_Transportation;
        const utilitiesValue = data[countryCode].country.Utilities;
        const sportsValue = data[countryCode].country.Sports_And_Leisure;
        
        if (salaryValue < salaryMin) {
            salaryMin = salaryValue;
        }
        if (salaryValue > salaryMax) {
            salaryMax = salaryValue;
        }
        if (expenseValue < expenseMin) {
            expenseMin = expenseValue;
        }
        if (expenseValue > expenseMax) {
            expenseMax = expenseValue;
        }  
        if (marketsValue < marketsMin) {
            marketsMin = marketsValue;
        }
        if (marketsValue > marketsMax) {
            marketsMax = marketsValue;
        }
        if (clothingValue < clothingMin) {
            clothingMin = clothingValue;
        }
        if (clothingValue > clothingMax) {
            clothingMax = clothingValue;
        }
        if (rentValue < rentMin) {
            rentMin = rentValue;
        }
        if (rentValue > rentMax) {
            rentMax = rentValue;
        }
        if (restaurantsValue < restaurantsMin) {
            restaurantsMin = restaurantsValue;
        }
        if (restaurantsValue > restaurantsMax) {
            restaurantsMax = restaurantsValue;
        }
        if (publicTransportationValue < publicTransportationMin) {
            publicTransportationMin = publicTransportationValue;
        }
        if (publicTransportationValue > publicTransportationMax) {
            publicTransportationMax = publicTransportationValue;
        }
        if (utilitiesValue < utilitiesMin) {
            utilitiesMin = utilitiesValue;
        }
        if (utilitiesValue > utilitiesMax) {
            utilitiesMax = utilitiesValue;
        }
        if (sportsValue < sportsMin) {
            sportsMin = sportsValue;
        }
        if (sportsValue > sportsMax) {
            sportsMax = sportsValue;
        }
    }

    console.log(`Salary min: ${salaryMin}, Salary max: ${salaryMax}`);
    console.log(`Expense min: ${expenseMin}, Expense max: ${expenseMax}`);
    console.log(`Markets min: ${marketsMin}, Markets max: ${marketsMax}`);
    console.log(`Clothing min: ${clothingMin}, Clothing max: ${clothingMax}`);
    console.log(`Rent min: ${rentMin}, Rent max: ${rentMax}`);
    console.log(`Restaurants min: ${restaurantsMin}, Restaurants max: ${restaurantsMax}`);
    console.log(`Public Transportation min: ${publicTransportationMin}, Public Transportation max: ${publicTransportationMax}`);
    console.log(`Utilities min: ${utilitiesMin}, Utilities max: ${utilitiesMax}`);
}