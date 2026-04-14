const display = document.getElementById('display');

function adicionar(valor) {
    document.getElementById("display").value += valor;
}

function limpar() {
    display.value = "";
}

function excluir() {
    display.value = display.value.slice(0, -1);
}

function calcular(){
    try {
        let expressao = display.value;
        let resultado = new Function("return " + expressao)();
        display.value = resultado;
    } catch (error) {
        display.value = "erro";
        setTimeout(() => {
            display.value = "";
        }, 800);
    }
}