# Projeto Node.js de Simulação de Conta Bancária

Este é um projeto Node.js que simula uma conta bancária com operações de depósito, saque e transações instantâneas semelhantes ao PIX.

## Estrutura de Pastas

- **src**
  - **config**: Configurações do projeto.
  - **database**: Arquivos para migrações e seeders do banco de dados.
  - **dtos**: Data objects usados para transferência de dados.
  - **entities**: Entidades relacionadas ao banco de dados.
  - **helpers**: Classes de apoio para a construção da lógica dos serviços.
  - **interfaces**
  - **middlewares**: Middlewares personalizados.
  - **queries**: Consultas personalizadas, se necessário, devido às limitações do ORM.
  - **repositories**: Classes que interagem com as entidades e o banco de dados.
  - **test**: Classes de teste do projeto.
  - **utils**: Classes utilitárias.

## Funcionalidades Principais

Este projeto inclui uma classe `GlobalRepository` que oferece as seguintes funcionalidades principais:

- `getDataByParameters`: Recuperação de dados com base em parâmetros.
- `updateData`: Atualização de dados.
- `createData`: Criação de novos registros.
- `deleteData`: Exclusão de registros.
- `deleteAllData`: Exclusão de todos os registros com base nos parâmetros.
- `executeQuery`: Execução de consultas personalizadas.

## Configuração Flexível

O projeto é configurado para permitir diferentes ambientes, onde o ambiente de desenvolvimento pode usar SQLite ou outro banco de dados configurável. Isso proporciona flexibilidade e evita conflitos entre os bancos de dados em diferentes ambientes.

- `.env`: Arquivo de configuração de variáveis de ambiente de produção.
- `.env.test`: Arquivo de configuração de variáveis de ambiente de teste.
- `.env.dev`: Arquivo de configuração de variáveis de ambiente de desenvolvimento.

## Documentação da API

Este projeto utiliza o Swagger para documentação da API. Você pode acessar a documentação da API em [URL_DO_SWAGGER](https://banksimulator23-a31f2fa31c93.herokuapp.com/api-docs/).

Para acessar a documentação da API em ambiente local, execute o projeto e acesse a URL [http://localhost:3001/api-docs](http://localhost:3001/api-docs).

## Como Executar

Instale o sequelize-cli globalmente:

```bash
npm install -g sequelize-cli
```

Instale as dependências:

```bash
npm install
```

Para rodar os testes:

```bash
npm test
```

Para rodar o projeto em modo de desenvolvimento:

```bash
npm run dev
```

### Variáveis de Ambiente
As variaveis estão citadas no arquivo .env.test

### Banco de dados
Para o ambiente de produção e desenvolvimento eu utilizei o banco Mysql, para o ambiente de teste utilizei o banco Sqlite.
Basta rodar as migrations para criar as tabelas no banco de dados.

```bash
NODE_ENV=variable npx sequelize-cli db:migrate
```

### Contribuições
Contribuições são bem-vindas! Sinta-se à vontade para fazer fork deste projeto e enviar pull requests com melhorias.
