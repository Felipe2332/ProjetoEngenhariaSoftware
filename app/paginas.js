import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, CardStyleInterpolators } from '@react-navigation/native-stack';
import telaPreset from './telaPreset';


  
  const Stack = createNativeStackNavigator();
  
  function App() {
    return (
      <NavigationContainer >
        <Stack.Navigator initialRouteName="Home" >
          <Stack.Screen name="index" component={index}  />
          <Stack.Screen name="telaPreset" component={telaPreset} />
          <Stack.Screen name='presetUm' component={preset1}/>
          <Stack.Screen name='presetDois' component={preset2}/>
          <Stack.Screen name='presetTres' component={preset3}/>
        </Stack.Navigator>
      </NavigationContainer>
    );
  }