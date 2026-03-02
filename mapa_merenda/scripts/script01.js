/* script.js
   Versão: 1.0
   Implementa:
   - sincronização Tabela 1 (detalhes)
   - validação periodo
   - geração dias letivos (segunda..sábado)
   - numeração Quant. Dias
   - edição de data dentro do período
   - frequências default "X" -> input numeric on click
   - verificação soma atendidos vs num_alunos
   - cardápio regular/integral por semana (1..4, 5 => 1)
   - seleção de cardápio por dia com justificativa automática
   - justificativa de sábado automática e editável
   - remoção/adicionar linhas
   - tabela estoque dinâmica com lista de itens + unidade, item "outro" com input
   - calculo Quant. de alim. cons. e Saldo
   - export/import JSON
   - impressão (oculta sidebar)
*/

/* ============================
   Utilitários de data e DOM
   ============================ */
function parseDateFromInput(value) {
  if (!value) return null;
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, m - 1, d);
}
function formatDateBR(date) {
  const d = ("0" + date.getDate()).slice(-2);
  const m = ("0" + (date.getMonth() + 1)).slice(-2);
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
}
function dateToInputValue(date) {
  const y = date.getFullYear();
  const m = ("0" + (date.getMonth() + 1)).slice(-2);
  const d = ("0" + date.getDate()).slice(-2);
  return `${y}-${m}-${d}`;
}
function isSunday(date) {
  return date.getDay() === 0;
}
function isSaturday(date) {
  return date.getDay() === 6;
}
function weekOfMonth(date) {
  // 1..5, where days 1-7 => 1, 8-14 => 2, 15-21 => 3, 22-28 => 4, >=29 => 5
  return Math.floor((date.getDate() - 1) / 7) + 1;
}
function clampDateToRange(d, start, end) {
  if (d < start) return new Date(start);
  if (d > end) return new Date(end);
  return new Date(d);
}
function downloadFile(filename, content) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([content], { type: "application/json" }));
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

/* ============================
   Cardápios (regular + integral)
   Index: week 1..4, day 1..6 (segunda..sábado)
   If week = 5 -> use week 1
   ============================ */
const regularWeeks = {
  1: {
    1: "Café com leite e biscoito salgado",
    2: "Frango desfiado com arroz branco",
    3: "Sopa de feijão com carne e legumes",
    4: "Mingau de milho branco",
    5: "Carne moída com macarrão e legumes",
    6: "Café com leite e biscoito salgado"
  },
  2: {
    1: "Mingau de farinha de tapioca",
    2: "Carne moída com macarrão e legumes",
    3: "Feijão com carne e arroz branco",
    4: "Suco de fruta com biscoito salgado",
    5: "Vatapá de frango",
    6: "Café com leite e biscoito salgado"
  },
  3: {
    1: "Café com leite e biscoito salgado",
    2: "Frango desfiado com arroz branco",
    3: "Sopa de feijão com carne e legumes",
    4: "Mingau de milho branco",
    5: "Filé de peixe desfiado com arroz",
    6: "Café com leite e biscoito salgado"
  },
  4: {
    1: "Mingau de farinha de tapioca",
    2: "Carne moída com macarrão e legumes",
    3: "Feijão com carne e arroz branco",
    4: "Suco de fruta, pão com carne moída",
    5: "Vatapá de frango",
    6: "Café com leite e biscoito salgado"
  }
};

const integralWeeks = {
  1: {
    1: "Café com leite e biscoito / Isca de carne com arroz branco / Suco com biscoito",
    2: "Suco com biscoito / Feijão com frango desfiado e arroz branco / Mingau de farinha de tapioca",
    3: "Café com leite e biscoito / Feijão com carne e arroz branco / Suco de fruta com biscoito",
    4: "Café com leite e farinha tapioca / Frango com arroz branco / Mingau de milho branco",
    5: "Mingau de arroz / Carne moída com macarrão e arroz branco / Suco de fruta com biscoito",
    6: "Suco com biscoito / Frango com arroz branco / Mingau de farinha de tapioca" // saturday compact
  },
  2: {
    1: "Suco com biscoito / Frango com arroz branco / Mingau de farinha de tapioca",
    2: "Café com leite e biscoito / Feijão com carne moída e macarrão / Suco de frutas com biscoito",
    3: "Café com leite e biscoito / Feijão com carne e arroz branco / Suco de fruta com biscoito",
    4: "Café com leite e biscoito / Feijão com frango desfiado e arroz branco / Suco com biscoito",
    5: "Mingau de arroz / Vatapá com arroz / Suco de frutas c/ biscoito",
    6: "Suco de frutas c/ biscoito"
  },
  3: {
    1: "Café com leite e biscoito / Isca de carne com arroz branco / Suco com biscoito",
    2: "Suco com biscoito / Feijão com frango desfiado e arroz branco / Mingau de farinha de tapioca",
    3: "Café com leite e biscoito / Feijão com carne e arroz branco / Suco de fruta com biscoito",
    4: "Café com leite e farinha tapioca / Frango com arroz branco / Mingau de milho branco",
    5: "Mingau de arroz / Carne moída com macarrão e arroz branco / Suco de fruta com biscoito",
    6: "Suco com biscoito"
  },
  4: {
    1: "Suco com biscoito / Frango com arroz branco e macarrão/ Mingau de farinha de tapioca",
    2: "Café com leite e biscoito / Feijão com carne moída e macarrão / Suco de frutas com biscoito",
    3: "Café com leite e biscoito / Feijão com carne e arroz branco / Suco com biscoito",
    4: "Café com leite e biscoito / Feijão com frango desfiado e arroz branco / Suco com biscoito",
    5: "Mingau de arroz / Vatapá com arroz / Suco de frutas c/ biscoito",
    6: "Suco com biscoito"
  }
};

