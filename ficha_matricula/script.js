/*CAPTURA DE CAMPOS DO FORMULÁRIO*/
const botao_ok = document.querySelector("#btn-ok");
const botao_cancelar = document.querySelector("#btn-cacelar");
const botao_limpar = document.querySelector("#btn-limpar");

let escola = document.querySelector("#unidade");
let nome_aluno = document.querySelector("#aluno");
let sexo = document.querySelector('input[name="sexo"]:checked');

botao_ok.addEventListener("click", function(){
    alert(`Você selecionou a escola: ${sexo.value}`)
    })