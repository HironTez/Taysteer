type uploadImageT = (id: string, fileReadStream: NodeJS.ReadableStream, folder: string) => Promise<string | false>;
type deleteImageT = (id: string, folder: string) => Promise<boolean>;

export { uploadImageT, deleteImageT }