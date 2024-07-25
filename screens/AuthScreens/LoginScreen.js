import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { styles } from '../../constants';
import { ScreenTemplateSpaceAround } from '../../components';

export default function LoginScreen({ navigation }) {
  return (
    <ScreenTemplateSpaceAround>
      <View style={styles.sectionAlignCenter}>
        <Text style={styles.appTitle}>{'Commence ton \n Happy Day !'}</Text>
        <Text style={styles.primarySubtitle}>
          {'Un peu de douceur dans ce monde \n de brutes...'}
        </Text>
      </View>
      <Image
        style={loginStyle.image}
        source={require('../../assets/images/logos/logo-happy-day-w800.png')}
      />
      <View style={styles.sectionAlignCenter}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Signin')}
          style={styles.primaryButton}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryButtonText}>ME CONNECTER</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Signup')}
          style={styles.primaryButton}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryButtonText}>M'ENREGISTRER</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.textButton}
        onPress={() => navigation.navigate('AnonymousSignup')}
      >
        <Text style={styles.textButtonText}>
          Continuer sans créer de compte
        </Text>
      </TouchableOpacity>
    </ScreenTemplateSpaceAround>
  );
}

const loginStyle = StyleSheet.create({
  image: {
    height: '25%',
    resizeMode: 'contain',
  },
});
