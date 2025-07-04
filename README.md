# Derin Metin Analiz Aracı

**Modern Doğal Dil İşleme (NLP) modellerini kullanarak metinler üzerinde derinlemesine analizler yapan, tam donanımlı (full-stack) bir web uygulaması.**

Bu proje, Hugging Face ekosistemindeki son teknoloji yapay zeka modellerini, yüksek performanslı bir Python (FastAPI) backend'i ve estetik bir React frontend'i ile birleştirerek, uçtan uca bir MLOps projesinin nasıl hayata geçirileceğini göstermektedir. Uygulama, Docker ile tamamen konteynerize edilmiştir ve tek bir komutla her yerde çalıştırılabilir.

---

### 🚀 Uygulamanın Çalışan Hali

[Buraya uygulamanızın çalışan halini gösteren etkileyici bir GIF veya ekran görüntüsü ekleyin. Bu, README dosyanızın en önemli görsel elementidir.]

![Uygulama Demosu](https://i.imgur.com/your-gif-url.gif)

---

### ✨ Ana Özellikler

* **Duygu Analizi:** Girilen metnin genel duygu tonunu (Pozitif / Negatif / Nötr) yüksek doğrulukla tespit eder.
* **Metin Özetleme:** Çok uzun metinleri, anlamsal bütünlüğü koruyarak, akıllı ve özyineli (recursive) algoritmalarla özetler.
* **İsimlendirilmiş Varlık Tanıma (NER):** Metin içindeki Kişi (PER), Yer (LOC) ve Kurum (ORG) gibi özel isimleri tanır ve etiketler.
* **Modern Arayüz:** Açık/koyu tema desteği, "glassmorphism" efekti ve akıcı animasyonlar içeren, tamamen duyarlı (responsive) bir kullanıcı arayüzü.
* **Sağlam Altyapı:** Çok uzun metinlerde bile çökmemesi için "chunking" ve "overlapping" gibi gelişmiş backend stratejileri ile donatılmıştır.
* **Dockerize Edilmiş:** Tüm uygulama (frontend ve backend), tek bir Docker imajı olarak paketlenmiştir, bu sayede her ortamda tutarlı bir şekilde çalışır.

---

### 🛠️ Kullanılan Teknolojiler

* **Backend:**
    * **Python 3.11**
    * **FastAPI:** Yüksek performanslı API'ler için modern bir web framework'ü.
    * **Hugging Face `transformers`:** Son teknoloji NLP modellerini kullanmak için.
    * **PyTorch:** Derin öğrenme modellerinin altyapısı.
    * **Uvicorn:** Yüksek hızlı ASGI sunucusu.
* **Frontend:**
    * **React 18:** Modern, bileşen tabanlı bir arayüz için.
    * **Material-UI (MUI):** Profesyonel ve estetik UI bileşenleri için.
    * **Framer Motion:** Akıcı ve yumuşak animasyonlar için.
    * **Axios:** API isteklerini yönetmek için.
* **Deployment & MLOps:**
    * **Docker:** Uygulamayı ve tüm bağımlılıklarını konteynerize etmek için.

---

### ⚙️ Kurulum ve Çalıştırma

Bu projeyi yerel makinenizde çalıştırmak için **Git** ve **Docker Desktop**'ın kurulu olması yeterlidir.

1.  **Projeyi klonlayın:**
    ```bash
    git clone [Bu reponun GitHub URL'i]
    cd nlp-analysis-tool
    ```

2.  **Docker imajını oluşturun:**
    (Bu işlem, bağımlılıklar indirileceği için ilk seferde birkaç dakika sürebilir.)
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

### 🧠 Bilinen Sınırlılıklar ve Öğrenimler

Bu proje, gerçek dünya mühendisliğindeki değiş tokuşları (trade-offs) göstermektedir. En büyük hedefimiz, her koşulda çalışan **sağlam (robust)** bir sistem yaratmaktı. Bu hedefe ulaşırken karşılaştığımız bazı durumlar:

* **NER Sınır Hataları:** Çok uzun metinlerde, metni parçalara ayırma stratejimiz nedeniyle "Mustafa Kemal Atatürk" gibi birleşik isimler bazen ayrılabiliyor. Bu, kullandığımız önceden eğitilmiş modelin tokenizasyon sınırlılıklarından kaynaklanmaktadır.
* **Özet Akıcılığı:** Özyineli özetleme algoritmamız, uzun metinlerde tutarlılığı büyük ölçüde artırsa da, bazen birleştirme noktalarında küçük anlamsal kopukluklar yaşanabilir.

Bu durumlar, projenin bir hatası olmaktan çok, üretim ortamında NLP modelleriyle çalışırken karşılaşılan doğal zorluklardır ve daha da ileri optimizasyonlar için modelin yeniden eğitilmesi (fine-tuning) gibi adımlar gerektirir.

---
### Lisans

Bu proje [MIT Lisansı](LICENSE) ile lisanslanmıştır.