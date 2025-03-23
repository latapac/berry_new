import { useEffect, useState } from 'react';  // Importing React hooks for state and side effects
import Grid from '@mui/material/Grid';  // Importing Grid component from MUI for layout management
import TotalOrderLineChartCard from './TotalOrderLineChartCard';  // Card with line chart for orders
import DefectiveProductsPieChart from '../DefectiveProductsPieChart';  // New component for pie chart
import { getMachineData } from "../../../backservice";  // Function to fetch machine data from backend
import { gridSpacing } from 'store/constant';  // Constant for consistent grid spacing
import { useLocation } from 'react-router';

export default function Production() {
  const [isLoading, setLoading] = useState(true);  
  const [machineData, setMachineData] = useState({}); 
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const serialNumber = queryParams.get('serial_number');

  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    getMachineData(serialNumber).then((data) => {  
      setMachineData(data); 
    });
  }, [serialNumber]);

  return (
    <Grid container spacing={gridSpacing}>  
    
      <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'row', gap: '2vw' }}>  
        <Grid item xs={6}>
          <TotalOrderLineChartCard isLoading={isLoading} data={machineData?.d} />  
        </Grid>
        <Grid item xs={4}>
          <DefectiveProductsPieChart isLoading={isLoading} data={machineData?.d} />  
        </Grid>
      </Grid>
    </Grid>
  );
}