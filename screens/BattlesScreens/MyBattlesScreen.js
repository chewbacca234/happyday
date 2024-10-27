import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Modal,
  SafeAreaView,
} from 'react-native';
import { Badge } from 'react-native-elements';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';
import { styles, colors, headerHeight } from '../../config';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BattleDetailsModal from './BattleDetailsModal';
import { CreateBattleModal } from './CreateBattleModal';
import { InfoAlert } from '../../components';

const EXPO_PUBLIC_BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export default function MyBattlesScreen({ navigation }) {
  const user = useSelector(state => state.user);
  const friends = useSelector(state => state.friends);

  const [myBattlesCompletedData, setMyBattlesCompletedData] = useState([]);
  const [myBattlesInProgressData, setMmyBattlesInProgressData] = useState([]);
  const [isBattleDetailsModalVisible, setBattleDetailsModalVisible] =
    useState(false);
  const [launchBattleModalVisible, setLaunchBattleModalVisible] =
    useState(false);
  const [battleData, setBattleData] = useState(null);
  const [selectedBattle, setSelectedBattle] = useState(null);
  const safeInsetTop = useSafeAreaInsets().top;

  console.log('isBattleDetailsModalVisible', isBattleDetailsModalVisible);

  useEffect(() => {
    fetch(`${EXPO_PUBLIC_BACKEND_URL}/battles/byuser/${user.username}`)
      .then(response => response.json())
      .then(data => {
        // console.log('data renvoyée par le fetch', data);
        setMyBattlesCompletedData(data.battlesCompleted);
        setMmyBattlesInProgressData(data.battlesInProgress);
        setBattleData(data);
        // console.log('myBattlesCompletedData', myBattlesCompletedData);
        // console.log('myBattlesInProgressData', myBattlesInProgressData);
      })
      .catch(error => {
        console.error('UseEffect fetch error', error);
      });
  }, []);

  // Setup modal open if there is a picked challenge
  useEffect(() => {
    selectedBattle && handleOpenDetailsModal();
  }, [selectedBattle]);

  const handleCloseDetailsModal = () => {
    setBattleDetailsModalVisible(false);
  };
  const handleOpenDetailsModal = () => {
    setBattleDetailsModalVisible(true);
  };

  const handleOpenBattleModal = () => {
    if (friends.length > 0) {
      setLaunchBattleModalVisible(true);
    } else {
      InfoAlert(
        'Ajoute des amis pour pouvoir lancer une Battle et défier tes amis !'
      );
    }
  };

  const handleCloseBattleModal = () => {
    setLaunchBattleModalVisible(false);
  };

  const battlesCompleted = myBattlesCompletedData
    ? myBattlesCompletedData.map((battleCompleted, i) => {
        // console.log('battle completed', battleCompleted);
        return (
          <View key={i}>
            <TouchableOpacity
              onPress={() => setSelectedBattle(battleCompleted)}
              activeOpacity={0.8}
              style={battleStyles.battleContainer}
            >
              <View style={battleStyles.textSection}>
                <Text style={battleStyles.title}>{battleCompleted.name}</Text>
                <Text style={battleStyles.description}>
                  {battleCompleted.challenge.name}
                </Text>
                <Text style={battleStyles.score}>
                  1er : {battleCompleted.scoreFirst} points de Happiness
                </Text>
                <Text style={battleStyles.score}>
                  2ème : {battleCompleted.scoreSecond} points de Happiness
                </Text>
                <Text style={battleStyles.score}>
                  3ème : {battleCompleted.scoreThird} points de Happiness
                </Text>
              </View>
              <View style={battleStyles.friendsSection}>
                <Text style={styles.secondaryMediumBodyTextBold}>
                  Participants:{' '}
                </Text>
                <View style={battleStyles.friends}>
                  <FlatList
                    style={battleStyles.nestedFlatList}
                    data={battleCompleted.users}
                    keyExtractor={item => item.username}
                    renderItem={({ item }) => {
                      const battleId = battleCompleted._id;
                      // console.log('item', item);
                      // console.log('canceled', item.battlesCanceled);
                      // console.log('completed', item.battlesCompleted);

                      let battlesStatus = 'warning';
                      if (item.battlesCanceled.includes(battleId)) {
                        battlesStatus = 'error';
                      }
                      if (item.battlesCompleted.includes(battleId)) {
                        battlesStatus = 'success';
                      }
                      return (
                        <View style={battleStyles.nestedFlatListContainer}>
                          <Text>{item.username} </Text>
                          <Badge
                            status={battlesStatus}
                            badgeStyle={battleStyles.badgeStyle}
                          />
                        </View>
                      );
                    }}
                  />
                </View>
              </View>
            </TouchableOpacity>
          </View>
        );
      })
    : null;

  const battlesInProgress = myBattlesInProgressData
    ? myBattlesInProgressData.map((battleInProgress, i) => {
        // console.log("battleInProgress", battleInProgress._id);
        // const battleId = battleInProgress._id
        // console.log("battleInProgress.users", battleInProgress.users)

        return (
          <View key={i}>
            <TouchableOpacity
              onPress={() => setSelectedBattle(battleInProgress)}
              activeOpacity={0.8}
              style={battleStyles.battleContainer}
            >
              <View style={battleStyles.textSection}>
                <Text style={battleStyles.title}>{battleInProgress.name}</Text>
                <Text style={battleStyles.description}>
                  {battleInProgress.challenge.name}
                </Text>
                <Text style={battleStyles.score}>
                  1er: {battleInProgress.scoreFirst} points de Happiness
                </Text>
                <Text style={battleStyles.score}>
                  2ème: {battleInProgress.scoreSecond} points de Happiness
                </Text>
                <Text style={battleStyles.score}>
                  3ème: {battleInProgress.scoreThird} points de Happiness
                </Text>
              </View>
              <View style={battleStyles.friendsSection}>
                <Text style={styles.secondaryMediumBodyTextBold}>
                  Participants:{' '}
                </Text>
                <View style={battleStyles.friends}>
                  <FlatList
                    style={battleStyles.nestedFlatList}
                    horizontal={false}
                    data={battleInProgress.users}
                    keyExtractor={item => item.username}
                    renderItem={({ item }) => {
                      const battleId = battleInProgress._id;
                      // console.log('item', item);
                      // console.log('canceled', item.battlesCanceled);
                      // console.log('completed', item.battlesCompleted);

                      let battlesStatus = 'warning';
                      if (item.battlesCanceled.includes(battleId)) {
                        battlesStatus = 'error';
                      }
                      if (item.battlesCompleted.includes(battleId)) {
                        battlesStatus = 'success';
                      }
                      return (
                        <View style={battleStyles.nestedFlatListContainer}>
                          <Text>{item.username} </Text>
                          <Badge
                            status={battlesStatus}
                            badgeStyle={battleStyles.badgeStyle}
                          />
                        </View>
                      );
                    }}
                  />
                </View>
              </View>
            </TouchableOpacity>
          </View>
        );
      })
    : null;

  const flatListItems = [battlesCompleted, battlesInProgress];

  return (
    <LinearGradient
      style={{
        ...styles.containerSpaceAround,
        paddingTop: safeInsetTop + headerHeight + 16,
      }}
      {...colors.primaryGradientProps}
    >
      <SafeAreaView style={styles.containerSpaceAround}>
        {selectedBattle ? (
          <BattleDetailsModal
            //isBattleDetailsModalVisible={isBattleDetailsModalVisible}
            onClosed={handleCloseDetailsModal}
            battleData={selectedBattle}
            navigation={navigation}
            isOpen={isBattleDetailsModalVisible}
          />
        ) : null}
        {battlesCompleted || battlesInProgress ? (
          <FlatList
            style={battleStyles.flatList}
            data={flatListItems}
            renderItem={({ item }) => {
              return <View>{item}</View>;
            }}
          />
        ) : (
          <View style={styles.sectionAlignCenter}>
            <Text style={styles.primaryTitle}>
              Pas de Battle pour le moment...
            </Text>
            <Text style={styles.primarySubtitle}>
              Lance une Battle pour Défier tes amis de la HappyFamily !
            </Text>
          </View>
        )}
        <TouchableOpacity
          onPress={handleOpenBattleModal}
          style={styles.primaryButton}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryButtonText}>Lancer une battle</Text>
        </TouchableOpacity>

        <CreateBattleModal
          onClosed={handleCloseBattleModal}
          navigation={navigation}
          isOpen={launchBattleModalVisible}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}

const battleStyles = StyleSheet.create({
  battleContainer: {
    height: 'auto',
    width: '100%',
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    justifyContent: 'space-between',
    padding: 8,
    marginBottom: 5,
    backgroundColor: colors.transpWhite70,
  },
  textSection: {
    width: '70%',
    height: '100%',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    fontWeight: 'normal',
    marginBottom: 8,
  },
  friendsSection: {
    height: 100,
    borderLeftWidth: 0.5,
    justifyContent: 'top',
    alignItems: 'left',
    paddingLeft: 0,
  },
  badgeStyle: {
    width: 10,
    height: 10,
  },
  score: {
    marginTop: 8,
    color: colors.primary,
    fontWeight: 'bold',
  },
  flatList: {
    width: '100%',
  },
  nestedFlatList: {
    //borderColor: 'red',
    //borderWidth: 1,
    // backgroundColor: colors.lightGrey,
  },
  nestedFlatListContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 5,
  },
});
