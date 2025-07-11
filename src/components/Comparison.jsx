import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Chart from './Chart';
import { useNavigate } from 'react-router-dom';

const Comparison = () => {
    const location = useLocation();
    const navigate = useNavigate();
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
        const maxEntries = 50; // sample every 10 entries
        const chartData = [];

        for (let i = 0; i < maxEntries; i++) {
            const entry = {};
            fundsData.forEach((fund, fundIndex) => {
                const fundName = fund.data.meta?.scheme_name || `Fund${fundIndex + 1}`;
                const navEntry = fund.data.data[i * 10];

                if (navEntry) {
                    entry.date = navEntry.date;
                    entry[fundName] = parseFloat(navEntry.nav);
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
        <div className="w-full p-4 flex flex-col justify-center items-center">
            <div className="relative w-full flex justify-center mb-8">
                
                <span className='absolute left-5'>
                    <button
                        onClick={() => navigate(-1)}
                        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        ← Go Back
                    </button>
                </span>
                <div className='flex flex-col justify-center items-center'>
                    <h1 className='text-[#1AA39A] font-bold text-3xl mb-5'>Comparative NAV Growth of Selected Funds Over Time</h1>
                    <div className='h-[1px] w-full bg-gray-400 mb-10'></div>
                    <Chart chartData={chartData} />
                </div>
                
            </div>
            
            <h1 className='text-[#1AA39A] font-bold text-3xl mb-5'>Details of selected Funds</h1>
            <div className="flex justify-center items-center">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {fundsData.map((fund, index) => {
                    const meta = fund.data.meta;
                    const latestNAV = fund.data.data?.[0];
                    const schemeName = meta.scheme_name?.toLowerCase() || "";

                    const getPayoutOption = () => {
                        if (schemeName.includes("growth")) return "Growth";
                        if (schemeName.includes("idcw")) return "IDCW";
                        if (schemeName.includes("dividend payout")) return "Dividend Payout";
                        if (schemeName.includes("dividend reinvestment")) return "Dividend Reinvestment";
                        return "Others";
                    };

                    // Extract Plan Type
                    const getPlanType = () => {
                        if (schemeName.includes("direct")) return "Direct";
                        if (schemeName.includes("regular")) return "Regular";
                        return "Others";
                    };

                    return (
                        <div
                            key={index}
                            className="bg-white shadow-lg rounded-lg p-6 border border-gray-200"
                        >
                            <h2 className="text-xl font-bold text-blue-600 mb-2">
                                {meta.scheme_name}
                            </h2>
                            <p className="text-sm text-gray-700 mb-1">
                                <span className="font-semibold">Fund House:</span> {meta.fund_house}
                            </p>
                            <p className="text-sm text-gray-700 mb-1">
                                <span className="font-semibold">Scheme Code:</span> {meta.scheme_code}
                            </p>
                            <p className="text-sm text-gray-700 mb-1">
                                <span className="font-semibold">Latest NAV:</span>{' '}
                                ₹{latestNAV?.nav} on {latestNAV?.date}
                            </p>
                            <p className="text-sm text-gray-700 mb-1">
                                <span className="font-semibold">ISIN:</span>{" "}
                                {meta.isin_growth? meta.isin_growth: "N/A"}
                            </p>
                            <p className="text-sm text-gray-700 mb-1">
                                <span className="font-semibold">Payout Option:</span> {" "} 
                                {getPayoutOption()}
                            </p>
                            <p className="text-sm text-gray-700">
                                <span className="font-semibold">Plan Type:</span>{" "}
                                {getPlanType()}
                            </p>
                        </div>
                    );
                })}
            </div>
            </div>
        </div>
    );
};

export default Comparison;
