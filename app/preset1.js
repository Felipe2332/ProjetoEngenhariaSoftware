import React, { useState } from 'react';
import { View, Text, TouchableOpacity,ImageBackground} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../styles/styles'; 
import Icon from 'react-native-vector-icons/FontAwesome';



export default function PresetUm () {

    const navigation = useNavigation();

    return(
        <View style={styles.containerTelaPreset}>
          <ImageBackground source={require('../assets/imagemFundoMinimalista.jpg')} style={styles.image}>

            <Text style={styles.title}>Tela de Preset 1</Text>
            

            <TouchableOpacity onPress={() => {
          navigation.goBack();}} style={styles.botaoVoltar}>
            <Icon name="arrow-left"/>
          </TouchableOpacity>

          </ImageBackground>
        </View>
    )

};
