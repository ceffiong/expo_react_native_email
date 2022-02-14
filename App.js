import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Alert} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as MailComposer from 'expo-mail-composer';

export default function App() {
  const [status, setStatus] = useState(null)

  const showAlert = () =>
    Alert.alert(
      "Add a file",
      "Do you want to attach a file?",
      [
        {
          text: "No",
          onPress: () => {sendEmail([])},
          style: "cancel"
        },
        { text: "Yes", onPress: sendEmailWithAttachment }
      ]
    );

  const sendEmail = async(file) => {
    var options = {}
    if(file.length < 1){
      options = {
        subject: "Sending email with attachment",
        recipients: ["talkwithcharles@gmail.com"],
        body: "Enter email body here..."
      }
    }else{
      options = {
        subject: "Sending email with attachment",
        recipients: ["talkwithcharles@gmail.com"],
        body: "Enter email body here...",
        attachments: file
      }
    }
    let promise = new Promise((resolve, reject) => {
      MailComposer.composeAsync(options)
      .then((result) => {
        resolve(result)
      })
      .catch((error) => {
        reject(error)
      })
    })

    promise.then(
      result => setStatus("Status: email " + result.status),
      error => setStatus("Status: email " + error.status)
    )
  }

  const sendEmailWithAttachment = async() => {
    //get the email. 
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      console.log(result.uri)
      sendEmail([result.uri]);
    }else{
      sendEmail([])
    }

  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={showAlert}>
        <Text style={{backgroundColor: 'black', color: 'white', padding: 15}}>Send email</Text>
      </TouchableOpacity>

      {status !== null &&
        <View style={{borderWidth: 2, borderColor: 'black', margin:20, padding: 10}}>
          <Text>{status}</Text>
        </View>
      }
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
