

// project imports
import MainLayout from 'layout/MainLayout';
import AuditTrail from './Audit_Trial';
import Dashboard from '../views/dashboard2/Default';
import OEE from '../views/OEE/Default';
import Production from '../views/Production/Default';
import AlarmReport from './Alarm';
import Protected from './AuthLayout';
import Active_alarm from '../views/Active_alarm/Default';
import Batch_details from '../views/batch_details';
import OEE_graph from '../views/OEE/Default/OEE_graph';
import UserManagementPage from '../views/UserManagementPage';


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
      element: <Batch_details />
    },
    {
      path: 'alluser',
      element: <UserManagementPage />
    },
    {
      path: 'OEE_graph',
      element: <OEE_graph />
    },
    {
      path: 'OEE',
      element: <OEE />
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
    }
  ]
};

export default MainRoutes;
