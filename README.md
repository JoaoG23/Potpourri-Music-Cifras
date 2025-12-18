# Potpourri Music Cifras

Aplicação web para gerenciamento e visualização de cifras musicais, permitindo criar, editar e compartilhar partições musicais de forma colaborativa.

## 🚀 Tecnologias

### Frontend
- **React** com TypeScript
- **Vite** como bundler e dev server
- **Radix UI** para componentes acessíveis
- **Tailwind CSS** para estilização
- **React Query** para gerenciamento de estado e cache
- **Axios** para requisições HTTP
- **React Hook Form** para manipulação de formulários
- **Zod** para validação de dados
- **date-fns** para manipulação de datas
- **Lucide Icons** para ícones

### Backend
- **Python** 3.12
- **Flask** como framework web
- **SQLAlchemy** como ORM
- **PostgreSQL** como banco de dados
- **Flask-Migrate** para migrações do banco de dados
- **Flask-CORS** para lidar com CORS
- **BeautifulSoup4** e **Selenium** para web scraping

### Infraestrutura
- **Docker** e **Docker Compose** para conteinerização
- **Nginx** como servidor web reverso
- **PostgreSQL** para armazenamento de dados

## 🛠️ Como Executar com Docker

### Pré-requisitos

- Docker e Docker Compose instalados
- Git (opcional, apenas para clonar o repositório)

### Passo a Passo

1. **Clone o repositório**
   ```bash
   git clone https://github.com/JoaoG23/Potpourri-Music-Cifras.git
   cd Potpourri-Music-Cifras
   ```

2. **Configure as variáveis de ambiente**
   - Crie um arquivo `.env.prod` na pasta `backend/` com as configurações do banco de dados:
     ```
     DATABASE_URL=postgresql://user:password@postgres:5432/potpourri_db
     FLASK_APP=app.py
     FLASK_ENV=production
     SECRET_KEY=sua_chave_secreta_aqui
     ```
   - Crie um arquivo `.env.prod` na pasta `frontend/` com as configurações da API:
     ```
     VITE_API_URL=http://localhost:3004
     ```

3. **Inicie os contêineres**
   ```bash
   docker-compose up --build -d
   ```

4. **Acesse a aplicação**
   - Frontend: http://localhost:84
   - Backend API: http://localhost:3004

5. **Para parar os contêineres**
   ```bash
   docker-compose down
   ```

## 🏗️ Estrutura do Projeto

```
Potpourri-Music-Cifras/
├── backend/               # Código-fonte do backend
│   ├── app/               # Módulos da aplicação
│   ├── migrations/        # Migrações do banco de dados
│   ├── .env.prod          # Variáveis de ambiente (não versionado)
│   ├── Dockerfile         # Configuração do container do backend
│   ├── requirements.txt   # Dependências Python
│   └── app.py             # Ponto de entrada da aplicação
│
├── frontend/              # Código-fonte do frontend
│   ├── public/            # Arquivos estáticos
│   ├── src/               # Código-fonte React
│   ├── .env.prod          # Variáveis de ambiente (não versionado)
│   ├── Dockerfile         # Configuração do container do frontend
│   ├── package.json       # Dependências e scripts
│   └── vite.config.ts     # Configuração do Vite
│
├── docker-compose.yml     # Configuração do Docker Compose
└── README.md             # Este arquivo
```

## 📝 Licença

Este projeto está licenciado sob a licença MIT. Consulte o arquivo [LICENSE](LICENSE) para obter mais informações.

## 👥 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e enviar pull requests.

## 📞 Contato

- **Autor**: João Gabriel
- **GitHub**: [@JoaoG23](https://github.com/JoaoG23)


