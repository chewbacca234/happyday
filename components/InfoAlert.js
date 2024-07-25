const { Alert } = require('react-native');

export function InfoAlert(message) {
  return Alert.alert('INFO', message, [{ text: 'OK', onPress: null }]);
}
