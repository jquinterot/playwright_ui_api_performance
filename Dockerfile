FROM mcr.microsoft.com/playwright:v1.58.0-noble

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ENV CI=true
ENV BASE_URL=https://www.demoblaze.com/
ENV API_BASE_URL=https://jsonplaceholder.typicode.com

CMD ["npx", "playwright", "test"]
