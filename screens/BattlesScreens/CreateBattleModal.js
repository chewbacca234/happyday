import React, { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { styles, colors } from '../../config';
import ModalBox from 'react-native-modalbox';
import { useSelector, useDispatch } from 'react-redux';
import { addOneInProgressBattles } from '../../reducers/inProgressBattles';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
  SafeAreaView,
  TextInput,
  useWindowDimensions,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import BattleDetailsModal from './BattleDetailsModal';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import { InputErrorAlert, ErrorAlert } from './../../components';

const EXPO_PUBLIC_BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

const CreateBattleModal = ({ navigation, isOpen, onClosed }) => {
  const dispatch = useDispatch();
  const username = useSelector(state => state.user.username);
  const user_id = useSelector(state => state.user._id);
  const friends = useSelector(state => state.friends);

  const [isChallengeModalVisible, setChallengeModalVisible] = useState(false);
  const [isFriendModalVisible, setFriendModalVisible] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [challengesData, setChallengesData] = useState([]);
  const [noFriendsMessage, setNoFriendsMessage] = useState('');
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [selectedDeadline, setSelectedDeadline] = useState(null);
  const [battleName, setBattleName] = useState('');
  const [isBattleDetailsModalVisible, setBattleDetailsModalVisible] =
    useState(false);
  const [battleData, setBattleData] = useState(null);

  const { height, width } = useWindowDimensions();

  //SET CHALLENGES:
  const openChallengeModal = () => {
    setChallengeModalVisible(true);
  };

  const selectChallenge = challenge => {
    setSelectedChallenge(challenge);
    setChallengeModalVisible(false);
  };

  useEffect(() => {
    fetch(`${EXPO_PUBLIC_BACKEND_URL}/challenges/all`)
      .then(response => response.json())
      .then(data => {
        setChallengesData(data.challengesList);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const openFriendModal = () => {
    // Vérifier si l'utilisateur a des amis
    if (friends.length === 0) {
      setNoFriendsMessage(
        "Aucun ami pour l'instant, invites-en pour pouvoir lancer une battle."
      );
    } else {
      setNoFriendsMessage('');
    }
    setFriendModalVisible(true);
  };
  // Fonction pour sélectionner un ami
  const handleSelectFriend = friend => {
    if (
      !selectedFriends.some(selectedFriend => selectedFriend._id === friend._id)
    ) {
      setSelectedFriends([...selectedFriends, friend]);
    }
  };
  // Fonction pour fermer la modale des amis
  const closeFriendModal = () => {
    setFriendModalVisible(false);
  };

  //SET DEADLINE DATE:
  // datetime picker info :
  //https://github.com/mmazzarolo/react-native-modal-datetime-picker
  const showDatePicker = () => {
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  const handleConfirm = date => {
    setSelectedDeadline(date);
    hideDatePicker();
  };

  // SET Battle Name
  // const handleSaveBattleName = (newBattleName) => {
  //   setBattleName(newBattleName);
  // };

  //SET "Lance ta battle"=> fetch & open modal
  const handleCreateBattle = () => {
    //console.log('Selected Challenge:', selectedChallenge);
    //console.log('Selected Friends:', selectedFriends);
    if (selectedChallenge && selectedFriends.length > 0) {
      const scoreFirst = selectedChallenge.score;
      const scoreSecond = Math.round(0.75 * scoreFirst); // 75% de scoreFirst
      const scoreThird = Math.round(0.4 * scoreFirst);

      const data = {
        name: battleName,
        challenge: selectedChallenge._id,
        challengeName: selectedChallenge.name,
        //description: selectedChallenge.description,
        users: [...selectedFriends.map(friend => friend._id), user_id],
        //usersname: [...selectedFriends.map(friend => friend.username), user.username],
        deadline: selectedDeadline,
        picture: selectedChallenge.picture,
        level: selectedChallenge.level,
        scoreFirst,
        scoreSecond,
        scoreThird,
      };
      //console.log('log data:', data);

      fetch(`${EXPO_PUBLIC_BACKEND_URL}/battles/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
        .then(response => response.json())
        .then(populatedBattle => {
          //console.log('fetched data:', data)
          setBattleData({ ...populatedBattle });
          dispatch(addOneInProgressBattles(populatedBattle));
          onClosed();
          navigation.navigate('DrawerMyBattles');
          // setBattleDetailsModalVisible(true);
        })
        .catch(error => {
          console.error(
            "Une erreur s'est produite lors de la création de la bataille.",
            error
          );
          ErrorAlert(error);
        });
    } else {
      console.log('Aucun défi et/ou ami(s) sélectionné(s)');
      InputErrorAlert('Aucun défi et/ou ami(s) sélectionné(s)');
    }
  };
  //console.log("battle data: ", battleData)

  const handleCloseModal = () => {
    setBattleDetailsModalVisible(false);
    setSelectedChallenge(null);
    setSelectedFriends([]);
    setSelectedDeadline(null);
    setBattleName('');
  };

  return (
    <ModalBox
      style={{ ...modalStyle.modalContainer, height, width }}
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
      <LinearGradient
        style={modalStyle.gradient}
        {...colors.primaryGradientProps}
      >
        <View style={modalStyle.titleSection}>
          <TouchableOpacity onPress={onClosed} activeOpacity={0.8}>
            <FontAwesome name="times" size={16} color={colors.white} light />
          </TouchableOpacity>
          <Text style={styles.primaryTitle}>Création de la Battle</Text>
        </View>

        <View style={styles.sectionAlignCenter}>
          <Text style={{ ...styles.primaryBodyText, textAlign: 'center' }}>
            Choisis un nom accrocheur !
          </Text>
          <View contentContainerStyle={styles.inputContainer}>
            <TextInput
              placeholder="Till Death Battle"
              style={styles.secondaryInput}
              placeholderTextColor={colors.mediumGrey}
              maxLength={20}
              value={battleName}
              onChangeText={text => setBattleName(text)}
              enterKeyHint="done"
            />
          </View>
        </View>

        <View style={styles.sectionAlignCenter}>
          <Text style={{ ...styles.primaryBodyText, textAlign: 'center' }}>
            Choisis un défi
          </Text>
          <TouchableOpacity
            style={{
              ...styles.secondaryButton,
              borderColor: colors.white,
              borderWidth: 0.5,
            }}
            onPress={openChallengeModal}
            activeOpacity={0.8}
          >
            <Text
              style={{ ...styles.secondaryButtonText, color: colors.white }}
            >
              Les défis
            </Text>
          </TouchableOpacity>
        </View>

        <Modal visible={isChallengeModalVisible} animationType="slide">
          <LinearGradient
            style={styles.cardsListContainer}
            {...colors.primaryGradientProps}
          >
            <SafeAreaView style={styles.containerSpaceAround}>
              <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollViewContainer}
              >
                <Text style={{ ...styles.primaryTitle, width: '80%' }}>
                  Tous les défis :
                </Text>

                {challengesData.map((challenge, i) => (
                  <View key={i} style={styles.card}>
                    <View style={styles.cardsSection}>
                      <Text style={styles.secondaryMediumBodyTextBold}>
                        {challenge.name}: {challenge.description}
                      </Text>
                      <TouchableOpacity
                        style={styles.iconButton}
                        onPress={() => selectChallenge(challenge)}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.primaryButtonText}>GO</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={() => setChallengeModalVisible(false)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.primaryButtonText}>FERMER</Text>
                </TouchableOpacity>
              </ScrollView>
            </SafeAreaView>
          </LinearGradient>
        </Modal>

        <View style={styles.sectionAlignCenter}>
          <Text style={{ ...styles.primaryBodyText, textAlign: 'center' }}>
            Selectionne tes amis
          </Text>
          <TouchableOpacity
            style={{
              ...styles.secondaryButton,
              borderColor: colors.white,
              borderWidth: 0.5,
            }}
            onPress={openFriendModal}
            activeOpacity={0.8}
          >
            <Text
              style={{ ...styles.secondaryButtonText, color: colors.white }}
            >
              Mes amis
            </Text>
          </TouchableOpacity>
        </View>

        <Modal visible={isFriendModalVisible} animationType="slide">
          <LinearGradient
            style={styles.cardsListContainer}
            {...colors.primaryGradientProps}
          >
            <SafeAreaView style={styles.containerSpaceAround}>
              <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollViewContainer}
              >
                <Text style={{ ...styles.primaryTitle, width: '80%' }}>
                  Sélectionner des amis :
                </Text>

                {friends.map((friend, i) => (
                  <View key={i} style={styles.card}>
                    <View style={styles.cardsSection}>
                      <Text style={styles.secondarySubtitle}>
                        {friend.username}: Niveau {friend.level.name}, score{' '}
                        {friend.score}
                      </Text>
                      <TouchableOpacity
                        style={styles.iconButton}
                        onPress={() => handleSelectFriend(friend)}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.primaryButtonText}>GO</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={closeFriendModal}
                  activeOpacity={0.8}
                >
                  <Text style={styles.primaryButtonText}>FERMER</Text>
                </TouchableOpacity>
              </ScrollView>
            </SafeAreaView>
          </LinearGradient>
        </Modal>

        <View style={styles.sectionAlignCenter}>
          <Text style={{ ...styles.primaryBodyText, textAlign: 'center' }}>
            Choisis la deadline de ta battle (optionnel)
          </Text>
          <TouchableOpacity
            style={{
              ...styles.secondaryButton,
              borderColor: colors.white,
              borderWidth: 0.5,
            }}
            onPress={showDatePicker}
            activeOpacity={0.8}
          >
            <Text
              style={{ ...styles.secondaryButtonText, color: colors.white }}
            >
              deadline
            </Text>
          </TouchableOpacity>
        </View>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          textColor="#000"
          mode="date" //to select date format
          locale="fr_FR"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />

        <View style={styles.sectionAlignCenter}>
          <Text
            style={
              selectedChallenge
                ? { color: colors.white }
                : { color: colors.black }
            }
          >
            {selectedChallenge
              ? `Défi sélectionné : ${selectedChallenge.name}`
              : 'Aucun défi sélectionné'}
          </Text>

          <Text
            style={
              selectedFriends
                ? { color: colors.white }
                : { color: colors.black }
            }
          >
            Amis sélectionnés:{' '}
          </Text>
          {selectedFriends.length > 0 ? (
            selectedFriends.map((friend, i) => (
              <View key={i}>
                <Text
                  style={
                    selectedFriends
                      ? { color: colors.white }
                      : { color: colors.black }
                  }
                >
                  {friend.username}
                </Text>
              </View>
            ))
          ) : (
            <Text>{noFriendsMessage || 'Aucun ami sélectionné'}</Text>
          )}
          <Text
            style={
              selectedDeadline
                ? { color: colors.white }
                : { color: colors.black }
            }
          >
            {selectedDeadline
              ? `Date de la deadline : ${selectedDeadline.toISOString()}`
              : 'Aucune deadline sélectionnée'}
          </Text>
          <Text
            style={
              battleName ? { color: colors.white } : { color: colors.black }
            }
          >
            {battleName
              ? `Nom de la battle: ${battleName}`
              : 'Aucun nom sélectionné'}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleCreateBattle}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryButtonText}>Lance ta battle !</Text>
        </TouchableOpacity>

        <Modal
          visible={isBattleDetailsModalVisible}
          animationType="fade"
          transparent
        >
          <BattleDetailsModal
            //isBattleDetailsModalVisible={isBattleDetailsModalVisible}
            onClose={handleCloseModal}
            battleData={battleData}
            navigation={navigation}
          />
        </Modal>
      </LinearGradient>
    </ModalBox>
  );
};

const modalStyle = StyleSheet.create({
  modalContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    marginTop: 32,
  },
  gradient: {
    height: '100%',
    width: '100%',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: 32,
    paddingHorizontal: 16,
  },
  scrollViewContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 32,
  },
  scrollView: {
    height: '100%',
    width: '100%',
    marginVertical: 32,
    paddingHorizontal: 16,
  },
  titleSection: {
    width: '100%',
    justifyContent: 'space-between',
    gap: 16,
  },
  badgeStyle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
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
    height: 24,
    fontWeight: 'bold',
    fontSize: 15,
  },
  familyTextDescription: {
    color: colors.black,
    fontWeight: 'normal',
    fontSize: 15,
  },
});

export default CreateBattleModal;
