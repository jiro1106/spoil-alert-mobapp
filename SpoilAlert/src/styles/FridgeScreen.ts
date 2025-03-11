import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window'); // Get screen size and for responsiveness

export const styles = StyleSheet.create({
  // mainContainer and screenContainer is a STANDARD
  mainContainer: {
    flex: 1,
  },
  screenContainer: {
    flex:1,
    alignItems:'center',
    backgroundColor: '#f0f0f0',
  },
  titleContainer: {
    marginTop:30,
    width:'85%',
  },
  title: {
    textAlign:'left',
    fontSize:45,
    fontWeight:'bold',
  },
  fridgeContainer:{
    backgroundColor: '#fcfcfc',
    flex:1,
    justifyContent:'flex-start',
    alignItems:'center',
    marginTop:20,
    width:'85%',
    borderRadius:25,
  },
  statusTxt:{
    fontSize:30,
    fontWeight:'bold',
    padding:20,
  },
  cardFresh:{
    backgroundColor:'rgb(30, 182, 25)',
    marginVertical: height * 0.015, // for scaling of screens
    height: height * 0.1, 
    width: width * 0.7, 
    padding: width * 0.025, // for scaling of screens
    borderRadius:15,
  },
  cardSpoiled:{
    backgroundColor:'#ff5742',
    marginVertical: height * 0.015, // for scaling of screens
    height: height * 0.1, 
    width: width * 0.7, 
    padding: width * 0.025, // for scaling of screens
    borderRadius:15,
  },
  cardMildSpoiled:{
    backgroundColor:'#f4c33f',
    marginVertical: height * 0.015, // for scaling of screens
    height: height * 0.1, 
    width: width * 0.7, 
    padding: width * 0.025, // for scaling of screens
    borderRadius:15,
  },
});
