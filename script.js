const exprInput = document.getElementById('exprInput');
const output = document.getElementById('output');
const historyDiv = document.getElementById('history');
const varsDiv = document.getElementById('vars');

const constants = { pi: 3.1415, e: 2.7182 };
const variables = {};
const history = [];

const buttons = [
  '1','2','3','+','4','5','6','-','7','8','9','*','0','.','/','^','(',')','sin(','cos(','tan(','sqrt('
];

const btnContainer = document.getElementById('buttons');
buttons.forEach(b => {
  const btn = document.createElement('button');
  btn.textContent = b;
  btn.onclick = () => { exprInput.value += b; };
  btnContainer.appendChild(btn);
});

exprInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') evaluate();
});

function evaluate() {
  try {
    let expr = exprInput.value.trim();
    if (!expr) throw 'Empty expression';

    let parsed = expr
      .replace(/pi/g, constants.pi)
      .replace(/e(?![a-zA-Z0-9_])/g, constants.e)
      .replace(/sin\(/g, 'Math.sin(')
      .replace(/cos\(/g, 'Math.cos(')
      .replace(/tan\(/g, 'Math.tan(')
      .replace(/sqrt\(/g, 'Math.sqrt(')
      .replace(/\^/g, '**');

    for (const [k,v] of Object.entries(variables)) {
      const reg = new RegExp(k, 'g');
      parsed = parsed.replace(reg, v);
    }

    const result = Function(`return ${parsed}`)();
    if (!isFinite(result)) throw 'Invalid math operation';

    const fixed = Number(result).toFixed(4);
    output.textContent = fixed;

    history.push({ expr, result: fixed });
    renderHistory();
  } catch (err) {
    output.textContent = 'Error: ' + err;
  }
}

function renderHistory() {
  historyDiv.innerHTML = '';
  history.forEach((h,i) => {
    const div = document.createElement('div');
    div.textContent = `${h.expr} = ${h.result}`;
    div.onclick = () => exprInput.value = h.expr;
    const del = document.createElement('button');
    del.textContent = 'X';
    del.onclick = (ev) => { ev.stopPropagation(); history.splice(i,1); renderHistory(); };
    div.appendChild(del);
    historyDiv.appendChild(div);
  });
}

document.getElementById('addVar').onclick = () => {
  const name = document.getElementById('varName').value.trim();
  const value = Number(document.getElementById('varValue').value.trim());
  if (!name || isNaN(value)) return;
  if (name === 'pi' || name === 'e') return alert('Cannot override constants');
  variables[name] = value;
  renderVars();
};

function renderVars() {
  varsDiv.innerHTML = '';
  for (const [k,v] of Object.entries(variables)) {
    const div = document.createElement('div');
    div.textContent = `${k}: ${v}`;
    varsDiv.appendChild(div);
  }
}

const evalBtn = document.createElement('button');
evalBtn.textContent = '=';
evalBtn.classList.add('btn-main');
evalBtn.onclick = evaluate;
btnContainer.appendChild(evalBtn);