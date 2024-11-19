# Gunakan Node.js versi 20 sebagai base image
FROM node:20

# Set working directory
WORKDIR /app

# Copy file package.json dan package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy seluruh source code aplikasi ke dalam container
COPY . .

# Expose port 8080 (port default untuk Cloud Run)
EXPOSE 8080

# Jalankan aplikasi
CMD ["npm", "run", "start"]
