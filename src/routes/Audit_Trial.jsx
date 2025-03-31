import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { getAuditTrailData } from '../backservice';

function AuditTrail() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const serialNumber = queryParams.get('serial_number');

    const [auditData, setAuditData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const [isPrinting, setIsPrinting] = useState(false);
    const [lastLoggedInUser, setLastLoggedInUser] = useState('');
    const [highlightedRows, setHighlightedRows] = useState(new Set());
    const [sortOrder, setSortOrder] = useState('desc');
    const [showDateFilter, setShowDateFilter] = useState(false);
    const lastFetchTime = useRef(new Date().toISOString());

    useEffect(() => {
        const fetchData = () => {
            getAuditTrailData(serialNumber).then((data) => {
                
                const currentTime = new Date().toISOString();
                

                

                const newItems = data.filter(item => {
                    const itemTime = new Date(item.ts);
                    const lastTime = new Date(lastFetchTime.current);
                    return itemTime > lastTime;
                });

                if (newItems.length > 0) {
                    const newHighlighted = new Set();
                    newItems.forEach(item => newHighlighted.add(item._id));
                    setHighlightedRows(newHighlighted);

                    setTimeout(() => {
                        setHighlightedRows(new Set());
                    }, 60000);
                }

                const sortedData = [...data].sort((a, b) => {
                    const dateA = new Date(a.ts);
                    const dateB = new Date(b.ts);
                    return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
                });

                setAuditData(sortedData);
                
                let filtered = sortedData;
                if (startDate && endDate) {
                    const start = new Date(startDate);
                    const end = new Date(endDate);
                    filtered = filtered.filter(item => {
                        const itemDate = new Date(item.ts);
                        return itemDate >= start && itemDate <= end;
                    });
                }
                setFilteredData(filtered);
                
                lastFetchTime.current = currentTime;

                const loginEvents = sortedData.filter(item => item.d?.User && item.d.User[0] !== '');
                if (loginEvents.length > 0) {
                    const mostRecentLogin = loginEvents.sort((a, b) => new Date(b.ts) - new Date(a.ts))[0];
                    setLastLoggedInUser(mostRecentLogin.d.User[0]);
                }
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
        return `${date.getHours().toString().padStart(2, '0')}:` +
            `${date.getMinutes().toString().padStart(2, '0')}`;
    }

    function LogText(key, data) {
        if (key === "User") {
            if (data === "") {
                return `User (${lastLoggedInUser || 'Unknown'}) Logged Out`;
            } else {
                return "User (" + data + ") Logged In";
            }
        } else {
            return data;
        }
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

    const getStatusText = (data)=>{
            if (data.topic==="alarm") {
                return data?.d?.message
            }else{
                return Object.keys(data?.d || {})[0];
            }
    }

    const getIdentificationText = (data,firstKey)=>{
        if (data.topic==="alarm") {
            return data?.d?.status
        }else{
            return LogText(firstKey, data.d[firstKey]?.[0])
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center p-2 sm:p-4 bg-gray-100">
            <div className="w-full max-w-6xl mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 no-print">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                    Audit Report
                </h1>
                <div className="flex items-center gap-2 relative w-full sm:w-auto">
                    <div className="relative">
                        <button
                            onClick={() => setShowDateFilter(!showDateFilter)}
                            className="p-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-100 w-full sm:w-20 h-6"
                        >
                            {startDate || endDate 
                                ? `${formatShortDateTime(startDate)}${endDate ? `-${formatShortDateTime(endDate)}` : ''}`
                                : 'Filter'}
                        </button>
                        {showDateFilter && (
                            <div className={`absolute ${window.innerWidth < 640 ? 'left-0' : 'right-0'} top-8 z-10 bg-white border border-gray-300 rounded p-2 shadow-md`}>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-1">
                                        <label htmlFor="start-date" className="text-xs font-medium text-gray-700 w-8">From</label>
                                        <input
                                            id="start-date"
                                            type="datetime-local"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            className="p-0.5 text-xs border border-gray-300 rounded w-full sm:w-32"
                                        />
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <label htmlFor="end-date" className="text-xs font-medium text-gray-700 w-8">to</label>
                                        <input
                                            id="end-date"
                                            type="datetime-local"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            className="p-0.5 text-xs border border-gray-300 rounded w-full sm:w-32"
                                        />
                                    </div>
                                    <button
                                        onClick={handleClearFilters}
                                        className="p-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-100 w-20 self-end"
                                    >
                                        Clear
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={toggleSortOrder}
                        className="p-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-100 w-8 h-6 flex items-center justify-center"
                        title={sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
                    >
                        {sortOrder === 'desc' ? '↓' : '↑'}
                    </button>
                    <button
                        onClick={handlePrint}
                        className="p-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-100 w-20 h-6"
                    >
                        Print
                    </button>
                </div>
            </div>

            <div className="print-only text-sm text-gray-800" style={{ position: 'fixed', top: '40px', left: '1cm', width: '100%' }}>
                Equipment ID: {serialNumber || 'N/A'}
            </div>

            <div className="w-full max-w-6xl bg-white rounded shadow-md overflow-x-auto print-area">
                <table className="w-full border-collapse">
                    <thead className="bg-gray-200 text-gray-700">
                        <tr>
                            {["Date & Time", "Identification", "Text", "User"].map((header) => (
                                <th key={header} className="px-2 py-1 text-xs font-medium uppercase tracking-wider border-b whitespace-nowrap">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {dataToPrint.length > 0 ? (
                            dataToPrint.map((data) => {
                                
                                const firstKey = getStatusText(data)
                                const isHighlighted = highlightedRows.has(data._id) && !isPrinting;
                                return (
                                    <tr 
                                        key={data._id} 
                                        className={`hover:bg-gray-50 ${isHighlighted ? 'animate-glow' : ''}`}
                                    >
                                        <td className="px-2 py-1 text-xs border-b whitespace-nowrap">{formatTimestamp(data?.ts)}</td>
                                        <td className="px-2 py-1 text-xs border-b whitespace-nowrap">{firstKey || '--'}</td>
                                        <td className="px-2 py-1 text-xs border-b">{getIdentificationText(data,firstKey)}</td>
                                        <td className="px-2 py-1 text-xs border-b whitespace-nowrap">{data?.d?.User?.[0] || "System"}</td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="4" className="px-2 py-1 text-center text-xs text-gray-500 border-b">
                                    No matching data found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="w-full max-w-6xl flex flex-col sm:flex-row justify-between items-center mt-4 text-sm text-gray-700 no-print gap-2">
                <div className="text-xs sm:text-sm">
                    Showing {currentPage * itemsPerPage + 1} to {Math.min((currentPage + 1) * itemsPerPage, filteredData.length)} of {filteredData.length} entries
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setCurrentPage(Math.max(currentPage - 1, 0))}
                        disabled={currentPage === 0}
                        className="p-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-100 w-10 h-6 disabled:opacity-50"
                    >
                        ←
                    </button>
                    <span className="text-xs sm:text-sm">Page {currentPage + 1} of {totalPages}</span>
                    <button
                        onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages - 1))}
                        disabled={currentPage >= totalPages - 1}
                        className="p-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-100 w-10 h-6 disabled:opacity-50"
                    >
                        →
                    </button>
                    <label htmlFor="items-per-page" className="text-xs font-medium text-gray-700 hidden sm:inline">Show:</label>
                    <select
                        id="items-per-page"
                        value={itemsPerPage}
                        onChange={(e) => setItemsPerPage(Number(e.target.value))}
                        className="p-1 text-xs border border-gray-300 rounded h-6"
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
                        content: "Audit Report";
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

                @media (max-width: 640px) {
                    .print-area {
                        overflow-x: auto;
                        -webkit-overflow-scrolling: touch;
                    }
                    table {
                        min-width: 600px;
                    }
                }
            `}</style>
        </div>
    );
}

export default AuditTrail;