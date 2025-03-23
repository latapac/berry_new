import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { getoee } from '../../../backservice';

export default function Dashboard() {

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const serialNumber = queryParams.get('serial_number');
  const [selectedDate, setSelectedDate] = useState(getCurrentDate());
  const [selectedShift, setSelectedShift] = useState('Shift A');
  const [shiftData,setShiftData] = useState({shiftLengthHours: 0,
    shortBreaksCount: 0,
    shortBreaksMinutesEach: 0,
    mealBreakCount: 0,
    mealBreakMinutesEach: 0,
    downTime: 0,
    idealRunRate: 0,
    totalProducts: 0,
    rejectProducts: 0})
  const [isPrinting, setIsPrinting] = useState(false);

  

  // Updated state variables with your example values
  const [reportDate] = useState('22/3/2025');
  const [timeRange] = useState('08:00 - 16:00');
  const [productionLine] = useState('Line 1');
  const [shiftDetails, setShiftDetails] = useState('Shift A - Day');
  const [targetVsActual] = useState('120,000 vs 100,000');
  const shiftDetailNum = {
    'Shift A':0,
    'Shift B':1,
    'Shift C':2
  }

  // Update shiftDetails whenever selectedShift changes
  useEffect(() => {
    const shiftDetailsMap = {
      'Shift A': 'Shift A - Day',
      'Shift B': 'Shift B - Evening',
      'Shift C': 'Shift C - Night',
    };
    setShiftDetails(shiftDetailsMap[selectedShift] || `${selectedShift} - Day`);
  }, [selectedShift]);

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 100);
  };


  const shiftLengthMinutes = shiftData?.shiftLengthHours * 60;
  const shortBreaksTotal = shiftData?.shortBreaksCount * shiftData.shortBreaksMinutesEach;
  const mealBreakTotal = shiftData?.mealBreakCount * shiftData.mealBreakMinutesEach;

  const productionData = [
    { metric: "Shift Length", calculation: `${shiftData.shiftLengthHours} Hours × 60`, result: `${shiftLengthMinutes} Minutes` },
    { metric: "Short Breaks", calculation: `${shiftData.shortBreaksCount} × ${shiftData.shortBreaksMinutesEach}`, result: `${shortBreaksTotal} Minutes Total` },
    { metric: "Meal Break", calculation: `${shiftData.mealBreakCount} × ${shiftData.mealBreakMinutesEach}`, result: `${mealBreakTotal} Minutes Total` },
    { metric: "Down Time", calculation: "", result: `${shiftData.downTime} Minutes` },
    { metric: "Ideal Run Rate", calculation: "", result: `${shiftData.idealRunRate} PPM (Products Per Minute)` },
    { metric: "Total Products", calculation: "", result: `${shiftData.totalProducts.toLocaleString()} Products` },
    { metric: "Reject Products", calculation: "", result: `${shiftData.rejectProducts.toLocaleString()} Products` },
  ];

  const plannedProductionTime = shiftLengthMinutes - (shortBreaksTotal + mealBreakTotal);
  const operatingTime = plannedProductionTime - shiftData.downTime;
  const goodProducts = shiftData.totalProducts - shiftData.rejectProducts;

  const supportVariable = [
    { metric: "Planned Production Time", calculation: "Shift Length - Breaks", result: plannedProductionTime },
    { metric: "Operating Time", calculation: "Planned Production Time - Down Time", result: operatingTime },
    { metric: "Good Products", calculation: "Total Products - Reject Products", result: goodProducts },
  ];

  const availability = (operatingTime / plannedProductionTime) * 100;
  const performance = (shiftData.totalProducts / (operatingTime * shiftData.idealRunRate)) * 100;
  const quality = (goodProducts / shiftData.totalProducts) * 100;
  const overallOEE = (availability * performance * quality) / 10000;

  const oeeFactor = [
    { metric: "Availability", calculation: "Operating Time / Planned Production Time", myOee: availability.toFixed(2), className: "bg-orange-200" },
    { metric: "Performance", calculation: "Total Products / (Operating Time × Ideal Run Rate)", myOee: performance.toFixed(2), className: "bg-blue-200" },
    { metric: "Quality", calculation: "Good Products / Total Products", myOee: quality.toFixed(2), className: "bg-purple-200" },
    { metric: "OVERALL OEE", calculation: "Availability × Performance × Quality", myOee: overallOEE.toFixed(2), className: "bg-green-200" },
  ];

  const comparisonData = [
    { metric: "Availability", worldClass: 90.00, myOee: availability.toFixed(2), className: "bg-orange-200" },
    { metric: "Performance", worldClass: 95.00, myOee: performance.toFixed(2), className: "bg-blue-200" },
    { metric: "Quality", worldClass: 99.90, myOee: quality.toFixed(2), className: "bg-purple-200" },
    { metric: "OVERALL OEE", worldClass: 85.00, myOee: overallOEE.toFixed(2), className: "bg-green-200" },
  ];

  useEffect(()=>{
    
    
    getoee(serialNumber,selectedDate,shiftDetailNum[selectedShift]).then((data)=>{
      if (data) {
        setShiftData(data[0].d)
      }else{
        setShiftData({shiftLengthHours: 0,
          shortBreaksCount: 0,
          shortBreaksMinutesEach: 0,
          mealBreakCount: 0,
          mealBreakMinutesEach: 0,
          downTime: 0,
          idealRunRate: 0,
          totalProducts: 0,
          rejectProducts: 0})
      }
    })
  },[selectedShift,selectedDate])
  return (
    <div className="min-h-screen flex flex-col items-center p-4 bg-gray-100">
      {/* Header Section */}
      <div className="w-full mb-4 flex flex-wrap justify-between items-center no-print gap-2">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 text-left print:text-center">
          OEE Details
        </h1>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1">
            <label htmlFor="select-date" className="text-xs font-medium text-gray-700">Date:</label>
            <input
              id="select-date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="p-0.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-24"
            />
          </div>
          <div className="flex items-center gap-1">
            <label htmlFor="select-shift" className="text-xs font-medium text-gray-700">Shift:</label>
            <select
              id="select-shift"
              value={selectedShift}
              onChange={(e) => setSelectedShift(e.target.value)}
              className="p-0.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-20"
            >
              <option value="Shift A">Shift A</option>
              <option value="Shift B">Shift B</option>
              <option value="Shift C">Shift C</option>
            </select>
          </div>
          <button
            onClick={handlePrint}
            className="p-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-20 h-6"
          >
            Print
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full print-area space-y-4">
        {/* Parameters Before the First Table */}
        <div className="header-area text-sm text-gray-800">
          <div className="header-columns">
            <div className="column-left">
              <p className="header-line"><strong>Equipment ID:</strong> {serialNumber || 'PAC24250046'}</p>
              <p className="header-line"><strong>Report Date:</strong> {selectedDate}</p>
              <p className="header-line"><strong>Time Range:</strong> {timeRange}</p>
            </div>
            <div className="column-right">
              <p className="header-line"><strong>Production Line:</strong> {productionLine}</p>
              <p className="header-line"><strong>Shift Details:</strong> {shiftDetails}</p>
              <p className="header-line"><strong>Target vs. Actual Production:</strong> {targetVsActual}</p>
            </div>
          </div>
        </div>

        {/* Tables */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 bg-white rounded shadow-md overflow-hidden">
            <table className="w-full border-collapse border-l border-r border-t border-gray-300">
              <thead>
                <tr>
                  <th colSpan="3" className="px-2 py-1 text-xs font-medium uppercase tracking-wider border-b border-t border-gray-300 bg-gray-200 text-center">
                    Production Data
                  </th>
                </tr>
                <tr>
                  <th className="px-2 py-1 text-xs font-medium uppercase tracking-wider border-b border-r border-gray-300 text-center">Metric</th>
                  <th className="px-2 py-1 text-xs font-medium uppercase tracking-wider border-b border-r border-gray-300 text-center">Calculation</th>
                  <th className="px-2 py-1 text-xs font-medium uppercase tracking-wider border-b border-gray-300 text-center">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {productionData.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-2 py-1 text-xs border-b border-r border-gray-300">{row.metric}</td>
                    <td className="px-2 py-1 text-xs border-b border-r border-gray-300">{row.calculation}</td>
                    <td className="px-2 py-1 text-xs border-b border-gray-300">{row.result}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex-1 bg-white rounded shadow-md overflow-hidden">
            <table className="w-full border-collapse border-l border-r border-t border-gray-300">
              <thead>
                <tr>
                  <th colSpan="3" className="px-2 py-1 text-xs font-medium uppercase tracking-wider border-b border-t border-gray-300 bg-gray-200 text-center">
                    Support Variables
                  </th>
                </tr>
                <tr>
                  <th className="px-2 py-1 text-xs font-medium uppercase tracking-wider border-b border-r border-gray-300 text-center">Metric</th>
                  <th className="px-2 py-1 text-xs font-medium uppercase tracking-wider border-b border-r border-gray-300 text-center">Calculation</th>
                  <th className="px-2 py-1 text-xs font-medium uppercase tracking-wider border-b border-gray-300 text-center">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {supportVariable.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-2 py-1 text-xs border-b border-r border-gray-300">{row.metric}</td>
                    <td className="px-2 py-1 text-xs border-b border-r border-gray-300">{row.calculation}</td>
                    <td className="px-2 py-1 text-xs border-b border-gray-300">{row.result}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 bg-white rounded shadow-md overflow-hidden">
            <table className="w-full border-collapse border-l border-r border-t border-gray-300">
              <thead>
                <tr>
                  <th colSpan="3" className="px-2 py-1 text-xs font-medium uppercase tracking-wider border-b border-t border-gray-300 bg-gray-200 text-center">
                    OEE Calculation
                  </th>
                </tr>
                <tr>
                  <th className="px-2 py-1 text-xs font-medium uppercase tracking-wider border-b border-r border-gray-300 text-center">OEE Factor</th>
                  <th className="px-2 py-1 text-xs font-medium uppercase tracking-wider border-b border-r border-gray-300 text-center">Calculation</th>
                  <th className="px-2 py-1 text-xs font-medium uppercase tracking-wider border-b border-gray-300 text-center">OEE%</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {oeeFactor.map((row, index) => (
                  <tr key={index} className={`${row.className} hover:bg-opacity-80 transition-colors`}>
                    <td className="px-2 py-1 text-xs border-b border-r border-gray-300">{row.metric}</td>
                    <td className="px-2 py-1 text-xs border-b border-r border-gray-300">{row.calculation}</td>
                    <td className="px-2 py-1 text-xs border-b border-gray-300">{row.myOee}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex-1 bg-white rounded shadow-md overflow-hidden">
            <table className="w-full border-collapse border-l border-r border-t border-gray-300">
              <thead>
                <tr>
                  <th colSpan="3" className="px-2 py-1 text-xs font-medium uppercase tracking-wider border-b border-t border-gray-300 bg-gray-200 text-center">
                    Comparison
                  </th>
                </tr>
                <tr>
                  <th className="px-2 py-1 text-xs font-medium uppercase tracking-wider border-b border-r border-gray-300 text-center">OEE Factor</th>
                  <th className="px-2 py-1 text-xs font-medium uppercase tracking-wider border-b border-r border-gray-300 text-center">World Class</th>
                  <th className="px-2 py-1 text-xs font-medium uppercase tracking-wider border-b border-gray-300 text-center">OEE%</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {comparisonData.map((row, index) => (
                  <tr key={index} className={`${row.className} hover:bg-opacity-80 transition-colors`}>
                    <td className="px-2 py-1 text-xs border-b border-r border-gray-300">{row.metric}</td>
                    <td className="px-2 py-1 text-xs border-b border-r border-gray-300">{row.worldClass}</td>
                    <td className="px-2 py-1 text-xs border-b border-gray-300">{row.myOee}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style jsx global>{`
        th {
          text-align: center !important;
        }
        .header-area {
          margin-bottom: 1rem;
          font-size: 12px; /* Slightly larger for screen visibility */
        }
        .header-columns {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          width: 100%;
        }
        .column-left, .column-right {
          width: 100%;
          box-sizing: border-box;
        }
        .header-line {
          margin-bottom: 0.5rem; /* Increased spacing between lines */
        }
        .header-line:last-child {
          margin-bottom: 0; /* Remove margin from the last line to avoid extra space */
        }
        @media (min-width: 768px) {
          .header-columns {
            flex-direction: row;
          }
          .column-left, .column-right {
            width: 50%;
          }
        }
        @media print {
          body * {
            visibility: hidden;
          }
          .print-area, .print-area * {
            visibility: visible;
          }
          .print-area {
            position: absolute;
            top: 30px;
            left: 0;
            width: 100%;
            box-shadow: none !important;
            border-radius: 0 !important;
            overflow: visible !important;
          }
          .header-area {
            font-size: 9pt;
            line-height: 1.2;
            page-break-inside: avoid;
            page-break-after: auto;
          }
          .header-columns {
            display: flex !important;
            flex-direction: row !important;
            gap: 1rem;
            width: 100%;
          }
          .column-left, .column-right {
            width: 50% !important;
            box-sizing: border-box !important;
            min-width: 0;
          }
          .header-line {
            margin-bottom: 0.4rem; /* Slightly smaller spacing for print to save space */
          }
          .header-line:last-child {
            margin-bottom: 0;
          }
          .space-y-4 > div {
            margin-bottom: 1rem;
          }
          table {
            width: 100%;
            font-size: 9pt;
            border-collapse: collapse;
            page-break-inside: auto;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 4px;
          }
          th {
            background-color: #f8fafc;
            text-align: center !important;
          }
          tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }
          @page {
            size: A4;
            margin: 1cm;
          }
          body::before {
            content: "OEE Details";
            position: fixed;
            top: 5px;
            left: 0;
            width: 100%;
            text-align: center;
            font-size: 14pt;
            font-weight: bold;
            visibility: visible;
          }
          body::after {
            content: none;
          }
          .flex {
            display: block !important;
          }
          .flex-1 {
            width: 100% !important;
            margin-bottom: 1rem;
          }
        }
      `}</style>
    </div>
  );
}