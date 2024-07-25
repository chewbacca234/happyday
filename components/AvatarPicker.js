import { Image, Keyboard, TouchableOpacity } from 'react-native';
import { AvatarsModal } from './AvatarsModal';
import { useState } from 'react';

export function AvatarPicker({ handleChooseAvatar, hasAvatar }) {
  const [isModalOpen, setIsAvatarModalOpen] = useState(false);

  const showModal = () => {
    setIsAvatarModalOpen(true);
  };

  const closeModal = () => {
    setIsAvatarModalOpen(false);
  };

  const onSelect = avatar => {
    Keyboard.dismiss();
    handleChooseAvatar(avatar);
    setIsAvatarModalOpen(false);
  };

  return (
    <>
      <TouchableOpacity
        onPress={showModal}
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
          source={{
            uri: !hasAvatar
              ? 'https://res.cloudinary.com/dbh7czsdd/image/upload/v1701205723/happyday/avatars/nwc57jlxauf4d8pq7sia.png'
              : hasAvatar,
          }}
          resizeMethod="resize"
        />
      </TouchableOpacity>
      <AvatarsModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSelect={onSelect}
      />
    </>
  );
}
