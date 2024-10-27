import { Provider } from 'react-redux';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistStore, persistReducer } from 'redux-persist';
// import { LogBox } from 'react-native';
// LogBox.ignoreAllLogs();

import user from './reducers/user';
import friends from './reducers/friends';
import dailyChallenge from './reducers/dailyChallenge';
import inProgressChallenges from './reducers/inProgressChallenges';
import completedChallenges from './reducers/completedChallenges';
import canceledChallenges from './reducers/canceledChallenges';
import inProgressBattles from './reducers/inProgressBattles';

import LandingScreen from './screens/LandingScreen';
import { PersistGate } from 'redux-persist/integration/react';

const persistConfig = {
  key: 'happyday',
  storage: AsyncStorage,
  whitelist: ['user', 'dailyChallenge'],
};

const reducers = combineReducers({
  user,
  friends,
  dailyChallenge,
  inProgressChallenges,
  inProgressBattles,
  completedChallenges,
  canceledChallenges,
});

const store = configureStore({
  reducer: persistReducer(persistConfig, reducers),
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({ serializableCheck: false }),
});

const persistor = persistStore(store);

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <LandingScreen />
      </PersistGate>
    </Provider>
  );
}
