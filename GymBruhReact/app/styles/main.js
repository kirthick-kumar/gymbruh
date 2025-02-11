import { StyleSheet } from 'react-native';

const black = '#343131';

const styles = StyleSheet.create({
    container: {
      flex:1,
      flexDirection: 'column',
      backgroundColor: 'black',
      paddingTop: '50%'
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
      alignSelf: 'center'
    },
    flex_inputs:{
      display:'flex',
      flexDirection:'row',
      marginLeft:'7%'
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
    },
    title:{
      fontSize:42,
      fontWeight: 'bold',
      textAlign: 'center',
      backgroundColor: 'black',
      color: 'red',
      marginBottom:120,
    },
    image: {
      width: 100,
      height: 100, 
      resizeMode: 'contain',
      alignSelf: 'center',
      marginBottom: 40
    },    
    link:{
      color: 'white',
      fontSize:42,
      fontWeight: 'bold',
      textAlign: 'center',
      padding:4,
      backgroundColor: black
    },
    button:{
      height:60,
      justifyContent:'center',
      borderRadius:40,
      backgroundColor:'#FF0000',
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
