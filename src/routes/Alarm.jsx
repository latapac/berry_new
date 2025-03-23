import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { getAuditTrailData } from '../backservice'; // Assuming a different service for alarm data

function AlarmReport() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const serialNumber = queryParams.get('serial_number');

    const [alarmData, setAlarmData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const [isPrinting, setIsPrinting] = useState(false);
    const [highlightedRows, setHighlightedRows] = useState(new Set());
    const [sortOrder, setSortOrder] = useState('desc');
    const [showDateFilter, setShowDateFilter] = useState(false);
    const lastFetchTime = useRef(new Date().toISOString());

    useEffect(() => {
        const fetchData = () => {
            getAuditTrailData(serialNumber).then((data) => {
                const currentTime = new Date().toISOString();
                
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
    
                // Highlight new items
                if (newItems.length > 0) {
                    const newHighlighted = new Set();
                    newItems.forEach(item => newHighlighted.add(item._id));
                    setHighlightedRows(newHighlighted);
    
                    setTimeout(() => {
                        setHighlightedRows(new Set());
                    }, 60000);
                }
    
                // Sort alarm items
                const sortedData = [...alarmItems].sort((a, b) => {
                    const dateA = new Date(a.d.trigger_time);
                    const dateB = new Date(b.d.trigger_time);
                    return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
                });
    
                setAlarmData(sortedData);
                
                // Apply date filtering
                let filtered = sortedData;
                if (startDate && endDate) {
                    const start = new Date(startDate);
                    const end = new Date(endDate);
                    filtered = filtered.filter(item => {
                        const itemDate = new Date(item.d.trigger_time);
                        return itemDate >= start && itemDate <= end;
                    });
                }
                
                setFilteredData(filtered);
                lastFetchTime.current = currentTime;
            });
        };
    
        fetchData();
        const intervalId = setInterval(fetchData, 4000);
        return () => clearInterval(intervalId);
    }, [serialNumber, startDate, endDate, sortOrder]);

    useEffect(() => {
        setCurrentPage(0);
    }, [itemsPerPage]);

    function formatTimestamp(isoString) {
        console.log(isoString);
        
        if (!isoString) return ' ';
        const date = new Date(isoString);
        return `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/` +
            `${date.getDate().toString().padStart(2, '0')} ` +
            `${date.getHours().toString().padStart(2, '0')}:` +
            `${date.getMinutes().toString().padStart(2, '0')}:` +
            `${date.getSeconds().toString().padStart(2, '0')}`;
    }

    function formatShortDateTime(isoString) {
        if (!isoString) return '';
        const date = new Date(isoString);
        return `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/` +
            `${date.getDate().toString().padStart(2, '0')} ` +
            `${date.getHours().toString().padStart(2, '0')}:` +
            `${date.getMinutes().toString().padStart(2, '0')}`;
    }

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const paginatedData = filteredData.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);
    const dataToPrint = isPrinting
        ? (startDate && endDate ? filteredData : filteredData.slice(0, itemsPerPage))
        : paginatedData;

    const handlePrint = () => {
        setIsPrinting(true);
        setTimeout(() => {
            window.print();
            setIsPrinting(false);
        }, 100);
    };

    const handleClearFilters = () => {
        setStartDate('');
        setEndDate('');
        setShowDateFilter(false);
    };

    const toggleSortOrder = () => {
        setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
    };

    return (
        <div className="min-h-screen flex flex-col items-center p-4 bg-gray-100">
            <div className="w-full mb-4 flex justify-between items-center no-print">
                <h1 className="text-2xl font-bold text-gray-800 text-left print:text-center">
                    Alarm Report
                </h1>
                <div className="flex items-center gap-2 relative">
                    <div className="relative">
                        <button
                            onClick={() => setShowDateFilter(!showDateFilter)}
                            className="p-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-32 h-6"
                        >
                            {startDate || endDate 
                                ? `${formatShortDateTime(startDate)} - ${formatShortDateTime(endDate)}`
                                : 'Date Filter'}
                        </button>
                        {showDateFilter && (
                            <div className="absolute top-8 right-0 z-10 bg-white border border-gray-300 rounded p-2 shadow-md">
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-1">
                                        <label htmlFor="start-date" className="text-xs font-medium text-gray-700 w-8">From</label>
                                        <input
                                            id="start-date"
                                            type="datetime-local"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            className="p-0.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-32"
                                        />
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <label htmlFor="end-date" className="text-xs font-medium text-gray-700 w-8">to</label>
                                        <input
                                            id="end-date"
                                            type="datetime-local"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            className="p-0.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-32"
                                        />
                                    </div>
                                    <button
                                        onClick={handleClearFilters}
                                        className="p-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-20 self-end"
                                    >
                                        Clear
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={toggleSortOrder}
                        className="p-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-8 h-6 flex items-center justify-center"
                        title={sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
                    >
                        {sortOrder === 'desc' ? '↓' : '↑'}
                    </button>
                    <button
                        onClick={handlePrint}
                        className="p-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-20 h-6"
                    >
                        Print
                    </button>
                </div>
            </div>

            <div className="print-only text-sm text-gray-800" style={{ position: 'fixed', top: '40px', left: '1cm', width: '100%' }}>
                Equipment ID: {serialNumber || 'N/A'}
            </div>

            <div className="w-full bg-white rounded shadow-md overflow-hidden print-area">
                <table className="w-full border-collapse">
                    <thead className="bg-gray-200 text-gray-700">
                        <tr>
                            {["Triggered Date & Time", "Recover Date & Time", "Alarm", "User"].map((header) => (
                                <th key={header} className="px-2 py-1 text-xs font-medium uppercase tracking-wider border-b">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {dataToPrint.length > 0 ? (
                            dataToPrint.map((data) => {
                                const isHighlighted = highlightedRows.has(data._id) && !isPrinting;
                                return (
                                    <tr 
                                        key={data._id} 
                                        className={`hover:bg-gray-50 transition-colors ${isHighlighted ? 'animate-glow' : ''}`}
                                    >
                                        <td className="px-2 py-1 text-xs border-b">{formatTimestamp(data?.d.trigger_time)}</td>
                                        <td className="px-2 py-1 text-xs border-b">{formatTimestamp(data?.d.recover_time)}</td>
                                        <td className="px-2 py-1 text-xs border-b">{data?.d.message+" ("+data?.d.status+")"}</td>
                                        <td className="px-2 py-1 text-xs border-b">{data.user?.user || "System"}</td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="4" className="px-2 py-1 text-center text-xs text-gray-500 border-b">
                                    No matching alarms found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-between items-center w-full mt-4 text-sm text-gray-700 no-print">
                <div className="flex items-center gap-2">
                    <span>
                        Showing {currentPage * itemsPerPage + 1} to {Math.min((currentPage + 1) * itemsPerPage, filteredData.length)} of {filteredData.length} entries
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setCurrentPage(Math.max(currentPage - 1, 0))}
                        disabled={currentPage === 0}
                        className="p-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-20 h-6 disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span>Page {currentPage + 1} of {totalPages}</span>
                    <button
                        onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages - 1))}
                        disabled={currentPage >= totalPages - 1}
                        className="p-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-20 h-6 disabled:opacity-50"
                    >
                        Next
                    </button>
                    <label htmlFor="items-per-page" className="text-xs font-medium text-gray-700">Show:</label>
                    <select
                        id="items-per-page"
                        value={itemsPerPage}
                        onChange={(e) => setItemsPerPage(Number(e.target.value))}
                        className="p-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 h-6"
                    >
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                </div>
            </div>

            <style jsx global>{`
                th {
                    text-align: center !important;
                }

                @keyframes glow {
                    0% { background-color: #fefcbf; }
                    50% { background-color: #fef08a; }
                    100% { background-color: #fefcbf; }
                }

                .animate-glow {
                    animation: glow 1s infinite;
                }

                @media print {
                    body * {
                        visibility: hidden;
                    }
                    .print-area, .print-area *, .print-only {
                        visibility: visible;
                    }
                    .print-area {
                        position: absolute;
                        top: 70px;
                        left: 0;
                        width: 100%;
                        box-shadow: none !important;
                        border-radius: 0 !important;
                        overflow: visible !important;
                    }
                    table {
                        width: 100%;
                        font-size: 9pt;
                        border-collapse: collapse;
                        page-break-inside: auto;
                    }
                    th, td {
                        border: 1px solid #ddd;
                        padding: 4px;
                    }
                    th {
                        background-color: #f8fafc;
                        text-align: center !important;
                    }
                    tr {
                        page-break-inside: avoid;
                        page-break-after: auto;
                    }
                    @page {
                        size: A4;
                        margin: 1cm;
                    }
                    body::before {
                        content: "Alarm Report";
                        position: fixed;
                        top: 10px;
                        left: 0;
                        width: 100%;
                        text-align: center;
                        font-size: 16pt;
                        font-weight: bold;
                        visibility: visible;
                    }
                    body::after {
                        content: none;
                    }
                    .print-only {
                        left: 1cm;
                        text-align: left;
                    }
                    .animate-glow {
                        animation: none !important;
                        background-color: transparent !important;
                    }
                }
            `}</style>
        </div>
    );
}

export default AlarmReport;