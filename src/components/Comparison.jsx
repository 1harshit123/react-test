import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Chart from './Chart';

const Comparison = () => {
    const location = useLocation();
    const [fundsData, setFundsData] = useState([]);
    const { selectedFunds } = location.state || {};

    useEffect(() => {
        const fetchData = async () => {
            if (selectedFunds && selectedFunds.length > 0) {
                try {
                    const responses = await Promise.all(
                        selectedFunds.map(async (code) => {
                            const res = await axios.get(`https://api.mfapi.in/mf/${code}`);
                            return {
                                code,
                                data: res.data
                            };
                        })
                    );
                    setFundsData(responses);
                } catch (error) {
                    console.error("Error fetching fund data:", error);
                }
            }
        };

        fetchData();
    }, [selectedFunds]);

    const transformFundDataForChart = (fundsData) => {
        const maxEntries = 50; // ~500/10 = 50 (sample every 10 entries)
        const chartData = [];

        for (let i = 0; i < maxEntries; i++) {
            const entry = {};
            fundsData.forEach((fund, fundIndex) => {
                const fundName = fund.data.meta?.scheme_name || `Fund${fundIndex + 1}`;
                const navEntry = fund.data.data[i * 10]; // every 10th NAV

                if (navEntry) {
                    entry.date = navEntry.date; // this will be common across all funds
                    entry[fundName] = parseFloat(navEntry.nav); // convert nav from string to float
                }
            });

            if (Object.keys(entry).length > 1) {
                chartData.push(entry);
            }
        }

        return chartData;
    };
    const chartData = transformFundDataForChart(fundsData);
    

    return (
        <div className="w-full flex items-center justify-center" >
            <Chart chartData = {chartData}/>
        </div>
    );
};

export default Comparison;
