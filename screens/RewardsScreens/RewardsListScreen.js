import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { styles } from '../../config';
import { useState } from 'react';
import { ScreenTemplateCenter } from './../../components';

export default function RewardsListScreen() {
  const [pickedReward, setRewardChallenge] = useState(null);

  return (
    <ScreenTemplateCenter>
      {pickedReward && (
        <RewardDetailsModal
          reward={pickedReward}
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
          Tu retrouveras ici toutes les récompenses accessibles en fonction de
          ton niveau...
        </Text>
      </View>
      {/* </ScrollView> */}
    </ScreenTemplateCenter>
  );
}
