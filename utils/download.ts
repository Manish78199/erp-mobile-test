import * as FileSystem from 'expo-file-system';

import { Alert } from 'react-native';

const downloadAndOpenFile = async (fileUrl: string, fileName: string) => {
    try {
        const fileUri = FileSystem.documentDirectory + fileName;
        const { uri } = await FileSystem.downloadAsync(fileUrl, fileUri);

        Alert.alert('Download complete', `File saved at ${uri}`);
    } catch (error) {
        console.error('Download error:', error);
        Alert.alert('Error', 'Unable to download file');
    }
};


export {
    downloadAndOpenFile
}