function getCardapioForDate(dateObj, tipo) {
  const w = weekOfMonth(dateObj);
  const weekIndex = (w > 4) ? 1 : w;
  const dayIndex = dateObj.getDay(); // 0..6 (0 sunday)
  if (dayIndex === 0) return "";
  const weeks = tipo === "integral" ? integralWeeks : regularWeeks;
  return (weeks[weekIndex] && weeks[weekIndex][dayIndex]) ? weeks[weekIndex][dayIndex] : "";
}
function getCardapioOptions(tipo) {
  const weeks = tipo === "integral" ? integralWeeks : regularWeeks;
  const set = new Set();
  for (let w = 1; w <= 4; w++) for (let d = 1; d <= 6; d++) {
    if (weeks[w] && weeks[w][d]) set.add(weeks[w][d]);
  }
  return Array.from(set);
}

/* ============================
   Lista de itens para Tabela Estoque (discriminação)
   cada item tem unidade padrão (string)
   ============================ */
const estoqueItems = [
  { name: "kg Açúcar triturado", unit: "kg" },
  { name: "Kg Alho in natura", unit: "kg" },
  { name: "kg Arroz tipo 1", unit: "kg" },
  { name: "unds Aveia", unit: "unds" },
  { name: "grfs Azeite de dendê", unit: "grfs" },
  { name: "kg Batata in natura", unit: "kg" },
  { name: "pcts Biscoito salgado cream cracker", unit: "pcts" },
  { name: "pcts Café em pó", unit: "pcts" },
  { name: "kg Carne moída", unit: "kg" },
  { name: "kg Carne sem osso", unit: "kg" },
  { name: "kg Cebola in natura", unit: "kg" },
  { name: "kg Cenoura in natura", unit: "kg" },
  { name: "pcts Cominho moído", unit: "pcts" },
  { name: "pcts Colorau", unit: "pcts" },
  { name: "Pcts Coco ralado", unit: "pcts" },
  { name: "kg Farinha de tapioca", unit: "kg" },
  { name: "kg Farinha de mandioca", unit: "kg" },
  { name: "kg Farinha de trigo", unit: "kg" },
  { name: "kg Feijão tipo 1", unit: "kg" },
  { name: "grfs Leite de coco", unit: "grfs" },
  { name: "pcts Leite em pó integral", unit: "pcts" },
  { name: "pcts Macarrão espaguete", unit: "pcts" },
  { name: "pcts Massa para sopa", unit: "pcts" },
  { name: "pcts Milho branco", unit: "pcts" },
  { name: "pets Óleo de soja", unit: "pets" },
  { name: "kg Peito de frango", unit: "kg" },
  { name: "pcts Polpa de frutas", unit: "pcts" },
  { name: "kg Sal moído", unit: "kg" },
  { name: "Kg Tomate in natura", unit: "kg" },
  { name: "gfrs Vinagre de álcool", unit: "gfrs" }
];

/* ============================
   Elementos do DOM (baseados no seu HTML)
   ============================ */
const el = {
  nomeEscolaInput: () => document.getElementById("nome_escola_input"),
  enderecoInput: () => document.getElementById("endereco_escola_input"),
  meioInput: () => document.getElementById("meio_escola_input"),
  municipioInput: () => document.getElementById("municipio_escola_input"),
  numAlunosInput: () => document.getElementById("num_alunos_input"),
  tipoEnsinoInput: () => document.getElementById("tipo_ensino_input"),
  dataIniInput: () => document.getElementById("data-inicial"),
  dataFimInput: () => document.getElementById("data-final"),
  docDateInput: () => document.getElementById("document_date_input"),
  docDateDisplay: () => document.getElementById("document_date_display"),
  tableCardapioBody: () => document.getElementById("table-cardapio-body"),
  tabelaDetalhesPeriodo: () => document.getElementById("periodo_display"),
  nomeEscolaDisplay: () => document.getElementById("nome_escola_display"),
  enderecoDisplay: () => document.getElementById("endereco_escola_display"),
  meioDisplay: () => document.getElementById("meio_escola_display"),
  municipioDisplay: () => document.getElementById("municipio_escola_display"),
  numAlunosDisplay: () => document.getElementById("num_alunos_display"),
  tipoEnsinoDisplay: () => document.getElementById("tipo_ensino_display"),
  estoqueBody: () => document.getElementById("table-estoque-body"),
  sidebar: () => document.querySelector(".sidebar"),
  cardapioRegularRadio: () => document.getElementById("cardapio_regular"),
  cardapioIntegralRadio: () => document.getElementById("cardapio_integral"),
};

