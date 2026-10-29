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
    const telefone = document.querySelector("#tel");
    const responsaveis = document.querySelector("#pai_mae_aluno");
    const apoio_pedagogico = document.querySelector("#apoio_pedagogico");
    const laudo = document.querySelector("#laudo");
    const aluno_deficiente = document.querySelector("#aluno_deficiente");
    const def_cegueira = document.querySelector("#cegueira");
    const def_auditiva = document.querySelector("#auditiva");
    const def_intelectual = document.querySelector("#intelectual");
    const def_baixa_visao = document.querySelector("#baixa_visao");
    const def_surdocegueira = document.querySelector("#surdocegueira");
    const def_multipla = document.querySelector("#multipla");
    const def_surdez = document.querySelector("#surdez");
    const def_fisica = document.querySelector("#fisica");
    const autismo = document.querySelector("#autismo");
    const reth = document.querySelector("#reth");
    const asperger = document.querySelector("#asperger");
    const desintegrativo = document.querySelector("#desintegrativo");
    const altas_habilidades = document.querySelector("#alt_hab");
    const bpc = document.querySelector("#bpc");
    const pbf = document.querySelector("#pbf");

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

//:::::NATURALIDADE, CIDADE E ESTADO::::::::::::::::::::::::::::::::
    naturalidade.innerHTML = `Naturalidade: Localidade: __<span class="res">${inputs[5].value}</span>_____________________ Município/Cidade: __<span class="res">${selects[2].value}</span>______________________ Estado:__<span class="res">${selects[3].value}</span>__________________`

//:::::ENDEREÇO, NÚMERO E BAIRRO:::::::::::::::::::::::::::::::::::::
    endereco.innerHTML = `Endereço:_<span class="res">${inputs[6].value}</span>______________________ Nº: _____ Bairro: __<span class="res">${inputs[7].value}</span>______________`

//:::::TELEFONE E NIS:::::::::::::::::::::::::::::::::::::::::::::::
    telefone.innerHTML = `Telefone: __<span class="res">${inputs[8].value}</span>_______ NIS: __<span class="res">${inputs[9].value}</span>______`

//:::::DEFICIÊNCIA:::::::::::::::::::::::::::::::::::::::::::::::::
//campo de atendimento especializado
    if(inputs[10].checked === true){
        //atendimento especializado marcado em SIM
        apoio_pedagogico.innerHTML = `Necessita de Atendimento Especializado(Apoio pedagógico)? SIM (<span class="res">X</span>) NÃO ( )`;
    }else if(inputs[11].checked === true){
        //atendimento especializado marcado em NÃO
        apoio_pedagogico.innerHTML = `Necessita de Atendimento Especializado(Apoio pedagógico)? SIM ( ) NÃO (<span class="res">X</span>)`;
    }

    //campo de informação de laudo médico
    if(inputs[12].checked === true){
        laudo.innerHTML = `O aluno possui laudo médico? SIM (<span class="res">X</span>) NÃO ( )`
    }else if(inputs[13].checked === true){
        laudo.innerHTML = `O aluno possui laudo médico? SIM ( ) NÃO (<span class="res">X</span>)`
    }

    //campo de informar se o aluno tem deficiencia
    if(inputs[14].checked === true){
        aluno_deficiente.innerHTML = `Aluno com deficiência? SIM (<span class="res">X</span>) NÃO ( )`
    }else if(inputs[15].checked === true){
        aluno_deficiente.innerHTML = `Aluno com deficiência? SIM ( ) NÃO (<span class="res">X</span>)`
    }

