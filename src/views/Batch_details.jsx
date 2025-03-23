import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const batchData = [
  { batchId: 1, startTime: '2023-10-01 08:00', endTime: '2023-10-01 16:00', machineLineNo: 'Line 1', status: 'Completed', unitsProduced: 500 },
  { batchId: 2, startTime: '2023-10-02 08:00', endTime: '2023-10-02 16:00', machineLineNo: 'Line 2', status: 'In Progress', unitsProduced: 300 },
  { batchId: 3, startTime: '2023-10-03 08:00', endTime: '2023-10-03 16:00', machineLineNo: 'Line 3', status: 'Pending', unitsProduced: 0 },
];

const metricsData = [
  { batchId: 1, targetProduction: 600, actualProduction: 500, qualityMetrics: '98%' },
  { batchId: 2, targetProduction: 600, actualProduction: 300, qualityMetrics: '95%' },
  { batchId: 3, targetProduction: 600, actualProduction: 0, qualityMetrics: 'N/A' },
];

function BatchDetails() {
  const [selectedBatch, setSelectedBatch] = useState(null);

  const handleBatchClick = (batchId) => {
    setSelectedBatch(batchId);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Batch Overview</h1>

      {/* Batch Table */}
      <div style={styles.tableContainer}>
        {/* Desktop Table */}
        <table style={{ ...styles.table, display: window.innerWidth > 768 ? 'table' : 'none' }}>
          <thead>
            <tr style={styles.tableHeaderRow}>
              <th style={styles.tableHeader}>Batch ID</th>
              <th style={styles.tableHeader}>Start Time</th>
              <th style={styles.tableHeader}>End Time</th>
              <th style={styles.tableHeader}>Machine Line No.</th>
              <th style={styles.tableHeader}>Status</th>
              <th style={styles.tableHeader}>Units Produced</th>
            </tr>
          </thead>
          <tbody>
            {batchData.map((batch) => (
              <tr
                key={batch.batchId}
                onClick={() => handleBatchClick(batch.batchId)}
                style={{
                  ...styles.tableRow,
                  backgroundColor: selectedBatch === batch.batchId ? '#e3f2fd' : 'white',
                }}
              >
                <td style={styles.tableCell}>{batch.batchId}</td>
                <td style={styles.tableCell}>{batch.startTime}</td>
                <td style={styles.tableCell}>{batch.endTime}</td>
                <td style={styles.tableCell}>{batch.machineLineNo}</td>
                <td style={{ ...styles.tableCell, color: getStatusColor(batch.status) }}>{batch.status}</td>
                <td style={styles.tableCell}>{batch.unitsProduced}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mobile Table */}
        <div style={{ display: window.innerWidth <= 768 ? 'block' : 'none' }}>
          {batchData.map((batch) => (
            <div
              key={batch.batchId}
              onClick={() => handleBatchClick(batch.batchId)}
              style={{
                ...styles.mobileTableRow,
                backgroundColor: selectedBatch === batch.batchId ? '#e3f2fd' : 'white',
              }}
            >
              <div style={styles.mobileTableCell}>
                <strong>Batch ID:</strong> {batch.batchId}
              </div>
              <div style={styles.mobileTableCell}>
                <strong>Start Time:</strong> {batch.startTime}
              </div>
              <div style={styles.mobileTableCell}>
                <strong>End Time:</strong> {batch.endTime}
              </div>
              <div style={styles.mobileTableCell}>
                <strong>Machine Line No.:</strong> {batch.machineLineNo}
              </div>
              <div style={{ ...styles.mobileTableCell, color: getStatusColor(batch.status) }}>
                <strong>Status:</strong> {batch.status}
              </div>
              <div style={styles.mobileTableCell}>
                <strong>Units Produced:</strong> {batch.unitsProduced}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Batch Metrics */}
      <h2 style={styles.subHeader}>Batch Metrics</h2>
      <div style={styles.metricsContainer}>
        {metricsData.map((metric) => (
          <div
            key={metric.batchId}
            style={{
              ...styles.metricCard,
              background: getMetricCardBackground(metric.actualProduction, metric.targetProduction),
            }}
          >
            <h3 style={styles.metricHeader}>Batch {metric.batchId}</h3>
            <p><strong>Target Production:</strong> {metric.targetProduction}</p>
            <p><strong>Actual Production:</strong> {metric.actualProduction}</p>
            <p><strong>Quality Metrics:</strong> {metric.qualityMetrics}</p>
          </div>
        ))}
      </div>

      {/* Batch Performance Chart */}
      <h2 style={styles.subHeader}>Batch Performance Across Machines</h2>
      <div style={styles.chartContainer}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={batchData}>
            <XAxis dataKey="machineLineNo" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="unitsProduced" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed Logs */}
      {selectedBatch && (
        <div style={styles.detailsContainer}>
          <h2 style={styles.subHeader}>Detailed Logs for Batch {selectedBatch}</h2>
          <p>Here you can display detailed logs for the selected batch.</p>
        </div>
      )}
    </div>
  );
}

// Helper functions for dynamic styling
const getStatusColor = (status) => {
  switch (status) {
    case 'Completed':
      return '#4caf50'; // Green
    case 'In Progress':
      return '#ffa000'; // Amber
    case 'Pending':
      return '#f44336'; // Red
    default:
      return '#000';
  }
};

const getMetricCardBackground = (actual, target) => {
  const percentage = (actual / target) * 100;
  if (percentage >= 90) return 'linear-gradient(135deg, #4caf50, #81c784)'; // Green gradient
  if (percentage >= 50) return 'linear-gradient(135deg, #ffa000, #ffca28)'; // Amber gradient
  return 'linear-gradient(135deg, #f44336, #e57373)'; // Red gradient
};

// Styles
const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    width: '100%', // Adjusted for smaller screens
    maxWidth: '1200px', // Max width for larger screens
    margin: '0 auto',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  header: {
    marginBottom: '20px',
    color: '#333',
    fontSize: '24px',
    fontWeight: 'bold',
    textAlign: 'start'
  },
  subHeader: {
    marginBottom: '20px',
    color: '#555',
    fontSize: '20px',
    fontWeight: '600',
    borderBottom: '2px solid #82ca9d',
    paddingBottom: '8px',
  },
  tableContainer: {
    marginBottom: '20px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: 'white',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  tableHeaderRow: {
    backgroundColor: '#82ca9d',
  },
  tableHeader: {
    border: '1px solid #ddd',
    padding: '12px',
    textAlign: 'left',
    fontWeight: 'bold',
    color: 'white',
  },
  tableRow: {
    border: '1px solid #ddd',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  tableCell: {
    border: '1px solid #ddd',
    padding: '12px',
    color: '#555',
  },
  mobileTableRow: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    marginBottom: '10px',
    padding: '12px',
    backgroundColor: 'white',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  mobileTableCell: {
    marginBottom: '8px',
    color: '#555',
  },
  metricsContainer: {
    display: 'flex',
    flexWrap: 'wrap', // Allow wrapping on small screens
    justifyContent: 'space-around',
    marginBottom: '20px',
    gap: '20px',
  },
  metricCard: {
    border: '1px solid #ddd',
    padding: '20px',
    width: '100%', // Full width on small screens
    maxWidth: '300px', // Max width for larger screens
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    color: 'white',
    textAlign: 'center',
  },
  metricHeader: {
    marginBottom: '10px',
    fontSize: '18px',
    fontWeight: '600',
  },
  chartContainer: {
    width: '100%',
    height: '300px',
    marginBottom: '20px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    padding: '20px',
  },
  detailsContainer: {
    border: '1px solid #ddd',
    padding: '20px',
    borderRadius: '8px',
    backgroundColor: 'white',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
};

export default BatchDetails;