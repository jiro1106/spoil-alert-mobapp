import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Fridge: undefined;
  StorageTips: undefined;
  SpoilageSigns: undefined;
  Settings: undefined;
  About: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const MainMenu = () => {
  const navigation = useNavigation<NavigationProp>(); 

  const menuItems = [
    { title: 'Check Fridge', icon: require('../../assets/fridgeIcon.png'), screen: 'Fridge' },
    { title: 'Vegetable Information', icon: require('../../assets/vegetableIcon.jpg'), screen: 'Information' },
  ];

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.header}>Welcome to Spoil Alert!</Text>
        <Text style={styles.subText}>Learn how to keep your veggies fresher for longer!</Text>
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.card}
              onPress={() => navigation.navigate(item.screen as keyof RootStackParamList)} 
            >
              <Image source={item.icon} style={styles.icon} />
              <Text style={styles.cardText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* About the App Section */}
         {/* 1 */}
        <View style={styles.aboutContainer}>
          <Text style={styles.aboutTitle}>About the App</Text>
          <Image 
          source={require('../../assets/sampleApp.png')}
          style={styles.aboutImg}
          resizeMode="contain"
          >
          </Image>

          <View style={styles.aboutDetailsContainer}>
            <Image
              source={require('../../assets/feature1.png')}
              style={styles.aboutIcon}
            >
            </Image>
            <View style={styles.aboutTextContainer}>
              <Text style={styles.featureTitle}>
              Smart Fridge Monitoring
              </Text>
              <Text style={styles.featureDescription}>
              Keep track of your vegetables and monitor their freshness in real-time using smart sensors.
              </Text>
              
            </View>
          </View>
          {/* 2 */}
          <View style={styles.aboutDetailsContainer}>
            <Image
              source={require('../../assets/feature2.png')}
              style={styles.aboutIcon}
            >
            </Image>
            <View style={styles.aboutTextContainer}>
              <Text style={styles.featureTitle}>
              Spoilage Detection
              </Text>
              <Text style={styles.featureDescription}>
              Get alerts when your vegetables are starting to spoil based on temperature, humidity, and gas sensor readings.
              </Text>
              
            </View>
          </View>
          {/* 3 */}
          <View style={styles.aboutDetailsContainer}>
            <Image
              source={require('../../assets/feature3.png')}
              style={styles.aboutIcon}
            >
            </Image>
            <View style={styles.aboutTextContainer}>
              <Text style={styles.featureTitle}>
              Storage Tips
              </Text>
              <Text style={styles.featureDescription}>
              Learn the best ways to store your veggies to extend their shelf life and reduce spoilage.
              </Text>
              
            </View>
          </View>
          {/* 4 */}
          <View style={styles.aboutDetailsContainer}>
            <Image
              source={require('../../assets/feature4.png')}
              style={styles.aboutIcon}
            >
            </Image>
            <View style={styles.aboutTextContainer}>
              <Text style={styles.featureTitle}>
              Eco-Friendly Mission
              </Text>
              <Text style={styles.featureDescription}>
              By helping reduce food waste, Spoil Alert contributes to a greener planet one veggie at a time!
              </Text>
              
            </View>
          </View>
        </View>
        
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    marginTop: 20,
  },
  subText: {
    marginTop: 5,
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 30,
  },
  menuContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  card: {
    width: 160,
    height: 150,
    backgroundColor: '#fcfcfc',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
  },
  cardText: {
    padding: 10,
    marginTop: 10,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  icon: {
    width: 60,
    height: 60,
  },
  aboutContainer: {
    width:'90%',
    marginTop: 30,
    paddingVertical: 10,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  aboutImg:{
    width:150,
    height:350,
    alignSelf: 'center',
  },
  aboutTitle: {
    marginTop:10,
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  aboutDetailsContainer: {
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    width:'100%',
    marginTop:30,
    marginBottom:30,
  },
  aboutTextContainer:{
    flexDirection:'column',
    width:'60%',
    marginLeft:20,
  },
  aboutIcon: {
    borderRadius:10,
    marginLeft:20,
    resizeMode:'contain',
    width:70,
    height:70,
  },
  featureTitle:{
    fontWeight:'bold',
    fontSize:20,
  },
  featureDescription: {
    marginTop:5,
    fontSize: 16,
    color: '#555',
    textAlign: 'left',
  },
});

export default MainMenu;
