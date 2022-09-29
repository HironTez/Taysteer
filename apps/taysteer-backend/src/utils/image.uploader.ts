import { cloudinary } from '../../../../configs/utils/cloudinary';
import { PromiseController } from './promise.controller';
import { deleteImageT, uploadImageT } from './util.types';

const uploadImage: uploadImageT = async (fileReadStream, folder) => {
  const promiseController = new PromiseController(); // Create a new promise controller
  // Create upload stream
  const uploadStream = cloudinary.uploader.upload_stream(
    { folder: folder },
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

const deleteImage: deleteImageT = async (link: string) => {
  const public_id = link.match(/(?<!\/\/)(?<=\/)\w+(?=\.)/)[0];
  const folder = link.match(/(?<=[0-9]\W).+(?=\W\w+\.\w+)/)[0];
  // Delete an old image
  const response = await cloudinary.uploader.destroy(`${folder}/${public_id}`);

  return response.result == 'ok';
};

export { uploadImage, deleteImage };
