

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import AuditTrail from './Audit_Trial';
import Dashboard from '../views/dashboard2/Default';
import OEE from '../views/OEE/Default';
import Production from '../views/Production/Default';
import AlarmReport from './Alarm';
import Protected from './AuthLayout';
import Audit2 from '../views/Audit2/Default';
import Active_alarm from '../views/Active_alarm/Default';
import Batch_details from '../views/batch_details';


// dashboard routing
import DashboardDefault from 'views/dashboard/Default'

// utilities routing
import UtilsTypography from 'views/utilities/Typography'
import UtilsColor from 'views/utilities/Color'
import UtilsShadow from 'views/utilities/Shadow'

// sample page routing
import SamplePage from 'views/sample-page'

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
      path: 'typography',
      element: <UtilsTypography />
    },
    {
      path: 'batch',
      element: <Batch_details />
    },
    {
      path: 'OEE',
      element: <OEE />
    },
    {
      path: 'Audit2',
      element: <Audit2 />
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
      path: 'color',
      element: <UtilsColor />
    },
    {
      path: 'shadow',
      element: <UtilsShadow />
    },
    {
      path: '/sample-page',
      element: <SamplePage />
    },
    {
      path: '/alarm',
      element: <AlarmReport />
    }
  ]
};

export default MainRoutes;
