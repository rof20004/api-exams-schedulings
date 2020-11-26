API Exams Schedulings
===

## Descrição

Serviço REST para gerenciamento de agendamentos de exames para os clientes cadastrados.

## Tecnologias

- Node v12
- Docker v19
- TypeScript v4
- Swagger v4
- MongoDB

## Arquitetura

O projeto utiliza o framework [NestJS](https://nestjs.com/) e é composto de módulos, sendo que cada módulo é estruturado utilizando a [n-tier architecture](https://pt.wikipedia.org/wiki/Arquitetura_multicamada). O projeto utiliza a [arquitetura orientada a serviços](https://pt.wikipedia.org/wiki/Service-oriented_architecture) e o [padrão rest](https://restfulapi.net/).

## Pré-requisitos

É necessário instalar os seguintes softwares para poder rodar o projeto localmente:

1. Node v12
2. Docker v19
3. Git
4. Yarn

**Obs.:** Todos os testes foram realizados no sistema operacional Debian Buster, portanto é aconselhável utilizar um sistema unix-like.

## Primeiros passos

1. Clonar o projeto
`$ git clone https://github.com/rof20004/api-exams-schedulings.git`

2. Instalar as dependências
`$ yarn`

3. Criar o container docker do banco de dados
`$ yarn docker:mongodb:create`

4. Rodar o projeto
`$ yarn start:dev`

## Utilização

Após o projeto estar rodando localmente você poderá acessar a interface do swagger para consumir os serviços:

1. Swagger Ui
`http://localhost:3000/api`

2. Remover o container do banco de dados(apagará todos os dados já salvos)
`yarn docker:mongodb:remove`

3. Rodar os testes unitários
`yarn test`

4. Rodar os testes de cobertura
`yarn test:cov`

## Swagger

A interface do swagger possui os serviços documentados e com exemplos de utilização, bem como explicação do significado de cada campo.