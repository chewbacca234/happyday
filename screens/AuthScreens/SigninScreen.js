import {
  Text,
  View,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Keyboard,
  Platform,
} from 'react-native';
import { styles, colors } from '../../config';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import {
  ScreenTemplateSpaceAround,
  InputErrorAlert,
  ErrorAlert,
} from '../../components';

import { useState } from 'react';

import { login } from '../../reducers/user';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, query } from 'firebase/firestore';
import { firebaseAuth, firestoreDB } from '../../firebase/firebase.config';
import { useDispatch } from 'react-redux';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export default function SigninScreen({ navigation }) {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);

  // Signin the user
  const handleSubmit = async () => {
    setLoading(true);
    Keyboard.dismiss();

    // Firebase signin
    try {
      await signInWithEmailAndPassword(firebaseAuth, email, password).then(
        userCred => {
          if (userCred) {
            console.log('user', userCred.user);

            getDoc(doc(firestoreDB, 'users', userCred.user.uid)).then(
              docSnap => {
                console.log('user snapshot', docSnap);
                if (docSnap.exists()) {
                  console.log('user data', docSnap.data());
                  const { username, avatar, picture, score, isAnonymous } =
                    docSnap.data();
                  dispatch(
                    login({
                      username,
                      avatar,
                      picture,
                      score,
                      isAnonymous,
                    })
                  );
                } else {
                  console.log("user data doesn't exist");
                }
              }
            );
          }

          setLoading(false);
          // navigation.navigate('login');
        }
      );
    } catch (error) {
      setLoading(false);
      // Log an error message for firebade signin error
      console.error('[ERROR][SIGNIN SCREEN] firebase signin error =>', error);
      // Show alert message with error
      if (error.message === 'Firebase: Error (auth/invalid-email).') {
        return InputErrorAlert('Entre un email valide pour te connecter.');
      } else if (error.message === 'Firebase: Error (auth/missing-password).') {
        return InputErrorAlert('Entre un mot de passe pour te connecter.');
      } else if (
        error.message === 'Firebase: Error (auth/invalid-credential).'
      ) {
        return InputErrorAlert('Email ou mot de passe incorrect.');
      } else {
        return ErrorAlert(error.message);
      }
    }

    // // Signin backend fetch
    // fetch(`${BACKEND_URL}/users/signin`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ username, password }),
    // })
    //   .then(response => response.json())
    //   .then(data => {
    //     if (data.result) {
    //       // If fetch result TRUE
    //       // console.log('[SIGNIN SCREEN][TRUE] fetched data =>', data);
    //       const { _id, username, token, score } = data.userData;

    //       // Dispatch datas to user reducer
    //       dispatch(login({ username, token, score, _id }));

    //       // Reset inputs values
    //       setUsername('');
    //       setPassword('');

    //       setLoading(false);
    //       return;
    //     } else {
    //       // If fetch result FALSE
    //       console.error(
    //         '[SIGNIN SCREEN][FALSE] fetched data error =>',
    //         data.error
    //       );
    //       setLoading(false);
    //       // Show alert message with error
    //       return InputErrorAlert(data.error);
    //     }
    //   })
    //   .catch(error => {
    //     setLoading(false);
    //     // Log an error message for fetch error
    //     console.error('[ERROR][SIGNIN SCREEN] fetch error =>', error);
    //     // Show alert message with error
    //     return InputErrorAlert(error);
    //   });
  };

  return (
    <>
      <ScreenTemplateSpaceAround>
        <View style={styles.sectionAlignCenter}>
          <Text style={styles.appTitle}>Bienvenue !</Text>
          <Text style={styles.primarySubtitle}>Connecte-toi</Text>
        </View>
        <KeyboardAvoidingView
          style={styles.inputContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <TextInput
            placeholder="Email"
            onChangeText={value => setEmail(value)}
            value={email}
            style={styles.primaryInput}
            inputMode="email"
            autoFocus={true}
            enterKeyHint="next"
            onSubmitEditing={() => {
              this.secondTextInput.focus();
            }}
            blurOnSubmit={false}
          />
          <TextInput
            placeholder="Mot de passe"
            onChangeText={value => setPassword(value)}
            value={password}
            style={styles.primaryInput}
            autoCapitalize="none"
            inputMode="text"
            enterKeyHint="enter"
            onSubmitEditing={handleSubmit}
            secureTextEntry
            ref={input => {
              this.secondTextInput = input;
            }}
          />
          <TouchableOpacity
            onPress={handleSubmit}
            style={styles.primaryButton}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>Valider</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
        <View style={styles.sectionAlignCenter}>
          <Text style={{ ...styles.secondaryBodyText, textAlign: 'center' }}>
            Pas encore de compte?
          </Text>
          <Pressable
            onPress={() => navigation.replace('Signup')}
            style={styles.secondaryButton}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryButtonText}>Inscris-toi</Text>
          </Pressable>
          <Pressable
            onPress={() => navigation.replace('Login')}
            style={{
              ...styles.secondaryButton,
              marginTop: 16,
              flexDirection: 'row',
            }}
            activeOpacity={0.8}
          >
            <FontAwesome
              name="arrow-circle-left"
              size={16}
              color={colors.primaryButtonText}
              light
              style={{ marginRight: 8 }}
            />
            <Text>Retour à l'accueil</Text>
          </Pressable>
        </View>
      </ScreenTemplateSpaceAround>
      {loading ? (
        <View
          style={{
            ...StyleSheet.absoluteFill,
            justifyContent: 'center',
            alignItems: 'center',
            gap: 16,
            backgroundColor: colors.transpWhite70,
          }}
        >
          <ActivityIndicator size="large" color={colors.primary} />
          <Text
            style={{
              ...styles.secondaryBodyText,
              textAlign: 'center',
              color: colors.primary,
            }}
          >
            Connexion...
          </Text>
        </View>
      ) : null}
    </>
  );
}
