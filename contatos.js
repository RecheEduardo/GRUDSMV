"use strict";
const CATEGORIAS_VALIDAS = ["amigo", "trabalho", "familia", "outro"];
function isCategoriaValida(categoria) {
    return CATEGORIAS_VALIDAS.some(c => c === categoria);
}
class Agenda {
    constructor() {
        this.contatos = [];
        this.proximoId = 1;
        this.listeners = [];
    }
    notificar() {
        const copia = this.listar();
        this.listeners.forEach(fn => fn(copia));
    }
    subscribe(fn) {
        this.listeners = [...this.listeners, fn];
        return () => {
            this.listeners = this.listeners.filter(l => l !== fn);
        };
    }
    adicionar(dados) {
        const novo = Object.assign({ id: this.proximoId++ }, dados);
        this.contatos = [...this.contatos, novo];
        this.notificar();
        return Object.assign({}, novo);
    }
    listar() {
        return this.contatos.map(c => (Object.assign({}, c)));
    }
    buscarPorId(id) {
        const encontrado = this.contatos.find(c => c.id === id);
        return encontrado ? Object.assign({}, encontrado) : undefined;
    }
    atualizar(id, dados) {
        let atualizado;
        this.contatos = this.contatos.map(c => {
            if (c.id !== id)
                return c;
            atualizado = Object.assign(Object.assign({}, c), dados);
            return atualizado;
        });
        if (atualizado)
            this.notificar();
        return atualizado ? Object.assign({}, atualizado) : undefined;
    }
    remover(id) {
        const tamanhoAntes = this.contatos.length;
        this.contatos = this.contatos.filter(c => c.id !== id);
        const removeu = this.contatos.length < tamanhoAntes;
        if (removeu)
            this.notificar();
        return removeu;
    }
}
function extrairCampo(lista, campo) {
    return lista.map(item => item[campo]);
}
function renderizarLista(contatos) {
    const ul = document.getElementById("lista");
    ul.innerHTML = "";
    contatos.forEach(contato => {
        const li = document.createElement("li");
        const info = document.createElement("div");
        info.className = "info";
        const nome = document.createElement("span");
        nome.textContent = contato.nome;
        const cat = document.createElement("span");
        cat.className = "categoria";
        cat.textContent = contato.categoria;
        info.appendChild(nome);
        info.appendChild(cat);
        const btn = document.createElement("button");
        btn.className = "estrela" + (contato.favoritado ? " favoritado" : "");
        btn.setAttribute("aria-label", contato.favoritado ? "Desfavoritar" : "Favoritar");
        btn.addEventListener("click", () => {
            agenda.atualizar(contato.id, { favoritado: !contato.favoritado });
        });
        li.appendChild(info);
        li.appendChild(btn);
        ul.appendChild(li);
    });
}
function exibirTabelaCampos(campo) {
    const tabela = document.getElementById("tabela-campos");
    const cabecalho = document.getElementById("tabela-cabecalho");
    const corpo = document.getElementById("tabela-corpo");
    const valores = extrairCampo(agenda.listar(), campo);
    cabecalho.textContent = String(campo).toUpperCase();
    corpo.innerHTML = "";
    valores.forEach(valor => {
        const tr = document.createElement("tr");
        const td = document.createElement("td");
        td.textContent = valor !== undefined ? String(valor) : "—";
        tr.appendChild(td);
        corpo.appendChild(tr);
    });
    tabela.style.display = "table";
    console.table(valores.map(v => ({ [campo]: v })));
}
const agenda = new Agenda();
const cancelarReatividade = agenda.subscribe(renderizarLista);
agenda.adicionar({ nome: "Ana Lima", telefone: "11 91234-5678", email: "ana@email.com", categoria: "trabalho", favoritado: false });
agenda.adicionar({ nome: "Bruno Costa", telefone: "21 98765-4321", categoria: "amigo", favoritado: true });
agenda.adicionar({ nome: "Carla Souza", telefone: "31 99887-6655", email: "carla@familia.com", categoria: "familia", favoritado: false });
const form = document.getElementById("formulario");
const inpNome = document.getElementById("inp-nome");
const inpTelefone = document.getElementById("inp-telefone");
const inpEmail = document.getElementById("inp-email");
const inpCategoria = document.getElementById("inp-categoria");
const divErro = document.getElementById("erro");
form.addEventListener("submit", (e) => {
    e.preventDefault();
    divErro.textContent = "";
    const categoriaValor = inpCategoria.value;
    if (!isCategoriaValida(categoriaValor)) {
        divErro.textContent = `Categoria inválida: "${categoriaValor}". Use: ${CATEGORIAS_VALIDAS.join(", ")}.`;
        return;
    }
    const nome = inpNome.value.trim();
    const telefone = inpTelefone.value.trim();
    if (!nome || !telefone) {
        divErro.textContent = "Nome e telefone são obrigatórios.";
        return;
    }
    const emailValor = inpEmail.value.trim();
    agenda.adicionar({
        nome,
        telefone,
        email: emailValor || undefined,
        categoria: categoriaValor,
        favoritado: false,
    });
    form.reset();
});
document.getElementById("btn-nomes").addEventListener("click", () => {
    exibirTabelaCampos("nome");
});
document.getElementById("btn-telefones").addEventListener("click", () => {
    exibirTabelaCampos("telefone");
});
const btnReadonly = document.getElementById("btn-readonly");
let modoSomenteLeitura = false;
btnReadonly.addEventListener("click", () => {
    if (!modoSomenteLeitura) {
        cancelarReatividade();
        modoSomenteLeitura = true;
        btnReadonly.textContent = "Reativar interface";
        btnReadonly.classList.add("ativo");
    }
    else {
        agenda.subscribe(renderizarLista);
        renderizarLista(agenda.listar());
        modoSomenteLeitura = false;
        btnReadonly.textContent = "Modo somente leitura";
        btnReadonly.classList.remove("ativo");
    }
});