/* ============================
   Atualiza Tabela 1 (detalhes)
   ============================ */
function updateDetalhesTabela1() {
  const nome = el.nomeEscolaInput()?.value || "";
  const end = el.enderecoInput()?.value || "";
  const meio = el.meioInput()?.value || "";
  const mun = el.municipioInput()?.value || "";
  const num = el.numAlunosInput()?.value || "";
  const tipo = el.tipoEnsinoInput()?.value || "";
  el.nomeEscolaDisplay().textContent = nome;
  el.enderecoDisplay().textContent = end;
  el.meioDisplay().textContent = meio;
  el.municipioDisplay().textContent = mun;
  el.numAlunosDisplay().textContent = num;
  el.tipoEnsinoDisplay().textContent = tipo;

  const di = el.dataIniInput()?.value;
  const df = el.dataFimInput()?.value;
  if (di && df) {
    const d1 = parseDateFromInput(di);
    const d2 = parseDateFromInput(df);
    el.tabelaDetalhesPeriodo().innerHTML = `${formatDateBR(d1)}<br>${formatDateBR(d2)}`;
  }
}

/* Vincula mudanças dos inputs do sidebar para atualizar detalhes imediatamente */
["nome_escola_input", "endereco_escola_input", "meio_escola_input", "municipio_escola_input", "num_alunos_input", "tipo_ensino_input"].forEach(id => {
  const node = document.getElementById(id);
  if (node) node.addEventListener("change", updateDetalhesTabela1);
});
if (el.dataIniInput()) el.dataIniInput().addEventListener("change", updateDetalhesTabela1);
if (el.dataFimInput()) el.dataFimInput().addEventListener("change", updateDetalhesTabela1);

/* ============================
   Data do documento: Brasília (UTC-3)
   Preenche input e display
   ============================ */
function setDocumentDateToBrasiliaToday() {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const brasilia = new Date(utc + (-3 * 3600000));
  const inputVal = dateToInputValue(brasilia);
  if (el.docDateInput()) el.docDateInput().value = inputVal;
  updateDocumentDateDisplay();
}
function updateDocumentDateDisplay() {
  const v = el.docDateInput()?.value;
  if (!v) return;
  const d = parseDateFromInput(v);
  const meses = ["janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"];
  const text = `${d.getDate()} de ${meses[d.getMonth()]} de ${d.getFullYear()}`;
  el.docDateDisplay().textContent = text;
}
if (el.docDateInput()) {
  el.docDateInput().addEventListener("change", updateDocumentDateDisplay);
  setDocumentDateToBrasiliaToday();
}

/* ============================
   Tabela Cardápio: geração de linhas
   ============================ */
function clearCardapioTable() {
  const body = el.tableCardapioBody();
  if (body) body.innerHTML = "";
}
function getSelectedCardapioType() {
  return el.cardapioIntegralRadio()?.checked ? "integral" : "regular";
}

/* Recalcula numeração da coluna 1 (Quant. Dias) após qualquer mudança */
function renumberCardapioRows() {
  const tbody = el.tableCardapioBody();
  if (!tbody) return;
  const rows = Array.from(tbody.children);
  rows.forEach((tr, i) => {
    const td = tr.children[0];
    if (td) td.textContent = String(i + 1);
  });
}

