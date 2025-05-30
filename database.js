// Estrutura inicial do banco de dados
const DB_STRUCTURE = {
    clientes: [],
    produtos: [],
    servicos: [],
    vendas: []
};

// Inicialização do banco de dados
function initDB() {
    if (!localStorage.getItem('petshopDB')) {
        localStorage.setItem('petshopDB', JSON.stringify(DB_STRUCTURE));
    }
}

// Função para obter o banco de dados
function getDB() {
    return JSON.parse(localStorage.getItem('petshopDB'));
}

// Função para salvar o banco de dados
function saveDB(db) {
    localStorage.setItem('petshopDB', JSON.stringify(db));
}

// Funções para Clientes
function addCliente(cliente) {
    const db = getDB();
    cliente.id = Date.now();
    db.clientes.push(cliente);
    saveDB(db);
    return cliente;
}

function getClientes() {
    return getDB().clientes;
}

function getClienteById(id) {
    return getDB().clientes.find(cliente => cliente.id === id);
}

function updateCliente(id, novosDados) {
    const db = getDB();
    const index = db.clientes.findIndex(cliente => cliente.id === id);
    if (index !== -1) {
        db.clientes[index] = { ...db.clientes[index], ...novosDados };
        saveDB(db);
        return true;
    }
    return false;
}

function deleteCliente(id) {
    const db = getDB();
    db.clientes = db.clientes.filter(cliente => cliente.id !== id);
    saveDB(db);
}

// Funções para Produtos
function addProduto(produto) {
    const db = getDB();
    produto.id = Date.now();
    db.produtos.push(produto);
    saveDB(db);
    return produto;
}

function getProdutos() {
    return getDB().produtos;
}

function getProdutoById(id) {
    return getDB().produtos.find(produto => produto.id === id);
}

function updateProduto(id, novosDados) {
    const db = getDB();
    const index = db.produtos.findIndex(produto => produto.id === id);
    if (index !== -1) {
        db.produtos[index] = { ...db.produtos[index], ...novosDados };
        saveDB(db);
        return true;
    }
    return false;
}

function deleteProduto(id) {
    const db = getDB();
    db.produtos = db.produtos.filter(produto => produto.id !== id);
    saveDB(db);
}

// Funções para Serviços
function addServico(servico) {
    const db = getDB();
    servico.id = Date.now();
    db.servicos.push(servico);
    saveDB(db);
    return servico;
}

function getServicos() {
    return getDB().servicos;
}

function getServicoById(id) {
    return getDB().servicos.find(servico => servico.id === id);
}

function updateServico(id, novosDados) {
    const db = getDB();
    const index = db.servicos.findIndex(servico => servico.id === id);
    if (index !== -1) {
        db.servicos[index] = { ...db.servicos[index], ...novosDados };
        saveDB(db);
        return true;
    }
    return false;
}

function deleteServico(id) {
    const db = getDB();
    db.servicos = db.servicos.filter(servico => servico.id !== id);
    saveDB(db);
}

// Funções para Vendas
function addVenda(venda) {
    const db = getDB();
    venda.id = Date.now();
    venda.data = new Date(venda.data).toISOString();
    db.vendas.push(venda);
    saveDB(db);
    return venda;
}

function getVendas() {
    return getDB().vendas;
}

function getVendaById(id) {
    return getDB().vendas.find(venda => venda.id === id);
}

function getVendasByCliente(clienteId) {
    return getDB().vendas.filter(venda => venda.id_cliente === clienteId);
}

function updateVenda(id, novosDados) {
    const db = getDB();
    const index = db.vendas.findIndex(venda => venda.id === id);
    if (index !== -1) {
        if (novosDados.data) {
            novosDados.data = new Date(novosDados.data).toISOString();
        }
        db.vendas[index] = { ...db.vendas[index], ...novosDados };
        saveDB(db);
        return true;
    }
    return false;
}

function deleteVenda(id) {
    const db = getDB();
    db.vendas = db.vendas.filter(venda => venda.id !== id);
    saveDB(db);
}

// Inicializa o banco de dados quando o arquivo é carregado
initDB(); 