
import MinimalLayout from 'layout/MinimalLayout';

import LoginPage from 'views/pages/authentication/Login'
const AuthenticationRoutes = {
  path: '/',
  element: <MinimalLayout />,
  children: [
    {
      path: '/pages/login',
      element: <LoginPage />
    }
  ]
};

export default AuthenticationRoutes;
