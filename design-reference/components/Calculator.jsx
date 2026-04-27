// Calculator.jsx — Real-time position size calculator
function Calculator() {
  const [mode, setMode] = React.useState('forex');
  const [form, setForm] = React.useState({
    capital: 10000, risk: 1, entry: '', sl: '', tp: '',
    direction: 'Long', pairType: 'usd-quote',
  });
  const [history, setHistory] = React.useState([]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const calc = React.useMemo(() => {
    const { capital, risk, entry, sl, tp, direction, pairType } = form;
    const e = parseFloat(entry), s = parseFloat(sl), t = parseFloat(tp);
    if (!e || !s) return null;

    const riskAmt = (capital * risk) / 100;
    let slDist, tpDist, lotSize, pipVal;

    if (mode === 'forex') {
      // pip value per standard lot depends on pair type
      if (pairType === 'usd-quote') pipVal = 10;
      else if (pairType === 'usd-base') pipVal = 10 / e;
      else pipVal = 10; // simplified for cross

      slDist = Math.abs(e - s);
      tpDist = t ? Math.abs(e - t) : null;
      const slPips = slDist * 10000;
      lotSize = riskAmt / (slPips * pipVal);
      const rr = tpDist ? (tpDist / slDist).toFixed(2) : null;
      const reward = tpDist ? riskAmt * parseFloat(rr) : null;
      return { riskAmt, slDist: (slDist*10000).toFixed(1), tpDist: tpDist ? (tpDist*10000).toFixed(1) : null,
        lotSize: lotSize.toFixed(2), rr, reward: reward ? reward.toFixed(2) : null,
        afterWin: reward ? (capital + parseFloat(reward)).toFixed(2) : null,
        afterLoss: (capital - riskAmt).toFixed(2),
        riskPct: risk };
    } else {
      // BTC
      slDist = Math.abs(e - s);
      tpDist = t ? Math.abs(e - t) : null;
      const posSize = riskAmt / slDist;
      const rr = tpDist ? (tpDist / slDist).toFixed(2) : null;
      const reward = tpDist ? riskAmt * parseFloat(rr) : null;
      return { riskAmt, slDist: slDist.toFixed(0), tpDist: tpDist ? tpDist.toFixed(0) : null,
        lotSize: posSize.toFixed(4), rr, reward: reward ? reward.toFixed(2) : null,
        afterWin: reward ? (capital + parseFloat(reward)).toFixed(2) : null,
        afterLoss: (capital - riskAmt).toFixed(2),
        riskPct: risk };
    }
  }, [form, mode]);

  const inp = { background:'var(--s3)', border:'1px solid var(--border)', borderRadius:8, padding:'10px 12px',
    color:'var(--t1)', fontSize:14, fontFamily:'var(--mono)', width:'100%', outline:'none', boxSizing:'border-box' };
  const lbl = { fontSize:11, color:'var(--t3)', marginBottom:4, display:'block', textTransform:'uppercase', letterSpacing:'0.06em' };

  return (
    <div style={{ maxWidth:680, margin:'0 auto', paddingBottom:40 }}>
      {/* Mode toggle */}
      <div style={{ display:'flex', gap:4, background:'var(--s2)', border:'1px solid var(--border)', borderRadius:10, padding:4, marginBottom:20, width:'fit-content' }}>
        {['forex','btc'].map(m => (
          <button key={m} onClick={() => setMode(m)}
            style={{ padding:'7px 20px', borderRadius:7, border:'none', cursor:'pointer', fontSize:13, fontWeight:600,
              background: mode===m ? 'var(--blue)' : 'transparent', color: mode===m ? '#fff' : 'var(--t3)', transition:'all 0.2s' }}>
            {m === 'forex' ? 'Forex' : 'BTC/USDT'}
          </button>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
        {/* Left: inputs */}
        <div style={{ background:'var(--s2)', border:'1px solid var(--border)', borderRadius:12, padding:20, display:'flex', flexDirection:'column', gap:14 }}>
          <div style={{ fontWeight:600, fontSize:14, color:'var(--t1)', marginBottom:2 }}>Account</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <div>
              <label style={lbl}>Capital</label>
              <input style={inp} type="number" value={form.capital} onChange={e => set('capital', +e.target.value)} placeholder="10000"/>
            </div>
            <div>
              <label style={lbl}>Risk %</label>
              <input style={inp} type="number" value={form.risk} step="0.1" onChange={e => set('risk', +e.target.value)} placeholder="1"/>
            </div>
          </div>

          <div style={{ height:1, background:'var(--border)' }}/>
          <div style={{ fontWeight:600, fontSize:14, color:'var(--t1)' }}>Trade Levels</div>

          {/* Direction */}
          <div style={{ display:'flex', gap:8 }}>
            {['Long','Short'].map(d => (
              <button key={d} onClick={() => set('direction', d)}
                style={{ flex:1, padding:'8px', borderRadius:8, border:`1px solid ${form.direction===d ? (d==='Long'?'var(--green)':'var(--red)') : 'var(--border)'}`,
                  background: form.direction===d ? (d==='Long'?'rgba(34,197,94,0.15)':'rgba(239,68,68,0.15)') : 'var(--s3)',
                  color: form.direction===d ? (d==='Long'?'var(--green)':'var(--red)') : 'var(--t3)',
                  fontWeight:600, fontSize:13, cursor:'pointer', transition:'all 0.2s' }}>
                {d === 'Long' ? '▲ Long' : '▼ Short'}
              </button>
            ))}
          </div>

          {['entry','sl','tp'].map(k => (
            <div key={k}>
              <label style={lbl}>{k==='entry'?'Entry Price':k==='sl'?'Stop Loss':'Take Profit (optional)'}</label>
              <input style={{ ...inp, borderColor: k==='sl'?'rgba(239,68,68,0.3)': k==='tp'?'rgba(34,197,94,0.3)':'var(--border)' }}
                type="number" step="0.00001" value={form[k]} onChange={e => set(k, e.target.value)} placeholder={k==='entry'?'1.2650':k==='sl'?'1.2610':'1.2730'}/>
            </div>
          ))}

          {mode === 'forex' && (
            <div>
              <label style={lbl}>Pair Type</label>
              <select style={{ ...inp, cursor:'pointer' }} value={form.pairType} onChange={e => set('pairType', e.target.value)}>
                <option value="usd-quote">USD Quote — EUR/USD, GBP/USD…</option>
                <option value="usd-base">USD Base — USD/JPY, USD/CAD…</option>
                <option value="cross">Cross Pair — EUR/GBP, GBP/JPY…</option>
              </select>
            </div>
          )}
        </div>

        {/* Right: results */}
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {calc ? (
            <>
              <ResultCard label="Risk Amount" value={`$${calc.riskAmt.toFixed(2)}`} sub={`${calc.riskPct}% of capital`} color="var(--red)"/>
              <ResultCard label={mode==='forex'?'Lot Size':'Position Size'} value={calc.lotSize} sub={mode==='forex'?'standard lots':'BTC'} color="var(--blue)" big/>
              {calc.rr && <ResultCard label="R:R Ratio" value={`1:${calc.rr}`} color={parseFloat(calc.rr)>=2?'var(--green)':'var(--amber)'}/>}
              {calc.reward && <ResultCard label="Reward (TP)" value={`$${calc.reward}`} color="var(--green)"/>}
              <div style={{ background:'var(--s2)', border:'1px solid var(--border)', borderRadius:12, padding:16 }}>
                <div style={{ fontSize:11, color:'var(--t3)', marginBottom:10, textTransform:'uppercase', letterSpacing:'0.06em' }}>Price Levels</div>
                {[['SL Distance', `${calc.slDist} ${mode==='forex'?'pips':'USD'}`],
                  calc.tpDist ? ['TP Distance', `${calc.tpDist} ${mode==='forex'?'pips':'USD'}`] : null,
                  calc.afterWin ? ['After Win', `$${calc.afterWin}`] : null,
                  ['After Loss', `$${calc.afterLoss}`]
                ].filter(Boolean).map(([k,v],i) => (
                  <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'5px 0',
                    borderBottom: i < 3 ? '1px solid var(--border)' : 'none' }}>
                    <span style={{ fontSize:12, color:'var(--t3)' }}>{k}</span>
                    <span style={{ fontSize:12, fontFamily:'var(--mono)', color:'var(--t1)' }}>{v}</span>
                  </div>
                ))}
              </div>
              {/* RR visual bar */}
              {calc.rr && (
                <div style={{ background:'var(--s2)', border:'1px solid var(--border)', borderRadius:12, padding:16 }}>
                  <div style={{ fontSize:11, color:'var(--t3)', marginBottom:8, textTransform:'uppercase', letterSpacing:'0.06em' }}>Risk : Reward</div>
                  <div style={{ display:'flex', gap:3, alignItems:'center', height:20 }}>
                    <div style={{ flex:1, height:10, background:'rgba(239,68,68,0.4)', borderRadius:'4px 0 0 4px' }}/>
                    <div style={{ flex:parseFloat(calc.rr), height:10, background:'rgba(34,197,94,0.5)', borderRadius:'0 4px 4px 0' }}/>
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between', marginTop:4 }}>
                    <span style={{ fontSize:10, color:'var(--red)' }}>Risk 1</span>
                    <span style={{ fontSize:10, color:'var(--green)' }}>Reward {calc.rr}</span>
                  </div>
                </div>
              )}
              <button onClick={() => setHistory(h => [{ ...calc, ...form, ts: new Date().toLocaleTimeString() }, ...h.slice(0,4)])}
                style={{ background:'var(--blue)', color:'#fff', border:'none', borderRadius:8, padding:'10px', fontWeight:600, fontSize:13, cursor:'pointer' }}>
                💾 Save to History
              </button>
            </>
          ) : (
            <div style={{ background:'var(--s2)', border:'1px solid var(--border)', borderRadius:12, padding:24, color:'var(--t3)', fontSize:13, textAlign:'center' }}>
              Enter Entry and Stop Loss to see results
            </div>
          )}

          {history.length > 0 && (
            <div style={{ background:'var(--s2)', border:'1px solid var(--border)', borderRadius:12, padding:16 }}>
              <div style={{ fontSize:11, color:'var(--t3)', marginBottom:10, textTransform:'uppercase', letterSpacing:'0.06em' }}>Recent Calculations</div>
              {history.map((h, i) => (
                <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'5px 0', borderBottom: i < history.length-1 ? '1px solid var(--border)' : 'none' }}>
                  <span style={{ fontSize:11, color:'var(--t3)' }}>{h.ts}</span>
                  <span style={{ fontSize:11, fontFamily:'var(--mono)', color:'var(--t1)' }}>{h.lotSize} lots · {h.rr ? `1:${h.rr}` : '—'}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ResultCard({ label, value, sub, color, big }) {
  return (
    <div style={{ background:'var(--s2)', border:`1px solid ${color}30`, borderRadius:12, padding:'14px 16px' }}>
      <div style={{ fontSize:11, color:'var(--t3)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:4 }}>{label}</div>
      <div style={{ fontFamily:'var(--mono)', fontWeight:700, fontSize: big ? 28 : 20, color }}>{value}</div>
      {sub && <div style={{ fontSize:11, color:'var(--t3)', marginTop:2 }}>{sub}</div>}
    </div>
  );
}

Object.assign(window, { Calculator });
