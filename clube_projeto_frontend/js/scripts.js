document.addEventListener("DOMContentLoaded", function() {
    loadComponent('header', 'partials/header.html');
    loadComponent('nav', 'partials/nav.html');
    loadComponent('footer', 'partials/footer.html');
    loadPage('socio-list');
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
    if (page === 'socio-list') {
        fetch('partials/main.html')
            .then(response => response.text())
            .then(data => {
                contentDiv.innerHTML = data;
                document.getElementById('socio-list').style.display = 'block';
                loadSocios();
            });
    } else if (page === 'socio-add') {
        fetch('partials/main.html')
            .then(response => response.text())
            .then(data => {
                contentDiv.innerHTML = data;
                document.getElementById('socio-form').style.display = 'block';
                document.getElementById('socio-list').style.display = 'none';
                document.getElementById('socio-form-title').innerText = 'Adicionar Sócio';
                document.getElementById('formSocio').reset();
            });
    } else if (page === 'atividade-list') {
        fetch('partials/main.html')
            .then(response => response.text())
            .then(data => {
                contentDiv.innerHTML = data;
                document.getElementById('atividade-list').style.display = 'block';
                loadAtividades();
            });
    } else if (page === 'atividade-add') {
        fetch('partials/main.html')
            .then(response => response.text())
            .then(data => {
                contentDiv.innerHTML = data;
                document.getElementById('atividade-form').style.display = 'block';
                document.getElementById('atividade-list').style.display = 'none';
                document.getElementById('atividade-form-title').innerText = 'Adicionar Atividade';
                document.getElementById('formAtividade').reset();
            });
    }
}

function loadSocios() {
    fetch('/socio')
        .then(response => response.json())
        .then(socios => {
            let socioList = document.getElementById('socio-list');
            socioList.innerHTML = `
                <h2>Lista de Sócios</h2>
                <table>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Ações</th>
                    </tr>
                </table>
            `;
            let table = socioList.querySelector('table');
            socios.forEach(socio => {
                let row = table.insertRow();
                row.insertCell(0).innerText = socio.id;
                row.insertCell(1).innerText = socio.nome;
                let actionsCell = row.insertCell(2);
                actionsCell.innerHTML = `
                    <button class="edit" onclick="editSocio(${socio.id})">Editar</button>
                    <button class="delete" onclick="deleteSocio(${socio.id})">Excluir</button>
                `;
            });
        });
}

function editSocio(id) {
    fetch(`/socio/${id}`)
        .then(response => response.json())
        .then(socio => {
            loadPage('socio-add');
            document.getElementById('socio-form-title').innerText = 'Editar Sócio';
            document.getElementById('socio-id').value = socio.id;
            document.getElementById('socio-nome').value = socio.nome;
            document.getElementById('socio-endereco').value = socio.endereco;
            document.getElementById('socio-cpf').value = socio.cpf;
            document.getElementById('socio-telefone').value = socio.telefone;
            document.getElementById('socio-email').value = socio.email;
        });
}

function deleteSocio(id) {
    if (confirm("Tem certeza que deseja excluir este sócio?")) {
        fetch(`/socio/${id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                loadSocios();
            } else {
                alert("Falha ao excluir o sócio.");
            }
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
            loadPage('atividade-add');
            document.getElementById('atividade-form-title').innerText = 'Editar Atividade';
            document.getElementById('atividade-id').value = atividade.id;
            document.getElementById('atividade-nome').value = atividade.nome;
            document.getElementById('atividade-descricao').value = atividade.descricao;
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
    if (event.target && event.target.id === 'formSocio') {
        let id = document.getElementById('socio-id').value;
        let nome = document.getElementById('socio-nome').value;
        let endereco = document.getElementById('socio-endereco').value;
        let cpf = document.getElementById('socio-cpf').value;
        let telefone = document.getElementById('socio-telefone').value;
        let email = document.getElementById('socio-email').value;

        let method = id ? 'PUT' : 'POST';
        let url = id ? `/socio/${id}` : '/socio';

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome, endereco, cpf, telefone, email })
        })
        .then(response => response.json())
        .then(data => {
            alert(`Sócio ${id ? 'atualizado' : 'adicionado'} com sucesso`);
            loadPage('socio-list');
        });
    }

    if (event.target && event.target.id === 'formAtividade') {
        let id = document.getElementById('atividade-id').value;
        let nome = document.getElementById('atividade-nome').value;
        let descricao = document.getElementById('atividade-descricao').value;

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
            loadPage('atividade-list');
        });
    }
});
