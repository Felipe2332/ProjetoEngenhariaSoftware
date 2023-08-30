import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import { useNavigation } from '@react-navigation/native';


const TelaInicial = () => {
  const navigation = useNavigation();
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
  
      navigation.navigate('telaPreset');
      // Aqui você pode interagir com os serviços e características do dispositivo
      // Por exemplo, você pode ler ou escrever dados em uma característica específica
    } catch (error) {
      
      console.log(`Erro ao conectar ao dispositivo: ${error}`);
      setError('Endereço MAC inválido. Por favor, tente novamente.');
    };
  
  };

  return (
    <View>
      <Text>Insira o endereço MAC da placa:</Text>
      <TextInput
        value={macAddress}
        onChangeText={setMacAddress}
        placeholder="Endereço MAC"
      />
      <Button title="Conectar" onPress={handleConnect} />
      {error && <Text>{error}</Text>}
    </View>
  );
};

export default TelaInicial;
