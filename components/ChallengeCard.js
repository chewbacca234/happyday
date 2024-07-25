import React from 'react';
import { colors, styles, urls } from '../constants';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Badge } from 'react-native-elements';

export function ChallengeCard({
  type,
  title,
  description,
  score,
  rightContent,
  onPress,
  numberCompleted,
  numberInProgress,
}) {
  let badgeSection = null;

  switch (type) {
    case 'completed':
      badgeSection = (
        <Badge
          status="success"
          badgeStyle={cardStyles.badgeStyle}
          value={numberCompleted}
        />
      );
      break;

    case 'inProgress':
      badgeSection = (
        <Badge
          status="warning"
          badgeStyle={cardStyles.badgeStyle}
          value={numberInProgress}
        />
      );
      break;

    case 'canceled':
      badgeSection = (
        <Badge status="error" badgeStyle={cardStyles.badgeStyle} />
      );
      break;

    default:
      badgeSection = null;
      break;
  }

  return (
    <TouchableOpacity
      style={{ ...styles.card, flex: 1 }}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={cardStyles.textSection}>
        <Text style={styles.secondaryMediumBodyTextBold}>{title}</Text>
        <Text style={styles.secondaryMediumBodyText}>{description}</Text>
        <Text
          style={{
            ...styles.secondaryMediumBodyText,
            ...cardStyles.specialDescription,
          }}
        >
          {score}
        </Text>
      </View>
      <View style={cardStyles.contentSection}>
        <Image
          source={rightContent}
          loadingIndicatorSource={{ uri: urls.picturePlaceholder }}
          style={cardStyles.image}
        />
      </View>
      <View style={cardStyles.badgeSection}>{badgeSection}</View>
    </TouchableOpacity>
  );
}

const cardStyles = StyleSheet.create({
  textSection: {
    justifyContent: 'center',
    width: '53%',
    height: '100%',
  },
  specialDescription: {
    color: colors.primary,
    marginTop: 8,
  },
  contentSection: {
    width: '40%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },
  badgeSection: {
    width: '5%',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 5,
    borderColor: colors.darkGrey,
    borderWidth: 0.5,
  },
  badgeStyle: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
});
