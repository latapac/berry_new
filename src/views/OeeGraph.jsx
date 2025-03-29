import { useEffect, useState, useRef } from 'react';
import { getOeeHistory } from "../backservice";
import { useLocation } from 'react-router';

function OeeGraph() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const serialNumber = queryParams.get('serial_number');
    const [isLoading, setLoading] = useState(true);
    const [oeeHistory, setOeeHistory] = useState([]);
    const [timeRange] = useState(1);

    useEffect(() => {
        getOeeHistory(serialNumber)
            .then((data) => {
                console.log(data);
                setOeeHistory(data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching oee history:", error);
                setLoading(false);
            });
    }, [serialNumber]);

    return (
        <div className="p-4">
            {isLoading ? (
                <div>Loading...</div>
            ) : (
                <OEEGraph
                oeeData={oeeHistory}
                isLoading={isLoading}
                timeRange={timeRange}
                serialNumber={serialNumber}
              />
            )}
        </div>
    );
}

const OEEGraph = ({ oeeData, isLoading}) => {
    const [dataPoints, setDataPoints] = useState([]);
    const [zoomState, setZoomState] = useState({
      scale: 1,
      offset: 0,
      maxOffset: 0
    });
    const svgRef = useRef(null);
    const containerRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 600, height: 200 });
  
    // Update dimensions on resize
    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current) {
                // Calculate 5vw in pixels
                const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
                const vwInPixels = vw * 0.05; // 5vw
                
                setDimensions({
                    width: containerRef.current.clientWidth - vwInPixels,
                    height: 400
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
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6 w-full" ref={containerRef} onClick={()=>navigate("/oeeGraph?serial_number="+serialNumber)}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
          <h3 className="text-sm font-semibold text-gray-600">OEE</h3>
          <div className="flex items-center flex-wrap gap-2">
            <button onClick={() => handleZoom(0.9)} className="p-1 text-gray-600 hover:text-gray-800">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <button onClick={() => handleZoom(1.1)} className="p-1 text-gray-600 hover:text-gray-800">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <button onClick={() => resetZoom()} className="p-1 text-gray-600 hover:text-gray-800 text-xs sm:text-sm">
              Reset
            </button>
          </div>
        </div>
        <svg
          ref={svgRef}
          width="100%"
          height={height + padding}
          viewBox={`0 0 ${width} ${height + padding}`}
          style={{ cursor: zoomState.scale > 1 ? 'grab' : 'default' }}
        >
          {/* Horizontal Grid lines */}
         
  
          {/* Horizontal Grid lines */}
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

export default OeeGraph;
