import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window'); // get screen size and for responsiveness

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },  
  screenContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  imagesContainer: {
    flex:1,
    justifyContent:'flex-start',
    alignItems:'center',
    width: '100%',
    height: height * 0.9, 
    position: 'relative', 
  },
  lettuce: {
    position: 'absolute',
    transform: [{ rotate: '320deg' }],
    width: width * 0.9, 
    height: height * 0.4, 
    top: height * 0.04, 
    right: width * 0.6, 
  },
  carrot: {
    position: 'absolute',
    transform: [{ rotate: '35deg' }],
    width: width * 1.2, 
    height: height * 0.4, 
    top: height * -0.03, 
    left: width * 0.29, 
  },
  logo: {
    position: 'absolute',
    resizeMode: 'contain',
    top: height * 0.34, 
    width: width * 0.75, 
    height: height * 0.2, 
    paddingBottom:20,
    
  },
  textContainer: {
    marginTop:100,
    flex:1,
    justifyContent:'flex-start',
    alignItems:'center',
    width:'100%',
  },
  phrase: {
    paddingTop:20,
    fontSize:40,
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