//::::::DEFICIÊNCIA DO ALUNO::::::::::::::::::::::::::::::::::::::::::
    inputs[16].checked
    ? def_cegueira.innerHTML = `(<span class="res">X</span>)Cegueira`
    : def_cegueira.innerHTML = `( )Cegueira`
    
    inputs[17].checked
    ? def_auditiva.innerHTML = `(<span class="res">X</span>)Deficiência Auditiva`
    : def_auditiva.innerHTML = `( )Deficiência Auditiva`

    inputs[18].checked
    ? def_intelectual.innerHTML = `(<span class="res">X</span>)Deficiência Intelectual`
    : def_intelectual.innerHTML = `( )Deficiência Intelectual`

    inputs[19].checked
    ? def_baixa_visao.innerHTML = `(<span class="res">X</span>)Baixa Visão`
    : def_baixa_visao.innerHTML = `( )Baixa Visão`

    inputs[20].checked
    ? def_surdocegueira.innerHTML = `(<span class="res">X</span>)Surdocegueira`
    : def_surdocegueira.innerHTML = `( )Surdocegueira`

    inputs[21].checked
    ? def_multipla.innerHTML = `(<span class="res">X</span>)Deficiência Multipla`
    : def_multipla.innerHTML = `( )Deficiência Multipla`

    inputs[22].checked
    ? def_surdez.innerHTML = `(<span class="res">X</span>)Surdez`
    : def_surdez.innerHTML = `( )Surdez`

    inputs[23].checked
    ? def_fisica.innerHTML = `(<span class="res">X</span>)Deficiência Física`
    : def_fisica.innerHTML = `( )Deficiência Física`

//:::::::TRANSTORNOS::::::::::::::::::::::::::::::::::::::::::::::
    inputs[24].checked
    ? autismo.innerHTML = `(<span class="res">X</span>)Autismo Infantil`
    : autismo.innerHTML = `( )Autismo Infantil`

    inputs[25].checked
    ? reth.innerHTML = `(<span class="res">X</span>)Síndrome de Reth`
    : reth.innerHTML = `( )Síndrome de Reth`

    inputs[26].checked
    ? asperger.innerHTML = `(<span class="res">X</span>)Síndrome de Asperger`
    : asperger.innerHTML = `( )Síndrome de Asperger`

    inputs[27].checked
    ? desintegrativo.innerHTML = `(<span class="res">X</span>)Transtorno Desintegrativo da Infância`
    : desintegrativo.innerHTML = `( )Transtorno Desintegrativo da Infância`

    inputs[28].checked
    ? altas_habilidades.innerHTML = `(<span class="res">X</span>)Altas Habilidades/Superdotado`
    : altas_habilidades.innerHTML = `( )Altas Habilidades/Superdotado`


inputs.forEach(function(input, i){
    alert(`índice: ${i}, campo:${input.name}, valor: ${input.value}`)
})
//::::::BENEFÍCIO SOCIAL::::::::::::::::::::::::::::::::::::::::::::
    if(inputs[29].checked === true){
        bpc.innerHTML = `É atendido(a) pelo BPC(Benefício de Prestação Continuada)? SIM (<span class="res">X</span>) NÃO ( )`;
    }else if(inputs[30].checked === true){
        bpc.innerHTML = `É atendido(a) pelo BPC(Benefício de Prestação Continuada)? SIM ( ) NÃO (<span class="res">X</span>)`;
    }

    if(inputs[31].checked === true){
        pbf.innerHTML = `É atendido(a) pelo PBF(Programa Bolsa Família)? SIM (<span class="res">X</span>) NÃO ( )`;
    }else if(inputs[32].checked === true){
        pbf.innerHTML = `É atendido(a) pelo PBF(Programa Bolsa Família)? SIM ( ) NÃO (<span class="res">X</span>)`;
    }

//::::::PAI, MÃE E RESPONSÁVEIS:::::::::::::::::::::::::::::::::::::
    responsaveis.innerHTML = `Nome do Pai: __<span class="res">${inputs[33].value}</span>___________________________________________________________________________________ <br>
    Nome da Mãe:     ___<span class="res">${inputs[34].value}</span>_____________________________________________________________________________ <br>
    Nome do Responsável:___<span class="res">${inputs[35].value}</span>______________________________________________________________________________`
    

    
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

inputs[0].addEventListener("blur", function(){
    inputs[0].value = inputs[0].value.toUpperCase();
})