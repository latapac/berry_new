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
  const [reportExpanded, setReportExpanded] = useState(null);
  const [machines, setMachines] = useState([]);
  const navigate = useNavigate();
  
  const userData = useSelector((state) => state.authSlice.userData);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : null);
  };

  const handleReportChange = (panel) => (event, isExpanded) => {
    setReportExpanded(isExpanded ? panel : null);
  };

  useEffect(() => {
    getMachines(userData?.c_id).then((data) => {
      const machinelist = data?.map((machine) => {
        return {
          id: machine._id,
          name: machine.serial_number,
          subItems: [
            { id: 'dash', name: 'Analytics' },
            { id: 'batch', name: 'Batch Details' },
            { id: 'production', name: 'Production Details' },
            { id: 'oee', name: 'OEE Details' },
            { id: 'Active_alarm', name: 'Active Alarm' },
            { 
              id: 'report', 
              name: 'Report',
              subItems: [
                { id: 'audit', name: 'Audit Report' },
                { id: 'alarm', name: 'Alarm Report' }
              ]
            },
          ],
        }
      })
      setMachines(machinelist)
    })
  }, [userData])

  const renderSubItems = (subItems, machineName) => {
    return subItems.map((subItem) => {
      if (subItem.subItems) {
        // This is a report item with nested subitems
        return (
          <Accordion
            key={`${machineName}-${subItem.id}`}
            expanded={reportExpanded === `${machineName}-${subItem.id}`}
            onChange={handleReportChange(`${machineName}-${subItem.id}`)}
            sx={{ boxShadow: 'none', margin: '0 !important' }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <ListItemText primary={subItem.name} />
            </AccordionSummary>
            <AccordionDetails sx={{ padding: 0 }}>
              <List sx={{ padding: 0 }}>
                {subItem.subItems.map((nestedItem) => (
                  <ListItem 
                    button 
                    key={nestedItem.id}  
                    onClick={() => { navigate(`/${nestedItem.id}?serial_number=${machineName}`) }}
                    sx={{ pl: 4 }}
                  >
                    <ListItemText primary={nestedItem.name} />
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        );
      }
      
      // Regular subitem
      return (
        <ListItem 
          button 
          key={subItem.id}  
          onClick={() => { navigate(`/${subItem.id}?serial_number=${machineName}`) }}
        >
          <ListItemText primary={subItem.name} />
        </ListItem>
      );
    });
  };

  return (
    <Box sx={{ }}>
      <Accordion sx={{ boxShadow: 'none' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} >
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
                    {renderSubItems(machine.subItems, machine.name)}
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