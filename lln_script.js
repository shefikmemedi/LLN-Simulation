function runTrajectory(p, N) {
  let successes = 0;
  const data = [];

  for (let n = 1; n <= N; n++) {
    if (Math.random() < p) successes++;
    data.push(successes / n);
  }
  return data;
}

function drawMainChart(allData, p, N, ctx) {
  const W = ctx.canvas.width;
  const H = ctx.canvas.height;

  ctx.clearRect(0, 0, W, H);

  // Gold line for p
  const y_p = H * (1 - p);
  ctx.strokeStyle = "#d4af37";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, y_p);
  ctx.lineTo(W, y_p);
  ctx.stroke();

  // Draw trajectories
  allData.forEach(traj => {
    ctx.strokeStyle = "rgba(0,128,128,0.1)";
    ctx.beginPath();
    traj.forEach((f, i) => {
      const x = (i / N) * W;
      const y = H * (1 - f);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.stroke();
  });
}

function drawHistogram(finalValues, p, ctx) {
  const W = ctx.canvas.width;
  const H = ctx.canvas.height;

  ctx.clearRect(0, 0, W, H);
  const bins = 20;
  const step = 1 / bins;
  const counts = new Array(bins).fill(0);

  finalValues.forEach(v => {
    let index = Math.floor(v / step);
    if (index >= bins) index = bins - 1;
    counts[index]++;
  });

  const maxCount = Math.max(...counts);
  const barHeight = H / bins;

  counts.forEach((count, i) => {
    const width = (count / maxCount) * W;
    const y = H - (i + 1) * barHeight;
    ctx.fillStyle = "rgba(0,128,128,0.7)";
    ctx.fillRect(0, y, width, barHeight - 2);
  });

  // Draw gold line for p
  const pIndex = Math.floor(p / step);
  const pY = H - (pIndex + 0.5) * barHeight;
  ctx.strokeStyle = "#d4af37";
  ctx.beginPath();
  ctx.moveTo(0, pY);
  ctx.lineTo(W, pY);
  ctx.stroke();
}

function startSimulation() {
  const p = parseFloat(document.getElementById("probInput").value);
  const N = parseInt(document.getElementById("nInput").value);
  const M = parseInt(document.getElementById("mInput").value);

  const mainCtx = document.getElementById("mainChart").getContext("2d");
  const histCtx = document.getElementById("histogram").getContext("2d");

  const allData = [];
  const finals = [];

  for (let i = 0; i < M; i++) {
    const traj = runTrajectory(p, N);
    allData.push(traj);
    finals.push(traj[N - 1]);
  }

  drawMainChart(allData, p, N, mainCtx);
  drawHistogram(finals, p, histCtx);

  const avg = finals.reduce((a, b) => a + b, 0) / M;
  document.getElementById("average-result").innerHTML =
    `Average Final Frequency f(N): <span style="color:#008080;">${avg.toFixed(4)}</span> (Target p = ${p})`;
}

window.addEventListener("DOMContentLoaded", startSimulation);
