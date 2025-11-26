/* ---------- UTILITÁRIOS ---------- */
function formatCPFString(v){
  if(!v) return "";
  let s = v.replace(/\D/g,'');
  if(s.length<=3) return s;
  if(s.length<=6) return s.replace(/(\d{3})(\d+)/, "$1.$2");
  if(s.length<=9) return s.replace(/(\d{3})(\d{3})(\d+)/, "$1.$2.$3");
  return s.replace(/(\d{3})(\d{3})(\d{3})(\d{2}).*/, "$1.$2.$3-$4");
}
function applyCPFFormatToField(id){
  const el = document.getElementById(id);
  el.addEventListener('blur', ()=>{ el.value = formatCPFString(el.value); });
}

/* ---------- POPULAÇÃO INICIAL ---------- */
(function init(){
  
  // preencher anos (1960-2040)
  const selAno = document.getElementById('campo_ano_registro');
  for(let y=1960;y<=2040;y++){
    const o = document.createElement('option'); o.value=y; o.textContent=y;
    selAno.appendChild(o);
  }

  // data do documento = hoje (campo 23)
  const hoje = new Date();
  const yyyy = hoje.getFullYear(), mm = String(hoje.getMonth()+1).padStart(2,'0'), dd = String(hoje.getDate()).padStart(2,'0');
  document.getElementById('campo_data_doc').value = `${yyyy}-${mm}-${dd}`;

  // aplicar formatação CPF nos campos 15 e 19
  applyCPFFormatToField('campo_cpf_mae');
  applyCPFFormatToField('campo_cpf_pai');
})();
//JUNINHO
function formatarDataDocumento(data){
  if(!data) return '';
  // data vem do input type="date" no formato "YYYY-MM-DD"
  const options = { day: '2-digit', month: 'long', year: 'numeric' };
  const parts = String(data).split('-');
  let dt;
  if(parts.length === 3){
    // cria Date no timezone local com ano, mês-1, dia — evita deslocamento de fuso
    dt = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  } else {
    dt = new Date(data);
  }
  return dt.toLocaleDateString('pt-BR', options);
}


/* ---------- REGISTROS 24–28 (lista) ---------- */
let registros = [];
const regListEl = document.getElementById('reg_list');
const tbodyHistorico = document.getElementById('tbody_historico');

