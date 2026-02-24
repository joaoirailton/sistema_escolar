//INICIO
/* script.js - DEMONSTRATIVO MESTRAL MESTRE PACÍFICO - DINÂMICO V2
   Versão completa implementando as regras solicitadas.
*/

/* --------------------------
   Utilitários de Data e DOM
   --------------------------*/
function parseDateFromInput(value) {
  if (!value) return null;
  const [y, m, d] = value.split('-').map(Number);
  return new Date(y, m - 1, d);
}
function dateToInputValue(date) {
  const y = date.getFullYear();
  const m = ('0' + (date.getMonth() + 1)).slice(-2);
  const d = ('0' + date.getDate()).slice(-2);
  return `${y}-${m}-${d}`;
}
function formatDateBR(date) {
  if (!date) return '';
  const d = ('0' + date.getDate()).slice(-2);
  const m = ('0' + (date.getMonth() + 1)).slice(-2);
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
}
function isSunday(date) { return date.getDay() === 0; }
function isSaturday(date) { return date.getDay() === 6; }
function weekOfMonth(date) {
  // retorna 1..5
  return Math.floor((date.getDate() - 1) / 7) + 1;
}
function downloadFile(filename, content, mime='application/json') {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([content], {type: mime}));
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

/* --------------------------
   Cardápios (regular & integral)
   Index: week 1..4, day 1..6 (segunda..sábado)
   --------------------------*/
const regularWeeks = {
 1:{1:"Café com leite e biscoito salgado",2:"Frango desfiado com arroz branco",3:"Sopa de feijão com carne e legumes",4:"Mingau de milho branco",5:"Carne moída com macarrão e legumes",6:"Café com leite e biscoito salgado"},
 2:{1:"Mingau de farinha de tapioca",2:"Carne moída com macarrão e legumes",3:"Feijão com carne e arroz branco",4:"Suco de fruta com biscoito salgado",5:"Vatapá de frango",6:"Café com leite e biscoito salgado"},
 3:{1:"Café com leite e biscoito salgado",2:"Frango desfiado com arroz branco",3:"Sopa de feijão com carne e legumes",4:"Mingau de milho branco",5:"Filé de peixe desfiado com arroz",6:"Café com leite e biscoito salgado"},
 4:{1:"Mingau de farinha de tapioca",2:"Carne moída com macarrão e legumes",3:"Feijão com carne e arroz branco",4:"Suco de fruta, pão com carne moída",5:"Vatapá de frango",6:"Café com leite e biscoito salgado"}
};
const integralWeeks = {
 1:{1:"Café com leite e biscoito / Isca de carne com arroz branco / Suco com biscoito",2:"Suco com biscoito / Feijão com frango desfiado e arroz branco / Mingau de farinha de tapioca",3:"Café com leite e biscoito / Feijão com carne e arroz branco / Suco de fruta com biscoito",4:"Café com leite e farinha tapioca / Frango com arroz branco / Mingau de milho branco",5:"Mingau de arroz / Carne moída com macarrão e arroz branco / Suco de fruta com biscoito",6:"Suco com biscoito / Frango com arroz branco / Mingau de farinha de tapioca"},
 2:{1:"Suco com biscoito / Frango com arroz branco / Mingau de farinha de tapioca",2:"Café com leite e biscoito / Feijão com carne moída e macarrão / Suco de frutas com biscoito",3:"Café com leite e biscoito / Feijão com carne e arroz branco / Suco de fruta com biscoito",4:"Café com leite e biscoito / Feijão com frango desfiado e arroz branco / Suco com biscoito",5:"Mingau de arroz / Vatapá com arroz / Suco de frutas c/ biscoito",6:"Suco de frutas c/ biscoito"},
 3:{1:"Café com leite e biscoito / Isca de carne com arroz branco / Suco com biscoito",2:"Suco com biscoito / Feijão com frango desfiado e arroz branco / Mingau de farinha de tapioca",3:"Café com leite e biscoito / Feijão com carne e arroz branco / Suco de fruta com biscoito",4:"Café com leite e farinha tapioca / Frango com arroz branco / Mingau de milho branco",5:"Mingau de arroz / Carne moída com macarrão e arroz branco / Suco de fruta com biscoito",6:"Suco com biscoito"},
 4:{1:"Suco com biscoito / Frango com arroz branco e macarrão/ Mingau de farinha de tapioca",2:"Café com leite e biscoito / Feijão com carne moída e macarrão / Suco de frutas com biscoito",3:"Café com leite e biscoito / Feijão com carne e arroz branco / Suco com biscoito",4:"Café com leite e biscoito / Feijão com frango desfiado e arroz branco / Suco com biscoito",5:"Mingau de arroz / Vatapá com arroz / Suco de frutas c/ biscoito",6:"Suco com biscoito"}
};

