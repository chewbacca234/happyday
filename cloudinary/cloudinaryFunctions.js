import cloudinary from 'cloudinary';

export const uploadPicture = (folder, picture) => {
  cloudinary.v2.uploader
    .upload(picture, {
      folder: `happyday/${folder}`,
      resource_type: 'image',
    })
    .then(console.log);
};
