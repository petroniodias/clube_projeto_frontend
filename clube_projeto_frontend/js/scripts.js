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
                loadAtividades();
            });
    } else if (page === 'add') {
        fetch('partials/main.html')
            .then(response => response.text())
            .then(data => {
                contentDiv.innerHTML = data;
                document.getElementById('atividade-form').style.display = 'block';
                document.getElementById('atividade-list').style.display = 'none';
            });
    }
}

function loadAtividades() {
    fetch('/atividade')
        .then(response => response.json())
        .then(atividades => {
            let atividadeList = document.getElementById('atividade-list');
            atividadeList.innerHTML = '<h2>Lista de Atividades</h2>';
            atividades.forEach(atividade => {
                let atividadeItem = document.createElement('div');
                atividadeItem.innerHTML = `ID: ${atividade.id}, Nome: ${atividade.nome}, Descrição: ${atividade.descricao}`;
                atividadeList.appendChild(atividadeItem);
            });
        });
}

document.addEventListener('submit', function(event) {
    event.preventDefault();
    if (event.target && event.target.id === 'formAtividade') {
        let nome = document.getElementById('nome').value;
        let descricao = document.getElementById('descricao').value;

        fetch('/atividade', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome, descricao })
        })
        .then(response => response.json())
        .then(data => {
            alert('Atividade adicionada com sucesso');
            loadPage('main');
        });
    }
});
