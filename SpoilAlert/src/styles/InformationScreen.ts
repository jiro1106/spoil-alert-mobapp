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
    paddingHorizontal: width * 0.05, 
  },
  titleContainer: {
    paddingVertical: height * 0.01, 
    paddingHorizontal: width * 0.12,
    borderRadius: 10,
    marginTop: height * 0.03, 
  },
  title: {
    fontSize: width * 0.1, 
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
    marginVertical: height * 0.015, 
    height: height * 0.18, 
    width: width * 0.9, 
    padding: width * 0.025, 
    alignItems: 'center',
    
  
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 5, 
  
  // Shadow for Android
    elevation: 5, 
  },
  cardImage: {
    width: width * 0.3, 
    height: width * 0.3,
    borderRadius: 10,
    marginRight: width * 0.025, 
  },
  textContainer: {
    flex: 1, 
    padding:5,
    flexDirection: 'column', 
    justifyContent: 'center',
    marginLeft: width * 0.015,
  },
  cardTitle: {
    fontSize: width * 0.07, 
    fontWeight: 'bold',
    color: 'black',
    marginBottom: height * 0.005, 
  },
  cardSubTitle: {
    fontSize: 15, 
    fontWeight: 400,
    color: 'black',
    textAlign:'justify',
  },
});
