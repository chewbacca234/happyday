import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import ModalBox from 'react-native-modalbox';
import { useSelector } from 'react-redux';
import React, { useState } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import { styles, colors, Images } from '../../config';
import { LinearGradient } from 'expo-linear-gradient';

const EXPO_PUBLIC_BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export default function FriendDetailsModal({ onClosed, isOpen, friendData }) {
  //console.log(friendData)

  const [message, setMessage] = useState('');
  const [friendsList, setFriendsList] = useState([]);
  const user = useSelector(state => state.user);
  const username = useSelector(state => state.user.username);
  let friendScore = user.score;

  // POST delete a friend
  const handleRemoveFriend = friendUsername => {
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
        if (data.result) {
          // Ami supprimé avec succès
          console.log('Succès', 'Ami supprimé avec succès.');
          setFriendsList(
            friendsList.filter(friend => friend.username !== friendUsername)
          );
          setMessage('Ami supprimé avec succès');
          onClosed();
        } else {
          // Gestion des erreurs
          setMessage("Erreur lors de la suppression de l'ami.");
          console.error('Erreur', "Erreur lors de la suppression de l'ami.");
        }
      });
  };
  const onClose = () => {
    onClose();
  };

  if (!friendData) {
    return <View></View>;
  }

  return (
    <ModalBox
      style={modalStyles.modalContainer}
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
        style={modalStyles.gradient}
        {...colors.primaryGradientProps}
      >
        <TouchableOpacity
          onPress={onClosed}
          activeOpacity={0.8}
          style={{ position: 'absolute', top: 16, left: 16 }}
        >
          <FontAwesome name="times" size={16} color={colors.white} light />
        </TouchableOpacity>
        <View style={modalStyles.titleSection}>
          <Image
            style={styles.userPictureBadge}
            source={
              friendData.picture
                ? { uri: `data:image/jpeg;base64,${friendData.picture}` }
                : Images.defaultAvatar
            }
            resizeMethod="resize"
          />
          <Text style={{ ...styles.primaryTitle, width: '100%' }}>
            {friendData.username}
          </Text>
        </View>
        <View style={styles.sectionAlignCenter}>
          <Text style={{ ...styles.primaryBodyText, textAlign: 'center' }}>
            Email: {friendData.email}
          </Text>

          <Text style={{ ...styles.primaryBodyText, textAlign: 'center' }}>
            Date de naissance: {friendData.dateOfBirth}
          </Text>

          <Text style={{ ...styles.primaryBodyText, textAlign: 'center' }}>
            Téléphone: {friendData.phone}
          </Text>

          <Text style={{ ...styles.primaryBodyText, textAlign: 'center' }}>
            Ville: {friendData.city}
          </Text>
        </View>

        <View style={styles.sectionAlignCenter}>
          <View style={styles.userNivelBadge}>
            <Image
              style={{ height: 60, width: 60, resizeMode: 'contain' }}
              source={{ uri: friendData.level.iconPath }}
            />
          </View>
          <Text style={{ ...styles.primaryBodyText, textAlign: 'center' }}>
            Niveau: {friendData.level.name.toUpperCase()} | {friendScore} points
          </Text>
        </View>
        <View>
          <TouchableOpacity
            onPress={() => handleRemoveFriend(friendData.username)}
            style={styles.primaryButton}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>Retirer de mes amis</Text>
          </TouchableOpacity>
          <Text>{message}</Text>
        </View>
      </LinearGradient>
    </ModalBox>
  );
}

const modalStyles = StyleSheet.create({
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
    justifyContent: 'space-between',
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  titleSection: {
    width: '100%',
    alignItems: 'center',
    marginTop: 64,
    gap: 32,
  },
});
