/* src/styles/styles.jsx */

import {StyleSheet, Dimensions} from 'react-native';

const windowHeight = Dimensions.get('window').height;
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: windowHeight,
    paddingHorizontal: 10,
    backgroundColor:"black"
  },
  imageIndex:{
    height:"100%",
    width:"100%",
    flex: 1,
  },
  containerTelaPreset:{
    flex: 1,
    flexDirection:"column",
    justifyContent:"space-between",
    alignContent:"center",
    alignItems:"center",
    
  },
  presetButtonTop: {
    flex: 0.15,
    backgroundColor: 'grey',
    borderWidth: 3,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    justifyContent:"center",
    textAlign:"center",
    alignItems:"center",
    width:"90%",
  },
  presetButtonMiddle: {
    flex: 0.15,
    backgroundColor: 'beige',
    borderWidth: 3,
    justifyContent:"center",
    textAlign:"center",
    alignItems:"center",
    width:"90%",
  },
  presetButtonBottom: {
    flex: 0.15,
    backgroundColor: 'pink',
    borderWidth: 3,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    justifyContent:"center",
    textAlign:"center",
    alignItems:"center",
    width:"90%",
    marginBottom:50,
  },
  textButtonPreset:{
    fontSize:30,
    fontFamily:"Inter-Black",
  },
  botaoVoltar:{
    position: 'absolute',
    marginBottom:10,
    marginTop:10,
    padding:10,
    left: 10,
    height:"6%",
    width:"10%",
    backgroundColor:"#801818",
    borderRadius:25,
    borderCurve:"circular",
    justifyContent:"center",
    textAlign:"center",
    alignItems:"center",
    
  },
  textButtonVoltar:{
    fontSize:30,
    color:"white",
  },
  image:{
    height:"100%",
    width:"100%",
    flex: 1,
    justifyContent: 'space-between',
    alignItems:'center',
    
  },
  
  scrollContainer: {
    padding: 16,
  },
  title: {
    fontFamily:"Inter-Black",
    fontSize: 30,
    color:"white",
    textAlign: 'center',
    marginTop:50,
    marginRight:50,
    marginLeft:50,
    marginBottom:15,

  },
  subtitle: {
    fontFamily:"Inter-Black",
    color:"white",
    fontSize: 24,
    marginBottom: 10,
    marginTop: 20,
    alignSelf:"center",
  },
  scanButton: {
    fontFamily:"Inter-Black",
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  scanButtonText: {
    fontFamily:"Inter-Black",
    color: 'white',
    textAlign: 'center',
  },
  noDevicesText: {
    fontFamily:"Inter-Black",
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
    color:"white",
  },
  deviceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  deviceItem: {
    marginBottom: 10,
    color:"white",
  },
  deviceName: {
    fontSize: 22,
    fontWeight: 'bold',
    color:"white",
  },
  deviceInfo: {
    fontSize: 14,
    color:"white",
  },
  deviceButton: {
    backgroundColor: 'green',
    padding: 8,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
});