var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

document.querySelector(".overlay").addEventListener("click", () => {
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  document.querySelector(".overlay").classList.add('hide')
});

var frequencyData = new Uint8Array(5);

var svgHeight = "700";
var svgWidth = "700";
var barPadding = "1";

let cont = document.querySelector(".main-cont");

function createSvg(parent, height, width) {
  return d3
    .select(parent)
    .append("svg")
    .attr("height", height)
    .attr("width", width);
}

var svg = createSvg(cont, svgHeight, svgWidth);

let colorShades = ["#56e784 ", "#20e95d", "#098e23 ", "#138537", "#1DB954"];
let playPauseBtn = document.querySelectorAll(".play-pause");

window.addEventListener("load", () => {
  svg
    .selectAll("circle")
    .data(frequencyData)
    .enter()
    .append("circle")
    .attr("cx", function (d, i) {
      return svgWidth / 2;
    })
    .attr("cy", svgHeight / 2)
    .attr("fill", (d, i) => colorShades[i])
    .attr("r", function (d, i) {
      let rad = d + 250 - i * 50 - 160;
      if (rad < 0) {
        return 0;
      } else {
        return rad;
      }
    });
});

playPauseBtn.forEach((a) => {
  a.addEventListener("click", (e) => {
    let classesOfBtn = e.target.classList;
    if (classesOfBtn.contains("fa-play")) {
      classesOfBtn.remove("fa-play");
      classesOfBtn.add("fa-pause");
      if (localStorage.getItem("current-playing")) {
        document.querySelector(localStorage.getItem("current-playing")).pause();
        document
          .querySelector(localStorage.getItem("current-playing"))
          .previousElementSibling.classList.remove("fa-pause");
        document
          .querySelector(localStorage.getItem("current-playing"))
          .previousElementSibling.classList.add("fa-play");
      }

      localStorage.setItem(
        "current-playing",
        `#${e.target.nextElementSibling.id}`
      );
      playMusic(e.target.nextElementSibling);
    } else {
      classesOfBtn.remove("fa-pause");
      classesOfBtn.add("fa-play");
      localStorage.clear();
      pauseMusic(e.target.nextElementSibling);
    }
  });
});

function playMusic(elem) {
  elem.play();
  renderChart(elem);
}
function pauseMusic(elem) {
  elem.pause();
}

function renderChart(elem) {
  let audioSrc = audioCtx.createMediaElementSource(elem);
  let analyser = audioCtx.createAnalyser();

  audioSrc.connect(analyser);
  audioSrc.connect(audioCtx.destination);
  function render() {
    requestAnimationFrame(render);
    analyser.getByteFrequencyData(frequencyData);
    svg
      .selectAll("circle")
      .data(frequencyData)
      .attr("r", function (d, i) {
        let rad = d + 250 - i * 50 - 160;
        if (rad < 0) {
          return 0;
        } else {
          return rad;
        }
      });
  }
  render();
}
