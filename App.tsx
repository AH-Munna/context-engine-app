import React from 'react';
import Routes from './app/Navigations/Route';
import {Provider} from 'react-redux';
import store from './app/Redux/Store';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider as PaperProvider} from 'react-native-paper';

const App = () => {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <Provider store={store}>
          <Routes />
        </Provider>
      </PaperProvider>
    </SafeAreaProvider>
  );
};

export default App;
