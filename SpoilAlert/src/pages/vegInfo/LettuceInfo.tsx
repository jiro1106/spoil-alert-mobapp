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

const LettuceInfo = () => {
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
            <Text style={styles.title}>Lettuce</Text>
            <Image
              source={require('../../../assets/lettuce2.jpg')}
              style={styles.image}
              resizeMode="cover"
            />
            <View style={styles.textWrapper}>
              <Text style={styles.subTitle1}>WHY IT SPOILS?</Text>

              <Text style={styles.description1}>
                <Text style={styles.boldText}>Dehydration:</Text> Without proper humidity, carrots lose moisture, becoming dry and shriveled.
              </Text>
              <Text style={styles.description1}>
                <Text style={styles.boldText}>Bacterial Contamination:</Text> Improper cleaning or storage can lead to rot.
              </Text>
              <Text style={styles.description1}>
                <Text style={styles.boldText}>Ethylene Gas Exposure:</Text> Nearby fruits like apples can cause carrots to spoil faster.
              </Text>
              <Text style={styles.description1}>
                <Text style={styles.boldText}>High Temperature:</Text> Storing in warm conditions speeds up spoilage.
              </Text>
              <Text style={styles.subTitle2}>STORAGE GUIDE:</Text>
              <Text style={styles.description2}>
              Spoils within 1–2 days at room temperature; stays fresh for 5–7 days in the refrigerator if kept dry in a plastic bag or container with paper towels to absorb moisture.
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
    borderColor: '#000',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
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
    textAlign:'justify'
  },
});

export default LettuceInfo;
