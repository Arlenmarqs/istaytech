
async function carregarProdutosCSV(csvUrl) {
    const res = await fetch(csvUrl);

    if (!res.ok) {
        throw new Error("Erro ao carregar o CSV");
    }

    const text = await res.text();
    const linhas = text.trim().split(/\r?\n/);
    const cabecalho = linhas[0].split(',');

    const produtos = linhas.slice(1).map(linha => {
        const colunas = linha.split(',');
        const obj = {};

        cabecalho.forEach((chave, i) => {
            obj[chave.trim()] = colunas[i]?.trim() || "";
        });

        obj.preco = parseFloat(obj.preco);

        return obj;
    });

    return produtos;
}

function renderizarProdutos(produtos, containerId) {
    const container = document.getElementById(containerId);

    if (!container) return;

    container.innerHTML = "";

    produtos.forEach(produto => {
        const card = document.createElement('div');
        card.classList.add('card');

        card.innerHTML = `
            <img src="${produto.imagem}" alt="${produto.nome}">
            <h3>${produto.nome}</h3>
            <p class="preco">R$ ${produto.preco.toFixed(2)}</p>
            <a href="${produto.link}" class="btn" target="_blank" rel="noopener noreferrer">
                Ver opções
            </a>
        `;

        container.appendChild(card);
    });
}

function filtrarProdutos(produtos, termo, categoria) {
    return produtos.filter(produto => {

        const correspondeNome = produto.nome
            .toLowerCase()
            .includes(termo.toLowerCase());

        const correspondeCategoria = categoria === null ||
            produto.categoria === categoria;

        return correspondeNome && correspondeCategoria;
    });
}

(async function () {

    try {
        const produtos = await carregarProdutosCSV('dados/produtos.csv');
        console.log("Produtos carregados:", produtos);
        console.log("Quantidade de produtos:", produtos.length);

        const lancamentos = produtos.filter(p => p.tipo === 'lancamento');
        const ofertas = produtos.filter(p => p.tipo === 'oferta');

        renderizarProdutos(lancamentos, 'produtos-lancamentos');
        renderizarProdutos(ofertas, 'produtos-oferta');

        const inputBusca = document.getElementById('busca');
        const iconeBusca = document.getElementById('iconeBusca');

        const secaoBusca = document.getElementById('secao-busca');
        const containerResultados = document.getElementById('resultados-busca');
        const mensagemBusca = document.getElementById('mensagem-busca');

        const secoesProdutos = document.querySelectorAll('main > section.produtos');

        let categoriaSelecionada = null;

        function atualizarBusca() {
            console.log("Busca acionada!");
            console.log("Texto digitado:", inputBusca.value);
            const termo = inputBusca.value.trim();

            const resultados = filtrarProdutos(
                produtos,
                termo,
                categoriaSelecionada
            );

            const pesquisando = termo !== "" || categoriaSelecionada !== null;

            secaoBusca.hidden = !pesquisando;

            secoesProdutos.forEach(secao => {
                if (secao !== secaoBusca) {
                    secao.hidden = pesquisando;
                }
            });

            renderizarProdutos(resultados, 'produtos-busca');

            mensagemBusca.textContent = resultados.length === 0
                ? "Nenhum produto encontrado."
                : "";
        }

        inputBusca.addEventListener('input', atualizarBusca);

        iconeBusca.addEventListener('click', atualizarBusca);
        console.log("Eventos da busca registrados!");
        const categorias = document.querySelectorAll('.cat-item');

        categorias.forEach(item => {
            item.addEventListener('click', () => {

                categoriaSelecionada = item.dataset.categoria;

                atualizarBusca();
            });
        });

    } catch (erro) {
        console.error("Erro ao carregar produtos:", erro);
    }

})();
console.log("StayTech: JavaScript carregado!");
console.log("Campo de busca:", document.getElementById("busca"));
console.log("Ícone de busca:", document.getElementById("iconeBusca"));