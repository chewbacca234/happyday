import { Image, Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import { ScreenTemplateSpaceAround, HomeCard, InfoAlert } from '../components';

import { getUserLevel } from '../helpers/getUserLevel';
import getDailyChallenge from '../helpers/getDailyChallenge';

import { ChallengeDetailsModal } from './ChallengesScreens/ChallengeDetailsModal';
import { CreateBattleModal } from './BattlesScreens/CreateBattleModal';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { addAllInProgressChallenges } from '../reducers/inProgressChallenges';
import { addAllInProgressBattles } from '../reducers/inProgressBattles';
import { addAllCompletedChallenges } from '../reducers/completedChallenges';
import { addAllCanceledChallenges } from '../reducers/canceledChallenges';
import { addAllFriends } from '../reducers/friends';
import { addAllCompletedBattles } from '../reducers/completedBattles';
import { addAllCanceledBattles } from '../reducers/canceledBattles';
import { setLevel } from '../reducers/user';
import { setDailyChallenge } from '../reducers/dailyChallenge';
import { urls, styles, colors } from '../constants';
import { firestoreDB } from '../firebase/firebase.config';
import { addDoc, collection, doc } from 'firebase/firestore';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const friends = useSelector(state => state.friends);
  const dailyChallenge = useSelector(state => state.dailyChallenge);
  const inProgressChallenges = useSelector(state => state.inProgressChallenges);
  const completedChallenges = useSelector(state => state.completedChallenges);
  const canceledChallenges = useSelector(state => state.canceledChallenges);

  // console.log('[HOME SCREEN] reducer user =>', user);
  // console.log('[HOME SCREEN] reducer friends =>', friends);
  // console.log(
  //   '[HOME SCREEN] reducer inProgressChallenges =>',
  //   inProgressChallenges
  // );
  // console.log(
  //   '[HOME SCREEN] reducer completedChallenges =>',
  //   completedChallenges
  // );
  // console.log(
  //   '[HOME SCREEN] reducer canceledChallenges =>',
  //   canceledChallenges
  // );

  const [dailyChallengeModalVisible, setDailyChallengeModalVisible] =
    useState(false);
  const [launchBattleModalVisible, setLaunchBattleModalVisible] =
    useState(false);

  // useEffect(() => {
  //   const challenges = [
  //     {
  //       name: 'Faire du bénévolat dans un refuge pour animaux',
  //       description:
  //         'Passe du temps à aider au refuge pour animaux local en prenant soin des chiens et des chats abandonnés.',
  //       score: 60,
  //       picture:
  //         'https://res.cloudinary.com/dbh7czsdd/image/upload/v1698479193/happyday/challenges/oiqsvtc3avghlwebvzaf.jpg',
  //       pictureAlt: "femme qui s'occupe d'un chient",
  //       difficulty: 'Avancé',
  //     },
  //     {
  //       name: 'Déposer 1 livre dans une bibliothèque partagée',
  //       description:
  //         "Trouve une bibliothèque de rue ou une bibliothèque partagée dans ta communauté. Dépose un livre que tu as apprécié pour que d'autres puissent le lire à leur tour. Partager la lecture, c'est partager la connaissance !",
  //       score: 45,
  //       picture:
  //         'https://res.cloudinary.com/dbh7czsdd/image/upload/v1698479156/happyday/challenges/o2xzozd011yj5emoq858.jpg',
  //       pictureAlt: 'homme qui regarde un livre devant une bibliothèque de rue',
  //       difficulty: 'Facile',
  //     },
  //     {
  //       name: 'Faire du bénévolat dans un centre de soins pour personnes âgées',
  //       description:
  //         'Passe du temps avec les personnes âgées dans un centre de soins pour leur offrir de la compagnie et du réconfort.',
  //       score: 65,
  //       picture:
  //         'https://res.cloudinary.com/dbh7czsdd/image/upload/v1698479171/happyday/challenges/grn0x5qxyecrm5evzr8p.jpg',
  //       pictureAlt: 'homme aidant une personne âgée',
  //       difficulty: 'Avancé',
  //     },
  //     {
  //       name: 'Donner des vêtements à une œuvre caritative',
  //       description:
  //         'Fais don de vêtements en bon état à une œuvre caritative pour aider les personnes dans le besoin.',
  //       score: 40,
  //       picture:
  //         'https://res.cloudinary.com/dbh7czsdd/image/upload/v1698479167/happyday/challenges/zrwwhtzefqedzkbhicln.jpg',
  //       pictureAlt: 'homme apportant des vêtements à une oeuvre caritative',
  //       difficulty: 'Facile',
  //     },
  //     {
  //       name: 'Faire du bénévolat dans un refuge pour sans-abri',
  //       description:
  //         'Offre ton temps pour aider les sans-abri en distribuant de la nourriture et des vêtements.',
  //       score: 55,
  //       picture:
  //         'https://res.cloudinary.com/dbh7czsdd/image/upload/v1698479166/happyday/challenges/jnza6n5zwdldupe3tegr.jpg',
  //       pictureAlt: 'homme donnant à manger à un sans-abri',
  //       difficulty: 'Avancé',
  //     },
  //     {
  //       name: 'Offrir des bonbons à 3 inconnus',
  //       description:
  //         'Sélectionne 3 personnes au hasard dans la rue et offre-leur des bonbons. Sois gentil et respectueux.',
  //       score: 30,
  //       picture:
  //         'https://res.cloudinary.com/dbh7czsdd/image/upload/v1698479194/happyday/challenges/xja7c1xhkgvjcsbwbblk.jpg',
  //       pictureAlt: 'femme prenant un bonbon dans une boîte',
  //       difficulty: 'Facile',
  //     },
  //     {
  //       name: 'Nettoyer un parc local',
  //       description:
  //         "Organise un événement de nettoyage pour ramasser les déchets et améliorer la propreté d'un parc local.",
  //       score: 50,
  //       picture:
  //         'https://res.cloudinary.com/dbh7czsdd/image/upload/v1698479187/happyday/challenges/snpvt4kmgw9l4xcbyygq.jpg',
  //       pictureAlt: 'groupe de personnes ramassant des déchets dans une fôret',
  //       difficulty: 'Moyen',
  //     },
  //     {
  //       name: 'Organiser une collecte de denrées alimentaires',
  //       description:
  //         'Recueille des denrées alimentaires non périssables pour les familles dans le besoin de ta communauté.',
  //       score: 45,
  //       picture:
  //         'https://res.cloudinary.com/dbh7czsdd/image/upload/v1698479154/happyday/challenges/sj1ia3koraaeetqniwan.jpg',
  //       pictureAlt: 'personnes à une collecte de charité',
  //       difficulty: 'Moyen',
  //     },
  //     {
  //       name: 'Nourrir un chat errant',
  //       description:
  //         'Trouve un chat errant dans ton quartier et nourris-le. Assure-toi de lui donner de la nourriture adaptée aux chats.',
  //       score: 50,
  //       picture:
  //         'https://res.cloudinary.com/dbh7czsdd/image/upload/v1698479169/happyday/challenges/wvx3mocuedjwkmmnlamq.jpg',
  //       pictureAlt: 'femme nourrissant un chat dans la rue',
  //       difficulty: 'Facile',
  //     },
  //     {
  //       name: 'Planter un arbre',
  //       description:
  //         "Trouve un endroit approprié et plante un arbre pour contribuer à la préservation de l'environnement.",
  //       score: 75,
  //       picture:
  //         'https://res.cloudinary.com/dbh7czsdd/image/upload/v1698479192/happyday/challenges/cq04kmunajhts0m0ob5r.jpg',
  //       pictureAlt: 'homme plantant un arbre avec un enfant',
  //       difficulty: 'Avancé',
  //     },
  //   ];

  //   (async () => {
  //     challenges.forEach(async challenge => {
  //       const docRef = await addDoc(
  //         collection(firestoreDB, 'challenges'),
  //         challenge
  //       );
  //       console.log('Document written with ID: ', docRef.id);
  //     });
  //   })();
  // }, []);

  useEffect(() => {
    // Get user's friends, challenges and battles
    Promise.all([
      fetch(`${BACKEND_URL}/users/${user.username}/friends`).then(data =>
        data.json()
      ),
      fetch(`${BACKEND_URL}/users/${user.username}/challengesInProgress`).then(
        data => data.json()
      ),
      fetch(`${BACKEND_URL}/users/${user.username}/challengesCompleted`).then(
        data => data.json()
      ),
      fetch(`${BACKEND_URL}/users/${user.username}/challengesCanceled`).then(
        data => data.json()
      ),
      fetch(`${BACKEND_URL}/users/${user.username}/battlesInProgress`).then(
        data => data.json()
      ),
      fetch(`${BACKEND_URL}/users/${user.username}/battlesCompleted`).then(
        data => data.json()
      ),
      fetch(`${BACKEND_URL}/users/${user.username}/battlesCanceled`).then(
        data => data.json()
      ),
    ])
      .then(
        ([
          friendsData,
          challengesInProgressData,
          challengesCompletedData,
          challengesCanceledData,
          battlesInProgressData,
          battlesCompletedData,
          battlesCanceledData,
        ]) => {
          // console.log('[HOME SCREEN] Get friends fetched datas =>', {
          //   friendsData,
          // });
          // console.log('[HOME SCREEN] Get challenges fetched datas =>', {
          //   challengesInProgressData,
          //   challengesCompletedData,
          //   challengesCanceledData,
          // });
          // console.log('[HOME SCREEN] Get battles fetched datas =>', {
          //   battlesInProgressData,
          //   battlesCompletedData,
          //   battlesCanceledData,
          // });

          // Get friends levels
          const friendsWithLevel =
            friendsData.lenght !== 0
              ? friendsData.friends.map(friend => {
                  const level = getUserLevel(friend.score);
                  return { ...friend, level };
                })
              : [];

          // Dispatch datas to reducers
          dispatch(addAllFriends(friendsWithLevel));
          dispatch(
            addAllInProgressChallenges(
              challengesInProgressData.challengesInProgress
            )
          );
          dispatch(
            addAllCompletedChallenges(
              challengesCompletedData.challengesCompleted
            )
          );
          dispatch(
            addAllCanceledChallenges(challengesCanceledData.challengesCanceled)
          );
          dispatch(
            addAllInProgressBattles(battlesInProgressData.battlesInProgress)
          );
          dispatch(
            addAllCompletedBattles(battlesCompletedData.battlesCompleted)
          );
          dispatch(addAllCanceledBattles(battlesCanceledData.battlesCanceled));
          return;
        }
      )
      .catch(error => {
        console.error(
          '[HOME SCREEN] Fetch friends, challenges and battles error =>',
          error
        );
      });
  }, []);

  useEffect(() => {
    // Get user's level
    const level = getUserLevel(user.score);
    dispatch(setLevel({ ...level }));
  }, [user.score]);

  useEffect(() => {
    if (!dailyChallenge) {
      // Get the daily challenge
      (async () => {
        const newDailyChallenge = await getDailyChallenge();
        if (newDailyChallenge) {
          // Store the daily challenge to reducer
          dispatch(setDailyChallenge(newDailyChallenge));
        }
      })();
    }
  }, []);

  const handleOpenChallengeModal = () => {
    setDailyChallengeModalVisible(true);
  };

  const handleCloseChallengeModal = () => {
    setDailyChallengeModalVisible(false);
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

  return (
    <ScreenTemplateSpaceAround>
      {launchBattleModalVisible ? (
        <CreateBattleModal
          onClosed={handleCloseBattleModal}
          navigation={navigation}
          isOpen={launchBattleModalVisible}
        />
      ) : null}
      {dailyChallengeModalVisible ? (
        <ChallengeDetailsModal
          challenge={dailyChallenge?.challenge}
          onClosed={handleCloseChallengeModal}
          navigation={navigation}
          isOpen={dailyChallengeModalVisible}
        />
      ) : null}
      <Text style={styles.primaryTitle}>Welcome {user.username} !</Text>
      <View style={styles.userNivelBadge}>
        <Image
          style={{ height: 60, width: 60, resizeMode: 'contain' }}
          source={{ uri: user.level.iconPath }}
        />
      </View>
      <View style={styles.sectionAlignCenter}>
        <Text style={styles.primarySubtitle}>
          Niveau {user.level.name?.toUpperCase()} | {user.score} points
        </Text>
        <Text style={{ ...styles.primaryBodyText, textAlign: 'center' }}>
          Félicitations ! Il ne te manque que quelques bonnes actions pour
          passer au niveau supérieur...
        </Text>
      </View>
      <View style={styles.cardsSection}>
        <HomeCard
          type="image"
          title="Défi du jour :"
          description={[dailyChallenge?.challenge.name ?? 'Chargement...']}
          rightContent={
            dailyChallenge?.challenge.picture ?? urls.picturePlaceholder
          }
          onPress={handleOpenChallengeModal}
        />
        <HomeCard
          type="options"
          title="Choisis ton défi !"
          description={['Sélectionne l’un des défis proposés dans la liste...']}
          rightContent={[
            'Planter un arbre',
            'Faire rire une personne',
            'Ramasser des déchets',
          ]}
          onPress={() => navigation.navigate('DrawerAllChallenges')}
        />
        <HomeCard
          type="icon"
          title="Lance une Battle !"
          description={[
            'Défie tes amis et battez-vous pour gagner de Happiness points.',
          ]}
          rightContent={'skull-crossbones'}
          onPress={handleOpenBattleModal}
        />
      </View>
    </ScreenTemplateSpaceAround>
  );
}
