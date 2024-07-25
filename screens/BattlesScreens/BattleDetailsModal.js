import React from 'react';
import { styles, colors, urls } from '../../constants';
import ModalBox from 'react-native-modalbox';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  TextInput,
} from 'react-native';
import { Badge } from 'react-native-elements';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';

const BattleDetailsModal = ({ onClosed, battleData, navigation, isOpen }) => {
  // console.log('battle data modal:', battleData);

  // some math for scores! youpi
  //  const scoreFirst = battleData.challenge.score;
  //  const scoreSecond = 0.75 * scoreFirst; // 75% de scoreFirst
  //  const scoreThird = 0.4 * scoreFirst;

  const handleGoToMyBattlesScreen = () => {
    navigation.navigate('DrawerMyBattles');
  };

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
        style={{ ...modalStyle.gradient }}
        {...colors.secondaryGradientProps}
      >
        <ScrollView
          style={modalStyles.scrollView}
          contentContainerStyle={modalStyles.scrollViewContainer}
        >
          <Text style={styles.secondaryTitle}>{battleData.name}</Text>
          <Text style={styles.secondarySubtitle}>
            {battleData.challenge.name}
          </Text>
          <Image
            style={styles.picture}
            source={{ uri: battleData.challenge.picture }}
          />

          <View style={styles.sectionAlignLeft}>
            <Text>Niveau : {battleData.challenge.difficulty}</Text>
            <Text>{battleData.challenge.description}</Text>
          </View>
          <View style={styles.sectionAlignCenter}>
            <Text>1er: {battleData.scoreFirst} points de Happiness</Text>
            <Text>2nd: {battleData.scoreSecond} points de Happiness</Text>
            <Text>3ème: {battleData.scoreThird} points de Happiness</Text>
          </View>

          <View style={styles.sectionAlignLeft}>
            <Text>Participants: </Text>
            {battleData.users.map((user, i) => (
              <View key={i}>
                <Text>{user.username}</Text>
              </View>
            ))}
          </View>

          <ScrollView
            style={modalStyles.chatContainer}
            contentContainerStyle={styles.sectionAlignLeft}
          >
            <Text>Battle Chat: </Text>
            <Text>Moi: J’ai presque fini !!</Text>
            <Text>
              Ami 1: Ben moi ça fait longtemps que j’ai fini !!! Vous trainez
              les gars...
            </Text>
            <Text>Moi: Fais pas ton malin</Text>
            <Text>
              Ami 2: J’ai laissé tombé les amis, pas possible pour moi...
            </Text>
            <TextInput
              placeholder="Participe au Battle Chat"
              onChangeText={null}
              style={styles.primaryInput}
            />
            <TouchableOpacity
              onPress
              style={styles.secondaryButton}
              activeOpacity={0.8}
            >
              <Text style={styles.secondaryButtonText}>Envoyer</Text>
            </TouchableOpacity>
          </ScrollView>

          <View style={{ ...styles.sectionAlignCenter, gap: 24 }}>
            <TextInput
              editable
              multiline
              numberOfLines={4}
              maxLength={250}
              autoCapitalize="sentences"
              onChangeText={null}
              value={null}
              style={modalStyle.validInput}
              placeholder="Décris ta bonne action..."
            />
            {/* {pickedPicturePath && ( */}
            <Image
              source={{ uri: urls.picturePlaceholder }}
              loadingIndicatorSource={{ uri: urls.picturePlaceholder }}
              style={modalStyle.pickedPicture}
              resizeMethod="resize"
              // height={150}
            />
            {/* )} */}
            <View style={modalStyle.loadPicturesButtons}>
              <TouchableOpacity
                onPress={null}
                style={styles.iconButton}
                activeOpacity={0.8}
              >
                <FontAwesome
                  name="image"
                  light
                  size={24}
                  color={colors.white}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={null}
                style={styles.iconButton}
                activeOpacity={0.8}
              >
                <FontAwesome
                  name="camera"
                  light
                  size={24}
                  color={colors.white}
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={null}
              style={styles.primaryButton}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>Je valide la Battle</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={null}
              style={{ ...styles.tertiaryButton, width: 200 }}
              activeOpacity={0.8}
            >
              <Text style={styles.tertiaryButtonText}>J'abandonne</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.sectionAlignCenter}>
            <TouchableOpacity
              onPress={onClosed}
              style={styles.primaryButton}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>Fermer</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleGoToMyBattlesScreen}
              style={styles.primaryButton}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>Mes Battles</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </ModalBox>
  );
};

const modalStyles = StyleSheet.create({
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
    gap: 24,
  },
  scrollView: {
    height: '100%',
    width: '100%',
    marginVertical: 32,
    paddingHorizontal: 16,
  },
  button: {
    width: 150,
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 8,
    backgroundColor: colors.black,
    borderRadius: 10,
  },
  textButton: {
    color: '#ffffff',
    height: 24,
    fontWeight: '600',
    fontSize: 15,
  },
  chatContainer: {
    width: '80%',
    // height: 300,
    backgroundColor: colors.transpWhite50,
    borderRadius: 10,
    paddingVertical: 8,
  },
  input: {
    width: '80%',
    marginTop: 25,
    borderBottomColor: '#ec6e5b',
    borderBottomWidth: 1,
    fontSize: 18,
  },
  validInput: {
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
});

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
  validInput: {
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

export default BattleDetailsModal;
