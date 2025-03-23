import React, { useState, useEffect, useRef } from 'react';
import { getAuditTrailData } from '../../../backservice';
import { useLocation } from 'react-router';

// Helper function to determine alarm color based on severity
const getAlarmColor = (severity) => {
  switch (severity) {
    case 'emergency':
      return 'bg-red-100'; // Red background for emergency alarms
    case 'warning':
      return 'bg-yellow-100'; // Yellow background for warnings
    case 'info':
      return 'bg-blue-100'; // Blue background for informational alarms
    default:
      return 'bg-white'; // Default background
  }
};

const AlarmTable = ({ alarms, currentPage, itemsPerPage, onPageChange }) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAlarms = alarms.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="bg-gray-200 rounded-lg shadow-lg p-6 mb-8 transition-shadow hover:shadow-xl">
      <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4 relative inline-block">
        Active Alarms Overview
        <span className="absolute bottom-0 left-0 w-1/2 h-1 bg-blue-500 rounded"></span>
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full mt-4 hidden md:table">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="px-2 py-1 text-xs font-medium uppercase tracking-wider border-b">Alarm ID</th>
              <th className="px-2 py-1 text-xs font-medium uppercase tracking-wider border-b">Machine Line</th>
              <th className="px-2 py-1 text-xs font-medium uppercase tracking-wider border-b">Timestamp</th>
              <th className="px-2 py-1 text-xs font-medium uppercase tracking-wider border-b">Description</th>
              <th className="px-2 py-1 text-xs font-medium uppercase tracking-wider border-b">Severity</th>
            </tr>
          </thead>
          <tbody>
            {paginatedAlarms.map((alarm) => (
              <tr
                key={alarm._id}
                className={`${getAlarmColor(alarm.d?.severity)} text-gray-800 transition-transform hover:-translate-y-0.5`}
              >
                <td className="px-2 py-3 text-sm">{alarm._id}</td>
                <td className="px-2 py-3 text-sm">{alarm.d?.machineLine || 'N/A'}</td>
                <td className="px-2 py-3 text-sm">{new Date(alarm.d?.trigger_time).toLocaleString()}</td>
                <td className="px-2 py-3 text-sm">{alarm.d?.message || 'N/A'}</td>
                <td className="px-2 py-3 text-sm">{alarm.d?.severity || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mobile Table */}
        <div className="md:hidden">
          {paginatedAlarms.map((alarm) => (
            <div
              key={alarm._id}
              className={`${getAlarmColor(alarm.d?.severity)} text-gray-800 p-4 mb-4 rounded-lg shadow-sm`}
            >
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium">Alarm ID:</div>
                <div>{alarm._id}</div>
                <div className="font-medium">Machine Line:</div>
                <div>{alarm.d?.machineLine || 'N/A'}</div>
                <div className="font-medium">Timestamp:</div>
                <div>{new Date(alarm.d?.trigger_time).toLocaleString()}</div>
                <div className="font-medium">Description:</div>
                <div>{alarm.d?.message || 'N/A'}</div>
                <div className="font-medium">Severity:</div>
                <div>{alarm.d?.severity || 'N/A'}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Controls for Active Alarms Overview */}
      <div className="flex justify-center mt-4">
        <button
          onClick={() => onPageChange(currentPage - 1, 'active')}
          disabled={currentPage === 1}
          className="px-4 py-2 mx-1 bg-blue-500 text-white rounded-lg disabled:bg-gray-300"
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1, 'active')}
          disabled={currentPage === Math.ceil(alarms.length / itemsPerPage)}
          className="px-4 py-2 mx-1 bg-blue-500 text-white rounded-lg disabled:bg-gray-300"
        >
          Next
        </button>
      </div>
    </div>
  );
};

// History component
const AlarmHistory = ({ history, currentPage, itemsPerPage, onPageChange }) => {
  const [filter, setFilter] = useState('');

  const filteredHistory = history.filter(alarm =>
    alarm.d?.message?.toLowerCase().includes(filter.toLowerCase()) ||
    alarm.d?.status?.toLowerCase().includes(filter.toLowerCase())
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedHistory = filteredHistory.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="bg-gray-200 rounded-lg shadow-lg p-6 mb-8 transition-shadow hover:shadow-xl">
      <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4 relative inline-block">
        Alarm History
        <span className="absolute bottom-0 left-0 w-1/2 h-1 bg-blue-500 rounded"></span>
      </h2>
      <input
        type="text"
        placeholder="Filter alarms..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      />

      {/* Responsive Table */}
      <div className="overflow-x-auto">
        {/* Desktop Table */}
        <table className="w-full mt-4 hidden md:table">
          <thead>
            <tr className="bg-gray-800 text-white uppercase text-sm">
              <th className="px-2 py-3">ID</th>
              <th className="px-2 py-3">Timestamp</th>
              <th className="px-2 py-3">Description</th>
              <th className="px-2 py-3">Resolution Status</th>
              <th className="px-2 py-3">Severity</th>
            </tr>
          </thead>
          <tbody>
            {paginatedHistory.map((alarm) => (
              <tr
                key={alarm._id}
                className={`${getAlarmColor(alarm.d?.severity)} hover:bg-gray-100 transition-colors`}
              >
                <td className="px-2 py-3 text-sm">{alarm._id}</td>
                <td className="px-2 py-3 text-sm">{new Date(alarm.d?.trigger_time).toLocaleString()}</td>
                <td className="px-2 py-3 text-sm">{alarm.d?.message || 'N/A'}</td>
                <td className="px-2 py-3 text-sm">{alarm.d?.status || 'N/A'}</td>
                <td className="px-2 py-3 text-sm">{alarm.d?.severity || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mobile Table */}
        <div className="md:hidden">
          {paginatedHistory.map((alarm) => (
            <div
              key={alarm._id}
              className={`${getAlarmColor(alarm.d?.severity)} text-gray-800 p-4 mb-4 rounded-lg shadow-sm`}
            >
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium">ID:</div>
                <div>{alarm._id}</div>
                <div className="font-medium">Timestamp:</div>
                <div>{new Date(alarm.d?.trigger_time).toLocaleString()}</div>
                <div className="font-medium">Description:</div>
                <div>{alarm.d?.message || 'N/A'}</div>
                <div className="font-medium">Resolution Status:</div>
                <div>{alarm.d?.status || 'N/A'}</div>
                <div className="font-medium">Severity:</div>
                <div>{alarm.d?.severity || 'N/A'}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Controls for Alarm History */}
      <div className="flex justify-center mt-4">
        <button
          onClick={() => onPageChange(currentPage - 1, 'history')}
          disabled={currentPage === 1}
          className="px-4 py-2 mx-1 bg-blue-500 text-white rounded-lg disabled:bg-gray-300"
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1, 'history')}
          disabled={currentPage === Math.ceil(filteredHistory.length / itemsPerPage)}
          className="px-4 py-2 mx-1 bg-blue-500 text-white rounded-lg disabled:bg-gray-300"
        >
          Next
        </button>
      </div>
    </div>
  );
};

// Main App component
function App() {
  const [activeAlarms, setActiveAlarms] = useState([]);
  const [alarmHistory, setAlarmHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeAlarmsPage, setActiveAlarmsPage] = useState(1); // Pagination for Active Alarms
  const [alarmHistoryPage, setAlarmHistoryPage] = useState(1); // Pagination for Alarm History
  const itemsPerPage = 8; // Number of items to display per page
  const lastFetchTime = useRef(new Date().toISOString());
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const serialNumber = queryParams.get('serial_number');

  // Fetch live data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch audit trail data using your API function
        const data = await getAuditTrailData(serialNumber); // Replace with your machine ID
        if (!data) {
          throw new Error('No data returned from the API');
        }

        // Filter alarm items and check data structure
        const alarmItems = data.filter(item => 
          item.topic === "alarm" && item.d && item.d.trigger_time
        );

        // Find new alarms
        const newItems = alarmItems.filter(item => {
          const itemTime = new Date(item.d.trigger_time);
          const lastTime = new Date(lastFetchTime.current);
          return itemTime > lastTime;
        });

        // Sort alarm items
        const sortedData = [...alarmItems].sort((a, b) => {
          const dateA = new Date(a.d.trigger_time);
          const dateB = new Date(b.d.trigger_time);
          return dateB - dateA; // Sort by latest first
        });

        setActiveAlarms(sortedData);
        setAlarmHistory(sortedData); // Use the same data for history (or fetch separately)
        lastFetchTime.current = new Date().toISOString();
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 4000); // Poll every 4 seconds
    return () => clearInterval(intervalId);
  }, []);

  // Handle page change for both tables
  const handlePageChange = (newPage, tableType) => {
    if (tableType === 'active') {
      setActiveAlarmsPage(newPage);
    } else if (tableType === 'history') {
      setAlarmHistoryPage(newPage);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 p-4 md:p-8 flex items-center justify-center">
        <div className="text-2xl font-bold text-gray-800">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 p-4 md:p-8 flex items-center justify-center">
        <div className="text-2xl font-bold text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 p-4 md:p-8">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 text-left mb-5">Alarm Monitoring System</h1>
      <AlarmTable
        alarms={activeAlarms}
        currentPage={activeAlarmsPage}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
      />
      <AlarmHistory
        history={alarmHistory}
        currentPage={alarmHistoryPage}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default App;