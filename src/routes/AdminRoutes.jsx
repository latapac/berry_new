import AdminIndex from "../admin/AdminIndex"
import AdminLogin from "../admin/adminLogin"
import AdminMachine from "../admin/AdminMachine"

const adminRoutes = [{
    path: 'admin',
    element: <AdminLogin />,
  },{
    path:"adminIndex",
    element: <AdminIndex />
  },{
    path:"adminMachine",
    element: <AdminMachine />
  }]

export default adminRoutes