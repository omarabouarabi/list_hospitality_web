document.addEventListener('DOMContentLoaded', () => {
    // Dados iniciais dos clientes
    let clients = {
        '3.0 Web Plus': [
            { name: 'AFPESP PERUIBE II', code: '6947', image: 'Gemini_Generated_Image_tfvj6ptfvj6ptfvj.png' }
        ],
        'Light Web Plus': [
            { name: 'Bella Vista', code: '5927', image: 'Gemini_Generated_Image_tfvj6ptfvj6ptfvj.png' }
        ]
    };

    // Carregar dados do localStorage se existirem
    const savedClients = localStorage.getItem('clientsData');
    if (savedClients) {
        clients = JSON.parse(savedClients);
    }

    const webPlusList = document.getElementById('web-plus-list');
    const lightWebPlusList = document.getElementById('light-web-plus-list');
    const modal = document.getElementById('add-client-modal');
    const addClientBtn = document.getElementById('add-client-btn');
    const exportDataBtn = document.getElementById('export-data-btn');
    const closeBtn = document.querySelector('.close');
    const cancelBtn = document.getElementById('cancel-btn');
    const addClientForm = document.getElementById('add-client-form');

    // Função para criar um card de cliente
    function createClientCard(client) {
        const card = document.createElement('div');
        card.className = 'client-card';

        const image = document.createElement('img');
        image.src = client.image;
        image.alt = `Logo de ${client.name}`;
        image.onerror = function() {
            this.src = 'Gemini_Generated_Image_tfvj6ptfvj6ptfvj.png'; // Fallback para imagem padrão
        };

        const name = document.createElement('h3');
        name.textContent = client.name;

        const code = document.createElement('p');
        code.textContent = `Código: ${client.code}`;

        const link = document.createElement('a');
        link.href = `https://30wplus.desbravadorweb.com.br/acesso/${client.code}`;
        link.textContent = 'Acessar Sistema';
        link.target = '_blank';

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '🗑️ Remover';
        deleteBtn.className = 'delete-btn';
        deleteBtn.style.cssText = `
            background: #dc3545;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 0.8em;
            cursor: pointer;
            margin-top: 10px;
            transition: all 0.3s ease;
        `;
        
        deleteBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm(`Tem certeza que deseja remover ${client.name}?`)) {
                removeClient(client);
            }
        });

        deleteBtn.addEventListener('mouseenter', () => {
            deleteBtn.style.background = '#c82333';
            deleteBtn.style.transform = 'translateY(-2px)';
        });

        deleteBtn.addEventListener('mouseleave', () => {
            deleteBtn.style.background = '#dc3545';
            deleteBtn.style.transform = 'translateY(0)';
        });

        card.appendChild(image);
        card.appendChild(name);
        card.appendChild(code);
        card.appendChild(link);
        card.appendChild(deleteBtn);

        return card;
    }

    // Função para renderizar todos os clientes
    function renderClients() {
        // Limpar listas existentes
        webPlusList.innerHTML = '';
        lightWebPlusList.innerHTML = '';

        // Renderizar clientes 3.0 Web Plus
        clients['3.0 Web Plus'].forEach(client => {
            webPlusList.appendChild(createClientCard(client));
        });

        // Renderizar clientes Light Web Plus
        clients['Light Web Plus'].forEach(client => {
            lightWebPlusList.appendChild(createClientCard(client));
        });

        // Salvar no localStorage
        localStorage.setItem('clientsData', JSON.stringify(clients));
    }

    // Função para adicionar novo cliente
    function addClient(clientData) {
        const { name, code, type, image } = clientData;
        const newClient = {
            name: name,
            code: code,
            image: image || 'Gemini_Generated_Image_tfvj6ptfvj6ptfvj.png'
        };

        clients[type].push(newClient);
        renderClients();
    }

    // Função para remover cliente
    function removeClient(clientToRemove) {
        for (const type in clients) {
            clients[type] = clients[type].filter(client => 
                client.code !== clientToRemove.code || client.name !== clientToRemove.name
            );
        }
        renderClients();
    }

    // Função para exportar dados
    function exportData() {
        const dataStr = JSON.stringify(clients, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = 'clientes_3.0web.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    // Event Listeners
    addClientBtn.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    cancelBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    exportDataBtn.addEventListener('click', exportData);

    addClientForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const clientData = {
            name: document.getElementById('client-name').value,
            code: document.getElementById('client-code').value,
            type: document.getElementById('client-type').value,
            image: document.getElementById('client-image').value
        };

        // Validar se o código já existe
        const codeExists = Object.values(clients).flat().some(client => client.code === clientData.code);
        if (codeExists) {
            alert('Este código de cliente já existe! Por favor, use um código diferente.');
            return;
        }

        addClient(clientData);
        modal.style.display = 'none';
        addClientForm.reset();
        
        // Mostrar mensagem de sucesso
        const successMsg = document.createElement('div');
        successMsg.textContent = `Cliente ${clientData.name} adicionado com sucesso!`;
        successMsg.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            z-index: 1001;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(successMsg);
        setTimeout(() => {
            document.body.removeChild(successMsg);
        }, 3000);
    });

    // Renderizar clientes iniciais
    renderClients();

    // Adicionar animação de entrada
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(100px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        .delete-btn:hover {
            background: #c82333 !important;
            transform: translateY(-2px) !important;
        }
    `;
    document.head.appendChild(style);
});


