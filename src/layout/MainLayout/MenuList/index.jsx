import { useEffect, useState } from 'react';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { useSelector } from 'react-redux';
import { getMachines } from '../../../backservice';
import { useNavigate } from 'react-router';

function MenuList() {
  const [expanded, setExpanded] = useState(null);
  const [machines,setMachines] = useState([])
  const navigate = useNavigate()
  
  const userData = useSelector((state) => state.authSlice.userData);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : null);
  };

  useEffect(()=>{
    getMachines(userData?.c_id).then((data)=>{
      const machinelist = data?.map((machine)=>{
        return  {
          id: machine._id,
          name: machine.serial_number,
          subItems: [
            { id: 'dash', name: 'Analytics' },
            { id: 'batch', name: 'Batch Details' },
            { id: 'production', name: 'Production Details' },
            { id: 'oee', name: 'OEE Details' },
            { id: 'oee', name: 'Report' },
          ],
        }
      })
      setMachines(machinelist)
    })
  },[userData])

  return (
    <Box sx={{ mt: 1.5 }}>
      <Accordion sx={{ boxShadow: 'none' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Machines</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            {machines?.map((machine) => (
              <Accordion
                key={machine.id}
                expanded={expanded === machine.id}
                onChange={handleChange(machine.id)}
                sx={{ boxShadow: 'none' }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>{machine.name}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List>
                    {machine.subItems.map((subItem) => (
                      <ListItem button key={subItem.id}  onClick={()=>{navigate(`/${subItem.id}?serial_number=${machine.name}`)}}>
                        <ListItemText primary={subItem.name} />
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}

export default MenuList;