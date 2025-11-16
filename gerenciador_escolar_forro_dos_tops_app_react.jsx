/*
React single-file app: Gerenciador Escolar
- Exporta um componente React padrão
- UI com Tailwind classes
- Funcionalidades implementadas (básicas, prontas para estender):
  * Cadastro de funcionários (CRUD) com dados pessoais
  * Observações por funcionário (usadas para preencher a folha de pagamento)
  * Relatórios estatísticos simples (contagem, média de observações por funcionário)
  * Modelos de documentos padronizados com placeholders e geração de arquivo para download
  * Persistência via localStorage

Instruções: cole este arquivo em um projeto React (Vite/Create React App) que já tenha Tailwind configurado.
Dependências opcionais que podem ser adicionadas: recharts (para gráficos), date-fns (para datas), jsPDF (para PDF mais complexo).
*/

import React, { useEffect, useState } from "react";

const LOCAL_KEY = "gerenciador_escolar_v1";

const defaultTemplates = [
  {
    id: "requerimento_ferias",
    name: "Requerimento de Férias",
    content:
      "Eu, {{nome}}, matrícula {{matricula}}, lotado(a) em {{setor}}, venho por meio deste requerer minhas férias no período de {{periodo}}. Ass: {{nome}}",
  },
  {
    id: "decl_orig",
    name: "Declaração Simples",
    content:
      "Declaro para os devidos fins que {{nome}}, matrícula {{matricula}}, exerce a função de {{cargo}} nesta instituição. Emissão: {{data}}",
  },
];

function uid(prefix = "id") {
  return prefix + "_" + Math.random().toString(36).slice(2, 9);
}

export default function GerenciadorEscolarApp() {
  const [state, setState] = useState(() => {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (raw) try { return JSON.parse(raw); } catch(e){}
    return {
      funcionarios: [],
      templates: defaultTemplates,
    };
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(state));
  }, [state]);

  // --- Employee CRUD ---
  function addFuncionario(data) {
    const f = { id: uid('f'), observations: [], ...data };
    setState(prev => ({ ...prev, funcionarios: [...prev.funcionarios, f] }));
  }

  function updateFuncionario(id, patch) {
    setState(prev => ({ ...prev, funcionarios: prev.funcionarios.map(f => f.id === id ? { ...f, ...patch } : f) }));
  }

  function removeFuncionario(id) {
    if(!confirm('Remover funcionário? Essa ação não pode ser desfeita.')) return;
    setState(prev => ({ ...prev, funcionarios: prev.funcionarios.filter(f => f.id !== id) }));
  }

  // observations: used for payroll notes per month
  function addObservacao(funcId, observacao) {
    const obs = { id: uid('o'), texto: observacao.texto, mes: observacao.mes || mesAtual(), criadoEm: new Date().toISOString() };
    setState(prev => ({
      ...prev,
      funcionarios: prev.funcionarios.map(f => f.id === funcId ? { ...f, observations: [...f.observations, obs] } : f)
    }));
  }

  function removeObservacao(funcId, obsId) {
    setState(prev => ({
      ...prev,
      funcionarios: prev.funcionarios.map(f => f.id === funcId ? { ...f, observations: f.observations.filter(o => o.id !== obsId) } : f)
    }));
  }

  // --- Templates ---
  function createTemplate(t) {
    const tpl = { id: uid('t'), ...t };
    setState(prev => ({ ...prev, templates: [...prev.templates, tpl] }));
  }

  function fillTemplate(templateContent, funcionario, extras = {}) {
    // replace placeholders like {{nome}} with data
    let text = templateContent;
    const map = {
      nome: funcionario.nome || '',
      matricula: funcionario.matricula || '',
      setor: funcionario.setor || '',
      cargo: funcionario.cargo || '',
      data: extras.data || new Date().toLocaleDateString(),
      periodo: extras.periodo || '',
      ...extras
    };
    Object.keys(map).forEach(k => {
      const re = new RegExp('{{\\s*' + k + '\\s*}}', 'g');
      text = text.replace(re, map[k]);
    });
    return text;
  }

  function downloadAsDocx(filename, textContent) {
    const blob = new Blob([textContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  // --- Reports ---
  function gerarRelatorioSimples() {
    const total = state.funcionarios.length;
    const comObs = state.funcionarios.filter(f => f.observations && f.observations.length > 0).length;
    const mediaObs = total === 0 ? 0 : state.funcionarios.reduce((s,f)=> s + (f.observations?f.observations.length:0), 0) / total;
    return { total, comObs, mediaObs: mediaObs.toFixed(2) };
  }

  // --- Helpers ---
  function mesAtual() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
  }

  // --- UI state for forms ---
  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-bold">Gerenciador Escolar</h1>
          <p className="text-sm text-gray-600">Cadastre funcionários, registre observações para a folha, gere relatórios e documentos padronizados.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white p-4 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-2">Funcionários</h2>
            <FuncionarioForm onAdd={addFuncionario} />
            <FuncionariosList
              funcionarios={state.funcionarios}
              onRemove={removeFuncionario}
              onUpdate={updateFuncionario}
              onAddObs={addObservacao}
              onRemoveObs={removeObservacao}
              templates={state.templates}
              onDownload={downloadAsDocx}
              onFillTemplate={fillTemplate}
            />
          </div>

          <aside className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-2">Relatórios</h2>
            <RelatorioPanel rel={gerarRelatorioSimples()} funcionarios={state.funcionarios} />

            <hr className="my-4" />

            <h3 className="font-medium">Modelos de Documentos</h3>
            <TemplatesPanel templates={state.templates} onCreate={createTemplate} />

          </aside>
        </div>

        <footer className="mt-6 text-xs text-gray-500">Dados salvos no armazenamento local do navegador. Ideal para testes — para produção conecte a uma API com banco de dados.</footer>
      </div>
    </div>
  );
}

