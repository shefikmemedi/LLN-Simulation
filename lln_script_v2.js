const lineCanvas = document.getElementById("lineChart");
const histCanvas = document.getElementById("histChart");
const probInput = document.getElementById("probInput");
const nInput = document.getElementById("nInput");
const mInput = document.getElementById("mInput");
const avgResult = document.getElementById("avgResult");
const runButton = document.getElementById("runButton");

let lineChart, histChart;

runButton.addEventListener("click", () => {
  const p = parseFloat(probInput.value);
  const n = parseInt(nInput.value);
  const m = parseInt(mInput.value);

  simulateLLN(p, n, m);
});

function simulateLLN(p, n, m) {
  const trajectories = [];
  const finalFrequencies = [];

  for (let i = 0; i < m; i++) {
    let successes = 0;
    const freq = [];
    for (let j = 1; j <= n; j++) {
      if (Math.random() < p) successes++;
      freq.push(successes / j);
    }
    trajectories.push(freq);
    finalFrequencies.push(freq[freq.length - 1]);
  }

  const avgFinal = (
    finalFrequencies.reduce((a, b) => a + b, 0) / finalFrequencies.length
  ).toFixed(4);

  avgResult.innerHTML = `Average Final Frequency f(N): ${avgFinal} (Target p = ${p})`;

  drawLineChart(trajectories, p);
  drawHistogram(finalFrequencies, p);
}

function drawLineChart(trajectories, p) {
  if (lineChart) lineChart.destroy();
  const n = trajectories[0].length;
  const labels = Array.from({ length: n }, (_, i) => i + 1);

  lineChart = new Chart(lineCanvas, {
    type: "line",
    data: {
      labels,
      datasets: trajectories.map(traj => ({
        data: traj,
        borderColor: "rgba(37, 99, 235, 0.3)",
        borderWidth: 1,
        fill: false,
        tension: 0.1
      })).concat({
        label: "True Probability",
        data: Array(n).fill(p),
        borderColor: "#f59e0b",
        borderWidth: 2,
        borderDash: [5, 5],
        fill: false
      })
    },
    options: {
      plugins: { legend: { display: false } },
      scales: {
        x: { title: { display: true, text: "Number of Trials (n)" } },
        y: { title: { display: true, text: "Relative Frequency f(n)" }, min: 0, max: 1 }
      }
    }
  });
}

function drawHistogram(values, p) {
  if (histChart) histChart.destroy();

  const bins = 15;
  const min = 0;
  const max = 1;
  const binWidth = (max - min) / bins;
  const counts = new Array(bins).fill(0);

  values.forEach(v => {
    const idx = Math.min(Math.floor((v - min) / binWidth), bins - 1);
    counts[idx]++;
  });

  const labels = counts.map((_, i) =>
    (min + i * binWidth + binWidth / 2).toFixed(2)
  );

  histChart = new Chart(histCanvas, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        data: counts,
        backgroundColor: "rgba(37, 99, 235, 0.6)"
      }]
    },
    options: {
      indexAxis: "y",
      plugins: { legend: { display: false } },
      scales: {
        x: { title: { display: true, text: "Count" } },
        y: { title: { display: true, text: "Final Frequencies" } }
      }
    }
  });
}
