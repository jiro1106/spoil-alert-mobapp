import { StyleSheet, useWindowDimensions, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window'); // get screen size and for responsiveness

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },  
  bgContainer: {
    flex:0.7,
    width: '100%',
  },
  background:{
    width: '100%',               
    height: '100%',                                
    resizeMode: 'cover', 
  },
  textContainer: {
    marginTop:-300,
    flex:0.3,
    justifyContent:'flex-start',
    alignItems:'center',
    width:'100%',
    backgroundColor:'#ffffff',
  },
  phrase: {
    fontSize:43,
    fontWeight:700,
    textAlign:'center',
    marginHorizontal:5,
  },
  subphrase: {
    textAlign:'center',
    marginHorizontal:35,
    color:'#3B404A',
    fontSize:20,
    marginTop:30
  },
  startBtn: {
    marginTop:30,
    width: width * 0.85, 
    height: height * 0.07, 
    backgroundColor:'black',
    borderRadius:30,
  },
  btnText:{
    color:'white',
    fontSize:18,
    fontWeight:'bold',
    textAlign:'center',
    marginTop:'auto',
    marginBottom:'auto',
    paddingHorizontal:5,
  }
});
