// AppData.js v3 — Bitunix + MT5, signed RR, updated constants

// Venue detection helper — used across all components
function detectVenue(symbol) {
  if (!symbol) return 'mt5';
  const s = symbol.toUpperCase().replace('/', '');
  const cryptoSymbols = ['BTCUSDT','ETHUSDT','SOLUSDT','BNBUSDT','XRPUSDT','DOGEUSDT','ADAUSDT'];
  return cryptoSymbols.some(c => s.includes(c.replace('USDT',''))) ? 'bitunix' : 'mt5';
}

// Signed RR formatter
function fmtRR(rr, outcome) {
  if (rr == null) return '—';
  const n = parseFloat(rr);
  if (outcome === 'Win')  return `+${Math.abs(n).toFixed(1)}R`;
  if (outcome === 'Loss') return `-${Math.abs(n).toFixed(1)}R`;
  if (outcome === 'BE')   return `0.0R`;
  return `${n.toFixed(1)}R`;
}

const SAMPLE_TRADES = [
  { id:1,  pair:'GBP/USD',  dir:'Long',  setup:'Secondary POI + SC entry',  entry:1.2650, sl:1.2610, tp:1.2730, size:0.5,  risk:100, rr:2.0,  pnl:200,  outcome:'Win',  status:'Closed', market:'Forex',   session:'London',  conf:8, date:'2026-04-14', htfBias:'Bullish', venue:'mt5' },
  { id:2,  pair:'EUR/USD',  dir:'Short', setup:'HTF liquidity sweep entry',  entry:1.0890, sl:1.0930, tp:1.0810, size:0.3,  risk:75,  rr:2.0,  pnl:-75,  outcome:'Loss', status:'Closed', market:'Forex',   session:'NY',      conf:6, date:'2026-04-15', htfBias:'Bearish', venue:'mt5' },
  { id:3,  pair:'BTCUSDT',  dir:'Long',  setup:'Primary POI + SC entry',     entry:64200,  sl:63500,  tp:66000,  size:0.04, risk:120, rr:2.57, pnl:308,  outcome:'Win',  status:'Closed', market:'Crypto',  session:'Asian',   conf:9, date:'2026-04-16', htfBias:'Bullish', venue:'bitunix' },
  { id:4,  pair:'GBP/JPY',  dir:'Long',  setup:'Trusted BOS entry',          entry:197.50, sl:197.10, tp:198.30, size:0.2,  risk:80,  rr:2.0,  pnl:160,  outcome:'Win',  status:'Closed', market:'Forex',   session:'London',  conf:7, date:'2026-04-17', htfBias:'Bullish', venue:'mt5' },
  { id:5,  pair:'USD/CAD',  dir:'Short', setup:'mbms confirmation entry',    entry:1.3820, sl:1.3860, tp:1.3740, size:0.25, risk:60,  rr:2.0,  pnl:-60,  outcome:'Loss', status:'Closed', market:'Forex',   session:'NY',      conf:5, date:'2026-04-18', htfBias:'Bearish', venue:'mt5' },
  { id:6,  pair:'GBP/USD',  dir:'Long',  setup:'Secondary POI + SC entry',  entry:1.2720, sl:1.2685, tp:1.2810, size:0.5,  risk:100, rr:2.57, pnl:257,  outcome:'Win',  status:'Closed', market:'Forex',   session:'London',  conf:8, date:'2026-04-21', htfBias:'Bullish', venue:'mt5' },
  { id:7,  pair:'ETHUSDT',  dir:'Short', setup:'HTF liquidity sweep entry',  entry:3120,   sl:3180,   tp:2950,   size:0.1,  risk:90,  rr:2.83, pnl:255,  outcome:'Win',  status:'Closed', market:'Crypto',  session:'London',  conf:7, date:'2026-04-22', htfBias:'Bearish', venue:'bitunix', autoLogged:true },
  { id:8,  pair:'BTCUSDT',  dir:'Short', setup:'HTF liquidity sweep entry',  entry:67800,  sl:68400,  tp:65500,  size:0.03, risk:100, rr:3.83, pnl:0,    outcome:null,   status:'Open',   market:'Crypto',  session:'NY',      conf:8, date:'2026-04-23', htfBias:'Bearish', venue:'bitunix' },
  { id:9,  pair:'GBP/USD',  dir:'Long',  setup:'Primary POI + SC entry',     entry:1.2695, sl:1.2660, tp:1.2780, size:0.5,  risk:100, rr:2.43, pnl:0,    outcome:null,   status:'Open',   market:'Forex',   session:'London',  conf:9, date:'2026-04-24', htfBias:'Bullish', venue:'mt5' },
  { id:10, pair:'ETHUSDT',  dir:'Long',  setup:'SC reaction only',           entry:2980,   sl:2920,   tp:3100,   size:0.08, risk:70,  rr:2.0,  pnl:-70,  outcome:'Loss', status:'Closed', market:'Crypto',  session:'Asian',   conf:5, date:'2026-04-25', htfBias:'Bullish', venue:'bitunix', autoLogged:true, needsReview:true },
];

