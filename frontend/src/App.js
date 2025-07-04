// src/App.js - Estetik Final Sürüm

import React, { useState, useMemo } from 'react';
import {
  ThemeProvider, createTheme, CssBaseline, Container, Box, Typography, IconButton,
  TextField, Button, CircularProgress, Tabs, Tab, Alert, Paper, Chip
} from '@mui/material';
import { Science, TextFields, Insights, Lightbulb } from '@mui/icons-material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion'; // Framer Motion importları
import './App.css'; // Yeni CSS dosyamızı import ediyoruz

const API_URL = '/api';

// Sonuçları göstermek için oluşturduğumuz yardımcı bileşen (değişiklik yok)
const ResultsDisplay = ({ results }) => {
    // ... (Bu bileşenin kodu bir önceki adımdaki ile aynı, isterseniz küçültebilirsiniz)
    const [tabIndex, setTabIndex] = useState(0);

    if (!results) return null;
    const handleTabChange = (event, newValue) => { setTabIndex(newValue); };
    const getSentimentChip = (label) => {
        if (label === 'positive') return <Chip label="POZİTİF" color="success" variant="filled" />;
        if (label === 'negative') return <Chip label="NEGATİF" color="error" variant="filled" />;
        return <Chip label="NÖTR" color="default" variant="filled" />;
    }

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Paper className="glass-card" elevation={0} sx={{ mt: 4, width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={tabIndex} onChange={handleTabChange} variant="fullWidth" textColor="inherit">
                        <Tab icon={<Lightbulb />} label="Özet" />
                        <Tab icon={<Insights />} label="Duygu Analizi" />
                        <Tab icon={<TextFields />} label="Varlık Tanıma (NER)" />
                    </Tabs>
                </Box>
                <Box p={3}>
                    {tabIndex === 0 && <Typography variant="body1" sx={{whiteSpace: 'pre-wrap'}}>{results.summary.summary_text}</Typography>}
                    {tabIndex === 1 && <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>{getSentimentChip(results.sentiment.label)}<Typography variant="body2">({(results.sentiment.score * 100).toFixed(1)}% güvenle)</Typography></Box>}
                    {tabIndex === 2 && <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 1}}>{results.ner.entities.map((entity, index) => (<Chip key={index} label={`${entity.word} (${entity.entity_group})`} variant="outlined" />))}</Box>}
                </Box>
            </Paper>
        </motion.div>
    );
};

function App() {
  const [mode, setMode] = useState('dark'); // Varsayılan olarak koyu tema
  const [text, setText] = useState('');
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      primary: { main: '#64ffda' }, // Modern bir mint yeşili
      ...(mode === 'dark'
        ? { background: { paper: 'rgba(30, 30, 30, 0.5)' } } // Koyu tema için yarı şeffaf kağıt rengi
        : { background: { paper: 'rgba(255, 255, 255, 0.7)' } } // Açık tema için yarı şeffaf kağıt rengi
      ),
      text: {
        primary: mode === 'light' ? '#212121' : '#e0e0e0',
        secondary: mode === 'light' ? '#757575' : '#bdbdbd',
      },
    },
    typography: { fontFamily: '"Inter", sans-serif' }
  }), [mode]);

  const toggleColorMode = () => setMode((prev) => (prev === 'light' ? 'dark' : 'light'));

  const handleAnalyze = async () => {
    if (!text.trim()) { setError("Lütfen analiz etmek için bir metin girin."); return; }
    setIsLoading(true); setResults(null); setError(null);
    try {
      const [sentimentRes, summaryRes, nerRes] = await Promise.all([
        axios.post(`${API_URL}/sentiment`, { text }),
        axios.post(`${API_URL}/summarize`, { text }),
        axios.post(`${API_URL}/ner`, { text })
      ]);
      setResults({ sentiment: sentimentRes.data, summary: summaryRes.data, ner: nerRes.data });
    } catch (err) {
      setError("Analiz sırasında bir hata oluştu. API'nin çalıştığından emin olun."); console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ py: 4, color: 'text.primary' }}>
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h4" component="h1" fontWeight="bold">
              Derin Metin Analiz Aracı
            </Typography>
            <IconButton onClick={toggleColorMode} color="inherit">
              {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Box>
        </motion.div>
        
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }}>
          <Paper className="glass-card" elevation={0} sx={{ p: 4, my: 4 }}>
            <TextField
              label="Analiz Edilecek Metin"
              multiline
              rows={12}
              fullWidth
              variant="filled"
              value={text}
              onChange={(e) => setText(e.target.value)}
              sx={{ mb: 2, '& .MuiFilledInput-root': { backgroundColor: 'rgba(0,0,0,0.1)' } }}
            />
            <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<Science />}
                onClick={handleAnalyze}
                disabled={isLoading}
                sx={{ width: '60%', py: 1.5, fontSize: '1.1rem', borderRadius: '50px', textTransform: 'none' }}
              >
                Analiz Et
              </Button>
              {isLoading && <CircularProgress size={24} sx={{ position: 'absolute', top: '50%', marginTop: '-12px' }} />}
            </Box>
          </Paper>
        </motion.div>

        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Alert severity="error" sx={{ mt: 2, width: '100%', borderRadius: 2 }}>{error}</Alert>
            </motion.div>
          )}
        </AnimatePresence>
        
        <AnimatePresence>
          {results && <ResultsDisplay results={results} />}
        </AnimatePresence>
      </Container>
    </ThemeProvider>
  );
}

export default App;