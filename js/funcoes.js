
var temporizador = document.querySelector("#temporizador");
var contador = document.querySelector("#contador_maca");
var tela = document.querySelector("canvas");
var desenhar = tela.getContext("2d");

var dimensaoCobra = 10;
var taxaDeMovimento = 10;
var corpo;
var tempoAtualMinutos, tempoAtualSegundos, temporizadorSegundos, temporizadorMinutos, cronometro, movimentacao;
var macasColetadas, xMaca, yMaca;

var direcoes = {"esquerda":false, "cima":false, "direita":true, "baixo":false}
var pegouMaca = false, aumentoCorpo = false;


//FUNÇÕES: INICIAR O JOGO
function iniciarJogo()
{
    //DESABILITANDO O BOTÃO PLAY
    document.getElementById("play").disabled = true;

    //ZERANDO O TEMPORIZADOR E O CONTADOR DE MAÇÃS
    temporizadorSegundos = 0;
    temporizadorMinutos = 0;
    macasColetadas = 0;

    //MOSTRANDO NA TELA O TEMPORIZADOR E O CONTADOR DE MAÇÃS
    temporizador.innerHTML = `00:00`;
    contador.innerHTML = macasColetadas;
    document.getElementById("tempo_label").style.display = "block";
    iniciarTemporizador();
    document.getElementById("contador_label").style.display = "block";

    //RESENTADO O CORPO E CRIANDO 2 UNIDADES DE CORPO INICIAIS
    corpo = [];
    corpo.push(500);
    corpo.push(200);
    corpo.push(480);
    corpo.push(200);

    //GERANDO A PRIMEIRA MAÇÃ
    gerarCoordenadaMaca();

    //INICIANDO O RENDERIZADOR DE MOVIMENTO E CRONÔMETRO
    cronometro = setInterval(iniciarTemporizador, 1000);
    movimentacao = setInterval(movimentarCobra, 250);
}


//FUNÇÃO: FINALIZAR O JOGO
function finalizarJogo()
{
    //MENSAGEM DE FIM DE JOGO
    alert("Você bateu em si mesmo! Fim de Jogo!!!\n\nTempo de Jogo: "+`${tempoAtualMinutos}:${tempoAtualSegundos}`+"\nQuantidade de Maçãs Coletadas: "+macasColetadas);
    
    //REABILITANDO O BOTÃO PLAY
    document.getElementById("play").disabled = false;

    //PARANDO O RENDERIZADOR DE MOVIMENTO E CRONÔMETRO
    clearInterval(cronometro);
    clearInterval(movimentacao);
    apagarCorpo();

    //OCULTANDO O TEMPORIZADOR E O CONTADOR DE MAÇÃS
    document.getElementById("tempo_label").style.display = "none";
    document.getElementById("contador_label").style.display = "none";
}


//FUNÇÃO: MOVIMENTAR A COBRA (SE REPETE A CADA 250 MILISSEGUNDOS)
function movimentarCobra()
{
    //APAGA O FRAME ANTIGO PARA SE INICIAR UM NOVO FRAME
    apagarFrame();

    desenharMaca();

    //CASO O JOGADOR TENHA PEGO UM MAÇÃ, MAIS UMA UNIDADE DE CORPO SERÁ RENDERIZADA NO PRÓXIMO FRAME
    if(aumentoCorpo)
    {
        aumentoCorpo = false;
        aumentarCorpo();
    }

    //ATRIBUINDO A TODAS AS UNIDADES DE CORPO A POSIÇÃO DE SEUS SUCESSORES NO FRAME ANTERIOR
    sincronizarCorpo();
    
    //VERIFICANDO A DIREÇÃO QUE A COBRA ESTÁ E ATUALIZANDO OS VALORES DE COORDENADA DE FORMA QUE ELA AVANCE NESSA DIREÇÃO
    verificarDirecao();

    //RENDERIZANDO TODAS AS UNIDADES DE CORPO DA COBRA EM COORDENADAS ESPECÍFICAS
    for(var i=0; i < corpo.length; i += 2)
    {
        desenharCorpo(corpo[i], corpo[i+1], dimensaoCobra, dimensaoCobra);
    }

    //TESTANDO SE A CABEÇA DA COBRA COLIDIU COM ALGUMA PARTE DO CORPO NESSE FRAME
    testarColisaoCorpo();

    //TESTANDO SE A CABEÇA DA COBRA ENCOSTOU EM ALGUMA MAÇÃ NESSE FRAME
    testarColisaoMaca();
}


