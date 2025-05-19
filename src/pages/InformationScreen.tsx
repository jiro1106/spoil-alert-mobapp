import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, Image } from 'react-native';
import { styles } from '../styles/InformationScreen';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Define your stack params here
type RootStackParamList = {
  Home: undefined;
  MainMenu: undefined;
  Okra: undefined;
  Lettuce: undefined;
  Carrot: undefined;
};

type InfoScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const InformationScreen = () => {
  const navigation = useNavigation<InfoScreenNavigationProp>();

  return (
    <View style={styles.mainContainer}>
      <SafeAreaView style={styles.screenContainer}>
        {/* Title Section */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Choose a Vegetable</Text>
        </View>

        {/* Cards Section */}
        <View style={styles.cardContainer}>
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("Okra")}>
            <Image source={require("../../assets/okra.png")} style={styles.cardImage} />
            <View style={styles.textContainer}>
              <Text style={styles.cardTitle}>Okra</Text>
              <Text style={styles.cardSubTitle}>
                A nutrient-rich green vegetable with a mild flavor and a slimy texture when cooked, commonly used in soups and stews.
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("Lettuce")}>
            <Image source={require("../../assets/lettuce-transparent.png")} style={styles.cardImage} />
            <View style={styles.textContainer}>
              <Text style={styles.cardTitle}>Lettuce</Text>
              <Text style={styles.cardSubTitle}>
                A leafy green, often used fresh in salads and wraps, known for its crisp texture and mild taste.
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("Carrot")}>
            <Image source={require("../../assets/carrot.jpg")} style={styles.cardImage} />
            <View style={styles.textContainer}>
              <Text style={styles.cardTitle}>Carrot</Text>
              <Text style={styles.cardSubTitle}>
                A crunchy, sweet root vegetable, rich in beta-carotene and perfect for snacking, cooking, or juicing.
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default InformationScreen;
