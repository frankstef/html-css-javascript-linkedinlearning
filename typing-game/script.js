async function sentence() {
  const url = "https://sentence-generator2.p.rapidapi.com/sentence?length=30";
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": "168e0ba747msh23eee9ad25ffb99p153100jsn3acff94c25de",
      "x-rapidapi-host": "sentence-generator2.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    const result = await response.text();
    console.log(result);
    return result;
  } catch (error) {
    console.error(error);
  }
}

let cursorStart = 0;
let cursorEnd = 0;
let correctFlag = false;
let started = false;
let resultText = "";

let justSkippedWord = false;
let startTime = 0;
let timerInterval;
let currentTime = "";

const startButton = document.getElementById("start-button1");
const resetButton = document.getElementById("reset-button1");

startButton.addEventListener("click", () => {
  console.log("Start button clicked");
  startButton.innerText = "LOADING...";

  sentence()
    .then((result) => {
      resultText = result.replace(/^"|"$/g, "");
      console.log(resultText);
    })
    .catch((error) => {
      console.error("Error fetching sentence:", error);
    })
    .then(() => {
      startButton.innerText = "START";
      document.querySelectorAll(".action-button").forEach((button) => {
        button.classList.toggle("hidden");
      });
      document.getElementById("input-area1").value = "";
      document.getElementById("input-area1").focus();
      document.getElementById("text-para1").innerText = "";
      document.getElementById("text-para1").innerText = "3";
      document.getElementById("text-para1").style.fontSize = "60px";
      let count = 3;

      const countdown = setInterval(() => {
        count--;
        document.getElementById("text-para1").innerText = count;

        if (count === 0) {
          clearInterval(countdown);
          document.getElementById("text-para1").innerText = resultText;
          document.getElementById("text-para1").style.fontSize = "24px";
          // Initialize the text area with the cursor
          document.getElementById("text-para1").innerHTML =
            renderTextWithCursor(resultText, 0);
          started = true;
          startElapsedTime();
        }
      }, 1000);

      //count down timer:
    });
});

resetButton.addEventListener("click", () => {
  console.log("Reset button clicked");

  document.getElementById("text-para1").innerText =
    'Click "START" to begin the game';
  document.getElementById("input-area1").value = "";
  cursorIndex = 0;
  correctFlag = 0;
  started = false;

  document.querySelectorAll(".action-button").forEach((button) => {
    button.classList.toggle("hidden");
  });
});

function startElapsedTime() {
  startTime = performance.now();
  timerInterval = setInterval(() => {
    const now = performance.now();
    let elapsed = Math.floor((now - startTime) / 1000); // total seconds

    const hours = String(Math.floor(elapsed / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((elapsed % 3600) / 60)).padStart(2, "0");
    const seconds = String(elapsed % 60).padStart(2, "0");
    currentTime = `${hours}:${minutes}:${seconds}`;
    // console.log("Elapsed time:", `${hours}:${minutes}:${seconds}`);
    document.getElementById(
      "timer1"
    ).textContent = `${hours}:${minutes}:${seconds}`;
  }, 100);
}

function stopElapsedTime() {
  clearInterval(timerInterval);
}

document.addEventListener("keydown", (event) => {
  const inputArea = document.getElementById("input-area1");
  const key = event.key;
  const cursorPos = inputArea.value.length;

  // Prevent Ctrl+Backspace
  if (event.key === "Backspace" && event.ctrlKey) {
    event.preventDefault();
    return;
  }

  // Prevent Delete
  if (event.key === "Delete") {
    event.preventDefault();
    return;
  }

  // Only allow backspace if last char is wrong
  if (event.key === "Backspace") {
    if (cursorPos === 0) {
      event.preventDefault();
      return;
    }
    if (inputArea.value[cursorPos - 1] === resultText[cursorPos - 1]) {
      event.preventDefault();
      return;
    }
    // Allow backspace for wrong input
    setTimeout(() => {
      document.getElementById("text-para1").innerHTML = renderTextWithCursor(
        resultText,
        inputArea.value.length
      );
    }, 0);
    return;
  }

  // If not started, allow nothing
  if (!started) {
    event.preventDefault();
    return;
  }

  // Strictly allow only the correct character
  if (key !== resultText[cursorPos]) {
    event.preventDefault();
    return;
  }

  // If you want to handle the period at the end
  if (key === "." && cursorPos === resultText.length - 1) {
    document.getElementById(
      "text-para1"
    ).innerText = `Congratulations, you finished within ${currentTime}!`;
    inputArea.value = "";
    started = false;
    justSkippedWord = false;
    correctFlag = false;
    elapsed = 0; // Reset elapsed time
    stopElapsedTime();
    event.preventDefault();
    return;
  }

  // Allow input and update cursor after input
  setTimeout(() => {    
    document.getElementById("text-para1").innerHTML = renderTextWithCursor(
      resultText,
      inputArea.value.length
    );
  }, 0);
});

document.addEventListener("keyup", (event) => {
  const key = event.key.toLowerCase();
  const keyElement = document.querySelector("#key-" + key);
  if (keyElement) {
    keyElement.classList.remove("scaled");
  }
  // console.log(cursorIndex);
});

function renderTextWithCursor(text, cursorPos) {
  const before = text.slice(0, cursorPos);  //texts before the cursor
  const at = text[cursorPos] ? text[cursorPos] : "";    // character at the cursor position
  const after = text.slice(cursorPos + 1);  // texts after the cursor
  return `<span class='typed-ch'> ${before}</span><span class="cursor"></span>${at}${after}`;
}
