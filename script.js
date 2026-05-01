const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let array = [];
let steps = [];
let stepIndex = 0;
let running = false;
let sortedIndices = new Set();

// --------------------
// Generate array
// --------------------
function generateArray(size = 100) {
  const arr = Array.from({ length: size }, (_, i) => i + 1);

  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
}


function bubbleSort(arr) {
  const a = [...arr];
  const steps = [];

  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < a.length - i - 1; j++) {
      steps.push({ type: "compare", i: j, j: j + 1 });

      if (a[j] > a[j + 1]) {
        steps.push({ type: "swap", i: j, j: j + 1 });
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
      }
    }
  }

  return steps;
}


function insertionSort(arr) {
  const a = [...arr];
  const steps = [];

  for (let i = 1; i < a.length; i++) {
    let j = i;

    while (j > 0) {
      steps.push({ type: "compare", i: j - 1, j: j });

      if (a[j - 1] > a[j]) {
        steps.push({ type: "swap", i: j - 1, j: j });
        [a[j - 1], a[j]] = [a[j], a[j - 1]];
      } else {
        break;
      }

      j--;
    }
  }

  return steps;
}

function draw(highlight = []) {
  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const barWidth = Math.max(2, canvas.width / array.length);

  array.forEach((value, i) => {
    const height = value * 3;

    if (sortedIndices.has(i)) {
      ctx.fillStyle = "#22c55e"; // sorted = green
    } else if (highlight.includes(i)) {
      ctx.fillStyle = "#ef4444"; // active = red
    } else {
      ctx.fillStyle = "#38bdf8"; // default = blue
    }

    ctx.fillRect(
      i * barWidth,
      canvas.height - height,
      barWidth - 1,
      height
    );
  });
}

function applyStep(step) {
  if (!step) return;

  const highlight = [step.i, step.j];

  if (step.type === "swap") {
    [array[step.i], array[step.j]] = [array[step.j], array[step.i]];
  }

  draw(highlight);
}


function animate() {
  if (!running) return;

  if (stepIndex >= steps.length) {
    running = false;

    // mark everything as sorted safely
    sortedIndices = new Set(array.map((_, i) => i));

    draw();
    return;
  }

  applyStep(steps[stepIndex]);
  stepIndex++;

  setTimeout(() => {
    requestAnimationFrame(animate);
  }, 1);
}


function reset() {
  array = generateArray(100);

  const algo = document.getElementById("algorithm").value;

  steps = algo === "bubble"
    ? bubbleSort(array)
    : insertionSort(array);

  stepIndex = 0;
  running = false;

  sortedIndices.clear(); // IMPORTANT FIX

  draw();
}

// expose for HTML buttons
window.start = start;
window.reset = reset;

window.onload = () => {
  reset();
};


function start() {
  const algo = document.getElementById("algorithm").value;

  // If bogo is selected → just reshuffle once
  if (algo === "bogo") {
    reset();
    return;
  }

  if (running) return;
  running = true;
  animate();
}
