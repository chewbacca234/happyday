import { Text, View } from 'react-native';
import { styles } from '../config';
import { ScreenTemplateCenter } from '../components';

export default function HelpScreen() {
  return (
    <ScreenTemplateCenter>
      {/* <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContainer}
      > */}
      <View style={styles.sectionAlignCenter}>
        <Text style={styles.primaryTitle}>En construction...</Text>
        <Text style={styles.primarySubtitle}>
          Tu retrouveras ici toute l'aide dont tu as besoin pour prendre en main
          l'application...
        </Text>
      </View>
      {/* </ScrollView> */}
    </ScreenTemplateCenter>
  );
}
