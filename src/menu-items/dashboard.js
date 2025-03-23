// assets
import { IconDashboard } from '@tabler/icons-react';
import { IconNotebook } from '@tabler/icons-react';
import { IconAlarm } from '@tabler/icons-react';
import { IconDetails } from '@tabler/icons-react';

// constant
const icons = { IconDashboard };
const icon = { IconNotebook };
const icona = { IconAlarm };
const iconi = { IconNotebook };
const iconb = { IconAlarm };
const iconbs = {IconDetails};
// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
  id: 'dashboard',
  title: 'Dashboard',
  type: 'group',
  children: [
    {
      id: 'default',
      title: 'Dashboard',
      type: 'item',
      url: '/dashboard/default',
      icon: icons.IconDashboard,
      breadcrumbs: false
    },
   
    {
      id: 'default',
      title: 'Audit2',
      type: 'item',
      url: '/Audit2',
      icon: iconi.IconNotebook,
      breadcrumbs: false
    },
    {
      id: 'default',
      title: 'Active_alarm',
      type: 'item',
      url: '/Active_alarm',
      icon: iconb.IconAlarm,
      breadcrumbs: false
    },
    {
      id: 'audit',
      title: 'Audit Trail',
      type: 'item',
      url: '/audit?serial_number=PAC24250046',
      icon: icon.IconNotebook,
      breadcrumbs: false
    },
    {
      id: 'alarm',
      title: 'Alarm',
      type: 'item',
      url: '/alarm?serial_number=PAC24250046',
      icon: icona.IconAlarm,
      breadcrumbs: false
    }


  ]
};

export default dashboard;
