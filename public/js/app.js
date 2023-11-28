function carregarAutores() {
    fetch("/api/autores")
    .then(response => response.json())
    .then(autores => {
      const autorSelect = document.getElementById("autor");
      autores.forEach(autor => {
        const option = document.createElement("option");
        option.value = autor.id;
        option.textContent = autor.nome;
        autorSelect.appendChild(option);
      });
})
.catch(error => console.error("Erro ao carregar autores:", error));
}

function carregarEditoras() {
    fetch("/api/editora")
    .then(response => response.json())
    .then(editoras => {
      const editoraSelect = document.getElementById("editora");
      editoras.forEach(editora => {
        const option = document.createElement("option");
        option.value = editora.id;
        option.textContent = editora.nome;
        editoraSelect.appendChild(option);
      });
    })
    .catch(error => console.error("Erro ao carregar editoras:", error));
  }

  function displayAutores(autor) {
    const tbody = document.getElementById("listaAutores");
    tbody.innerHTML = ""; // Limpar a tabela

    autor.forEach(autor => {
        const row = tbody.insertRow();

        const nomeCell = row.insertCell(0);
        nomeCell.textContent = autor.nome;

        const dataCell = row.insertCell(1);
        dataCell.textContent = new Date(autor.dataNascimento).toLocaleDateString();

        const actionsCell = row.insertCell(2);
        actionsCell.innerHTML = `<button class="icon-btn" onclick='editarAutores(${JSON.stringify(autor)})'>
        <i class="fas fa-edit"></i> Editar
    </button>
    <button class="icon-btn" onclick="deleteAutores(${autor.id})">
    <i class="fas fa-trash"></i> Excluir
    </button>`;
    });
  }

  function displayEditoras(editora) {
    const tbody = document.getElementById("listaEditoras");
    tbody.innerHTML = ""; // Limpar a tabela

    editora.forEach(editora => {
        const row = tbody.insertRow();

        const nomeCell = row.insertCell(0);
        nomeCell.textContent = editora.nome;

        const enderecoCell = row.insertCell(1);
        enderecoCell.textContent = editora.endereco;

        const telefoneCell = row.insertCell(2);
        telefoneCell.textContent = editora.telefone;

        const actionsCell = row.insertCell(2);
        actionsCell.innerHTML = `<button class="icon-btn" onclick='editarEditoras(${JSON.stringify(editora)})'>
        <i class="fas fa-edit"></i> Editar
    </button>
    <button class="icon-btn" onclick="deleteEditoras(${editora.id})">
    <i class="fas fa-trash"></i> Excluir
    </button>`;
    });
  }
  

  function fetchAutores() {
    fetch("/api/autores")
        .then(res => res.json())
        .then(data => {
            displayAutores(data);
        })
        .catch(error => {
            console.error("Erro ao buscar autores:", error);
        });
}

function deleteAutores(id) {
    fetch(`/api/autores/${id}`, {
        method: "DELETE"
    })
    .then(res => {
        if (!res.ok) throw new Error(res.statusText);
        fetchAutores();
    })
    .catch(error => {
        console.error("Erro ao deletar autores:", error);
    });
}

function fetchEditoras() {
    fetch("/api/editora")
        .then(res => res.json())
        .then(data => {
            displayEditoras(data);
        })
        .catch(error => {
            console.error("Erro ao buscar editoras:", error);
        });
}

function deleteEditoras(id) {
    fetch(`/api/editora/${id}`, {
        method: "DELETE"
    })
    .then(res => {
        if (!res.ok) throw new Error(res.statusText);
        fetchEditoras();
    })
    .catch(error => {
        console.error("Erro ao deletar editoras:", error);
    });
}


function editarAutores(autor) {
    const addautorBtn = document.getElementById("addautorBtn");
    const titulo = document.getElementById("titulo");
    const nome = document.getElementById("nome");
    const dataNascimento = document.getElementById("dataNascimento");
    const autorId= document.getElementById("id_autor");
    titulo.value = autor.titulo;
    autor.value = autor.nome;
    autorId.value = autor.id;
    addautorBtn.click();
/**/
}

function editarAutores(editora) {
    const addeditoraBtn = document.getElementById("addeditoraBtn");
    const titulo = document.getElementById("titulo");
    const nome = document.getElementById("nome");
    const endereco = document.getElementById("endereço");
    const telefone = document.getElementById("telefone");
    const editoraId= document.getElementById("id_editora");
    titulo.value = editora.titulo;
    autor.value = autor.nome;
    telefone.value = new Date(autor.telefone).toISOString().split('T')[0];
    editoraId.value = editora.id;
    addeditoraBtn.click();
/**/
}

