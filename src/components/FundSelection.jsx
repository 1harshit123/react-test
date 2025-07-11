import React, { useState, useEffect, useRef } from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';

function getPayoutOption(schemeName) {
  const name = schemeName.toLowerCase();
  if (name.includes('growth')) return 'growth';
  if (name.includes('dividend reinvestment')) return 'dividend reinvestment';
  if (name.includes('dividend payout')) return 'dividend payout';
  if (name.includes('idcw')) return 'idcw';
  return 'other';
}

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
  const [visibleCount, setVisibleCount] = useState(20);
  const observerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchFunds() {
      try {
        const response = await fetch('https://api.mfapi.in/mf');
        if (!response.ok) throw new Error('Network response was not ok');
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

  const filteredFunds = funds
    .filter((fund) => fund.schemeName.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((fund) => payoutOption === 'all' || getPayoutOption(fund.schemeName) === payoutOption)
    .filter((fund) => planType === 'all' || getPlanType(fund.schemeName) === planType);

  const visibleFunds = filteredFunds.slice(0, visibleCount);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setVisibleCount(prev => Math.min(prev + 20, filteredFunds.length));
        }
      },
      { threshold: 1 }
    );

    const current = observerRef.current;
    if (current) observer.observe(current);
    return () => { if (current) observer.unobserve(current); };
  }, [filteredFunds]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader text-blue-500">Loading ...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500 text-xl font-semibold">
        Error: {error}
      </div>
    );
  }

  const toggleSelect = (schemeCode) => {
    setSelectedFunds(prev =>
      prev.includes(schemeCode) ? prev.filter(code => code !== schemeCode) : [...prev, schemeCode]
    );
  };

  const highlightMatch = (text, highlight) => {
    if (!highlight) return text;
    const idx = text.toLowerCase().indexOf(highlight.toLowerCase());
    if (idx === -1) return text;
    return (
      <>
        {text.slice(0, idx)}
        <span className="bg-blue-300 text-white rounded px-1 py-0.5">
          {text.slice(idx, idx + highlight.length)}
        </span>
        {text.slice(idx + highlight.length)}
      </>
    );
  };

  const enableShowComparison = () => selectedFunds.length >= 2 && selectedFunds.length <= 4;
  const clearSelection = () => setSelectedFunds([]);

  return (
    <div className="flex flex-col justify-center items-center py-8">
      <h2 className="text-3xl font-bold mb-7 text-[#1AA39A]">Fund List</h2>

      <input
        type="text"
        placeholder="Search by scheme name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-6 px-4 py-2 border border-gray-300 rounded-md w-80 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <div className="flex gap-4 mb-4">
        <div>
          <label className="mr-2 font-semibold text-blue-500">Payout Option:</label>
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
          <label className="mr-2 font-semibold text-blue-500">Plan Type:</label>
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
          className="ml-2 bg-gray-200 p-2 rounded-full text-sm hover:opacity-80 active:opacity-60"
          onClick={() => {
            setPayoutOption('all');
            setPlanType('all');
          }}
        >
          Clear Filter
        </button>
      </div>

      <div className="w-2/3 h-0.5 bg-gray-300 mb-5"></div>

      <div className='flex justify-center items-start'>
        <div className="max-w-2/3 flex flex-wrap gap-4 max-h-[550px] overflow-y-scroll">
          {visibleFunds.map((fund) => {
            const isSelected = selectedFunds.includes(fund.schemeCode);
            return (
              <div
                key={fund.schemeCode}
                onClick={() => toggleSelect(fund.schemeCode)}
                className={`border rounded-lg p-4 shadow-md w-77 cursor-pointer relative ${isSelected ? 'bg-blue-100' : ''}`}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 text-blue-600 text-xl font-bold select-none">
                    ✓
                  </div>
                )}
                <div className="text-sm font-semibold text-gray-700">{fund.schemeCode}</div>
                <div className="mt-4 text-left text-lg font-medium text-gray-900">
                  {highlightMatch(fund.schemeName, searchTerm)}
                </div>
                <div className="mt-4 flex flex-col gap-1 text-sm text-gray-600">
                  <div><span className="font-semibold">ISIN:</span> {fund.isin || 'N/A'}</div>
                  <div><span className="font-semibold">Payout Option:</span> {getPayoutOption(fund.schemeName)}</div>
                  <div><span className="font-semibold">Plan Type:</span> {getPlanType(fund.schemeName)}</div>
                </div>
              </div>
            );
          })}
          {filteredFunds.length > visibleCount && <div ref={observerRef} className="w-full h-10"></div>}
          {filteredFunds.length === 0 && <div className="text-gray-500 text-lg mt-4">No funds found.</div>}
        </div>

        <div className='flex flex-col justify-center items-center'>
          <h1 className='text-red-500 text-sm mt-3'>Select Funds between 2 and 4 for comparison</h1>
          <div className='m-4 flex justify-center items-center gap-3'>
            <button
              className={`bg-blue-500 text-white p-2 rounded ${enableShowComparison() ? '' : 'opacity-50 cursor-not-allowed'}`}
              disabled={!enableShowComparison()}
              onClick={() => {
                navigate('/comparison', { state: { selectedFunds } });
              }}
            >
              Show Comparison
            </button>
            <button className='bg-gray-300 p-2' onClick={clearSelection}>Clear Selection</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FundSelection;