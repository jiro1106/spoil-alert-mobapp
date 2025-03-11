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
      <SafeAreaView style={styles.screenContainer}>
        <View style = {styles.imagesContainer}>
          <Image source={require("../../assets/lettuce-transparent.png")} style={styles.lettuce} />
          <Image source={require("../../assets/carrot-transparent.png")} style={styles.carrot} />
          <Image source={require("../../assets/logo.png")} style={styles.logo} />
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
      </SafeAreaView>
    </View>
  );
};

export default HomeScreen;
