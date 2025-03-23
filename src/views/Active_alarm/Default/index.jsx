import React, { useState, useEffect, useRef } from 'react';
import { getAuditTrailData } from '../../../backservice';// Import your API function

// Alarm component
const AlarmTable = ({ alarms }) => {
  return (
    <div className="bg-gray-200 rounded-lg shadow-lg p-6 mb-8 transition-shadow hover:shadow-xl">
      <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4 relative inline-block">
        Active Alarms Overview
        <span className="absolute bottom-0 left-0 w-1/2 h-1 bg-blue-500 rounded"></span>
      </h2>

      {/* Responsive Table */}
      <div className="overflow-x-auto">
        {/* Desktop Table */}
        <table className="w-full mt-4 hidden md:table">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="px-2 py-1 text-xs font-medium uppercase tracking-wider border-b">Alarm ID</th>
              <th className="px-2 py-1 text-xs font-medium uppercase tracking-wider border-b">Machine Line</th>
              <th className="px-2 py-1 text-xs font-medium uppercase tracking-wider border-b">Timestamp</th>
              <th className="px-2 py-1 text-xs font-medium uppercase tracking-wider border-b">Description</th>
            </tr>
          </thead>
          <tbody>
            {alarms.map((alarm) => (
              <tr key={alarm._id} className="bg-white text-gray-800 transition-transform hover:-translate-y-0.5">
                <td className="px-2 py-3 text-sm">{alarm._id}</td>
                <td className="px-2 py-3 text-sm">{alarm.d?.machineLine || 'N/A'}</td>
                <td className="px-2 py-3 text-sm">{new Date(alarm.d?.trigger_time).toLocaleString()}</td>
                <td className="px-2 py-3 text-sm">{alarm.d?.message || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mobile Table */}
        <div className="md:hidden">
          {alarms.map((alarm) => (
            <div key={alarm._id} className="bg-white text-gray-800 p-4 mb-4 rounded-lg shadow-sm">
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium">Alarm ID:</div>
                <div>{alarm._id}</div>
                <div className="font-medium">Machine Line:</div>
                <div>{alarm.d?.machineLine || 'N/A'}</div>
                <div className="font-medium">Timestamp:</div>
                <div>{new Date(alarm.d?.trigger_time).toLocaleString()}</div>
                <div className="font-medium">Description:</div>
                <div>{alarm.d?.message || 'N/A'}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// History component
const AlarmHistory = ({ history }) => {
  const [filter, setFilter] = useState('');

  const filteredHistory = history.filter(alarm =>
    alarm.d?.message?.toLowerCase().includes(filter.toLowerCase()) ||
    alarm.d?.status?.toLowerCase().includes(filter.toLowerCase())
  );

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
            </tr>
          </thead>
          <tbody>
            {filteredHistory.map((alarm) => (
              <tr key={alarm._id} className="hover:bg-gray-100 transition-colors">
                <td className="px-2 py-3 text-sm">{alarm._id}</td>
                <td className="px-2 py-3 text-sm">{new Date(alarm.d?.trigger_time).toLocaleString()}</td>
                <td className="px-2 py-3 text-sm">{alarm.d?.message || 'N/A'}</td>
                <td className="px-2 py-3 text-sm">{alarm.d?.status || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mobile Table */}
        <div className="md:hidden">
          {filteredHistory.map((alarm) => (
            <div key={alarm._id} className="bg-white text-gray-800 p-4 mb-4 rounded-lg shadow-sm">
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium">ID:</div>
                <div>{alarm._id}</div>
                <div className="font-medium">Timestamp:</div>
                <div>{new Date(alarm.d?.trigger_time).toLocaleString()}</div>
                <div className="font-medium">Description:</div>
                <div>{alarm.d?.message || 'N/A'}</div>
                <div className="font-medium">Resolution Status:</div>
                <div>{alarm.d?.status || 'N/A'}</div>
              </div>
            </div>
          ))}
        </div>
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
  const lastFetchTime = useRef(new Date().toISOString());

  // Fetch live data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch audit trail data using your API function
        const data = await getAuditTrailData('YOUR_MACHINE_ID'); // Replace with your machine ID
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
      <AlarmTable alarms={activeAlarms} />
      <AlarmHistory history={alarmHistory} />
    </div>
  );
}

export default App;