function FuncionarioForm({ onAdd }) {
  const [form, setForm] = useState({ nome: '', matricula: '', cargo: '', setor: '', contato: '' });
  function submit(e) {
    e.preventDefault();
    if (!form.nome) { alert('Nome é obrigatório'); return; }
    onAdd(form);
    setForm({ nome: '', matricula: '', cargo: '', setor: '', contato: '' });
  }
  return (
    <form onSubmit={submit} className="mb-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <input value={form.nome} onChange={e=>setForm({...form,nome:e.target.value})} placeholder="Nome" className="p-2 border rounded" />
        <input value={form.matricula} onChange={e=>setForm({...form,matricula:e.target.value})} placeholder="Matrícula" className="p-2 border rounded" />
        <input value={form.cargo} onChange={e=>setForm({...form,cargo:e.target.value})} placeholder="Cargo" className="p-2 border rounded" />
        <input value={form.setor} onChange={e=>setForm({...form,setor:e.target.value})} placeholder="Setor" className="p-2 border rounded" />
        <input value={form.contato} onChange={e=>setForm({...form,contato:e.target.value})} placeholder="Contato" className="p-2 border rounded" />
        <button className="bg-indigo-600 text-white rounded px-4 py-2">Adicionar</button>
      </div>
    </form>
  );
}

function FuncionariosList({ funcionarios, onRemove, onUpdate, onAddObs, onRemoveObs, templates, onDownload, onFillTemplate }) {
  const [selected, setSelected] = useState(null);
  return (
    <div>
      {funcionarios.length === 0 && <p className="text-gray-500">Nenhum funcionário cadastrado.</p>}
      <ul className="space-y-3">
        {funcionarios.map(f => (
          <li key={f.id} className="p-3 border rounded bg-gray-50">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-semibold">{f.nome} <span className="text-sm text-gray-500">({f.matricula})</span></div>
                <div className="text-sm text-gray-600">{f.cargo} — {f.setor} — {f.contato}</div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={()=>setSelected(selected === f.id ? null : f.id)} className="text-sm px-2 py-1 border rounded">Abrir</button>
                <button onClick={()=>{
                  const novoNome = prompt('Editar nome', f.nome);
                  if(novoNome) onUpdate(f.id, { nome: novoNome });
                }} className="text-sm px-2 py-1 border rounded">Editar</button>
                <button onClick={()=>onRemove(f.id)} className="text-sm px-2 py-1 border rounded text-red-600">Remover</button>
              </div>
            </div>

            {selected === f.id && (
              <div className="mt-3 bg-white p-3 rounded">
                <ObservacoesPanel funcionario={f} onAddObs={onAddObs} onRemoveObs={onRemoveObs} />

                <div className="mt-3">
                  <h4 className="font-medium">Gerar documento</h4>
                  <p className="text-sm text-gray-600 mb-2">Escolha um modelo e gere um arquivo para o funcionário.</p>
                  <div className="flex gap-2 flex-wrap">
                    {templates.map(tpl => (
                      <button key={tpl.id} onClick={() => {
                        const filled = onFillTemplate(tpl.content, f, { data: new Date().toLocaleDateString() });
                        onDownload(`${tpl.name.replace(/\s+/g,'_')}_${f.matricula||f.id}.doc`, filled);
                      }} className="px-3 py-1 border rounded text-sm">{tpl.name}</button>
                    ))}
                  </div>
                </div>

              </div>
            )}

          </li>
        ))}
      </ul>
    </div>
  );
}

