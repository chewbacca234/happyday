import {
  Text,
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { colors, styles } from '../../constants';
import { ScreenTemplateCenter, ChallengeCard } from '../../components';
import { ChallengeDetailsModal } from './ChallengeDetailsModal';

const EXPO_PUBLIC_BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export default function MyChallengesScreen({ navigation }) {
  const user = useSelector(state => state.user);
  const inProgressChallenges = useSelector(state => state.inProgressChallenges);
  const completedChallenges = useSelector(state => state.completedChallenges);
  const canceledChallenges = useSelector(state => state.canceledChallenges);

  // console.log(
  //   '[MY CHALLENGES SCREEN] inProgressChallenges =>',
  //   inProgressChallenges
  // );
  // console.log(
  //   '[MY CHALLENGES SCREEN] completedChallenges =>',
  //   completedChallenges
  // );
  // console.log(
  //   '[MY CHALLENGES SCREEN] canceledChallenges =>',
  //   canceledChallenges
  // );

  const [myChallengesInProgressData, setMyChallengesInProgressData] = useState(
    []
  );
  const [myChallengesCompletedData, setMyChallengesCompletedData] = useState(
    []
  );
  const [myChallengesCanceledData, setMyChallengesCanceledData] = useState([]);

  const [pickedChallenge, setPickedChallenge] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    fetch(`${EXPO_PUBLIC_BACKEND_URL}/challenges/byuser/${user.username}`)
      .then(response => response.json())
      .then(data => {
        // console.log('[MY CHALLENGES SCREEN] challenges fetched data =>', data);

        if (data.result) {
          setMyChallengesCompletedData(data.challengesCompleted);
          setMyChallengesInProgressData(data.challengesInProgress);
          setMyChallengesCanceledData(data.challengesCanceled);
          setLoading(false);
          return;
        } else {
          setLoading(false);
          return;
        }
      });
  }, [inProgressChallenges]);

  // Setup modal open if there is a picked challenge
  useEffect(() => {
    pickedChallenge && handleOpenModal();
  }, [pickedChallenge]);

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setPickedChallenge(false);
  };

  const getCompletedTimes = challenge => {
    const numberOfTimes = myChallengesCompletedData.filter(
      myChallengeCompletedData =>
        myChallengeCompletedData.challengeId._id === challenge._id
    ).length;
    return numberOfTimes === 0 ? null : numberOfTimes;
  };

  // Get the filtered list of completed challenges with uniques challenges
  let cache = {};
  const myChallengeCompletedDataFiltered = myChallengesCompletedData.filter(
    myChallengeCompletedData => {
      return cache[myChallengeCompletedData.challengeId._id]
        ? 0
        : (cache[myChallengeCompletedData.challengeId._id] = 1);
    }
  );
  cache = {};

  let myChallengesCompleted;
  myChallengeCompletedDataFiltered.length
    ? (myChallengesCompleted = myChallengeCompletedDataFiltered.map(
        (myChallengeCompleted, i) => {
          // console.log('myChallengeCompleted', myChallengeCompleted);
          const numberCompleted = getCompletedTimes(
            myChallengeCompleted.challengeId
          );

          return (
            <ChallengeCard
              key={10 + i}
              type="completed"
              title={myChallengeCompleted.challengeId.name}
              description={myChallengeCompleted.challengeId.description}
              score={`+ ${myChallengeCompleted.challengeId.score} points de Happiness`}
              rightContent={{
                uri: myChallengeCompleted.challengeId.picture,
              }}
              onPress={() =>
                setPickedChallenge(myChallengeCompleted.challengeId)
              }
              challengeId={myChallengeCompleted.challengeId._id}
              numberCompleted={numberCompleted}
            />
          );
        }
      ))
    : null;

  let myChallengesInProgress;
  myChallengesInProgressData.length
    ? (myChallengesInProgress = myChallengesInProgressData.map(
        (myChallengeInProgress, i) => {
          // console.log("myChallengeInProgress", myChallengeInProgress);
          const numberCompleted = getCompletedTimes(myChallengeInProgress);

          return (
            <ChallengeCard
              key={20 + i}
              type="inProgress"
              title={myChallengeInProgress.name}
              description={myChallengeInProgress.description}
              score={`+ ${myChallengeInProgress.score} points de Happiness`}
              rightContent={{ uri: myChallengeInProgress.picture }}
              onPress={() => setPickedChallenge(myChallengeInProgress)}
              numberInProgress={numberCompleted}
            />
          );
        }
      ))
    : null;

  let myChallengesCanceled;
  myChallengesCanceledData.length
    ? (myChallengesCanceled = myChallengesCanceledData.map(
        (myChallengeCanceled, i) => {
          // console.log("myChallengeCanceled", myChallengeCanceled);
          const numberCompleted = getCompletedTimes(myChallengeCanceled);

          return (
            <ChallengeCard
              key={30 + i}
              type="canceled"
              title={myChallengeCanceled.name}
              description={myChallengeCanceled.description}
              score={`+ ${myChallengeCanceled.score} points de Happiness`}
              rightContent={{ uri: myChallengeCanceled.picture }}
              onPress={() => setPickedChallenge(myChallengeCanceled)}
            />
          );
        }
      ))
    : null;

  // console.log('[MY CHALLENGES SCREEN] pickedChallenge =>', pickedChallenge);

  //
  // console.log(myChallengesCompleted);
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
      {myChallengesInProgress ||
      myChallengesCompleted ||
      myChallengesCanceled ? (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContainer}
        >
          {myChallengesInProgress}
          {myChallengesCompleted}
          {myChallengesCanceled}
        </ScrollView>
      ) : (
        <>
          <View style={styles.sectionAlignCenter}>
            <Text style={styles.primaryTitle}>
              Pas de défi pour le moment...
            </Text>
            <Text style={styles.primarySubtitle}>
              Choisis un défi dans la liste et accepte-le pour commencer ton
              HappyDay !
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('DrawerAllChallenges')}
            style={styles.primaryButton}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>Voir les défis</Text>
          </TouchableOpacity>
        </>
      )}

      {loading && (
        <View
          style={{
            ...StyleSheet.absoluteFill,
            justifyContent: 'center',
            backgroundColor: colors.transpWhite50,
          }}
        >
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}
    </ScreenTemplateCenter>
  );
}

const screenStyles = StyleSheet.create({
  score: {
    marginTop: 8,
    color: colors.primary,
    fontWeight: 'bold',
  },
});
