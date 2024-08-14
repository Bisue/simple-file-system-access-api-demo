(function (window, document) {
  const elements = {
    $dialogButton: undefined,
    $contents: undefined,
    $hierarchy: undefined,
    $saveButton: undefined,
    $log: undefined,
  };

  const files = [];
  let selectedIndex = null;

  function initElements() {
    elements.$dialogButton = document.querySelector("#dialogButton");
    elements.$contents = document.querySelector("#contents");
    elements.$hierarchy = document.querySelector("#hierarchy");
    elements.$saveButton = document.querySelector("#saveButton");
    elements.$log = document.querySelector("#log");
  }

  function writeLog(message) {
    const now = new Date();
    const pad = (num) => (num < 10 ? "0" : "") + num;

    const timestamp = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(
      now.getSeconds()
    )}`;
    const newLine = elements.$log.value ? "\n" : "";
    const formattedMessage = `${newLine}[${timestamp}] ${message}`;
    elements.$log.value = elements.$log.value + formattedMessage;

    elements.$log.scrollTo(0, elements.$log.scrollHeight);
  }

  async function setFilesFromDirectory(dirHandle) {
    files.splice(0, files.length);

    for await (const fileHandle of dirHandle.values()) {
      if (fileHandle.kind === "file") {
        writeLog(`파일 로딩됨...: '${fileHandle.name}'`);
        files.push(createFileData(fileHandle));
      } else {
        writeLog(`폴더 무시됨...: '/${fileHandle.name}'`);
      }
    }
  }

  function createFileData(fileHandle) {
    const extension = fileHandle.name.split(".").pop();

    return {
      name: fileHandle.name,
      handle: fileHandle,
      extension: extension,
    };
  }

  function clearSelectedFile() {
    elements.$contents.value = "";
    elements.$saveButton.disabled = true;
    selectedIndex = null;
  }

  function activateFile(index) {
    const $files = elements.$hierarchy.children;

    for (const $file of $files) {
      if ($file.dataset.index === index) {
        $file.classList.add("active");
      } else {
        $file.classList.remove("active");
      }
    }
  }

  async function onFileClick(event) {
    const index = event.target.dataset.index;
    const file = files[index];

    if (file.extension !== "txt") {
      alert(".txt 파일만 선택해주세요.");
      return;
    }

    writeLog(`파일 내용 로딩중...: '${file.name}'`);
    const contents = await getFileTextContents(file.handle);
    elements.$contents.value = contents;
    elements.$saveButton.disabled = false;
    selectedIndex = index;
    activateFile(selectedIndex);
    writeLog(`파일 내용 로딩 완료!: '${file.name}'`);
  }

  function renderFiles() {
    elements.$hierarchy.innerHTML = "";
    for (const file of files) {
      const $file = document.createElement("li");
      $file.dataset.index = files.indexOf(file);
      $file.textContent = file.name;
      if (file.extension !== "txt") {
        $file.classList.add("not-allowed");
      }
      $file.addEventListener("click", onFileClick);

      elements.$hierarchy.appendChild($file);
    }
  }

  async function getFileTextContents(fileHandle) {
    const file = await fileHandle.getFile();

    return await file.text();
  }

  document.addEventListener("DOMContentLoaded", function () {
    initElements();

    elements.$dialogButton.addEventListener("click", async function () {
      clearSelectedFile();

      writeLog("폴더 선택중...");
      const dirHandle = await window.showDirectoryPicker();
      writeLog("폴더 내 파일 로딩중...");
      await setFilesFromDirectory(dirHandle);
      writeLog("폴더 내 파일 로딩 완료!");

      renderFiles();
    });

    elements.$saveButton.addEventListener("click", async function () {
      if (selectedIndex === null) {
        alert("파일을 선택해주세요.");

        return;
      }

      writeLog(`파일 내용 저장중...: '${files[selectedIndex].name}'`);
      elements.$saveButton.disabled = true;
      const writable = await files[selectedIndex].handle.createWritable();

      await writable.write(elements.$contents.value);
      await writable.close();
      elements.$saveButton.disabled = false;
      writeLog(`파일 내용 저장 완료!: '${files[selectedIndex].name}'`);
    });
  });
})(window, document);
