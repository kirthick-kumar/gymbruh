import { StyleSheet } from 'react-native';

const black = '#343131';
const red = '#C62E2E'
const orange = '#EB5A3C'

const styles = StyleSheet.create({
    container: {
      flex:1,
      flexDirection: 'column',
      paddingTop: '35%'
    },
    input: {
      width: '80%',
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 5,
      color: 'white',
      paddingHorizontal: 10,
      marginBottom: 10,
      alignSelf: 'center',
      outlineColor: 'red',
    },
    flex_inputs:{
      display:'flex',
      flexDirection:'row',
      marginLeft:'7%',
    },
    input_half:{
      width: '27%',
      marginLeft:'3%',
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 5,
      color: 'white',
      paddingHorizontal: 10,
      marginBottom: 10,
      outlineColor: 'red',
    },
    title:{
      fontSize:42,
      fontWeight: 'bold',
      textAlign: 'center',
      color: 'white',
      marginBottom: 50,
    },
    signupTitle:{
      fontSize:42,
      fontWeight: 'bold',
      textAlign: 'center',
      color: 'white',
    },
    subtitle: {
      fontSize:18,
      fontWeight: 'bold',
      textAlign: 'center',
      color: orange,
      marginBottom: 30
    },
    image: {
      width: 100,
      height: 100, 
      resizeMode: 'contain',
      alignSelf: 'center',
      marginBottom: 10
    },    
    link:{
      color: 'white',
      fontSize:42,
      fontWeight: 'bold',
      textAlign: 'center',
      padding:4,
    },
    button:{
      height:60,
      justifyContent:'center',
      borderRadius:40,
      backgroundColor:red,
      padding:6,
      width: '120px',
      height: '50px',
      alignSelf: 'center',
      marginTop: '10%'
    },
    buttonText:{
      color: 'white',
      fontSize:16,
      fontWeight: 'bold',
      textAlign: 'center',
      padding:4,
    }
})

export default styles;
