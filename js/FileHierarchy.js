import eventBus from "./EventBus.js";
import DialogManager from "./DialogManager.js";

class FileHierarchy {
    /** @type {HTMLElement} */
    $element;
    /** @type {HTMLButtonElement} */
    $openDirectoryButton;
    /** @type {HTMLElement} */
    $fileListContainer;
    /** @type {FileEditor} */
    editor;
    /** @type {number} */
    selectedIndex;
    /** @type {FileData[]} */
    files;

    /**
     * 생성자
     * @param $element {HTMLElement}
     * @param editor {FileEditor}
     */
    constructor($element, editor) {
        this.$element = $element;
        this.$openDirectoryButton = $element.querySelector("button");
        this.$fileListContainer = $element.querySelector("ul");
        this.editor = editor;
        this.selectedIndex = -1;
        this.files = [];

        this.render();
    }

    /**
     * 디렉토리 데이터 설정
     * @param directoryData {DirectoryData}
     */
    async setDirectory(directoryData) {
        this.files = await directoryData.readFiles({fileOnly: true});
        this.selectedIndex = -1;

        this.render();
    }

    /**
     * 핸들러 등록
     */
    initHandler() {
        // TODO: 이벤트 리스너 제거 좀 더 좋은 방법으로
        this.$openDirectoryButton.replaceWith(this.$openDirectoryButton.cloneNode(true));
        this.$openDirectoryButton = this.$element.querySelector("button")

        this.$openDirectoryButton.addEventListener(
            "click",
            this.onOpenDirectoryButtonClicked.bind(this)
        );

        this.$fileListContainer.querySelectorAll("li").forEach((e) => {
            e.addEventListener("click", this.onFileClick.bind(this));
        });
    }

    /**
     * 렌더
     */
    render() {
        const $files = this.files.map((file, index) => {
            const $li = document.createElement("li");
            $li.dataset.index = index.toString();
            $li.textContent = file.name;
            if (file.extension !== "txt") {
                $li.classList.add("not-allowed");
            }
            if (this.selectedIndex === index) {
                $li.classList.add("active");
            }
            return $li;
        });

        this.$fileListContainer.innerHTML = "";
        $files.forEach((file) => this.$fileListContainer.append(file));

        this.initHandler();
    }

    /**
     * 폴더 선택 버튼 Click 이벤트 핸들러
     * @param event {MouseEvent}
     */
    async onOpenDirectoryButtonClicked(event) {
        eventBus.publish("onBeforeDirectorySelected", null);

        const directoryData = await DialogManager.openDirectoryDialog();

        await this.setDirectory(directoryData);

        eventBus.publish("onAfterDirectorySelected", directoryData);
    }

    /**
     * 파일 리스트 아이템 Click 이벤트 핸들러
     * @param event {MouseEvent}
     */
    onFileClick(event) {
        const $file = event.target;

        const index = Number.parseInt($file.dataset.index);
        const file = this.files[index];

        if (file.extension !== "txt") {
            alert(".txt 파일만 선택해주세요.");
            return;
        }

        eventBus.publish("onBeforeFileSelected", null);

        this.selectedIndex = index;
        this.render();

        eventBus.publish("onAfterFileSelected", file);
    }
}

export default FileHierarchy;
