# Project Bank System

Estruturação de uma aplicação web fullstack, dockerizada, cujo objetivo seja possibilitar que usuários consigam realizar transferências internas entre si.

## Tech Stack

**Client:** React, Nextjs, Context API, TailwindCSS

**Server:** Node, Express, Prisma

## Run Locally

Primeiro vai ser necessário a instalação do [Docker](https://www.docker.com/) e do [Docker Compose](https://docs.docker.com/compose/).

A seguir irei demonstrar como fazer a instalação em um sistema Linux.

```bash
sudo curl -L "https://github.com/docker/compose/releases/download/v2.5.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
```

Dar permissão de execução para o Docker Compose

```bash
sudo chmod +x /usr/local/bin/docker-compose
```

Verificar instalação

```bash
pessoa@vercel:~$ docker-compose --version
Docker Compose version v2.5.0
```

Agora rode o script seguinte na pasta principal onde se encontra o arquivo docker-compose.yml

```bash
docker-compose up -d
```

Após finalizado o servidor backend estará rodando na porta 3333,
o frontend na 3000 e o postgres na porta 5432

Para rodar o frontend e backend individualmente será necessário os seguinte comandos dentro de suas respectivas pastas

```bash
npm install
```

E depois rodar

```bash
npm run dev
```

## Running Tests

Para rodar testes no backend, dentro de sua pasta rode o seguinte comando

```bash
npm test
```

## Authors

- [Rodrigo Camilo](https://www.github.com/ScriptCamilo)