function ObservacoesPanel({ funcionario, onAddObs, onRemoveObs }) {
  const [texto, setTexto] = useState('');
  const [mes, setMes] = useState(mesAtual());
  function enviar(e) {
    e && e.preventDefault();
    if(!texto) return alert('Digite a observação');
    onAddObs(funcionario.id, { texto, mes });
    setTexto('');
  }
  return (
    <div>
      <h4 className="font-medium">Observações para folha</h4>
      <form onSubmit={enviar} className="flex gap-2 mt-2">
        <input value={mes} onChange={e=>setMes(e.target.value)} className="p-2 border rounded text-sm" />
        <input value={texto} onChange={e=>setTexto(e.target.value)} placeholder="Ex: 3 faltas justificadas" className="flex-1 p-2 border rounded" />
        <button className="px-3 py-1 bg-green-600 text-white rounded text-sm">Adicionar</button>
      </form>

      <ul className="mt-3 space-y-2">
        {(funcionario.observations||[]).map(o => (
          <li key={o.id} className="text-sm flex justify-between bg-gray-100 p-2 rounded">
            <div>
              <div className="font-medium">{o.mes}</div>
              <div className="text-gray-700">{o.texto}</div>
              <div className="text-xs text-gray-500">{new Date(o.criadoEm).toLocaleString()}</div>
            </div>
            <div className="flex flex-col gap-1">
              <button onClick={()=>navigator.clipboard?.writeText(o.texto)} className="text-xs px-2 py-1 border rounded">Copiar</button>
              <button onClick={()=>onRemoveObs(funcionario.id, o.id)} className="text-xs px-2 py-1 border rounded text-red-600">Remover</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function RelatorioPanel({ rel, funcionarios }) {
  return (
    <div>
      <div className="text-sm">Total de funcionários: <strong>{rel.total}</strong></div>
      <div className="text-sm">Com observações: <strong>{rel.comObs}</strong></div>
      <div className="text-sm">Média de observações por funcionário: <strong>{rel.mediaObs}</strong></div>

      <div className="mt-3">
        <h4 className="font-medium">Exportar lista</h4>
        <button className="mt-2 px-3 py-1 border rounded" onClick={() => exportCSV(funcionarios)}>Exportar CSV</button>
      </div>
    </div>
  );
}

function exportCSV(funcionarios) {
  const header = ['nome','matricula','cargo','setor','contato','num_observacoes'];
  const rows = funcionarios.map(f => [f.nome,f.matricula,f.cargo,f.setor,f.contato,(f.observations||[]).length]);
  const csv = [header, ...rows].map(r=>r.map(cell => '"'+String(cell||'').replace(/"/g,'""')+'"').join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'funcionarios.csv'; a.click(); URL.revokeObjectURL(url);
}

function TemplatesPanel({ templates, onCreate }) {
  const [form, setForm] = useState({ name: '', content: '' });
  function submit(e) {
    e && e.preventDefault();
    if(!form.name || !form.content) return alert('Nome e conteúdo são obrigatórios');
    onCreate(form);
    setForm({ name: '', content: '' });
  }
  return (
    <div>
      <ul className="space-y-2 mb-3 text-sm">
        {templates.map(t => (
          <li key={t.id} className="p-2 border rounded">{t.name}</li>
        ))}
      </ul>

      <form onSubmit={submit} className="space-y-2">
        <input placeholder="Nome do modelo" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="w-full p-2 border rounded text-sm" />
        <textarea placeholder="Conteúdo com placeholders, ex: {{nome}}" value={form.content} onChange={e=>setForm({...form,content:e.target.value})} className="w-full p-2 border rounded text-sm" rows={4} />
        <div className="flex justify-end">
          <button className="px-3 py-1 bg-indigo-600 text-white rounded text-sm">Adicionar Modelo</button>
        </div>
      </form>
    </div>
  );
}

// utility: current month string
function mesAtual(){ const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`; }
