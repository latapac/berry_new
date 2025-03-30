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
    const [pinchState, setPinchState] = useState({
        initialDistance: null,
        initialScale: 1,
    });
    const [panState, setPanState] = useState({
        isPanning: false,
        startX: 0,
        initialOffset: 0
    });
    const [hoveredPoint, setHoveredPoint] = useState(null);
    
    const svgRef = useRef(null);
    const containerRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 600, height: 400 });
    const maxSpeed = 300;
    const padding = 15;

    // Wheel zoom handler
    useEffect(() => {
        const handleWheel = (e) => {
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
                handleZoom(zoomFactor);
            }
        };

        const container = containerRef.current;
        container.addEventListener('wheel', handleWheel, { passive: false });

        return () => {
            container.removeEventListener('wheel', handleWheel);
        };
    }, [zoomState.scale]);

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
        if (!isLoading && speedData?.length > 0) {
            const points = speedData.map((item, index) => ({
                time: new Date(item.ts),
                speed: item.speed,
                index: index
            }));
            setDataPoints(points);
            setZoomState(prev => ({
                ...prev,
                maxOffset: dimensions.width * (1 - prev.scale)
            }));
        }
    }, [speedData, isLoading, dimensions.width]);

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

        // Existing hover logic
        if (!svgRef.current) return;
        const svgRect = svgRef.current.getBoundingClientRect();
        const mouseX = e.clientX - svgRect.left - zoomState.offset;
        const mouseY = e.clientY - svgRect.top;

        const { width, height } = dimensions;
        const yScale = (height - 2 * padding) / maxSpeed;

        let closestPoint = null;
        let minDistance = Infinity;

        dataPoints.forEach((point, index) => {
            const x = padding + index * ((width - 2 * padding) / (dataPoints.length - 1)) * zoomState.scale;
            const y = height - padding - point.speed * yScale;

            const distance = Math.sqrt(Math.pow(x - mouseX, 2) + Math.pow(y - mouseY, 2));

            if (distance < minDistance && distance < 20) {
                minDistance = distance;
                closestPoint = { ...point, x, y, index };
            }
        });

        setHoveredPoint(closestPoint);
    };

    const handleMouseUp = () => {
        setPanState({ isPanning: false, startX: 0, initialOffset: 0 });
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
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };

    const { width, height } = dimensions;
    const xScale = dataPoints.length > 1
        ? (width - 2 * padding) / (dataPoints.length - 1)
        : 0;
    const yScale = (height - 2 * padding) / maxSpeed;

    const linePath = dataPoints
        .map((point) => {
            const x = padding + (point.index * xScale * zoomState.scale) + zoomState.offset;
            const y = height - padding - point.speed * yScale;
            return `${point.index === 0 ? 'M' : 'L'} ${x},${y}`;
        })
        .join(' ');

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
            style={{ touchAction: 'none' }}
        >
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
                    <button onClick={resetZoom} className="p-1 text-gray-600 hover:text-gray-800 text-xs sm:text-sm">
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
                style={{ cursor: panState.isPanning ? 'grabbing' : zoomState.scale > 1 ? 'grab' : 'default' }}
            >
                {/* Grid lines and other SVG elements remain the same as before */}
                {/* ... (keep all the existing SVG elements from your original code) ... */}
            </svg>
        </div>
    );
};

export default MachineGraph;