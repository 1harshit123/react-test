import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Helper: Extract payout option from scheme name
function getPayoutOption(schemeName) {
  const name = schemeName.toLowerCase();
  if (name.includes('growth')) return 'growth';
  if (name.includes('dividend reinvestment')) return 'dividend reinvestment';
  if (name.includes('dividend payout')) return 'dividend payout';
  if (name.includes('idcw')) return 'idcw';
  return 'other';
}

// Helper: Extract plan type from scheme name
function getPlanType(schemeName) {
  const name = schemeName.toLowerCase();
  if (name.includes('direct')) return 'direct';
  if (name.includes('regular')) return 'regular';
  return 'other';
}

function FundSelection() {
  const [funds, setFunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFunds, setSelectedFunds] = useState([]);
  const [payoutOption, setPayoutOption] = useState('all');
  const [planType, setPlanType] = useState('all');
  // for navigation button
  const navigate = useNavigate()

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

  // Filter funds based on search term and parsed payout/plan types
  const filteredFunds = funds
    .filter((fund) =>
      fund.schemeName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((fund) => {
      if (payoutOption === 'all') return true;
      const payout = getPayoutOption(fund.schemeName);
      return payout === payoutOption;
    })
    .filter((fund) => {
      if (planType === 'all') return true;
      const plan = getPlanType(fund.schemeName);
      return plan === planType;
    });

  // Toggle selection of a fund by schemeCode
  const toggleSelect = (schemeCode) => {
    setSelectedFunds((prevSelected) =>
      prevSelected.includes(schemeCode)
        ? prevSelected.filter((code) => code !== schemeCode)
        : [...prevSelected, schemeCode]
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
  };

  const clearSelection = () => {
    setSelectedFunds([]);
  };

  
  return (
    <div className="flex flex-col justify-center items-center py-8">
      <h2 className="text-3xl font-bold mb-7 text-[#1AA39A] ">Fund List</h2>
      <input
        type="text"
        placeholder="Search by scheme name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-6 px-4 py-2 border border-gray-300 rounded-md w-80 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <div className="flex gap-4 mb-4">
        <div>
          <label className="mr-2 font-semibold text-blue-400">Payout Option:</label>
          <select
            value={payoutOption}
            onChange={e => setPayoutOption(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="all">All</option>
            <option value="growth">Growth</option>
            <option value="idcw">IDCW</option>
            <option value="dividend payout">Dividend Payout</option>
            <option value="dividend reinvestment">Dividend Reinvestment</option>
          </select>
        </div>
        <div>
          <label className="mr-2 font-semibold text-blue-400">Plan Type:</label>
          <select
            value={planType}
            onChange={e => setPlanType(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="all">All</option>
            <option value="direct">Direct</option>
            <option value="regular">Regular</option>
          </select>
        </div>
        <button
          className="ml-2 bg-gray-200 p-2 rounded-full text-sm cursor-pointer transition-opacity duration-200 hover:opacity-80 active:opacity-60"
          onClick={() => {
            setPayoutOption('all');
            setPlanType('all');
          }}
        >
          Clear Filter
        </button>
      </div>
      <div className="w-2/3 h-0.5 bg-gray-300 flex justify-center items-center mb-5"></div>

      <div className='flex justify-center items-center'>
        <div className="max-w-2/3 flex flex-wrap gap-4 max-h-[550px] overflow-y-scroll">
          {filteredFunds.slice(0,500).map((fund) => {
            const isSelected = selectedFunds.includes(fund.schemeCode);
            return (
              <div
                key={fund.schemeCode}
                onClick={() => toggleSelect(fund.schemeCode)}
                className={`border rounded-lg p-4 shadow-md w-77 h-auto flex flex-col justify-between  cursor-pointer relative ${isSelected ? 'bg-blue-100' : ''
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

                <div className="mt-4 flex flex-col gap-1 text-sm text-gray-600">
                  <div>
                    <span className="font-semibold">ISIN:</span>{' '}
                    <span>{fund.isin || 'N/A'}</span>
                  </div>
                  {/* Optionally, show parsed payout/plan */}
                  <div>
                    <span className="font-semibold">Payout Option:</span>{' '}
                    <span>{getPayoutOption(fund.schemeName)}</span>
                  </div>
                  <div>
                    <span className="font-semibold">Plan Type:</span>{' '}
                    <span>{getPlanType(fund.schemeName)}</span>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredFunds.length === 0 && (
            <div className="text-gray-500 text-lg mt-4">No funds found.</div>
          )}
        </div>
        <div>
          <div className='m-4 flex justify-center items-center gap-3'>
            <button
              className={`bg-blue-500 text-white p-2 rounded ${enableShowComparison() ? '' : 'opacity-50 cursor-not-allowed'
                }`}
              disabled={!enableShowComparison()}
              onClick={() => {
                navigate('/comparison', {
                  state: { selectedFunds } 
                });
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
    </div>
  );
}

export default FundSelection;
