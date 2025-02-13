import { StyleSheet } from 'react-native';

const black = '#343131';
const purple = '#664ac1'
const orange = '#8E05C2'

const styles = StyleSheet.create({
    container: {
      flex:1,
      flexDirection: 'column',
      marginTop: 50
    },
    card: {
        marginTop: 30,
        width: '90%',
        height: 80,
        alignSelf: 'center',
        backgroundColor: purple,
    },
    cardBody: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center'
    },
    cardText: {
        fontSize:28,
        fontWeight: 'bold',
        color: 'white',
    },
    title:{
        fontSize:42,
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'white',
        marginBottom: 20,
    },
})

export default styles;
