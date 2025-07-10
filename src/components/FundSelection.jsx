import React, { useState, useEffect } from 'react';

function FundSelection() {
  const [funds, setFunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFunds, setSelectedFunds] = useState([]); // <-- Selected schemeCodes

  useEffect(() => {
    async function fetchFunds() {
      try {
        const response = await fetch('https://api.mfapi.in/mf');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setFunds(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchFunds();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center font-semibold text-3xl text-blue-300">
        Loading funds...
      </div>
    );

  if (error) return <div>Error: {error}</div>;

  // Filter funds based on search term (case insensitive)
  const filteredFunds = funds.filter((fund) =>
    fund.schemeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Toggle selection of a fund by schemeCode
  const toggleSelect = (schemeCode) => {
    setSelectedFunds((prevSelected) =>
      prevSelected.includes(schemeCode)
        ? prevSelected.filter((code) => code !== schemeCode) // remove if already selected
        : [...prevSelected, schemeCode] // add if not selected
    );
  };

  // Helper to highlight search term in schemeName
  const highlightMatch = (text, highlight) => {
    if (!highlight) return text;
    const idx = text.toLowerCase().indexOf(highlight.toLowerCase());
    if (idx === -1) return text;
    const before = text.slice(0, idx);
    const match = text.slice(idx, idx + highlight.length);
    const after = text.slice(idx + highlight.length);
    return (
      <>
        {before}
        <span className="bg-blue-300 text-white rounded px-1 py-0.5">{match}</span>
        {after}
      </>
    );
  };

  const enableShowComparison = () => {
    return selectedFunds.length >= 2 && selectedFunds.length <= 4;
  }

  const clearSelection = () => {
    setSelectedFunds([]);
  };




  return (
    <div className="flex flex-col justify-center items-center">
      <h2 className="text-2xl font-bold mb-4">Fund List</h2>
      <input
        type="text"
        placeholder="Search by scheme name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-6 px-4 py-2 border border-gray-300 rounded-md w-80 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <div className='flex justify-center items-center'>
      <div className="max-w-2/3 flex flex-wrap gap-4 max-h-[550px] overflow-y-scroll">
        {filteredFunds.slice(0, 20).map((fund) => {
          const isSelected = selectedFunds.includes(fund.schemeCode);
          return (
            <div
              key={fund.schemeCode}
              onClick={() => toggleSelect(fund.schemeCode)}
              className={`border rounded-lg p-4 shadow-md w-77 flex flex-col justify-between h-50 cursor-pointer relative ${isSelected ? 'bg-blue-100' : ''
                }`}
              title={isSelected ? 'Click to deselect' : 'Click to select'}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 text-blue-600 text-xl font-bold select-none">
                  ✓
                </div>
              )}

              <div className="text-sm font-semibold text-gray-700">{fund.schemeCode}</div>

              <div className="mt-4 text-left text-lg font-medium text-gray-900 flex-grow">
                {highlightMatch(fund.schemeName, searchTerm)}
              </div>

              <div className="mt-4 flex justify-start gap-6 text-sm text-gray-600">
                <div>
                  <span className="font-semibold">ISIN Growth:</span>{' '}
                  <span>{fund.isinGrowth || 'N/A'}</span>
                </div>
                <div>
                  <span className="font-semibold">ISIN Div Reinvestment:</span>{' '}
                  <span>{fund.isinDivReinvestment || 'N/A'}</span>
                </div>
              </div>
            </div>
          );
        })}

        {filteredFunds.length === 0 && (
          <div className="text-gray-500 text-lg mt-4">No funds found.</div>
        )}
      </div>
      <div className='m-4 flex justify-center items-center gap-3'>
          <button
            className={`bg-blue-500 text-white p-2 rounded ${enableShowComparison() ? '' : 'opacity-50 cursor-not-allowed'
              }`}
            disabled={!enableShowComparison()}
            onClick={() => {
              // Your comparison logic here
              alert(`Comparing funds: ${selectedFunds.join(', ')}`);
            }}
          >
            Show Comparison
            </button>
        <button className='bg-gray-300 p-2' onClick={clearSelection}>
          Clear Selection
        </button>
        </div>
      </div>
    </div>
  );
}

export default FundSelection;
