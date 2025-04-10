# 🏥 Hospital Management System

Um sistema moderno de gerenciamento hospitalar desenvolvido com tecnologias de ponta para facilitar a administração de recursos, pacientes e equipamentos médicos.

## ✨ Características

- 📊 Dashboard interativo com métricas em tempo real
- 👥 Gerenciamento de pacientes e equipe médica
- 🏗️ Controle de equipamentos e manutenção
- 📝 Sistema de agendamento de consultas
- 📈 Relatórios detalhados e exportáveis
- 🔐 Sistema de autenticação seguro
- 🌐 Interface responsiva e moderna

## 🛠️ Tecnologias Utilizadas

### Frontend
- React + TypeScript
- Vite
- Tailwind CSS
- Shadcn/ui
- React Query
- React Hook Form
- Zod

### Backend
- Node.js
- Express
- TypeScript
- Drizzle ORM
- JWT Authentication

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Node.js (versão 18 ou superior)
- npm ou yarn
- PostgreSQL (ou Neon Database)

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/hospital-management.git
cd hospital-management
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
```env
DATABASE_URL=sua_url_do_banco_de_dados
JWT_SECRET=seu_secret_jwt
```

4. Execute o projeto em modo desenvolvimento:
```bash
npm run dev
```

5. Para produção:
```bash
npm run build
npm start
```

## 📁 Estrutura do Projeto

```
HospitalManagement/
├── client/           # Frontend React
├── server/           # Backend Express
├── shared/           # Código compartilhado
├── .config/          # Configurações
├── attached_assets/  # Recursos estáticos
└── ...
```

## 🔧 Scripts Disponíveis

- `npm run dev` - Inicia o servidor em modo desenvolvimento
- `npm run build` - Compila o projeto para produção
- `npm run start` - Inicia o servidor em produção
- `npm run check` - Verifica tipos TypeScript
- `npm run db:push` - Atualiza o banco de dados

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor, leia o [CONTRIBUTING.md](CONTRIBUTING.md) para detalhes sobre nosso código de conduta e o processo de submissão de pull requests.

## 📞 Suporte

Para suporte, envie um email para darkbyte234@gmail.com ou abra uma issue no GitHub.

---

Desenvolvido com ❤️ por Kalyel