//FUNÇÃO: VERIFICAR A DIREÇÃO QUE A COBRA ESTÁ SE MOVENDO
function verificarDirecao()
{
    //MOVIMENTO PARA ESQUERDA
    if(direcoes["esquerda"])
    {
        //DIMINUI O VALOR DO EIXO X NA COORDENADA DA CABEÇA
        corpo[0] -= taxaDeMovimento;
        
        //CHEGOU AO LIMITE DO MAPA À ESQUERDA -> ATRAVESSA PARA A EXTREMIDADE DIREITA
        if(corpo[0] < 0)
        {
            corpo[0] = 1280 - dimensaoCobra;
        }
    }
    else
    {
        //MOVIMENTO PARA CIMA
        if(direcoes["cima"])
        {
            //DIMINUI O VALOR DO EIXO Y NA COORDENADA DA CABEÇA
            corpo[1] -= taxaDeMovimento;

            //CHEGOU AO LIMITE DO MAPA PARA CIMA -> ATRAVESSA PARA A EXTREMIDADE DE BAIXO
            if(corpo[1] < 0)
            {
                corpo[1] = 500 - dimensaoCobra;
            }
        }
        else
        {
            //MOVIMENTO PARA DIREITA
            if(direcoes["direita"])
            {
                //AUMENTA O VALOR DO EIXO X NA COORDENADA DA CABEÇA
                corpo[0] += taxaDeMovimento;

                //CHEGOU AO LIMITE DO MAPA À DIREITA -> ATRAVESSA PARA A EXTREMIDADE ESQUERDA
                if(corpo[0] >= 1280)
                {
                    corpo[0] = 0;
                }
            }   
            else //MOVIMENTO PARA BAIXO
            {
                //AUMENTA O VALOR DO EIXO Y NA COORDENADA DA CABEÇA
                corpo[1] += taxaDeMovimento;


                //CHEGOU AO LIMITE DO MAPA PARA BAIXO -> ATRAVESSA PARA A EXTREMIDADE DE CIMA
                if(corpo[1] >= 500)
                {
                    corpo[1] = 0;
                }
            }
        }
    }
}


//FUNÇÃO: MUDAR A DIREÇÃO DA COBRA ATRAVÉS DO TECLADO
function mudarDirecao(evento)
{
    //CAPTURANDO O CÓDIGO DA TECLA PRESSIONADA
    codigo = evento.keyCode;

    switch(codigo)
    {
        //A
        case 65:
            //EQUIVALENTE A SETA PARA ESQUERDA ⇦
            codigo = 37;
            break;

        //W
        case 87:
            //EQUIVALENTE A SETA PARA CIMA ⇧
            codigo = 38;
            break;

        //D
        case 68:
            //EQUIVALENTE A SETA PARA DIREITA ⇨
            codigo = 39;
            break;

        //S
        case 83:
            //EQUIVALENTE A SETA PARA BAIXO ⇩
            codigo = 40;
            break;
    }

    switch(codigo)
    {
        //SETA PARA ESQUERDA ⇦
        case 37:
            //SE A COBRA NÃO ESTIVER SE MOVENDO PARA DIREÇÃO CONTRÁRIA -> MUDA PARA DIREÇÃO ESCOLHIDA
            if(!direcoes["direita"])
            {
                direcoes["esquerda"] = true;
                direcoes["cima"] = false;
                direcoes["direita"] = false;
                direcoes["baixo"] = false;
                movimentarCobra();
            }
            break;

        //SETA PARA CIMA ⇧
        case 38:
            //SE A COBRA NÃO ESTIVER SE MOVENDO PARA DIREÇÃO CONTRÁRIA -> MUDA PARA DIREÇÃO ESCOLHIDA
            if(!direcoes["baixo"])
            {
                direcoes["esquerda"] = false;
                direcoes["cima"] = true;
                direcoes["direita"] = false;
                direcoes["baixo"] = false;
                movimentarCobra();
            }
            break;
        
        //SETA PARA DIREITA ⇨
        case 39:
            //SE A COBRA NÃO ESTIVER SE MOVENDO PARA DIREÇÃO CONTRÁRIA -> MUDA PARA DIREÇÃO ESCOLHIDA
            if(!direcoes["esquerda"])
            {
                direcoes["esquerda"] = false;
                direcoes["cima"] = false;
                direcoes["direita"] = true;
                direcoes["baixo"] = false;
                movimentarCobra();
            }
            break;
        
        //SETA PARA BAIXO ⇩
        case 40:
            //SE A COBRA NÃO ESTIVER SE MOVENDO PARA DIREÇÃO CONTRÁRIA -> MUDA PARA DIREÇÃO ESCOLHIDA
            if(!direcoes["cima"])
            {
                direcoes["esquerda"] = false;
                direcoes["cima"] = false;
                direcoes["direita"] = false;
                direcoes["baixo"] = true;
                movimentarCobra();
            }
            break;
    }
    
    return false;
}


