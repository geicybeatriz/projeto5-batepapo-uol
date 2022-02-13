let usuario = "";
let reserva = "";

iniciarTela();

function iniciarTela(){
    const telaInicial = document.querySelector(".container");
    telaInicial.innerHTML = `
         <main class="tela-de-entrada">
            <section class="logo-tela-inicial">
                <img src="./images/logo-tela-entrada.png" alt="logo uol">
            </section>
            <section>
                <div class="entrada">
                    <input type="text" name="" id="nomeDeUsuario" placeholder="Digite seu nome" data-identifier="enter-name">
                    <button type="button" class="botao-entrar" onclick= "entrarNaSala()" data-identifier="start">Entrar</button>
                </div>
            </section>
        </main>
    `;
    envioComEnter();
}

function entrarNaSala(){
    usuario = document.getElementById("nomeDeUsuario").value;

    const promessa = axios.post("https://mock-api.driven.com.br/api/v4/uol/participants", {name:usuario});
    promessa.then(entrarNoChat);
    promessa.catch(tratarErro);
    carregando();
}

function entrarNoChat(){
     let telaDoChat = document.querySelector("body");
     telaDoChat.innerHTML = `
        <main class="tela-de-conversas">
            <header class="topo-pagina">
                <img src="./images/logo-bp-uol.png" alt="logo bate papo logo-bp-uol" class="logo-uol">
                <ion-icon class="icone-topo" name="people-sharp" onclick="abrirMenu()"></ion-icon>
            </header>
                        
            <section class="conteudo-chat"></section>

            <footer>
                <div class="rodape">
                    <input type="text" name="" id="mensagemTexto" placeholder="Escreva aqui...">
                    <button type="button" onclick="enviarMensagens()" data-identifier="send-message"><ion-icon name="paper-plane-outline"></ion-icon></button>
                </div>
                <div class="reservada"></div>
            </footer>
        </main>
        <main class= "tela-participantes escondido">
            <div class="escura" onclick="abrirMenu()"></div>
            <aside>
                <section class="topo">Escolha um contato</br> para enviar mensagem:</section>
                <section class="participantes">
                </section>

                <section class="meio">Escolha a visibilidade</section>

                <section class="visibilidade">
                    <article class="participantes-ativos" data-identifier="visibility">
                        <div class="icone-usuario">
                            <ion-icon name="lock-open"></ion-icon>
                            <p>Público</p>
                        </div>
                        <div class="check selecionado">
                            <ion-icon name="checkmark-sharp"></ion-icon>
                        </div>
                    </article>
                    <article class="participantes-ativos" data-identifier="visibility">
                        <div class="icone-usuario">
                            <ion-icon name="lock-closed"></ion-icon>
                            <p>Reservadamente</p>
                        </div>
                        <div class="check">
                            <ion-icon name="checkmark-sharp"></ion-icon>
                        </div>
                    </article>
                </section>
            </aside>
        </main>
    `; 

    envioComEnter();
    setInterval(manterConexao, 5000);
    buscarMensagens();
    setInterval(buscarMensagens, 3000);
    buscarParticipantes();
    setInterval(buscarParticipantes, 10000);
   
}

function tratarErro(erro){
    const reiniciarTela = document.querySelector(".container");
    reiniciarTela.innerHTML = `
         <main class="tela-de-entrada">
            <section class="logo-tela-inicial">
                <img src="./images/logo-tela-entrada.png" alt="logo uol">
            </section>
            <section>
                <div class="entrada">
                    <input type="text" name="" id="nomeDeUsuario" placeholder="Digite seu nome">
                    <p class="alert">Este nome de usuário já existe.Tente novamente. </p>
                    <button type="button" class="botao-entrar" onclick= "entrarNaSala()">Entrar</button>
                </div>
            </section>
        </main>
    `;          
}

function carregando(){
    let carregamento = document.querySelector(".container");
    carregamento.innerHTML = `
        <section class="tela-carregamento">
            <img src="./images/Dual Ball-1s-200px.gif" alt="carregando">
            <p>Carregando...</p>
        </section>
    `;
}

function manterConexao(){
    const promessa = axios.post("https://mock-api.driven.com.br/api/v4/uol/status", {name:usuario});
}

function buscarMensagens(){
    const promise = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");
    promise.then(renderizarMensagens);
}

function renderizarMensagens(resposta){
    let conteudoChat = document.querySelector(".conteudo-chat");
    conteudoChat.innerHTML = "";

    let mensagens = resposta.data;
    for(let i = 0; i < mensagens.length; i++){
        let de = mensagens[i].from;
        let para = mensagens[i].to;
        let texto = mensagens[i].text;
        let tipo = mensagens[i].type;
        let hora = mensagens[i].time;
        if (tipo === "status"){
            conteudoChat.innerHTML += `
            <article class="mensagem mensagem-status-usuario" data-identifier="message">
                <div><em>(${hora})</em> <strong>${de}</strong> ${texto}</div>
            </article> `;
        } else if ((tipo === "message") && (para === "Todos")){
            conteudoChat.innerHTML += `
            <article class="mensagem mensagem-normal" data-identifier="message">
                <div><em>(${hora})</em> <strong>${de}</strong> para <strong>${para}</strong>: ${texto}  </div>
            </article>
            `;
        } else if ((tipo === "private_message") && ((para === usuario) || (de === usuario))){
            conteudoChat.innerHTML += `
            <article class="mensagem mensagem-reservada" data-identifier="message">
                <div><em>(${hora})</em> <strong>${de}</strong> reservadamente para <strong>${para}</strong>: ${texto}  </div>
            </article>
            `;
        }
    }
    rolarMensagens();
    envioComEnter();
}

