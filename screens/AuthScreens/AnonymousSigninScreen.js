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
  ScrollView,
  Image,
} from 'react-native';
import { styles, colors } from '../../config';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import {
  ScreenTemplateSpaceAround,
  InfoAlert,
  ErrorAlert,
  AvatarPicker,
} from '../../components';
import { useState } from 'react';

import { doc, setDoc } from 'firebase/firestore';
import { firebaseAuth, firestoreDB } from '../../firebase/firebase.config';
import { signInAnonymously } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { login } from '../../reducers/user';

export default function AnonymousSigninScreen({ navigation }) {
  const [anonymousUserData, setAnonymousUserData] = useState({});
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleSelectUsername = username => {
    setAnonymousUserData({ ...anonymousUserData, username });
  };

  const handleChooseAvatar = avatar => {
    setAnonymousUserData({ ...anonymousUserData, avatar });
  };

  // Signin the user anonymously
  const handleSignInAnonymously = async () => {
    setLoading(true);
    Keyboard.dismiss();

    // Firebase anonymous signin
    if (anonymousUserData.username && anonymousUserData.avatar) {
      try {
        await signInAnonymously(firebaseAuth).then(userCred => {
          if (userCred) {
            console.log('User SignedIn Anonymously:', userCred.user);

            const userData = {
              _id: userCred?.user.uid,
              username: anonymousUserData.username,
              email: '',
              avatar: anonymousUserData.avatar,
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
            console.log('userData:', userData);
            setDoc(
              doc(firestoreDB, 'users', userCred?.user.uid),
              userData
            ).then(savedUser => {
              console.log('savedUser:', savedUser);
              dispatch(login(savedUser));
              return;
            });
          }

          setLoading(false);
        });
      } catch (error) {
        setLoading(false);
        // Log an error message for firebade signin error
        console.error('[ERROR][SIGNIN SCREEN] firebase signin error =>', error);
        // Show alert message with error
        return ErrorAlert(error.message);
      }
    } else {
      setLoading(false);
      return InfoAlert('Choisi un identifiant et un avatar pour te connecter.');
    }
  };

  return (
    <>
      <ScreenTemplateSpaceAround>
        <View style={styles.sectionAlignCenter}>
          <Text style={styles.appTitle}>Bienvenue !</Text>
          <Text style={styles.primarySubtitle}>Connecte-toi sans compte</Text>
        </View>
        <KeyboardAvoidingView
          style={styles.inputContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <Text>Choisi ton identifiant</Text>
          <TextInput
            placeholder="The good man"
            onChangeText={handleSelectUsername}
            value={anonymousUserData.username}
            style={styles.primaryInput}
            inputMode="text"
            autoFocus={true}
            blurOnSubmit={false}
          />
          <Text>Choisi ton avatar</Text>
          <AvatarPicker
            handleChooseAvatar={handleChooseAvatar}
            hasAvatar={anonymousUserData.avatar}
          />
          <TouchableOpacity
            onPress={handleSignInAnonymously}
            style={styles.primaryButton}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>Valider</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
        <View style={styles.sectionAlignCenter}>
          <Pressable
            onPress={() => navigation.replace('Login')}
            style={{
              ...styles.secondaryButton,
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
