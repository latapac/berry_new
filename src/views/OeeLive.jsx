import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const OeeLive = () => {
  // Data
  const availability = 87.5;
  const performance = 92.3;
  const quality = 95.1;
  const oee = ((availability * performance * quality) / 10000).toFixed(1);
  const lastUpdated = new Date().toLocaleString();

  // Chart configurations (exactly 4 charts)
  const charts = [
    {
      title: "OEE Components",
      data: {
        labels: ['Availability', 'Performance', 'Quality'],
        datasets: [{
          data: [availability, performance, quality],
          backgroundColor: ['#4285F4', '#FBBC05', '#34A853'],
          borderWidth: 0
        }]
      }
    },
    {
      title: `Availability (${availability}%)`,
      data: {
        labels: ['Uptime', 'Downtime'],
        datasets: [{
          data: [availability, 100 - availability],
          backgroundColor: ['#4285F4', '#EA4335'],
          borderWidth: 0
        }]
      }
    },
    {
      title: `Performance (${performance}%)`,
      data: {
        labels: ['Actual', 'Loss'],
        datasets: [{
          data: [performance, 100 - performance],
          backgroundColor: ['#FBBC05', '#EA4335'],
          borderWidth: 0
        }]
      }
    },
    {
      title: `Quality (${quality}%)`,
      data: {
        labels: ['Good', 'Defects'],
        datasets: [{
          data: [quality, 100 - quality],
          backgroundColor: ['#34A853', '#EA4335'],
          borderWidth: 0
        }]
      }
    }
  ];

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'right' },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${context.raw}%`
        }
      }
    }
  };

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      minHeight: '100vh'
    }}>
      <header style={{
        textAlign: 'center',
        marginBottom: '30px'
      }}>
        <h1 style={{ marginBottom: '5px', color: '#333' }}>OEE Dashboard</h1>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center',
          gap: '20px',
          alignItems: 'center'
        }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
            Overall OEE: <span style={{ color: '#4285F4' }}>{oee}%</span>
          </div>
          <div style={{ color: '#666' }}>
            Last updated: {lastUpdated}
          </div>
        </div>
      </header>

      {/* First row with 2 charts */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '20px',
        marginBottom: '20px'
      }}>
        {charts.slice(0, 2).map((chart, index) => (
          <div key={index} style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ textAlign: 'center', marginTop: '0' }}>{chart.title}</h3>
            <div style={{ height: '300px' , width: '400px'}}>
              <Pie data={chart.data} options={chartOptions} />
            </div>
          </div>
        ))}
      </div>

      {/* Second row with 2 charts */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '20px'
      }}>
        {charts.slice(2, 4).map((chart, index) => (
          <div key={index} style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ textAlign: 'center', marginTop: '0' }}>{chart.title}</h3>
            <div style={{ height: '300px' }}>
              <Pie data={chart.data} options={chartOptions} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OeeLive;