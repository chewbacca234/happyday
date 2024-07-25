import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ScreenTemplateCenter, HomeCard } from './../../components';
import { ChallengeDetailsModal } from './ChallengeDetailsModal';
import { useState, useEffect } from 'react';
import { colors, styles } from '../../constants';

const EXPO_PUBLIC_BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export default function AllChallengesScreen({ navigation }) {
  const [challengesData, setChallengesData] = useState([]);
  const [pickedChallenge, setPickedChallenge] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [loading, setLoading] = useState(false);

  // All challenges initialization
  useEffect(() => {
    setLoading(true);

    fetch(`${EXPO_PUBLIC_BACKEND_URL}/challenges/all`)
      .then(response => response.json())
      .then(data => {
        setLoading(false);
        // console.log(data);
        setChallengesData(data.challengesList);
        // console.log(challengesData);
        return;
      })
      .catch(error => {
        setLoading(false);
        console.error(error);
        return;
      });
  }, []);

  useEffect(() => {
    pickedChallenge ? setModalVisible(true) : setModalVisible(false);
  }, [pickedChallenge]);

  const challenges = challengesData.map((challenge, i) => {
    // console.log(challenge);
    // console.log("challenge.picture", challenge.picture);

    return (
      <HomeCard
        key={i}
        type="image"
        title={challenge.name}
        description={[
          challenge.description,
          `+ ${challenge.score} points de Happiness`,
        ]}
        rightContent={challenge.picture}
        variableHeight={true}
        onPress={() => handleOpenModal(challenge)}
      />
    );
  });

  const handleOpenModal = challenge => {
    setPickedChallenge(challenge);
  };

  const handleCloseModal = () => {
    setPickedChallenge(null);
  };

  // console.log('[ALL CHALLENGES SCREEN] pickedChallenge =>', pickedChallenge);
  // console.log('[ALL CHALLENGES SCREEN] challengesData =>', challengesData);

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
      <ScrollView
        contentContainerStyle={styles.scrollViewContainer}
        style={styles.scrollView}
      >
        {challenges}
      </ScrollView>

      {loading && (
        <View
          style={{
            ...StyleSheet.absoluteFill,
            justifyContent: 'center',
            alignItems: 'center',
            gap: 16,
            backgroundColor: colors.transpWhite70,
          }}
        >
          <ActivityIndicator size="large" color={colors.primary} />
          <Text
            style={{
              ...styles.secondaryBodyText,
              textAlign: 'center',
              color: colors.primary,
            }}
          >
            Chargement des défis...
          </Text>
        </View>
      )}
    </ScreenTemplateCenter>
  );
}
