import React, { useState } from 'react';
import { View, Text, TextInput, Button, Pressable } from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import { useNavigation } from '@react-navigation/native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import { TouchableOpacity } from 'react-native';

import styles from '../styles/styles';
import { Link } from 'expo-router';
import telaPreset from './telaPreset';

import "expo-router/entry";

const index = () => {
  const [macAddress, setMacAddress] = useState('');
  const [error, setError] = useState(null);

  const handleConnect = async () => {
    console.log(`Conectando à placa com endereço MAC: ${macAddress}`);
    const bleManager = new BleManager();

    

    try { 
      // Conecte-se ao dispositivo usando o endereço MAC
      const device = await bleManager.connectToDevice(macAddress);
  
      // Descubra todos os serviços e características disponíveis
      const services = await device.discoverAllServicesAndCharacteristics();
  
      // Aqui você pode interagir com os serviços e características do dispositivo
      // Por exemplo, você pode ler ou escrever dados em uma característica específica
    } catch (error) {
      
      console.log(`Erro ao conectar ao dispositivo: ${error}`);
      setError('Endereço MAC inválido. Por favor, tente novamente.');
    };
  
  };


  return (
    <View style = {styles.container}>
      
      <Text style ={styles.text}>Insira o endereço MAC da placa:</Text>
      <TextInput
        value={macAddress}
        onChangeText={setMacAddress}
        placeholder="Digite seu Endereço"
        style = {styles.input}
        
      />
      <TouchableOpacity
        style={styles.button} 
        onPress={handleConnect}
        >
        <Text style={styles.buttonText}>Conectar</Text>
      </TouchableOpacity>
      {error && <Text>{error}</Text>}

      <Link href="/telapreset" asChild>
      <TouchableOpacity style={styles.button}>
      <Text style={styles.buttonText}>Ir para tela preset</Text>
      </TouchableOpacity>
      </Link>

    </View>
    
  );
};

export default index;
