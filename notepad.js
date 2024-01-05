document.addEventListener("DOMContentLoaded", function () {
  const toolbarItems = document.querySelectorAll(".toolbar ul li");
  const saveOption = document.querySelector(".ri-file-download-line");
  const saveOptionText = document.querySelector(".dropdown li:nth-child(2)");
  const savePromptButton = document.getElementById("savePrompt");
  const downloadIcon = document.querySelector(".first .ri-file-download-line");
  const openOption = document.querySelector(".dropdown li:nth-child(3)");
  const openIcon = document.querySelector(".first .ri-folder-open-line");
  const newDocOption = document.querySelector(".dropdown li:nth-child(1)");
  const newDocIcon = document.querySelector(".first .ri-file-line");
  const pasteOption = document.querySelector(".dropdown li:nth-child(5)");
  const pasteIcon = document.querySelector(".second .ri-clipboard-line");
  const textarea = document.getElementById("textarea");
  const wordCounter = document.querySelector(".word");
  const undoOption = document.getElementById("undoButton");
  const redoOption = document.getElementById("redo");
  const MAX_HISTORY_LENGTH = 10;
  const textHistory = [];
  const redoHistory = [];
  const fontDropdown = document.querySelector(".four");
  const fontSizeDropdown = document.querySelector(".fontsize-dropdown");
  const fontDropdownContent = document.querySelector(".font-dropdown-content");
  const fontSizeDropdownContent = document.querySelector(
    ".fontsize-dropdown-content"
  );
  const fullScreenDropdown = document.querySelector(
    ".toolbar .dropdown .ri-fullscreen-line"
  );
  const fullScreenIcon = document.querySelector(
    ".toolbar-logo .five .ri-fullscreen-line"
  );
  const containerNotepad = document.querySelector(".container-notepad");
  const titleBar = document.querySelector(".tittle-bar");

  fontSizeDropdownContent.addEventListener("click", function (event) {
    if (event.target.classList.contains("sizes-font")) {
      const selectedFontSize = event.target.textContent.trim();
      const textarea = document.getElementById("textarea");
      textarea.style.fontSize = selectedFontSize;
      fontSizeDropdownContent.classList.remove("show-dropdown"); // Menutup dropdown setelah memilih ukuran font
    }
  });

  fontDropdownContent.addEventListener("click", function (event) {
    const selectedFont = event.target.textContent.trim();
    const textarea = document.getElementById("textarea");
    textarea.style.fontFamily = selectedFont;
    fontDropdownContent.classList.remove("show-dropdown"); // Menutup dropdown setelah memilih font
  });

  fontDropdown.addEventListener("click", function (event) {
    const target = event.target;
    const fontDropdownContent = document.querySelector(
      ".font-dropdown-content"
    );
    const fontSizeDropdownContent = document.querySelector(
      ".fontsize-dropdown-content"
    );

    if (target.matches(".font-dropdown")) {
      fontDropdownContent.classList.toggle("show-dropdown");
      fontSizeDropdownContent.classList.remove("show-dropdown");
    }

    if (target.matches(".fontsize-dropdown")) {
      fontSizeDropdownContent.classList.toggle("show-dropdown");
      fontDropdownContent.classList.remove("show-dropdown");
    }
  });

  // Menutup dropdown saat mengklik di luar area dropdown
  document.addEventListener("click", function (event) {
    const fontDropdownContent = document.querySelector(
      ".font-dropdown-content"
    );
    const fontSizeDropdownContent = document.querySelector(
      ".fontsize-dropdown-content"
    );
    const fontDropdown = document.querySelector(".font-dropdown");
    const fontSizeDropdown = document.querySelector(".fontsize-dropdown");

    // Cek apakah yang diklik bukan bagian dari dropdown font
    if (!fontDropdown.contains(event.target)) {
      fontDropdownContent.classList.remove("show-dropdown");
    }

    // Cek apakah yang diklik bukan bagian dari dropdown font sizes
    if (!fontSizeDropdown.contains(event.target)) {
      fontSizeDropdownContent.classList.remove("show-dropdown");
    }
  });

  function addToHistory(text) {
    textHistory.push(text);
    if (textHistory.length > MAX_HISTORY_LENGTH) {
      textHistory.shift();
    }
  }

  function undo() {
    if (textHistory.length > 0) {
      const undoneText = textHistory.pop();
      redoHistory.push(undoneText);

      // Instead of clearing the entire textarea, remove the last 5 words
      const words = textarea.value.split(/\s+/);
      words.splice(-5);
      textarea.value = words.join(" ");

      updateWordAndLineCount();
      
  }
  }

  function redo() {
    if (redoHistory.length > 0) {
      const redoneText = redoHistory.pop();
      textHistory.push(redoneText);
      textarea.value = redoneText;
      updateWordAndLineCount(); 
      console.log("Redo - Redone Text:", redoneText);
    }
  }

  const undoButton = document.querySelector(".third .ri-arrow-go-back-line");
  const redoButton = document.querySelector(".third .ri-arrow-go-forward-line");

  undoButton.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent default behavior of the button
    undo(); // Call the undo function
  });

  redoButton.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent default behavior of the button
    redo(); // Call the redo function
  });

  function handleUndo() {
    undo();
  }

  function handleRedo() {
    redo();
  }

  undoOption.addEventListener("click", function () {
    handleUndo();
  });

  redoOption.addEventListener("click", function () {
    handleRedo();
  });

  function cutText() {
    const selectedText = textarea.value.substring(
      textarea.selectionStart,
      textarea.selectionEnd
    );
    if (selectedText) {
      navigator.clipboard
        .writeText(selectedText)
        .then(() => {
          textarea.setRangeText(
            "",
            textarea.selectionStart,
            textarea.selectionEnd,
            "end"
          );
          console.log("Text has been cut!");
        })
        .catch((err) => {
          console.error("Cut command not supported", err);
        });
    }
  }

  function copyText() {
    const selectedText = textarea.value.substring(
      textarea.selectionStart,
      textarea.selectionEnd
    );
    if (selectedText) {
      navigator.clipboard
        .writeText(selectedText)
        .then(() => {
          console.log("Text has been copied!");
        })
        .catch((err) => {
          console.error("Copy command not supported", err);
        });
    }
  }

  function pasteText() {
    navigator.clipboard
      .readText()
      .then((clipboardText) => {
        textarea.setRangeText(
          clipboardText,
          textarea.selectionStart,
          textarea.selectionEnd,
          "end"
        );
        console.log("Text has been pasted!");
      })
      .catch((err) => {
        console.error("Paste command not supported", err);
      });
  }

  const cutOption = document.querySelector(".dropdown li:nth-child(3)");
  const copyOption = document.querySelector(".dropdown li:nth-child(4)");

  cutOption.addEventListener("click", function () {
    cutText();
  });

  copyOption.addEventListener("click", function () {
    copyText();
  });

  const scissorsIcon = document.querySelector(".second .ri-scissors-2-line");
  const fileCopyIcon = document.querySelector(".second .ri-file-copy-line");

  scissorsIcon.addEventListener("click", function (event) {
    event.preventDefault(); // Mencegah perilaku default dari ikon
    cutText();
  });

  fileCopyIcon.addEventListener("click", function (event) {
    event.preventDefault(); // Mencegah perilaku default dari ikon
    copyText();
  });

  function handleDownload(filename) {
    const textToSave = document.getElementById("textarea").value;
    const blob = new Blob([textToSave], { type: "text/plain" });
    const a = document.createElement("a");
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  function readFile(file) {
    const reader = new FileReader();
    reader.onload = function (event) {
      const contents = event.target.result;
      document.getElementById("textarea").value = contents;
    };
    reader.readAsText(file);
  }

  function clearTextArea() {
    document.getElementById("textarea").value = "";
  }

  function pasteFromClipboard() {
    navigator.clipboard
      .readText()
      .then((clipboardText) => {
        const textarea = document.getElementById("textarea");
        textarea.value += clipboardText; // Menambahkan teks clipboard ke dalam textarea
      })
      .catch((err) => {
        console.error("Gagal melakukan paste dari clipboard:", err);
      });
  }

  function countWords(text) {
    const words = text.trim() === "" ? [] : text.match(/\S+/g);
    return words ? words.length : 0;
  }

  function countLines(text) {
    return text.trim().split(/\r*\n/).length;
  }

  function countChars(text) {
    return text.length;
  }

  function updateWordAndLineCount() {
    const text = textarea.value;
    const wordCount = countWords(text);
    const lineCount = countLines(text);
    const charsCount = countChars(text);
    wordCounter.textContent = `Words: ${wordCount}, Lines: ${lineCount}, Chars: ${charsCount}`;
  }

  textarea.addEventListener("input", function () {
    addToHistory(textarea.value);
    updateWordAndLineCount();
  });

  // save ketika pencet ctrl + s
  // document.addEventListener("keydown", function(event){
  //   if ((event.ctrlKey || event.metaKey) && event.key === "s") {
  //     event.preventDefault();
  //     const fileName = prompt("Masukkan nama file:");
  //     if (fileName !== null && fileName.trim() !== "") {
  //       handleDownload(fileName);
  //     }
  //   }
  // });

  toolbarItems.forEach((item) => {
    item.addEventListener("click", function (event) {
      toolbarItems.forEach((i) => {
        if (i !== item) {
          i.classList.remove("open");
        }
      });
      item.classList.toggle("open");

      const saveOptionDropdown = document.querySelector(".dropdown li:nth-child(2)"); 

      if (item === saveOptionDropdown) {
        displayPrompt();
      }

      // if (item === saveOption || item === saveOptionText) {
      //   const fileName = prompt("Masukkan nama file:");
      //   if (fileName !== null && fileName.trim() !== "") {
      //     handleDownload(fileName);
      //   }
      // }

      if (item === openOption) {
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = ".txt, .docx";

        fileInput.addEventListener("change", function (event) {
          const selectedFile = event.target.files[0];
          if (selectedFile) {
            readFile(selectedFile);
          }
        });

        fileInput.click();
      }

      if (item === newDocOption) {
        clearTextArea();
      }

      if (item === pasteOption || item === pasteIcon) {
        pasteFromClipboard();
      }

      event.stopPropagation();
      addToHistory(textarea.value);
    });
  });

  // downloadIcon.addEventListener("click", function (event) {
  //   const fileName = prompt("Masukkan nama file:");
  //   if (fileName !== null && fileName.trim() !== "") {
  //     handleDownload(fileName);
  //   }
  //   event.stopPropagation();
  // });

  openIcon.addEventListener("click", function (event) {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".txt, .docx";

    fileInput.addEventListener("change", function (event) {
      const selectedFile = event.target.files[0];
      if (selectedFile) {
        readFile(selectedFile);
      }
    });

    fileInput.click();
    event.stopPropagation();
  });

  newDocIcon.addEventListener("click", function (event) {
    clearTextArea();
    event.stopPropagation();
  });

  pasteIcon.addEventListener("click", function (event) {
    pasteFromClipboard();
    event.preventDefault(); // Menghentikan perilaku default dari elemen
    event.stopPropagation();
  });

  pasteOption.addEventListener("click", function (event) {
    pasteFromClipboard();
    event.preventDefault(); // Menghentikan perilaku default dari elemen
    event.stopPropagation();
  });

  document.addEventListener("click", function (event) {
    toolbarItems.forEach((item) => {
      if (!item.contains(event.target)) {
        item.classList.remove("open");
      }
    });
  });

  // Additional event listeners for undo and redo in dropdown edit
  undoOption.addEventListener("click", function () {
    handleUndo();
  });

  redoOption.addEventListener("click", function () {
    handleRedo();
  });

  // Fitur Full Screen

  function toggleFullScreen() {
    if (containerNotepad.classList.contains("full-screen")) {
      containerNotepad.classList.remove("full-screen");
      titleBar.style.display = "flex"; // Mengembalikan tampilan title bar
    } else {
      titleBar.style.display = "none";
      containerNotepad.classList.add("full-screen");
    }
  }

  fullScreenDropdown.addEventListener("click", function () {
    toggleFullScreen();
  });

  fullScreenIcon.addEventListener("click", function () {
    toggleFullScreen();
  });

  // Fitur Prompt Save
  saveOption.addEventListener("click", function () {
    displayPrompt();
  });

  downloadIcon.addEventListener("click", function () {
    displayPrompt();
  });

  savePromptButton.addEventListener("click", function () {
    const fileNameInput = document.getElementById("fileName");
    const fileName = fileNameInput.value;
    handleDownload(fileName);
    hideCustomPrompt();
  });

  function displayPrompt() {
    const customPrompt = document.querySelector(".custom-prompt");
    const containerNotepad = document.querySelector(".container-notepad");
    const fileNameInput = document.getElementById("fileName");

    customPrompt.style.display = "flex";
    containerNotepad.classList.add("dark-background");

    // Posisikan prompt di tengah-tengah website
    customPrompt.style.position = "fixed";
    customPrompt.style.top = "30%";
    customPrompt.style.left = "35%";
    customPrompt.style.pointerEvents = "auto";

    const closePromptButton = document.getElementById("close-prompt");
    closePromptButton.addEventListener("click", function () {
      hideCustomPrompt(containerNotepad, customPrompt);
    });

    const savePromptButton = document.getElementById("savePrompt");
    savePromptButton.addEventListener("click", function () {
      const fileName = fileNameInput.value;
      handleDownload(fileName);
      hideCustomPrompt(containerNotepad, customPrompt);
    });

    const elementsToDisable = document.querySelectorAll(
      ".toolbar ul li, .font-dropdown-content, .fontsize-dropdown-content, .container-notepad"
    );
    elementsToDisable.forEach((element) => {
      element.style.pointerEvents = "none";
    });
  }

  function hideCustomPrompt(containerNotepad, customPrompt) {
    customPrompt.style.display = "none";
    containerNotepad.classList.remove("dark-background");
    const elementsToEnable = document.querySelectorAll(".toolbar ul li, .font-dropdown-content, .fontsize-dropdown-content, .container-notepad");
    elementsToEnable.forEach((element) => {element.style.pointerEvents = "auto";});
  }

  // Saat tombol "Save" diklik
  saveOption.addEventListener("click", function () {
    displayPrompt();
  });

  // Saat ikon download diklik
  downloadIcon.addEventListener("click", function () {
    displayPrompt();
  });

  function handleDownload(filename) {
    const textToSave = document.getElementById("textarea").value;
    const blob = new Blob([textToSave], { type: "text/plain" });
    const a = document.createElement("a");
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    hideCustomPrompt();
  }

  document.addEventListener("keydown", function (event) {
    if ((event.ctrlKey || event.metaKey) && event.key === "s") {
      event.preventDefault();
      displayPrompt();
    }
  });

  document.addEventListener("keydown", function (event) {
    const customPrompt = document.querySelector(".custom-prompt");
    if (customPrompt.style.display === "flex") {
      if (event.key === "Enter") {
        event.preventDefault(); // Mencegah perilaku default tombol Enter
        const fileNameInput = document.getElementById("fileName");
        const fileName = fileNameInput.value;
        handleDownload(fileName);
        hideCustomPrompt();
      }
    }
  });
  
});
