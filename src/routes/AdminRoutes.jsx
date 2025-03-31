import { elements } from "chart.js"
import AdminIndex from "../admin/AdminIndex"
import AdminLogin from "../admin/adminLogin"

const adminRoutes = [{
    path: 'admin',
    element: <AdminLogin />,
  },{
    path:"adminIndex",
    element: <AdminIndex />
  }]

export default adminRoutes