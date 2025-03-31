import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CartesianGrid } from 'recharts';
import { useLocation } from 'react-router';
import { getBatch } from '../backservice';

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
  const [batchDetail, setBatchDetail] = useState({});
  const [selectedShift, setSelectedShift] = useState('Shift A');
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const serialNumber = queryParams.get('serial_number');

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
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

  useEffect(() => {
    getBatch(serialNumber, selectedDate).then((data) => {
      setBatchDetail(data[0]);
    });
  }, [selectedDate]);

  return (
    <div className="min-h-screen bg-gray-100 p-2 sm:p-4 print:p-0">
      {/* Header Section */}
      <div className="w-full mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 no-print">
        <h1 className="text-lg sm:text-2xl font-bold text-gray-800">
          Batch Details
        </h1>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-1 w-full sm:w-auto">
            <label htmlFor="select-date" className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">Date:</label>
            <input
              id="select-date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="p-1 text-xs sm:text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-32"
            />
          </div>
        
          <button
            onClick={handlePrint}
            className="p-1 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-20"
          >
            Print
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full space-y-4 print:space-y-2">
        {/* Equipment ID and Other Details */}
        <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 print:p-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:gap-2">
            <div className="space-y-1 print:space-y-0">
              <p className="text-xs sm:text-sm"><strong>Equipment ID:</strong> {serialNumber || 'PAC24250046'}</p>
              <p className="text-xs sm:text-sm"><strong>Date:</strong> {selectedDate}</p>
              <p className="text-xs sm:text-sm"><strong>Time Range:</strong> {'timeRange'}</p>
            </div>
            <div className="space-y-1 print:space-y-0">
              <p className="text-xs sm:text-sm"><strong>Production Line:</strong> {'productionLine'}</p>
              <p className="text-xs sm:text-sm"><strong>Shift Details:</strong> {selectedShift}</p>
              <p className="text-xs sm:text-sm"><strong>Target vs. Actual Production:</strong> {'targetVsActual'}</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
  {/* Quality Summary Table */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
  {/* Quality Summary Table - Left Side */}
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-100">
        <tr>
          <th colSpan="4" className="px-4 py-3 text-sm font-semibold text-gray-700 uppercase tracking-wider text-center">
            Batch Quality Summary
          </th>
        </tr>
        <tr>
          {['Batch', 'Good', 'Defective', 'Pass Rate'].map((header) => (
            <th key={header} className="px-4 py-2 text-xs font-medium text-gray-600 uppercase tracking-wider text-center">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {[
          { batch: 'BATCH-001', good: 485, defective: 15, total: 500 },
          { batch: 'BATCH-002', good: 492, defective: 8, total: 500 },
          { batch: 'BATCH-003', good: 478, defective: 22, total: 500 }
        ].map((row) => (
          <tr key={row.batch} className="hover:bg-gray-50">
            <td className="px-4 py-3 text-sm font-medium text-gray-900 text-center">{row.batch}</td>
            <td className="px-4 py-3 text-sm text-green-600 text-center">{row.good}</td>
            <td className="px-4 py-3 text-sm text-red-600 text-center">{row.defective}</td>
            <td className="px-4 py-3 text-sm text-blue-600 font-medium text-center">
              {((row.good/row.total)*100).toFixed(1)}%
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  {/* Stacked Bar Chart - Right Side */}
  <div className="bg-white rounded-lg shadow-md p-4">
    <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">
      Production Quality
    </h2>
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={[
            { name: 'BATCH-001', Good: 485, Defective: 15 },
            { name: 'BATCH-002', Good: 492, Defective: 8 },
            { name: 'BATCH-003', Good: 478, Defective: 22 }
          ]}
          margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip 
            formatter={(value) => [`${value} units`, value > 0 ? 'Good' : 'Defective']}
          />
          <Legend />
          <Bar dataKey="Good" name="Good Units" stackId="a" fill="#10B981" />
          <Bar dataKey="Defective" name="Defective Units" stackId="a" fill="#EF4444" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
</div>
</div>
</div>
</div>
)}