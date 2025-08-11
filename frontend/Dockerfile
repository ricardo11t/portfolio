# ===== ESTÁGIO 1: Build da Aplicação =====
FROM node:18-alpine AS build
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# ===== ESTÁGIO 2: Servir os Arquivos Estáticos =====
FROM nginx:1.25-alpine

# Copia os arquivos do site
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

# Remove a configuração padrão do Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copia a nossa nova configuração de proxy
COPY nginx/default.conf /etc/nginx/conf.d/

EXPOSE 80
