# Dockerfile

# --- AŞAMA 1: Frontend'i Build Etme ---
# Node.js'in hafif bir versiyonunu temel alıyoruz ve bu aşamaya "builder" adını veriyoruz.
FROM node:lts-alpine as builder

# Çalışma dizinini ayarlıyoruz
WORKDIR /app/frontend

# Önce sadece bağımlılık dosyalarını kopyala (Docker katman önbelleklemesi için en iyi pratik)
COPY frontend/package.json frontend/package-lock.json ./

# Frontend bağımlılıklarını kur
RUN npm install

# Geri kalan tüm frontend kodunu kopyala
COPY frontend/ ./

# React uygulamasını statik HTML, CSS, JS dosyalarına derle (build et)
RUN npm run build


# --- AŞAMA 2: Backend'i Kurma ve Servis Etme ---
# Python'un hafif bir versiyonunu temel alıyoruz
FROM python:3.11-slim

# Çalışma dizinini ayarlıyoruz
WORKDIR /app

# Python bağımlılıklarını kur
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Backend kodunu kopyala
COPY backend/ .

# === SİHİRLİ ADIM ===
# 1. Aşamada ("builder") oluşturduğumuz statik frontend dosyalarını
# Python sunucusunun içindeki "static" adlı bir klasöre kopyala.
COPY --from=builder /app/frontend/build ./static

# Konteynerin dış dünyaya 8000 portunu açacağını belirt
EXPOSE 8000

# Konteyner çalıştığında çalıştırılacak olan ana komut
# --host 0.0.0.0, konteynerin dışından erişime izin verir.
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]