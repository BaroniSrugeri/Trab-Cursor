# Sistema de Gerenciamento - Pet Shop

Um sistema web responsivo para gerenciamento de pet shop, desenvolvido com HTML, CSS, JavaScript e Bootstrap 4.

## Funcionalidades

- Cadastro de clientes com validação de CPF
- Cadastro de produtos com categorização
- Cadastro de serviços com tempo estimado
- Registro de vendas com múltiplos produtos
- Visualização de histórico de vendas
- Interface responsiva e amigável
- Validações em tempo real
- Armazenamento local dos dados

## Tecnologias Utilizadas

- HTML5
- CSS3
- JavaScript (ES6+)
- Bootstrap 4
- jQuery
- LocalStorage para persistência de dados

## Como Usar

1. Abra o arquivo `index.html` em um navegador web moderno
2. O sistema já estará pronto para uso
3. Use o menu superior para acessar as diferentes funcionalidades:
   - Clientes
   - Produtos
   - Serviços
   - Vendas

## Estrutura de Dados

### Clientes
- ID (gerado automaticamente)
- Nome
- CPF (com validação)
- Telefone

### Produtos
- ID (gerado automaticamente)
- Nome
- Marca
- Modelo
- Tipo
- Preço

### Serviços
- ID (gerado automaticamente)
- Descrição
- Preço
- Tempo Estimado

### Vendas
- ID (gerado automaticamente)
- ID do Cliente
- Data
- Produtos (lista com ID do produto e quantidade)
- Valor Total

## Validações

- CPF: Verifica se é um CPF válido e formata automaticamente
- Campos obrigatórios: Todos os campos marcados com * são obrigatórios
- Preços: Devem ser valores positivos maiores que zero
- Data: Não permite datas futuras
- Quantidade: Deve ser maior que zero

## Armazenamento

O sistema utiliza o LocalStorage do navegador para armazenar os dados, o que significa que:
- Os dados persistem mesmo após fechar o navegador
- Os dados são armazenados apenas localmente
- Não é necessário configurar banco de dados

## Limitações

- Por utilizar LocalStorage, os dados ficam limitados ao navegador local
- O espaço de armazenamento é limitado (geralmente 5-10 MB)
- Não há sincronização entre diferentes dispositivos

## Sugestões de Melhorias Futuras

1. Implementar backend com banco de dados real
2. Adicionar sistema de autenticação
3. Implementar relatórios e gráficos
4. Adicionar sistema de backup dos dados
5. Implementar busca e filtros avançados
6. Adicionar foto dos produtos
7. Implementar sistema de desconto
8. Adicionar histórico de serviços por cliente 