/* Cria uma linha da tabela cardápio para uma data específica */
function createCardapioRow(dateObj, tipoCardapio, periodStart, periodEnd) {
  const tbody = el.tableCardapioBody();
  if (!tbody) return;
  const tr = document.createElement("tr");

  // 1. QUANT. DIAS (número será renumerado depois)
  const tdNum = document.createElement("td");
  tdNum.textContent = "0"; // placeholder
  tr.appendChild(tdNum);

  // 2. FREQ. DO DIA / DATA (clicável pra editar data dentro do período)
  const tdData = document.createElement("td");
  const pData = document.createElement("p");
  pData.textContent = formatDateBR(dateObj);
  pData.style.cursor = "pointer";
  tdData.appendChild(pData);

  pData.addEventListener("click", () => {
    // se já há input, não duplicar
    if (tdData.querySelector("input")) return;
    const input = document.createElement("input");
    input.type = "date";
    input.value = dateToInputValue(dateObj);
    // limitar entre periodStart e periodEnd
    if (periodStart) input.min = dateToInputValue(periodStart);
    if (periodEnd) input.max = dateToInputValue(periodEnd);
    input.addEventListener("change", () => {
      const newDate = parseDateFromInput(input.value);
      if (!newDate) {
        alert("Data inválida");
        input.focus();
        return;
      }
      // evitar domingo
      if (isSunday(newDate)) {
        alert("Data selecionada é domingo — escolha uma data letiva (segunda a sábado).");
        input.focus();
        return;
      }
      // atualizar pData
      pData.textContent = formatDateBR(newDate);
      // atualizar cardápio do dia
      const tipo = getSelectedCardapioType();
      const cardTxt = getCardapioForDate(newDate, tipo) || "—";
      const tdCard = tr.querySelector(".cardapio-cell p");
      if (tdCard) tdCard.textContent = cardTxt;
      // se sábado, garantir justificativa automática
      const tdJust = tr.querySelector(".justificativa-cell p");
      if (isSaturday(newDate)) {
        tdJust.textContent = "Sábado letivo, foi servida merenda";
      } else {
        // se atual justificativa tiver texto de sábado antigo, limpar
        if (tdJust.textContent === "Sábado letivo, foi servida merenda") tdJust.textContent = "";
      }
      input.remove();
    });
    input.addEventListener("blur", () => {
      // se o usuário clicou fora sem mudar, restaura pData
      if (tdData.contains(input)) {
        const v = input.value;
        input.remove();
        pData.textContent = v ? formatDateBR(parseDateFromInput(v)) : formatDateBR(dateObj);
      }
    });
    tdData.appendChild(input);
    input.focus();
  });

  tr.appendChild(tdData);

  // 3,4,5 - Frequências (Creche, Ed. Inf e Fund., EJA) - default "X" (p) -> clickable => input number
  function makeFreqCell() {
    const td = document.createElement("td");
    const p = document.createElement("p");
    p.textContent = "X";
    p.style.cursor = "pointer";
    td.appendChild(p);

    function switchToInput() {
      if (td.querySelector("input")) return;
      const current = (p.textContent === "X") ? "" : p.textContent;
      const input = document.createElement("input");
      input.type = "number";
      input.min = 0;
      input.value = current;
      input.className = "attendance-edit-field";
      input.addEventListener("blur", () => {
        const val = input.value.trim();
        p.textContent = (val === "" || Number(val) === 0) ? "X" : val;
        input.remove();
        if (!td.contains(p)) td.appendChild(p);
        // verificar soma vs total alunos
        checkRowSumAgainstTotal(tr);
      });
      input.addEventListener("keydown", (ev) => {
        if (ev.key === "Enter") input.blur();
      });
      td.appendChild(input);
      input.focus();
    }

    p.addEventListener("click", switchToInput);
    return td;
  }
  tr.appendChild(makeFreqCell()); // Creche
  tr.appendChild(makeFreqCell()); // Ed. Inf/Fund
  tr.appendChild(makeFreqCell()); // EJA

  // 6 - CARDÁPIO
  const tdCard = document.createElement("td");
  tdCard.className = "cardapio-cell";
  const pCard = document.createElement("p");
  pCard.style.cursor = "pointer";
  // texto do cardápio conforme data e tipo
  const currentTipo = getSelectedCardapioType();
  const cardText = getCardapioForDate(dateObj, currentTipo) || "—";
  pCard.textContent = cardText;
  tdCard.appendChild(pCard);

  pCard.addEventListener("click", () => {
    if (tdCard.querySelector("select")) return;
    const tipo = getSelectedCardapioType();
    const options = getCardapioOptions(tipo);
    const select = document.createElement("select");
    select.className = "edit-field";
    // first option = current value (so remains visible)
    const optCur = document.createElement("option");
    optCur.value = pCard.textContent;
    optCur.textContent = pCard.textContent;
    select.appendChild(optCur);
    options.forEach(optText => {
      const o = document.createElement("option");
      o.value = optText;
      o.textContent = optText;
      select.appendChild(o);
    });
    // on change -> set new cardapio and fill justification
    select.addEventListener("change", () => {
      const novo = select.value;
      const antigo = pCard.textContent;
      if (novo !== antigo) {
        pCard.textContent = novo;
        // adicionar justificativa automática
        const tdJust = tr.querySelector(".justificativa-cell p");
        if (tdJust) tdJust.textContent = `O cardápio era "${antigo}", foi mudado por "${novo}"`;
      }
      select.remove();
    });
    // blur -> restore pCard if not changed
    select.addEventListener("blur", () => {
      if (tdCard.contains(select)) {
        const val = select.value || pCard.textContent;
        pCard.textContent = val;
        select.remove();
      }
    });
    tdCard.appendChild(select);
    select.focus();
  });

  tr.appendChild(tdCard);

  // 7 - coluna vazia curta (kept)
  tr.appendChild(document.createElement("td"));

  // 8 - JUSTIFICATIVA / OBSERVAÇÃO
  const tdJust = document.createElement("td");
  tdJust.className = "justificativa-cell";
  const pJust = document.createElement("p");
  pJust.style.cursor = "pointer";
  // se sábado letivo -> preenchimento automático
  if (isSaturday(dateObj)) pJust.textContent = "Sábado letivo, foi servida merenda";
  else pJust.textContent = "";
  // ao clicar -> textarea editável
  pJust.addEventListener("click", () => {
    if (tdJust.querySelector("textarea")) return;
    const ta = document.createElement("textarea");
    ta.className = "edit-field";
    ta.value = pJust.textContent;
    ta.addEventListener("blur", () => {
      pJust.textContent = ta.value;
      ta.remove();
      if (!tdJust.contains(pJust)) tdJust.appendChild(pJust);
    });
    ta.addEventListener("keydown", (ev) => {
      if (ev.key === "Enter" && !ev.ctrlKey) {
        ev.preventDefault();
        ta.blur();
      }
    });
    tdJust.appendChild(ta);
    ta.focus();
  });
  tdJust.appendChild(pJust);
  tr.appendChild(tdJust);

  // botão remover no final da linha (ícone lixeira)
  const btnCell = document.createElement("td");
  const btnRemove = document.createElement("button");
  btnRemove.className = "remove-row-btn";
  btnRemove.title = "Remover esta linha";
  btnRemove.textContent = "🗑";
  btnRemove.addEventListener("click", () => {
    tr.remove();
    renumberCardapioRows();
  });
  btnCell.appendChild(btnRemove);
  tr.appendChild(btnCell);

  tbody.appendChild(tr);
  renumberCardapioRows();
}

