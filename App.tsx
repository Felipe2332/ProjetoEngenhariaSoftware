import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import TelaInicial from './components/telaInicial';
import TelaPreset from './components/telaPreset';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Connect" component={TelaInicial} /> 
        <Stack.Screen name="Preset" component={TelaPreset} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