function getCardapioForDate(d, tipo) {
  if (!d) return '';
  const w = weekOfMonth(d);
  const idx = w > 4 ? 1 : w;
  const day = d.getDay(); // 0..6 (domingo..sábado)
  if (day === 0) return "";
  const weeks = tipo === "integral" ? integralWeeks : regularWeeks;
  // day 1..6 corresponds to Monday..Saturday
  return (weeks[idx] && weeks[idx][day]) ? weeks[idx][day] : "";
}
function getCardapioOptions(tipo) {
  const weeks = tipo === "integral" ? integralWeeks : regularWeeks;
  const s = new Set();
  for (let w=1; w<=4; w++) for (let d=1; d<=6; d++) if (weeks[w] && weeks[w][d]) s.add(weeks[w][d]);
  return Array.from(s);
}

/* --------------------------
   Estoque - lista de itens + unidade
   --------------------------*/
const estoqueItems = [
  {name:"Açúcar triturado", unit:"kg"},
  {name:"Alho in natura", unit:"kg"},
  {name:"Arroz tipo 1", unit:"kg"},
  {name:"Aveia", unit:"unds"},
  {name:"Azeite de dendê", unit:"grfs"},
  {name:"Batata in natura", unit:"kg"},
  {name:"Biscoito salgado cream cracker", unit:"pcts"},
  {name:"Café em pó", unit:"pcts"},
  {name:"Carne moída", unit:"kg"},
  {name:"Carne sem osso", unit:"kg"},
  {name:"Cebola in natura", unit:"kg"},
  {name:"Cenoura in natura", unit:"kg"},
  {name:"Cominho moído", unit:"pcts"},
  {name:"Colorau", unit:"pcts"},
  {name:"Coco ralado", unit:"pcts"},
  {name:"Farinha de tapioca", unit:"kg"},
  {name:"Farinha de mandioca", unit:"kg"},
  {name:"Farinha de trigo", unit:"kg"},
  {name:"Feijão tipo 1", unit:"kg"},
  {name:"Leite de coco", unit:"grfs"},
  {name:"Leite em pó integral", unit:"pcts"},
  {name:"Macarrão espaguete", unit:"pcts"},
  {name:"Massa para sopa", unit:"pcts"},
  {name:"Milho branco", unit:"pcts"},
  {name:"Óleo de soja", unit:"pets"},
  {name:"Peito de frango", unit:"kg"},
  {name:"Polpa de frutas", unit:"pcts"},
  {name:"Sal moído", unit:"kg"},
  {name:"Vinagre de álcool", unit:"gfrs"}
  {name:"Tomate in natura", unit:"kg"},
  
];

/* --------------------------
   DOM helpers (cached getters)
   --------------------------*/
const $ = id => document.getElementById(id);
const el = {
  nome: () => $('nome_escola_input'),
  endereco: () => $('endereco_escola_input'),
  meio: () => $('meio_escola_input'),
  municipio: () => $('municipio_escola_input'),
  numAlunos: () => $('num_alunos_input'),
  tipoEnsino: () => $('tipo_ensino_input'),
  dataIni: () => $('data-inicial'),
  dataFim: () => $('data-final'),
  documentDateInput: () => $('document_date_input'),
  documentDateDisplay: () => $('document_date_display'),
  nomeDisplay: () => $('nome_escola_display'),
  enderecoDisplay: () => $('endereco_escola_display'),
  meioDisplay: () => $('meio_escola_display'),
  municipioDisplay: () => $('municipio_escola_display'),
  numAlunosDisplay: () => $('num_alunos_display'),
  tipoEnsinoDisplay: () => $('tipo_ensino_display'),
  periodoDisplay: () => $('periodo_display'),
  cardapioBody: () => $('table-cardapio-body'),
  estoqueBody: () => $('table-estoque-body'),
  sidebar: () => document.querySelector('.sidebar'),
  cardapioRegular: () => $('cardapio_regular'),
  cardapioIntegral: () => $('cardapio_integral')
};

/* --------------------------
   Update Tabela 1 (detalhes)
   --------------------------*/
