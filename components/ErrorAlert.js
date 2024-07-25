const { Alert } = require('react-native');

export function ErrorAlert(message) {
  return Alert.alert('❗ ERREUR', message, [{ text: 'OK', onPress: null }]);
}
