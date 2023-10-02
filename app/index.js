import "expo-router/entry";

import { useNavigation } from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import {
  Text,
  Alert,
  View,
  FlatList,
  Platform,
  StatusBar,
  SafeAreaView,
  NativeModules,
  useColorScheme,
  TouchableOpacity,
  NativeEventEmitter,
  PermissionsAndroid,
  ImageBackground,
} from 'react-native';
import BleManager from 'react-native-ble-manager';
import DeviceList from '../DeviceList'
import {styles} from '../styles/styles'
import { useFonts } from 'expo-font';
import Icon from 'react-native-vector-icons/FontAwesome';

const BleManagerModule = NativeModules.BleManager;
const BleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const App = () => {
  const [fontsLoaded] = useFonts({
    'Inter-Black': require('../assets/fonts/Inter-Black.otf'),
  });
  const navigation = useNavigation();
  
  const peripherals = new Map();
  const [isScanning, setIsScanning] = useState(false);
  const [connectedDevices, setConnectedDevices] = useState([]);
  const [discoveredDevices, setDiscoveredDevices] = useState([]);
  const handleGetConnectedDevices = () => {
    BleManager.getBondedPeripherals([]).then(results => {
      for (let i = 0; i < results.length; i++) {
        let peripheral = results[i];
        peripheral.connected = true;
        peripherals.set(peripheral.id, peripheral);
        setConnectedDevices(Array.from(peripherals.values()));
      }
    });
  };
  useEffect(() => {
    BleManager.enableBluetooth().then(() => {
      console.log('Bluetooth is turned on!');
    });
    BleManager.start({showAlert: false}).then(() => {
      console.log('BleManager initialized');
      handleGetConnectedDevices();
    });
    let stopDiscoverListener = BleManagerEmitter.addListener(
      'BleManagerDiscoverPeripheral',
      peripheral => {
        peripherals.set(peripheral.id, peripheral);
        setDiscoveredDevices(Array.from(peripherals.values()));
      },
    );
    let stopConnectListener = BleManagerEmitter.addListener(
      'BleManagerConnectPeripheral',
      peripheral => {
        console.log('BleManagerConnectPeripheral:', peripheral);
      },
    );
    let stopScanListener = BleManagerEmitter.addListener(
      'BleManagerStopScan',
      () => {
        setIsScanning(false);
        console.log('scan stopped');
      },
    );
    if (Platform.OS === 'android' && Platform.Version >= 23) {
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ).then(result => {
        if (result) {
          console.log('Permission is OK');
        } else {
          PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          ).then(result => {
            if (result) {
              console.log('User accepted');
            } else {
              console.log('User refused');
            }
          });
        }
      });
    }
    return () => {
      stopDiscoverListener.remove();
      stopConnectListener.remove();
      stopScanListener.remove();
    };
  }, []);
  const startScan = () => {
    if (!isScanning) {
      BleManager.scan([], 5, true)
        .then(() => {
          console.log('Scanning...');
          setIsScanning(true);
        })
        .catch(error => {
          console.error(error);
        });
    }
  };
  // Deve-se parear previamente com o dispositivo antes de conectar
  const connectToPeripheral = peripheral => {
    BleManager.createBond(peripheral.id)
      .then(() => {
        peripheral.connected = true;
        peripherals.set(peripheral.id, peripheral);
        setConnectedDevices(Array.from(peripherals.values()));
        setDiscoveredDevices(Array.from(peripherals.values()));
        console.log('BLE device paired successfully. ');
        navigation.navigate('telaPreset');
        
        // Chame retrieveServices dentro do bloco then de createBond
        BleManager.retrieveServices(peripheral.id)
          .then((peripheralInfo) => {
            console.log('Informação do dispositivo:', peripheralInfo);
            
            // Após a conexão bem-sucedida, navegue para a tela de presets
            
          });
      })
      .catch(() => {
        console.log('failed to bond');
      });
  }
  // Desconectar do dispositivo
  const disconnectFromPeripheral = peripheral => {
    BleManager.removeBond(peripheral.id)
      .then(() => {
        peripheral.connected = false;
        peripherals.set(peripheral.id, peripheral);
        setConnectedDevices(Array.from(peripherals.values()));
        setDiscoveredDevices(Array.from(peripherals.values()));
        Alert.alert(`Disconnected from ${peripheral.name}`);
      })
      .catch(() => {
        console.log('fail to remove the bond');
      });
  };

  const handlePress = () => {
    
    navigation.navigate('telaPreset');
  };
  
  
  // Tela
  return (
    
    
    
    <SafeAreaView style={styles.container}>
    <StatusBar backgroundColor={'black'}/>
    <ImageBackground source={require('../assets/imagemFundoMinimalista.jpg')} style={styles.imageIndex}>
    
      <View>
      
        <Text
          style={
            styles.title}>
          EsPEDAL
        </Text>
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.scanButton}
          onPress={startScan}>
          <Text style={styles.scanButtonText}>
            {isScanning ? 'Escaneando...' : 'Procure por dispositivos'}
          </Text>
        </TouchableOpacity>
        <Text
          style={
            styles.subtitle}>
          Dispositivos encontrados
        </Text>
        {discoveredDevices.length > 0 ? (
          <FlatList
            data={discoveredDevices}
            renderItem={({item}) => (
              <DeviceList
                peripheral={item}
                connect={connectToPeripheral}
                disconnect={disconnectFromPeripheral}
              />
            )}
            keyExtractor={item => item.id}
          />
        ) : (
          <Text style={styles.noDevicesText}>Não foram escontrados dispositivos</Text>
        )}
        <Text
          style={
            styles.subtitle 
          }>
          Dispositivos conectados:
        </Text>
        {connectedDevices.length > 0 ? (
          <FlatList
            data={connectedDevices}
            renderItem={({item}) => (
              <DeviceList
                peripheral={item}
                connect={connectToPeripheral}
                disconnect={disconnectFromPeripheral}
              />
            )}
            keyExtractor={item => item.id}
          />
        ) : (
          <Text style={styles.noDevicesText}>Dispositivos desconectados</Text>
        )}
        <TouchableOpacity style={{backgroundColor:"blue",marginLeft:200,marginTop:150,alignItems:"center",borderRadius:15,}}onPress={handlePress}><Icon style={{fontSize:35}} name="arrow-right"></Icon></TouchableOpacity>
        
        </View>
      </ImageBackground>
    </SafeAreaView>
    
    
  );
};
export default App;