/*CAPTURA DE CAMPOS DO FORMULÁRIO*/
const botao_ok = document.querySelector("#btn-ok");
const botao_cancelar = document.querySelector("#btn-cancelar");
const botao_limpar = document.querySelector("#btn-limpar");
const botao_preencher = document.querySelector("#btn_preencher");
const fundo_form = document.querySelector("#fundo_form");
const form = document.querySelector("#formulario");


let escola = document.querySelector("#unidade");
let nome_aluno = document.querySelector("#aluno");

/*:::::::::::::::BOTÃO OK:::::::::::::::::::::::::::::::::::::::::*/
botao_ok.addEventListener("click", function(){
    const inputs = document.querySelectorAll("#formulario input");
    const selects = document.querySelectorAll("#formulario select");
    const nome_aluno = document.querySelector("#nome_aluno");
    const sexo_aluno = document.querySelector("#sexo_aluno");
    const escola = document.querySelector("#escola");
    const naturalidade = document.querySelector("#naturalidade");
    const endereco = document.querySelector("#end");

    //:::::::FORMATA DATA DE NASCIMENTO:::::::::::::::::::::::::
    const partes = inputs[3].value.split("-");
    const data_nasci = ` ${partes[2]} / ${partes[1]} / ${partes[0]}   `

//::::::::::::PREENCHE NOME, SEXO, COR, NASCIMENTO E NACIONALIDADE::

    escola.innerHTML = `Unidade Escolar: <span class="res">${selects[0].value}</span>`
    nome_aluno.innerHTML = `Nome do Aluno: <span class="res">${inputs[0].value}</span>`;
    if(inputs[1].checked === true){
        sexo_aluno.innerHTML=`Sexo: Masc.:(<span class="res">X</span>) Fem.:( ) Cor: _<span class="res">${selects[1].value}</span>____________ Data de Nascimento:  <span class="res">${data_nasci}</span> Nacionalidade: _____<span class="res">${inputs[4].value}</span>_________________________`;
    }else if(inputs[2].checked === true){
        sexo_aluno.innerHTML=`Sexo: Masc.:( ) Fem.:(<span class="res">X</span>) Cor: _<span class="res">${selects[1].value}</span>____________ Data de Nascimento:  <span class="res">${data_nasci}</span> Nacionalidade: _____<span class="res">${inputs[4].value}</span>_________________________`;
    }
    naturalidade.innerHTML = `Naturalidade: Localidade: __<span class="res">${inputs[5].value}</span>_____________________ Município/Cidade: __<span class="res">${selects[2].value}</span>______________________ Estado:__<span class="res">${selects[3].value}</span>__________________`
    endereco.innerHTML = `Endereço:_<span class="res">${inputs[6].value}</span>______________________ Nº: _____ Bairro: __<span class="res">${inputs[7].value}</span>______________`



    
    

    
})

/*:::::::::::::BOTÃO PREENCHER FORMULÁRIO:::::::::::::::::::::::::*/
botao_preencher.addEventListener("click", function(){
    fundo_form.style.display = "block";
})

//:::::::::::::BOTÃO CANCELAR:::::::::::::::::::::::::::::::::::::::
botao_cancelar.addEventListener("click", function(){
    fundo_form.style.display = "none"
})
fundo_form.addEventListener("click", function(){
    botao_cancelar.click();
})
form.addEventListener("click", function(){
    event.stopPropagation();
})