import React from 'react';
import { SafeAreaView, View, Text, Image, TouchableOpacity } from 'react-native';
import { styles } from '../styles/HomeScreen';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Home: undefined;
  MainMenu: undefined;
};

const HomeScreen = () => {

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <View style = {styles.mainContainer}>
      <View style = {styles.bgContainer}>
          <Image source={require("../../assets/welcomeBG.png")} style={styles.background} />
      </View>
        <View style = {styles.textContainer}>
          <Text style={styles.phrase}>Your Companion in Handling Vegetable Spoilage</Text>
          <Text style={styles.subphrase}>
            Effortlessly monitor vegetable freshness and reduce waste with smart alerts
          </Text>
            <TouchableOpacity style={styles.startBtn} onPress={() =>navigation.navigate("MainMenu")}>
              <Text style={styles.btnText}>Get Started</Text>
            </TouchableOpacity>
        </View>
      </View>

  );
};

export default HomeScreen;
