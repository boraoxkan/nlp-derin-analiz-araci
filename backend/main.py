# main.py (v1.1 - Gelişmiş Kalite İyileştirmeleri ile Final Sürüm)

from fastapi import FastAPI
from pydantic import BaseModel, Field
from typing import List
from transformers import pipeline, AutoTokenizer
import torch
from fastapi.middleware.cors import CORSMiddleware
import math
from fastapi.staticfiles import StaticFiles
from starlette.responses import FileResponse

# --- 1. Uygulama ve Genel Ayarlar ---
app = FastAPI(
    title="Derin Metin Analiz Aracı API",
    description="Uzun metinleri de işleyebilen, sağlamlaştırılmış ve kalite odaklı bir NLP API'si.",
    version="1.1.0",
)

# CORS Ayarları
origins = ["http://localhost:3000", "http://localhost:3001"]
app.add_middleware(CORSMiddleware, allow_origins=origins, allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

# Docker imajımızdaki "static" klasörünü /static URL'i altında sun
app.mount("/static", StaticFiles(directory="static/static"), name="static")

# API endpoint'i olmayan tüm diğer istekleri React'in ana HTML dosyasına yönlendir.
# Bu, React Router'ın sayfa yenilemede çalışmasını sağlar.
@app.get("/{full_path:path}")
async def serve_react_app(full_path: str):
    return FileResponse("static/index.html")

# --- 2. Modelleri ve Tokenizer'ı Yükleme ---
try:
    tokenizer = AutoTokenizer.from_pretrained("bert-base-multilingual-cased")
except Exception: tokenizer = None
try:
    sentiment_pipeline = pipeline("sentiment-analysis", model="savasy/bert-base-turkish-sentiment-cased")
except Exception: sentiment_pipeline = None
try:
    summarization_pipeline = pipeline("summarization", model="sshleifer/distilbart-cnn-12-6")
except Exception: summarization_pipeline = None
try:
    ner_pipeline = pipeline("ner", model="savasy/bert-base-turkish-ner-cased", aggregation_strategy="simple")
except Exception: ner_pipeline = None


# --- 3. Pydantic Veri Modelleri (Değişiklik yok) ---
class GenericTextRequest(BaseModel): text: str
class SentimentResponse(BaseModel): label: str; score: float
class SummarizationResponse(BaseModel): summary_text: str
class NerEntity(BaseModel): entity_group: str; score: float; word: str; start: int; end: int
class NerResponse(BaseModel): entities: List[NerEntity]


# --- 4. Gelişmiş Yardımcı Fonksiyon: Overlapping Chunks ---
def split_text_into_chunks(text: str, max_tokens: int = 400, overlap_tokens: int = 50):
    if tokenizer is None: return [text]
    
    tokens = tokenizer.tokenize(text)
    if not tokens: return []
    
    # Stride, bir sonraki parçanın ne kadar ileriden başlayacağını belirler.
    stride = max_tokens - overlap_tokens
    
    chunks = []
    for i in range(0, len(tokens), stride):
        chunk_tokens = tokens[i:i + max_tokens]
        if not chunk_tokens: break
        chunks.append(tokenizer.convert_tokens_to_string(chunk_tokens))
    return chunks

# --- 5. Gelişmiş API Endpoint'leri ---

@app.get("/")
def read_root(): return {"message": "Derin Metin Analiz Aracı API'sine Hoş Geldiniz!"}

@app.post("/api/sentiment", response_model=SentimentResponse)
async def analyze_sentiment(request: GenericTextRequest):
    if sentiment_pipeline is None: return {"error": "Model yüklenemedi"}
    
    # Bu endpoint için basit chunking yeterli
    chunks = split_text_into_chunks(request.text, max_tokens=450, overlap_tokens=0)
    if not chunks: return {"label": "neutral", "score": 0.5}
    
    results = sentiment_pipeline(chunks)
    
    scores = {'positive': 0, 'negative': 0}
    counts = {'positive': 0, 'negative': 0}

    for r in results:
        label = r['label']
        if label in scores:
            scores[label] += r['score']
            counts[label] += 1
            
    if scores['positive'] > scores['negative']:
        avg_score = scores['positive'] / counts['positive'] if counts['positive'] > 0 else 0
        return {"label": "positive", "score": avg_score}
    else:
        avg_score = scores['negative'] / counts['negative'] if counts['negative'] > 0 else 0
        return {"label": "negative", "score": avg_score}


@app.post("/api/summarize", response_model=SummarizationResponse)
async def summarize_text(request: GenericTextRequest):
    if summarization_pipeline is None: return {"error": "Model yüklenemedi"}
    if tokenizer is None: return {"error": "Tokenizer yüklenemedi"}

    initial_chunks = split_text_into_chunks(request.text, max_tokens=300, overlap_tokens=30)
    if not initial_chunks: return {"summary_text": ""}

    current_summaries = [res['summary_text'] for res in summarization_pipeline(initial_chunks, max_length=100, min_length=20)]

    while len(current_summaries) > 1:
        new_summaries = []
        for i in range(0, len(current_summaries), 2):
            if i + 1 < len(current_summaries):
                combined_text = current_summaries[i] + " " + current_summaries[i+1]
                
                # === YENİ VE AKILLI MANTIK BURADA ===
                # Eğer bu son birleştirme adımıysa, daha uzun bir özete izin ver.
                if len(current_summaries) <= 2: 
                    # Final Turu: Daha cömert ve detaylı özet
                    min_len = 60
                    max_len = 200 
                else: 
                    # Ara Turlar: Daha agresif küçültme
                    min_len = 40
                    max_len = 120
                # ======================================

                new_summary = summarization_pipeline(combined_text, max_length=max_len, min_length=min_len)[0]['summary_text']
                new_summaries.append(new_summary)
            else:
                new_summaries.append(current_summaries[i])
        current_summaries = new_summaries
    
    final_summary_text = current_summaries[0]

    # Son bir temizlik: Özetin sonunda yarım cümle varsa "..." ile tamamla
    last_period_index = final_summary_text.rfind('.')
    if last_period_index != -1 and last_period_index < len(final_summary_text) -1:
         # Eğer nokta cümlenin sonunda değilse, muhtemelen yarım kalmıştır.
         pass # Veya isterseniz kesebilirsiniz: final_summary_text = final_summary_text[:last_period_index + 1]
    elif last_period_index == -1:
        final_summary_text += "..."

    return {"summary_text": final_summary_text}


@app.post("/api/ner", response_model=NerResponse)
async def analyze_ner(request: GenericTextRequest):
    if ner_pipeline is None: return {"error": "Model yüklenemedi"}
    
    # Sınır hatalarını çözmek için OVERLAPPING chunks kullanıyoruz
    chunks = split_text_into_chunks(request.text, max_tokens=400, overlap_tokens=50)
    if not chunks: return {"entities": []}
    
    all_entities = []
    for chunk in chunks:
        # Pipeline'dan gelen her varlık bir dictionary.
        chunk_entities = ner_pipeline(chunk)
        all_entities.extend(chunk_entities)
        
    # Gelişmiş Yinelenen Temizleme
    unique_entities = []
    # (word, entity_group) ikilisini kullanarak yinelenenleri tespit et
    seen_combinations = set()
    for entity in sorted(all_entities, key=lambda x: x['score'], reverse=True):
        combination = (entity['word'], entity['entity_group'])
        if combination not in seen_combinations:
            unique_entities.append(entity)
            seen_combinations.add(combination)
            
    return {"entities": sorted(unique_entities, key=lambda x: x['start'])}