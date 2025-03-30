import { useEffect, useState, useRef } from 'react';
import Grid from '@mui/material/Grid';
import TotalOrderLineChartCard from './TotalOrderLineChartCard';
import TotalIncomeDarkCard from '../../../ui-component/cards/TotalIncomeDarkCard';
import { getMachineData, getSpeedHistory, getOeeHistory } from "../../../backservice";
import { gridSpacing } from 'store/constant';
import { useLocation, useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';


import { mstatus, getMstatusBGColor } from '../../../constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
const SpeedBox = ({ speed, isLoading, status, mstatus }) => {

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
    <div className="bg-white rounded-lg shadow-sm p-4 h-full min-h-[150px] flex flex-col justify-between">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-semibold text-gray-600">Speed</h3>
        <div className="flex  items-center text-xs">

          <span
            className={`w-2 h-2 rounded-full mr-1 ${machineStatus.active ? '' : 'opacity-50'}`}
            style={{ backgroundColor: machineStatus.color }}
          ></span>
          <span
            className="text-xs font-semibold"
            style={{ color: machineStatus.color }}
          >
            {machineStatus.name}
          </span>
        </div>
      </div>
      <div className="flex gap-32 items-center justify-left">
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
        <div className={`${getMstatusBGColor(mstatus)} text-[1.1rem] font-extrabold`}>
          {mstatus}
        </div>
      </div>
    </div>
  );
};

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
    <div className="bg-white rounded-lg shadow-sm p-4 h-full min-h-[150px] flex flex-col justify-between">
      <h3 className="text-sm font-semibold text-gray-600 mb-2">Production</h3>
      <div className="flex items-center mt-2">
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
    <div className="bg-white rounded-lg shadow-sm p-4 h-full min-h-[150px] flex flex-col justify-between">
      <h3 className="text-xs font-semibold text-gray-600">OEE</h3>
      <div className="flex items-center gap-2 sm:gap-5">
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
          <div className="space-y-1 sm:space-y-2">
            {oeeData.map((item, index) => (
              <div key={index} className="flex items-center text-[10px] sm:text-xs">
                <span className="w-2 h-2 rounded-full mr-1 sm:mr-2" style={{ backgroundColor: item.color }}></span>
                <span className="text-gray-600">{item.name}: {isLoading ? '-' : item.value.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};



const TotalProductionBox = ({ value, isLoading }) => {
  // Sample data - replace with your actual data
  const data = [
    { name: ' Shift 1', value: 20 },
    { name: 'Shift 2', value: 45 },
    { name: 'Shift 3', value: 28 },
  
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 h-full min-h-[150px] flex flex-col justify-between">
      <div className='flex flex-row'>
        <h3 className="text-xs font-semibold text-gray-600">Total Production</h3>
        <h3 className='ml-[10vh] text-xs font-bold'>Yesterday</h3>
      </div>
      
      <div className="h-[120px] mt-2">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            Loading...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10 }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10 }}
                width={20}
              />
              <Tooltip />
              <Bar 
                dataKey="value" 
                fill="#8884d8" 
                radius={[3, 3, 0, 0]}
                barSize={22}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};



const MachineSpeedGraph = ({ speedData, isLoading, timeRange, setTimeRange, serialNumber }) => {
  const navigate = useNavigate();
  const [dataPoints, setDataPoints] = useState([]);
  const [zoomState, setZoomState] = useState({
    scale: 1,
    offset: 0,
    maxOffset: 0
  });
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 100 });

  // Update dimensions on resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        // Calculate 5vw in pixels
        const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
        const vwInPixels = vw * 0.05; // 5vw

        setDimensions({
          width: containerRef.current.clientWidth - vwInPixels,
          height: 200
        });
      }
    };


    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isLoading && speedData && speedData.length > 0) {
      const points = speedData.map(item => ({
        time: new Date(item.ts),
        speed: item.speed
      }));
      setDataPoints(points);

      // Calculate max offset based on data length
      const maxOffset = dimensions.width * 0.8;
      setZoomState(prev => ({ ...prev, maxOffset }));
    }
  }, [speedData, isLoading, dimensions.width]);

  const handleZoom = (factor) => {
    const newScale = Math.max(0.5, Math.min(5, zoomState.scale * factor));
    setZoomState(prev => ({
      ...prev,
      scale: newScale,
      offset: Math.min(0, Math.max(prev.maxOffset * (1 - newScale), prev.offset))
    }));
  };

  const resetZoom = () => {
    setZoomState({
      scale: 1,
      offset: 0,
      maxOffset: zoomState.maxOffset
    });
  };

  const handleMouseMove = (e) => {
    if (!svgRef.current) return;

    const svgRect = svgRef.current.getBoundingClientRect();
    const mouseX = e.clientX - svgRect.left - zoomState.offset;
    const mouseY = e.clientY - svgRect.top;

    const { width, height } = dimensions;
    const padding = 15;
    const maxSpeed = 300;
    const yScale = (height - 2 * padding) / maxSpeed;

    // Find the closest data point
    let closestPoint = null;
    let minDistance = Infinity;

    dataPoints.forEach((point, index) => {
      const x = padding + index * ((width - 2 * padding) / (dataPoints.length - 1)) * zoomState.scale;
      const y = height - padding - point.speed * yScale;

      const distance = Math.sqrt(Math.pow(x - mouseX, 2) + Math.pow(y - mouseY, 2));

      if (distance < minDistance && distance < 20) {
        minDistance = distance;
        closestPoint = {
          ...point,
          x,
          y,
          index
        };
      }
    });

    setHoveredPoint(closestPoint);
  };

  const handleMouseLeave = () => {
    setHoveredPoint(null);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const { width, height } = dimensions;
  const padding = 15;
  const maxSpeed = 300;

  // Calculate visible range
  const visibleWidth = width / zoomState.scale;
  const visibleStart = Math.max(0, -zoomState.offset / zoomState.scale);
  const visibleEnd = Math.min(width, visibleStart + visibleWidth);

  // Filter data points to only render what's visible
  const visibleDataPoints = dataPoints.filter((_, index) => {
    const x = padding + index * (width - 2 * padding) / (dataPoints.length - 1);
    return x >= visibleStart && x <= visibleEnd;
  });

  // Calculate scales
  const xScale = visibleDataPoints.length > 1
    ? (width - 2 * padding) / (visibleDataPoints.length - 1)
    : 0;
  const yScale = (height - 2 * padding) / maxSpeed;

  const linePath = visibleDataPoints
    .map((point, index) => {
      const x = padding + index * xScale * zoomState.scale + zoomState.offset;
      const y = height - padding - point.speed * yScale;
      return `${index === 0 ? 'M' : 'L'} ${x},${y}`;
    })
    .join(' ');

  // Dynamic label interval based on available space and zoom level
  const minLabelSpacing = 80;
  const labelInterval = Math.max(1, Math.floor((minLabelSpacing * zoomState.scale) / xScale));

  // Calculate time labels based on zoom scale and spacing
  const timeLabels = [];
  let lastLabelTime = visibleDataPoints[0]?.time;

  for (let i = 0; i < visibleDataPoints.length; i++) {
    const currentTime = visibleDataPoints[i].time;
    const timeDiff = (currentTime - lastLabelTime) / 1000;

    if (timeDiff >= 5 || i === 0 || i === visibleDataPoints.length - 1) {
      timeLabels.push(visibleDataPoints[i]);
      lastLabelTime = currentTime;
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6 w-full" ref={containerRef}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <h3 className="text-sm font-semibold text-gray-600">Machine Speed</h3>
        <div className="flex items-center flex-wrap gap-2">
          <div>
            <button className='text-blue-600 underline hover:cursor-pointer' onClick={() => navigate("/machineGraph?serial_number=" + serialNumber)}>
              More Details  {'>>'}
            </button>
          </div>
        </div>
      </div>
      <svg
        ref={svgRef}
        width="100%"
        height={height + padding}
        viewBox={`0 0 ${width} ${height + padding}`}
        style={{ cursor: zoomState.scale > 1 ? 'grab' : 'default' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Horizontal Grid lines */}
        {[0, 100, 200, 300].map((level) => {
          const yPos = height - padding - (level / maxSpeed) * (height - 2 * padding);
          return (
            <line
              key={`h-line-${level}`}
              x1={padding + zoomState.offset}
              y1={yPos}
              x2={width - padding + zoomState.offset}
              y2={yPos}
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          );
        })}

        {/* Y-axis labels */}
        {[0, 100, 200, 300].map((level) => {
          const yPos = height - padding - (level / maxSpeed) * (height - 2 * padding);
          return (
            <text
              key={`y-label-${level}`}
              x={padding - 10 + zoomState.offset}
              y={yPos + 5}  // +5 to center the text vertically on the line
              textAnchor="end"
              fontSize="10"
              fill="#6b7280"
            >
              {level}
            </text>
          );
        })}


        {/* Line Path */}
        <path d={linePath} fill="none" stroke="#3b82f6" strokeWidth="2" />

        {/* Data points (small circles) */}
        {visibleDataPoints.map((point, index) => {
          const x = padding + index * xScale * zoomState.scale + zoomState.offset;
          const y = height - padding - point.speed * yScale;
          return (
            <circle
              key={`point-${index}`}
              cx={x}
              cy={y}
              r={hoveredPoint?.index === index ? 4 : 2}
              fill={hoveredPoint?.index === index ? "#3b82f6" : "#3b82f6"}
              opacity={hoveredPoint?.index === index ? 1 : 0.7}
            />
          );
        })}

        {/* Time Labels */}
        {timeLabels.map((point, index) => {
          const x = padding + index * labelInterval * xScale * zoomState.scale + zoomState.offset;
          return (
            <text key={`time-label-${index}`} x={x} y={height - padding + 20} textAnchor="middle" fontSize="10" fill="#6b7280">
              {formatTime(point.time)}
            </text>
          );
        })}

        {/* Hover tooltip */}
        {hoveredPoint && (
          <g>
            {/* Vertical line at hovered point */}
            <line
              x1={hoveredPoint.x + zoomState.offset}
              y1={padding}
              x2={hoveredPoint.x + zoomState.offset}
              y2={height - padding}
              stroke="#94a3b8"
              strokeWidth="1"
              strokeDasharray="2,2"
            />

            {/* Tooltip background */}
            <rect
              x={hoveredPoint.x + zoomState.offset + 10}
              y={hoveredPoint.y - 30}
              width={120}
              height={40}
              fill="white"
              stroke="#e2e8f0"
              rx="4"
              ry="4"
            />

            {/* Tooltip text */}
            <text
              x={hoveredPoint.x + zoomState.offset + 15}
              y={hoveredPoint.y - 15}
              fontSize="10"
              fill="#334155"
            >
              {formatTime(hoveredPoint.time)}
            </text>
            <text
              x={hoveredPoint.x + zoomState.offset + 15}
              y={hoveredPoint.y - 5}
              fontSize="10"
              fill="#334155"
            >
              Speed: {hoveredPoint.speed.toFixed(0)} ppm
            </text>

            {/* Circle highlight on hovered point */}
            <circle
              cx={hoveredPoint.x + zoomState.offset}
              cy={hoveredPoint.y}
              r="6"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
            />
          </g>
        )}
      </svg>
    </div>
  );
};

const OEEGraph = ({ oeeData, isLoading, serialNumber }) => {
  const [dataPoints, setDataPoints] = useState([]);
  const navigate = useNavigate()
  const [zoomState, setZoomState] = useState({
    scale: 1,
    offset: 0,
    maxOffset: 0
  });
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 100 });

  // Update dimensions on resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        // Calculate 5vw in pixels
        const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
        const vwInPixels = vw * 0.05; // 5vw

        setDimensions({
          width: containerRef.current.clientWidth - vwInPixels,
          height: 200
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isLoading && oeeData && oeeData.length > 0) {
      const points = oeeData.map(item => ({
        time: new Date(item.ts),
        oee: item.oee
      }));
      setDataPoints(points);

      // Calculate max offset based on data length
      const maxOffset = dimensions.width * 0.8;
      setZoomState(prev => ({ ...prev, maxOffset }));
    }
  }, [oeeData, isLoading, dimensions.width]);

  const handleZoom = (factor) => {
    const newScale = Math.max(0.5, Math.min(5, zoomState.scale * factor));
    setZoomState(prev => ({
      ...prev,
      scale: newScale,
      offset: Math.min(0, Math.max(prev.maxOffset * (1 - newScale), prev.offset))
    }));
  };

  const resetZoom = () => {
    setZoomState({
      scale: 1,
      offset: 0,
      maxOffset: zoomState.maxOffset
    });
  };

  const formatTime = (date) => {
    if (zoomState.scale > 3) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const { width, height } = dimensions;
  const padding = 15;
  const maxOEE = 300;

  const xScale = dataPoints.length > 1
    ? (width - 2 * padding) / (dataPoints.length - 1)
    : 0;
  const yScale = (height - 2 * padding) / maxOEE;

  const linePath = dataPoints
    .map((point, index) => {
      const x = padding + index * xScale * zoomState.scale + zoomState.offset;
      const y = height - padding - point.oee * yScale;
      return `${index === 0 ? 'M' : 'L'} ${x},${y}`;
    })
    .join(' ');

  // Dynamic label interval based on zoom level and available space
  const minLabelSpacing = 80;
  const labelInterval = Math.max(1, Math.floor((minLabelSpacing * zoomState.scale) / xScale));

  const timeLabels = [];
  let lastLabelTime = dataPoints[0]?.time;

  for (let i = 0; i < dataPoints.length; i++) {
    const currentTime = dataPoints[i].time;
    const timeDiff = (currentTime - lastLabelTime) / 1000;

    if (timeDiff >= 5 || i === 0 || i === dataPoints.length - 1) {
      timeLabels.push(dataPoints[i]);
      lastLabelTime = currentTime;
    }
  }

  // Calculate vertical grid lines based on time interval
  const hourInterval = dataPoints.length > 1
    ? Math.floor(60 / ((new Date(dataPoints[1].time) - new Date(dataPoints[0].time)) / (1000 * 60)))
    : 0;

  const verticalLines = dataPoints.filter((_, index) => index % hourInterval === 0);

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6 w-full" ref={containerRef}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <h3 className="text-sm font-semibold text-gray-600">OEE</h3>
        <div className="flex items-center flex-wrap gap-2">
          <div>
            <button className='text-blue-600 underline hover:cursor-pointer'  onClick={() => navigate("/oeeGraph?serial_number=" + serialNumber)}>
              More Details  {'>>'}
            </button>
          </div>
        </div>
      </div>
      <svg
        ref={svgRef}
        width="100%"
        height={height + padding}
        viewBox={`0 0 ${width} ${height + padding}`}
        style={{ cursor: zoomState.scale > 1 ? 'grab' : 'default' }}
      >
        {[0, 100, 200, 300].map((level) => {
          const yPos = height - padding - (level / maxOEE) * (height - 2 * padding);
          return (
            <line
              key={`h-line-${level}`}
              x1={padding + zoomState.offset}
              y1={yPos}
              x2={width - padding + zoomState.offset}
              y2={yPos}
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          );
        })}

        {/* Y-axis labels */}
        {[0, 100, 200, 300].map((level) => {
          const yPos = height - padding - (level / maxOEE) * (height - 2 * padding);
          return (
            <text
              key={`y-label-${level}`}
              x={padding - 10 + zoomState.offset}
              y={yPos + 5}  // +5 to center the text vertically on the line
              textAnchor="end"
              fontSize="10"
              fill="#6b7280"
            >
              {level}
            </text>
          );
        })}
        {/* Line Path */}
        <path
          d={linePath}
          fill="none"
          stroke="#10b981"
          strokeWidth="2"
        />

        {/* Time Labels */}
        {timeLabels.map((point, index) => {
          const x = padding + (index * labelInterval) * xScale * zoomState.scale + zoomState.offset;
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
  const [speedHistory, setSpeedHistory] = useState([])
  const [OeeHistory, setOeeHistory] = useState([])
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const serialNumber = queryParams.get('serial_number');
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const dataChange = (tp) => {
    if (!tp) return false;
    const date = new Date(tp);
    const currentTime = new Date();
    return (currentTime - date) <= 60000;
  };

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
    getSpeedHistory(serialNumber)
      .then((data) => {
        console.log(data);
        setSpeedHistory(data)
      })
    getOeeHistory(serialNumber)
      .then((data) => {
        setOeeHistory(data)
      })
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

  const isOnline = dataChange(machineData?.ts);
  const status = machineData?.d?.current_speed[0] > 0 ? 'running' : 'not running';
  const statusText = !isOnline ? 'Offline' : (mstatus[machineData?.d?.status[0]] || 'Unknown');

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="w-full mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 no-print">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
          Dashboard - {' '}
          {serialNumber && (
            <span className="text-xs sm:text-sm text-white bg-gray-400 px-2 py-1 rounded">
              {serialNumber}
            </span>
          )}
        </h1>
        <div className="flex flex-wrap gap-2">
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
          <div className="relative inline-block text-left">
            <button
              className="p-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-20 h-6"
              onClick={() => setIsOpen(!isOpen)}
            >
              Report
            </button>

            {isOpen && (
              <div
                className="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"
                onMouseLeave={() => setIsOpen(false)}
              >
                <div className="py-1">
                  <button
                    onClick={() => {
                      navigate("/alarm?serial_number=" + serialNumber);
                      setIsOpen(false);
                    }}
                    className="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-400 w-full text-left"
                  >
                    Alarm Report
                  </button>
                  <button
                    onClick={() => {
                      navigate("/audit?serial_number=" + serialNumber);
                      setIsOpen(false);
                    }}
                    className="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-400 w-full text-left"
                  >
                    Audit Report
                  </button>
                  <button
                    onClick={() => {
                      navigate("/batch?serial_number=" + serialNumber);
                      setIsOpen(false);
                    }}
                    className="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-400 w-full text-left"
                  >
                    Batch Report
                  </button>
                  <button
                    onClick={() => {
                      navigate("/OEE_graph?serial_number=" + serialNumber);
                      setIsOpen(false);
                    }}
                    className="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-400 w-full text-left"
                  >
                    OEE Graph
                  </button>
                </div>
              </div>
            )}
          </div>
          <button
            className="p-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-20 h-6"
            onClick={() => navigate("/audit?serial_number=" + serialNumber)}
          >
            Audit
          </button>
          <button
            className="p-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-20 h-6"
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
          mstatus={statusText}
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
          speedData={speedHistory}
          isLoading={isLoading}
          timeRange={timeRange}
          setTimeRange={setTimeRange}
          serialNumber={serialNumber}
        />
        <OEEGraph
          oeeData={OeeHistory}
          isLoading={isLoading}
          timeRange={timeRange}
          serialNumber={serialNumber}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <SpeedBox
          speed={machineData?.d?.current_speed[0]}
          isLoading={isLoading}
          status={status}
          mstatus={statusText}
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