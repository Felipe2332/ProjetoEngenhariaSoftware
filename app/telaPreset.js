import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StatusBar, Button} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../styles/styles'; 
import Icon from 'react-native-vector-icons/FontAwesome';



export default function TelaPreset () {

    const navigation = useNavigation();


    return(
        <View style={styles.containerTelaPreset}>

          <StatusBar style="auto"/>

            <ImageBackground source={require('../assets/imagemFundoMinimalista.jpg')} style={styles.image}>
            

            <TouchableOpacity onPress={() => {
            navigation.goBack();}} style={styles.botaoVoltar}>
            <Icon name="arrow-left"/>

            </TouchableOpacity>
            
            <Text style={[styles.title]}>Bem vindo à tela de presets</Text>
            <TouchableOpacity onPress={() => navigation.navigate('preset1')} style={styles.presetButtonTop}><Text style={styles.textButtonPreset}>Preset 1</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('preset2')}style={styles.presetButtonMiddle}><Text style={styles.textButtonPreset}>Preset 2</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('preset3')}style={styles.presetButtonBottom}><Text style={styles.textButtonPreset}>Preset 3</Text></TouchableOpacity>



            
          </ImageBackground>
        </View>
    )

};
