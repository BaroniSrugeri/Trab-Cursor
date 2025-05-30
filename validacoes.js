function validarCPF(cpf) {
    // Remove caracteres não numéricos
    cpf = cpf.replace(/[^\d]/g, '');

    // Verifica se o CPF tem 11 dígitos
    if (cpf.length !== 11) return false;

    // Verifica se todos os dígitos são iguais (ex: 111.111.111-11)
    if (/^(\d)\1{10}$/.test(cpf)) return false;

    // Validação do primeiro dígito verificador
    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = soma % 11;
    let digitoVerificador1 = (resto < 2) ? 0 : 11 - resto;
    
    if (digitoVerificador1 !== parseInt(cpf.charAt(9))) return false;

    // Validação do segundo dígito verificador
    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = soma % 11;
    let digitoVerificador2 = (resto < 2) ? 0 : 11 - resto;

    return digitoVerificador2 === parseInt(cpf.charAt(10));
}
// Função para formatar CPF


// Função para validar data
function validarData(data) {
    const dataObj = new Date(data);
    return dataObj instanceof Date && !isNaN(dataObj) && dataObj <= new Date();
}

// Função para formatar moeda
function formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor);
}

// Função para validar campos obrigatórios
function validarCamposObrigatorios(form) {
    let isValid = true;
    form.find('[required]').each(function() {
        if (!$(this).val()) {
            mostrarErro($(this), 'Este campo é obrigatório');
            isValid = false;
        } else {
            limparErro($(this));
        }
    });
    return isValid;
}

// Função para mostrar erro
function mostrarErro(elemento, mensagem) {
    elemento.addClass('is-invalid');
    if (!elemento.next('.invalid-feedback').length) {
        elemento.after(`<div class="invalid-feedback">${mensagem}</div>`);
    } else {
        elemento.next('.invalid-feedback').text(mensagem);
    }
}

// Função para limpar erro
function limparErro(elemento) {
    elemento.removeClass('is-invalid');
    elemento.next('.invalid-feedback').remove();
}

// Função para mostrar mensagem de sucesso ou erro
function mostrarMensagem(tipo, mensagem) {
    const alertDiv = $('#mensagens');
    alertDiv.removeClass('alert-success alert-danger')
           .addClass(`alert-${tipo}`)
           .html(mensagem)
           .fadeIn();
    
    setTimeout(() => {
        alertDiv.fadeOut();
    }, 3000);
}

// Event listeners para validação em tempo real
$(document).ready(function() {
    // Validação de CPF
    $('#cpfCliente').on('input', function() {
        const cpf = $(this).val().replace(/[^\d]/g, '');
        if (cpf.length === 11) {
            if (validarCPF(cpf)) {
                $(this).val(formatarCPF(cpf));
                limparErro($(this));
            } else {
                mostrarErro($(this), 'CPF inválido');
            }
        }
    });

    // Validação de data
    $('#dataVenda').on('change', function() {
        if (!validarData($(this).val())) {
            mostrarErro($(this), 'Data inválida');
        } else {
            limparErro($(this));
        }
    });

    // Validação de preço
    $('#precoProduto, #precoServico').on('input', function() {
        const valor = parseFloat($(this).val());
        if (isNaN(valor) || valor <= 0) {
            mostrarErro($(this), 'Preço deve ser maior que zero');
        } else {
            limparErro($(this));
        }
    });

    // Validação de tempo estimado
    $('#tempoServico').on('input', function() {
        const tempo = parseInt($(this).val());
        if (isNaN(tempo) || tempo <= 0) {
            mostrarErro($(this), 'Tempo estimado deve ser maior que zero');
        } else {
            limparErro($(this));
        }
    });
}); 