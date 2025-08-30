function waitForMathJax(callback) {
  if (window.MathJax && typeof MathJax.typeset === "function") {
    callback();
  } else {
    setTimeout(() => waitForMathJax(callback), 100);
  }
}

function renderLaTeX() {
  waitForMathJax(() => MathJax.typeset());
}

function renderHistory() {
  const history = JSON.parse(localStorage.getItem("factorHistory") || "[]");
  const list = document.getElementById("history");
  list.innerHTML = "";
  history.forEach(({ input, output }) => {
    const li = document.createElement("li");
    li.innerHTML = `式: ${input}<br>結果: \\( ${output} \\)`;
    list.appendChild(li);
  });
  renderLaTeX();
}

function saveToHistory(entry) {
  const history = JSON.parse(localStorage.getItem("factorHistory") || "[]");
  history.unshift(entry);
  localStorage.setItem("factorHistory", JSON.stringify(history.slice(0, 10)));
}

function factorize() {
  const expr = document.getElementById("expression").value.trim();
  const resultsDiv = document.getElementById("results");

  if (!expr || /[\+\-\*\/\^]$/.test(expr)) {
    resultsDiv.innerHTML = "<p style='color:red;'>式が不完全です。構文を確認してください。</p>";
    return;
  }

  try {
    const latex = Algebrite.run(`printlatex(factor(${expr}))`);
    resultsDiv.innerHTML = `
      <p><strong>整数係数での因数分解結果：</strong></p>
      <p>\\[ ${latex} \\]</p>
    `;
    renderLaTeX();
    saveToHistory({ input: expr, output: latex });
    renderHistory();
  } catch (e) {
    resultsDiv.innerHTML = `<p style="color:red;">因数分解に失敗しました。式を確認してください。</p>`;
  }
}

function sendToFormatter() {
  const expr = document.getElementById("expression").value.trim();
  if (!expr) return;
  const formatterUrl = "https://your-formatter.example.com/?expr=" + encodeURIComponent(expr);
  window.open(formatterUrl, "_blank");
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("factorButton").addEventListener("click", factorize);
  document.getElementById("formatterButton").addEventListener("click", sendToFormatter);
  renderHistory();
});
