const { Alert } = require('react-native');

export function WarningAlert(
  message,
  okBtnText,
  onOK,
  cancelBtnText,
  onCancel
) {
  return Alert.alert('⚠️ ATTENTION', message, [
    { text: okBtnText, onPress: onOK },
    { text: cancelBtnText, onPress: onCancel },
  ]);
}
