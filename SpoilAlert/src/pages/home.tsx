import React from 'react';
import { SafeAreaView, View, Text, Image, ImageBackground, TouchableOpacity } from 'react-native';
import { styles } from '../styles/home';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Home: undefined;
  MainMenu: undefined;
};

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'Home'>;
};

const Home: React.FC<Props> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <Image source={require("../../assets/logo.png")} style={styles.logo} />
      <View style={styles.rectangle} />
      <ImageBackground source={require("../../assets/carrot-transparent.png")} style={styles.carrot} />
      <ImageBackground source={require("../../assets/lettuce-transparent.png")} style={styles.lettuce} />
      <Text style={styles.phrase}>Your Companion in Handling Vegetable Spoilage</Text>
      <Text style={styles.subphrase}>Effortlessly monitor vegetable freshness and reduce waste with smart alerts</Text>
      <View style={styles.btnContainer}>
        <TouchableOpacity style={styles.startBtn} onPress={() => navigation.replace('MainMenu')}>
          <Text style={styles.btnText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Home;
