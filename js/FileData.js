class FileData {
    /** @type {string} */
    name;
    /** @type {string} */
    extension;
    /** @type {FileSystemFileHandle} */
    handle;

    /**
     * 생성자
     * @param name {string}
     * @param extension {string}
     * @param handle {FileSystemFileHandle}
     */
    constructor(name, extension, handle) {
        this.name = name;
        this.extension = extension;
        this.handle = handle;
    }

    /**
     * 파일 내용 읽기
     * @returns {Promise<string>}
     */
    async readText() {
        const file = await this.handle.getFile();

        return await file.text();
    }

    /**
     * 파일 내용 저장
     * @param text {string}
     * @returns {Promise<void>}
     */
    async writeText(text) {
        const writable = await this.handle.createWritable();

        await writable.write(text);
        await writable.close();
    }
}

export default FileData;