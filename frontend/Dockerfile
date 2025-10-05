# Multi-stage build para optimizar el tamaño final
FROM node:18-alpine AS builder

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production

# Copiar código fuente
COPY . .

# Build de la aplicación
RUN npm run build

# Etapa de producción con nginx
FROM nginx:alpine

# Copiar configuración personalizada de nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Copiar archivos build desde la etapa anterior
COPY --from=builder /app/dist /usr/share/nginx/html

# Crear usuario no-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Exponer puerto
EXPOSE 3000

# Cambiar a usuario no-root
USER nextjs

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Comando para ejecutar nginx
CMD ["nginx", "-g", "daemon off;"]