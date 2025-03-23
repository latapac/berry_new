
import MinimalLayout from 'layout/MinimalLayout';

import LoginPage from 'views/pages/authentication/Login'
import RegisterPage from 'views/pages/authentication/Register'

// ==============================|| AUTHENTICATION ROUTING ||============================== //

const AuthenticationRoutes = {
  path: '/',
  element: <MinimalLayout />,
  children: [
    {
      path: '/pages/login',
      element: <LoginPage />
    },
    {
      path: '/pages/register',
      element: <RegisterPage />
    }
  ]
};

export default AuthenticationRoutes;
