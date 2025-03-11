import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window'); // Get screen size and for responsiveness

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  screenContainer: {
    flex:1,
    alignItems:'center',
  }
});
