// /**
//  * Sample React Native App
//  * https://github.com/facebook/react-native
//  *
//  * @format
//  */

// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import React from 'react';
// import type {PropsWithChildren} from 'react';
// import {
//   SafeAreaView,
//   ScrollView,
//   StatusBar,
//   StyleSheet,
//   Text,
//   useColorScheme,
//   View,
// } from 'react-native';

// import {
//   Colors,
//   DebugInstructions,
//   Header,
//   LearnMoreLinks,
//   ReloadInstructions,
// } from 'react-native/Libraries/NewAppScreen';
// import Home from './src/screens/Home/home.screen';




// const Stack = createNativeStackNavigator();

// function App(): React.JSX.Element {
//   const isDarkMode = useColorScheme() === 'dark';

//   const backgroundStyle = {
//     backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
//   };

//   return (
//     < NavigationContainer >
//       <Stack.Navigator>
//         <Stack.Screen name="Home" options={{headerShown:false}} component={Home} />
//       </Stack.Navigator>
//     </ NavigationContainer >
//   );
// }



// export default App;
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  StyleSheet,
  Modal,
  Alert,
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

type Contact = {
  id: string;
  name: string;
  phone: string;
  email: string;
  photo: string;
};

export default function App() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentContact, setCurrentContact] = useState<Contact | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [photo, setPhoto] = useState('');

  const addContact = () => {
    if (name && phone && email) {
      const newContact: Contact = {
        id: Date.now().toString(),
        name,
        phone,
        email,
        photo,
      };
      setContacts([...contacts, newContact]);
      clearForm();
    }
  };

  const editContact = () => {
    if (currentContact && name && phone && email) {
      const updatedContacts = contacts.map((contact) =>
        contact.id === currentContact.id
          ? { ...contact, name, phone, email, photo }
          : contact
      );
      setContacts(updatedContacts);
      clearForm();
    }
  };

  const deleteContact = (id: string) => {
    Alert.alert(
      'Eliminar contacto',
      '¿Estás seguro de que quieres eliminar este contacto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          onPress: () => {
            const updatedContacts = contacts.filter((contact) => contact.id !== id);
            setContacts(updatedContacts);
          },
        },
      ]
    );
  };

  const clearForm = () => {
    setName('');
    setPhone('');
    setEmail('');
    setPhoto('');
    setCurrentContact(null);
    setModalVisible(false);
  };

  const openImagePicker = () => {
    Alert.alert(
      'Seleccionar foto',
      '¿Cómo quieres seleccionar la foto?',
      [
        {
          text: 'Cámara',
          onPress: () => launchCamera({ mediaType: 'photo' }, handleImagePickerResponse),
        },
        {
          text: 'Galería',
          onPress: () => launchImageLibrary({ mediaType: 'photo' }, handleImagePickerResponse),
        },
        { text: 'Cancelar', style: 'cancel' },
      ]
    );
  };

  const handleImagePickerResponse = (response: any) => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.error) {
      console.log('ImagePicker Error: ', response.error);
    } else {
      setPhoto(response.uri);
    }
  };

  const renderContactItem = ({ item }: { item: Contact }) => (
    <TouchableOpacity
      style={styles.contactItem}
      onPress={() => {
        setCurrentContact(item);
        setName(item.name);
        setPhone(item.phone);
        setEmail(item.email);
        setPhoto(item.photo);
        setModalVisible(true);
      }}
    >
      <Image
        source={{ uri: item.photo || 'https://via.placeholder.com/100' }}
        style={styles.contactPhoto}
      />
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{item.name}</Text>
        <Text>{item.phone}</Text>
        <Text>{item.email}</Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteContact(item.id)}
      >
        <Text style={styles.deleteButtonText}>X</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={contacts}
        renderItem={renderContactItem}
        keyExtractor={(item) => item.id}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.input}
              placeholder="Nombre"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="Teléfono"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            <TouchableOpacity style={styles.photoButton} onPress={openImagePicker}>
              <Text>Seleccionar foto</Text>
            </TouchableOpacity>
            {photo && (
              <Image source={{ uri: photo }} style={styles.previewPhoto} />
            )}
            <TouchableOpacity
              style={styles.saveButton}
              onPress={currentContact ? editContact : addContact}
            >
              <Text style={styles.saveButtonText}>
                {currentContact ? 'Guardar cambios' : 'Agregar contacto'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={clearForm}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  contactItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  contactPhoto: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  deleteButton: {
    padding: 10,
  },
  deleteButtonText: {
    color: 'red',
    fontSize: 18,
  },
  addButton: {
    position: 'absolute',
    right: 30,
    bottom: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 24,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  photoButton: {
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  previewPhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#ff3b30',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});