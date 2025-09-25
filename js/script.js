async function carregarProdutosCSV(csvUrl) {
    const res = await fetch(csvUrl);
    const text = await res.text();
    const linhas = text.trim().split('\n');
    const cabecalho = linhas[0].split(',');
    
    const produtos = linhas.slice(1).map(linha => {
        const colunas = linha.split(',');
        let obj = {};
        cabecalho.forEach((chave, i) => {
            obj[chave.trim()] = colunas[i].trim();
        });
        obj.preco = parseFloat(obj.preco);
        return obj;
    });

    return produtos;
}

function renderizarProdutos(produtos, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";
    produtos.forEach(produto => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <img src="${produto.imagem}" alt="${produto.nome}">
            <h3>${produto.nome}</h3>
            <p class="preco">R$ ${produto.preco.toFixed(2)}</p>
            <a href="${produto.link}" class="btn">Ver opções</a>
        `;
        container.appendChild(card);
    });
}

function filtrarProdutos(produtos, termo) {
    return produtos.filter(p => p.nome.toLowerCase().includes(termo.toLowerCase()));
}

(async function() {
    const produtos = await carregarProdutosCSV('dados/produtos.csv');

    const lancamentos = produtos.filter(p => p.tipo === 'lancamento');
    renderizarProdutos(lancamentos, 'produtos-lancamentos');

    const ofertas = produtos.filter(p => p.tipo === 'oferta');
    renderizarProdutos(ofertas, 'produtos-oferta');

    const inputBusca = document.getElementById('busca');
    const iconeBusca = document.getElementById('iconeBusca');

    iconeBusca.addEventListener('click', () => {
        const termo = inputBusca.value;
        const resultados = filtrarProdutos(produtos, termo);
        renderizarProdutos(resultados, 'produtos-lancamentos');
    });

    inputBusca.addEventListener('input', () => {
        const termo = inputBusca.value;
        const resultados = filtrarProdutos(produtos, termo);
        renderizarProdutos(resultados, 'produtos-lancamentos');
    });
})();
