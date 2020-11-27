<h1 align="center">
    API Exams Schedulings
</h1>

<p align="center">
  <a target="_blank" href="https://travis-ci.org/github/rof20004/api-exams-schedulings"><img src="https://travis-ci.org/rof20004/api-exams-schedulings.svg?branch=master" alt="Build status" /></a>
</p>

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

- Node v12
- Docker v19
- Git
- Yarn

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

Após o projeto estar rodando localmente você poderá acessar a interface do swagger para consumir os serviços. A interface possui os serviços documentados e com exemplos de utilização, bem como explicação do significado de cada campo.

- Swagger Ui
`http://localhost:3000/api`

## Scripts

Abaixo alguns scripts disponíveis. Todos os scripts estão disponíveis na propriedade "scripts" dentro do package.json.

- Remover o container do banco de dados(apagará todos os dados já salvos)
`yarn docker:mongodb:remove`

- Rodar os testes unitários
`yarn test`

- Rodar os testes de cobertura
`yarn test:cov`