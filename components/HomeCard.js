import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import { styles, Images, colors } from '../config';

export function HomeCard({
  type,
  title,
  description,
  rightContent,
  onPress,
  variableHeight,
}) {
  let contentSection = null;

  switch (type) {
    case 'image':
      contentSection = (
        <Image
          source={{ uri: rightContent }}
          loadingIndicatorSource={Images.picturePlaceholderUri}
          style={cardStyles.image}
        />
      );
      break;

    case 'options':
      contentSection = rightContent.map((option, i) => {
        return (
          <Text
            key={i}
            style={{
              ...cardStyles.options,
              ...styles.secondaryLightBodyTextBold,
            }}
          >
            {option}
          </Text>
        );
      });
      break;

    case 'icon':
      contentSection = (
        <FontAwesome name={rightContent} size={70} color={colors.secondary} />
      );
      break;

    default:
      contentSection = null;
      break;
  }

  const heightOption = variableHeight ? { flex: 1 } : { height: 100 };

  return (
    <TouchableOpacity
      style={{ ...styles.card, ...heightOption }}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={cardStyles.textSection}>
        <Text style={styles.secondaryMediumBodyTextBold}>{title}</Text>
        <Text style={styles.secondaryMediumBodyText}>{description[0]}</Text>
        {description[1] ? (
          <Text
            style={{
              ...styles.secondaryMediumBodyText,
              ...cardStyles.specialDescription,
            }}
          >
            {description[1]}
          </Text>
        ) : null}
      </View>
      <View style={cardStyles.contentSection}>{contentSection}</View>
    </TouchableOpacity>
  );
}

const cardStyles = StyleSheet.create({
  textSection: {
    justifyContent: 'center',
    width: '58%',
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
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 5,
    borderColor: colors.darkGrey,
    borderWidth: 0.5,
  },
  options: {
    width: '100%',
    textAlign: 'center',
    paddingVertical: 3,
    paddingHorizontal: 6,
    fontSize: 11,
    fontWeight: 'normal',
    backgroundColor: colors.lightGrey,
    borderRadius: 5,
    borderColor: colors.darkGrey,
    borderWidth: 0.5,
  },
});