function renderRegistros(){
  // render sidebar list
  regListEl.innerHTML = '';
  registros.forEach((r, idx) => {
    const div = document.createElement('div'); div.className='reg-item';
    const txt = document.createElement('div'); txt.className='txt';
    txt.innerHTML = `<strong>${r.ano}</strong> — ${r.serie} / ${r.curso} / ${r.escola} / <em>${r.resultado}</em>`;
    const actions = document.createElement('div'); actions.className='reg-actions';
    actions.innerHTML = `
      <button title="Mover para cima" onclick="moveRegistro(${idx},-1)"><i class="fa fa-chevron-up"></i></button>
      <button title="Mover para baixo" onclick="moveRegistro(${idx},1)"><i class="fa fa-chevron-down"></i></button>
      <button title="Editar" onclick="editarRegistro(${idx})"><i class="fa fa-pen"></i></button>
      <button title="Excluir" onclick="excluirRegistro(${idx})"><i class="fa fa-trash"></i></button>
    `;
    div.appendChild(txt); div.appendChild(actions);
    regListEl.appendChild(div);
  });

  // render tabela no documento
  tbodyHistorico.innerHTML = '';
  registros.forEach(r=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${r.ano}</td><td>${r.serie}</td><td>${r.curso}</td><td>${r.escola}</td><td>${r.resultado}</td>`;
    tbodyHistorico.appendChild(tr);
  });
}

function moveRegistro(i, dir){
  const j = i + dir;
  if(j<0 || j>=registros.length) return;
  const tmp = registros[i]; registros.splice(i,1);
  registros.splice(j,0,tmp);
  renderRegistros();
}

function editarRegistro(i){
  const r = registros[i];
  // carregar nos campos 24-28 para editar
  document.getElementById('campo_ano_registro').value = r.ano;
  document.getElementById('campo_serie_registro').value = r.serie;
  document.getElementById('campo_curso_registro').value = r.curso;
  document.getElementById('campo_escola_registro').value = r.escola;
  document.getElementById('campo_resultado_registro').value = r.resultado;
  // remover o registro antigo
  registros.splice(i,1);
  renderRegistros();
}

function excluirRegistro(i){
  registros.splice(i,1);
  renderRegistros();
}

document.getElementById('btn_add_reg').addEventListener('click', ()=>{
  const ano = document.getElementById('campo_ano_registro').value;
  const serie = document.getElementById('campo_serie_registro').value;
  const curso = document.getElementById('campo_curso_registro').value;
  const escola = document.getElementById('campo_escola_registro').value;
  const resultado = document.getElementById('campo_resultado_registro').value;
  if(!ano || !serie || !curso || !escola || !resultado){
    alert('Preencha todos os campos do registro (24–28) antes de adicionar.');
    return;
  }
  registros.push({ano,serie,curso,escola,resultado});
  // limpa campos 27 (escola) opcionalmente
  document.getElementById('campo_escola_registro').value = '';
  renderRegistros();
});

document.getElementById('btn_limpar_reg').addEventListener('click', ()=>{
  document.getElementById('campo_escola_registro').value='';
  document.getElementById('campo_ano_registro').selectedIndex=0;
  document.getElementById('campo_serie_registro').selectedIndex=0;
  document.getElementById('campo_curso_registro').selectedIndex=0;
  document.getElementById('campo_resultado_registro').selectedIndex=0;
});

/* ---------- GERAR DOCUMENTO ---------- */
document.getElementById('btn_gerar').addEventListener('click', ()=>{
  // ler campos
  const unidade = document.getElementById('campo_unidade').value;
  const endereco = document.getElementById('campo_endereco').value;
  const cidadePara = document.getElementById('campo_cidade_para').value;
  const nomeAluno = document.getElementById('campo_aluno').value;
  const sexo = document.getElementById('campo_sexo').value;
  const nasc = document.getElementById('campo_nasc').value;
  const cidadeBrasil = document.getElementById('campo_cidade_brasil').value || document.getElementById('campo_cidade_brasil').getAttribute('value') || 'ÓBIDOS';
  const estado = document.getElementById('campo_estado').value;
  const registro = document.getElementById('campo_registro').value;
  const livro = document.getElementById('campo_livro').value;
  const folha = document.getElementById('campo_folha').value;
  const mae = document.getElementById('campo_mae').value;
  const profMae = document.getElementById('campo_prof_mae').value;
  const rgMae = document.getElementById('campo_rg_mae').value;
  const cpfMae = document.getElementById('campo_cpf_mae').value;
  const pai = document.getElementById('campo_pai').value;
  const profPai = document.getElementById('campo_prof_pai').value;
  const rgPai = document.getElementById('campo_rg_pai').value;
  const cpfPai = document.getElementById('campo_cpf_pai').value;
  const resid = document.getElementById('campo_residencia').value;
  const cidadeResid = document.getElementById('campo_cidade_resid').value || document.getElementById('campo_cidade_resid').getAttribute('value') || 'ÓBIDOS';
  const estadoResid = document.getElementById('campo_estado_resid').value;
  const dataDoc = document.getElementById('campo_data_doc').value;
  const origem = document.querySelector('input[name="origem"]:checked').value;

  // validações simples
  if(!nomeAluno){
    if(!confirm('O campo NOME DO ALUNO está vazio. Deseja continuar?')) return;
  }

  // preencher documento
  document.getElementById('td_unidade').textContent = unidade;
  document.getElementById('td_endereco').textContent = endereco || '—';
  document.getElementById('td_municipio').textContent = cidadePara || '—';

  document.getElementById('td_nome_aluno').textContent = nomeAluno||'—';
  document.getElementById('td_sexo').textContent = sexo||'—';
  document.getElementById('td_nasc').textContent = nasc ? (new Date(nasc)).toLocaleDateString('pt-BR') : '—';
  document.getElementById('td_cidade').textContent = cidadeBrasil||'—';
  document.getElementById('td_estado').textContent = estado||'—';
  // Detecta se é matrícula (certidão nova)
  // --- Tratamento registro / matrícula (novo modelo com número único) ---
const registroNumeros = (registro || '').replace(/\D/g, ''); // somente dígitos

// referências aos headers/ths relevantes:
// linha 4 (ESTADO / REGISTRO / LIVRO) -> queremos alterar o th na posição onde está "REGISTRO DE NASC."
const thRegistro = document.querySelector('#tbl_identificacao tr:nth-child(4) th:nth-child(5)');
// a coluna "LIVRO" (na mesma linha, 6ª posição)
const thLivro = document.querySelector('#tbl_identificacao tr:nth-child(4) th:nth-child(6)');
// linha 5 (FOLHA) -> th da primeira célula dessa linha
const thFolhaRow5 = document.querySelector('#tbl_identificacao tr:nth-child(5) th');

// comportamento quando é matrícula longa (>12 dígitos)
if (registroNumeros.length > 12) {
  // deixa o cabeçalho do "registro" vazio (conforme pedido)
  if(thRegistro) thRegistro.textContent = '';
  if(thLivro) thLivro.textContent = '';
  // substitui o título "FOLHA" por "NÚMERO DE MATRÍCULA"
  if(thFolhaRow5) thFolhaRow5.textContent = 'NÚMERO DE MATRÍCULA';
  // preenche: registro e livro vazios; número de matrícula na célula da folha
  document.getElementById('td_registro').textContent = '';
  document.getElementById('td_livro').textContent = '';
  document.getElementById('td_folha').textContent = registro || '—';
} else {
  // restaura textos originais dos cabeçalhos
  if(thRegistro) thRegistro.textContent = 'REGISTRO DE NASC.';
  if(thLivro) thLivro.textContent = 'LIVRO';
  if(thFolhaRow5) thFolhaRow5.textContent = 'FOLHA';
  // comportamento antigo (campos separados)
  document.getElementById('td_registro').textContent = registro || '—';
  document.getElementById('td_livro').textContent = livro || '—';
  document.getElementById('td_folha').textContent = folha || '—';
}


  document.getElementById('td_mae').textContent = mae||'—';
  document.getElementById('td_prof_mae').textContent = profMae||'—';
  document.getElementById('td_rg_mae').textContent = rgMae||'—';
  document.getElementById('td_cpf_mae').textContent = cpfMae||'—';

  document.getElementById('td_pai').textContent = pai||'—';
  document.getElementById('td_prof_pai').textContent = profPai||'—';
  document.getElementById('td_rg_pai').textContent = rgPai||'—';
  document.getElementById('td_cpf_pai').textContent = cpfPai||'—';

  document.getElementById('td_residencia').textContent = resid||'—';
  document.getElementById('td_cidade_resid').textContent = cidadeResid||'—';
  document.getElementById('td_estado_resid').textContent = estadoResid||'—';

  document.getElementById('td_data_doc').textContent = dataDoc ? formatarDataDocumento(dataDoc) : '';

  // origem ATIVO/PASSIVO - mostra no rodapé como nota breve (opcional)
  const rodape = document.querySelector('.rodape');
  rodape.textContent = `OBS: Estas informações foram retiradas do nosso arquivo ${origem} que fica à disposição do INSS para qualquer fiscalização ou esclarecimento.`;

  // preencher histórico com registros já adicionados
  renderRegistros();

  // scroll documento para o topo (visual)
  document.querySelector('.documento-wrap').scrollTop = 0;
  alert('Documento gerado com sucesso. Use Imprimir / Salvar à direita.');
});

/* ---------- BOTÕES NOVO / SALVAR / IMPRIMIR ---------- */
document.getElementById('btn_novo').addEventListener('click', ()=>{
  if(!confirm('Limpar formulário e documento?')) return;
  // limpa campos do formulário (exceto anos list)
  document.querySelectorAll('#campo_unidade, #campo_endereco, #campo_aluno, #campo_nasc, #campo_registro, #campo_livro, #campo_folha, #campo_mae, #campo_prof_mae, #campo_rg_mae, #campo_cpf_mae, #campo_pai, #campo_prof_pai, #campo_rg_pai, #campo_cpf_pai, #campo_residencia, #campo_escola_registro').forEach(i=>i.value='');
  // reset selects to defaults
  document.getElementById('campo_sexo').selectedIndex=0;
  document.getElementById('campo_estado').value='PA';
  document.getElementById('campo_cidade_para').value='ÓBIDOS';
  document.getElementById('campo_estado_resid').value='PA';
  // limpar registros e documento table
  registros = []; renderRegistros();
  document.querySelectorAll('[id^="td_"]').forEach(td => td.textContent = '');
  document.getElementById('td_unidade').textContent = 'E.M.E.I.E.F. “MESTRE PACÍFICO”';
  document.getElementById('td_endereco').textContent = 'COMUNIDADE IGARAPÉ-AÇÚ';
  document.getElementById('td_municipio').textContent = 'ÓBIDOS';
  document.getElementById('td_data_doc').textContent = '';
  document.querySelector('.rodape').textContent = 'OBS: Estas informações foram retiradas do nosso arquivo PASSIVO que fica à disposição do INSS para qualquer fiscalização ou esclarecimento.';
});

document.getElementById('btn_salvar').addEventListener('click', function(){
  // prepara o elemento que será convertido em PDF
  const elemento = document.getElementById('documento_wrap');

  // opções — ajuste margin / scale se necessário
  const opt = {
    margin:       [10, 10, 10, 10],               // top, left, bottom, right (pt)
    filename:     'ficha_matricula.pdf',
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2, useCORS: true, windowWidth: elemento.scrollWidth },
    jsPDF:        { unit: 'pt', format: 'a4', orientation: 'portrait' }
  };

  // gerar e salvar
  html2pdf().set(opt).from(elemento).save();
});
//IMPRIMIR
/*
document.getElementById('btn_imprimir').addEventListener('click', function(){
  const html = document.querySelector('.documento-wrap').outerHTML;
  const w = window.open('', '_blank');

  // pega todas as <style> e <link rel="stylesheet"> da página para preservar o visual
  const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
    .map(node => node.outerHTML).join('\n');

  w.document.write('<!doctype html><html><head><meta charset="utf-8"><title>Imprimir Ficha</title>');
  w.document.write(styles);
  // ajustes mínimos para impressão — mantém Times New Roman e margens
  w.document.write('<style>body{font-family:Times New Roman, serif;margin:20px;color:#000} table{border-collapse:collapse;width:100%;} table, th, td{border:1px solid #000;padding:6px;} </style>');
  w.document.write('</head><body>');
  w.document.write(html);
  w.document.write('</body></html>');
  w.document.close();
  w.focus();
  // pequeno delay para garantir carregamento de estilos
  setTimeout(()=>{ w.print(); }, 500);
});*/
function imprimirFicha() {
    window.print();
}



//[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]
// --- Atualização: Novo modelo de certidão (número de matrícula) ---
document.getElementById('campo_registro').addEventListener('input', function () {
  const valor = this.value.replace(/\D/g, ''); // remove não numéricos
  const label = document.querySelector('label[for="campo_registro"]');
  
  // Se quiser, atualiza o texto do label também
  if (valor.length > 12) {
    label.textContent = '9˚ Nº de Matrícula (Certidão nova)';
  } else {
    label.textContent = '9˚ Registro de Nascimento';
  }
});


//[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]
/* fim do script */


  /* Preenchimento automático dos campos de endereço e cidade */
document.getElementById('campo_unidade').addEventListener('change', ()=>{
  const unidade = document.getElementById('campo_unidade').value;
  const campoEndereco = document.getElementById('campo_endereco');
  const campoCidade = document.getElementById('campo_cidade_para');

  switch(unidade){
    case "E.M.E.I.E.F. MESTRE PACÍFICO":
      campoEndereco.value = "Rua São Francisco - S/N, Agrovila Igarapé-Açu, CEP: 68.250-000";
      campoCidade.value = "ÓBIDOS";
      break;
    case "E.M.E.I.E.F. JOÃO FERNANDES":
      campoEndereco.value = "Agrovila Andirobal, CEP 68.250-000";
      campoCidade.value = "ÓBIDOS";
      break;
    case "E.M.E.I.E.F. MARILDA CARVALHO":
      campoEndereco.value = "Agrovila Ipixuna, CEP 68.250-000";
      campoCidade.value = "ÓBIDOS";
      break;
    default:
      campoEndereco.value = "";
      campoCidade.value = "";
  }
});
// Atualiza label do campo 9 dinamicamente (opcional)
(function(){
  const campoReg = document.getElementById('campo_registro');
  const labelReg = Array.from(document.querySelectorAll('.field label')).find(l => l.textContent.includes('9˚'));
  if(!campoReg || !labelReg) return;
  campoReg.addEventListener('input', ()=> {
    const dig = campoReg.value.replace(/\D/g,'');
    if(dig.length > 12){
      labelReg.textContent = '9˚ Nº de Matrícula (Certidão nova)';
    } else {
      labelReg.textContent = '9˚ Registro de Nascimento';
    }
  });
})();
