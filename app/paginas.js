import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Header, CardStyleInterpolators, createStackNavigator,TransitionSpecs } from '@react-navigation/stack';
import telaPreset from './telaPreset';
import index from './index';

  
const Stack = createStackNavigator();

export default function Paginas() {
    return (
      <NavigationContainer>
        <Stack.Navigator >
          <Stack.Screen name="index" component={index}/>
          <Stack.Screen name="telaPreset" component={telaPreset}/>
          <Stack.Screen name='presetUm' component={preset1} />
          <Stack.Screen name='presetDois' component={preset2} />
          <Stack.Screen name='presetTres' component={preset3} />
        </Stack.Navigator>
      </NavigationContainer>
  );
};