function updateDetalhes() {
  if (!el.nomeDisplay()) return;
  el.nomeDisplay().textContent = el.nome()?.value || '';
  el.enderecoDisplay().textContent = el.endereco()?.value || '';
  el.meioDisplay().textContent = el.meio()?.value || '';
  el.municipioDisplay().textContent = el.municipio()?.value || '';
  el.numAlunosDisplay().textContent = el.numAlunos()?.value || '';
  el.tipoEnsinoDisplay().textContent = el.tipoEnsino()?.value || '';
  const ini = el.dataIni()?.value;
  const fim = el.dataFim()?.value;
  if (ini && fim) {
    const d1 = parseDateFromInput(ini);
    const d2 = parseDateFromInput(fim);
    if (d1 && d2) {
      el.periodoDisplay().innerHTML = `${formatDateBR(d1)}<br>${formatDateBR(d2)}`;
    } else {
      el.periodoDisplay().textContent = '';
    }
  } else {
    el.periodoDisplay().textContent = '';
  }
}

/* --------------------------
   Bind changes
   --------------------------*/
function bindDetalhesChange() {
  ['nome_escola_input','endereco_escola_input','meio_escola_input','municipio_escola_input','num_alunos_input','tipo_ensino_input'].forEach(id => {
    const n = document.getElementById(id);
    if (n) n.addEventListener('change', updateDetalhes);
  });
  if (el.dataIni()) el.dataIni().addEventListener('change', updateDetalhes);
  if (el.dataFim()) el.dataFim().addEventListener('change', updateDetalhes);
}

/* --------------------------
   Document date (Brasília UTC-3) - prefill & display
   --------------------------*/
function setDocumentDateToBrasiliaToday() {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const brasilia = new Date(utc + (-3 * 3600000));
  if (el.documentDateInput()) el.documentDateInput().value = dateToInputValue(brasilia);
  updateDocumentDateDisplay();
}
function updateDocumentDateDisplay() {
  const v = el.documentDateInput()?.value;
  if (!v) return;
  const d = parseDateFromInput(v);
  const meses = ["janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"];
  el.documentDateDisplay().textContent = `${d.getDate()} de ${meses[d.getMonth()]} de ${d.getFullYear()}`;
}
function bindDocumentDate() {
  if (el.documentDateInput()) {
    el.documentDateInput().addEventListener('change', updateDocumentDateDisplay);
    setDocumentDateToBrasiliaToday();
  }
}

/* --------------------------
   Cardápio table helpers
   --------------------------*/
function clearCardapio() {
  const body = el.cardapioBody();
  if (body) body.innerHTML = '';
}
function renumberCardapio() {
  const body = el.cardapioBody();
  if (!body) return;
  Array.from(body.children).forEach((tr,i) => {
    const td = tr.children[0];
    if (td) td.textContent = String(i+1);
  });
}
function getSelectedCardapioType() {
  return el.cardapioIntegral()?.checked ? 'integral' : 'regular';
}

/* Check sum of frequencies in a row against total students */
function checkRowSum(tr) {
  const total = Number(el.numAlunos()?.value || 0);
  const tdCreche = tr.children[2];
  const tdEd = tr.children[3];
  const tdEja = tr.children[4];
  function valFromCell(td) {
    const input = td.querySelector('input');
    if (input) return Number(input.value || 0);
    const p = td.querySelector('p');
    if (!p) return 0;
    const txt = p.textContent.trim();
    if (txt === 'X' || txt === '') return 0;
    return Number(txt) || 0;
  }
  const sum = valFromCell(tdCreche) + valFromCell(tdEd) + valFromCell(tdEja);
  if (total > 0 && sum > total) {
    tr.style.backgroundColor = '#ffe6e6';
    // show small non-intrusive alert once per row change
    if (!tr._alertShown) { alert(`A soma das frequências (${sum}) excede o número total de alunos (${total}).`); tr._alertShown = true; }
  } else {
    tr.style.backgroundColor = '';
    tr._alertShown = false;
  }
}

/* Create frequency cell (p -> input on click) */
function makeFreqCell(tr) {
  const td = document.createElement('td');
  const p = document.createElement('p');
  p.textContent = 'X';
  p.style.cursor = 'pointer';
  p.addEventListener('click', () => {
    if (td.querySelector('input')) return;
    const input = document.createElement('input');
    input.type = 'number';
    input.min = 0;
    input.value = '';
    input.className = 'attendance-edit-field';
    input.addEventListener('blur', () => {
      const v = input.value.trim();
      p.textContent = (v === '' || Number(v) === 0) ? 'X' : String(Number(v));
      input.remove();
      if (!td.contains(p)) td.appendChild(p);
      checkRowSum(tr);
    });
    input.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter') input.blur();
    });
    td.appendChild(input);
    input.focus();
  });
  td.appendChild(p);
  return td;
}

