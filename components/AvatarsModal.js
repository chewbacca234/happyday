import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import ModalBox from 'react-native-modalbox';
import { colors, urls } from '../constants';

export function AvatarsModal({
  isOpen = false,
  onClose = () => null,
  onSelect = () => null,
}) {
  const avatarsData = urls.avatarsData;

  const avatars = avatarsData.map((avatar, i) => {
    return (
      <TouchableOpacity
        key={i}
        onPress={() => onSelect(avatar)}
        style={{ borderRadius: 10, elevation: 4 }}
        activeOpacity={0.8}
      >
        <Image
          style={{
            height: 60,
            width: 60,
            resizeMode: 'cover',
            borderRadius: 10,
          }}
          source={{ uri: avatar }}
          resizeMethod="resize"
        />
      </TouchableOpacity>
    );
  });

  return (
    <ModalBox
      style={modalStyles.modalContainer}
      startOpen={false}
      coverScreen={true}
      backdropPressToClose={true}
      swipeToClose={true}
      isOpen={isOpen}
      onClosed={onClose}
      backdropOpacity={0}
      position="center"
    >
      {avatars}
    </ModalBox>
  );
}

const modalStyles = StyleSheet.create({
  modalContainer: {
    height: 'auto',
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 16,
    rowGap: 32,
    paddingHorizontal: 16,
    paddingVertical: 32,
    borderRadius: 20,
    backgroundColor: colors.secondary,
    elevation: 4,
  },
});
