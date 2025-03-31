import { createHashRouter } from 'react-router-dom';

// routes
import AuthenticationRoutes from './AuthenticationRoutes';
import MainRoutes from './MainRoutes';
import adminRoutes from './AdminRoutes';

// ==============================|| ROUTING RENDER ||============================== //

const router = createHashRouter([MainRoutes, AuthenticationRoutes,adminRoutes], {
  basename: import.meta.env.VITE_APP_BASE_NAME
});

export default router;
