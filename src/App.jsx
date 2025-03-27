import { RouterProvider } from 'react-router-dom';

import router from 'routes';

import NavigationScroll from 'layout/NavigationScroll';
import { Provider } from 'react-redux';
import ThemeCustomization from 'themes';
import store from './store/store';

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
