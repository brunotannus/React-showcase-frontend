# The News Application

## 📖 **Descrição do Projeto**

O **The News Application** é uma aplicação web que combina funcionalidades de leitura de newsletters com gamificação. Os usuários podem aumentar suas streaks (sequências diárias) e highscores ao interagir com as newsletters, desbloqueando novos avatares. A aplicação também inclui um painel administrativo com métricas e estatísticas úteis.

---

## 🚀 **Como Executar o Projeto**

### 1. **Clone os Repositórios**

Clone os repositórios do **frontend** e do **backend**

### 2. **Instale as Dependências**

Navegue para as pastas do frontend e backend separadamente e instale as dependências:

**No frontend**

`npm install`

**No backend**

`npm install`

## Instalando MySQL

1. Instale MySQL em sua máquina.
2. Logue como root:

   `sudo mysql -u root -p`
   
4. Execute os comandos:

```
CREATE USER 'admin'@'localhost' IDENTIFIED BY 'admin123';
GRANT ALL PRIVILEGES ON *.* TO 'admin'@'localhost' WITH GRANT OPTION;
CREATE DATABASE thenewsdb;
FLUSH PRIVILEGES;
```


### 3. **Inicie os Servidores**

Inicie o **frontend** e o **backend** em terminais separados:

**No frontend**

`npm start`

**No backend**

`npm start`

---

## 🧪 **Testando a Aplicação**

### 1. **Usuários Disponíveis para Testes**

- **Usuário Comum**:
  - E-mail: `user1@example.com`
  - Senha: `123`
- **Administrador**:
  - E-mail: `admin@example.com`
  - Senha: `123`

### 2. **Funcionalidades do Usuário Comum**

- O usuário `user1` inicia sem streaks ou highscores.
- Clique nas newsletters para aumentar sua streak diária e tentar obter um highscore.
- Use a "Máquina do Tempo" no topo da página para controlar o dia atual.
- Regras para aumentar a streak:
  - O usuário deve ler uma newsletter postada no mesmo dia.
  - A newsletter não deve ter sido lida anteriormente pelo usuário.

### 3. **Funcionalidades do Administrador**

- O administrador pode acessar o painel administrativo que contém:
  - Um leaderboard com os highscores dos usuários gerados aleatoriamente.
  - Estatísticas úteis sobre os usuários.

---

## 📅 **Simulação de Dias e Postagem de Newsletters**

- Uma nova newsletter é postada automaticamente todos os dias (exceto domingos) até o dia `28/02/2025`.
- Use a "Máquina do Tempo" para avançar ou resetar dias e testar diferentes cenários.

---

## 🛠️ **Detalhes Técnicos**

### Backend

- O backend gera um array de 5 usuários fictícios com variáveis aleatórias como streak, highscore e variáveis do beehiive.
- Endereço padrão do backend: `http://localhost:3001`.

### Frontend

- O frontend conecta-se ao backend para autenticação, leitura de newsletters, controle de streaks e exibição de estatísticas.
- Endereço padrão do frontend: `http://localhost:3000`.

---

## 📊 **Painel Administrativo**

O painel administrativo inclui:

- **Leaderboard**: Exibe os highscores dos usuários gerados aleatoriamente.
- **Estatísticas**:
  - Métricas úteis sobre os usuários, como streaks, highscores e interações.

---

## 📝 **Considerações Finais**

Este projeto foi desenvolvido para simular uma experiência gamificada na leitura de newsletters, permitindo testes completos com diferentes cenários. Divirta-se explorando as funcionalidades!

---

## 📝 **Video teste**

[screen-capture.webm](https://github.com/user-attachments/assets/0aeb8ecd-8b07-4c6e-8fbb-e81e18cd81a6)


🎉 **Bom teste!**
