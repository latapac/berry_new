import { useEffect, useState } from 'react';

// material-ui
import Grid from '@mui/material/Grid2';

// project imports
import EarningCard from './EarningCard';
import {  getMachines } from "../../../backservice"
import { gridSpacing } from 'store/constant';
import { useSelector } from 'react-redux';

export default function Dashboard() {
  const [isLoading, setLoading] = useState(true);
  const [machineData, setMachineData] = useState([])

  const userData = useSelector((state) => state.authSlice.userData);

  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    if (userData?.c_id) {
      getMachines(userData?.c_id).then((data)=>{
    
        setMachineData(data)
       })
    }
  
  }, [])
  return (

    <Grid container spacing={gridSpacing}>
      <Grid size={12}>
        <Grid container spacing={gridSpacing}>
          {machineData && machineData?.map((data) => {
            return (
              <Grid size={{ lg: 3, md: 6, sm: 6, xs: 12 }}>
                <EarningCard isLoading={isLoading} data={data} />
              </Grid>
            )
          })}
        </Grid>
      </Grid>

    </Grid>
  );
}
