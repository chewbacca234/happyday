import { styles, colors, headerHeight, Images } from '../../config';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  SafeAreaView,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import { getUserLevel } from '../../helpers/getUserLevel';
import { Platform } from 'react-native';
import FriendDetailsModal from './FriendDetailsModal';
import {
  ScreenTemplateCenter,
  ScreenTemplateSpaceAround,
} from '../../components';
import { addOneFriend, removeOneFriend } from '../../reducers/friends';

const EXPO_PUBLIC_BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export default function FriendsListScreen(navigation) {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const friends = useSelector(state => state.friends);
  const username = user.username;
  // console.log('friends', friends);

  const [newFriendName, setNewFriendName] = useState('');
  const [message, setMessage] = useState('');
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [loading, setLoading] = useState(false);

  const renderItem = ({ item, i }) => (
    <View key={i}>
      <TouchableOpacity
        style={screenStyles.cardContainer}
        onPress={() => handleOpenModal(item)}
      >
        <View style={screenStyles.leftContent}>
          <View style={screenStyles.title}>
            <Text style={styles.secondaryBodyTextBold}>
              {item.username}, {item.level.name.toUpperCase()}
            </Text>
          </View>
          <View style={styles.secondaryMediumBodyText}>
            <Text>Défis validés: {item.challengesCompleted.length}</Text>
            <Text>Défis abandonnés: {item.challengesCanceled.length}</Text>
            <Text>Défis en cours: {item.challengesInProgress.length}</Text>
            <Text>Battles validées: {item.battlesCompleted.length}</Text>
            <Text>Battles abandonnées: {item.battlesCanceled.length}</Text>
            <Text>Battles en cours: {item.battlesInProgress.length}</Text>
          </View>
          <Text style={screenStyles.score}>
            {item.score} points de Happiness
          </Text>
        </View>
        <View style={screenStyles.rightContent}>
          <Image
            style={styles.userPictureMiniBadge}
            source={
              item.picture
                ? { uri: `data:image/jpeg;base64,${item.picture}` }
                : Images.defaultAvatar
            }
            resizeMethod="resize"
          />
          <TouchableOpacity
            style={screenStyles.trash}
            onPress={() => handleRemoveFriend(item.username)}
          >
            <FontAwesome name="trash-alt" size={25} color="#000" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>
  );

  // POST delete a friend
  const handleRemoveFriend = friendUsername => {
    setLoading(true);

    fetch(
      `${EXPO_PUBLIC_BACKEND_URL}/users/removeFriend/${username}/${friendUsername}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        //body: JSON.stringify({ friendUsername: username }),
      }
    )
      .then(response => response.json())
      .then(data => {
        // console.log(data);
        if (data.result) {
          // Ami supprimé avec succès
          dispatch(removeOneFriend(data.friend._id));
          setLoading(false);
          console.log('Ami supprimé avec succès.');
          setMessage('Ami supprimé avec succès.');
          return;
        } else {
          // Gestion des erreurs
          setLoading(false);
          console.error("Erreur lors de la suppression de l'ami.");
          return setMessage("Erreur lors de la suppression de l'ami.");
        }
      });
  };

  //POST add friend
  const handleAddFriend = () => {
    Keyboard.dismiss();
    setLoading(true);

    fetch(`${EXPO_PUBLIC_BACKEND_URL}/users/addFriend/${username}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ friendUsername: newFriendName }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.result) {
          // Get friend levels
          const level = getUserLevel(data.friend.score);
          const friendWithLevel = { ...data.friend, level };

          // console.log('[MY FRIENDS SCREEN] handleAddFriend data', data);

          dispatch(addOneFriend(friendWithLevel));
          setLoading(false);
          setMessage('Ami ajouté avec succès.');
          setNewFriendName('');
          return;
        } else {
          setLoading(false);
          return setMessage("Erreur lors de l'ajout de l'ami.");
        }
      });
  };

  useEffect(() => {
    selectedFriend ? setModalVisible(true) : setModalVisible(false);
  }, [selectedFriend]);

  const handleOpenModal = item => {
    setSelectedFriend(item);
  };

  const handleCloseModal = () => {
    setSelectedFriend(null);
  };

  // console.log('friend data:', friendData);
  return friends.length !== 0 ? (
    <ScreenTemplateSpaceAround>
      <FlatList
        style={screenStyles.flatList}
        data={friends}
        keyExtractor={item => item.username}
        renderItem={renderItem}
      />
      <KeyboardAvoidingView
        style={styles.sectionAlignCenter}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TextInput
          placeholder="Tape ici l'identifiant de ton ami"
          placeholderTextColor={colors.lightGrey}
          style={styles.secondaryInput}
          value={newFriendName}
          onChangeText={text => setNewFriendName(text)}
        />
        <TouchableOpacity
          onPress={handleAddFriend}
          style={styles.primaryButton}
          activeOpacity={0.8}
        >
          <Text style={screenStyles.textInvit}>AJOUTE UN AMI</Text>
        </TouchableOpacity>
        <Text>{message}</Text>
      </KeyboardAvoidingView>

      <FriendDetailsModal
        friendData={selectedFriend}
        onClosed={handleCloseModal}
        navigation={navigation}
        isOpen={modalVisible}
      />
      {loading ? (
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
        </View>
      ) : null}
    </ScreenTemplateSpaceAround>
  ) : (
    <ScreenTemplateCenter>
      <View style={screenStyles.emptyListContainer}>
        <View
          style={{
            ...styles.sectionAlignCenter,
            justifyContent: 'center',
            flex: 1,
          }}
        >
          <Text style={styles.primaryTitle}>Tu n'as pas encore d'ami ?</Text>
          <Text style={styles.primarySubtitle}>
            N'hésites plus ! Tu as juste à entrer un identifiant et valider...
          </Text>
        </View>
        <View style={styles.sectionAlignCenter}>
          <TextInput
            placeholder="Tape ici l'identifiant de ton ami"
            placeholderTextColor={colors.lightGrey}
            style={styles.secondaryInput}
            value={newFriendName}
            onChangeText={text => setNewFriendName(text)}
          />
          <TouchableOpacity
            onPress={handleAddFriend}
            style={styles.primaryButton}
            activeOpacity={0.8}
          >
            <Text style={screenStyles.textInvit}>AJOUTE UN AMI</Text>
          </TouchableOpacity>
        </View>
      </View>
      {loading ? (
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
        </View>
      ) : null}
    </ScreenTemplateCenter>
  );
}

