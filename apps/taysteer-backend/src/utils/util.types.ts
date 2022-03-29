type uploadImageT = (fileReadStream: NodeJS.ReadableStream, folder: string, id?: string) => Promise<string | false>;
type deleteImageT = (id: string, folder: string) => Promise<boolean>;

export { uploadImageT, deleteImageT }