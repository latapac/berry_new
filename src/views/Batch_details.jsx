import React, { useState,useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useLocation } from 'react-router';
import { getBatch} from '../backservice';

const batchData = [
  { batchId: 1, startTime: '2023-10-01 08:00', endTime: '2023-10-01 16:00', machineLineNo: 'Line 1', status: 'Completed', unitsProduced: 500 },
  { batchId: 2, startTime: '2023-10-02 08:00', endTime: '2023-10-02 16:00', machineLineNo: 'Line 2', status: 'In Progress', unitsProduced: 300 },
  { batchId: 3, startTime: '2023-10-03 08:00', endTime: '2023-10-03 16:00', machineLineNo: 'Line 3', status: 'Pending', unitsProduced: 0 },
];

const metricsData = [
  { batchId: 1, targetProduction: 600, actualProduction: 500, qualityMetrics: '98%' },
  { batchId: 2, targetProduction: 600, actualProduction: 300, qualityMetrics: '95%' },
  { batchId: 3, targetProduction: 600, actualProduction: 0, qualityMetrics: 'N/A' },
];

export default function BatchDetails() {
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const [batchDetail,setBatchDetail] = useState({})
  const [selectedShift, setSelectedShift] = useState('Shift A');
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const serialNumber = queryParams.get('serial_number');

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [selectedDate, setSelectedDate] = useState(getCurrentDate());

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 100);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return '#4caf50';
      case 'In Progress': return '#ffa000';
      case 'Pending': return '#f44336';
      default: return '#000';
    }   
  };

  useEffect(()=>{
    getBatch(serialNumber,selectedDate).then((data)=>{
      setBatchDetail(data[0])
    })
    
  },[selectedDate])

  return (
    <div className="min-h-screen flex flex-col items-center p-4 bg-gray-100">
      {/* Header Section */}
      <div className="w-full mb-4 flex flex-wrap justify-between items-center no-print gap-2">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 text-left print:text-center">
          Batch Details
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
        {/* Equipment ID and Other Details */}
        <div className="header-area text-sm text-gray-800">
          <div className="header-columns flex flex-col md:flex-row gap-64">
            <div className="flex flex-col gap-1">
              <p className="header-line"><strong>Equipment ID:</strong> {'serialNumber' || 'PAC24250046'}</p>
              <p className="header-line"><strong>Report Date:</strong> {'selectedDate'}</p>
              <p className="header-line"><strong>Time Range:</strong> {'timeRange'}</p>
            </div>
            <div className="flex flex-col gap-1 ">
              <p className="header-line"><strong>Production Line:</strong> {'productionLine'}</p>
              <p className="header-line"><strong>Shift Details:</strong> {'shiftDetails'}</p>
              <p className="header-line"><strong>Target vs. Actual Production:</strong> {'targetVsActual'}</p>
            </div>
          </div>
        </div>

        {/* Batch Table */}
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded shadow-md overflow-hidden">
            <table className="w-full border-collapse border-l border-r border-t border-gray-300">
              <thead>
                <tr>
                  <th colSpan="6" className="px-2 py-1 text-xs font-medium uppercase tracking-wider border-b border-t border-gray-300 bg-gray-200 text-center">
                    Batch Details
                  </th>
                </tr>
                <tr>
                  <th className="px-2 py-1 text-xs font-medium uppercase tracking-wider border-b border-r border-gray-300 text-center">Batch ID</th>
                  <th className="px-2 py-1 text-xs font-medium uppercase tracking-wider border-b border-r border-gray-300 text-center">Start Time</th>
                  <th className="px-2 py-1 text-xs font-medium uppercase tracking-wider border-b border-r border-gray-300 text-center">End Time</th>
                  <th className="px-2 py-1 text-xs font-medium uppercase tracking-wider border-b border-r border-gray-300 text-center">Machine Line</th>
                  <th className="px-2 py-1 text-xs font-medium uppercase tracking-wider border-b border-r border-gray-300 text-center">Status</th>
                  <th className="px-2 py-1 text-xs font-medium uppercase tracking-wider border-b border-gray-300 text-center">Units Produced</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {batchData.map((batch) => (
                  <tr
                    key={batch.batchId}
                    onClick={() => setSelectedBatch(batch.batchId)}
                    className={`hover:bg-gray-50 transition-colors cursor-pointer ${selectedBatch === batch.batchId ? 'bg-blue-50' : ''}`}
                  >
                    <td className="px-2 py-1 text-xs border-b border-r border-gray-300 text-center">{batchDetail?.d?.Batch_Number[0]}</td>
                    <td className="px-2 py-1 text-xs border-b border-r border-gray-300 text-center">{batchDetail?.ts}</td>
                    <td className="px-2 py-1 text-xs border-b border-r border-gray-300 text-center">{batch.endTime}</td>
                    <td className="px-2 py-1 text-xs border-b border-r border-gray-300 text-center">{batch.machineLineNo}</td>
                    <td className="px-2 py-1 text-xs border-b border-r border-gray-300 text-center" >{batchDetail?.d?.Batch_status[0]}
                    </td>
                    <td className="px-2 py-1 text-xs border-b border-gray-300 text-center">{batch.unitsProduced}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Metrics Section */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 bg-white rounded shadow-md overflow-hidden">
            <table className="w-full border-collapse border-l border-r border-t border-gray-300">
              <thead>
                <tr>
                  <th colSpan="3" className="px-2 py-1 text-xs font-medium uppercase tracking-wider border-b border-t border-gray-300 bg-gray-200 text-center">
                    Production Metrics
                  </th>
                </tr>
                <tr>
                  <th className="px-2 py-1 text-xs font-medium uppercase tracking-wider border-b border-r border-gray-300 text-center">Batch ID</th>
                  <th className="px-2 py-1 text-xs font-medium uppercase tracking-wider border-b border-r border-gray-300 text-center">Target vs Actual</th>
                  <th className="px-2 py-1 text-xs font-medium uppercase tracking-wider border-b border-gray-300 text-center">Quality</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {metricsData.map((metric) => (
                  <tr key={metric.batchId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-2 py-1 text-xs border-b border-r border-gray-300 text-center">{metric.batchId}</td>
                    <td className="px-2 py-1 text-xs border-b border-r border-gray-300 text-center">
                      {metric.targetProduction} vs {metric.actualProduction}
                    </td>
                    <td className="px-2 py-1 text-xs border-b border-gray-300 text-center">{metric.qualityMetrics}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Visualizations */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 bg-white rounded shadow-md overflow-hidden p-4">
            <h2 className="text-xs font-medium uppercase tracking-wider mb-4">Batch Performance Across Machines</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={batchData}>
                <XAxis dataKey="machineLineNo" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="unitsProduced" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Timeline */}
        {selectedBatch && (
          <div className="bg-white rounded shadow-md overflow-hidden p-4">
            <h2 className="text-xs font-medium uppercase tracking-wider mb-4">Batch Progress Timeline</h2>
            <div className="flex flex-col space-y-4">
              {batchData
                .filter(b => b.batchId === selectedBatch)
                .map(batch => (
                  <div key={batch.batchId} className="border-l-4 border-blue-500 pl-4">
                    <div className="text-sm font-medium">Batch {batch.batchId}</div>
                    <div className="text-xs text-gray-500">Start: {batch.startTime}</div>
                    <div className="text-xs text-gray-500">End: {batch.endTime}</div>
                    <div className="text-xs mt-2">
                      Status: <span style={{ color: getStatusColor(batch.status) }}>{batch.status}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Detailed Logs */}
        {selectedBatch && (
          <div className="bg-white rounded shadow-md overflow-hidden">
            <table className="w-full border-collapse border-l border-r border-t border-gray-300">
              <thead>
                <tr>
                  <th colSpan="3" className="px-2 py-1 text-xs font-medium uppercase tracking-wider border-b border-t border-gray-300 bg-gray-200 text-center">
                    Detailed Logs for Batch {selectedBatch}
                  </th>
                </tr>
                <tr>
                  <th className="px-2 py-1 text-xs font-medium uppercase tracking-wider border-b border-r border-gray-300 text-center">Timestamp</th>
                  <th className="px-2 py-1 text-xs font-medium uppercase tracking-wider border-b border-r border-gray-300 text-center">Event</th>
                  <th className="px-2 py-1 text-xs font-medium uppercase tracking-wider border-b border-gray-300 text-center">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-2 py-1 text-xs border-b border-r border-gray-300 text-center">2023-10-01 08:00</td>
                  <td className="px-2 py-1 text-xs border-b border-r border-gray-300 text-center">Batch Started</td>
                  <td className="px-2 py-1 text-xs border-b border-gray-300 text-center">Machine Line 1 initialized</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-area, .print-area * {
            visibility: visible;
          }
          .print-area {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            box-shadow: none !important;
            border-radius: 0 !important;
          }
          table {
            width: 100%;
            font-size: 9pt;
            border-collapse: collapse;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 4px;
          }
          th {
            background-color: #f8fafc;
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