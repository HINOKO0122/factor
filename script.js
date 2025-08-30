function waitForMathJax(callback) {
  if (window.MathJax && MathJax.typeset) {
    callback();
  } else {
    setTimeout(() => waitForMathJax(callback), 100);
  }
}

function renderLatex() {
  waitForMathJax(() => MathJax.typeset());
}

function factorize() {
  const expr = document.getElementById("expression").value.trim();
  const resultsDiv = document.getElementById("results");

  if (!expr || /[\+\-\*\/\^]$/.test(expr)) {
    resultsDiv.innerHTML = "<p style='color:red;'>式が不完全です。構文を確認してください。</p>";
    return;
  }

  try {
    const factored = Algebrite.run(`factor(${expr})`);
    const latex = Algebrite.run(`printlatex(factor(${expr}))`);

    resultsDiv.innerHTML = `
      <p><strong>整数係数での因数分解結果：</strong></p>
      <p>\\[ ${latex} \\]</p>
    `;
    renderLatex();

    const entry = { input: expr, output: latex };
    saveToHistory(entry);
    renderHistory();
  } catch (error) {
    resultsDiv.innerHTML = `<p style="color:red;">因数分解に失敗しました。式の構文を確認してください。</p>`;
  }
}

function saveToHistory(entry) {
  const history = JSON.parse(localStorage.getItem("factorHistory") || "[]");
  history.unshift(entry);
  localStorage.setItem("factorHistory", JSON.stringify(history.slice(0, 10)));
}

function renderHistory() {
  const history = JSON.parse(localStorage.getItem("factorHistory") || "[]");
  const historyList = document.getElementById("history");
  historyList.innerHTML = "";

  history.forEach(item => {
    const li = document.createElement("li");
    li.innerHTML = `式: ${item.input}<br>結果: \\( ${item.output} \\)`;
    historyList.appendChild(li);
  });

  renderLatex();
}

renderHistory();
