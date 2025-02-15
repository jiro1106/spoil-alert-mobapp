import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    
  },
  logo: {
    position:'absolute',
    resizeMode: "contain",
    marginTop:350,
    zIndex:2,
  },
  rectangle: {
    width: 300,
    height: 150,
    borderRadius:20,
    top:300,
    zIndex:1,
    
  },
  carrot: {
    position:'absolute',
    width:"100%",
    height:"70%",
    marginTop:15,
    left:200,
    zIndex:0,
  },
  lettuce: {
    position:'absolute',
    width:"100%",
    height:"65%",
    right:200,
    marginTop:50,
    zIndex:0,
  },
  phrase: {
    fontSize:45,
    fontWeight:700,
    textAlign:'center',
    marginHorizontal:5,
    marginTop:300
  },
  subphrase: {
    textAlign:'center',
    marginHorizontal:35,
    color:'#3B404A',
    fontSize:18,
    marginTop:20
  },
  btnContainer:{
    flex:1,
    alignItems:'center',
    justifyContent:'center',
    width:'100%',
  },
  startBtn: {
    marginTop:0,
    height:'45%',
    width:'85%',
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
