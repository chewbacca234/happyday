import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../../reducers/user';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import {
  ScreenTemplateSpaceAround,
  InputErrorAlert,
  ErrorAlert,
  AvatarPicker,
} from '../../components';
import { colors, styles } from '../../config';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { firebaseAuth, firestoreDB } from '../../firebase/firebase.config';
import { doc, setDoc } from 'firebase/firestore';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;
const EMAIL_REGEX =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default function SignupScreen({ navigation }) {
  const dispatch = useDispatch();

  const [userData, setUserData] = useState({
    email: '',
    username: '',
    avatar: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);

  console.log('userData:', userData);

  const handleUpdateUserData = (key, value) => {
    const newUserData = {};
    newUserData[key] = value;

    setUserData({ ...userData, ...newUserData });
  };

  // Signup the user
  const handleSubmit = async () => {
    setLoading(true);
    Keyboard.dismiss();

    // Check data provided
    if (
      !userData.email ||
      !userData.username ||
      !userData.avatar ||
      !userData.password ||
      !userData.confirmPassword
    ) {
      setLoading(false);
      // Show alert message with error
      return InputErrorAlert(
        'Merci de remplir tous les champs et choisir un avatar.'
      );
    }

    // Check email format
    if (!EMAIL_REGEX.test(userData.email)) {
      setLoading(false);
      // Show alert message with error
      return InputErrorAlert('Adresse e-mail invalide');
    }

    // Check password with confirmPassword
    if (userData.password !== userData.confirmPassword) {
      setLoading(false);
      // Show alert message with error
      return InputErrorAlert('Les mots de passe ne correspondent pas');
    }

    // Firebase signup
    // video 1:28:52
    try {
      await createUserWithEmailAndPassword(
        firebaseAuth,
        userData.email,
        userData.password
      ).then(userCred => {
        console.log('user credentials', userCred.user);

        updateProfile(firebaseAuth.currentUser, {
          displayName: userData.username,
        }).then(() => console.log('Auth user', firebaseAuth.currentUser));

        const newUserData = {
          username: userData.username,
          email: userData.email,
          avatar: userData.avatar,
          picture: '',
          dob: '',
          phone: '',
          city: '',
          score: 0,
          friends: [],
          challenges: [],
          victories: [],
          battles: [],
          isAnonymous: userCred?.user.isAnonymous,
        };
        setDoc(doc(firestoreDB, 'users', userCred?.user.uid), newUserData).then(
          savedUser => {
            console.log('savedUser:', savedUser);
            // Dispatch datas to user reducer
            dispatch(login({ username, avatar, picture, score, isAnonymous }));

            // Reset inputs values
            setUserData({
              email: '',
              username: '',
              avatar: '',
              password: '',
              confirmPassword: '',
            });
            return;
          }
        );

        setLoading(false);
      });
    } catch (error) {
      setLoading(false);
      // Log an error message for firebade signup error
      console.error('[ERROR][SIGNUP SCREEN] firebase signup error =>', error);
      // Show alert message with error
      if (error.message === 'Firebase: Error (auth/email-already-in-use).') {
        return InputErrorAlert(
          'Un compte existe déjà pour cet email, connecte-toi.'
        );
      } else if (
        error.message ===
        'Firebase: Password should be at least 6 characters (auth/weak-password).'
      ) {
        return InputErrorAlert(
          'Le mot de passe doit contenir au moins 6 caractères.'
        );
      } else {
        return ErrorAlert(error.message);
      }
    }
  };

  return (
    <>
      <ScreenTemplateSpaceAround>
        <KeyboardAvoidingView
          behavior="position"
          style={styles.containerSpaceAround}
          enabled={false}
          contentContainerStyle={styles.containerCenter}
        >
          <View style={styles.sectionAlignCenter}>
            <Text style={styles.appTitle}>Bienvenue !</Text>
            <Text style={styles.primarySubtitle}>Crée ton compte</Text>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Email"
              keyboardType="email-address"
              textContentType="emailAddress"
              autoComplete="email"
              autoCapitalize="none"
              onChangeText={value => handleUpdateUserData('email', value)}
              value={userData.email}
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
              placeholder="Identifiant"
              onChangeText={value => handleUpdateUserData('username', value)}
              value={userData.username}
              style={styles.primaryInput}
              inputMode="text"
              enterKeyHint="next"
              onSubmitEditing={() => {
                this.thirdTextInput.focus();
              }}
              blurOnSubmit={false}
              ref={input => {
                this.secondTextInput = input;
              }}
            />
            <TextInput
              placeholder="Mot de passe"
              onChangeText={value => handleUpdateUserData('password', value)}
              value={userData.password}
              style={styles.primaryInput}
              inputMode="text"
              autoCapitalize="none"
              enterKeyHint="next"
              onSubmitEditing={() => {
                this.fourthTextInput.focus();
              }}
              blurOnSubmit={false}
              secureTextEntry
              ref={input => {
                this.thirdTextInput = input;
              }}
            />
            <TextInput
              placeholder="Confirme ton mot de passe"
              onChangeText={value =>
                handleUpdateUserData('confirmPassword', value)
              }
              value={userData.confirmPassword}
              style={styles.primaryInput}
              autoCapitalize="none"
              inputMode="text"
              enterKeyHint="enter"
              secureTextEntry
              onSubmitEditing={handleSubmit}
              blurOnSubmit={false}
              ref={input => {
                this.fourthTextInput = input;
              }}
            />
            <Text>Choisi ton avatar</Text>
            <AvatarPicker
              handleChooseAvatar={value =>
                handleUpdateUserData('avatar', value)
              }
              hasAvatar={userData.avatar}
            />
            <TouchableOpacity
              onPress={() => handleSubmit()}
              style={styles.primaryButton}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>Valider</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.sectionAlignCenter}>
            <Text style={{ ...styles.secondaryBodyText, textAlign: 'center' }}>
              Tu as déjà un compte?
            </Text>
            <Pressable
              onPress={() => navigation.replace('Signin')}
              style={styles.secondaryButton}
              activeOpacity={0.8}
            >
              <Text>Connecte-toi</Text>
            </Pressable>
          </View>
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
        </KeyboardAvoidingView>
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
            Enregistrement...
          </Text>
        </View>
      ) : null}
    </>
  );
}
