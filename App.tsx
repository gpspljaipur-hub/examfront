
import { StyleSheet, useColorScheme } from 'react-native';
import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import AppNavigator from './src/navigations/AppNavigator';
import Toast from 'react-native-toast-message';
import { LanguageProvider } from './src/context/LanguageContext';
import { Provider } from 'react-redux';
import { store } from './src/store/store';
function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <LanguageProvider>
          <AppNavigator />
        </LanguageProvider>
        <Toast position='top' />
      </Provider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
