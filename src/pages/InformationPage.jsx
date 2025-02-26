import teamMembers from "../data/team_members";

export default function InformationPage() {
    return (
        <div className="bg-black text-white p-6">
            <div className="mx-10">
                <h2 className="text-2xl font-bold text-center text-gray-200 mb-8">Quick Tips</h2>
                <ul className="list-disc pl-5 mb-10">
                    <li>...Step by step guide</li>
                    {/* <li>Click on any country on the map view to enter a detailed view</li>
                    <li>Use the time slider on the bottom to change the date of the data you are viewing</li>
                    <li>Use the attribute menu on the right to select specific attributes to view</li>
                    <li>In the detailed view use the attribute menu to view certain attributes in the x axis versus a constant y axis of CO2 emissions per capita</li>
                    <li>You can select multiple countries (three at most) at once in the detailed view to compare, and also compare against global, OECD, EU27, and LCD data</li> */}
                </ul>

                <h2 className="text-2xl font-bold text-center text-gray-200 mb-8">Walkthrough</h2>
                <div className="mb-10">
                    {/* <iframe
                    className="w-full h-64"
                    src="https://www.youtube.com/embed/CIQgXqRAq_k"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                /> */}
                    <p>Walkthrough tutorial video</p>
                </div>

                <h2 className="text-2xl font-bold text-center text-gray-200 mb-8">Project Overview</h2>
                <div className="mb-10 w-[85%] mx-auto">
                    <p className="mb-5">
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <span className="font-bold">Income vs Expense Atlas</span> is a six-week student initiative developed as part of the course DH2321 - Information Visualization at the KTH Royal Institute of Technology. This application aims to effectively visualize global income and expenditure patterns by utilizing annual salary data and comprehensive cost-of-living metrics worldwide.
                        By providing users with comparative insights into their income and living expenses against global averages, the application fosters informed financial decision-making.
                    </p>
                    <p>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        The primary objective of <span className="font-bold">Income vs Expense Atlas</span> extends beyond mere data presentation; it seeks to establish an interactive platform where users can thoroughly explore the interplay between their income, expenditures, and the cost of living across various global cities.
                        Users are expected to possess a foundational understanding of web applications and data interpretation, enabling them to engage meaningfully with the presented information.
                        Additionally, the application features a budget visualizer, which allows users to estimate their potential expenditures across different categories based on their input budget, providing a clearer understanding of anticipated spending in diverse countries.
                    </p>
                </div>

                <h2 className="text-2xl font-bold text-center text-gray-200 mb-8">Meet Our Team</h2>
                <div className="w-full mx-auto flex flex-wrap justify-center gap-8 mb-10">
                    {teamMembers.map((member, index) => (
                        <div
                            key={index}
                            className="bg-gray-900 rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:bg-gray-800 p-6 w-110 flex flex-col items-center"
                        >
                            <div className="flex justify-center">
                                <img
                                    src={member.photo}
                                    alt={member.name}
                                    className="w-45 h-45 object-cover rounded-full border-4 border-gray-700"
                                />
                            </div>
                            <div className="text-center mt-4 flex flex-col flex-grow">
                                <h2 className="text-xl font-semibold text-white">{member.name}</h2>
                                <p className="text-gray-400 text-sm font-semibold mb-2">{member.role}</p>
                                <p className="text-gray-500 text-xs mb-4">{member.education}</p>
                                <a
                                    href={`mailto:${member.email}`}
                                    className="inline-block text-blue-400 font-medium hover:text-blue-600 mt-auto"
                                >
                                    {member.email}
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

                <h2 className="text-2xl font-bold text-center text-gray-200 mb-8">Our Learning Objectives</h2>
                <div className="mb-10 w-[85%] mx-auto">
                    <p className="mb-4">
                        In our group project, we developed an interactive visualization that empowers users to manipulate views and uncover relationships within selected datasets.
                        By employing <span className="font-bold">React.js</span>, <span className="font-bold">Tailwind CSS</span>, <span className="font-bold">D3.js</span>, and <span className="font-bold">JavaScript</span>, we created a dynamic web application that enhances user engagement through visual data exploration.
                    </p>
                    <p className="mb-4">
                        Our key learning objectives including:
                    </p>
                    <ol className="list-decimal list-inside text-gray-200">
                        <li>
                            <strong>User-Centric Design:</strong>
                            <ul className="list-disc ml-4  text-sm">
                                <li className="mt-1 mb-3 ml-4">We learned the importance of integrating user feedback early in the development process. By conducting user testing and surveys at each milestone, we could iteratively refine our visualization, ensuring it met the needs of our target audience effectively.</li>
                            </ul>
                        </li>
                        <li>
                            <strong>Technical Proficiency:</strong>
                            <ul className="list-disc ml-4  text-sm">
                                <li className="mt-1 mb-3 ml-4">Our experience with <span className="font-bold">React</span> and <span className="font-bold">D3.js</span> enabled us to build a responsive and interactive application. We gained hands-on knowledge in utilizing these technologies to create compelling visualizations that allow users to explore complex datasets.</li>
                            </ul>
                        </li>
                        <li>
                            <strong>Data Handling Skills:</strong>
                            <ul className="list-disc ml-4  text-sm">
                                <li className="mt-1 mb-3 ml-4">We developed valuable skills in managing large datasets, including data cleaning, transformation, and conversion. This experience enhanced our understanding of the challenges associated with preparing data for visualization.</li>
                            </ul>
                        </li>
                        <li>
                            <strong>Design Principles:</strong>
                            <ul className="list-disc ml-4  text-sm">
                                <li className="mt-1 mb-3 ml-4">Our project emphasized best practices for creating accessible and intuitive visualizations. We learned how to balance aesthetic appeal with functionality, ensuring that our application was user-friendly and effective in conveying information.</li>
                            </ul>
                        </li>
                        <li>
                            <strong>Exploratory Analysis:</strong>
                            <ul className="list-disc ml-4  text-sm">
                                <li className="mt-1 mb-3 ml-4">Through our work, we recognized the nuanced differences between merely displaying data and facilitating users' exploration of relationships within and between datasets. This understanding is crucial for creating tools that not only present information but also promote deeper insights.</li>
                            </ul>
                        </li>
                    </ol>
                </div>

                <h2 className="text-2xl font-bold text-center text-gray-200 mb-8">References</h2>
                <div className="mb-5 w-[85%] mx-auto">
                    <h3 className="font-semibold text-xl mb-2">Data Sources</h3>
                    <ol className="list-decimal list-inside text-gray-200">
                        <li>
                            <strong>Numbeo</strong>
                            <ul className="list-disc ml-4  text-sm">
                                <li className="my-1 ml-4">Clothing and Shoes Expenses</li>
                                <li className="my-1 ml-4">Groceries Expenses</li>
                                <li className="my-1 ml-4">Net Salary</li>
                                <li className="my-1 ml-4">Public Transportation Expenses</li>
                                <li className="my-1 ml-4">Rent Per Month</li>
                                <li className="my-1 ml-4">Restaurants Expenses</li>
                                <li className="my-1 ml-4">Sports and Leisure Expenses</li>
                                <li className="my-1 ml-4">Utilities Expenses</li>
                            </ul>
                        </li>
                        <li>
                            <strong>XE</strong>
                            <ul className="list-disc ml-4  text-sm">
                                <li className="my-1 ml-4">Curreny Exchange Rates</li>
                            </ul>
                        </li>
                    </ol>
                </div>
                <div className="mb-5 w-[85%] mx-auto">
                    <h3 className="font-semibold text-xl mb-2">Methodology</h3>
                    <ol className="list-decimal list-inside text-gray-200">
                        <li>
                            <strong>Clothing And Shoes Expenses</strong>
                            <ul className="list-disc ml-4 text-sm">
                                <li className="my-1 ml-4">Sum of the cost of 1 pair of jeans, 1 pair of men's leather shoes, 1 pair of Nike running shoes, and 1 dress from a store.</li>
                            </ul>
                        </li>
                        <li>
                            <strong>Groceries Expenses</strong>
                            <ul className="list-disc ml-4 text-sm">
                                <li className="my-1 ml-4">Sum of apples (1 kg), bananas (1 kg), beef (1 kg), wine, chicken fillet (1 kg), cigarettes, beer, eggs, lettuce, bread, milk, onion, oranges, potatoes, rice, tomatoes, and water from the grocery market.</li>
                            </ul>
                        </li>
                        <li>
                            <strong>Net Salary</strong>
                            <ul className="list-disc ml-4 text-sm">
                                <li className="my-1 ml-4">Average monthly salary after tax.</li>
                            </ul>
                        </li>
                        <li>
                            <strong>Public Transportation Expenses</strong>
                            <ul className="list-disc ml-4 text-sm">
                                <li className="my-1 ml-4">Sum of one-way tickets and monthly passes.</li>
                            </ul>
                        </li>
                        <li>
                            <strong>Rent Per Month</strong>
                            <ul className="list-disc ml-4 text-sm">
                                <li className="my-1 ml-4">Average price of rent per month for apartments (1 bedroom and 3 bedrooms) outside and in the city center.</li>
                            </ul>
                        </li>
                        <li>
                            <strong>Restaurant Expenses</strong>
                            <ul className="list-disc ml-4 text-sm">
                                <li className="my-1 ml-4">Sum of the price of coke/pepsi, beer, McDonald's, meals (inexpensive restaurant), and water in restaurants.</li>
                            </ul>
                        </li>
                        <li>
                            <strong>Sports And Leisure Expenses</strong>
                            <ul className="list-disc ml-4 text-sm">
                                <li className="my-1 ml-4">Sum of cinema, monthly fitness club membership, and tennis court rent.</li>
                            </ul>
                        </li>
                        <li>
                            <strong>Utilities Expenses</strong>
                            <ul className="list-disc ml-4 text-sm">
                                <li className="my-1 ml-4">Sum of basics (electricity, heating, cooling, water, garbage), internet, and mobile phone monthly plan.</li>
                            </ul>
                        </li>
                        <li>
                            <strong>Cost Of Living Index (Excluding Rent)</strong>
                            <ul className="list-disc ml-4 text-sm">
                                <li className="my-1 ml-4">This index indicates the relative prices of consumer goods like groceries, restaurants, transportation, and utilities. It excludes accommodation expenses such as rent or mortgage. For instance, a city with a Cost of Living Index of 120 is estimated to be 20% more expensive than New York City (excluding rent).</li>
                            </ul>
                        </li>
                        <li>
                            <strong>Rent Index</strong>
                            <ul className="list-disc ml-4 text-sm">
                                <li className="my-1 ml-4">This index estimates the prices of renting apartments in a city compared to New York City. If the Rent Index is 80, it suggests that the average rental prices in that city are approximately 20% lower than those in New York City.</li>
                            </ul>
                        </li>
                        <li>
                            <strong>Groceries Index</strong>
                            <ul className="list-disc ml-4 text-sm">
                                <li className="my-1 ml-4">This index provides an estimation of grocery prices in a city relative to New York City. Numbeo uses item weights from the "Markets" section to calculate this index for each city.</li>
                            </ul>
                        </li>
                        <li>
                            <strong>Restaurants Index</strong>
                            <ul className="list-disc ml-4 text-sm">
                                <li className="my-1 ml-4">This index compares the prices of meals and drinks in restaurants and bars to those in NYC.</li>
                            </ul>
                        </li>
                        <li>
                            <strong>Local Purchasing Power</strong>
                            <ul className="list-disc ml-4 text-sm">
                                <li className="my-1 ml-4">This index indicates the relative purchasing power in a given city based on the average net salary. A local purchasing power of 40 means that residents with an average salary can afford, on average, 60% fewer goods and services compared to residents of New York City with an average salary.</li>
                            </ul>
                        </li>
                    </ol>
                </div>
                <div className="mb-5 w-[85%] mx-auto">
                    <h3 className="font-semibold text-xl mb-2">Acknowledgement</h3>
                    <ol className="list-decimal list-inside text-gray-200">
                        <li>
                            The Viral 50 project provided valuable design inspiration for world map part of this project.
                        </li>
                    </ol>
                </div>
            </div>
        </div>
    );
};