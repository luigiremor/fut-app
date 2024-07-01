# SoccerMatch

## Sobre

**SoccerMatch** é um aplicativo web desenvolvido por **Luigi Remor Costa** para a disciplina INE5646-03238A (20241) - Programação para Web. Este aplicativo é ideal para organizar partidas de futebol, gerenciar equipes, confirmar participações, e muito mais.

## Funcionalidades

- **Organização de Equipes**: Crie e gerencie equipes, equilibrando habilidades para jogos justos.
- **Confirmação de Presença**: Jogadores podem confirmar sua participação facilmente.
- **Agendamento de Partidas**: Marque datas e horários de jogos e compartilhe com os envolvidos.
- **Estatísticas de Jogadores**: Mantenha um registro do desempenho dos participantes.

## Como Usar

1. **Acesso**: Acesse o SoccerMatch através do seu navegador preferido.
2. **Registro**: Crie sua conta informando seus dados básicos.
3. **Crie/Junte-se a um Jogo**: Inicie um novo jogo ou participe de um já criado.
4. **Organize as Equipes**: Use nossa ferramenta para montar equipes equilibradas.
5. **Confirme sua Presença**: Marque sua participação em jogos programados.

## Setup para Desenvolvimento

### Frontend

1. Instale as dependências e certifique-se de que você possui o pnpm instalado. Caso contrário, execute o comando:
   ```sh
   npm install -g pnpm
    ```
2. Instale as dependências do projeto:
    ```sh
    pnpm install
    ```
3. Inicie o servidor de desenvolvimento:
    ```sh
    pnpm run dev
    ```
4. Para gerar novos tipos a partir do backend, execute:
    ```sh
    pnpm run generate-types
    ```   

### Backend

1. Configure o banco de dados utilizando Docker:
   ```sh
   docker-compose up -d
    ```
2. Para rodar o backend em modo de desenvolvimento:
    ```sh
    pnpm run start:dev
    ```

### Arquivo .env

Certifique-se de criar um arquivo `.env` na raiz do backend e outro no do frontend e preencher as seguintes variáveis:

Para o frontend:

- `NEXTAUTH_SECRET`: Chave secreta usada para autenticação no NextAuth.
- `NEXT_PUBLIC_API_BASE_URL`: URL base da API pública utilizada pelo frontend.

Para o backend:

- `AUTH_SECRET`: Chave secreta usada para processos de autenticação.
- `FRONTEND_DOMAIN`: Domínio onde o aplicativo frontend está hospedado.
- `DB_HOST`: Endereço do host para o banco de dados.
- `DB_PORT`: Número da porta para o banco de dados.
- `DB_USERNAME`: Nome de usuário para autenticação no banco de dados.
- `DB_PASSWORD`: Senha para autenticação no banco de dados.
- `DB_DATABASE`: Nome do banco de dados para conectar.

---

Desenvolvido por **Luigi Remor Costa** (23203395) - INE5646-03238A (20241) - Programação para Web.
