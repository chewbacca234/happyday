import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from 'firebase/firestore';
import { firestoreDB } from '../firebase/firebase.config';
import { useSelector } from 'react-redux';

export const getDailyChallenge = async () => {
  const dailyChallenge = useSelector(state => state.dailyChallenge.value);
  console.log('[GET DAILY CHALLENGE] dailyChallenge reducer:', dailyChallenge);

  // GET daily chellenge from Firestore
  const dailyChallengeRef = doc(
    firestoreDB,
    'dailyChallenge',
    'lT1l7ll5wsdwu7NF3Zo1'
  );
  const dailyChallengeSnap = await getDoc(dailyChallengeRef);
  const today = new Date();

  // Check if daily challenge found in Firestore
  if (dailyChallengeSnap.exists()) {
    // If daily challenge found in Firestore
    const dailyChallengeData = dailyChallengeSnap.data();
    const lastUpdate = dailyChallengeData.lastUpdate.toDate();
    // console.log(
    //   '[GET DAILY CHALLENGE] dailyChallenge snapshot data:',
    //   dailyChallengeData
    // );

    // Check if Redux and Firestore daily challenge last update is today
    const reduxEqualsFirestoreEqualsToday = isSameDay([
      today,
      lastUpdate,
      new Date(dailyChallenge.lastUpdate),
    ]);
    console.log(
      '[GET DAILY CHALLENGE] reduxEqualsFirestoreEqualsToday:',
      reduxEqualsFirestoreEqualsToday
    );

    // Check if next daily challenges list is empty;
    if (!dailyChallengeData.nextChallenges.length) {
      let nextChallenges = [];
      // Fetch challenges list if next daily challenges list is empty;
      const challengesSnapshot = await getDocs(
        collection(firestoreDB, 'challenges')
      ).catch(err =>
        console.error('[GET DAILY CHALLENGE] get challenges:', err)
      );

      challengesSnapshot.forEach(challenge => {
        nextChallenges.push(challenge.data());
      });
      console.log('[GET DAILY CHALLENGE] new next challenges:', nextChallenges);

      // UPDATE next challenges
      updateDoc(dailyChallengeRef, {
        nextChallenges,
      }).catch(err =>
        console.error('[GET DAILY CHALLENGE] update next challenges:', err)
      );

      if (reduxEqualsFirestoreEqualsToday) {
        return null;
      }

      updateDailyChallenge(
        dailyChallengeData.challenge,
        nextChallenges,
        lastUpdate
      );
    } else {
      if (reduxEqualsFirestoreEqualsToday) {
        return null;
      }

      updateDailyChallenge(
        dailyChallengeData.challenge,
        dailyChallengeData.nextChallenges,
        lastUpdate
      );
    }
  } else {
    // If daily challenge not found in Firestore
    console.warn(
      'Daily challenge document not found! Please contact the team.'
    );
    return null;
  }

  async function updateDailyChallenge(
    currentChallenge,
    nextChallenges,
    lastUpdate
  ) {
    // Check if Firestore last update is today
    const firestoreUpdateisToday = isSameDay([today, lastUpdate]);
    console.log(
      '[GET DAILY CHALLENGE] firestoreUpdateisToday',
      firestoreUpdateisToday
    );

    // Set new daily challenge if not today for Firestore
    if (!firestoreUpdateisToday) {
      // Select new daily challenge
      const index = Math.round(Math.random() * nextChallenges.length - 1);

      const newDailyChallenge = nextChallenges[index];
      console.log('[GET DAILY CHALLENGE] newDailyChallenge', newDailyChallenge);
      console.log('[GET DAILY CHALLENGE] nextChallenges', nextChallenges);

      // UPDATE next challenges list removing the new daily challenge
      const updatedNextChallengesList = nextChallenges.filter(
        challenge => challenge.name !== newDailyChallenge.name
      );

      // UPDATE Firestore daily challenge with new daily challenge and updated next challenges list
      await updateDoc(dailyChallengeRef, {
        challenge: newDailyChallenge,
        lastUpdate: today,
        nextChallenges: updatedNextChallengesList,
      }).catch(err =>
        console.error(
          '[GET DAILY CHALLENGE] update Firestore daily challenge:',
          err
        )
      );

      // Check if Redux last update is today
      const reduxUpdateisToday = isSameDay([
        today,
        new Date(dailyChallenge.lastUpdate),
      ]);
      console.log(
        '[GET DAILY CHALLENGE] reduxUpdateisToday if Firestore not today:',
        reduxUpdateisToday
      );

      if (!reduxUpdateisToday) {
        // RETURN daily challenge for reducer
        return {
          challenge: newDailyChallenge,
          lastUpdate: today,
        };
      } else {
        return null;
      }
      // Set Redux daily challenge if today for Firesore
    } else {
      // Check if Redux last update is today
      const reduxUpdateisToday = isSameDay([
        today,
        new Date(dailyChallenge.lastUpdate),
      ]);
      console.log(
        '[GET DAILY CHALLENGE] reduxUpdateisToday if Firestore is today:',
        reduxUpdateisToday
      );

      if (!reduxUpdateisToday) {
        // RETURN daily challenge for reducer
        return {
          challenge: currentChallenge,
          lastUpdate: today,
        };
      } else {
        return null;
      }
    }
  }
};

function isSameDay(dates) {
  console.log('dates:', dates);
  let result = true;

  if (dates.length < 2) {
    result = false;
    return result;
  }

  for (let i = 0; i < dates.length; i++) {
    console.log('Compare dates:', typeof dates[i], 'vs', typeof dates[i + 1]);

    if (
      !dates[i] ||
      !dates[i + 1] ||
      !typeof dates[i] === 'object' ||
      !typeof dates[i + 1] === 'object'
    ) {
      console.warn('in if');
      result = false;
      break;
    } else {
      console.warn('in else');
      if (dates[i].getDate() !== dates[i + 1].getDate()) {
        result = false;
        break;
      } else if (dates[i].getMonth() !== dates[i + 1].getMonth()) {
        result = false;
        break;
      } else if (dates[i].getFullYear() !== dates[i + 1].getFullYear()) {
        result = false;
        break;
      }
    }
  }

  return result;
}