/* After any change to attendance inputs check sum */
function checkRowSumAgainstTotal(tr) {
  const numAlunos = Number(el.numAlunosInput()?.value || 0);
  const cells = tr.querySelectorAll("td");
  // freq are columns index 2,3,4 (0-based)
  const vals = [2,3,4].map(idx => {
    const td = cells[idx];
    if (!td) return 0;
    const p = td.querySelector("p");
    const input = td.querySelector("input");
    const valText = input ? input.value : (p ? p.textContent : "");
    return (valText === "X" || valText === "") ? 0 : (Number(valText) || 0);
  });
  const sum = vals.reduce((a,b)=>a+b,0);
  // highlight if exceeds
  if (numAlunos > 0 && sum > numAlunos) {
    tr.style.backgroundColor = "#ffe6e6";
    // inform user
    alert(`A soma dos atendimentos desta linha (${sum}) excede o número total de alunos (${numAlunos}).`);
  } else {
    tr.style.backgroundColor = "";
  }
}

/* Gera linhas entre periodStart e periodEnd inclusive, apenas dias letivos (segunda..sábado) */
function generateTable2Rows() {
  const diVal = el.dataIniInput()?.value;
  const dfVal = el.dataFimInput()?.value;
  if (!diVal || !dfVal) {
    alert("Defina o período (data inicial e final).");
    return;
  }
  const d1 = parseDateFromInput(diVal);
  const d2 = parseDateFromInput(dfVal);
  if (d2 < d1) {
    alert("A data final deve ser igual ou posterior à data inicial.");
    return;
  }
  // clear table
  clearCardapioTable();
  const tipo = getSelectedCardapioType();

  // iterate days
  for (let t = new Date(d1.getFullYear(), d1.getMonth(), d1.getDate()); t <= d2; t.setDate(t.getDate() + 1)) {
    const dt = new Date(t);
    if (isSunday(dt)) continue;
    createCardapioRow(dt, tipo, d1, d2);
  }
  renumberCardapioRows();
  updateDetalhesTabela1();
}

/* Add manual row (at end) */
function addRowTable2() {
  const tipo = getSelectedCardapioType();
  createCardapioRow(new Date(), tipo, parseDateFromInput(el.dataIniInput().value), parseDateFromInput(el.dataFimInput().value));
}

/* Expose functions for inline onclick (as HTML uses inline calls) */
window.generateTable2Rows = generateTable2Rows;
window.addRowTable2 = addRowTable2;

/* ============================
   Tabela Estoque (Controle de Gêneros)
   ============================ */
