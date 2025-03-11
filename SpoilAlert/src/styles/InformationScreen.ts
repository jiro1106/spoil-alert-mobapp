import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window'); // get screen dimensions

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  screenContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: width * 0.05, // responsive padding
  },
  titleContainer: {
    paddingVertical: height * 0.01, // for scaling of screens
    paddingHorizontal: width * 0.12,
    borderRadius: 10,
    marginTop: height * 0.03, // for scaling of screens
  },
  title: {
    fontSize: width * 0.1, // for scaling of screens
    fontWeight: 'bold',
    color: 'black',
    textAlign:'center',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '100%',
    marginBottom:20,
    
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fcfcfc',
    borderRadius: 15,
    marginVertical: height * 0.015, // for scaling of screens
    height: height * 0.18, 
    width: width * 0.9, 
    padding: width * 0.025, // for scaling of screens
    alignItems: 'center',
    
  
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 }, // Direction of shadow
    shadowOpacity: 0.2, // Transparency
    shadowRadius: 5, // Blur effect
  
  // Shadow for Android
    elevation: 5, // Higher value = stronger shadow
  },
  cardImage: {
    width: width * 0.3, // for scaling of screens
    height: width * 0.3,
    borderRadius: 10,
    marginRight: width * 0.025, // for scaling of screens
  },
  textContainer: {
    flex: 1, 
    flexDirection: 'column', 
    justifyContent: 'center',
    marginLeft: width * 0.015,
  },
  cardTitle: {
    fontSize: width * 0.07, // for scaling of screens
    fontWeight: 'bold',
    color: 'black',
    marginBottom: height * 0.005, 
  },
  cardSubTitle: {
    fontSize: width * 0.04, // for scaling of screens
    color: 'black',
    textAlign:'justify',
  },
});
