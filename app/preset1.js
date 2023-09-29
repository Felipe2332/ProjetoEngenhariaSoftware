import React, { useState } from 'react';
import { View, Text, TouchableOpacity,ImageBackground} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../styles/styles'; 
import Icon from 'react-native-vector-icons/FontAwesome';


import BleManager from 'react-native-ble-manager';
import { NativeEventEmitter, NativeModules } from 'react-native';
import { stringToBytes } from "convert-string";

const BleManagerModule = NativeModules.BleManager;
const BleManagerEmitter = new NativeEventEmitter(BleManagerModule);



export default function PresetUm () {

    const navigation = useNavigation();
    let peripheralId = "B0:A7:32:15:39:40"

    BleManager.start({ showAlert: false }).then(() => {
      // Success code
      console.log("Modulo ta bao");
    });
    BleManager.retrieveServices(peripheralId).then(
      (peripheralInfo) => {
        // Success code
        console.log("Peripheral info:", peripheralInfo);
      }
    );
  

    
   

    return(
        <View style={styles.containerTelaPreset}>
          <ImageBackground source={require('../assets/imagemFundoMinimalista.jpg')} style={styles.image}>

            <Text style={styles.title}>Tela de Preset 1</Text>
            

            <TouchableOpacity onPress={() => {
          navigation.goBack();}} style={styles.botaoVoltar}>
            <Icon name="arrow-left"/>
          </TouchableOpacity>

          <TouchableOpacity ><Text style={{color:"white",alignItems:"center",justifyContent:"center",fontSize:35}}>Clique aqui para acender o led</Text></TouchableOpacity>
          </ImageBackground>
        </View>
        
    )

};