function createEstoqueRow(itemData) {
  // itemData optional: {quant, discr, cons, estAntes, saldo, rel}
  const tbody = el.estoqueBody();
  if (!tbody) return;
  const tr = document.createElement("tr");

  // 1: QUANT. (recebida)
  const tdQuant = document.createElement("td");
  const inputQuant = document.createElement("input");
  inputQuant.type = "number";
  inputQuant.min = 0;
  inputQuant.value = itemData?.quant ?? "";
  tdQuant.appendChild(inputQuant);
  tr.appendChild(tdQuant);

  // 2: DISCRIMINAÇÃO (select or text if 'outro')
  const tdDisc = document.createElement("td");
  function makeDiscSelect(selectedName) {
    tdDisc.innerHTML = "";
    const sel = document.createElement("select");
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "-- selecione --";
    sel.appendChild(placeholder);
    estoqueItems.forEach(it => {
      const o = document.createElement("option");
      o.value = it.name;
      o.textContent = it.name;
      sel.appendChild(o);
    });
    const oOutro = document.createElement("option");
    oOutro.value = "__OUTRO__";
    oOutro.textContent = "Outro";
    sel.appendChild(oOutro);
    sel.value = selectedName || "";
    sel.addEventListener("change", () => {
      if (sel.value === "__OUTRO__") {
        // show input for new item name and unit
        const div = document.createElement("div");
        div.style.display = "flex";
        div.style.gap = "4px";
        const nameIn = document.createElement("input"); nameIn.placeholder = "Nome do item"; nameIn.type = "text";
        const unitIn = document.createElement("input"); unitIn.placeholder = "Unidade (ex: kg)"; unitIn.type = "text";
        const btnOk = document.createElement("button"); btnOk.textContent = "OK"; btnOk.type = "button";
        btnOk.addEventListener("click", () => {
          const nm = nameIn.value.trim(); const uni = unitIn.value.trim();
          if (!nm) { alert("Informe o nome do item."); return; }
          // add to estoqueItems list dynamically
          estoqueItems.push({ name: nm, unit: uni || "" });
          // rebuild select (set selected to new)
          makeDiscSelect(nm);
        });
        div.appendChild(nameIn); div.appendChild(unitIn); div.appendChild(btnOk);
        tdDisc.appendChild(div);
      } else {
        // update unit cell display
        updateUnitDisplay();
      }
    });
    tdDisc.appendChild(sel);
    return sel;
  }
  const selDisc = makeDiscSelect(itemData?.discr);

  // unit display cell (we will show to the right or inside same row depending on layout)
  const spanUnit = document.createElement("span");
  spanUnit.style.marginLeft = "6px";
  function updateUnitDisplay() {
    const val = selDisc.value;
    if (!val || val === "__OUTRO__") {
      // show nothing or user defined unit if exists in input (handled earlier)
      spanUnit.textContent = "";
      return;
    }
    const found = estoqueItems.find(i => i.name === val);
    spanUnit.textContent = found ? found.unit : "";
  }
  updateUnitDisplay();
  tdDisc.appendChild(spanUnit);
  tr.appendChild(tdDisc);

  // 3: QUANT. DE ALIM. CONS. (calculated: recebido + estoqueAntes - saldoAtual) but user described "Será o resultado da soma da coluna QUANT. Mais QUANT. DE ALIM. JÁ EM ESTOQUE menos o valor da coluna SALDO ATUAL." We'll implement computed field 'cons' = quant + estAntes - saldo.
  const tdCons = document.createElement("td");
  const inputCons = document.createElement("input");
  inputCons.type = "number";
  inputCons.readOnly = true;
  inputCons.value = itemData?.cons ?? "";
  tdCons.appendChild(inputCons);
  tr.appendChild(tdCons);

  // 4: QUANT. DE ALIM. JÁ EM ESTOQUE (antes)
  const tdEstAntes = document.createElement("td");
  const inputEstAntes = document.createElement("input");
  inputEstAntes.type = "number";
  inputEstAntes.min = 0;
  inputEstAntes.value = itemData?.estAntes ?? "";
  tdEstAntes.appendChild(inputEstAntes);
  tr.appendChild(tdEstAntes);

  // 5: SALDO ATUAL (user enters or computed? spec says "SALDO ATUAL que já virá com a unidade de medida pré-definida conforme o item selecionado" We'll compute saldo = estAntes + quant - cons? The spec earlier: "QUANT. DE ALIM. CONS. será o resultado será colocado automaticamente pelo sistema obtendo o resultado da soma da coluna QUANT. Mais QUANT. DE ALIM. JÁ EM ESTOQUE menos o valor da coluna SALDO ATUAL." That indicates SALDO is input and Cons computed as quant + estAntes - saldo. So implement saldo as input.)
  const tdSaldo = document.createElement("td");
  const inputSaldo = document.createElement("input");
  inputSaldo.type = "number";
  inputSaldo.min = 0;
  inputSaldo.value = itemData?.saldo ?? "";
  tdSaldo.appendChild(inputSaldo);
  tr.appendChild(tdSaldo);

  // 6: RELATÓRIO (editable on click)
  const tdRel = document.createElement("td");
  const pRel = document.createElement("p");
  pRel.textContent = itemData?.rel ?? "";
  pRel.style.cursor = "pointer";
  pRel.addEventListener("click", () => {
    if (tdRel.querySelector("textarea")) return;
    const ta = document.createElement("textarea");
    ta.className = "edit-field";
    ta.value = pRel.textContent;
    ta.addEventListener("blur", () => {
      pRel.textContent = ta.value;
      ta.remove();
      if (!tdRel.contains(pRel)) tdRel.appendChild(pRel);
    });
    tdRel.appendChild(ta);
    ta.focus();
  });
  tdRel.appendChild(pRel);
  tr.appendChild(tdRel);

  // 7: botão remover
  const tdBtn = document.createElement("td");
  const btnRm = document.createElement("button");
  btnRm.className = "remove-row-btn";
  btnRm.textContent = "🗑";
  btnRm.type = "button";
  btnRm.addEventListener("click", () => tr.remove());
  tdBtn.appendChild(btnRm);
  tr.appendChild(tdBtn);

  // computeCons: quant + estAntes - saldo
  function computeCons() {
    const q = Number(inputQuant.value) || 0;
    const e = Number(inputEstAntes.value) || 0;
    const s = Number(inputSaldo.value) || 0;
    const consVal = q + e - s;
    inputCons.value = consVal;
  }

  // update unit display when discr changes
  selDisc.addEventListener("change", updateUnitDisplay);

  // Listen to changes to recompute Cons
  [inputQuant, inputEstAntes, inputSaldo].forEach(inp => {
    inp.addEventListener("input", computeCons);
  });

  // if itemData provided, compute immediately
  computeCons();

  tbody.appendChild(tr);
  return tr;
}

