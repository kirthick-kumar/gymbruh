import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, SafeAreaView, Button } from 'react-native';
import { useEffect, useState } from 'react';

const IP = 'localhost'

export default function App() {
  const [msg, setMsg] = useState('');
  const [inputMsg, setInputMsg] = useState(''); 
  const [token, setToken] = useState(''); 
  
  useEffect(() => {
    fetch('http://' + IP + ':8080/signup')
      .then(res => res.json())
      .then(resData => {
        setMsg(resData.msg);
      })
      .catch(err => console.error('Error fetching data:', err));
  }, []);

  const signup = () => {
    fetch('http://' + IP + ':8080/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        username: 'test', 
        email: 'email', 
        password: 'test', 
        age: 21,
        weight: 70,
        height: 177,
        goal: 'maintenance',
        msg: inputMsg
      })
    })
    .then(res => res.json())
    .then(resData => {
      setMsg(resData.msg);
      setInputMsg('');
    })
    .catch(err => console.error('Error updating message:', err));
  };

  const login = () => {
    fetch('http://' + IP + ':8080/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({email: 'email', password: 'test'})
    })
      .then(res => res.json())
      .then(resData => {
        if (resData.token) {
          setToken(resData.token);
        }
        setMsg(resData.msg);
        setInputMsg('');
      })
      .catch(err => console.error('Error updating message:', err));
  }

  const checkAuth = () => {
    fetch('http://' + IP + ':8080/test', {
        method: 'GET',
        headers: {
          Authorization: 'bearer ' + token
        }
    })
      .then(res => res.json())
      .then(resData => {
        setMsg(resData.msg);
      })
      .catch(err => console.error('Error updating message:', err));
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.innerText}>Server: {msg}</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter new message"
        placeholderTextColor="gray"
        value={inputMsg}
        onChangeText={setInputMsg}
      />

      <Button title="SignUp" onPress={signup} />
      <Button title="Login" onPress={login} />
      <Button title="Auth?" onPress={checkAuth} />

      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  innerText: {
    color: 'white',
    fontSize: 18,
    marginBottom: 10,
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
  },
});