const screenStyles = StyleSheet.create({
  emptyListContainer: {
    height: '100%',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
  },
  flatList: {
    width: '100%',
  },
  cardContainer: {
    width: '100%',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 10,
    padding: 8,
    backgroundColor: colors.transpWhite70,
    marginVertical: 4,
  },
  leftContent: {
    width: '60%',
    height: '100%',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
  },
  level: {},
  description: {
    fontSize: 14,
    fontWeight: 'normal',
    marginBottom: 8,
  },
  score: {
    marginTop: 8,
    color: colors.primary,
    fontWeight: 'bold',
  },
  rightContent: {
    width: '20%',
    height: '90%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  icon: {},
  trash: {},
  button: {
    width: 350,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    backgroundColor: colors.black,
    borderRadius: 10,
    color: colors.white,
  },
  textInvit: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'normal',
  },
  input: {
    width: '130%',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 10,
    backgroundColor: colors.transpWhite70,
    padding: 16,
    gap: 16,
    marginBottom: 3,
    borderBottomColor: colors.black,
    borderBottomWidth: 0.5,
    fontSize: 14,
    // width: '80%',
    // marginTop: 25,
    // borderBottomColor: '#ec6e5b',
    // borderBottomWidth: 1,
    // fontSize: 18,
    // marginBottom: 20, // Ajustez la marge inférieure pour éviter que l'input ne soit masqué
  },
});