function rolarMensagens(){
    let ultimaMensagem = document.querySelector("section article:last-child");
    ultimaMensagem.scrollIntoView();
}

function enviarMensagens(){

    let mensagemEnviada = document.getElementById("mensagemTexto").value;
    let estruturaMensagem = {
        from:usuario,
        to: reserva,
        text: mensagemEnviada,
        type:"message"    
    };

    if (reserva !== "Todos"){
        estruturaMensagem.type = "private_message";
    }

    let promessa = axios.post("https://mock-api.driven.com.br/api/v4/uol/messages",estruturaMensagem);
   
    document.getElementById("mensagemTexto").value = "";

    promessa.catch(() => {window.location.reload()});

}


function envioComEnter() {
    const enviar = document.querySelector("input");
    enviar.onkeydown = (evento) => {
        if(evento.code === "Enter"){
            if(enviar.id === "nomeDeUsuario"){
                entrarNaSala();
            } else if(enviar.id === "mensagemTexto") {
                enviarMensagens();
            }
        }
    }
}

function abrirMenu(){
     document.querySelector(".tela-participantes").classList.toggle("escondido");
}

function buscarParticipantes(){
    let promessa = axios.get("https://mock-api.driven.com.br/api/v4/uol/participants");
    promessa.then(renderizarContatos);
}

function renderizarContatos(resposta){
    let arrayDeParticipantes = resposta.data;

    let participantes = document.querySelector(".participantes");
    participantes.innerHTML = `
    <article class="participantes-ativos" onclick="selecionarContato(this)" data-identifier="participant">
        <div class="icone-usuario">
            <ion-icon name="people-sharp"></ion-icon>
            <p>Todos</p>
        </div>
        <div class="check selecionado">
            <ion-icon name="checkmark-sharp"></ion-icon>
        </div>
    </article>
    `;

    for(let i = 0; i < arrayDeParticipantes.length; i++){
        participantes.innerHTML += `
        <article class="participantes-ativos" onclick="selecionarContato(this)" data-identifier="participant">
            <div class="icone-usuario">
                <ion-icon name="person-circle-sharp"></ion-icon>
                <p class="usuarios-ativos">${arrayDeParticipantes[i].name}</p>
            </div>
            <div class="check ">
                <ion-icon name="checkmark-sharp"></ion-icon>
            </div>
        </article>
        `;
    }
    checarFiltro(resposta);
}

function selecionarContato(participante){
    const participanteSelecionado = document.querySelector(".participantes .selecionado");
    const privacidade = document.querySelector(".visibilidade .selecionado");
   
    let contatoCheck = participante.childNodes[3];
    let iconPublico = document.querySelector(".visibilidade").childNodes[1].childNodes[3];
    let iconReservado = document.querySelector(".visibilidade").childNodes[3].childNodes[3];
    let textoDentro = participante.childNodes[1].childNodes[3].innerText;
   
    if((participanteSelecionado !== null) && (textoDentro !== usuario)){
        participanteSelecionado.classList.remove("selecionado");
        contatoCheck.classList.add("selecionado");
        reserva = textoDentro;

    }
    if((textoDentro === "Todos") && (iconReservado !== null) && (textoDentro !== usuario)){
        iconReservado.classList.remove("selecionado");
        iconPublico.classList.add("selecionado");
        limparMensagemPrivada();
    } else if((textoDentro !== "Todos") && (iconPublico !== null) && (textoDentro !== usuario)){
        iconPublico.classList.remove("selecionado");
        iconReservado.classList.add("selecionado");
        alterarMensagemPrivada();
        buscarMensagens();

    }
}
function condicaoDoFiltro(participante){
    if(participante.name === reserva){
        return true;
    }
}
function checarFiltro(resposta){
    let indiceDoReserva = resposta.data.findIndex(condicaoDoFiltro);
    let elementoSelecionado = document.querySelector(".participantes").childNodes[(2*indiceDoReserva)+3];
    let todosSelecionado = document.querySelector(".participantes").childNodes[1];

    if(indiceDoReserva === -1){
        selecionarContato(todosSelecionado);
    } else {
        selecionarContato(elementoSelecionado);
    }
}
function alterarMensagemPrivada(){
    document.querySelector(".reservada").innerHTML = `
    Enviando para ${reserva} (reservadamente)
    `;
}
function limparMensagemPrivada(){
    document.querySelector(".reservada").innerHTML = "";
}