//FUNÇÃO: TESTAR SE A CABEÇA ESTÁ NAS MESMAS COORDENADAS DA ÚLTIMA MAÇÃ GERADA 
function testarColisaoMaca()
{
    if((xMaca == corpo[0]) && (yMaca == corpo[1]))
    {
        gerarCoordenadaMaca();
        contabilizarMaca();
        aumentoCorpo = true;
    }
}


//FUNÇÃO: TESTAR SE A CABEÇA ESTÁ NAS MESMAS COORDENADAS DE ALGUMA UNIDADE DO CORPO
function testarColisaoCorpo()
{
    for(var i = 2; i < corpo.length; i = i + 2)
    {
        if((corpo[i] == corpo[0]) && (corpo[i+1] == corpo[1]))
        {
            finalizarJogo();
        }
    }
}


//FUNÇÃO: SINCRONIZANDO O MOVIMENTO DE TODAS AS UNIDADES DE CORPO
function sincronizarCorpo()
{
    for(var i = corpo.length - 1; i > 1; i = i - 2)
    {
        //UNIDADE DE CORPO (EIXO X) = UNIDADE DE CORPO SUCESSORA (EIXO X) 
        corpo[i] = corpo[i-2];

        //UNIDADE DE CORPO (EIXO Y) = UNIDADE DE CORPO SUCESSORA (EIXO Y)
        corpo[i-1] = corpo[i-3];
    }
}


//FUNÇÃO: AUMENTAR 1 UNIDADE DE CORPO, ADICIONANDO MAIS DUAS POSIÇÕES AO VETOR 'corpo' COM OS VALORES DE X E Y DA ÚLTIMA UNIDADE DE CORPO DO FRAME ANTERIOR 
function aumentarCorpo()
{
    var tamanho = corpo.length;
    corpo.push(corpo[tamanho-2]);
    corpo.push(corpo[tamanho-1]);
}


//FUNÇÃO: GERAR UMA COORDENADA ALEATÓRIA PARA UMA NOVA MAÇÃ
function gerarCoordenadaMaca()
{
    //EIXO X -> UM NÚMERO ALEATÓRIO ENTRE 0 E 1280 QUE SEJA UM MÚLTIPLO DO VALOR DA DIMENSÃO DA COBRA
    xMaca = Math.floor(Math.random() * (1280/dimensaoCobra)) * dimensaoCobra;

    //EIXO Y -> UM NÚMERO ALEATÓRIO ENTRE 0 E 500 QUE SEJA UM MÚLTIPLO DO VALOR DA DIMENSÃO DA COBRA
    yMaca = Math.floor(Math.random() * (500/dimensaoCobra)) * dimensaoCobra;
}


//FUNÇÃO: AUMENTAR 1 UNIDADE NA QUANTIDADE DE MAÇÃS COLETADAS E ATUALIZA O VALOR NO HTML
function contabilizarMaca()
{
    macasColetadas++;
    contador.innerHTML = macasColetadas;
}


//FUNÇÃO: DESENHAR UNIDADE DE CORPO NA TELA
function desenharCorpo(x, y)
{
    desenhar.fillStyle = "darkgreen";
    desenhar.fillRect(x, y, dimensaoCobra, dimensaoCobra);
}


//FUNÇÃO: DESENHAR UMA MAÇÃ NA TELA
function desenharMaca()
{
    desenhar.fillStyle = '#7a0202';
    desenhar.fillRect(xMaca, yMaca, dimensaoCobra, dimensaoCobra);
}


//FUNÇÃO: APAGAR FRAME / LIMPAR A TELA
function apagarFrame()
{
    desenhar.fillStyle = "lightgreen";
    desenhar.fillRect(0, 0, 1280, 500);
}


//FUNÇÃO: CRONÔMETRO (SE REPETE A CADA 1 SEG)
function iniciarTemporizador()
{
    //ATUALIZANDO OS VALORES DE TEMPO
    tempoAtualSegundos = temporizadorSegundos <= 9 ? 0+String(temporizadorSegundos) : temporizadorSegundos;
    tempoAtualMinutos = temporizadorMinutos <= 9 ? 0+String(temporizadorMinutos) : temporizadorMinutos;

    //ATUALIZANDO O VALOR MOSTRADO NO HTML
    temporizador.innerHTML = `${tempoAtualMinutos}:${tempoAtualSegundos}`;
    
    //AUMENTANDO OS SEGUNDOS EM 1 UNIDADE
    temporizadorSegundos++;
    
    //PASSARAM-SE 60 SEGUNDOS -> ZERANDO O TEMPORIZADOR DE SEGUNDOS E AUMENTANDO 1 UNIDADE EM MINUTOS
    if(temporizadorSegundos >= 60)
    {
        temporizadorSegundos = 0;
        temporizadorMinutos++;
    }
}

document.onkeydown = mudarDirecao;