function limparFormulario(){
    const titulo = document.getElementById("titulo");
    const nome = document.getElementById("autor");
    const dataNascimento = document.getElementById("dataNascimento");
    const livroId= document.getElementById("id_livro");

    titulo.value = "";
    nome.value = "";
    dataNascimento.value = "";
    livroId.value = "";
}

document.addEventListener("DOMContentLoaded", function() {
    carregarAutores();
    carregarEditoras();

    const apiUrl = "/api/livros";
    const autorForm = document.getElementById("autorForm");
    const autorPopup = document.getElementById("autorPopup");
    const addautorBtn = document.getElementById("addautorBtn");
    const closePopupBtn = document.getElementById("closePopupBtn");

    // Carregar livros ao carregar a página
    fetchAutores()

    // Mostrar popup ao clicar no botão "Adicionar Livro"
    addautorBtn.addEventListener("click", function() {
        autorPopup.classList.add("show");
        autorPopup.classList.remove("hidden");
    });

    // Fechar popup
    closePopupBtn.addEventListener("click", function() {
        autorPopup.classList.add("hidden");
        autorPopup.classList.remove("show");
        limparFormulario();
    });

    // Adicionar novo livro ou atualizar um existente
    autorForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const titulo = document.getElementById("titulo").value;
        const nome = document.getElementById("nome").value;
        const dataNascimento = document.getElementById("dataNascimento").value;
        const autorId= document.getElementById("id_editora").value;

        let methodSalvar = "POST";
        let apiUrlSalvar = apiUrl;
        if(autorId != "" && autorId > 0){
            methodSalvar = "PUT";
            apiUrlSalvar += "/" + autorId;
        }
    
        fetch(apiUrlSalvar, {
            method: methodSalvar,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ titulo, nome, dataNascimento })
        })
        .then(res => {
            if (res.ok && res.status == "201") return res.json();
            else if (res.ok && res.status == "204") return;
            throw new Error(res.statusText);
        })
        .then(data => {
            fetchAutores();
            limparFormulario();
            closePopupBtn.click();
        })
        .catch(error => {
            console.error("Erro ao adicionar/atualizar autores:", error);
        });
    
    });
});




function limparFormulario(){
    const titulo = document.getElementById("titulo");
    const autor = document.getElementById("nome");
    const endereco = document.getElementById("endereço");
    const dataNascimento = document.getElementById("telefone");
    const livroId= document.getElementById("id_livro");

    titulo.value = "";
    autor.value = "";
    dataNascimento.value = "";
    livroId.value = "";
}

document.addEventListener("DOMContentLoaded", function() {
    carregarAutores();
    carregarEditoras();

    const apiUrl = "/api/livros";
    const editoraForm = document.getElementById("editoraForm");
    const editoraPopup = document.getElementById("editoraPopup");
    const addeditoraBtn = document.getElementById("addeditoraBtn");
    const closePopupBtn = document.getElementById("closePopupBtn");

    // Carregar livros ao carregar a página
    fetchAutores()

    // Mostrar popup ao clicar no botão "Adicionar Livro"
    addautorBtn.addEventListener("click", function() {
        editoraPopup.classList.add("show");
        editoraPopup.classList.remove("hidden");
    });

    // Fechar popup
    closePopupBtn.addEventListener("click", function() {
        editoraPopup.classList.add("hidden");
        editoraPopup.classList.remove("show");
        limparFormulario();
    });

    // Adicionar novo livro ou atualizar um existente
    editoraForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const titulo = document.getElementById("titulo").value;
        const nome = document.getElementById("nome").value;
        const endereco = document.getElementById("endereco").value;
        const telefone = document.getElementById("telefone").value;
        const editoraId= document.getElementById("id_editora").value;

        let methodSalvar = "POST";
        let apiUrlSalvar = apiUrl;
        if(livroId != "" && livroId > 0){
            methodSalvar = "PUT";
            apiUrlSalvar += "/" + livroId;
        }
    
        fetch(apiUrlSalvar, {
            method: methodSalvar,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ titulo, autor, dataNascimento })
        })
        .then(res => {
            if (res.ok && res.status == "201") return res.json();
            else if (res.ok && res.status == "204") return;
            throw new Error(res.statusText);
        })
        .then(data => {
            fetchEditoras();
            limparFormulario();
            closePopupBtn.click();
        })
        .catch(error => {
            console.error("Erro ao adicionar/atualizar editoras:", error);
        });
    
    });
});