function addRowTable3() {
  createEstoqueRow();
}
window.addRowTable3 = addRowTable3;

/* ============================
   Export / Import / Print
   Add buttons to sidebar if not present
   ============================ */
function ensureSidebarButtons() {
  const side = el.sidebar();
  if (!side) return;
  // Export
  if (!document.getElementById("export-data-btn")) {
    const btnEx = document.createElement("button");
    btnEx.id = "export-data-btn";
    btnEx.textContent = "Exportar (JSON)";
    btnEx.style.display = "block";
    btnEx.style.marginTop = "10px";
    btnEx.addEventListener("click", exportAllData);
    side.appendChild(btnEx);
  }
  // Import
  if (!document.getElementById("import-data-btn")) {
    const btnIm = document.createElement("button");
    btnIm.id = "import-data-btn";
    btnIm.textContent = "Importar (JSON)";
    btnIm.style.display = "block";
    btnIm.style.marginTop = "6px";
    btnIm.addEventListener("click", () => {
      // create file input
      const fi = document.createElement("input");
      fi.type = "file";
      fi.accept = "application/json";
      fi.addEventListener("change", (ev) => {
        const f = ev.target.files[0];
        if (!f) return;
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target.result);
            importAllData(data);
            alert("Importação concluída.");
          } catch (err) {
            alert("Arquivo inválido.");
          }
        };
        reader.readAsText(f);
      });
      fi.click();
    });
    side.appendChild(btnIm);
  }
  // Print
  if (!document.getElementById("print-btn")) {
    const btnP = document.createElement("button");
    btnP.id = "print-btn";
    btnP.textContent = "Imprimir";
    btnP.style.display = "block";
    btnP.style.marginTop = "6px";
    btnP.addEventListener("click", printDocument);
    side.appendChild(btnP);
  }
}
function exportAllData() {
  const data = {};
  // detalhes (tabela 1)
  data.detalhes = {
    nome: el.nomeEscolaInput()?.value || "",
    endereco: el.enderecoInput()?.value || "",
    meio: el.meioInput()?.value || "",
    municipio: el.municipioInput()?.value || "",
    num_alunos: el.numAlunosInput()?.value || "",
    tipo_ensino: el.tipoEnsinoInput()?.value || "",
    periodo_inicio: el.dataIniInput()?.value || "",
    periodo_fim: el.dataFimInput()?.value || ""
  };
  // document date
  data.document_date = el.docDateInput()?.value || "";

  // tabela cardapio
  data.cardapio = [];
  const rows = Array.from(el.tableCardapioBody()?.children || []);
  rows.forEach(tr => {
    const tds = tr.children;
    const obj = {
      quant_dias: tds[0]?.textContent || "",
      data: (tds[1]?.querySelector("p")?.textContent) || "",
      creche: (tds[2]?.querySelector("p")?.textContent) || "",
      ed_inf: (tds[3]?.querySelector("p")?.textContent) || "",
      eja: (tds[4]?.querySelector("p")?.textContent) || "",
      cardapio: (tds[5]?.querySelector("p")?.textContent) || "",
      justificativa: (tds[7]?.querySelector("p")?.textContent) || ""
    };
    data.cardapio.push(obj);
  });

  // tabela estoque
  data.estoque = [];
  const rowsE = Array.from(el.estoqueBody()?.children || []);
  rowsE.forEach(tr => {
    const tds = tr.children;
    const quant = tds[0]?.querySelector("input")?.value || "";
    const discrSel = tds[1]?.querySelector("select");
    const discr = discrSel ? discrSel.value : (tds[1]?.querySelector("input")?.value || "");
    const cons = tds[2]?.querySelector("input")?.value || "";
    const estAntes = tds[3]?.querySelector("input")?.value || "";
    const saldo = tds[4]?.querySelector("input")?.value || "";
    const rel = tds[5]?.querySelector("p")?.textContent || "";
    data.estoque.push({ quant, discr, cons, estAntes, saldo, rel });
  });

  const filename = `demonstrativo_${(new Date()).toISOString().slice(0,10)}.json`;
  downloadFile(filename, JSON.stringify(data, null, 2));
}

