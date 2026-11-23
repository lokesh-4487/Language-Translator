const inputText = document.getElementById("inputText");
const translatedText = document.getElementById("translatedText");

const sourceLanguage = document.getElementById("sourceLanguage");
const targetLanguage = document.getElementById("targetLanguage");

const translateButton = document.getElementById("translateButton");
const swapButton = document.getElementById("swapButton");
const clearButton = document.getElementById("clearButton");
const copyButton = document.getElementById("copyButton");

const characterCount = document.getElementById("characterCount");
const statusMessage = document.getElementById("statusMessage");

// Update the character count
inputText.addEventListener("input", function () {
  characterCount.textContent = `${inputText.value.length} / 500`;
});

// Translate the entered text
translateButton.addEventListener("click", async function () {
  const text = inputText.value.trim();

  if (!text) {
    statusMessage.textContent = "Please enter some text.";
    inputText.focus();
    return;
  }

  if (text.length > 500) {
    statusMessage.textContent = "Text cannot exceed 500 characters.";
    return;
  }

  translateButton.disabled = true;
  translateButton.textContent = "Translating...";
  statusMessage.textContent = "Please wait...";

  translatedText.value = "";

  try {
    const response = await fetch("/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: text,
        source: sourceLanguage.value,
        target: targetLanguage.value,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Translation failed.");
    }

    translatedText.value = data.translation;
    statusMessage.textContent = "Translation completed!";
  } catch (error) {
    statusMessage.textContent = error.message;
  } finally {
    translateButton.disabled = false;
    translateButton.textContent = "Translate";
  }
});

// Swap the selected languages
swapButton.addEventListener("click", function () {
  const sourceValue = sourceLanguage.value;
  sourceLanguage.value = targetLanguage.value;
  targetLanguage.value = sourceValue;

  const inputValue = inputText.value;
  inputText.value = translatedText.value;
  translatedText.value = inputValue;

  characterCount.textContent = `${inputText.value.length} / 500`;
  statusMessage.textContent = "Languages swapped.";
});

// Clear the text boxes
clearButton.addEventListener("click", function () {
  inputText.value = "";
  translatedText.value = "";

  characterCount.textContent = "0 / 500";
  statusMessage.textContent = "Text cleared.";

  inputText.focus();
});

// Copy the translated text
copyButton.addEventListener("click", async function () {
  const text = translatedText.value;

  if (!text) {
    statusMessage.textContent = "There is no translation to copy.";
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
    statusMessage.textContent = "Translation copied!";
  } catch (error) {
    statusMessage.textContent = "Unable to copy the text.";
  }
});
