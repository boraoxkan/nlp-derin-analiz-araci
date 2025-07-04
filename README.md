<div align="center">

# 🤖 Derin Metin Analiz Aracı 🧠

### Uçtan Uca Bir NLP Portfolyo Projesi

**Hugging Face, FastAPI ve React ile geliştirilmiş; uzun metinlerle başa çıkabilen, sağlamlaştırılmış ve Docker ile paketlenmiş, modern bir yapay zeka uygulaması.**

</div>

<div align="center">

[![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Docker](https://img.shields.io/badge/Docker-20.10-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

</div>

---

###  демонстрация (Live Demo)

**[Yakında Eklenecek]**

<br>

<div align="center">

![Uygulama Demosu](https://i.imgur.com/K3uS1pX.png)

</div>

---

### 🎯 Proje Hakkında

Bu proje, sadece birkaç temel NLP görevini yerine getiren bir araç olmanın ötesinde, modern bir yazılım ürününün nasıl tasarlanıp hayata geçirildiğini gösteren kapsamlı bir çalışmadır. Temel amaç, Hugging Face Hub'daki son teknoloji (state-of-the-art) modelleri alıp, bu modelleri sağlam bir API arkasında servis ederek, estetik ve kullanışlı bir kullanıcı arayüzü ile birleştirmektir.

Proje, Docker ile tamamen konteynerize edilerek, "benim makinemde çalışıyordu" sorununu ortadan kaldırır ve tek komutla her platformda çalışabilir hale getirilmiştir.

---

### ✨ Ana Özellikler

-   **Gelişmiş Metin Analizi:** Özetleme, Duygu Analizi ve İsimlendirilmiş Varlık Tanıma (NER) yetenekleri.
-   **Sağlamlaştırılmış Backend:** Çok uzun metinlerde bile çökmeden tutarlı sonuçlar üreten, "chunking" ve "recursive" algoritmalarla donatılmış API.
-   **Modern ve Estetik Arayüz:** Material-UI (MUI), "Glassmorphism" efekti ve Framer Motion ile geliştirilmiş akıcı animasyonlara sahip, açık/koyu tema destekli UI.
-   **Uçtan Uca Konteynerleştirme:** React frontend'i ve FastAPI backend'i, tek bir Docker imajında birleştiren "multi-stage build" yaklaşımı.

---

### 🛠️ Teknik Derinlik ve Mimarî Kararlar

Bu proje, standart tutorial'ların ötesine geçerek, gerçek dünya mühendislik problemlerine çözümler sunar:

-   **Uzun Metinlerle Başa Çıkma:** Standart NLP modellerinin 512 token limiti, metinleri akıllıca parçalara ayırıp (`chunking`) sonuçları birleştiren bir strateji ile aşıldı.
-   **Kaliteli Özetleme:** Naive "MapReduce" yerine, metnin anlamsal bütünlüğünü daha iyi koruyan **özyineli (recursive/hierarchical)** bir özetleme algoritması geliştirildi.
-   **Hata Toleranslı Varlık Tanıma:** Varlıkların parça sınırlarında bölünmesini engellemek için **iç içe geçen parçalar (overlapping chunks)** tekniği kullanılarak modelin doğruluğu artırıldı.
-   **Tek Komutla Çalıştırma:** "Multi-stage" Dockerfile sayesinde, hem Node.js tabanlı frontend build süreci hem de Python tabanlı backend, tek bir `docker build` komutuyla inşa edilip, tek bir imaj olarak paketlendi.

---

### 🏗️ Teknoloji Yığını

| Kategori  | Teknoloji                                       |
| :-------- | :---------------------------------------------- |
| **Backend** | Python, FastAPI, Hugging Face Transformers, PyTorch |
| **Frontend**| React, Material-UI (MUI), Framer Motion, Axios  |
| **MLOps** | Docker (Multi-stage Build)                      |

---

### ⚙️ Kurulum ve Çalıştırma

Bu projeyi yerel makinenizde çalıştırmak için **Git** ve **Docker Desktop**'ın kurulu olması yeterlidir.

1.  **Projeyi klonlayın:**
    ```bash
    git clone [https://github.com/boraoxkan/nlp-derin-analiz-araci.git](https://github.com/boraoxkan/nlp-derin-analiz-araci.git)
    cd nlp-derin-analiz-araci
    ```

2.  **Docker imajını oluşturun:**
    *(Bu işlem, bağımlılıklar indirileceği için ilk seferde birkaç dakika sürebilir.)*
    ```bash
    docker build -t nlp-analysis-app .
    ```

3.  **Konteyneri çalıştırın:**
    ```bash
    docker run -p 8000:8000 nlp-analysis-app
    ```

4.  **Uygulamaya erişin:**
    Web tarayıcınızı açın ve `http://localhost:8000` adresine gidin. Hepsi bu kadar!

---

### 🧠 Gelecek Geliştirmeler ve Öğrenimler

Bu proje, önceden eğitilmiş modellerle neler yapılabileceğinin sınırlarını zorlamaktadır. Daha da ileriye taşımak için potansiyel adımlar şunlar olabilir:

-   **Model Fine-Tuning:** NER sonuçlarındaki birleşik isimlerin bölünmesi gibi temel tokenizasyon sorunlarını çözmek için, özel bir veri seti ile modelin yeniden eğitilmesi.
-   **WebSocket Entegrasyonu:** Analiz sonuçlarını HTTP istekleri yerine WebSocket üzerinden anlık olarak arayüze akıtmak.
-   **Daha Detaylı Analiz:** Duygu analizini sadece pozitif/negatif olarak değil, "öfke, sevinç, korku" gibi daha granüler duyguları da içerecek şekilde genişletmek.

Bu proje, gerçek dünya verileriyle çalışırken karşılaşılan zorlukları ve "mükemmel" çözüm yerine "en sağlam" çözümü seçmenin önemini gösteren değerli bir öğrenme deneyimi olmuştur.

---

### 👤 Yazar

**Bora Ozkan**

* **GitHub:** [@boraoxkan](https://github.com/boraoxkan)
* **LinkedIn:** [linkedin.com/in/boraoxkan/](https://www.linkedin.com/in/boraoxkan/)