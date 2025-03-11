import React from 'react';
import { SafeAreaView, View, Text } from 'react-native';
import { styles } from '../styles/MainMenuScreen';

const MainMenuScreen = () => {
  return (
    <View style = {styles.mainContainer}>
      <SafeAreaView style={styles.screenContainer}>
        <Text> This is Main Menu</Text>
      </SafeAreaView>
    </View>
  );
};

export default MainMenuScreen;