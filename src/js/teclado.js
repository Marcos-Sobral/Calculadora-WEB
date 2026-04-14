document.addEventListener("keydown", function(event) {
    const tecla = event.key;

    // Se for número ou ponto
    if (!isNaN(tecla) || tecla === ".") {
        adicionar(tecla);
    }

    // Operadores
    if (["+", "-", "*", "/"].includes(tecla)) {
        adicionar(tecla);
    }

    // Enter = calcular
    if (tecla === "Enter") {
        calcular();
    }

    // Backspace = apagar último
    if (tecla === "Backspace") {
        excluir();
    }

    // Escape = limpar tudo
    if (tecla === "Escape") {
        limpar();
    }

    // P = alternar tema
    if (tecla === "p") {
        alternarTema();
    }
});