function importAllData(data) {
  if (!data) return;
  // detalhes
  if (data.detalhes) {
    if (el.nomeEscolaInput()) el.nomeEscolaInput().value = data.detalhes.nome || "";
    if (el.enderecoInput()) el.enderecoInput().value = data.detalhes.endereco || "";
    if (el.meioInput()) el.meioInput().value = data.detalhes.meio || "";
    if (el.municipioInput()) el.municipioInput().value = data.detalhes.municipio || "";
    if (el.numAlunosInput()) el.numAlunosInput().value = data.detalhes.num_alunos || "";
    if (el.tipoEnsinoInput()) el.tipoEnsinoInput().value = data.detalhes.tipo_ensino || "";
    if (el.dataIniInput()) el.dataIniInput().value = data.detalhes.periodo_inicio || "";
    if (el.dataFimInput()) el.dataFimInput().value = data.detalhes.periodo_fim || "";
  }
  if (data.document_date && el.docDateInput()) {
    el.docDateInput().value = data.document_date;
    updateDocumentDateDisplay();
  }
  updateDetalhesTabela1();

  // tabela cardapio
  clearCardapioTable();
  if (Array.isArray(data.cardapio)) {
    data.cardapio.forEach(item => {
      // parse date string dd/mm/yyyy back to Date
      let dateObj = new Date();
      if (item.data) {
        const parts = item.data.split("/");
        if (parts.length === 3) {
          dateObj = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
        }
      }
      createCardapioRow(dateObj, getSelectedCardapioType(), parseDateFromInput(el.dataIniInput().value), parseDateFromInput(el.dataFimInput().value));
      const last = el.tableCardapioBody().lastElementChild;
      if (last) {
        // set fields based on item
        const tds = last.children;
        if (tds[2]) { const p = tds[2].querySelector("p"); if (p) p.textContent = item.creche || "X"; }
        if (tds[3]) { const p = tds[3].querySelector("p"); if (p) p.textContent = item.ed_inf || "X"; }
        if (tds[4]) { const p = tds[4].querySelector("p"); if (p) p.textContent = item.eja || "X"; }
        if (tds[5]) { const p = tds[5].querySelector("p"); if (p) p.textContent = item.cardapio || "—"; }
        if (tds[7]) { const p = tds[7].querySelector("p"); if (p) p.textContent = item.justificativa || ""; }
      }
    });
  }

  // tabela estoque
  const tbodyE = el.estoqueBody();
  if (tbodyE) tbodyE.innerHTML = "";
  if (Array.isArray(data.estoque)) {
    data.estoque.forEach(it => {
      createEstoqueRow(it);
    });
  }
}

/* Print: hide sidebar, print, show again */
function printDocument() {
  const side = el.sidebar();
  if (side) side.style.display = "none";
  setTimeout(() => {
    window.print();
    // restore after print (small timeout)
    setTimeout(() => { if (side) side.style.display = ""; }, 300);
  }, 200);
}

/* ============================
   Inicialização on DOMContentLoaded
   ============================ */
document.addEventListener("DOMContentLoaded", () => {
  // ensure sidebar buttons exist (export/import/print)
  ensureSidebarButtons();

  // initialize details
  updateDetalhesTabela1();

  // wire generate button if present with id 'gerar-cardapio' or inline already uses generateTable2Rows
  const genBtn = document.getElementById("gerar-cardapio");
  if (genBtn) genBtn.addEventListener("click", generateTable2Rows);

  // data inputs already call generateTable2Rows via onchange in HTML, but ensure updateDetalhes on change
  if (el.dataIniInput()) el.dataIniInput().addEventListener("change", () => { updateDetalhesTabela1(); });
  if (el.dataFimInput()) el.dataFimInput().addEventListener("change", () => { updateDetalhesTabela1(); });

  // initial estoque row if none
  const eb = el.estoqueBody();
  if (eb && eb.children.length === 0) createEstoqueRow();

  // add global functions needed by HTML inline buttons (if any)
  window.exportAllData = exportAllData;
  window.importAllData = importAllData;
  window.printDocument = printDocument;

  // if there are already rows in the cardapio (none at load), attach listeners
  // nothing to do now.

  // feedback
  console.info("script.js inicializado. Funções: generateTable2Rows, addRowTable2, addRowTable3, exportAllData, importAllData, printDocument.");
});
