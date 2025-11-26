// Referências aos campos do SIDEBAR
const campoRegistro = document.getElementById("campo_registro");
const campoLivro = document.getElementById("campo_livro");
const campoFolha = document.getElementById("campo_folha");

// Referências aos rótulos do SIDEBAR
const labelRegistro = document.querySelector('label[for="campo_registro"]') || document.querySelector('label:nth-of-type(9)');
const labelLivro = document.querySelector('label[for="campo_livro"]');
const labelFolha = document.querySelector('label[for="campo_folha"]');

// Referências à TABELA DE IDENTIFICAÇÃO DO ALUNO
const tabelaRegistro = document.getElementById("td_registro");  // onde aparece o registro de nascimento
const tabelaLivro = document.getElementById("td_livro");        // onde aparece o livro
const tabelaFolhaLabel = document.getElementById("th_folha");   // título "Folha"
const tabelaFolha = document.getElementById("td_folha");        // conteúdo da folha

// Função principal: detecta certidão antiga ou nova
campoRegistro.addEventListener("input", function () {

    let valor = campoRegistro.value.trim();

    // Se NÃO houver valor, resetar tudo
    if (valor === "") {
        resetarParaCertidaoAntiga();
        return;
    }

    // Se DIGITOS > 11 → certidão nova (número de matrícula)
    if (valor.length > 11) {
        aplicarCertidaoNova(valor);
    } else {
        aplicarCertidaoAntiga();
    }
});


// -------------------------------------------------------
//          FUNÇÕES DE COMPORTAMENTO
// -------------------------------------------------------

// Certidão ANTIGA (campos separados: registro, livro, folha)
function aplicarCertidaoAntiga() {

    // Sidebar volta ao normal
    labelRegistro.textContent = "9º Registro de Nascimento";
    campoLivro.disabled = false;
    campoFolha.disabled = false;

    // Tabela de identificação volta ao padrão
    tabelaRegistro.textContent = campoRegistro.value || "-";
    tabelaLivro.textContent = campoLivro.value || "-";

    tabelaFolhaLabel.textContent = "Folha";
    tabelaFolha.textContent = campoFolha.value || "-";
}


// Certidão NOVA (número único de matrícula)
function aplicarCertidaoNova(numeroMatricula) {

    // Sidebar atualiza rótulos
    labelRegistro.textContent = "Número de Matrícula (Registro Civil)";
    campoLivro.disabled = true;
    campoFolha.disabled = true;

    // Limpa valores dos campos desabilitados
    campoLivro.value = "";
    campoFolha.value = "";

    // Tabela de identificação atualiza formatação
    tabelaRegistro.textContent = "-";
    tabelaLivro.textContent = "-";

    tabelaFolhaLabel.textContent = "Número de Matrícula / Registro Civil";
    tabelaFolha.textContent = numeroMatricula;
}


// Voltar completamente ao modo antigo
function resetarParaCertidaoAntiga() {

    labelRegistro.textContent = "9º Registro de Nascimento";

    campoLivro.disabled = false;
    campoFolha.disabled = false;

    tabelaFolhaLabel.textContent = "Folha";

    tabelaRegistro.textContent = "-";
    tabelaLivro.textContent = "-";
    tabelaFolha.textContent = "-";
}
