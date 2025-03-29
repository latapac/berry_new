import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
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
          <div className="flex items-center gap-1 w-full sm:w-auto">
            <label htmlFor="select-shift" className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">Shift:</label>
            <select
              id="select-shift"
              value={selectedShift}
              onChange={(e) => setSelectedShift(e.target.value)}
              className="p-1 text-xs sm:text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-28"
            >
              <option value="Shift A">Shift A</option>
              <option value="Shift B">Shift B</option>
              <option value="Shift C">Shift C</option>
            </select>
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
              <p className="text-xs sm:text-sm"><strong>Report Date:</strong> {selectedDate}</p>
              <p className="text-xs sm:text-sm"><strong>Time Range:</strong> {'timeRange'}</p>
            </div>
            <div className="space-y-1 print:space-y-0">
              <p className="text-xs sm:text-sm"><strong>Production Line:</strong> {'productionLine'}</p>
              <p className="text-xs sm:text-sm"><strong>Shift Details:</strong> {selectedShift}</p>
              <p className="text-xs sm:text-sm"><strong>Target vs. Actual Production:</strong> {'targetVsActual'}</p>
            </div>
          </div>
        </div>

        {/* Updated Responsive Batch Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th colSpan="6" className="px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 uppercase tracking-wider text-center">
                    Batch Details
                  </th>
                </tr>
                <tr>
                  {['Batch', 'Start', 'End', 'Line', 'Status', 'Units'].map((header) => (
                    <th
                      key={header}
                      className="px-2 py-1 sm:px-3 sm:py-2 text-xs font-medium text-gray-700 uppercase tracking-wider text-center border-b border-gray-200 whitespace-nowrap"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {batchData.map((batch) => (
                  <tr
                    key={batch.batchId}
                    onClick={() => setSelectedBatch(batch.batchId)}
                    className={`hover:bg-gray-50 transition-colors cursor-pointer ${selectedBatch === batch.batchId ? 'bg-blue-50' : ''}`}
                  >
                    <td className="px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm text-center whitespace-nowrap">
                      {batchDetail?.d?.Batch_Number[0] || batch.batchId}
                    </td>
                    <td className="px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm text-center whitespace-nowrap">
                      <span className="hidden sm:inline">{batchDetail?.ts || batch.startTime}</span>
                      <span className="sm:hidden">{batchDetail?.ts?.split(' ')[1] || batch.startTime.split(' ')[1]}</span>
                    </td>
                    <td className="px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm text-center whitespace-nowrap">
                      <span className="hidden sm:inline">{batch.endTime}</span>
                      <span className="sm:hidden">{batch.endTime.split(' ')[1]}</span>
                    </td>
                    <td className="px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm text-center whitespace-nowrap">
                      {batch.machineLineNo.replace('Line ', 'L')}
                    </td>
                    <td className="px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm text-center whitespace-nowrap">
                      <span style={{ color: getStatusColor(batchDetail?.d?.Batch_status[0] || batch.status) }}>
                        {batchDetail?.d?.Batch_status[0] || batch.status}
                      </span>
                    </td>
                    <td className="px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm text-center whitespace-nowrap">
                      {batch.unitsProduced}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Metrics Section */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th colSpan="3" className="px-3 py-2 text-xs sm:text-sm font-medium text-gray-700 uppercase tracking-wider text-center">
                    Production Metrics
                  </th>
                </tr>
                <tr>
                  {['Batch', 'Production', 'Quality'].map((header) => (
                    <th
                      key={header}
                      className="px-3 py-2 text-xs sm:text-sm font-medium text-gray-700 uppercase tracking-wider text-center border-b border-gray-200 whitespace-nowrap"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {metricsData.map((metric) => (
                  <tr key={metric.batchId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 py-2 text-xs sm:text-sm text-center whitespace-nowrap">
                      {metric.batchId}
                    </td>
                    <td className="px-3 py-2 text-xs sm:text-sm text-center whitespace-nowrap">
                      <span className="hidden sm:inline">{metric.targetProduction} vs {metric.actualProduction}</span>
                      <span className="sm:hidden">{metric.actualProduction}/{metric.targetProduction}</span>
                    </td>
                    <td className="px-3 py-2 text-xs sm:text-sm text-center whitespace-nowrap">
                      {metric.qualityMetrics}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Visualizations */}
        <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 print:p-2">
          <h2 className="text-xs sm:text-sm font-medium text-gray-700 uppercase tracking-wider mb-3">
            Batch Performance
          </h2>
          <div className="h-48 sm:h-64 md:h-80 print:h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={batchData}
                margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
              >
                <XAxis 
                  dataKey="machineLineNo" 
                  tick={{ fontSize: 10 }}
                  label={{ value: 'Machine Line', position: 'insideBottom', offset: -5, fontSize: 12 }}
                />
                <YAxis 
                  tick={{ fontSize: 10 }}
                  label={{ value: 'Units', angle: -90, position: 'insideLeft', fontSize: 12 }}
                />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar 
                  dataKey="unitsProduced" 
                  name="Units Produced"
                  fill="#82ca9d" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Timeline */}
        {selectedBatch && (
          <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 print:p-2">
            <h2 className="text-xs sm:text-sm font-medium text-gray-700 uppercase tracking-wider mb-3">
              Batch Progress Timeline
            </h2>
            <div className="space-y-3">
              {batchData
                .filter(b => b.batchId === selectedBatch)
                .map(batch => (
                  <div key={batch.batchId} className="border-l-4 border-blue-500 pl-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div className="text-xs sm:text-sm font-medium">Batch {batch.batchId}</div>
                      <div className="text-xs text-gray-500 mt-1 sm:mt-0">
                        <span className="block sm:inline">Start: {batch.startTime}</span>
                        <span className="hidden sm:inline mx-2">|</span>
                        <span className="block sm:inline">End: {batch.endTime}</span>
                      </div>
                    </div>
                    <div className="text-xs mt-1">
                      Status: <span style={{ color: getStatusColor(batch.status) }}>{batch.status}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Detailed Logs */}
        {selectedBatch && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th colSpan="3" className="px-3 py-2 text-xs sm:text-sm font-medium text-gray-700 uppercase tracking-wider text-center">
                      Detailed Logs for Batch {selectedBatch}
                    </th>
                  </tr>
                  <tr>
                    {['Time', 'Event', 'Details'].map((header) => (
                      <th
                        key={header}
                        className="px-3 py-2 text-xs sm:text-sm font-medium text-gray-700 uppercase tracking-wider text-center border-b border-gray-200 whitespace-nowrap"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 py-2 text-xs sm:text-sm text-center whitespace-nowrap">08:00</td>
                    <td className="px-3 py-2 text-xs sm:text-sm text-center whitespace-nowrap">Batch Started</td>
                    <td className="px-3 py-2 text-xs sm:text-sm text-center">Machine Line 1 initialized</td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 py-2 text-xs sm:text-sm text-center whitespace-nowrap">12:30</td>
                    <td className="px-3 py-2 text-xs sm:text-sm text-center whitespace-nowrap">Quality Check</td>
                    <td className="px-3 py-2 text-xs sm:text-sm text-center">Passed with 98% quality</td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 py-2 text-xs sm:text-sm text-center whitespace-nowrap">16:00</td>
                    <td className="px-3 py-2 text-xs sm:text-sm text-center whitespace-nowrap">Batch Completed</td>
                    <td className="px-3 py-2 text-xs sm:text-sm text-center">500 units produced</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .no-print {
            display: none !important;
          }
          .print-area, .print-area * {
            visibility: visible;
          }
          .print-area {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            padding: 0 !important;
            margin: 0 !important;
          }
          table {
            width: 100%;
            font-size: 9pt;
            border-collapse: collapse;
          }
          th, td {
            padding: 2px 4px !important;
            border: 1px solid #ddd !important;
          }
          th {
            background-color: #f8f8f8 !important;
          }
          .shadow-sm {
            box-shadow: none !important;
          }
          .rounded-lg {
            border-radius: 0 !important;
          }
          .space-y-4 > * + * {
            margin-top: 8px !important;
          }
          .p-2 {
            padding: 4px !important;
          }
          .text-xs {
            font-size: 9pt !important;
          }
          .h-48 {
            height: 192px !important;
          }
        }
        
        @media (max-width: 640px) {
          .table-responsive {
            display: block;
            width: 100%;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
          }
        }
      `}</style>
    </div>
  );
}