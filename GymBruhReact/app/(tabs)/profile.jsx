import React from 'react';
import { SafeAreaView, Text, Pressable, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

const Login = (props) => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Link href="login" asChild style={styles.link}>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Logout</Text>
        </Pressable>
      </Link>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex:1,
    flexDirection: 'column',
    backgroundColor: 'black',
    display: 'flex'
  },
  title:{
    color: 'white',
    fontSize:42,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor:'rgba(0,0,0,0.5)',
    marginBottom:120,
  },
  image:{
    width:'100%',
    height: '100%',
    flex:1,
    resizeMode:'cover',
    justifyContent:'center'
  },
  link:{
    color: 'white',
    fontSize:42,
    fontWeight: 'bold',
    textAlign: 'center',
    padding:4,
    backgroundColor:'rgba(0,0,0,0.5)'
  },
  button:{
    height:60,
    justifyContent:'center',
    borderRadius:20,
    backgroundColor:'rgba(155, 8, 8, 0.75)',
    padding:6,
    width: '30%',
    alignSelf: 'center'
  },
  buttonText:{
    color: 'white',
    fontSize:16,
    fontWeight: 'bold',
    textAlign: 'center',
    padding:4,
  }
})


export default Login;