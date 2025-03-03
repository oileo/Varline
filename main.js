const addButton = document.getElementById('addVariable');
const form = document.getElementById('variableForm');

addButton.addEventListener('click', function() {
    form.classList.toggle('show');
});

function generateUniqueId() {
    return Math.random().toString(36).substr(2, 9);
}

function addVariable() {
    let name = document.getElementById('varName').value.replaceAll(" ", "-");
    let value = document.getElementById('varValue').value;
    let token = Date.now();

    if (!name || !value) {
        alert("Preencha todos os campos!");
        return;
    }

    let varId = generateUniqueId() + generateUniqueId();
    let sendLink = `${window.location.href}api/${varId}-${name}`;

    let varList = document.getElementById('variables');
    let varDiv = document.createElement('div');
    varDiv.classList.add('variable');
    varDiv.innerHTML = `
        <div class="variable-title">${name}</div>
        <div class="variable-value">Valor: <span id="${varId}">${value}</span></div>
        <button onclick="copyLink('${sendLink}')">Link de get</button>
    `;

    varList.appendChild(varDiv);
    form.classList.remove('show');

    let _data = {
        title: `/${varId}-${name}`,
        value: value,
        token: `${token}${Date.now()}`
    }

    fetch("./post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(_data)
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message);
    })
    .catch(error => console.error("Erro:", error));
}

function copyLink(link) {
    navigator.clipboard.writeText(link).then(() => {
        alert("Link copiado!");
    });
}