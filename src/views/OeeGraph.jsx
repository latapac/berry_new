import { useEffect, useState, useRef } from 'react';
import { getOeeHistory } from "../backservice";
import { useLocation, useNavigate } from 'react-router';

function OeeGraph() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const serialNumber = queryParams.get('serial_number');
    const [isLoading, setLoading] = useState(true);
    const [oeeHistory, setOeeHistory] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        getOeeHistory(serialNumber)
            .then((data) => {
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
                    serialNumber={serialNumber}
                    navigate={navigate}
                />
            )}
        </div>
    );
}

const OEEGraph = ({ oeeData, isLoading, serialNumber, navigate }) => {
    const [dataPoints, setDataPoints] = useState([]);
    const [zoomState, setZoomState] = useState({
        scale: 1,
        offset: 0,
        maxOffset: 0
    });
    const [pinchState, setPinchState] = useState({
        initialDistance: null,
        initialScale: 1,
    });
    const [panState, setPanState] = useState({
        isPanning: false,
        startX: 0,
        initialOffset: 0
    });
    
    const containerRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 600, height: 200 });
    const padding = 15;

    // Update dimensions on resize
    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current) {
                setDimensions({
                    width: containerRef.current.clientWidth,
                    height: 400
                });
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (!isLoading && oeeData?.length > 0) {
            const points = oeeData.map((item, index) => ({
                time: new Date(item.ts),
                oee: item.oee,
                index: index
            }));
            setDataPoints(points);
            setZoomState(prev => ({
                ...prev,
                maxOffset: dimensions.width * (1 - prev.scale)
            }));
        }
    }, [oeeData, isLoading, dimensions.width]);

    // Pinch zoom handlers
    const handleTouchStart = (e) => {
        if (e.touches.length === 2) {
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            const distance = Math.hypot(
                touch2.clientX - touch1.clientX,
                touch2.clientY - touch1.clientY
            );
            setPinchState({
                initialDistance: distance,
                initialScale: zoomState.scale,
            });
        } else if (e.touches.length === 1) {
            handleMouseDown(e);
        }
    };

    const handleTouchMove = (e) => {
        if (e.touches.length === 2) {
            e.preventDefault();
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            const newDistance = Math.hypot(
                touch2.clientX - touch1.clientX,
                touch2.clientY - touch1.clientY
            );
            
            if (pinchState.initialDistance) {
                const scaleFactor = newDistance / pinchState.initialDistance;
                const newScale = Math.max(0.5, Math.min(5, pinchState.initialScale * scaleFactor));

                // Calculate focal point
                const containerRect = containerRef.current.getBoundingClientRect();
                const focalClientX = ((touch1.clientX + touch2.clientX) / 2) - containerRect.left;

                // Calculate new offset
                const oldScale = pinchState.initialScale;
                const oldOffset = zoomState.offset;
                const newOffsetUnclamped = (oldOffset - (focalClientX - padding) * (newScale / oldScale - 1));

                // Clamp offset
                const minOffset = dimensions.width * (1 - newScale);
                const clampedOffset = Math.min(0, Math.max(minOffset, newOffsetUnclamped));

                setZoomState(prev => ({
                    ...prev,
                    scale: newScale,
                    offset: clampedOffset,
                    maxOffset: minOffset
                }));
            }
        }
    };

    // Pan handlers
    const handleMouseDown = (e) => {
        setPanState({
            isPanning: true,
            startX: e.clientX || e.touches[0].clientX,
            initialOffset: zoomState.offset
        });
    };

    const handleMouseMove = (e) => {
        if (panState.isPanning) {
            e.preventDefault();
            const clientX = e.clientX || (e.touches[0]?.clientX);
            if (clientX === undefined) return;
            
            const deltaX = clientX - panState.startX;
            const newOffset = panState.initialOffset + deltaX;
            
            setZoomState(prev => ({
                ...prev,
                offset: Math.min(0, Math.max(prev.maxOffset, newOffset))
            }));
        }
    };

    const handleMouseUp = () => {
        setPanState({ isPanning: false, startX: 0, initialOffset: 0 });
    };

    const handleWheel = (e) => {
      if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
          handleZoom(zoomFactor);
      }
  };

    // Zoom controls
    const handleZoom = (factor) => {
        const newScale = Math.max(0.5, Math.min(5, zoomState.scale * factor));
        setZoomState(prev => ({
            ...prev,
            scale: newScale,
            offset: Math.min(0, Math.max(prev.maxOffset * (1 - newScale), prev.offset)),
            maxOffset: dimensions.width * (1 - newScale)
        }));
    };

    const resetZoom = () => {
        setZoomState({
            scale: 1,
            offset: 0,
            maxOffset: 0
        });
    };

    // Rendering helpers
    const formatTime = (date) => {
        return zoomState.scale > 3 
            ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };

    const { width, height } = dimensions;
    const maxOEE = 300;
    const xScale = dataPoints.length > 1
        ? (width - 2 * padding) / (dataPoints.length - 1)
        : 0;
    const yScale = (height - 2 * padding) / maxOEE;

    const linePath = dataPoints
        .map((point) => {
            const x = padding + (point.index * xScale * zoomState.scale) + zoomState.offset;
            const y = height - padding - point.oee * yScale;
            return `${point.index === 0 ? 'M' : 'L'} ${x},${y}`;
        })
        .join(' ');

    const minLabelSpacing = 80;
    const labelInterval = Math.max(1, Math.floor((minLabelSpacing * zoomState.scale) / xScale));

    

    return (
      <div 
      className="bg-white rounded-lg shadow-sm p-4 mb-6 w-full"
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUp}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      style={{ touchAction: 'none' }}
  >
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
                    <button onClick={resetZoom} className="p-1 text-gray-600 hover:text-gray-800 text-xs sm:text-sm">
                        Reset
                    </button>
                </div>
            </div>
            <svg
                width="100%"
                height={height + padding}
                viewBox={`0 0 ${width} ${height + padding}`}
                style={{ cursor: panState.isPanning ? 'grabbing' : zoomState.scale > 1 ? 'grab' : 'default' }}
            >
                {/* Grid Lines */}
                {[0, 100, 200, 300].map((level) => {
                    const yPos = height - padding - (level / maxOEE) * (height - 2 * padding);
                    return (
                        <g key={`grid-${level}`}>
                            <line
                                x1={padding + zoomState.offset}
                                y1={yPos}
                                x2={width - padding + zoomState.offset}
                                y2={yPos}
                                stroke="#e5e7eb"
                                strokeWidth="1"
                            />
                            <text
                                x={padding - 10 + zoomState.offset}
                                y={yPos + 5}
                                textAnchor="end"
                                fontSize="10"
                                fill="#6b7280"
                            >
                                {level}
                            </text>
                        </g>
                    );
                })}

                {/* OEE Line */}
                <path
                    d={linePath}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2"
                />

                {/* Time Labels */}
                {dataPoints
                    .filter((_, index) => index % labelInterval === 0 || index === dataPoints.length - 1)
                    .map((point, index) => (
                        <text
                            key={index}
                            x={padding + (point.index * xScale * zoomState.scale) + zoomState.offset}
                            y={height - padding + 20}
                            textAnchor="middle"
                            fontSize="10"
                            fill="#6b7280"
                        >
                            {formatTime(point.time)}
                        </text>
                    ))}
            </svg>
        </div>
    );
};

export default OeeGraph;