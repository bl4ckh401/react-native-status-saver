import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useContext, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import StackNavigator from './screens/StackNavigator';
import StatusProvider, { StatusContext } from './StatusProvider';

export default function App({ navigation }) {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusProvider>
          <StackNavigator />
        </StatusProvider>
      </NavigationContainer>
    </SafeAreaProvider>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