/* Create a cardápio row for given date */
function createCardapioRow(dateObj, periodStart, periodEnd) {
  const body = el.cardapioBody();
  if (!body) return;
  const tr = document.createElement('tr');

  // col1 Quant. Dias (placeholder; will renumber later)
  const tdNum = document.createElement('td'); tdNum.textContent = '0'; tr.appendChild(tdNum);

  // col2 Data (p -> input date within period)
  const tdData = document.createElement('td');
  const pData = document.createElement('p'); pData.textContent = formatDateBR(dateObj); pData.style.cursor='pointer';
  tdData.appendChild(pData);
  pData.addEventListener('click', () => {
    if (tdData.querySelector('input')) return;
    const input = document.createElement('input'); input.type='date';
    // min/max from period
    if (periodStart) input.min = dateToInputValue(periodStart);
    if (periodEnd) input.max = dateToInputValue(periodEnd);
    // default value
    input.value = dateToInputValue(dateObj);
    input.addEventListener('change', () => {
      const newD = parseDateFromInput(input.value);
      if (!newD) { alert('Data inválida'); input.focus(); return; }
      if (isSunday(newD)) { alert('Domingo não é dia letivo. Escolha uma data entre segunda e sábado.'); input.focus(); return; }
      pData.textContent = formatDateBR(newD);
      // atualizar cardápio e justificativa de sábado
      const tipo = getSelectedCardapioType();
      const cardTxt = getCardapioForDate(newD, tipo) || '—';
      const tdCard = tr.querySelector('.cardapio-cell p');
      if (tdCard) tdCard.textContent = cardTxt;
      const tdJust = tr.querySelector('.justificativa-cell p');
      if (tdJust) {
        if (isSaturday(newD)) tdJust.textContent = 'Sábado letivo, foi servida merenda';
        else if (tdJust.textContent === 'Sábado letivo, foi servida merenda') tdJust.textContent = '';
      }
      input.remove();
    });
    input.addEventListener('blur', () => {
      if (tdData.contains(input)) { const v = input.value; input.remove(); pData.textContent = v ? formatDateBR(parseDateFromInput(v)) : formatDateBR(dateObj); }
    });
    tdData.appendChild(input); input.focus();
  });
  tr.appendChild(tdData);

  // col3,4,5 Frequências (Creche, Ed. Inf e Fund, EJA)
  tr.appendChild(makeFreqCell(tr));
  tr.appendChild(makeFreqCell(tr));
  tr.appendChild(makeFreqCell(tr));

  // col6 Cardápio (p -> select on click)
  const tdCard = document.createElement('td'); tdCard.className='cardapio-cell';
  const pCard = document.createElement('p'); pCard.style.cursor='pointer';
  const tipo = getSelectedCardapioType();
  pCard.textContent = getCardapioForDate(dateObj, tipo) || '—';
  pCard.addEventListener('click', () => {
    if (tdCard.querySelector('select')) return;
    const select = document.createElement('select'); select.className='edit-field';
    // add options
    const opts = getCardapioOptions(getSelectedCardapioType());
    opts.forEach(optText => {
      const o = document.createElement('option'); o.value = optText; o.textContent = optText; select.appendChild(o);
    });
    // set current selected if present
    const cur = pCard.textContent;
    if (cur && opts.includes(cur)) select.value = cur;
    else {
      const first = document.createElement('option'); first.value = cur; first.textContent = cur; select.insertBefore(first, select.firstChild);
      select.value = cur;
    }
    select.addEventListener('change', () => {
      const novo = select.value; const antigo = pCard.textContent;
      if (novo !== antigo) {
        pCard.textContent = novo;
        const tdJust = tr.querySelector('.justificativa-cell p');
        if (tdJust) tdJust.textContent = `O cardápio era "${antigo}", foi mudado por "${novo}"`;
      }
      select.remove();
    });
    select.addEventListener('blur', () => { if (tdCard.contains(select)) { const v = select.value || pCard.textContent; pCard.textContent = v; select.remove(); } });
    tdCard.appendChild(select);
    select.focus();
  });
  tdCard.appendChild(pCard);
  tr.appendChild(tdCard);

  // col7 empty (kept)
  tr.appendChild(document.createElement('td'));

  // col8 justificativa (p -> textarea)
  const tdJust = document.createElement('td'); tdJust.className='justificativa-cell';
  const pJust = document.createElement('p'); pJust.style.cursor='pointer';
  if (isSaturday(dateObj)) pJust.textContent = 'Sábado letivo, foi servida merenda';
  else pJust.textContent = '';
  pJust.addEventListener('click', () => {
    if (tdJust.querySelector('textarea')) return;
    const ta = document.createElement('textarea'); ta.className='edit-field'; ta.value = pJust.textContent;
    ta.addEventListener('blur', () => { pJust.textContent = ta.value; ta.remove(); if (!tdJust.contains(pJust)) tdJust.appendChild(pJust); });
    ta.addEventListener('keydown', (ev) => { if (ev.key === 'Enter' && !ev.ctrlKey) { ev.preventDefault(); ta.blur(); }});
    tdJust.appendChild(ta); ta.focus();
  });
  tdJust.appendChild(pJust);
  tr.appendChild(tdJust);

  // last col: remove button (lixeira)
  const tdBtn = document.createElement('td');
  const btnRm = document.createElement('button'); btnRm.className='remove-row-btn'; btnRm.type='button'; btnRm.textContent='🗑';
  btnRm.addEventListener('click', () => { tr.remove(); renumberCardapio(); });
  tdBtn.appendChild(btnRm);
  tr.appendChild(tdBtn);

  body.appendChild(tr);
  renumberCardapio();

  // attach checkRow when any frequency value changes (delegated listeners are simpler but we bind locally)
  ['click','input','blur','change'].forEach(evt => {
    tr.addEventListener(evt, () => checkRowSum(tr));
  });
}

