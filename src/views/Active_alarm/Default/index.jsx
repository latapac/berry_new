import React, { useState, useEffect } from 'react';

// Alarm component
const AlarmTable = ({ alarms }) => {
  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-400';
      case 'low': return 'bg-green-500';
      default: return 'bg-white';
    }
  };

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
              <th className="px-2 py-1 text-xs font-medium uppercase tracking-wider border-b">Severity</th>
              <th className="px-2 py-1 text-xs font-medium uppercase tracking-wider border-b">Description</th>
            </tr>
          </thead>
          <tbody>
            {alarms.map((alarm) => (
              <tr key={alarm.id} className={`${getSeverityColor(alarm.severity)} text-gray-800 transition-transform hover:-translate-y-0.5`}>
                <td className="px-2 py-3 text-sm">{alarm.id}</td>
                <td className="px-2 py-3 text-sm">{alarm.machineLine}</td>
                <td className="px-2 py-3 text-sm">{new Date(alarm.timestamp).toLocaleString()}</td>
                <td className="px-2 py-3 text-sm">{alarm.severity}</td>
                <td className="px-2 py-3 text-sm">{alarm.description}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mobile Table */}
        <div className="md:hidden">
          {alarms.map((alarm) => (
            <div key={alarm.id} className={`${getSeverityColor(alarm.severity)} text-gray-800 p-4 mb-4 rounded-lg shadow-sm`}>
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium">Alarm ID:</div>
                <div>{alarm.id}</div>
                <div className="font-medium">Machine Line:</div>
                <div>{alarm.machineLine}</div>
                <div className="font-medium">Timestamp:</div>
                <div>{new Date(alarm.timestamp).toLocaleString()}</div>
                <div className="font-medium">Severity:</div>
                <div>{alarm.severity}</div>
                <div className="font-medium">Description:</div>
                <div>{alarm.description}</div>
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
    alarm.description.toLowerCase().includes(filter.toLowerCase()) ||
    alarm.resolution.toLowerCase().includes(filter.toLowerCase())
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
              <tr key={alarm.id} className="hover:bg-gray-100 transition-colors">
                <td className="px-2 py-3 text-sm">{alarm.id}</td>
                <td className="px-2 py-3 text-sm">{new Date(alarm.timestamp).toLocaleString()}</td>
                <td className="px-2 py-3 text-sm">{alarm.description}</td>
                <td className="px-2 py-3 text-sm">{alarm.resolution}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mobile Table */}
        <div className="md:hidden">
          {filteredHistory.map((alarm) => (
            <div key={alarm.id} className="bg-white text-gray-800 p-4 mb-4 rounded-lg shadow-sm">
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium">ID:</div>
                <div>{alarm.id}</div>
                <div className="font-medium">Timestamp:</div>
                <div>{new Date(alarm.timestamp).toLocaleString()}</div>
                <div className="font-medium">Description:</div>
                <div>{alarm.description}</div>
                <div className="font-medium">Resolution Status:</div>
                <div>{alarm.resolution}</div>
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

  // Simulate real-time updates
  useEffect(() => {
    // Mock data - in real app, this would come from an API/WebSocket
    const mockAlarms = [
      { id: 'A001', machineLine: 'L1', timestamp: Date.now(), severity: 'Critical', description: 'Machine Overheat' },
      { id: 'A002', machineLine: 'L2', timestamp: Date.now(), severity: 'Medium', description: 'Low Pressure' },
    ];

    const mockHistory = [
      { id: 'H001', timestamp: Date.now() - 3600000, description: 'Power Failure', resolution: 'Resolved' },
      { id: 'H002', timestamp: Date.now() - 7200000, description: 'Sensor Malfunction', resolution: 'Pending' },
    ];

    setActiveAlarms(mockAlarms);
    setAlarmHistory(mockHistory);

    // Simulate real-time updates
    const interval = setInterval(() => {
      const newAlarm = {
        id: `A${Math.random().toString(36).substr(2, 9)}`,
        machineLine: `L${Math.floor(Math.random() * 5)}`,
        timestamp: Date.now(),
        severity: ['Low', 'Medium', 'High', 'Critical'][Math.floor(Math.random() * 4)],
        description: 'New alarm detected'
      };
      setActiveAlarms(prev => [...prev, newAlarm]);
    }, 10000); // New alarm every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 p-4 md:p-8">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 text-left mb-5">Alarm Monitoring System</h1>
      <AlarmTable alarms={activeAlarms} />
      <AlarmHistory history={alarmHistory} />
    </div>
  );
}

export default App;