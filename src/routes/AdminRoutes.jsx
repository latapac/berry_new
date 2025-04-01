import AdminIndex from "../admin/AdminIndex"
import AdminLogin from "../admin/adminLogin"
import AdminMachine from "../admin/AdminMachine"
import AuthProtected from "./AdminAuth"

const adminRoutes = [{
    path: 'admin',
    element: <AdminLogin />,
  },{
    path:"adminIndex",
    element:<AuthProtected><AdminIndex /></AuthProtected> 
  },{
    path:"adminMachine",
    element:<AuthProtected> <AdminMachine /> </AuthProtected>
  }]

export default adminRoutes