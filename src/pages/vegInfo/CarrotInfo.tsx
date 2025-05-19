import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const CarrotInfo = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        {/* Main Content */}
        <View style={styles.container}>
          <View style={styles.card}>
            <Text style={styles.title}>Carrot</Text>
            <Image
              source={require('../../../assets/carrot2.jpg')}
              style={styles.image}
              resizeMode="cover"
            />
            <View style={styles.textWrapper}>
              <Text style={styles.subTitle1}>WHY IT SPOILS?</Text>

              <Text style={styles.description1}>
                <Text style={styles.boldText}>Excess Moisture:</Text> Leaves retain water, leading to wilting and microbial growth.
              </Text>
              <Text style={styles.description1}>
                <Text style={styles.boldText}>Bruising:</Text> Damaged leaves decay quickly.
              </Text>
              <Text style={styles.description1}>
                <Text style={styles.boldText}>Temperature Sensitivity:</Text> Lettuce is highly perishable if exposed to temperatures above refrigeration levels.
              </Text>
              <Text style={styles.description1}>
                <Text style={styles.boldText}>Fungal Growth:</Text> Poor air circulation encourages mold.
              </Text>
              <Text style={styles.subTitle2}>STORAGE GUIDE:</Text>
              <Text style={styles.description2}>
              Can last 3–5 days at room temperature; stays fresh for 2–3 weeks in the refrigerator when stored in a crisper drawer or airtight bag.
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
    paddingBottom: 40,
  },
  backButton: {
    marginTop: 10,
    marginLeft: 15,
    alignSelf: 'flex-start',
    backgroundColor: '#000',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  backText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  container: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  card: {
    width: '100%',
    backgroundColor: '#fcfcfc',
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    paddingBottom: 20,
  },
  image: {
    width: 300,
    height: 200,
    alignSelf: 'center',
  },
  textWrapper: {
    padding: 20,
  },
  title: {
    textAlign: 'center',
    fontSize: 40,
    fontWeight: 'bold',
    color: '#222',
    padding: 10,
  },
  subTitle1: {
    color: 'red',
    textAlign: 'center',
    fontSize: 30,
    fontWeight: '900',
  },
  subTitle2: {
    color:'black',
    textAlign:'left',
    fontSize:25,
    fontWeight:'800',
    marginTop:20,
  },
  description1: {
    marginTop: 20,
    fontSize: 18,
    color: 'black',
    textAlign:'justify',
  },
  description2: {
    marginTop: 5,
    fontSize: 18,
    color: 'black',
    textAlign:'justify',
  },
  boldText: {
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default CarrotInfo;
