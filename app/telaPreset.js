import React, { useState } from 'react';
import { View, Text, TouchableOpacity} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../styles/styles'; 
import Icon from 'react-native-vector-icons/FontAwesome';



export default function telaPreset () {

    const navigation = useNavigation();

    return(
        <View style={styles.containerTelaPreset}>

            <Text style={styles.title}>Bem vindo à tela de presets</Text>
            <TouchableOpacity style={styles.presetButtonTop}><Text style={styles.textButtonPreset}>Preset 1</Text></TouchableOpacity>
            <TouchableOpacity style={styles.presetButtonMiddle}><Text style={styles.textButtonPreset}>Preset 2</Text></TouchableOpacity>
            <TouchableOpacity style={styles.presetButtonBottom}><Text style={styles.textButtonPreset}>Preset 3</Text></TouchableOpacity>



            <TouchableOpacity onPress={() => {
          navigation.goBack();}} style={styles.botaoVoltar}>
            <Icon name="arrow-left"/>
          </TouchableOpacity>
        </View>
    )

};
