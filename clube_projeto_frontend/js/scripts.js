document.addEventListener("DOMContentLoaded", function() {
    loadComponent('header', 'partials/header.html');
    loadComponent('nav', 'partials/nav.html');
    loadComponent('footer', 'partials/footer.html');
    loadPage('main');
});

function loadComponent(id, url) {
    fetch(url)
        .then(response => response.text())
        .then(data => {
            document.getElementById(id).innerHTML = data;
        });
}

function loadPage(page) {
    let contentDiv = document.getElementById('main-content');
    if (page === 'main') {
        fetch('partials/main.html')
            .then(response => response.text())
            .then(data => {
                contentDiv.innerHTML = data;
                loadProducts();
            });
    } else if (page === 'add') {
        let formSection = document.getElementById('product-form');
        formSection.style.display = 'block';
        let listSection = document.getElementById('product-list');
        listSection.style.display = 'none';
    }
}

function loadProducts() {
    fetch('/produtos')
        .then(response => response.json())
        .then(products => {
            let productList = document.getElementById('product-list');
            productList.innerHTML = '<h2>Lista de Produtos</h2>';
            products.forEach(product => {
                let productItem = document.createElement('div');
                productItem.innerHTML = `ID: ${product.id}, Descrição: ${product.descricao}, Unidade: ${product.unidade}, Preço: ${product.preco}`;
                productList.appendChild(productItem);
            });
        });
}

document.addEventListener('submit', function(event) {
    event.preventDefault();
    if (event.target && event.target.id === 'formProduto') {
        let descricao = document.getElementById('descricao').value;
        let unidade = document.getElementById('unidade').value;
        let preco = document.getElementById('preco').value;

        fetch('/produtos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ descricao, unidade, preco })
        })
        .then(response => response.json())
        .then(data => {
            alert('Produto adicionado com sucesso');
            loadPage('main');
        });
    }
});
