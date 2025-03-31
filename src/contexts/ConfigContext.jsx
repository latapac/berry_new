import PropTypes from 'prop-types';
import { createContext, useCallback } from 'react';

// project imports
import defaultConfig from 'config';
import useLocalStorage from 'hooks/useLocalStorage';

// initial state
const initialState = {
  ...defaultConfig,
  onChangeFontFamily: () => {},
  onChangeBorderRadius: () => {},
  onReset: () => {}
};

// ==============================|| CONFIG CONTEXT & PROVIDER ||============================== //

const ConfigContext = createContext(initialState);

function ConfigProvider({ children }) {
  const [config, setConfig] = useLocalStorage('berry-config-vite-ts', defaultConfig);

  const onChangeFontFamily = useCallback((fontFamily) => {
    setConfig((prevConfig) => ({
      ...prevConfig,
      fontFamily
    }));
  }, [setConfig]);

  const onChangeBorderRadius = useCallback((event, newValue) => {
    setConfig((prevConfig) => ({
      ...prevConfig,
      borderRadius: newValue
    }));
  }, [setConfig]);

  const onReset = useCallback(() => {
    setConfig(defaultConfig);
  }, [setConfig]);

  return (
    <ConfigContext.Provider
      value={{
        ...config,
        onChangeFontFamily,
        onChangeBorderRadius,
        onReset
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
}

ConfigProvider.propTypes = {
  children: PropTypes.node.isRequired // Added isRequired if children is mandatory
};

export { ConfigProvider, ConfigContext };