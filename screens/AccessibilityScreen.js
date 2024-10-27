import { StyleSheet, Text, View } from 'react-native';
import { styles } from '../config';
import { ScreenTemplateCenter } from '../components';

export default function AccessibilityScreen() {
  return (
    <ScreenTemplateCenter>
      {/* <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContainer}
      > */}
      <View style={styles.sectionAlignCenter}>
        <Text style={styles.primaryTitle}>En construction...</Text>
        <Text style={styles.primarySubtitle}>
          Tu retrouveras ici les paramètres d'accessibilité de l'application
          (réglage des contrastes, taille des polices, ...)
        </Text>
      </View>
      {/* </ScrollView> */}
    </ScreenTemplateCenter>
  );
}
