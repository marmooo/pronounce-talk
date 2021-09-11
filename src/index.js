const letters = 'ABCDEFGHIJKLMNOPQRSTUVWZXYabcdefghijklmnopqrstuvwxyz';
let endAudio, incorrectAudio, correctAudio;
loadAudios();
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();
let voiceInput = setVoiceInput();
let problems = [];
let answer = 'Gopher';
let firstRun = true;
let englishVoices = [];
let correctCount = incorrectCount = 0;
const tmpCanvas = document.createElement('canvas');


function loadConfig() {
  if (localStorage.getItem('darkMode') == 1) {
    document.documentElement.dataset.theme = 'dark';
  }
}
loadConfig();

function toggleDarkMode() {
  if (localStorage.getItem('darkMode') == 1) {
    localStorage.setItem('darkMode', 0);
    delete document.documentElement.dataset.theme;
  } else {
    localStorage.setItem('darkMode', 1);
    document.documentElement.dataset.theme = 'dark';
  }
}

function toggleEnglish(obj) {
  if (isEnabled(obj)) {
    obj.style.opacity = 0.5;
  } else {
    obj.style.opacity = 1;
  }
}

function isEnabled(obj) {
  if (obj.style.opacity == 1) {
    return true;
  } else {
    return false;
  }
}

function playAudio(audioBuffer, volume) {
  const audioSource = audioContext.createBufferSource();
  audioSource.buffer = audioBuffer;
  if (volume) {
    const gainNode = audioContext.createGain();
    gainNode.gain.value = volume;
    gainNode.connect(audioContext.destination);
    audioSource.connect(gainNode);
    audioSource.start();
  } else {
    audioSource.connect(audioContext.destination);
    audioSource.start();
  }
}

function unlockAudio() {
  audioContext.resume();
}

function loadAudio(url) {
  return fetch(url)
    .then(response => response.arrayBuffer())
    .then(arrayBuffer => {
      return new Promise((resolve, reject) => {
        audioContext.decodeAudioData(arrayBuffer, (audioBuffer) => {
          resolve(audioBuffer);
        }, (err) => {
          reject(err);
        });
      });
    });
}

function loadAudios() {
  promises = [
    loadAudio('mp3/end.mp3'),
    loadAudio('mp3/incorrect1.mp3'),
    loadAudio('mp3/correct3.mp3'),
  ];
  Promise.all(promises).then(audioBuffers => {
    endAudio = audioBuffers[0];
    incorrectAudio = audioBuffers[1];
    correctAudio = audioBuffers[2];
  });
}

function loadVoices() {
  // https://stackoverflow.com/questions/21513706/
  const allVoicesObtained = new Promise(function(resolve, reject) {
    let voices = speechSynthesis.getVoices();
    if (voices.length !== 0) {
      resolve(voices);
    } else {
      speechSynthesis.addEventListener("voiceschanged", function() {
        voices = speechSynthesis.getVoices();
        resolve(voices);
      });
    }
  });
  allVoicesObtained.then(voices => {
    englishVoices = voices.filter(voice => voice.lang == 'en-US');
  });
}
loadVoices();

function speak(text) {
  speechSynthesis.cancel();
  const msg = new SpeechSynthesisUtterance(text);
  msg.onend = () => { voiceInput.start(); };
  msg.voice = englishVoices[Math.floor(Math.random() * englishVoices.length)];
  msg.lang = 'en-US';
  voiceInput.stop();
  speechSynthesis.speak(msg);
}

function respeak() {
  speak(answer);
}

