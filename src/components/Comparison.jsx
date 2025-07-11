import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const Comparison = () => {
    const location = useLocation();
    const [fundsData, setFundsData] = useState([]);
    const { selectedFunds } = location.state || {};

    useEffect

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Selected Fund Codes</h2>
            <div className="bg-gray-100 p-4 rounded">
                {selectedFunds && selectedFunds.length > 0 ? (
                    selectedFunds.map((code, index) => (
                        <div key={index} className="mb-2 text-blue-700 font-semibold">
                            {code}
                        </div>
                    ))
                ) : (
                    <div className="text-gray-500">No funds selected.</div>
                )}
            </div>
        </div>
    );
};

export default Comparison;
