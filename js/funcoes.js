
var temporizador = document.querySelector("#temporizador");
var contador = document.querySelector("#contador_maca");
var tela = document.querySelector("canvas");
var desenhar = tela.getContext("2d");
var dimensaoMinhoca = 20;
var taxaDeMovimento = 1;
var corpo = [];
var temporizadorSegundos, temporizadorMinutos, cronometro;
var macasColetadas, xMaca, yMaca;
var direcoes = {"esquerda":false, "cima":false, "direita":true, "baixo":false}
var pegouMaca = false;

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

    desenharCorpo(500, 200, dimensaoMinhoca, dimensaoMinhoca);
    corpo.push(500);
    corpo.push(200);

    gerarCoordenadaMaca();
    movimentarMinhoca();
}

function iniciarTemporizador()
{
    cronometro = setInterval(function(){

        var tempoAtualSegundos = temporizadorSegundos <= 9 ? 0+String(temporizadorSegundos) : temporizadorSegundos;
        var tempoAtualMinutos = temporizadorMinutos <= 9 ? 0+String(temporizadorMinutos) : temporizadorMinutos;

        temporizador.innerHTML = `${tempoAtualMinutos}:${tempoAtualSegundos}`;
        temporizadorSegundos++;
        
        if(temporizadorSegundos >= 60)
        {
            temporizadorSegundos = 0;
            temporizadorMinutos++;
        }
    }, 1000)
}

function desenharCorpo(x, y, largura, altura)
{
    desenhar.fillStyle = "darkgreen";
    desenhar.fillRect(x, y, largura, altura);
}

function apagarCorpo(x, y, largura, altura)
{
    desenhar.fillStyle = "lightgreen";
    desenhar.fillRect(0, 0, 1280, 500);
}

function movimentarMinhoca()
{
    setInterval(function(){
        apagarCorpo(corpo[0], corpo[1], dimensaoMinhoca, dimensaoMinhoca);
        desenharMaca();
        desenharCorpo(corpo[0], corpo[1], dimensaoMinhoca, dimensaoMinhoca);

        //Testando se tentou pegar a maçã na extremidade direita
        if((xMaca == corpo[0] + dimensaoMinhoca))
        {
            if((yMaca >= corpo[1]) && (yMaca <= corpo[1] + dimensaoMinhoca))
            {
                gerarCoordenadaMaca();
                pegouMaca = true;
            }
        }

        //Testando se tentou pegar a maçã na extremidade esquerda
        if((xMaca == corpo[0]))
        {
            if((yMaca >= corpo[1]) && (yMaca <= corpo[1] + dimensaoMinhoca))
            {
                gerarCoordenadaMaca();
                pegouMaca = true;
            }
        }

        //Testando se tentou pegar a maçã na extremidade de cima
        if((yMaca == corpo[1]))
        {
            if((xMaca >= corpo[0]) && (xMaca <= corpo[0] + dimensaoMinhoca))
            {
                gerarCoordenadaMaca();
                pegouMaca = true;
            }
        }

        //Testando se tentou pegar a maçã na extremidade de baixo
        if((yMaca == corpo[1] + dimensaoMinhoca))
        {
            if((xMaca >= corpo[0]) && (xMaca <= corpo[0] + dimensaoMinhoca))
            {
                gerarCoordenadaMaca();
                pegouMaca = true;
            }
        }

        if(pegouMaca)
        {
            contabilizarMaca();
            pegouMaca = false;
        }

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
    }, 10);
}

function mudarDirecao(evento)
{
    codigo = evento.keyCode;

    switch(codigo)
    {
        case 37:
            direcoes["esquerda"] = true;
            direcoes["cima"] = false;
            direcoes["direita"] = false;
            direcoes["baixo"] = false;
            break;

        case 38:
            direcoes["esquerda"] = false;
            direcoes["cima"] = true;
            direcoes["direita"] = false;
            direcoes["baixo"] = false;
            break;
        
        case 39:
            direcoes["esquerda"] = false;
            direcoes["cima"] = false;
            direcoes["direita"] = true;
            direcoes["baixo"] = false;
            break;
        
        case 40:
            direcoes["esquerda"] = false;
            direcoes["cima"] = false;
            direcoes["direita"] = false;
            direcoes["baixo"] = true;
            break;
    }
}

function desenharMaca()
{
    desenhar.fillStyle = 'red';
    desenhar.beginPath();
    desenhar.arc(xMaca, yMaca, dimensaoMinhoca/2, 0, 2*Math.PI);
    desenhar.fill();    
}

function gerarCoordenadaMaca()
{
    xMaca = Math.floor(Math.random() * 1280);
    yMaca = Math.floor(Math.random() * 500);
}

function contabilizarMaca()
{
    macasColetadas++;
    contador.innerHTML = macasColetadas;
}

document.onkeydown = mudarDirecao;