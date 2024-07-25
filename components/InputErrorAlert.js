const { Alert } = require('react-native');

export function InputErrorAlert(message) {
  return Alert.alert('ERREUR DE SAISIE', message, [
    { text: 'OK', onPress: null },
  ]);
}
