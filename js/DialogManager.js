import DirectoryData from "./DirectoryData.js";

class DialogManager {
    /**
     * 폴더 선택 다이얼로그 표시
     * @returns {Promise<DirectoryData>}
     */
    static async openDirectoryDialog() {
        const directoryHandle = await window.showDirectoryPicker();

        return new DirectoryData(directoryHandle.name, directoryHandle);
    }
}

export default DialogManager;
