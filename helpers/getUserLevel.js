import { Image, View } from 'react-native';
import { styles } from '../constants';

export const getUserLevel = score => {
  let level = { name: null, iconPath: null };

  switch (true) {
    case score < 200:
      level.name = 'Débutant';
      level.iconPath =
        'https://res.cloudinary.com/dbh7czsdd/image/upload/v1699367373/happyday/userLevelBadges/zoziw2jvfwx9bd6a5izi.png';
      break;

    case score >= 200 && score < 400:
      level.name = 'Amateur';
      level.iconPath =
        'https://res.cloudinary.com/dbh7czsdd/image/upload/v1699367373/happyday/userLevelBadges/rfv9jx7vngtyprdirl8d.png';
      break;

    case score >= 400 && score < 600:
      level.name = 'Confirmé';
      level.iconPath =
        'https://res.cloudinary.com/dbh7czsdd/image/upload/v1699367374/happyday/userLevelBadges/nidsa3okwbd2itdxoz3z.png';
      break;

    case score >= 600 && score < 800:
      level.name = 'Expert';
      level.iconPath =
        'https://res.cloudinary.com/dbh7czsdd/image/upload/v1699367374/happyday/userLevelBadges/skziizbcfcmknenf3jta.png';
      break;

    case score >= 800 && score < 1000:
      level.name = 'Maître';
      level.iconPath =
        'https://res.cloudinary.com/dbh7czsdd/image/upload/v1699367373/happyday/userLevelBadges/w3wzzuz40jtve03tbkqh.png';
      break;

    case score >= 1000:
      level.name = 'Élite';
      level.iconPath =
        'https://res.cloudinary.com/dbh7czsdd/image/upload/v1699367372/happyday/userLevelBadges/sqjayletgm6a1pwkfnbz.png';
      break;

    default:
      level.name = '';
      level.iconPath = null;
      break;
  }

  return level;
};
