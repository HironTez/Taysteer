import { cloudinary } from 'configs/utils/cloudinary';
import { PromiseController } from './promise.controller';
import { deleteImageT, uploadImageT } from './util.types';

const uploadImage: uploadImageT = async (public_id, fileReadStream, folder) => {
  const promiseController = new PromiseController(); // Create a new promise controller
  // Create upload stream
  const uploadStream = cloudinary.uploader.upload_stream(
    { public_id: public_id, folder: folder },
    (error, result) => {
      if (!error) {
        promiseController.resolve(result.url); // Return a response using the promise
      } else promiseController.resolve(false);
    }
  );
  fileReadStream.pipe(uploadStream); // Connect the file read stream

  const uploadedResponse = await promiseController.promise; // Get a response
  return uploadedResponse;
};

const deleteImage: deleteImageT = async (public_id, folder) => {
  // Delete an old image
  const response = await cloudinary.uploader.destroy(`${folder}/${public_id}`);

  return response.result == 'ok';
};

export { uploadImage, deleteImage };