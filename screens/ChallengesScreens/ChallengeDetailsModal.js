import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { styles, colors, urls } from '../../constants';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import * as ImagePicker from 'expo-image-picker';
import ModalBox from 'react-native-modalbox';
import { Badge } from 'react-native-elements';

import { getUserLevel } from '../../helpers/getUserLevel';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addOneInProgressChallenge,
  removeOneInProgressChallenge,
} from '../../reducers/inProgressChallenges';
import {
  addOneCanceledChallenge,
  removeOneCanceledChallenge,
} from '../../reducers/canceledChallenges';
import { addOneCompletedChallenge } from '../../reducers/completedChallenges';
import { updateScoreAndLevel } from '../../reducers/user';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export const ChallengeDetailsModal = ({
  challenge,
  onClosed,
  isOpen,
  navigation,
}) => {
  if (!challenge) {
    onClosed();
    return;
  }
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const inProgressChallenges = useSelector(state => state.inProgressChallenges);
  const completedChallenges = useSelector(state => state.completedChallenges);
  const canceledChallenges = useSelector(state => state.canceledChallenges);
  const [commentInput, setCommentInput] = useState(null);
  const [pickedPicturePath, setPickedImagePath] = useState(
    urls.picturePlaceholder
  );
  const [pickedPictureBase64, setPickedImageBase64] = useState(null);

  const [loading, setLoading] = useState(false);

  // console.log("[CHALLENGE DETAILS MODAL]  user reducer username =>", user.username);
  // console.log("[CHALLENGE DETAILS MODAL] prop challenge =>", challenge);
  // console.log(
  //   '[CHALLENGE DETAILS MODAL] inProgressChallenges reducer =>',
  //   inProgressChallenges
  // );
  // console.log(
  //   '[CHALLENGE DETAILS MODAL] completedChallenges reducer =>',
  //   completedChallenges
  // );
  // console.log(
  //   '[CHALLENGE DETAILS MODAL] canceledChallenges reducer =>',
  //   canceledChallenges
  // );

  // Setup the challenge status
  const isInProgress = inProgressChallenges.some(
    inProgressChallenge => inProgressChallenge._id === challenge._id
  );
  const iscompleted = completedChallenges.some(
    completedChallenge => completedChallenge.challengeId._id === challenge._id
  );
  const isCanceled = canceledChallenges.some(
    canceledChallenge => canceledChallenge._id === challenge._id
  );

  // Accept the challenge
  const handleAcceptChallenge = () => {
    setLoading(true);

    // Accept challenge backend fetch
    fetch(`${BACKEND_URL}/challenges/accept`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: user.username,
        challengeId: challenge._id,
      }),
    })
      .then(res => res.json())
      .then(data => {
        // console.log(
        //   '[CHALLENGE DETAILS MODAL] accept challenge fetched data =>',
        //   data
        // );
        setLoading(false);
        dispatch(addOneInProgressChallenge(challenge));
        dispatch(removeOneCanceledChallenge(challenge));
        onClosed();
        navigation.navigate('DrawerMyChallenges');
        return;
      })
      .catch(error => {
        setLoading(false);
        console.error(
          '[CHALLENGE DETAILS MODAL][ERROR] accept challenge fetch error =>',
          error
        );

        return;
      });
  };

  // Complete the challenge
  const handleCompleteChallenge = () => {
    // Check if comment and picture exists
    if (!commentInput || !pickedPictureBase64) {
      return Alert.alert(
        'COMMENTAIRE OU PHOTO VIDE !',
        'Renseigne un commentaire et choisis une photo pour valider ton défi.',
        [{ text: 'OK', onPress: null }]
      );
    } else {
      setLoading(true);

      // Update user's score
      fetch(`${BACKEND_URL}/users/score`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: user.username,
          challengeScore: challenge.score,
        }),
      })
        .then(res => res.json())
        .then(updateUserScoreFetchData => {
          if (updateUserScoreFetchData.result) {
            const level = getUserLevel(user.score);

            dispatch(
              updateScoreAndLevel({
                score: user.score,
                level,
              })
            );
            onClosed();
            navigation.navigate('DrawerMyChallenges');
            return;
          } else {
            console.error(
              '[CHALLENGE DETAILS MODAL][ERROR] PUT update user score fetch error =>',
              updateUserScoreFetchData.error
            );
            return;
          }
        })
        .catch(error => {
          setLoading(false);
          console.error(
            '[CHALLENGE DETAILS MODAL][ERROR] PUT update user score fetch error =>',
            error
          );
          return;
        });

      // Complete challenge backend fetch
      fetch(`${BACKEND_URL}/challenges/complete`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: user.username,
          challengeId: challenge._id,
          comment: commentInput,
          pictureBase64: pickedPictureBase64,
        }),
      })
        .then(res => res.json())
        .then(completeChallengeFetchData => {
          if (completeChallengeFetchData.result) {
            const { challengesInProgress, challengesCompleted } =
              completeChallengeFetchData;
            // console.log(
            //   '[CHALLENGE DETAILS MODAL] PUT complete challenge data =>',
            //   completeChallengeFetchData
            // );

            setLoading(false);

            dispatch(
              addOneCompletedChallenge({
                challengeId: challenge._id,
                date: new Date(),
                comment: commentInput,
                picture: pickedPictureBase64,
              })
            );
            dispatch(removeOneInProgressChallenge(challenge));
            return;
          } else {
            setLoading(false);
            console.error(
              '[CHALLENGE DETAILS MODAL][ERROR] PUT complete challenge fetch error =>',
              completeChallengeFetchData
            );
            return;
          }
        })
        .catch(error => {
          setLoading(false);
          console.error(
            '[CHALLENGE DETAILS MODAL][ERROR] PUT complete challenge fetch error =>',
            error
          );
          return;
        });
    }
  };

  // Cancel the challenge
  const handleCancelChallenge = () => {
    setLoading(true);

    // Cancel challenge backend fetch
    fetch(`${BACKEND_URL}/challenges/cancel`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: user.username,
        challengeId: challenge._id,
      }),
    })
      .then(res => res.json())
      .then(data => {
        console.log(
          '[CHALLENGE DETAILS MODAL] cancel challenge fetched data =>',
          data
        );
        setLoading(false);

        dispatch(removeOneInProgressChallenge(challenge));
        dispatch(addOneCanceledChallenge(challenge));
        onClosed();
        navigation.navigate('DrawerMyChallenges');
        return;
      })
      .catch(error => {
        setLoading(false);
        console.error(
          '[CHALLENGE DETAILS MODAL][ERROR] cancel challenge fetch error =>',
          error
        );

        return;
      });
  };

  const showImagePicker = async () => {
    // Ask the user for the permission to access the media library
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your photos!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.3,
      base64: true,
    });

    if (!result.canceled) {
      setPickedImagePath(result.assets[0].uri);
      setPickedImageBase64(result.assets[0].base64);
      return;
    }
  };

  // This function is triggered when the "Open camera" button pressed
  const openCamera = async () => {
    // Ask the user for the permission to access the camera
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your camera!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.3,
      base64: true,
    });

    if (!result.canceled) {
      setPickedImagePath(result.assets[0].uri);
      setPickedImageBase64(result.assets[0].base64);
      return;
    }
  };

  // Setup the challenge number of completed times
  const completedTimes = completedChallenges.filter(
    completedChallenge => completedChallenge === challenge._id
  ).length;

  // Setup the challenge status badge
  let challengeStatusBadge;
  if (isCanceled) {
    challengeStatusBadge = (
      <Badge
        status={'error'}
        badgeStyle={{
          ...modalStyle.badgeStyle,
          borderColor: textColor,
          position: 'absolute',
          top: 16,
          right: 0,
        }}
        value={null}
      />
    );
  }
  if (iscompleted) {
    challengeStatusBadge = (
      <Badge
        status={'success'}
        badgeStyle={{
          ...modalStyle.badgeStyle,
          borderColor: textColor,
          position: 'absolute',
          top: 16,
          right: 0,
        }}
        value={completedTimes === 0 ? null : completedTimes}
      />
    );
  }
  if (isInProgress) {
    challengeStatusBadge = (
      <Badge
        status={'warning'}
        badgeStyle={{
          ...modalStyle.badgeStyle,
          borderColor: textColor,
          position: 'absolute',
          top: 16,
          right: 0,
        }}
        value={completedTimes === 0 ? null : completedTimes}
      />
    );
  }
  if (!isCanceled && !iscompleted && !isInProgress) {
    challengeStatusBadge = (
      <View style={{ ...modalStyle.badgeStyle, borderWidth: 0 }}></View>
    );
  }

  // Setup the gradient color from challenge status
  const gradientProps = isInProgress
    ? colors.secondaryGradientProps
    : colors.primaryGradientProps;

  // Setup the body text color from challenge status
  const textColor = isInProgress ? colors.black : colors.white;

  // Setup the content from challenge status
  const content = isInProgress ? (
    <View style={{ ...styles.sectionAlignCenter, gap: 24 }}>
      <TextInput
        editable
        multiline
        numberOfLines={4}
        maxLength={250}
        autoCapitalize="sentences"
        onChangeText={text => setCommentInput(text)}
        value={commentInput}
        style={modalStyle.input}
        placeholder="Décris ta bonne action..."
      />
      {pickedPicturePath && (
        <Image
          source={{ uri: pickedPicturePath }}
          loadingIndicatorSource={{ uri: urls.picturePlaceholder }}
          style={modalStyle.pickedPicture}
          resizeMethod="resize"
          // height={150}
        />
      )}
      <View style={modalStyle.loadPicturesButtons}>
        <TouchableOpacity
          onPress={showImagePicker}
          style={styles.iconButton}
          activeOpacity={0.8}
        >
          <FontAwesome name="image" light size={24} color={colors.white} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={openCamera}
          style={styles.iconButton}
          activeOpacity={0.8}
        >
          <FontAwesome name="camera" light size={24} color={colors.white} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={handleCompleteChallenge}
        style={styles.primaryButton}
        activeOpacity={0.8}
      >
        <Text style={styles.primaryButtonText}>Je valide mon défi</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleCancelChallenge}
        style={{ ...styles.tertiaryButton, width: 200 }}
        activeOpacity={0.8}
      >
        <Text style={styles.tertiaryButtonText}>J'abandonne le défi</Text>
      </TouchableOpacity>
    </View>
  ) : (
    <TouchableOpacity
      onPress={handleAcceptChallenge}
      style={styles.primaryButton}
      activeOpacity={0.8}
    >
      <Text style={styles.primaryButtonText}>J'accepte le défi !</Text>
    </TouchableOpacity>
  );

  return (
    <ModalBox
      style={modalStyle.modalContainer}
      startOpen={false}
      coverScreen={true}
      backdropPressToClose={false}
      swipeToClose={true}
      swipeArea={100} // The height in pixels of the swipeable area, window height by default
      swipeThreshold={50} // The threshold to reach in pixels to close the modal
      isOpen={isOpen}
      onClosed={onClosed}
      backdropOpacity={0}
      position="bottom"
    >
      <LinearGradient style={modalStyle.gradient} {...gradientProps}>
        <View style={modalStyle.titleSection}>
          <TouchableOpacity onPress={onClosed} activeOpacity={0.8}>
            <FontAwesome name="times" size={16} color={textColor} light />
          </TouchableOpacity>
          <Text
            style={{ ...styles.primaryTitle, color: textColor, width: '80%' }}
          >
            {challenge.name}
          </Text>
          {challengeStatusBadge}
        </View>
        <ScrollView
          style={modalStyle.scrollView}
          contentContainerStyle={modalStyle.scrollViewContainer}
        >
          <Image source={{ uri: challenge.picture }} style={styles.picture} />
          <View style={styles.sectionAlignLeft}>
            <Text style={{ ...styles.primaryBodyTextBold, color: textColor }}>
              Niveau de difficulté : {challenge.difficulty.toUpperCase()}
            </Text>
            <Text style={{ ...styles.primaryBodyText, color: textColor }}>
              {challenge.description}
            </Text>
            <Text style={{ ...styles.primaryBodyText, color: textColor }}>
              {challenge.score} points de Happiness à gagner.
            </Text>
          </View>
          {content}

          <View style={styles.sectionAlignCenter}>
            <Text
              style={{
                ...styles.primaryBodyText,
                textAlign: 'center',
                color: textColor,
              }}
            >
              {/* Modify the variable to show real number of times */}
              Défi validé {challenge.score} fois par la HappyFamily.
            </Text>
            <TouchableOpacity
              onPress={null}
              style={modalStyle.familyButton}
              activeOpacity={0.9}
            >
              <Text style={modalStyle.familyTextTitle}>
                Voir les réalisations de la HappyFamily
              </Text>
              <Text style={modalStyle.familyTextDescription}>
                Pour t’aider un peu, prends exemple sur les défis validés par
                d’autres HappyMembers
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        {loading && (
          <View
            style={{
              ...StyleSheet.absoluteFill,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: colors.transpWhite70,
            }}
          >
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        )}
      </LinearGradient>
    </ModalBox>
  );
};

const modalStyle = StyleSheet.create({
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    marginTop: 16,
  },
  gradient: {
    height: '100%',
    width: '100%',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  titleSection: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: -16,
  },
  scrollViewContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 16,
    paddingVertical: 16,
  },
  badgeStyle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: -16,
  },
  scrollView: {
    height: '100%',
    width: '100%',
    marginTop: 32,
    paddingHorizontal: 16,
  },
  input: {
    backgroundColor: colors.transpWhite20,
    padding: 16,
    borderRadius: 10,
    width: '100%',
  },
  pickedPicture: {
    width: 200,
    height: 150,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  loadPicturesButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  familyButton: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 8,
    backgroundColor: colors.transpWhite50,
    borderRadius: 10,
    shadowColor: colors.black,
    shadowOffset: 4,
  },
  familyTextTitle: {
    color: colors.black,
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center',
  },
  familyTextDescription: {
    color: colors.black,
    fontWeight: 'normal',
    fontSize: 15,
    textAlign: 'center',
  },
});
