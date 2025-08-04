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
let inputCount = 0;

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
          document.getElementById("text-para1").style.color =
            "rgb(145, 125, 125)";
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

  document.querySelectorAll(".action-button").forEach((button) => {
    button.classList.toggle("hidden");
  });
  document.getElementById("text-para1").style.color = "rgb(145, 125, 125)";
    started = false;
    justSkippedWord = false;
    correctFlag = false;
    elapsed = 0;
    inputCount = 0;
    currentTime = "";
    
    document.getElementById("text-para1").style.fontSize = "24px";

    stopElapsedTime();
document.getElementById("timer1").textContent = "00:00:00";
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

  try {
    const keyElement = document.querySelector("#key-" + key.toLowerCase());
    if (keyElement) {
      keyElement.classList.add("scaled");
    }
  } catch (error) {
    console.error("Error selecting key element:", error);
  }

  // Prevent Ctrl+Backspace
  if (event.key === "Backspace" && event.ctrlKey) {
    event.preventDefault();
    return;
  }

  if (event.key === "Shift" || event.key === "Control") {
    console.log("Shift or Control key pressed, ignoring.");
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
    inputCount++;
    event.preventDefault();
    return;
  }

  // If you want to handle the period at the end
  if (key === "." && cursorPos === resultText.length - 1) {
    inputCount++;
    document.getElementById(
      "text-para1"
    ).innerHTML = `Congratulations, you finished within <b>[${currentTime}]</b> with <b>[${(
      (resultText.length / inputCount) *
      100
    ).toFixed(2)}%]</b> accuracy!`;

    document.getElementById("text-para1").style.color = "white";
    inputArea.value = "";
    started = false;
    justSkippedWord = false;
    correctFlag = false;
    elapsed = 0;
    inputCount = 0;
    currentTime = "";
    
    document.getElementById("text-para1").style.fontSize = "24px";

    stopElapsedTime();
document.getElementById("timer1").textContent = "00:00:00";
    event.preventDefault();
    return;
  }
  inputCount++;
  console.log("Input Count:", inputCount);
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
  const before = text.slice(0, cursorPos); //texts before the cursor
  const at = text[cursorPos] ? text[cursorPos] : ""; // character at the cursor position
  const after = text.slice(cursorPos + 1); // texts after the cursor
  return `<span class='typed-ch'>${before}</span><span class="cursor"></span>${at}${after}`;
}
