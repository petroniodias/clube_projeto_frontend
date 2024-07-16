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
                document.getElementById('form-title').innerText = 'Adicionar Atividade';
                document.getElementById('formAtividade').reset();
            });
    }
}

function loadAtividades() {
    fetch('/atividade')
        .then(response => response.json())
        .then(atividades => {
            let atividadeList = document.getElementById('atividade-list');
            atividadeList.innerHTML = `
                <h2>Lista de Atividades</h2>
                <table>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Descrição</th>
                        <th>Ações</th>
                    </tr>
                </table>
            `;
            let table = atividadeList.querySelector('table');
            atividades.forEach(atividade => {
                let row = table.insertRow();
                row.insertCell(0).innerText = atividade.id;
                row.insertCell(1).innerText = atividade.nome;
                row.insertCell(2).innerText = atividade.descricao;
                let actionsCell = row.insertCell(3);
                actionsCell.innerHTML = `
                    <button class="edit" onclick="editAtividade(${atividade.id})">Editar</button>
                    <button class="delete" onclick="deleteAtividade(${atividade.id})">Excluir</button>
                `;
            });
        });
}

function editAtividade(id) {
    fetch(`/atividade/${id}`)
        .then(response => response.json())
        .then(atividade => {
            loadPage('add');
            document.getElementById('form-title').innerText = 'Editar Atividade';
            document.getElementById('atividade-id').value = atividade.id;
            document.getElementById('nome').value = atividade.nome;
            document.getElementById('descricao').value = atividade.descricao;
        });
}

function deleteAtividade(id) {
    if (confirm("Tem certeza que deseja excluir esta atividade?")) {
        fetch(`/atividade/${id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                loadAtividades();
            } else {
                alert("Falha ao excluir a atividade.");
            }
        });
    }
}

document.addEventListener('submit', function(event) {
    event.preventDefault();
    if (event.target && event.target.id === 'formAtividade') {
        let id = document.getElementById('atividade-id').value;
        let nome = document.getElementById('nome').value;
        let descricao = document.getElementById('descricao').value;

        let method = id ? 'PUT' : 'POST';
        let url = id ? `/atividade/${id}` : '/atividade';

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome, descricao })
        })
        .then(response => response.json())
        .then(data => {
            alert(`Atividade ${id ? 'atualizada' : 'adicionada'} com sucesso`);
            loadPage('main');
        });
    }
});
