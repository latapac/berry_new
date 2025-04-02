import React from 'react';
import { getMachineData } from "../backservice";
import { Pie } from 'react-chartjs-2';
import { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const OeeLive = () => {
  const queryParams = new URLSearchParams(location.search);
  const serialNumber = queryParams.get('serial_number');
  const [machineData, setMachineData] = useState({});
  const [isLoading, setLoading] = useState(true);
  
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
  }, [serialNumber]);

  // Data
  let availability = machineData?.d?.Availability[0];
  let performance = machineData?.d?.Performance[0];
  let quality = machineData?.d?.Quality[0];

  const oee = 99;
  const lastUpdated = new Date().toLocaleString();

  // Chart configurations
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
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: 'right',
        labels: {
          boxWidth: 12,
          padding: 10,
          font: {
            size: window.innerWidth < 768 ? 10 : 12
          }
        }
      },
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
      width: '100%',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px 15px',
      minHeight: '100vh',
      boxSizing: 'border-box'
    }}>
      <header style={{
        textAlign: 'center',
        marginBottom: '25px',
        padding: '0 10px'
      }}>
        <h1 style={{ 
          marginBottom: '10px', 
          color: '#333', 
          fontSize: 'calc(16px + 1vw)',
          fontWeight: '600'
        }}>
          OEE Dashboard
        </h1>
        <div style={{
          display: 'flex',
          flexDirection: window.innerWidth < 600 ? 'column' : 'row',
          justifyContent: 'center',
          gap: '15px',
          alignItems: 'center'
        }}>
          <div style={{ 
            fontSize: 'calc(14px + 0.3vw)', 
            fontWeight: 'bold' 
          }}>
            Overall OEE: <span style={{ color: '#4285F4' }}>{oee}%</span>
          </div>
          <div style={{ 
            color: '#666', 
            fontSize: 'calc(12px + 0.3vw)' 
          }}>
            Last updated: {lastUpdated}
          </div>
        </div>
      </header>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr)',
        gap: '20px',
        width: '100%',
        padding: '0 10px',
        boxSizing: 'border-box'
      }}>
        {charts.map((chart, index) => (
          <div key={index} style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '15px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            width: '100%',
            minWidth: '0', // Fixes flexbox overflow issues
            display: 'flex',
            flexDirection: 'column'
          }}>
            <h3 style={{ 
              textAlign: 'center', 
              margin: '0 0 15px 0',
              fontSize: 'calc(14px + 0.3vw)',
              fontWeight: '500'
            }}>
              {chart.title}
            </h3>
            <div style={{ 
              flex: '1',
              minHeight: '250px',
              width: '100%',
              position: 'relative',
              margin: '0 auto'
            }}>
              <Pie data={chart.data} options={chartOptions} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OeeLive;