/* --------------------------
   Generate Table 2 rows for period (only dias letivos segunda..sábado)
   --------------------------*/
function generateTable2Rows() {
  const ini = el.dataIni()?.value;
  const fim = el.dataFim()?.value;
  if (!ini || !fim) { alert('Defina período (início e fim).'); return; }
  const d1 = parseDateFromInput(ini);
  const d2 = parseDateFromInput(fim);
  if (!d1 || !d2) { alert('Datas inválidas.'); return; }
  if (d2 < d1) { alert('A data final deve ser igual ou posterior à data inicial.'); return; }
  clearCardapio();
  const tipo = getSelectedCardapioType();
  for (let t = new Date(d1.getFullYear(), d1.getMonth(), d1.getDate()); t <= d2; t.setDate(t.getDate()+1)) {
    const dt = new Date(t);
    if (isSunday(dt)) continue; // skip Sundays
    createCardapioRow(new Date(dt), d1, d2);
  }
  updateDetalhes();
}
window.generateTable2Rows = generateTable2Rows;
// alias for the extra button name in HTML
window.gerarTabelaCardapio = generateTable2Rows;

/* Add manual cardapio row (end) */
function addRowTable2() {
  const d1 = el.dataIni()?.value ? parseDateFromInput(el.dataIni().value) : null;
  const d2 = el.dataFim()?.value ? parseDateFromInput(el.dataFim().value) : null;
  // create a "today" row but restrict date editing to between d1 and d2 if present
  createCardapioRow(new Date(), d1, d2);
}
window.addRowTable2 = addRowTable2;

/* --------------------------
   Estoque (Tabela 3) - create row & logic (ATUALIZADA)
   --------------------------*/
