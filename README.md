- source .env
- npm i
- docker compose up -d db 
- npm run prisma:migrate
- npm run prisma:generate
- npm run api:start
- start a new terminal
- npm run client:start