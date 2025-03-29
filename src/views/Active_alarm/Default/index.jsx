import React, { useState, useEffect, useRef } from 'react';
import { getAuditTrailData } from '../../../backservice';
import { useLocation } from 'react-router';

const getAlarmColor = (severity) => {
  switch (severity) {
    case 'emergency':
      return 'bg-red-100';
    case 'warning':
      return 'bg-yellow-100';
    case 'info':
      return 'bg-blue-100';
    default:
      return 'bg-white';
  }
};

const AlarmTable = ({ alarms, currentPage, itemsPerPage, onPageChange, isMobile }) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAlarms = alarms.slice(startIndex, startIndex + itemsPerPage);

  if (isMobile) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Active Alarms Overview</h2>
        <div className="space-y-2">
          {paginatedAlarms.map((alarm) => (
            <div key={alarm._id} className={`${getAlarmColor(alarm.d?.severity)} p-3 border rounded`}>
              <div className="grid grid-cols-2 gap-1">
                <div>
                  <span className="font-medium">ID: </span>
                  <span className="truncate block">{alarm._id}</span>
                </div>
                <div>
                  <span className="font-medium">Line: </span>
                  <span>{alarm.d?.machineLine || 'N/A'}</span>
                </div>
                <div className="col-span-2">
                  <span className="font-medium">Time: </span>
                  <span>{new Date(alarm.d?.trigger_time).toLocaleString()}</span>
                </div>
                <div className="col-span-2">
                  <span className="font-medium">Desc: </span>
                  <span>{alarm.d?.message || 'N/A'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex flex-col items-center mt-4 text-sm text-gray-700">
          <div className="mb-2">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, alarms.length)} of {alarms.length} entries
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(currentPage - 1, 'active')}
              disabled={currentPage === 1}
              className="p-1 font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-100 w-10 h-6 disabled:opacity-50"
            >
              ←
            </button>
            <span>Page {currentPage} of {Math.ceil(alarms.length / itemsPerPage)}</span>
            <button
              onClick={() => onPageChange(currentPage + 1, 'active')}
              disabled={currentPage === Math.ceil(alarms.length / itemsPerPage)}
              className="p-1 font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-100 w-10 h-6 disabled:opacity-50"
            >
              →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Active Alarms Overview</h2>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="px-2 py-1 text-xs font-medium uppercase tracking-wider border-b">Alarm ID</th>
              <th className="px-2 py-1 text-xs font-medium uppercase tracking-wider border-b">Machine Line</th>
              <th className="px-2 py-1 text-xs font-medium uppercase tracking-wider border-b">Timestamp</th>
              <th className="px-2 py-1 text-xs font-medium uppercase tracking-wider border-b">Description</th>
            </tr>
          </thead>
          <tbody>
            {paginatedAlarms.map((alarm) => (
              <tr
                key={alarm._id}
                className={`${getAlarmColor(alarm.d?.severity)} text-gray-800 hover:bg-gray-50`}
              >
                <td className="px-2 py-2 text-xs border-b truncate max-w-[80px]">{alarm._id}</td>
                <td className="px-2 py-2 text-xs border-b">{alarm.d?.machineLine || 'N/A'}</td>
                <td className="px-2 py-2 text-xs border-b whitespace-nowrap">
                  {new Date(alarm.d?.trigger_time).toLocaleString()}
                </td>
                <td className="px-2 py-2 text-xs border-b">{alarm.d?.message || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4 text-sm text-gray-700">
        <div>
          Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, alarms.length)} of {alarms.length} entries
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(currentPage - 1, 'active')}
            disabled={currentPage === 1}
            className="p-1 font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-100 w-10 h-6 disabled:opacity-50"
          >
            ←
          </button>
          <span>Page {currentPage} of {Math.ceil(alarms.length / itemsPerPage)}</span>
          <button
            onClick={() => onPageChange(currentPage + 1, 'active')}
            disabled={currentPage === Math.ceil(alarms.length / itemsPerPage)}
            className="p-1 font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-100 w-10 h-6 disabled:opacity-50"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
};

const AlarmHistory = ({ history, currentPage, itemsPerPage, onPageChange, isMobile }) => {
  const [filter, setFilter] = useState('');

  const filteredHistory = history.filter(alarm =>
    alarm.d?.message?.toLowerCase().includes(filter.toLowerCase()) ||
    alarm.d?.status?.toLowerCase().includes(filter.toLowerCase())
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedHistory = filteredHistory.slice(startIndex, startIndex + itemsPerPage);

  if (isMobile) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Alarm History</h2>

        <input
          type="text"
          placeholder="Filter alarms..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
        />

        <div className="space-y-2">
          {paginatedHistory.map((alarm) => (
            <div key={alarm._id} className={`${getAlarmColor(alarm.d?.severity)} p-3 border rounded`}>
              <div className="grid grid-cols-2 gap-1">
                <div>
                  <span className="font-medium">ID: </span>
                  <span className="truncate block">{alarm._id}</span>
                </div>
                <div>
                  <span className="font-medium">Status: </span>
                  <span>{alarm.d?.status || 'N/A'}</span>
                </div>
                <div className="col-span-2">
                  <span className="font-medium">Time: </span>
                  <span>{new Date(alarm.d?.trigger_time).toLocaleString()}</span>
                </div>
                <div className="col-span-2">
                  <span className="font-medium">Desc: </span>
                  <span>{alarm.d?.message || 'N/A'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center mt-4 text-sm text-gray-700">
          <div className="mb-2">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredHistory.length)} of {filteredHistory.length} entries
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(currentPage - 1, 'history')}
              disabled={currentPage === 1}
              className="p-1 font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-100 w-10 h-6 disabled:opacity-50"
            >
              ←
            </button>
            <span>Page {currentPage} of {Math.ceil(filteredHistory.length / itemsPerPage)}</span>
            <button
              onClick={() => onPageChange(currentPage + 1, 'history')}
              disabled={currentPage === Math.ceil(filteredHistory.length / itemsPerPage)}
              className="p-1 font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-100 w-10 h-6 disabled:opacity-50"
            >
              →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Alarm History</h2>

      <input
        type="text"
        placeholder="Filter alarms..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
      />

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="px-2 py-1 text-xs font-medium uppercase tracking-wider border-b">ID</th>
              <th className="px-2 py-1 text-xs font-medium uppercase tracking-wider border-b">Timestamp</th>
              <th className="px-2 py-1 text-xs font-medium uppercase tracking-wider border-b">Description</th>
              <th className="px-2 py-1 text-xs font-medium uppercase tracking-wider border-b">Status</th>
            </tr>
          </thead>
          <tbody>
            {paginatedHistory.map((alarm) => (
              <tr
                key={alarm._id}
                className={`${getAlarmColor(alarm.d?.severity)} text-gray-800 hover:bg-gray-50`}
              >
                <td className="px-2 py-2 text-xs border-b truncate max-w-[80px]">{alarm._id}</td>
                <td className="px-2 py-2 text-xs border-b whitespace-nowrap">
                  {new Date(alarm.d?.trigger_time).toLocaleString()}
                </td>
                <td className="px-2 py-2 text-xs border-b">{alarm.d?.message || 'N/A'}</td>
                <td className="px-2 py-2 text-xs border-b">{alarm.d?.status || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4 text-sm text-gray-700">
        <div>
          Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredHistory.length)} of {filteredHistory.length} entries
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(currentPage - 1, 'history')}
            disabled={currentPage === 1}
            className="p-1 font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-100 w-10 h-6 disabled:opacity-50"
          >
            ←
          </button>
          <span>Page {currentPage} of {Math.ceil(filteredHistory.length / itemsPerPage)}</span>
          <button
            onClick={() => onPageChange(currentPage + 1, 'history')}
            disabled={currentPage === Math.ceil(filteredHistory.length / itemsPerPage)}
            className="p-1 font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-100 w-10 h-6 disabled:opacity-50"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [activeAlarms, setActiveAlarms] = useState([]);
  const [alarmHistory, setAlarmHistory] = useState([]);
  const [error, setError] = useState(null);
  const [activeAlarmsPage, setActiveAlarmsPage] = useState(1);
  const [alarmHistoryPage, setAlarmHistoryPage] = useState(1);
  const [activeTab, setActiveTab] = useState('active');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const itemsPerPage = 20;
  const lastFetchTime = useRef(new Date().toISOString());
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const serialNumber = queryParams.get('serial_number');

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAuditTrailData(serialNumber);
        if (!data) {
          throw new Error('No data returned from the API');
        }

        const alarmItems = data.filter(item => 
          item.topic === "alarm" && item.d && item.d.trigger_time
        );

        const unrecoveredAlarms = alarmItems.filter(alarm => alarm.d?.status !== 'recovered');
        const historicalAlarms = alarmItems;

        const sortedActiveAlarms = [...unrecoveredAlarms].sort((a, b) => {
          const dateA = new Date(a.d.trigger_time);
          const dateB = new Date(b.d.trigger_time);
          return dateB - dateA;
        });

        const sortedHistoricalAlarms = [...historicalAlarms].sort((a, b) => {
          const dateA = new Date(a.d.trigger_time);
          const dateB = new Date(b.d.trigger_time);
          return dateB - dateA;
        });

        setActiveAlarms(sortedActiveAlarms);
        setAlarmHistory(sortedHistoricalAlarms);
        lastFetchTime.current = new Date().toISOString();
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data. Please try again later.');
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 4000);
    return () => clearInterval(intervalId);
  }, [serialNumber]);

  const handlePageChange = (newPage, tableType) => {
    if (tableType === 'active') {
      setActiveAlarmsPage(newPage);
    } else if (tableType === 'history') {
      setAlarmHistoryPage(newPage);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-2xl font-bold text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-5">Alarm Monitoring System -
        <span className="text-xl font-bold text-white bg-gray-400 px-2 py-1 rounded">
          {serialNumber}
        </span>
      </h1>

      <div className="flex gap-4 mb-4">
        <button
          onClick={() => handleTabChange('active')}
          className={`px-4 py-2 text-sm font-medium rounded-lg ${
            activeTab === 'active'
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
          }`}
        >
          Active Alarms
        </button>
        <button
          onClick={() => handleTabChange('history')}
          className={`px-4 py-2 text-sm font-medium rounded-lg ${
            activeTab === 'history'
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
          }`}
        >
          Alarm History
        </button>
      </div>

      {activeTab === 'active' && (
        <AlarmTable
          alarms={activeAlarms}
          currentPage={activeAlarmsPage}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          isMobile={isMobile}
        />
      )}
      {activeTab === 'history' && (
        <AlarmHistory
          history={alarmHistory}
          currentPage={alarmHistoryPage}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          isMobile={isMobile}
        />
      )}
    </div>
  );
}

export default App;