# File System Access API Demo

> File System Access API 간단 데모

## Introduction

브라우저 차원에서 직접 사용자 파일 시스템에 접근할 수 있는 `File System Access API` 관련 데모.  
(제일 기초적인 API만)  
([MDN](https://developer.mozilla.org/en-US/docs/Web/API/File_System_API))

<img src="/img/md_screenshot1.png" alt="Demo1" width="49%">
<img src="/img/md_screenshot2.png" alt="Demo1" width="49%">

## Requirement

- [Secure Context](https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts) 환경  
  (`File System Access API`는 `Secure Context`에서만 돌아감(`https`, `https 환경의 worker` 등))  

## Summary

1. 폴더 선택

```js
await window.showDirectoryPicker();
```

2. 폴더 내 파일 열거

```js
for await (const fileHandle of dirHandle.values())
// ...
```

3. 파일 읽기

```js
const file = await fileHandle.getFile();

await file.text(); // Blob 객체에서 사용 가능한 메서드들 가능(ex: bytes(), stream(), text(), ...)
```

4. 파일 쓰기

```js
const writable = await files[selectedIndex].handle.createWritable();

await writable.write(elements.$contents.value);
await writable.close();
```

## Conclusion

이제 웹 만으로 여러 유틸리티를 만들 수 있다!  
언젠간 써보겠지
