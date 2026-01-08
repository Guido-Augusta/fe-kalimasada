FROM node:lts

WORKDIR /app

COPY package*.json ./
COPY . .

RUN npm install -g pnpm@latest
RUN pnpm install
RUN pnpm build

# CMD ["pnpm", "preview", "--host", "0.0.0.0"]
# EXPOSE 4173

EXPOSE 4173
CMD ["pnpm", "preview", "--host", "0.0.0.0", "--port", "4173"]