const { Alert } = require('react-native');

export function FutureFeatureAlert() {
  return Alert.alert('FUTURE FEATURE', 'Not available...', [
    { text: 'OK', onPress: null },
  ]);
}