function createEstoqueRow(data) {
  // data optional: {quant, discr, cons, estAntes, saldo, rel, unit}
  const tbody = el.estoqueBody();
  if (!tbody) return;
  const tr = document.createElement('tr');

  // FUNÇÃO QUE CRIA O BLOCO "quantidade + unidade"
  function createQtyUnitBlock(valueQty = '', valueUnit = '') {
    const wrapper = document.createElement('div');
    wrapper.style.display = 'flex';
    wrapper.style.gap = '4px';
    wrapper.style.alignItems = 'center';

    const qtyInput = document.createElement('input');
    qtyInput.type = 'number';
    qtyInput.min = '0';
    qtyInput.value = valueQty;

    const unitSelect = document.createElement('select');
    unitSelect.className = 'unitSelect';

    // cria opções de unidade (unit armazenada em estoqueItems)
    const units = ['kg','unds','grfs','pcts','g','pets','outro'];
    units.forEach(u => unitSelect.appendChild(new Option(u, u)));

    if (valueUnit) unitSelect.value = valueUnit;

    wrapper.appendChild(qtyInput);
    wrapper.appendChild(unitSelect);

    return { wrapper, qtyInput, unitSelect };
  }

  // 1: QUANT. (recebida)
  const tdQuant = document.createElement('td');
  const blockQuant = createQtyUnitBlock(data?.quant ?? '', data?.unit ?? '');
  tdQuant.appendChild(blockQuant.wrapper);
  tr.appendChild(tdQuant);

  // 2: DISCRIMINAÇÃO (select)
  const tdDisc = document.createElement('td');
  const sel = document.createElement('select');
  sel.appendChild(new Option('-- selecione --', ''));

  estoqueItems.forEach(it => sel.appendChild(new Option(it.name, it.name)));

  sel.appendChild(new Option('Outro', '__OUTRO__'));

  if (data?.discr) sel.value = data.discr;
  tdDisc.appendChild(sel);

  // SPAN DE UNIDADE (exibição ao lado do item)
  const spanUnit = document.createElement('span');
  spanUnit.style.marginLeft = '6px';
  spanUnit.style.fontWeight = 'bold';

  tr.appendChild(tdDisc);

  // 3: QUANT. ALIM. CONS.
  const tdCons = document.createElement('td');
  const blockCons = createQtyUnitBlock(data?.cons ?? '', data?.unit ?? '');
  // quantidade é calculada, então input deve ser readonly
  blockCons.qtyInput.readOnly = true;
  tdCons.appendChild(blockCons.wrapper);
  tr.appendChild(tdCons);

  // 4: QUANT. JÁ EM ESTOQUE (antes)
  const tdEstAntes = document.createElement('td');
  const blockEstAntes = createQtyUnitBlock(data?.estAntes ?? '', data?.unit ?? '');
  tdEstAntes.appendChild(blockEstAntes.wrapper);
  tr.appendChild(tdEstAntes);

  // 5: SALDO ATUAL
  const tdSaldo = document.createElement('td');
  const blockSaldo = createQtyUnitBlock(data?.saldo ?? '', data?.unit ?? '');
  tdSaldo.appendChild(blockSaldo.wrapper);
  tr.appendChild(tdSaldo);

  // 6: RELATÓRIO
  const tdRel = document.createElement('td');
  const pRel = document.createElement('p');
  pRel.style.cursor = 'pointer';
  pRel.textContent = data?.rel ?? '';

  pRel.addEventListener('click', () => {
    if (tdRel.querySelector('textarea')) return;
    const ta = document.createElement('textarea');
    ta.className = 'edit-field';
    ta.value = pRel.textContent;

    ta.addEventListener('blur', () => {
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
  const tdBtn = document.createElement('td');
  const btnRm = document.createElement('button');
  btnRm.className = 'remove-row-btn';
  btnRm.type = 'button';
  btnRm.textContent = '🗑';
  btnRm.addEventListener('click', () => tr.remove());
  tdBtn.appendChild(btnRm);
  tr.appendChild(tdBtn);

  // FUNÇÃO PARA ATUALIZAR AS UNIDADES QUANDO ITEM MUDA
  function updateUnitsEverywhere() {
    const v = sel.value;
    if (!v || v === '__OUTRO__') {
      spanUnit.textContent = '';
      return;
    }
    const found = estoqueItems.find(it => it.name === v);
    const unit = found ? found.unit : '';

    spanUnit.textContent = unit;

    // seta unidade nos 4 blocos
    [blockQuant, blockCons, blockEstAntes, blockSaldo].forEach(b => {
      if (unit) b.unitSelect.value = unit;
    });
  }

  sel.addEventListener('change', () => {
    if (sel.value === '__OUTRO__') {

        // Evita abrir várias caixas se já estiver aberta
        if (tdDisc._outroShown) return;

        const div = document.createElement('div');
        div.style.display = 'flex';
        div.style.flexDirection = 'column';
        div.style.marginTop = '6px';
        div.style.padding = '6px';
        div.style.border = '1px solid #ccc';
        div.style.borderRadius = '6px';
        div.style.background = '#f9f9f9';
        div.style.gap = '6px';

        // Inputs
        const nameIn = document.createElement('input');
        nameIn.type = 'text';
        nameIn.placeholder = 'Nome do novo item';

        const unitIn = document.createElement('input');
        unitIn.type = 'text';
        unitIn.placeholder = 'Unidade de medida (ex: kg, L, un...)';

        // Botões
        const buttons = document.createElement('div');
        buttons.style.display = 'flex';
        buttons.style.gap = '6px';

        const ok = document.createElement('button');
        ok.type = 'button';
        ok.textContent = 'OK';

        const cancel = document.createElement('button');
        cancel.type = 'button';
        cancel.textContent = 'Cancelar';

        // AÇÕES
        ok.addEventListener('click', () => {
            const nm = nameIn.value.trim();
            const uni = unitIn.value.trim();

            if (!nm) {
                alert('Informe o nome do item.');
                return;
            }

            // Adiciona item à lista
            estoqueItems.push({ name: nm, unit: uni });

            // Reconstrói o select
            sel.innerHTML = '';
            sel.appendChild(new Option('-- selecione --', ''));
            estoqueItems.forEach(it => sel.appendChild(new Option(it.name, it.name)));
            sel.appendChild(new Option('Outro', '__OUTRO__'));

            // Seleciona automaticamente o novo item
            sel.value = nm;

            // Atualiza unidade nas colunas
            updateUnitsEverywhere();

            // Remove caixa
            div.remove();
            tdDisc._outroShown = false;
        });

        cancel.addEventListener('click', () => {
            div.remove();
            tdDisc._outroShown = false;
            sel.value = '';
        });

        buttons.appendChild(ok);
        buttons.appendChild(cancel);

        // Monta caixa
        div.appendChild(nameIn);
        div.appendChild(unitIn);
        div.appendChild(buttons);

        tdDisc.appendChild(div);
        tdDisc._outroShown = true;
        return;
    }

    // Se não for "Outro", apenas atualiza as unidades
    updateUnitsEverywhere();
});


  // CÁLCULO AUTOMÁTICO DO CONSUMO
  function computeCons() {
    const q = Number(blockQuant.qtyInput.value) || 0;
    const e = Number(blockEstAntes.qtyInput.value) || 0;
    const s = Number(blockSaldo.qtyInput.value) || 0;
    const cons = q + e - s;
    blockCons.qtyInput.value = cons;
  }

  [blockQuant.qtyInput, blockEstAntes.qtyInput, blockSaldo.qtyInput]
    .forEach(inp => inp.addEventListener('input', computeCons));

  // inicializa
  updateUnitsEverywhere();
  computeCons();

  tbody.appendChild(tr);
  return tr;
}

function addRowTable3() { createEstoqueRow(); }
window.addRowTable3 = addRowTable3;


/* --------------------------
   Export / Import / Print
   and add buttons to sidebar if missing
   --------------------------*/
function exportAll() {
  const payload = {};
  // detalhes
  payload.detalhes = {
    nome: el.nome()?.value || '',
    endereco: el.endereco()?.value || '',
    meio: el.meio()?.value || '',
    municipio: el.municipio()?.value || '',
    num_alunos: el.numAlunos()?.value || '',
    tipo_ensino: el.tipoEnsino()?.value || '',
    periodo_inicio: el.dataIni()?.value || '',
    periodo_fim: el.dataFim()?.value || ''
  };
  payload.document_date = el.documentDateInput()?.value || '';
  // cardapio
  payload.cardapio = [];
  const rows = Array.from(el.cardapioBody()?.children || []);
  rows.forEach(tr => {
    const tds = tr.children;
    payload.cardapio.push({
      quant_dias: tds[0]?.textContent || '',
      data: tds[1]?.querySelector('p')?.textContent || '',
      creche: tds[2]?.querySelector('p')?.textContent || '',
      ed_inf: tds[3]?.querySelector('p')?.textContent || '',
      eja: tds[4]?.querySelector('p')?.textContent || '',
      cardapio: tds[5]?.querySelector('p')?.textContent || '',
      justificativa: tds[7]?.querySelector('p')?.textContent || ''
    });
  });
  // estoque
  payload.estoque = [];
  const rowsE = Array.from(el.estoqueBody()?.children || []);
  rowsE.forEach(tr => {
    const tds = tr.children;
    const quant = tds[0]?.querySelector('input')?.value || '';
    const discrSel = tds[1]?.querySelector('select');
    const discr = discrSel ? discrSel.value : (tds[1]?.querySelector('input')?.value || '');
    const cons = tds[2]?.querySelector('input')?.value || '';
    const estAntes = tds[3]?.querySelector('input')?.value || '';
    const saldo = tds[4]?.querySelector('input')?.value || '';
    const rel = tds[5]?.querySelector('p')?.textContent || '';
    payload.estoque.push({ quant, discr, cons, estAntes, saldo, rel });
  });

  downloadFile(`demonstrativo_${(new Date()).toISOString().slice(0,10)}.json`, JSON.stringify(payload, null, 2));
}
function importAllFromFile(fileContent) {
  try {
    const data = JSON.parse(fileContent);
    // detalhes
    if (data.detalhes) {
      if (el.nome()) el.nome().value = data.detalhes.nome || '';
      if (el.endereco()) el.endereco().value = data.detalhes.endereco || '';
      if (el.meio()) el.meio().value = data.detalhes.meio || '';
      if (el.municipio()) el.municipio().value = data.detalhes.municipio || '';
      if (el.numAlunos()) el.numAlunos().value = data.detalhes.num_alunos || '';
      if (el.tipoEnsino()) el.tipoEnsino().value = data.detalhes.tipo_ensino || '';
      if (el.dataIni()) el.dataIni().value = data.detalhes.periodo_inicio || '';
      if (el.dataFim()) el.dataFim().value = data.detalhes.periodo_fim || '';
    }
    if (data.document_date && el.documentDateInput()) { el.documentDateInput().value = data.document_date; updateDocumentDateDisplay(); }
    updateDetalhes();

    // cardapio
    clearCardapio();
    if (Array.isArray(data.cardapio)) {
      data.cardapio.forEach(item => {
        // parse data string dd/mm/yyyy into Date
        let dateObj = new Date();
        if (item.data) {
          const parts = item.data.split('/');
          if (parts.length === 3) dateObj = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
        }
        createCardapioRow(dateObj, parseDateFromInput(el.dataIni()?.value), parseDateFromInput(el.dataFim()?.value));
        const last = el.cardapioBody().lastElementChild;
        if (last) {
          const tds = last.children;
          if (tds[2]?.querySelector('p')) tds[2].querySelector('p').textContent = item.creche || 'X';
          if (tds[3]?.querySelector('p')) tds[3].querySelector('p').textContent = item.ed_inf || 'X';
          if (tds[4]?.querySelector('p')) tds[4].querySelector('p').textContent = item.eja || 'X';
          if (tds[5]?.querySelector('p')) tds[5].querySelector('p').textContent = item.cardapio || '—';
          if (tds[7]?.querySelector('p')) tds[7].querySelector('p').textContent = item.justificativa || '';
        }
      });
    }

    // estoque
    const tb = el.estoqueBody();
    if (tb) tb.innerHTML = '';
    if (Array.isArray(data.estoque)) {
      data.estoque.forEach(it => createEstoqueRow(it));
    }
    alert('Importação concluída.');
  } catch (err) {
    console.error(err);
    alert('Erro ao importar arquivo: formato inválido.');
  }
}
function ensureSidebarBtns() {
  const side = el.sidebar();
  if (!side) return;
  if (!document.getElementById('btn-export')) {
    const b = document.createElement('button'); b.id='btn-export'; b.textContent='Exportar (JSON)'; b.style.display='block'; b.style.marginTop='8px';
    b.addEventListener('click', exportAll);
    side.appendChild(b);
  }
  if (!document.getElementById('btn-import')) {
    const b = document.createElement('button'); b.id='btn-import'; b.textContent='Importar (JSON)'; b.style.display='block'; b.style.marginTop='6px';
    b.addEventListener('click', () => {
      const fi = document.createElement('input'); fi.type='file'; fi.accept='application/json';
      fi.addEventListener('change', (e) => {
        const f = e.target.files[0]; if (!f) return;
        const reader = new FileReader();
        reader.onload = ev => importAllFromFile(ev.target.result);
        reader.readAsText(f);
      });
      fi.click();
    });
    side.appendChild(b);
  }
  if (!document.getElementById('btn-print')) {
    const b = document.createElement('button'); b.id='btn-print'; b.textContent='Imprimir'; b.style.display='block'; b.style.marginTop='6px';
    b.addEventListener('click', () => {
      const sideEl = el.sidebar();
      if (sideEl) sideEl.style.display='none';
      setTimeout(() => { window.print(); setTimeout(()=>{ if (sideEl) sideEl.style.display=''; }, 300); }, 200);
    });
    side.appendChild(b);
  }
}

/* --------------------------
   Inicialização
   --------------------------*/
document.addEventListener('DOMContentLoaded', () => {
  // ensure bindings
  bindDetalhesChange();
  bindDocumentDate();
  ensureSidebarBtns();

  // Set period fields empty as requested
  if (el.dataIni()) el.dataIni().value = '';
  if (el.dataFim()) el.dataFim().value = '';

  // set document date to Brasilia if empty
  if (el.documentDateInput() && !el.documentDateInput().value) setDocumentDateToBrasiliaToday();
  updateDetalhes();

  // if any existing tabela cardapio rows desired to create automatically, leave blank - user will click Gerar
  // Add a default estoque row to help user start
  if (el.estoqueBody() && el.estoqueBody().children.length === 0) createEstoqueRow();

  // Listen to cardapio type changes to update existing rows' cardápio texts
  const cardTypeEls = [el.cardapioIntegral(), el.cardapioRegular()].filter(Boolean);
  cardTypeEls.forEach(r => r.addEventListener('change', () => {
    const tipo = getSelectedCardapioType();
    const rows = Array.from(el.cardapioBody()?.children || []);
    rows.forEach(tr => {
      // update cardapio based on date in cell 2
      const pDate = tr.children[1]?.querySelector('p')?.textContent;
      if (pDate) {
        const parts = pDate.split('/');
        if (parts.length === 3) {
          const d = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
          const c = getCardapioForDate(d, tipo);
          const pCard = tr.children[5]?.querySelector('p');
          if (pCard && (!pCard._userChanged)) { // if user didn't change manually, update
            pCard.textContent = c || '—';
          }
        }
      }
    });
  }));

  // ensure when number of students changes we recheck rows
  if (el.numAlunos()) el.numAlunos().addEventListener('input', () => {
    const rows = Array.from(el.cardapioBody()?.children || []);
    rows.forEach(tr => checkRowSum(tr));
  });
});
//FIM
