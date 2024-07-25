import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  KeyboardAvoidingView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import React, { useState, useEffect } from 'react';
import { logout } from '.././reducers/user';
import * as ImagePicker from 'expo-image-picker';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import { styles } from '../constants';
import { ScreenTemplateCenter } from '../components';

const EXPO_PUBLIC_BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export default function ProfileScreen({ route }) {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const username = useSelector(state => state.user.username);
  let userScore = user.score;

  const [userData, setUserData] = useState({
    picture: '',
    username: '',
    email: '',
    birthday: '',
    phone: '',
    city: '',
    score: '',
  });

  useEffect(() => {
    fetch(`${EXPO_PUBLIC_BACKEND_URL}/users/${username}`)
      .then(response => response.json())
      .then(data => {
        if (data.result) {
          setUserData(data.data);
        } else {
          console.log('Utilisateur non trouvé...');
        }
      })
      .catch(error => {
        console.error(
          'Erreur lors de la récupération des données utilisateur: ',
          error
        );
      });
  }, []);

  const handleEditProfilePhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      console.log('Permission denied');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.3,
      base64: true,
    });

    if (!result.canceled) {
      //console.log(result.assets[0].base64)
      // Mise à jour de l'image de profil dans userData
      setUserData({ ...userData, picture: result.assets[0].base64 });
    }
  };

  const handleSaveChanges = () => {
    // Effectuez une requête pour enregistrer les modifications dans la base de données
    fetch(`${EXPO_PUBLIC_BACKEND_URL}/users/update/${username}`, {
      method: 'PUT', // Utilisez la méthode PUT pour mettre à jour les données
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
      .then(response => {
        // console.log(response);
        return response.json();
      })
      .then(data => {
        if (data.result) {
          console.log('Modifications enregistrées avec succès !');
        } else {
          console.error("Erreur lors de l'enregistrement des modifications.");
        }
      })
      .catch(error => {
        console.error('Erreur lors de la requête de mise à jour :', error);
      });
  };

  const handleDeleteAccount = () => {
    fetch(`${EXPO_PUBLIC_BACKEND_URL}/users/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.result) {
          dispatch(logout());
          //navigation
        }
      })
      .catch(error => {
        // Gérer les erreurs de requête
        console.error('Erreur lors de la suppression du compte :', error);
      });
  };

  return (
    <ScreenTemplateCenter>
      <KeyboardAvoidingView
        style={styles.containerSpaceAround}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.sectionAlignCenter}>
          <TouchableOpacity onPress={handleEditProfilePhoto}>
            <Image
              style={styles.userPictureBadge}
              source={
                userData.picture
                  ? { uri: `data:image/jpeg;base64,${userData.picture}` }
                  : require('../assets/images/avatar-default.jpg')
              }
              resizeMethod="resize"
            />
          </TouchableOpacity>
          <Text style={{ ...styles.primaryTitle, width: '100%' }}>
            {userData.username}
          </Text>
        </View>
        <View style={{ ...styles.inputContainer, width: '100%' }}>
          <View style={screenStyles.inputSection}>
            <Text style={{ ...styles.secondaryBodyText, width: 'auto' }}>
              Identifiant:
            </Text>
            <TextInput
              style={{ ...styles.primaryInput, width: 'auto', minWidth: '50%' }}
              value={userData.username}
              onChangeText={newUsername =>
                setUserData({ ...userData, username: newUsername })
              }
            />
          </View>

          <View style={screenStyles.inputSection}>
            <Text style={{ ...styles.secondaryBodyText, width: 'auto' }}>
              Email:
            </Text>
            <TextInput
              style={{ ...styles.primaryInput, width: 'auto', minWidth: '50%' }}
              value={userData.email}
              onChangeText={newEmail =>
                setUserData({ ...userData, email: newEmail })
              }
            />
          </View>

          <View style={screenStyles.inputSection}>
            <Text style={{ ...styles.secondaryBodyText, width: 'auto' }}>
              Date de naissance:
            </Text>
            <TextInput
              style={{ ...styles.primaryInput, width: 'auto', minWidth: '50%' }}
              value={userData.dateOfBirth}
              onChangeText={newDateOfBirth =>
                setUserData({ ...userData, dateOfBirth: newDateOfBirth })
              }
            />
          </View>

          <View style={screenStyles.inputSection}>
            <Text style={{ ...styles.secondaryBodyText, width: 'auto' }}>
              Téléphone:
            </Text>
            <TextInput
              style={{ ...styles.primaryInput, width: 'auto', minWidth: '50%' }}
              value={userData.phone}
              onChangeText={newPhone =>
                setUserData({ ...userData, phone: newPhone })
              }
            />
          </View>

          <View style={screenStyles.inputSection}>
            <Text style={{ ...styles.secondaryBodyText, width: 'auto' }}>
              Ville:
            </Text>
            <TextInput
              style={{ ...styles.primaryInput, width: 'auto', minWidth: '50%' }}
              value={userData.city}
              onChangeText={newCity =>
                setUserData({ ...userData, city: newCity })
              }
            />
          </View>
        </View>

        <View
          style={{
            ...screenStyles.inputSection,
            justifyContent: 'center',
          }}
        >
          <Text style={{ ...styles.primaryBodyText, width: 'auto' }}>
            Niveau:
          </Text>
          <Text style={{ ...styles.primaryBodyText, width: 'auto' }}>
            {user.level.name.toUpperCase()} | {userScore} points
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleSaveChanges}
          style={styles.primaryButton}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryButtonText}>
            Enregistrer les modifications
          </Text>
        </TouchableOpacity>

        <View>
          <TouchableOpacity
            onPress={() => handleDeleteAccount()}
            style={{ ...styles.tertiaryButton, width: 250 }}
            activeOpacity={0.8}
          >
            <Text style={styles.tertiaryButtonText}>Supprimer mon compte</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ScreenTemplateCenter>
  );
}

const screenStyles = StyleSheet.create({
  inputSection: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 8,
  },
});
