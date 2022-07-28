
var temporizador = document.querySelector("#temporizador");
var contador = document.querySelector("#contador_maca");
var tela = document.querySelector("canvas");
var desenhar = tela.getContext("2d");
var dimensaoMinhoca = 10;
var taxaDeMovimento = 10;
var corpo;
var tempoAtualMinutos, tempoAtualSegundos, temporizadorSegundos, temporizadorMinutos, cronometro, movimentacao;
var macasColetadas, xMaca, yMaca;
var direcoes = {"esquerda":false, "cima":false, "direita":true, "baixo":false}
var pegouMaca = false, aumentoCorpo = false;

function iniciarJogo()
{
    document.getElementById("play").disabled = true;

    //Zerando temporizador e maçãs
    temporizadorSegundos = 0;
    temporizadorMinutos = 0;
    macasColetadas = 0;

    //Mostrando na tela os valores do temporizador e contador de maçãs
    temporizador.innerHTML = `00:00`;
    contador.innerHTML = macasColetadas;
    
    document.getElementById("tempo_label").style.display = "block";
    iniciarTemporizador();
    
    document.getElementById("contador_label").style.display = "block";

    //Criando o corpo
    corpo = [];
    corpo.push(500);
    corpo.push(200);
    corpo.push(480);
    corpo.push(200);

    //Gerando a primeira maçã
    gerarCoordenadaMaca();

    //Iniciando o renderizador de tempo e movimento
    cronometro = setInterval(iniciarTemporizador, 1000);
    movimentacao = setInterval(movimentarMinhoca, 250);
}

function finalizarJogo()
{
    //Mensagem de Fim de Jogo
    alert("Você bateu em si mesmo! Fim de Jogo!!!\n\nTempo de Jogo: "+`${tempoAtualMinutos}:${tempoAtualSegundos}`+"\nQuantidade de Maçãs Coletadas: "+macasColetadas);
    
    //Reabilitando Botão Play 
    document.getElementById("play").disabled = false;

    //Parando o renderizador de tempo e movimento
    clearInterval(cronometro);
    clearInterval(movimentacao);
    apagarCorpo();

    //Ocultando o temporizador e o contador de maçãs
    document.getElementById("tempo_label").style.display = "none";
    iniciarTemporizador();
    document.getElementById("contador_label").style.display = "none";

}

function iniciarTemporizador()
{
    tempoAtualSegundos = temporizadorSegundos <= 9 ? 0+String(temporizadorSegundos) : temporizadorSegundos;
    tempoAtualMinutos = temporizadorMinutos <= 9 ? 0+String(temporizadorMinutos) : temporizadorMinutos;

    temporizador.innerHTML = `${tempoAtualMinutos}:${tempoAtualSegundos}`;
    temporizadorSegundos++;
    
    if(temporizadorSegundos >= 60)
    {
        temporizadorSegundos = 0;
        temporizadorMinutos++;
    }
}

function desenharCorpo(x, y)
{
    desenhar.fillStyle = "darkgreen";
    desenhar.fillRect(x, y, dimensaoMinhoca, dimensaoMinhoca);
}

function apagarCorpo()
{
    desenhar.fillStyle = "lightgreen";
    desenhar.fillRect(0, 0, 1280, 500);
}

function movimentarMinhoca()
{
    apagarCorpo(corpo[0], corpo[1], dimensaoMinhoca, dimensaoMinhoca);
    desenharMaca();

    if(aumentoCorpo)
    {
        aumentoCorpo = false;
        aumentarCorpo();
    }

    if(corpo.length > 2)
    {
        sincronizarCorpo();
    }
    
    verificarDirecao();

    for(var i=0; i < corpo.length; i += 2)
    {
        desenharCorpo(corpo[i], corpo[i+1], dimensaoMinhoca, dimensaoMinhoca);
    }

    testarColisaoCorpo();
    testarColisaoMaca();
}

function mudarDirecao(evento)
{
    codigo = evento.keyCode;

    switch(codigo)
    {
        case 37:
            if(!direcoes["direita"])
            {
                direcoes["esquerda"] = true;
                direcoes["cima"] = false;
                direcoes["direita"] = false;
                direcoes["baixo"] = false;
                movimentarMinhoca();
            }
            break;

        case 38:
            if(!direcoes["baixo"])
            {
                direcoes["esquerda"] = false;
                direcoes["cima"] = true;
                direcoes["direita"] = false;
                direcoes["baixo"] = false;
                movimentarMinhoca();
            }
            break;
        
        case 39:
            if(!direcoes["esquerda"])
            {
                direcoes["esquerda"] = false;
                direcoes["cima"] = false;
                direcoes["direita"] = true;
                direcoes["baixo"] = false;
                movimentarMinhoca();
            }
            break;
        
        case 40:
            if(!direcoes["cima"])
            {
                direcoes["esquerda"] = false;
                direcoes["cima"] = false;
                direcoes["direita"] = false;
                direcoes["baixo"] = true;
                movimentarMinhoca();
            }
            break;
    }
}

function desenharMaca()
{
    desenhar.fillStyle = '#7a0202';
    desenhar.fillRect(xMaca, yMaca, dimensaoMinhoca, dimensaoMinhoca);
}

function gerarCoordenadaMaca()
{
    xMaca = Math.floor(Math.random() * 64) * 20;
    yMaca = Math.floor(Math.random() * 25) * 20;
}

function contabilizarMaca()
{
    macasColetadas++;
    contador.innerHTML = macasColetadas;
}

function testarColisaoMaca()
{
    if((xMaca == corpo[0]) && (yMaca == corpo[1]))
    {
        gerarCoordenadaMaca();
        pegouMaca = true;
    }

    if(pegouMaca)
    {
        pegouMaca = false;
        contabilizarMaca();
        aumentoCorpo = true;
    }
}

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

function verificarDirecao()
{
    if(direcoes["esquerda"])
    {
        corpo[0] -= taxaDeMovimento;
        
        if(corpo[0] < 0 - dimensaoMinhoca)
        {
            corpo[0] = 1280;
        }
    }
    else
    {
        if(direcoes["cima"])
        {
            corpo[1] -= taxaDeMovimento;

            if(corpo[1] < 0 - dimensaoMinhoca)
            {
                corpo[1] = 500;
            }
        }
        else
        {
            if(direcoes["direita"])
            {
                corpo[0] += taxaDeMovimento;

                if(corpo[0] > 1280)
                {
                    corpo[0] = 0;
                }
            }   
            else
            {
                corpo[1] += taxaDeMovimento;

                if(corpo[1] > 500)
                {
                    corpo[1] = 0 - dimensaoMinhoca;
                }
            }
        }
    }
}

function sincronizarCorpo()
{
    for(var i = corpo.length - 1; i > 1; i = i - 2)
    {
        corpo[i] = corpo[i-2];
        corpo[i-1] = corpo[i-3];
    }
}

function aumentarCorpo()
{
    var tamanho = corpo.length;
    corpo.push(corpo[tamanho-2]);
    corpo.push(corpo[tamanho-1]);
}

document.onkeydown = mudarDirecao;