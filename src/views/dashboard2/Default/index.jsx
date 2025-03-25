import { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import TotalOrderLineChartCard from './TotalOrderLineChartCard';
import TotalIncomeDarkCard from '../../../ui-component/cards/TotalIncomeDarkCard';
import { getMachineData } from "../../../backservice";
import { gridSpacing } from 'store/constant';
import { useLocation } from 'react-router';
import { useNavigate } from 'react-router';

// Speed Box with a circular dial
const SpeedBox = ({ speed, isLoading, status }) => {
  const [animatedSpeed, setAnimatedSpeed] = useState(0);
  const MAX_SPEED = 300;

  useEffect(() => {
    if (!isLoading && speed !== undefined) {
      const target = Math.min(parseFloat(speed) || 0, MAX_SPEED);
      const interval = setInterval(() => {
        setAnimatedSpeed((prev) => {
          const diff = target - prev;
          if (Math.abs(diff) < 1) {
            clearInterval(interval);
            return target;
          }
          return prev + diff / 20;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [speed, isLoading]);

  const percentage = (animatedSpeed / MAX_SPEED) * 100;

  // Dynamic machine status based on the `status` prop
  const machineStatus = {
    name: status === 'running' ? 'Running' : 'Not Running',
    active: status === 'running',
    color: status === 'running' ? '#22c55e' : '#ef4444',
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 h-[150px] flex flex-col justify-between">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-semibold text-gray-600">Speed</h3>
        <div className="flex items-center text-xs">
          <span
            className={`w-2 h-2 rounded-full mr-1 ${machineStatus.active ? '' : 'opacity-50'}`}
            style={{ backgroundColor: machineStatus.color }}
          ></span>
          <span
            className={`text-xs font-semibold`}
            style={{ color: machineStatus.color }}
          >
            {machineStatus.name}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-left">
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 mr-4">
          <svg className="w-full h-full" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="16" fill="none" stroke="#e5e7eb" strokeWidth="4" />
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="none"
              stroke="#00bcd4"
              strokeWidth="4"
              strokeDasharray={`${percentage * 1.005}, 100.53`}
              transform="rotate(-90 18 18)"
            />
            <circle cx="18" cy="18" r="12" fill="white" />
            <text x="18" y="20" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#1f2937">
              {isLoading ? '-' : animatedSpeed.toFixed(0)}
            </text>
            <text x="18" y="25" textAnchor="middle" fontSize="4" fill="#6b7280">
              ppm
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
};

// Good Production Box
const GoodProductionBox = ({ goodValue, rejectValue, totalValue, isLoading }) => {
  const productionData = [
    { name: 'Good', value: parseFloat(goodValue) || 0, color: '#22c55e' },
    { name: 'Reject', value: parseFloat(rejectValue) || 0, color: '#ef4444' },
  ];

  const total = parseFloat(totalValue) || 1;
  let startAngle = 0;

  const getPieSlicePath = (value, total, startAngle) => {
    const radius = 18;
    const percentage = (value / total) * 100;
    const angle = (percentage / 100) * 360;
    const endAngle = startAngle + angle;

    const startX = radius + radius * Math.cos((Math.PI * startAngle) / 180);
    const startY = radius + radius * Math.sin((Math.PI * startAngle) / 180);
    const endX = radius + radius * Math.cos((Math.PI * endAngle) / 180);
    const endY = radius + radius * Math.sin((Math.PI * endAngle) / 180);

    const largeArcFlag = angle > 180 ? 1 : 0;

    if (value === 0) return '';
    if (value === total) {
      return `M ${radius},${radius} m -${radius},0 a ${radius},${radius} 0 1,0 ${radius * 2},0 a ${radius},${radius} 0 1,0 -${radius * 2},0`;
    }
    return `M ${radius},${radius} L ${startX},${startY} A ${radius},${radius} 0 ${largeArcFlag},1 ${endX},${endY} Z`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 h-[150px] relative">
      <h3 className="text-sm font-semibold text-gray-600 mb-2">Production</h3>
      <div className="flex items-center mt-4">
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 mr-4">
          <svg className="w-full h-full" viewBox="0 0 36 36">
            {productionData.map((item, index) => {
              const path = getPieSlicePath(item.value, total, startAngle);
              startAngle += (item.value / total) * 360;
              return (
                <path key={index} d={path} fill={item.color} stroke="none" />
              );
            })}
          </svg>
        </div>
        <div className="flex-1">
          <div className="space-y-1">
            {productionData.map((item, index) => (
              <div key={index} className="flex items-center text-sm">
                <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></span>
                <span className="text-gray-600">{item.name}: {isLoading ? '-' : item.value.toFixed(0)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// OEE Box with donut chart (Updated)
const OEEBox = ({ availability, performance, quality, isLoading }) => {
  const oeeData = [
    { name: 'Availability', value: parseFloat(availability) || 0, color: '#3b82f6' },
    { name: 'Performance', value: parseFloat(performance) || 0, color: '#10b981' },
    { name: 'Quality', value: parseFloat(quality) || 0, color: '#f59e0b' },
  ];

  const totalOEE = (oeeData[0].value * oeeData[1].value * oeeData[2].value) / 10000;
  const total = 100;
  let startAngle = 0;

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 h-[150px] flex flex-col justify-between">
      <h3 className="text-xs font-semibold text-gray-600">OEE</h3>
      <div className="flex items-center gap-5">
        <div className="relative w-16 h-16 sm:w-20 sm:h-20">
          <svg className="w-full h-full" viewBox="0 0 36 36">
            {oeeData.map((item, index) => {
              const percentage = (item.value / total) * 100;
              const strokeDasharray = `${percentage} ${100 - percentage}`;
              const rotation = startAngle;
              startAngle += percentage * 3.6;
              return (
                <circle
                  key={index}
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  stroke={item.color}
                  strokeWidth="4"
                  strokeDasharray={strokeDasharray}
                  transform={`rotate(${rotation} 18 18)`}
                />
              );
            })}
            <circle cx="18" cy="18" r="12" fill="white" />
            <text
              x="18"
              y="20"
              textAnchor="middle"
              fontSize="6"
              fontWeight="bold"
              fill="#1f2937"
            >
              {isLoading || totalOEE === undefined ? '-' : totalOEE.toFixed(1)}%
            </text>
          </svg>
        </div>
        <div className="flex-1">
          <div className="space-y-2">
            {oeeData.map((item, index) => (
              <div key={index} className="flex items-center text-[10px] sm:text-xs">
                <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: item.color }}></span>
                <span className="text-gray-600">{item.name}: {isLoading ? '-' : item.value.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Total Production Box (Updated)
const TotalProductionBox = ({ value, isLoading }) => {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    if (!isLoading && value !== undefined) {
      const target = parseFloat(value) || 0;
      const interval = setInterval(() => {
        setAnimatedValue((prev) => {
          const diff = target - prev;
          if (Math.abs(diff) < 1) {
            clearInterval(interval);
            return target;
          }
          return prev + diff / 20;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [value, isLoading]);

  const dummyLines = [
    { color: '#f87171', path: 'M0,20 Q10,10 20,20 T40,20 T60,10 T80,20' },
    { color: '#60a5fa', path: 'M0,15 Q10,20 20,15 T40,15 T60,20 T80,15' },
    { color: '#facc15', path: 'M0,18 Q10,15 20,18 T40,18 T60,15 T80,18' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 h-[150px] flex flex-col justify-between">
      <h3 className="text-xs font-semibold text-gray-600">Total Production</h3>
      <div className="text-sm font-bold text-gray-900">
        {isLoading ? '-' : animatedValue.toFixed(0)} units
      </div>
      <div className="space-y-0.5">
        {dummyLines.map((item, index) => (
          <div key={index} className="flex items-center gap-1">
            <svg className="w-12 h-3 sm:w-16 sm:h-4" viewBox="0 0 80 20">
              <path d={item.path} fill="none" stroke={item.color} strokeWidth="1" />
            </svg>
            <span className="text-[10px] sm:text-xs text-gray-500">
              {index === 0 ? '60% / 370°C / 3.3 GHz' : index === 1 ? '54% / 310°C / 3.3 GHz' : '54% / 310°C / 3.3 GHz'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Machine Speed Graph
const MachineSpeedGraph = ({ speedData, isLoading, timeRange, setTimeRange }) => {
  const [dataPoints, setDataPoints] = useState([]);

  useEffect(() => {
    if (!isLoading) {
      const points = [];
      const maxSpeed = 300;
      const intervalMinutes = 15;
      const totalMinutes = timeRange * 60;
      const timePoints = Math.floor(totalMinutes / intervalMinutes);
      const startTime = new Date();
      startTime.setHours(8, 0, 0, 0);

      const baseSpeed = parseFloat(speedData) || 0;
      for (let i = 0; i <= timePoints; i++) {
        const time = new Date(startTime.getTime() + i * intervalMinutes * 60 * 1000);
        const fluctuation = Math.sin(i / 10) * 50 + (Math.random() * 20 - 10);
        const speed = Math.max(0, Math.min(maxSpeed, baseSpeed + fluctuation));
        points.push({ time, speed });
      }
      setDataPoints(points);
    }
  }, [speedData, isLoading, timeRange]);

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const width = 600;
  const height = 200;
  const padding = 15;
  const maxSpeed = 300;
  const xScale = (width - 2 * padding) / (dataPoints.length - 1 || 1);
  const yScale = (height - 2 * padding) / maxSpeed;

  const linePath = dataPoints
    .map((point, index) => {
      const x = padding + index * xScale;
      const y = height - padding - point.speed * yScale;
      return `${index === 0 ? 'M' : 'L'} ${x},${y}`;
    })
    .join(' ');

  const labelInterval = Math.max(1, Math.floor(dataPoints.length / 5));
  const timeLabels = dataPoints.filter((_, index) => index % labelInterval === 0);

  const hourInterval = Math.floor(60 / 15);
  const verticalLines = dataPoints.filter((_, index) => index % hourInterval === 0);

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6 w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold text-gray-600">Machine Speed</h3>
        <div>
          <label className="text-sm text-gray-600 mr-2">Time Range:</label>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(Number(e.target.value))}
            className="text-sm text-gray-700 bg-white border border-gray-200 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={1}>1 Hour</option>
            <option value={4}>4 Hours</option>
            <option value={8}>8 Hours</option>
            <option value={12}>12 Hours</option>
          </select>
        </div>
      </div>
      <svg width="100%" height={height + padding} viewBox={`0 0 ${width} ${height + padding}`}>
        {/* Horizontal Grid lines */}
        {[0, 0.5, 1].map((level, index) => (
          <line
            key={index}
            x1={padding}
            y1={height - padding - level * maxSpeed * yScale}
            x2={width - padding}
            y2={height - padding - level * maxSpeed * yScale}
            stroke="#e5e7eb"
            strokeWidth="1"
          />
        ))}

        {/* Vertical Grid lines at hourly intervals */}
        {verticalLines.map((_, index) => {
          const x = padding + index * hourInterval * xScale;
          return (
            <line
              key={`v-${index}`}
              x1={x}
              y1={padding}
              x2={x}
              y2={height - padding}
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          );
        })}

        {/* Y-axis labels */}
        {[0, 0.5, 1].map((level, index) => (
          <text
            key={index}
            x={padding - 10}
            y={height - padding - level * maxSpeed * yScale + 5}
            textAnchor="end"
            fontSize="10"
            fill="#6b7280"
          >
            {(level * maxSpeed).toFixed(0)}
          </text>
        ))}

        {/* Line */}
        <path
          d={linePath}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
        />

        {/* X-axis labels (time) */}
        {timeLabels.map((point, index) => {
          const x = padding + (index * labelInterval) * xScale;
          return (
            <text
              key={index}
              x={x}
              y={height - padding + 20}
              textAnchor="middle"
              fontSize="10"
              fill="#6b7280"
            >
              {formatTime(point.time)}
            </text>
          );
        })}
      </svg>
    </div>
  );
};

// OEE Graph
const OEEGraph = ({ speedData, isLoading, timeRange }) => {
  const [dataPoints, setDataPoints] = useState([]);

  useEffect(() => {
    if (!isLoading) {
      const points = [];
      const maxSpeed = 300;
      const intervalMinutes = 15;
      const totalMinutes = timeRange * 60;
      const timePoints = Math.floor(totalMinutes / intervalMinutes);
      const startTime = new Date();
      startTime.setHours(8, 0, 0, 0);

      const baseSpeed = parseFloat(speedData) || 0;
      for (let i = 0; i <= timePoints; i++) {
        const time = new Date(startTime.getTime() + i * intervalMinutes * 60 * 1000);
        const fluctuation = Math.sin(i / 10) * 50 + (Math.random() * 20 - 10);
        const speed = Math.max(0, Math.min(maxSpeed, baseSpeed + fluctuation));
        points.push({ time, speed });
      }
      setDataPoints(points);
    }
  }, [speedData, isLoading, timeRange]);

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const width = 600;
  const height = 200;
  const padding = 15;
  const maxSpeed = 300;
  const xScale = (width - 2 * padding) / (dataPoints.length - 1 || 1);
  const yScale = (height - 2 * padding) / maxSpeed;

  const linePath = dataPoints
    .map((point, index) => {
      const x = padding + index * xScale;
      const y = height - padding - point.speed * yScale;
      return `${index === 0 ? 'M' : 'L'} ${x},${y}`;
    })
    .join(' ');

  const labelInterval = Math.max(1, Math.floor(dataPoints.length / 5));
  const timeLabels = dataPoints.filter((_, index) => index % labelInterval === 0);

  const hourInterval = Math.floor(60 / 15);
  const verticalLines = dataPoints.filter((_, index) => index % hourInterval === 0);

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6 w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold text-gray-600">OEE</h3>
      </div>
      <svg width="100%" height={height + padding} viewBox={`0 0 ${width} ${height + padding}`}>
        {/* Horizontal Grid lines */}
        {[0, 0.5, 1].map((level, index) => (
          <line
            key={index}
            x1={padding}
            y1={height - padding - level * maxSpeed * yScale}
            x2={width - padding}
            y2={height - padding - level * maxSpeed * yScale}
            stroke="#e5e7eb"
            strokeWidth="1"
          />
        ))}

        {/* Vertical Grid lines at hourly intervals */}
        {verticalLines.map((_, index) => {
          const x = padding + index * hourInterval * xScale;
          return (
            <line
              key={`v-${index}`}
              x1={x}
              y1={padding}
              x2={x}
              y2={height - padding}
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          );
        })}

        {/* Y-axis labels */}
        {[0, 0.5, 1].map((level, index) => (
          <text
            key={index}
            x={padding - 10}
            y={height - padding - level * maxSpeed * yScale + 5}
            textAnchor="end"
            fontSize="10"
            fill="#6b7280"
          >
            {(level * maxSpeed).toFixed(0)}%
          </text>
        ))}

        {/* Line */}
        <path
          d={linePath}
          fill="none"
          stroke="#10b981"
          strokeWidth="2"
        />

        {/* X-axis labels (time) */}
        {timeLabels.map((point, index) => {
          const x = padding + (index * labelInterval) * xScale;
          return (
            <text
              key={index}
              x={x}
              y={height - padding + 20}
              textAnchor="middle"
              fontSize="10"
              fill="#6b7280"
            >
              {formatTime(point.time)}
            </text>
          );
        })}
      </svg>
    </div>
  );
};

export default function Dashboard() {
  const [isLoading, setLoading] = useState(true);
  const [machineData, setMachineData] = useState({});
  const [timeRange, setTimeRange] = useState(8);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const serialNumber = queryParams.get('serial_number');
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    getMachineData(serialNumber)
      .then((data) => {
        setMachineData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching machine data:", error);
        setLoading(false);
      });
  }, [serialNumber]);

  useEffect(() => {
    const interval = setInterval(() => {
      getMachineData(serialNumber)
        .then((data) => {
          setMachineData(data);
        })
        .catch((error) => {
          console.error("Error polling machine data:", error);
        });
    }, 5000);
    return () => clearInterval(interval);
  }, [serialNumber]);

  const status = machineData?.d?.current_speed[0] > 0 ? 'running' : 'not running';

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="w-full mb-0 flex justify-between items-center no-print">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Dashboard - {' '}
          {serialNumber && (
            <span className="text-sm text-white bg-gray-400 px-2 py-1 rounded">
              {serialNumber}
            </span>
          )}
        </h1>
        <div className="mb-8 flex space-x-2">
          <button
            className="p-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-20 h-6"
            onClick={() => navigate("/oee?serial_number=" + serialNumber)}
          >
            OEE
          </button>
          <button
            className="p-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-20 h-6"
            onClick={() => navigate("/production?serial_number=" + serialNumber)}
          >
            Production
          </button>
          <button
            className="p-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-20 h-6"
            onClick={() => navigate("/batch?serial_number=" + serialNumber)}
          >
            Batch
          </button>
          <button
            className="p-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-20 h-6"
            onClick={() => navigate("/oee?serial_number=" + serialNumber)}
          >
            Report
          </button>
          <button
            className="p-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-20 h-6"
            onClick={() => navigate("/audit?serial_number=" + serialNumber)}
          >
            Audit
          </button>
          <button
            className="p-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-18 h-6"
            onClick={() => navigate("/Active_alarm?serial_number=" + serialNumber)}
          >
            Active Alarm
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <SpeedBox
          speed={machineData?.d?.current_speed[0]}
          isLoading={isLoading}
          status={status}
        />
        <GoodProductionBox
          goodValue={machineData?.d?.Good_Count[0]}
          rejectValue={machineData?.d?.Reject_Counters[0]}
          totalValue={machineData?.d?.Total_Production[0]}
          isLoading={isLoading}
        />
        <OEEBox
          availability={machineData?.d?.Availability?.[0]}
          performance={machineData?.d?.Performance?.[0]}
          quality={machineData?.d?.Quality?.[0]}
          isLoading={isLoading}
        />
        <TotalProductionBox
          value={machineData?.d?.Total_Production[0]}
          isLoading={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <MachineSpeedGraph
          speedData={machineData?.d?.current_speed[0]}
          isLoading={isLoading}
          timeRange={timeRange}
          setTimeRange={setTimeRange}
        />
        <OEEGraph
          speedData={machineData?.d?.current_speed[0]} // Pass speed data to OEE graph
          isLoading={isLoading}
          timeRange={timeRange}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <SpeedBox
          speed={machineData?.d?.current_speed[0]}
          isLoading={isLoading}
          status={status}
        />
        <GoodProductionBox
          goodValue={machineData?.d?.Good_Count[0]}
          rejectValue={machineData?.d?.Reject_Counters[0]}
          totalValue={machineData?.d?.Total_Production[0]}
          isLoading={isLoading}
        />
        <OEEBox
          availability={machineData?.d?.Availability?.[0]}
          performance={machineData?.d?.Performance?.[0]}
          quality={machineData?.d?.Quality?.[0]}
          isLoading={isLoading}
        />
        <TotalProductionBox
          value={machineData?.d?.Total_Production[0]}
          isLoading={isLoading}
        />
      </div>

      <Grid container spacing={gridSpacing}>
        <Grid item lg={2.65} md={6} sm={6} xs={12}>
          <TotalOrderLineChartCard
            isLoading={isLoading}
            Count={machineData?.d?.Good_Count[0] || '-'}
            name="Good Production"
          />
        </Grid>
        <Grid item lg={2.65} md={6} sm={6} xs={12}>
          <TotalOrderLineChartCard
            isLoading={isLoading}
            Count={machineData?.d?.Reject_Counters[0] || '-'}
            name="Bad Production"
          />
        </Grid>
        <Grid item lg={2.65} md={6} sm={6} xs={12}>
          <TotalOrderLineChartCard
            isLoading={isLoading}
            Count={machineData?.d?.Total_Production[0] || '-'}
            name="Total Production"
          />
        </Grid>
        <Grid item lg={4} md={12} sm={12} xs={12}>
          <Grid container spacing={gridSpacing}>
            <Grid item sm={6} xs={12} md={6} lg={12}>
              <TotalIncomeDarkCard
                isLoading={isLoading}
                data={serialNumber}
                Speed={machineData?.d?.current_speed[0]}
              />
            </Grid>
            <Grid item sm={6} xs={12} md={6} lg={12}>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}