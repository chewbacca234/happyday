import { Text, View } from 'react-native';
import { styles } from '../../constants';
import { ChallengeDetailsModal } from './ChallengeDetailsModal';
import { useState } from 'react';
import { ScreenTemplateCenter } from '../../components';

export default function FamilyChallengesScreen() {
  const [pickedChallenge, setPickedChallenge] = useState(null);

  return (
    <ScreenTemplateCenter>
      {pickedChallenge && (
        <ChallengeDetailsModal
          challenge={pickedChallenge}
          onClosed={handleCloseModal}
          navigation={navigation}
          isOpen={modalVisible}
        />
      )}
      {/* <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContainer}
      > */}
      <View style={styles.sectionAlignCenter}>
        <Text style={styles.primaryTitle}>En construction...</Text>
        <Text style={styles.primarySubtitle}>
          Tu retrouveras ici toutes les validations de défis de la
          HappyFamily...
        </Text>
      </View>
      {/* </ScrollView> */}
    </ScreenTemplateCenter>
  );
}
