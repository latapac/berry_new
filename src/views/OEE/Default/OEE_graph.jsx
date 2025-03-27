import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { getoee } from '../../../backservice';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

export default function OEE_graph() {
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const serialNumber = queryParams.get('serial_number');
  const [selectedDate, setSelectedDate] = useState(getCurrentDate());
  const [selectedShift, setSelectedShift] = useState('Shift A');
  const [shiftData, setShiftData] = useState({
    shiftLengthHours: 0,
    shortBreaksCount: 0,
    shortBreaksMinutesEach: 0,
    mealBreakCount: 0,
    mealBreakMinutesEach: 0,
    downTime: 0,
    idealRunRate: 0,
    totalProducts: 0,
    rejectProducts: 0
  });
  const [isPrinting, setIsPrinting] = useState(false);

  const [reportDate] = useState('22/3/2025');
  const [timeRange] = useState('08:00 - 16:00');
  const [productionLine] = useState('Line 1');
  const [shiftDetails, setShiftDetails] = useState('Shift A - Day');
  const [targetVsActual] = useState('120,000 vs 100,000');
  const shiftDetailNum = {
    'Shift A': 1,
    'Shift B': 2,
    'Shift C': 3
  };

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

  const plannedProductionTime = shiftLengthMinutes - (shortBreaksTotal + mealBreakTotal);
  const operatingTime = plannedProductionTime - shiftData.downTime;
  const goodProducts = shiftData.totalProducts - shiftData.rejectProducts;

  const availability = (operatingTime / plannedProductionTime) * 100;
  const performance = (shiftData.totalProducts / (operatingTime * shiftData.idealRunRate)) * 100;
  const quality = (goodProducts / shiftData.totalProducts) * 100;
  const overallOEE = (availability * performance * quality) / 10000;

  useEffect(() => {
    getoee(serialNumber, selectedDate, shiftDetailNum[selectedShift]).then((data) => {
      if (data) {
        setShiftData(data[data.length - 1].d);
      } else {
        setShiftData({
          shiftLengthHours: 0,
          shortBreaksCount: 0,
          shortBreaksMinutesEach: 0,
          mealBreakCount: 0,
          mealBreakMinutesEach: 0,
          downTime: 0,
          idealRunRate: 0,
          totalProducts: 0,
          rejectProducts: 0
        });
      }
    });
  }, [selectedShift, selectedDate]);

  // Doughnut chart data and options
  const productionChartData = {
    labels: ['Operating Time', 'Down Time', 'Breaks'],
    datasets: [{
      data: [operatingTime, shiftData.downTime, shortBreaksTotal + mealBreakTotal],
      backgroundColor: [
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 99, 132, 0.6)',
        'rgba(255, 206, 86, 0.6)'
      ],
      borderColor: [
        'rgba(54, 162, 235, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(255, 206, 86, 1)'
      ],
      borderWidth: 1
    }]
  };

  const qualityChartData = {
    labels: ['Good Products', 'Rejected Products'],
    datasets: [{
      data: [goodProducts, shiftData.rejectProducts],
      backgroundColor: [
        'rgba(75, 192, 192, 0.6)',
        'rgba(255, 99, 132, 0.6)'
      ],
      borderColor: [
        'rgba(75, 192, 192, 1)',
        'rgba(255, 99, 132, 1)'
      ],
      borderWidth: 1
    }]
  };

  const oeeChartData = {
    labels: ['Availability', 'Performance', 'Quality'],
    datasets: [{
      data: [availability, performance, quality],
      backgroundColor: [
        'rgba(255, 159, 64, 0.6)',
        'rgba(153, 102, 255, 0.6)',
        'rgba(54, 162, 235, 0.6)'
      ],
      borderColor: [
        'rgba(255, 159, 64, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(54, 162, 235, 1)'
      ],
      borderWidth: 1
    }]
  };

  const comparisonChartData = {
    labels: ['Your OEE', 'World Class'],
    datasets: [{
      data: [overallOEE, 85],
      backgroundColor: [
        'rgba(75, 192, 192, 0.6)',
        'rgba(255, 99, 132, 0.6)'
      ],
      borderColor: [
        'rgba(75, 192, 192, 1)',
        'rgba(255, 99, 132, 1)'
      ],
      borderWidth: 1
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.raw}%`;
          }
        }
      }
    },
    cutout: '70%'
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 bg-gray-100">
      {/* Header Section */}
      <div className="w-full mb-4 flex flex-wrap justify-between items-center no-print gap-2">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 text-left print:text-center">
          OEE Dashboard
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
        {/* Parameters Before the Charts */}
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

        {/* Charts */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 bg-white rounded shadow-md p-4">
            <h3 className="text-sm font-semibold mb-2 text-center">Production Time Distribution</h3>
            <div className="h-64">
              <Doughnut data={productionChartData} options={chartOptions} />
            </div>
            <div className="mt-2 text-xs text-center">
              <p>Shift Length: {shiftLengthMinutes} minutes</p>
              <p>Operating Time: {operatingTime} minutes ({availability.toFixed(2)}%)</p>
            </div>
          </div>

          <div className="flex-1 bg-white rounded shadow-md p-4">
            <h3 className="text-sm font-semibold mb-2 text-center">Product Quality</h3>
            <div className="h-64">
              <Doughnut data={qualityChartData} options={chartOptions} />
            </div>
            <div className="mt-2 text-xs text-center">
              <p>Total Products: {shiftData.totalProducts.toLocaleString()}</p>
              <p>Quality Rate: {quality.toFixed(2)}%</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 bg-white rounded shadow-md p-4">
            <h3 className="text-sm font-semibold mb-2 text-center">OEE Components</h3>
            <div className="h-64">
              <Doughnut data={oeeChartData} options={chartOptions} />
            </div>
            <div className="mt-2 text-xs text-center">
              <p>Availability: {availability.toFixed(2)}%</p>
              <p>Performance: {performance.toFixed(2)}%</p>
              <p>Quality: {quality.toFixed(2)}%</p>
            </div>
          </div>

          <div className="flex-1 bg-white rounded shadow-md p-4">
            <h3 className="text-sm font-semibold mb-2 text-center">OEE Comparison</h3>
            <div className="h-64">
              <Doughnut data={comparisonChartData} options={chartOptions} />
            </div>
            <div className="mt-2 text-xs text-center">
              <p>Your OEE: {overallOEE.toFixed(2)}%</p>
              <p>World Class: 85%</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .header-area {
          margin-bottom: 1rem;
          font-size: 12px;
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
          margin-bottom: 0.5rem;
        }
        .header-line:last-child {
          margin-bottom: 0;
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
            margin-bottom: 0.4rem;
          }
          .header-line:last-child {
            margin-bottom: 0;
          }
          .flex {
            display: flex !important;
            flex-direction: row !important;
          }
          .flex-1 {
            width: 50% !important;
            margin-bottom: 1rem;
            page-break-inside: avoid;
          }
          @page {
            size: A4 landscape;
            margin: 1cm;
          }
          body::before {
            content: "OEE Dashboard";
            position: fixed;
            top: 5px;
            left: 0;
            width: 100%;
            text-align: center;
            font-size: 14pt;
            font-weight: bold;
            visibility: visible;
          }
        }
      `}</style>
    </div>
  );
}