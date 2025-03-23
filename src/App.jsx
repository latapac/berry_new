import { RouterProvider } from 'react-router-dom';

// routing
import router from 'routes';

// project imports
import NavigationScroll from 'layout/NavigationScroll';
import { Provider } from 'react-redux';
import ThemeCustomization from 'themes';
import store from './store/store';

// auth provider

// ==============================|| APP ||============================== //

export default function App() {
  return (
    <ThemeCustomization>
      <NavigationScroll>
        <Provider store={store}>
          <RouterProvider router={router} />
        </Provider>
      </NavigationScroll>
    </ThemeCustomization>
  );
}
