import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, SafeAreaView, Button } from 'react-native';
import { useEffect, useState } from 'react';

const IP = '192.168.137.1'

export default function App() {
  const [msg, setMsg] = useState('');
  const [inputMsg, setInputMsg] = useState(''); 
  
  useEffect(() => {
    fetch('http://' + IP + ':8080/signup')
      .then(res => res.json())
      .then(resData => {
        setMsg(resData.msg);
      })
      .catch(err => console.error('Error fetching data:', err));
  }, []);

  const updateMessage = () => {
    fetch('http://' + IP + ':8080/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: inputMsg })
    })
    .then(res => res.json())
    .then(resData => {
      setMsg(resData.msg);
      setInputMsg('');
    })
    .catch(err => console.error('Error updating message:', err));
  };

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

      <Button title="Update Message" onPress={updateMessage} />

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
