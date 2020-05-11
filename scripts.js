estado = [];			// estado do tabuleiro na tela
var noInicial; 			// primeiro nó da arvore
var noAtual;			// nó que representa o estado atual e suas possibilidades

var pilha = []; // array de ponteiros para nodo - usada para construir a �rvore
var nos = 0;	//nós na �rvore

window.onload = function() {
  inicializa();
};

function inicializa() {
	estado = [ [],[],[] ];
	noInicial = null;
	noAtual = null;
	
	exibirEstado(estado);
}

function exibirEstado(estado) {
	for (var i=0; i<3; i++) {
		for (var j=0; j<3; j++) {
			text = document.getElementById(i.toString() + j.toString());
			if (estado[i][j] == undefined) {
				//Exibindo estado inicial no jogo
				text.innerHTML = "&nbsp;";
			}
			else {
				text.innerHTML = estado[i][j];
			}
		}
	}
}

function showMessage(corpo, titulo="") {
  document.getElementById("titulo").innerHTML = titulo;
  document.getElementById("corpo").innerText = corpo;
  document.getElementById("open").click();
}

function jogaHumano(idElemento) {
	var i = Number(idElemento[0]); 
	var j = Number(idElemento[1]);
  
	if (estado[i][j] != undefined) {
		// Posição já marcada
		showMessage("Selecione outro campo", i.toString() + j.toString());
		return;
	}
	else {
		estado[i][j] = "o";		
		exibirEstado(estado);
	}
	
	if (!isTerminal(estado,1)) {	
		if (!noInicial)	{
			gerarArvorePossibilidades();	
		}	
		else {
			for (i=0;i < noAtual.filhos.length; i++) {
				if (comparaEstados(estado, noAtual.filhos[i].estado)) {
					noAtual = noAtual.filhos[i];
					break;
				}
			}
		}

		jogaCPU();
	}
}

function jogaCPU() {
	var max;
	var opcoes = [];
	var opcaoSelecionada;
	
	if (!noInicial) {
		gerarArvorePossibilidades();
	}			
	
	for (var i=0;i < noAtual.filhos.length; i++) {
		if (noAtual.filhos[i].minimax != null && (max == undefined || noAtual.filhos[i].minimax > max)) {
			max = noAtual.filhos[i].minimax;	// armazenar maior valor de minimax dos filhos do no atual
		}
	}
	
	// percorre novamente os filhos, armazenando apenas as possibilidades que seriam interessantes e desconsiderando possibilidades que não satisfaçam
	for (var i=0;i < noAtual.filhos.length; i++) {
		if (noAtual.filhos[i].minimax == max) {
			opcoes.push(i);
		}
	}
		
	// Escolher aleatoriamente uma entre as melhores jogadas
	opcaoSelecionada = Math.floor(Math.random()*opcoes.length);
	noAtual = noAtual.filhos[opcoes[opcaoSelecionada]];
	estado = noAtual.estado;
	exibirEstado(estado);
	
	isTerminal(estado,1);	// Verifica se atingiu estado terminal, encerrando o jogo 
}

function gerarArvorePossibilidades() {
	pilha = [];
	nos = 0;
    noInicial = {pai: null, estado: estado, filhos: [], jogador: "O", minimax: null};
    console.log(noInicial)
	pilha.push(noInicial);	
	
	while (pilha.length) {		
		nodo = pilha.pop();		
		geraFilhos(nodo);		
    }
    console.log(pilha)

	calculaMinimax(noInicial);	// calcula valores Minimax a partir da noInicial
    noAtual = noInicial;
    console.log(noAtual)
}
	
	
function geraFilhos(pai) {
	var estado = [];
	var minimax;
	var	jogador = (pai.jogador=="x") ? "o" : "x";
	
	for (var y=0; y<3; y++) {
		for (var x=0; x<3; x++) {
			if (pai.estado[y][x] == undefined) {
				estado = copiaEstado(pai.estado);
				estado[y][x] = jogador;				
				var no = {pai: pai, estado: estado, filhos: [], jogador: jogador, minimax: null};

				no.minimax = isTerminal(no.estado,0);
				pai.filhos.push(no);	
				nos++;

				if (!no.minimax) {
					pilha.push(no);
				}		
			}
		}
	}
}

function calculaMinimax(nodo) {
	var min, max;

	for (var i=0; i < nodo.filhos.length; i++) {
		if (nodo.filhos[i].minimax === null) {
			calculaMinimax(nodo.filhos[i]);		// recursividade para calcular valor dos filhos
		}

		if (max == undefined || nodo.filhos[i].minimax > max) {
			max = nodo.filhos[i].minimax;
		}

		if (min == undefined || nodo.filhos[i].minimax < min) {
			min = nodo.filhos[i].minimax;
		}	
	}

	if (nodo.jogador == "o") {
		nodo.minimax = max;		// Caso for a cpu a proxima jogada, retornamos o valor maximo
	}
	else {
		nodo.minimax = min;
	}
}

function isTerminal(estado, encerra) {
	var brancos = 0;
	var utilidade = null;
	
	// verifica se ganhou nas linhas
	for (var y=0; y<3; y++)	 {
		if (estado[y][0] != undefined && estado[y][0] == estado[y][1] && estado[y][0] == estado[y][2]) {
			utilidade = (estado[y][0] == "x")? 1: -1;
			break;
		}
	}


	// verifica se ganhou nas colunas
	if (!utilidade) {
		for (var x=0; x<3; x++)	 {
			if (estado[0][x] != undefined && estado[0][x] == estado[1][x] && estado[0][x] == estado[2][x]) {
				utilidade = (estado[0][x] == "x")? 1: -1;
				break;
			}
		}
	}	
	
	
	// verifica se ganhou nas colunas
	if (!utilidade)	 {
		if (estado[1][1] != undefined && ((estado[0][0] == estado[1][1] && estado[0][0] == estado[2][2]) ||
			(estado[0][2] == estado[1][1] && estado[0][2] == estado[2][0]))) {
				utilidade = (estado[1][1] == "x")? 1: -1;
			}
	}		
	
	// conta espa�os em branco no tabuleiro
	for (var y=0; y<3; y++) {
		for (x=0; x<3; x++) {
			if (estado[y][x] == undefined){
				brancos++;
			}	
		}
	}
				
	if (utilidade){
		if (encerra) {
			if (utilidade > 0) {
				showMessage("Tente novamente quando puder", "Voce perdeu!");
        		inicializa();
      		} else {
				showMessage("Impossivel...", "Voce venceu!");
        		inicializa();
      		}
		} 
		else {
			return utilidade * (brancos + 1); 							
		}
	}	
	else {
		if (!brancos) {
			if (encerra){
				showMessage("De novo...", "Empate!");
        		inicializa();
      		}
			else {
				return 0;
			}
		}				
		else {
			return null;
		}
	}							
}


function copiaEstado(estado) {
	var retorno = [];
	for(var i = 0; i < estado.length; i++) {
		retorno[i] = estado[i].slice(0);
	}

	return retorno;
}

function comparaEstados(estado1, estado2) {
	for (var i=0; i<3; i++) {
		for (var j=0; j<3; j++) {
			if (estado1[i][j] != estado2[i][j]) {
				return false;
			}
		}
	}
				
	return true;
}