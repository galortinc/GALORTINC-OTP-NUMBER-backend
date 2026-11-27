require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const app = express();
app.use(cors());
app.use(express.json());
const FIVESIM_BASE = 'https://5sim.net/v1';
const API_KEY = process.env.FIVESIM_API_KEY;
async function call5sim(path) {
  const res = await fetch(FIVESIM_BASE + path, { headers: { 'Authorization': 'Bearer ' + API_KEY, 'Accept': 'application/json' } });
  const text = await res.text();
  let data; try { data = JSON.parse(text); } catch (e) { data = { raw: text }; }
  return { status: res.status, data };
}
app.get('/', (req, res) => res.json({ ok: true, service: 'NumberVault Backend', live: !!API_KEY }));
app.get('/api/health', (req, res) => res.json({ ok: true, hasKey: !!API_KEY, time: new Date().toISOString() }));
app.get('/api/profile', async (req, res) => { try { const r = await call5sim('/user/profile'); return res.status(r.status).json(r.data); } catch (e) { return res.status(500).json({ error: e.message }); } });
app.get('/api/prices', async (req, res) => { try { const r = await fetch(FIVESIM_BASE + '/guest/prices?country=' + (req.query.country || 'any') + '&product=' + (req.query.product || 'any')); return res.status(r.status).json(await r.json()); } catch (e) { return res.status(500).json({ error: e.message }); } });
app.post('/api/buy', async (req, res) => { try { const b = req.body || {}; const r = await call5sim('/user/buy/activation/' + (b.country || 'us') + '/' + (b.operator || 'any') + '/' + (b.product || 'whatsapp')); return res.status(r.status).json(r.data); } catch (e) { return res.status(500).json({ error: e.message }); } });
app.get('/api/check', async (req, res) => { try { const r = await call5sim('/user/check/' + req.query.id); return res.status(r.status).json(r.data); } catch (e) { return res.status(500).json({ error: e.message }); } });
app.post('/api/finish', async (req, res) => { try { const r = await call5sim('/user/finish/' + req.body.id); return res.status(r.status).json(r.data); } catch (e) { return res.status(500).json({ error: e.message }); } });
app.post('/api/cancel', async (req, res) => { try { const r = await call5sim('/user/cancel/' + req.body.id); return res.status(r.status).json(r.data); } catch (e) { return res.status(500).json({ error: e.message }); } });
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log('NumberVault backend running on port ' + PORT));
