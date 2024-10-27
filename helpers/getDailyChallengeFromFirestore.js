import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from 'firebase/firestore';
import { firestoreDB } from '../firebase/firebase.config';
import areSameDays from './areSameDays';

export const getDailyChallengeFromFirestore = async () => {
  // GET daily chellenge from Firestore
  const dailyChallengeRef = doc(
    firestoreDB,
    'dailyChallenge',
    'lT1l7ll5wsdwu7NF3Zo1'
  );
  const dailyChallengeSnap = await getDoc(dailyChallengeRef);
  const today = new Date();

  // Check if daily challenge found in Firestore
  if (!dailyChallengeSnap.exists()) {
    // If daily challenge not found in Firestore
    console.warn(
      'Daily challenge document not found! Please contact the team.'
    );
  } else {
    // If daily challenge found in Firestore
    const dailyChallengeData = dailyChallengeSnap.data();
    const lastUpdate = dailyChallengeData.lastUpdate.toDate();
    // console.log(
    //   '[GET DAILY CHALLENGE] dailyChallenge snapshot data:',
    //   dailyChallengeData
    // );

    // Check if Firestore daily challenge last update is today
    const firestoreLastUpdateIsToday = areSameDays([today, lastUpdate]);
    console.log(
      '[GET DAILY CHALLENGE] firestoreLastUpdateIsToday:',
      firestoreLastUpdateIsToday
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
      await updateDoc(dailyChallengeRef, {
        nextChallenges,
      }).catch(err =>
        console.error('[GET DAILY CHALLENGE] update next challenges:', err)
      );

      const newDailyChallenge = !firestoreLastUpdateIsToday
        ? await updateDailyChallenge(nextChallenges)
        : { challenge: dailyChallengeData.challenge, lastUpdate };
      return newDailyChallenge;
    } else {
      const newDailyChallenge = !firestoreLastUpdateIsToday
        ? await updateDailyChallenge(dailyChallengeData.nextChallenges)
        : { challenge: dailyChallengeData.challenge, lastUpdate };
      return newDailyChallenge;
    }
  }

  async function updateDailyChallenge(nextChallenges) {
    // Select new daily challenge
    const index = Math.round(Math.random() * (nextChallenges.length - 1));

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
    return { challenge: newDailyChallenge, lastUpdate: today };
  }
};