const EQUITY_DATA = [
  { date:'Apr 1',  pnl:0 },
  { date:'Apr 3',  pnl:85 },
  { date:'Apr 7',  pnl:220 },
  { date:'Apr 8',  pnl:140 },
  { date:'Apr 10', pnl:340 },
  { date:'Apr 14', pnl:540 },
  { date:'Apr 15', pnl:465 },
  { date:'Apr 16', pnl:773 },
  { date:'Apr 17', pnl:933 },
  { date:'Apr 18', pnl:873 },
  { date:'Apr 21', pnl:1130 },
  { date:'Apr 22', pnl:1385 },
  { date:'Apr 23', pnl:1385 },
  { date:'Apr 24', pnl:1385 },
  { date:'Apr 25', pnl:1315 },
];

const SETUP_STATS = [
  { name:'Secondary POI + SC', trades:12, wins:9,  avgRR:2.1 },
  { name:'Primary POI + SC',   trades:6,  wins:5,  avgRR:2.4 },
  { name:'HTF Liq. Sweep',     trades:8,  wins:5,  avgRR:2.8 },
  { name:'Trusted BOS',        trades:5,  wins:3,  avgRR:1.9 },
  { name:'mbms confirmation',  trades:4,  wins:2,  avgRR:2.0 },
  { name:'SC reaction only',   trades:3,  wins:2,  avgRR:1.8 },
];

const SESSION_STATS = [
  { name:'London', wins:18, losses:5,  total:23 },
  { name:'NY',     wins:10, losses:8,  total:18 },
  { name:'Asian',  wins:4,  losses:3,  total:7  },
];

// 8-item system alignment score definition
const ALIGNMENT_ITEMS = [
  { id:'htfAlign',    label:'HTF Aligned',          desc:'Monthly/Weekly/Daily all pointing same way' },
  { id:'liqTaken',    label:'$$ Liquidity Taken',   desc:'$$  swept before entry' },
  { id:'entryConf',   label:'Entry Confirmation',   desc:'HH+HL (long) or LL+LH (short) forming' },
  { id:'momentum',    label:'Distance & Momentum',  desc:'Strong or moderate push' },
  { id:'notChasing',  label:'Not Chasing',          desc:'Waiting for confirmation, not FOMO entry' },
  { id:'mentorCheck', label:'Mentor Check',         desc:'Would take this in front of a mentor' },
  { id:'mySystem',    label:'My System',            desc:'Fits my rules exactly, not improvising' },
  { id:'dxyConfirms', label:'DXY Confirms',         desc:'DXY direction supports this trade' },
];

Object.assign(window, {
  SAMPLE_TRADES, EQUITY_DATA, SETUP_STATS, SESSION_STATS,
  ALIGNMENT_ITEMS, detectVenue, fmtRR
});
