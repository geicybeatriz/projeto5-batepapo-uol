let usuario = "";

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
                    <input type="text" name="" id="nomeDeUsuario" placeholder="Digite seu nome">
                    <button type="button" class="botao-entrar" onclick= "entrarNaSala()">Entrar</button>
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
                <ion-icon class="icone-topo" name="people-sharp"></ion-icon>
            </header>
                        
            <section class="conteudo-chat"></section>

            <footer>
                <div class="rodape">
                    <input type="text" name="" id="mensagemTexto" placeholder="Escreva aqui...">
                    <button type="button" onclick="enviarMensagens()"><ion-icon name="paper-plane-outline"></ion-icon></button>
                </div>
            </footer>
        </main>
    `; 

    setInterval(manterConexao, 5000);
    buscarMensagens();
    setInterval(buscarMensagens, 3000);
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
            <article class="mensagem mensagem-status-usuario">
                <div><em>(${hora})</em> <strong>${de}</strong> ${texto}</div>
            </article> `;
        } else if ((tipo === "message") && (para === "Todos")){
            conteudoChat.innerHTML += `
            <article class="mensagem mensagem-normal">
                <div><em>(${hora})</em> <strong>${de}</strong> para <strong>${para}</strong>: ${texto}  </div>
            </article>
            `;
        } else if ((tipo === "private_message") && (para === usuario)){
            conteudoChat.innerHTML += `
            <article class="mensagem mensagem-reservada">
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
        to: "Todos",
        text: mensagemEnviada,
        type:"message"    
    };

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

