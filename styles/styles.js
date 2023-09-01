
import {StyleSheet, Text, View} from 'react-native';

const styles = StyleSheet.create({
    colors:{
        black : '#000000'
    },

    text:{
        fontSize: 25,
        margin: 5,
    },

    input: {
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        width: 200,
        borderRadius: 5,
        margin: 10,
        fontSize: 25,
    },
    
    container: {
      flexDirection:'column',
      justifyContent:"center",
      alignItems : "center",
      flex:1, //Para alinhar no meio precisa dessa
      backgroundColor: 'white', 
      
    },

    button: {
        backgroundColor: 'green',
        padding: 10,
        borderRadius: 5,
        width: 120,
      },
      buttonText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 25
      },
});

export default styles;

