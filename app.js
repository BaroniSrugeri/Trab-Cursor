$(document).ready(function() {
    // Atualiza os contadores
    function atualizarContadores() {
        $('#totalClientes').text(getClientes().length);
        $('#totalProdutos').text(getProdutos().length);
        $('#totalServicos').text(getServicos().length);
        $('#totalVendas').text(getVendas().length);
    }

    // Atualiza a tabela de vendas
    function atualizarTabelaVendas() {
        const vendas = getVendas();
        const tbody = $('#tabelaVendas');
        tbody.empty();

        vendas.sort((a, b) => new Date(b.data) - new Date(a.data))
             .slice(0, 10)
             .forEach(venda => {
                 const cliente = getClienteById(venda.id_cliente);
                 const row = `
                     <tr>
                         <td>${venda.id}</td>
                         <td>${cliente ? cliente.nome : 'Cliente não encontrado'}</td>
                         <td>${new Date(venda.data).toLocaleDateString()}</td>
                         <td>${formatarMoeda(venda.valor_total)}</td>
                         <td>
                             <button class="btn btn-sm btn-info visualizar-venda" data-id="${venda.id}">
                                 <i class="fas fa-eye"></i>
                             </button>
                             <button class="btn btn-sm btn-danger excluir-venda" data-id="${venda.id}">
                                 <i class="fas fa-trash"></i>
                             </button>
                         </td>
                     </tr>
                 `;
                 tbody.append(row);
             });
    }

    // Atualiza o select de clientes
    function atualizarSelectClientes() {
        const select = $('#clienteVenda');
        select.empty().append('<option value="">Selecione o cliente...</option>');
        
        getClientes().forEach(cliente => {
            select.append(`<option value="${cliente.id}">${cliente.nome} - ${formatarCPF(cliente.cpf)}</option>`);
        });
    }

    // Atualiza o select de produtos
    function atualizarSelectProdutos() {
        $('.produto-select').each(function() {
            const select = $(this);
            const currentValue = select.val();
            select.empty().append('<option value="">Selecione um produto...</option>');
            
            getProdutos().forEach(produto => {
                select.append(`<option value="${produto.id}" data-preco="${produto.preco}">
                    ${produto.nome} - ${produto.marca} - ${formatarMoeda(produto.preco)}
                </option>`);
            });

            if (currentValue) {
                select.val(currentValue);
            }
        });
    }

    // Calcula o valor total da venda
    function calcularValorTotal() {
        let total = 0;
        $('#produtosVenda .input-group').each(function() {
            const produtoId = $(this).find('.produto-select').val();
            if (produtoId) {
                const produto = getProdutoById(parseInt(produtoId));
                const quantidade = parseInt($(this).find('.quantidade-input').val()) || 0;
                total += produto.preco * quantidade;
            }
        });
        $('#valorTotal').text(formatarMoeda(total));
        return total;
    }

    // Event Handlers
    // Formulário de Cliente
    $('#formCliente').on('submit', function(e) {
        e.preventDefault();
        
        if (!validarCamposObrigatorios($(this))) return;
        
        const cpf = $('#cpfCliente').val().replace(/[^\d]/g, '');
        if (!validarCPF(cpf)) {
            mostrarErro($('#cpfCliente'), 'CPF inválido');
            return;
        }

        const cliente = {
            nome: $('#nomeCliente').val(),
            cpf: cpf,
            telefone: $('#telefoneCliente').val()
        };

        addCliente(cliente);
        mostrarMensagem('success', 'Cliente cadastrado com sucesso!');
        $('#clienteModal').modal('hide');
        this.reset();
        atualizarContadores();
        atualizarSelectClientes();
    });

    // Formulário de Produto
    $('#formProduto').on('submit', function(e) {
        e.preventDefault();
        
        if (!validarCamposObrigatorios($(this))) return;

        const produto = {
            nome: $('#nomeProduto').val(),
            marca: $('#marcaProduto').val(),
            modelo: $('#modeloProduto').val(),
            tipo: $('#tipoProduto').val(),
            preco: parseFloat($('#precoProduto').val())
        };

        addProduto(produto);
        mostrarMensagem('success', 'Produto cadastrado com sucesso!');
        $('#produtoModal').modal('hide');
        this.reset();
        atualizarContadores();
        atualizarSelectProdutos();
    });

    // Formulário de Serviço
    $('#formServico').on('submit', function(e) {
        e.preventDefault();
        
        if (!validarCamposObrigatorios($(this))) return;

        const servico = {
            descricao: $('#descricaoServico').val(),
            preco: parseFloat($('#precoServico').val()),
            tempo_estimado: parseInt($('#tempoServico').val())
        };

        addServico(servico);
        mostrarMensagem('success', 'Serviço cadastrado com sucesso!');
        $('#servicoModal').modal('hide');
        this.reset();
        atualizarContadores();
    });

    // Adicionar novo produto na venda
    $('#produtosVenda').on('click', '.adicionar-produto', function() {
        const novoProduto = `
            <div class="input-group mb-2">
                <select class="form-control produto-select">
                    <option value="">Selecione um produto...</option>
                </select>
                <input type="number" class="form-control quantidade-input" placeholder="Qtd" min="1" value="1">
                <div class="input-group-append">
                    <button type="button" class="btn btn-danger remover-produto">-</button>
                </div>
            </div>
        `;
        $(this).closest('.input-group').after(novoProduto);
        atualizarSelectProdutos();
    });

    // Remover produto da venda
    $('#produtosVenda').on('click', '.remover-produto', function() {
        $(this).closest('.input-group').remove();
        calcularValorTotal();
    });

    // Atualizar valor total quando quantidade ou produto mudar
    $('#produtosVenda').on('change', '.produto-select, .quantidade-input', calcularValorTotal);
    $('#produtosVenda').on('input', '.quantidade-input', calcularValorTotal);

    // Formulário de Venda
    $('#formVenda').on('submit', function(e) {
        e.preventDefault();
        
        if (!validarCamposObrigatorios($(this))) return;

        const produtos = [];
        let isValid = true;

        $('#produtosVenda .input-group').each(function() {
            const produtoId = $(this).find('.produto-select').val();
            const quantidade = parseInt($(this).find('.quantidade-input').val());

            if (!produtoId || !quantidade) {
                mostrarErro($(this).find('.produto-select'), 'Selecione um produto e quantidade');
                isValid = false;
                return false;
            }

            produtos.push({
                id_produto: parseInt(produtoId),
                quantidade: quantidade
            });
        });

        if (!isValid) return;

        const venda = {
            id_cliente: parseInt($('#clienteVenda').val()),
            data: $('#dataVenda').val(),
            produtos: produtos,
            valor_total: calcularValorTotal()
        };

        addVenda(venda);
        mostrarMensagem('success', 'Venda registrada com sucesso!');
        $('#vendaModal').modal('hide');
        this.reset();
        $('#produtosVenda').html(`
            <div class="input-group mb-2">
                <select class="form-control produto-select">
                    <option value="">Selecione um produto...</option>
                </select>
                <input type="number" class="form-control quantidade-input" placeholder="Qtd" min="1" value="1">
                <div class="input-group-append">
                    <button type="button" class="btn btn-success adicionar-produto">+</button>
                </div>
            </div>
        `);
        atualizarContadores();
        atualizarTabelaVendas();
    });

    // Excluir venda
    $('#tabelaVendas').on('click', '.excluir-venda', function() {
        const id = parseInt($(this).data('id'));
        if (confirm('Tem certeza que deseja excluir esta venda?')) {
            deleteVenda(id);
            mostrarMensagem('success', 'Venda excluída com sucesso!');
            atualizarContadores();
            atualizarTabelaVendas();
        }
    });

    // Visualizar venda
    $('#tabelaVendas').on('click', '.visualizar-venda', function() {
        const id = parseInt($(this).data('id'));
        const venda = getVendaById(id);
        const cliente = getClienteById(venda.id_cliente);
        
        let produtosHtml = '';
        venda.produtos.forEach(item => {
            const produto = getProdutoById(item.id_produto);
            produtosHtml += `
                <tr>
                    <td>${produto.nome}</td>
                    <td>${item.quantidade}</td>
                    <td>${formatarMoeda(produto.preco)}</td>
                    <td>${formatarMoeda(produto.preco * item.quantidade)}</td>
                </tr>
            `;
        });

        const detalhesHtml = `
            <div class="modal" id="detalhesVendaModal">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Detalhes da Venda #${venda.id}</h5>
                            <button type="button" class="close" data-dismiss="modal">
                                <span>&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <p><strong>Cliente:</strong> ${cliente.nome}</p>
                            <p><strong>Data:</strong> ${new Date(venda.data).toLocaleDateString()}</p>
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>Produto</th>
                                        <th>Quantidade</th>
                                        <th>Preço Unit.</th>
                                        <th>Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${produtosHtml}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colspan="3" class="text-right"><strong>Total:</strong></td>
                                        <td>${formatarMoeda(venda.valor_total)}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Remove qualquer modal de detalhes existente
        $('#detalhesVendaModal').remove();
        // Adiciona o novo modal ao body
        $('body').append(detalhesHtml);
        // Exibe o modal
        $('#detalhesVendaModal').modal('show');
    });

    // Inicialização
    atualizarContadores();
    atualizarTabelaVendas();
    atualizarSelectClientes();
    atualizarSelectProdutos();

    // Limpa os formulários quando os modais são fechados
    $('.modal').on('hidden.bs.modal', function() {
        $(this).find('form').trigger('reset');
        $(this).find('.is-invalid').removeClass('is-invalid');
        $(this).find('.invalid-feedback').remove();
    });
}); 