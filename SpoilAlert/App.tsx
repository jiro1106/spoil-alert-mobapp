import { View, StatusBar } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <View style={{ flex: 1, marginTop: StatusBar.currentHeight }}>
      <AppNavigator />
    </View>
  );
} 