import eventBus from "./EventBus.js";

class FileEditor {
    /** @type {HTMLElement} */
    $element;
    /** @type {HTMLTextAreaElement} */
    $contents;
    /** @type {HTMLButtonElement} */
    $saveButton;
    /** @type {FileData} */
    file;

    /**
     * 생성자
     * @param $element {HTMLElement}
     */
    constructor($element) {
        this.$element = $element;
        this.$contents = $element.querySelector("textarea");
        this.$saveButton = $element.querySelector("button");
        this.file = null;
    }

    /**
     * 파일 설정
     * @param file {FileData}
     * @returns {Promise<void>}
     */
    async setFile(file) {
        this.file = file;

        this.render();
    }

    /**
     * 핸들러 등록
     */
    initHandler() {
        // TODO: 이벤트 리스너 제거 좀 더 좋은 방법으로
        this.$saveButton.replaceWith(this.$saveButton.cloneNode(true));
        this.$saveButton = this.$element.querySelector("button")

        this.$saveButton.addEventListener(
            "click",
            this.onSaveButtonClicked.bind(this)
        );
    }

    /**
     * 렌더
     */
    async render() {
        if (this.file) {
            this.$contents.value = await this.file.readText();
            this.$saveButton.disabled = false;
        } else {
            this.$contents.value = "";
            this.$saveButton.disabled = true;
        }

        this.initHandler();
    }

    /**
     * 저장 버튼 Click 이벤트 핸들러
     * @param event {MouseEvent}
     * @returns {Promise<void>}
     */
    async onSaveButtonClicked(event) {
        if (!this.file) {
            alert("파일을 선택해주세요.");
            return;
        }

        eventBus.publish("onBeforeSave", null);

        this.$saveButton.disabled = true;
        await this.file.writeText(this.$contents.value);
        this.$saveButton.disabled = false;

        eventBus.publish("onAfterSave", this.file);
    }
}

export default FileEditor;
