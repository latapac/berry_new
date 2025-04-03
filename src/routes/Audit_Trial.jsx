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

    const getStatusText = (data) => {
        if (data.topic === "alarm") {
            return data?.d?.message;
        } else {
            return Object.keys(data?.d || {})[0];
        }
    };

    const getIdentificationText = (data, firstKey) => {
        if (data.topic === "alarm") {
            return data?.d?.status;
        } else if (data.topic === "control") {
            return data.d[firstKey][0] ? "On" : "Off";
        } else {
            return LogText(firstKey, data.d[firstKey]?.[0]);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center p-2 sm:p-4 bg-gray-100">
            {/* Header Section */}
            <div className="w-full max-w-6xl mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 no-print">
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
                    Audit Report
                </h1>
                
                {/* Controls Section */}
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                    {/* Date Filter */}
                    <div className="relative flex-grow sm:flex-grow-0">
                        <button
                            onClick={() => setShowDateFilter(!showDateFilter)}
                            className="p-1 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-100 w-full sm:w-24 h-8"
                        >
                            {startDate || endDate 
                                ? `${formatShortDateTime(startDate)}${endDate ? `-${formatShortDateTime(endDate)}` : ''}`
                                : 'Filter'}
                        </button>
                        {showDateFilter && (
                            <div className={`absolute ${window.innerWidth < 640 ? 'left-0' : 'right-0'} top-9 z-10 bg-white border border-gray-300 rounded p-2 shadow-md`}>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-1">
                                        <label htmlFor="start-date" className="text-xs sm:text-sm font-medium text-gray-700 w-10">From</label>
                                        <input
                                            id="start-date"
                                            type="datetime-local"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            className="p-1 text-xs sm:text-sm border border-gray-300 rounded w-full sm:w-40"
                                        />
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <label htmlFor="end-date" className="text-xs sm:text-sm font-medium text-gray-700 w-10">To</label>
                                        <input
                                            id="end-date"
                                            type="datetime-local"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            className="p-1 text-xs sm:text-sm border border-gray-300 rounded w-full sm:w-40"
                                        />
                                    </div>
                                    <button
                                        onClick={handleClearFilters}
                                        className="p-1 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-100 w-20 self-end"
                                    >
                                        Clear
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    {/* Sort Button */}
                    <button
                        onClick={toggleSortOrder}
                        className="p-1 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-100 w-8 h-8 flex items-center justify-center"
                        title={sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
                    >
                        {sortOrder === 'desc' ? '↓' : '↑'}
                    </button>
                    
                    {/* Print Button */}
                    <button
                        onClick={handlePrint}
                        className="p-1 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-100 w-16 sm:w-20 h-8"
                    >
                        Print
                    </button>
                </div>
            </div>

            {/* Print Header */}
            <div className="print-only text-sm text-gray-800" style={{ position: 'fixed', top: '40px', left: '1cm', width: '100%' }}>
                Equipment ID: {serialNumber || 'N/A'}
            </div>

            {/* Table Section - Now without horizontal scroll */}
            <div className="w-full max-w-6xl bg-white rounded shadow-md print-area">
                <table className="w-full border-collapse table-fixed">
                    <thead className="bg-gray-200 text-gray-700">
                        <tr>
                            <th className="w-1/4 px-2 py-2 text-xs sm:text-sm font-medium uppercase tracking-wider border-b">
                                Date & Time
                            </th>
                            <th className="w-1/4 px-2 py-2 text-xs sm:text-sm font-medium uppercase tracking-wider border-b">
                                Identification
                            </th>
                            <th className="w-2/4 px-2 py-2 text-xs sm:text-sm font-medium uppercase tracking-wider border-b">
                                Text
                            </th>
                            <th className="w-1/4 px-2 py-2 text-xs sm:text-sm font-medium uppercase tracking-wider border-b">
                                User
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {dataToPrint.length > 0 ? (
                            dataToPrint.map((data) => {
                                const firstKey = getStatusText(data);
                                const isHighlighted = highlightedRows.has(data._id) && !isPrinting;
                                return (
                                    <tr 
                                        key={data._id} 
                                        className={`hover:bg-gray-50 ${isHighlighted ? 'animate-glow' : ''}`}
                                    >
                                        <td className="w-1/4 px-2 py-2 text-xs sm:text-sm border-b truncate" title={formatTimestamp(data?.ts)}>
                                            {formatTimestamp(data?.ts)}
                                        </td>
                                        <td className="w-1/4 px-2 py-2 text-xs sm:text-sm border-b truncate" title={firstKey || '--'}>
                                            {firstKey || '--'}
                                        </td>
                                        <td className="w-2/4 px-2 py-2 text-xs sm:text-sm border-b truncate" title={getIdentificationText(data, firstKey)}>
                                            {getIdentificationText(data, firstKey)}
                                        </td>
                                        <td className="w-1/4 px-2 py-2 text-xs sm:text-sm border-b truncate" title={data?.d?.User?.[0] || "System"}>
                                            {data?.d?.User?.[0] || "System"}
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="4" className="px-2 py-4 text-center text-xs sm:text-sm text-gray-500 border-b">
                                    No matching data found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Section */}
            <div className="w-full max-w-6xl flex flex-col sm:flex-row justify-between items-center mt-4 text-sm text-gray-700 no-print gap-2">
                <div className="text-xs sm:text-sm">
                    Showing {currentPage * itemsPerPage + 1} to {Math.min((currentPage + 1) * itemsPerPage, filteredData.length)} of {filteredData.length} entries
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setCurrentPage(Math.max(currentPage - 1, 0))}
                        disabled={currentPage === 0}
                        className="p-1 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-100 w-8 sm:w-10 h-8 disabled:opacity-50"
                    >
                        ←
                    </button>
                    <span className="text-xs sm:text-sm">Page {currentPage + 1} of {totalPages}</span>
                    <button
                        onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages - 1))}
                        disabled={currentPage >= totalPages - 1}
                        className="p-1 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-100 w-8 sm:w-10 h-8 disabled:opacity-50"
                    >
                        →
                    </button>
                    <label htmlFor="items-per-page" className="text-xs sm:text-sm font-medium text-gray-700 hidden sm:inline">Show:</label>
                    <select
                        id="items-per-page"
                        value={itemsPerPage}
                        onChange={(e) => setItemsPerPage(Number(e.target.value))}
                        className="p-1 text-xs sm:text-sm border border-gray-300 rounded h-8"
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
                        border-radius: 0;
                        margin-left: -0.5rem;
                        margin-right: -0.5rem;
                        width: calc(100% + 1rem);
                    }
                    table {
                        width: 100%;
                    }
                    th, td {
                        padding: 0.5rem;
                        font-size: 0.75rem;
                    }
                }
            `}</style>
        </div>
    );
}

export default AuditTrail;