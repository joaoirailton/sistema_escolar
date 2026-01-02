let funcionarios = JSON.parse(localStorage.getItem("funcionarios")) || [];
const tabela = document.getElementById("tabela");

function atualizarTabela() {
tabela.innerHTML = "";
funcionarios.forEach(f => {
tabela.innerHTML += `
<tr>
<td>${f.nome}</td>
<td>${f.matricula || ""}</td>
<td>${f.cargo || ""}</td>
<td>${f.escola || ""}</td>
</tr>`;
});
}

document.getElementById("formFuncionario").addEventListener("submit", e => {
e.preventDefault();
const dados = Object.fromEntries(new FormData(e.target));
funcionarios.push(dados);
localStorage.setItem("funcionarios", JSON.stringify(funcionarios));
e.target.reset();
atualizarTabela();
});

function exportarCSV() {
if (!funcionarios.length) return;
let csv = Object.keys(funcionarios[0]).join(";") + "\n";
funcionarios.forEach(f => {
csv += Object.values(f).join(";") + "\n";
});
const blob = new Blob([csv], { type: "text/csv" });
const link = document.createElement("a");
link.href = URL.createObjectURL(blob);
link.download = "funcionarios.csv";
link.click();
}

atualizarTabela();