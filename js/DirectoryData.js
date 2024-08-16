import FileData from "./FileData.js";

class DirectoryData {
    /** @type {string} */
    name;
    /** @type {FileSystemDirectoryHandle} */
    handle;

    /**
     * 생성자
     * @param name {string}
     * @param handle {FileSystemDirectoryHandle}
     */
    constructor(name, handle) {
        this.name = name;
        this.handle = handle;
    }

    /**
     * 폴더 내 파일 목록 읽기
     * @param options {{ fileOnly: boolean }}
     * @return {Promise<FileData[]>}
     */
    async readFiles({fileOnly}) {
        /** @type {FileData[]} */
        const files = [];

        for await (const fileHandle of this.handle.values()) {
            if (fileHandle.kind === "file") {
                files.push(
                    new FileData(
                        fileHandle.name,
                        fileHandle.name.split(".").pop(),
                        fileHandle
                    )
                );
            } else if (!fileOnly) {
                files.push(
                    new FileData(
                        fileHandle.name,
                        fileHandle.name.split(".").pop(),
                        fileHandle
                    )
                );
            }
        }

        return files;
    }
}

export default DirectoryData;
