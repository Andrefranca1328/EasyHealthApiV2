FROM node:20-alpine

WORKDIR /app

# Copia dependências e instala apenas as de produção
COPY package*.json ./
RUN npm ci --only=production

# Copia o código fonte
COPY src/ ./src/
COPY scripts/ ./scripts/

# Cria diretório de uploads
RUN mkdir -p uploads

EXPOSE 3000

# Health check para o Render/Fly.io confirmar que a API está online
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s \
  CMD wget -qO- http://localhost:3000/ || exit 1

CMD ["node", "src/app.js"]
