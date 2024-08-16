import Logger from "./Logger.js";
import FileEditor from "./FileEditor.js";
import FileHierarchy from "./FileHierarchy.js";
import eventBus from "./EventBus.js";

(function (window, document) {
    document.addEventListener("DOMContentLoaded", async () => {
        const editor = new FileEditor(document.querySelector("#editor"));
        const hierarchy = new FileHierarchy(document.querySelector("#hierarchy"), editor);
        const logger = new Logger(document.querySelector("#log"));

        /** Event 구독 */
        eventBus.subscribe("onBeforeDirectorySelected", () => {
            logger.log('폴더 불러오는 중...');
        });

        eventBus.subscribe("onAfterDirectorySelected", (directoryData) => {
            logger.log('폴더 불러옴!');
        });

        eventBus.subscribe("onBeforeFileSelected", () => {
            logger.log('파일 불러오는 중...');
        });

        eventBus.subscribe("onAfterFileSelected", (fileData) => {
            editor.setFile(fileData);
            logger.log("파일 불러옴!");
        });

        eventBus.subscribe("onBeforeSave", () => {
            logger.log('파일 저장 중...');
        });

        eventBus.subscribe("onBeforeSave", (fileData) => {
            logger.log("파일 저장함!");
        });
    });
})(window, document);
