import { StyleSheet, Text, View } from 'react-native';

export default function LegalsScreen() {
  return (
    <View style={styles.container}>
      <Text>LegalsScreen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
