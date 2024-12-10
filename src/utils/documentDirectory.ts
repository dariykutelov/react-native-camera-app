import path from "path";
import * as FileSystem from "expo-file-system";

export const saveFileToDocumentDirectory = async (uri: string) => {
  const filename = path.parse(uri).base;

  await FileSystem.copyAsync({
    from: uri,
    to: FileSystem.documentDirectory + filename,
  });
};
