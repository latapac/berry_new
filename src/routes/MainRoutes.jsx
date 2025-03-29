

// project imports
import MainLayout from 'layout/MainLayout';
import AuditTrail from './Audit_Trial';
import Dashboard from '../views/dashboard2/Default';
import OEE from '../views/OEE/Default';
import Production from '../views/Production/Default';
import AlarmReport from './Alarm';
import Protected from './AuthLayout';
import Active_alarm from '../views/Active_alarm/Default';
import BatchDetails from '../views/Batchdetails';
import OeeGraph from '../views/OeeGraph';
import UserManagementPage from '../views/UserManagementPage';
import MachineGraph from '../views/MachineGraph';


// dashboard routing
import DashboardDefault from 'views/dashboard/Default'


// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <Protected><MainLayout /></Protected>,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: 'batch',
      element: <BatchDetails />
    },
    {
      path: 'alluser',
      element: <UserManagementPage />
    },
    {
      path: 'oeeGraph',
      element: <OeeGraph />
    },
    {
      path: 'OEE',
      element: <OEE />
    },
    {
      path:'machineGraph',
      element: <MachineGraph/>
    },
    {
      path: 'Active_alarm',
      element: <Active_alarm />
    },
    {
      path: 'Production',
      element: <Production/>
    },
    {
      path: 'audit',
      element: <AuditTrail />
    },
    {
      path: 'dash',
      element: <Dashboard />
    },
    {
      path: '/alarm',
      element: <AlarmReport />
    },
    {
      path: '/batchDetails ',
      element: <BatchDetails />
    }
  ]
};

export default MainRoutes;