function resizeFontSize(node) {
  // https://stackoverflow.com/questions/118241/
  function getTextWidth(text, font) {
      // re-use canvas object for better performance
      // var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
      var context = tmpCanvas.getContext("2d");
      context.font = font;
      var metrics = context.measureText(text);
      return metrics.width;
  }
  function getTextRect(text, fontSize, font, lineHeight) {
    var lines = text.split('\n');
    var maxWidth = 0;
    var fontConfig = fontSize + 'px ' + font;
    for (var i=0; i<lines.length; i++) {
      var width = getTextWidth(lines[i], fontConfig);
      if (maxWidth < width) {
        maxWidth = width;
      }
    }
    return [maxWidth, fontSize * lines.length * lineHeight];
  }
  function getPaddingRect(style) {
    var width = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
    var height = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
    return [width, height];
  }
  var style = getComputedStyle(node);
  var font = style.fontFamily;
  var fontSize = parseFloat(style.fontSize);
  var lineHeight = parseFloat(style.lineHeight) / fontSize;
  // overflow: hidden; がないと動かない
  var nodeRect = [node.parentNode.offsetWidth, node.parentNode.offsetHeight];
  var textRect = getTextRect(node.innerText, fontSize, font, lineHeight);
  var paddingRect = getPaddingRect(style);

  // https://stackoverflow.com/questions/46653569/
  // Safariで正確な算出ができないので誤差ぶんだけ縮小化 (10%)
  var rowFontSize = fontSize * (nodeRect[0] - paddingRect[0]) / textRect[0] * 0.90;
  var colFontSize = fontSize * (nodeRect[1] - paddingRect[1]) / textRect[1] * 0.90;
  if (colFontSize < rowFontSize) {
    node.style.fontSize = colFontSize + 'px';
  } else {
    node.style.fontSize = rowFontSize + 'px';
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

function nextProblem() {
  var problem = problems[getRandomInt(0, problems.length - 1)];
  if (Math.random() > 0.5) {
    problem = problem.slice(0, 2);
  } else {
    problem = problem.slice(2, 4);
  }
  var [en, ja] = problem;
  var input = document.getElementById('cse-search-input-box-id');
  input.value = ja;
  answer = en;
  const problemNode = document.getElementById('problem');
  problemNode.innerText = ja + ' (' + en + ')';
  if (localStorage.getItem('voice') != 0) {
    speak(answer);
  }
}

function initProblems() {
  var grade = document.getElementById('grade').selectedIndex;
  fetch(grade + '.csv').then(response => response.text()).then(csv => {
    problems = [];
    csv.split('\n').forEach(line => {
      if (!line) { return; }
      problems.push(line.split(","));
    });
  });
}
initProblems();

function searchByGoogle(event) {
  event.preventDefault();
  var input = document.getElementById('cse-search-input-box-id');
  var element = google.search.cse.element.getElement('searchresults-only0');
  nextProblem();
  if (input.value == '') {
    element.clearAllResults();
  } else {
    voiceInput.stop();
    element.execute(input.value);
  }
  if (firstRun) {
    const mascots = document.getElementById('mascots');
    while (mascots.firstChild) {
      mascots.removeChild(mascots.lastChild);
    }
    firstRun = false;
  }
  document.getElementById('reply').textContent = '英語で答えてください';
  return false;
}
document.getElementById('cse-search-box-form-id').onsubmit = searchByGoogle;

function setVoiceInput() {
  if (!('webkitSpeechRecognition' in window)) {
    document.getElementById('nosupport').classList.remove('d-none');
  } else {
    let voiceInput = new webkitSpeechRecognition();
    voiceInput.lang = 'en-US';
    // voiceInput.interimResults = true;
    voiceInput.continuous = true;

    voiceInput.onstart = (event) => {
      const startButton = document.getElementById('start-voice-input');
      const stopButton = document.getElementById('stop-voice-input');
      startButton.classList.add('d-none');
      stopButton.classList.remove('d-none');
    };
    voiceInput.onend = (event) => {
      if (!speechSynthesis.speaking) {
        voiceInput.start();
      }
    };
    voiceInput.onresult = (event) => {
      const reply = event.results[0][0].transcript;
      const replyObj = document.getElementById('reply');
      if (reply.toLowerCase().split(' ').includes(answer.toLowerCase())) {
        correctCount += 1;
        playAudio(correctAudio);
        replyObj.textContent = '◯ ' + answer;
        document.getElementById('searchButton').classList.add('animate__heartBeat');
      } else {
        incorrectCount += 1;
        playAudio(incorrectAudio);
        replyObj.textContent = '× ' + reply;
      }
      voiceInput.stop();
    };
    return voiceInput;
  }
}

function startVoiceInput() {
  voiceInput.start();
}

function stopVoiceInput() {
  const startButton = document.getElementById('start-voice-input');
  const stopButton = document.getElementById('stop-voice-input');
  startButton.classList.remove('d-none');
  stopButton.classList.add('d-none');
  document.getElementById('reply').textContent = '英語で答えてください';
  voiceInput.stop();
}

let gameTimer;
function startGameTimer() {
  clearInterval(gameTimer);
  const timeNode = document.getElementById('time');
  timeNode.innerText = '180秒 / 180秒';
  gameTimer = setInterval(function() {
    const arr = timeNode.innerText.split('秒 /');
    const t = parseInt(arr[0]);
    if (t > 0) {
      timeNode.innerText = (t-1) + '秒 /' + arr[1];
    } else {
      clearInterval(gameTimer);
      playAudio(endAudio);
      playPanel.classList.add('d-none');
      scorePanel.classList.remove('d-none');
      document.getElementById('correct').textContent = correctCount;
      document.getElementById('total').textContent = correctCount + incorrectCount;
    }
  }, 1000);
}

let countdownTimer;
function countdown() {
  clearTimeout(countdownTimer);
  gameStart.classList.remove('d-none');
  playPanel.classList.add('d-none');
  scorePanel.classList.add('d-none');
  const counter = document.getElementById('counter');
  counter.innerText = 3;
  countdownTimer = setInterval(function(){
    const colors = ['skyblue', 'greenyellow', 'violet', 'tomato'];
    if (parseInt(counter.innerText) > 1) {
      const t = parseInt(counter.innerText) - 1;
      counter.style.backgroundColor = colors[t];
      counter.innerText = t;
    } else {
      clearTimeout(countdownTimer);
      gameStart.classList.add('d-none');
      playPanel.classList.remove('d-none');
      correctCount = incorrectCount = 0;
      document.getElementById('score').textContent = 0;
      startGameTimer();
    }
  }, 1000);
}


[...document.getElementById('mascots').getElementsByClassName('aa')].forEach(aa => {
  resizeFontSize(aa);
  window.addEventListener('resize', function() {
    resizeFontSize(aa);
  });
});
document.getElementById('searchButton').addEventListener('animationend', function() {
  this.classList.remove('animate__heartBeat');
});
document.getElementById('grade').onchange = initProblems;
document.addEventListener('click', unlockAudio, { once:true, useCapture:true });

