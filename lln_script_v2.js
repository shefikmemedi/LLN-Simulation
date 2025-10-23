document.getElementById("run").addEventListener("click", runSim);

function runSim() {
  const p = parseFloat(document.getElementById("prob").value);
  const n = parseInt(document.getElementById("trials").value);
  const m = parseInt(document.getElementById("sims").value);

  const chart = document.getElementById("chart");
  const ctx = chart.getContext("2d");
  const hist = document.getElementById("hist");
  const htx = hist.getContext("2d");

  ctx.clearRect(0, 0, chart.width, chart.height);
  htx.clearRect(0, 0, hist.width, hist.height);

  let averages = [];

  for (let j = 0; j < m; j++) {
    let successes = 0;
    let freqs = [];

    for (let i = 1; i <= n; i++) {
      if (Math.random() < p) successes++;
      freqs.push(successes / i);
    }

    averages.push(freqs[n - 1]);
    drawLine(ctx, freqs, "rgba(0,128,128,0.1)"); // teal lines
  }

  drawLine(ctx, new Array(n).fill(p), "#d4af37"); // gold line for true probability

  const avgFinal = averages.reduce((a, b) => a + b, 0) / m;
  document.getElementById("avg").innerText =
    `Average Final Frequency f(N): ${avgFinal.toFixed(4)} (Target p = ${p})`;

  drawHistogram(htx, averages);
}

function drawLine(ctx, data, color) {
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.moveTo(0, (1 - data[0]) * ctx.canvas.height);
  for (let i = 1; i < data.length; i++) {
    const x = (i / data.length) * ctx.canvas.width;
    const y = (1 - data[i]) * ctx.canvas.height;
    ctx.lineTo(x, y);
  }
  ctx.stroke();
}

function drawHistogram(htx, data) {
  const bins = 20;
  const width = htx.canvas.width;
  const height = htx.canvas.height;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const binWidth = (max - min) / bins;
  const counts = new Array(bins).fill(0);

  data.forEach(v => {
    let idx = Math.floor((v - min) / binWidth);
    if (idx >= bins) idx = bins - 1;
    counts[idx]++;
  });

  const maxCount = Math.max(...counts);
  htx.fillStyle = "rgba(0,128,128,0.7)";
  counts.forEach((count, i) => {
    const barHeight = (count / maxCount) * height;
    htx.fillRect(i * (width / bins), height - barHeight, width / bins - 2, barHeight);
  });
}
