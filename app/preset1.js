import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity,ImageBackground} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../styles/styles'; 
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';


import BleManager from 'react-native-ble-manager';
import { NativeEventEmitter, NativeModules } from 'react-native';
import { stringToBytes } from "convert-string";

const BleManagerModule = NativeModules.BleManager;
const BleManagerEmitter = new NativeEventEmitter(BleManagerModule);


export default function PresetUm () {

    const navigation = useNavigation();
    const [isLedOn, setIsLedOn] = useState(false);
    const [isLed1On, setIsLed1On] = useState(false);
    const [isLed2On, setIsLed2On] = useState(false);
    const [isLed3On, setIsLed3On] = useState(false);
    const [isLed4On, setIsLed4On] = useState(false);
    const [isLed5On, setIsLed5On] = useState(false);
    const [isLed6On, setIsLed6On] = useState(false);
    const [isLed7On, setIsLed7On] = useState(false);
    const [isLed8On, setIsLed8On] = useState(false);


    
    // Função para salvar o estado atual dos LEDs em um preset
    const [presets, setPresets] = useState({
      preset1: [false, false, false, false, false, false, false, false],
      preset2: [false, false, false, false, false, false, false, false],
      preset3: [false, false, false, false, false, false, false, false],
      
    });
    
    const salvarPreset = async (presetName) => {
      let newState = [isLed1On, isLed2On, isLed3On,isLed4On,isLed5On,isLed6On,isLed7On,isLed8On];
      try {
        await AsyncStorage.setItem(presetName, JSON.stringify(newState));
        console.log(`Estado salvo para ${presetName}: ${newState}`);
      } catch (error) {
        console.log(error);
      }
    };

    const handleSave = (presetName) => {
      // Salva o estado atual dos LEDs
      salvarPreset(presetName);
      const sendCommands = (commands) => {
        for (let command of commands) {
          sendMessage(command);
        }
      };
      let commands = ['10', '20', '30','40','50','60','70','80','90'];
      sendCommands(commands);
      navigation.goBack();
    };

    const carregarPreset = async (presetName) => {
      try {
        let leds = await AsyncStorage.getItem(presetName);
        if (leds !== null) {
          leds = JSON.parse(leds);
          console.log(`Estado carregado para ${presetName}: ${leds}`);
          setIsLed1On(leds[0]);
          setIsLed2On(leds[1]);
          setIsLed3On(leds[2]);
          setIsLed4On(leds[3]);
          setIsLed5On(leds[4]);
          setIsLed6On(leds[5]);
          setIsLed7On(leds[6]);
          setIsLed8On(leds[7]);

          if (leds[0]) toggleRedLed();
          if (leds[1]) toggleYellowLed();
          if (leds[2]) toggleGreenLed();
          if (leds[3]) toggleRedLed2();
          if (leds[4]) toggleGreenLed2();
          if (leds[5]) toggleRedLed3();
          if (leds[6]) toggleRedLed4();
          if (leds[7]) toggleGreenLed3();
        }
      } catch (error) {
        console.log(error);
      }
    };

  useEffect(() => {
    
    carregarPreset('preset1');
  }, []);
  

    const sendMessage = (data) => {
      let peripheralId = "B0:A7:32:15:39:42"; // ID do seu dispositivo periférico
      let serviceUUID = "abcd1234-ab12-cd34-a123-456789abcdef"; // UUID do serviço
      let characteristicUUID = "abcd1234-ab12-cd34-a123-456789abcdef"; // UUID da característica
      
      let bytes = stringToBytes(data); // Converte o comando em uma matriz de bytes

      BleManager.start({ showAlert: false }).then(() => {
        // Success code
        console.log("Modulo ta bao");
      });
      BleManager.scan([], 5, true).then(() => {
        // Success code
        console.log("Scan started");
      });
      BleManager.connect("B0:A7:32:15:39:42")
      
      
  .then(() => {
    // Success code
    console.log("Connected");
  })
  .catch((error) => {
    // Failure code
    console.log(error);
  });
  
      BleManager.write(peripheralId, serviceUUID, characteristicUUID, bytes)
      .then(() => {
        // Sucesso ao escrever o comando
        console.log('Comando enviado');
        setIsLedOn(!isLedOn);
      })
        .catch((error) => {
        // Falha ao escrever o comando
        console.log(error);
        
  });
  
}//Fim da função de envio de dados

const toggleRedLed = () => {
  let data = isLed1On ? '10' : '11'; //Se for 11 liga, se for 10 desliga
  sendMessage(data);
  setIsLed1On(!isLed1On);
  console.log(`isLed1On: ${!isLed1On}`);
};
const toggleYellowLed = () => {
  let data = isLed2On ? '20' : '21'; 
  sendMessage(data);
  setIsLed2On(!isLed2On);
};
const toggleGreenLed = () => {
  let data = isLed3On ? '30' : '31'; 
  sendMessage(data);
  setIsLed3On(!isLed3On);

};
const toggleRedLed2 = () => {
  let data = isLed4On ? '40' : '41'; 
  sendMessage(data);
  setIsLed4On(!isLed4On);
};

const toggleGreenLed2 = () => {
  let data = isLed5On ? '50' : '51'; 
  sendMessage(data);
  setIsLed5On(!isLed5On);

};
const toggleRedLed3 = () => {
  let data = isLed6On ? '60' : '61'; 
  sendMessage(data);
  setIsLed6On(!isLed6On);
};
const toggleRedLed4 = () => {
  let data = isLed7On ? '70' : '71'; 
  sendMessage(data);
  setIsLed7On(!isLed7On);
};
const toggleGreenLed3 = () => {
  let data = isLed8On ? '80' : '81'; 
  sendMessage(data);
  setIsLed8On(!isLed8On);
};


    return(
      <ImageBackground source={require('../assets/peakpx.jpg')} style={styles.imagePresetUm}>

          <Text style={styles.title}>Tela de Preset 1</Text>
            

          <TouchableOpacity onPress={() =>  {handleSave('preset1'); navigation.navigate('telaPreset') }} style={styles.botaoVoltar}><Icon name="arrow-left"/></TouchableOpacity>
          
          <View style={styles.colunas}>
          <View style={styles.leftContainer}>
          <TouchableOpacity style={{backgroundColor:"red",borderRadius:15,marginBottom:30}}onPress={toggleRedLed}><Text style={styles.textoBotaoDentroPreset}>RedLead</Text></TouchableOpacity>
          <TouchableOpacity style={{backgroundColor:'#ffd700',borderRadius:15,marginBottom:30}}onPress={toggleYellowLed}><Text style={styles.textoBotaoDentroPreset}>YellowLed</Text></TouchableOpacity>
          <TouchableOpacity style={{backgroundColor:'#adff2f',borderRadius:15,marginBottom:30}}onPress={toggleGreenLed}><Text style={styles.textoBotaoDentroPreset}>GreenLed</Text></TouchableOpacity>
          <TouchableOpacity style={{backgroundColor:'red',borderRadius:15,marginBottom:30}}onPress={toggleRedLed2}><Text style={styles.textoBotaoDentroPreset}>RedLed2</Text></TouchableOpacity>
          </View>
          
          
          <View style={styles.rightContainer}>
          <TouchableOpacity style={{backgroundColor:"#adff2f",borderRadius:15,marginBottom:30}}onPress={toggleGreenLed2}><Text style={styles.textoBotaoDentroPreset}>GreenLed2</Text></TouchableOpacity>
          <TouchableOpacity style={{backgroundColor:'red',borderRadius:15,marginBottom:30}}onPress={toggleRedLed3}><Text style={styles.textoBotaoDentroPreset}>RedLed3</Text></TouchableOpacity>
          <TouchableOpacity style={{backgroundColor:"red",borderRadius:15,marginBottom:30}}onPress={toggleRedLed4}><Text style={styles.textoBotaoDentroPreset}>RedLed4</Text></TouchableOpacity>
          <TouchableOpacity style={{backgroundColor:"#adff2f",borderRadius:15,marginBottom:30}}onPress={toggleGreenLed3}><Text style={styles.textoBotaoDentroPreset}>GreenLed3</Text></TouchableOpacity>
          </View>
          
          </View>
          <TouchableOpacity onPress={() => handleSave('preset1')} style={{backgroundColor:"blue"}}><Text style={{color:"white", fontSize:35}}>Salvar</Text></TouchableOpacity>
      </ImageBackground>
        
    )

};
