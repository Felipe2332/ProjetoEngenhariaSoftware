/* src/styles/styles.jsx */

import {StyleSheet, Dimensions} from 'react-native';

const windowHeight = Dimensions.get('window').height;
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: windowHeight,
    paddingHorizontal: 10,
    backgroundColor:'#777',
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
    marginBottom:50
    
  },
  textButtonPreset:{
    fontSize:30,
  },
  botaoVoltar:{
    position: 'absolute',
    marginBottom:10,
    marginTop:5,
    padding:10,
    left: 10,
    height:"6%",
    width:"20%",
    backgroundColor:"#801818",
    borderTopEndRadius:20,
    borderBottomLeftRadius:20,
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
    resizeMode: 'cover',
    justifyContent: 'space-between',
    alignItems:'center',
    
  },
  scrollContainer: {
    padding: 16,
  },
  title: {
    fontSize: 30,
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 40,
  },
  subtitle: {
    fontSize: 24,
    marginBottom: 10,
    marginTop: 20,
  },
  scanButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  scanButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  noDevicesText: {
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
  },
  deviceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  deviceItem: {
    marginBottom: 10,
  },
  deviceName: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  deviceInfo: {
    fontSize: 14,
  },
  deviceButton: {
    backgroundColor: 'green',
    padding: 8,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
});