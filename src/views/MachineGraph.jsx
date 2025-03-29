import { useEffect, useState, useRef } from 'react';
import { getSpeedHistory } from "../backservice";
import { useLocation } from 'react-router';

function MachineGraph() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const serialNumber = queryParams.get('serial_number');
    const [isLoading, setLoading] = useState(true);
    const [speedHistory, setSpeedHistory] = useState([]);
    const [timeRange, setTimeRange] = useState(1);

    useEffect(() => {
        getSpeedHistory(serialNumber)
            .then((data) => {
                console.log(data);
                setSpeedHistory(data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching speed history:", error);
                setLoading(false);
            });
    }, [serialNumber]);

    return (
        <div className="p-4">
            {isLoading ? (
                <div>Loading...</div>
            ) : (
                <MachineSpeedGraph
                    speedData={speedHistory}
                    isLoading={isLoading}
                    timeRange={timeRange}
                    setTimeRange={setTimeRange}
                />
            )}
        </div>
    );
}

const MachineSpeedGraph = ({ speedData, isLoading, timeRange, setTimeRange }) => {
    const [dataPoints, setDataPoints] = useState([]);
    const [zoomState, setZoomState] = useState({
        scale: 1,
        offset: 0,
        maxOffset: 0
    });
    const [hoveredPoint, setHoveredPoint] = useState(null);
    const svgRef = useRef(null);
    const containerRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 600, height: 400 });
    const maxSpeed = 300;

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

    });
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
                    <label className="text-xs sm:text-sm text-gray-600">Time Range:</label>
                    <select
                        value={timeRange}
                        onChange={(e) => setTimeRange(Number(e.target.value))}
                        className="text-xs sm:text-sm text-gray-700 bg-white border border-gray-200 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                        <option value={1}>1 Hour</option>
                        <option value={4}>4 Hours</option>
                        <option value={8}>8 Hours</option>
                        <option value={12}>12 Hours</option>
                    </select>
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

export default MachineGraph;