import React from 'react';
import { SafeAreaView, View, Text } from 'react-native';
import { styles } from '../styles/FridgeScreen';

const FridgeScreen = () => {
  return (
    <View style = {styles.mainContainer}>
      <SafeAreaView style={styles.screenContainer}>
        <View style={styles.titleContainer}>
        <Text style={styles.title}> My Fridge</Text>
        </View>
        <View style={styles.fridgeContainer}>
        <Text style={styles.statusTxt}> Vegetable Status</Text>
          <View style={styles.cardFresh}>
            
          </View>
          <View style={styles.cardSpoiled}>
            
          </View>
          <View style={styles.cardMildSpoiled}>
            
          </View>
        
        </View>
      </SafeAreaView>
    </View>
  );
};

export default FridgeScreen;