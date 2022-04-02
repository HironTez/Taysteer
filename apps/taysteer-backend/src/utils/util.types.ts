type uploadImageT = (fileReadStream: NodeJS.ReadableStream, folder: string, id?: string) => Promise<string | false>;
type deleteImageT = (link: string) => Promise<boolean>;

export { uploadImageT, deleteImageT }