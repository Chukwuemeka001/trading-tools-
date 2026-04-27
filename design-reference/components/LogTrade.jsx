// LogTrade.jsx v3 — venue auto-detect, 8-item alignment score, chip confluence grid
function LogTrade({ onSaved }) {
  const [step, setStep] = React.useState(1);
  const [saved, setSaved] = React.useState(false);
  const [form, setForm] = React.useState({
    pair:'GBP/USD', market:'Forex', direction:'Long',
    timeframe:'H1', setup:'Secondary POI + SC entry', session:'London',
    htfBias:'', liquidity:'', entryConf:'', momentum:'',
    mbms:'', sc:'', poiType:'', dxyConfirms:'',
    notChasing:'', mentorCheck:'', mySystem:'',
    entry:'', sl:'', tp:'', risk:100, capital:10000,
    confidence:7, rationale:'',
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  // Auto-detect venue from symbol
  const venue = React.useMemo(() => window.detectVenue ? window.detectVenue(form.pair) : 'mt5', [form.pair]);
  const venueColor = venue === 'bitunix' ? 'var(--orange)' : 'var(--blue)';
  const venueLabel = venue === 'bitunix' ? '🟧 Bitunix' : '📊 MT5';

  // Live calc
  const calc = React.useMemo(() => {
    const e=parseFloat(form.entry), s=parseFloat(form.sl), t=parseFloat(form.tp);
    if (!e || !s) return {};
    const riskAmt = form.risk;
    const slDist = Math.abs(e-s);
    const tpDist = t ? Math.abs(e-t) : null;
    const isCrypto = venue === 'bitunix';
    const slPips = isCrypto ? slDist.toFixed(0) : (slDist*10000).toFixed(1);
    const lotSize = isCrypto ? (riskAmt/slDist).toFixed(4) : (riskAmt/(slDist*10000*10)).toFixed(2);
    const rr = tpDist ? (tpDist/slDist).toFixed(2) : null;
    return { slPips, lotSize, rr, isCrypto };
  }, [form.entry, form.sl, form.tp, form.risk, venue]);

  // 8-item alignment score
  const score = React.useMemo(() => {
    const checks = [
      form.htfBias && form.htfBias !== 'Neutral',
      form.liquidity === 'Yes',
      form.entryConf === 'HH+HL' || form.entryConf === 'LL+LH',
      form.momentum === 'Strong' || form.momentum === 'Moderate',
      form.notChasing === 'Waiting',
      form.mentorCheck === 'Yes',
      form.mySystem === 'Yes',
      form.dxyConfirms === 'Yes aligned',
    ];
    return checks.filter(Boolean).length;
  }, [form]);

  const scoreColor = score >= 6 ? 'var(--green)' : score >= 3 ? 'var(--amber)' : 'var(--red)';
  const scoreLabel = score >= 6 ? 'Strong — proceed' : score >= 3 ? 'Review before trading' : 'Do not take this trade';

  const STEPS = ['Instrument','Confluence','Levels','Score & Review'];
  const progress = ((step-1)/(STEPS.length-1))*100;

  const inp = (extra={}) => ({
    background:'var(--s3)', border:'1px solid var(--border)', borderRadius:8,
    padding:'11px 13px', color:'var(--t1)', fontSize:14, width:'100%',
    outline:'none', boxSizing:'border-box', fontFamily:'inherit', ...extra
  });
  const lbl = { fontSize:11, color:'var(--t3)', marginBottom:6, display:'block', textTransform:'uppercase', letterSpacing:'0.06em' };
  const Row = ({ children }) => <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>{children}</div>;
  const Field = ({ label, children }) => <div><label style={lbl}>{label}</label>{children}</div>;

  // Chip group — visual selector only (not scored)
  const CGroup = ({ label, field, opts, scored }) => {
    const active = form[field];
    return (
      <div style={{ background:'var(--s3)', borderRadius:10, padding:'12px 14px', position:'relative' }}>
        {scored && <span style={{ position:'absolute', top:8, right:10, fontSize:9, color:'var(--blue)', fontWeight:700, letterSpacing:'0.06em', textTransform:'uppercase' }}>scored</span>}
        <div style={{ fontSize:11, color:'var(--t3)', marginBottom:8, textTransform:'uppercase', letterSpacing:'0.06em', paddingRight:40 }}>{label}</div>
        <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
          {opts.map(({ val, color }) => {
            const isActive = active === val;
            const c = color || 'var(--blue)';
            return (
              <button key={val} onClick={() => set(field, val)} style={{
                padding:'5px 12px', borderRadius:20,
                border:`1px solid ${isActive ? c : 'var(--border)'}`,
                background: isActive ? `${c}18` : 'transparent',
                color: isActive ? c : 'var(--t3)', fontSize:12, fontWeight:isActive?600:400,
                cursor:'pointer', transition:'all 0.15s'
              }}>{val}</button>
            );
          })}
        </div>
      </div>
    );
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => { setSaved(false); if(onSaved) onSaved(form); }, 1500);
  };

  return (
    <div style={{ maxWidth:640, margin:'0 auto', paddingBottom:40 }}>
      {/* Step progress */}
      <div style={{ marginBottom:24 }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:12 }}>
          {STEPS.map((s,i) => (
            <button key={s} onClick={()=>setStep(i+1)} style={{ background:'none', border:'none', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:5 }}>
              <div style={{ width:32, height:32, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center',
                background: step>i+1?'var(--green)':step===i+1?'var(--blue)':'var(--s3)',
                border:`2px solid ${step>i+1?'var(--green)':step===i+1?'var(--blue)':'var(--border)'}`,
                fontSize:12, fontWeight:700, color:step>=i+1?'#fff':'var(--t3)', transition:'all 0.2s' }}>
                {step>i+1?'✓':i+1}
              </div>
              <span style={{ fontSize:10, color:step===i+1?'var(--blue)':'var(--t3)', fontWeight:step===i+1?600:400, whiteSpace:'nowrap' }}>{s}</span>
            </button>
          ))}
        </div>
        <div style={{ height:3, background:'var(--s3)', borderRadius:2 }}>
          <div style={{ height:'100%', width:`${progress}%`, background:'var(--blue)', borderRadius:2, transition:'width 0.4s ease' }}/>
        </div>
      </div>

      <div style={{ background:'var(--s2)', border:'1px solid var(--border)', borderRadius:12, padding:26, marginBottom:14 }}>

        {/* STEP 1 — Instrument */}
        {step===1 && (
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div style={{ fontWeight:700, fontSize:17, color:'var(--t1)' }}>Instrument & Setup</div>
              {/* Venue badge — auto-detected */}
              <div style={{ display:'flex', alignItems:'center', gap:6, padding:'5px 12px', borderRadius:20,
                background:`${venueColor}15`, border:`1px solid ${venueColor}30` }}>
                <span style={{ width:6, height:6, borderRadius:'50%', background:venueColor }}/>
                <span style={{ fontSize:12, color:venueColor, fontWeight:600 }}>{venueLabel}</span>
              </div>
            </div>
            <Row>
              <Field label="Pair / Symbol">
                <input style={inp()} value={form.pair} onChange={e=>set('pair',e.target.value)} placeholder="GBP/USD or BTCUSDT"/>
              </Field>
              <Field label="Session">
                <select style={inp({cursor:'pointer'})} value={form.session} onChange={e=>set('session',e.target.value)}>
                  {['London','NY Session','Asian','London+NY Overlap'].map(s=><option key={s}>{s}</option>)}
                </select>
              </Field>
            </Row>
            <Field label="Direction">
              <div style={{ display:'flex', gap:10 }}>
                {['Long','Short'].map(d=>(
                  <button key={d} onClick={()=>set('direction',d)} style={{
                    flex:1, padding:'12px', borderRadius:9, fontWeight:700, fontSize:15, cursor:'pointer',
                    border:`1px solid ${form.direction===d?(d==='Long'?'var(--green)':'var(--red)'):'var(--border)'}`,
                    background: form.direction===d?(d==='Long'?'rgba(34,197,94,0.12)':'rgba(239,68,68,0.12)'):'var(--s3)',
                    color: form.direction===d?(d==='Long'?'var(--green)':'var(--red)'):'var(--t3)', transition:'all 0.2s'
                  }}>{d==='Long'?'▲ Long':'▼ Short'}</button>
                ))}
              </div>
            </Field>
            <Row>
              <Field label="Entry Timeframe">
                <select style={inp({cursor:'pointer'})} value={form.timeframe} onChange={e=>set('timeframe',e.target.value)}>
                  {['M1','M5','M15','H1','H4','D1','W1'].map(t=><option key={t}>{t}</option>)}
                </select>
              </Field>
              <Field label="Setup Type">
                <select style={inp({cursor:'pointer'})} value={form.setup} onChange={e=>set('setup',e.target.value)}>
                  {['Secondary POI + SC entry','Primary POI + SC entry','Trusted BOS entry','mbms confirmation entry','SC reaction only','HTF liquidity sweep entry','Other'].map(s=><option key={s}>{s}</option>)}
                </select>
              </Field>
            </Row>
          </div>
        )}

        {/* STEP 2 — Confluence visual chip grid (display only, not the score) */}
        {step===2 && (
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <div style={{ fontWeight:700, fontSize:17, color:'var(--t1)' }}>Confluence Analysis</div>
            <div style={{ fontSize:12, color:'var(--t3)', padding:'8px 12px', background:'var(--s3)', borderRadius:8, lineHeight:1.6 }}>
              These 6 chips are visual reference. The <span style={{ color:'var(--blue)' }}>8-item system alignment score</span> is calculated separately in Step 4.
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10 }}>
              <CGroup label="HTF Bias (Daily)" field="htfBias" opts={[
                {val:'Bullish',color:'var(--green)'},{val:'Bearish',color:'var(--red)'},{val:'Neutral',color:'var(--t3)'}
              ]}/>
              <CGroup label="POI Level" field="poiType" opts={[
                {val:'Secondary',color:'var(--blue)'},{val:'Primary',color:'var(--purple)'}
              ]}/>
              <CGroup label="$$ Liquidity Taken" field="liquidity" opts={[
                {val:'Yes',color:'var(--amber)'},{val:'Partial',color:'var(--amber)'},{val:'No',color:'var(--t3)'}
              ]}/>
              <CGroup label="mbms Confirmed" field="mbms" opts={[
                {val:'Yes',color:'var(--green)'},{val:'Forming',color:'var(--amber)'},{val:'No',color:'var(--red)'}
              ]}/>
              <CGroup label="SC Zone Visible" field="sc" opts={[
                {val:'Yes',color:'#6b7280'},{val:'Forming',color:'var(--amber)'},{val:'No',color:'var(--red)'}
              ]}/>
              <CGroup label="Entry Confirmation" field="entryConf" opts={[
                {val:'HH+HL',color:'var(--green)'},{val:'LL+LH',color:'var(--red)'},{val:'Partial',color:'var(--amber)'},{val:'None yet',color:'var(--t3)'}
              ]}/>
            </div>
            <Row>
              <Field label="Distance & Momentum">
                <div style={{ display:'flex', gap:8 }}>
                  {['Strong','Moderate','Weak'].map(v=>(
                    <button key={v} onClick={()=>set('momentum',v)} style={{
                      flex:1, padding:'9px 4px', borderRadius:8,
                      border:`1px solid ${form.momentum===v?'var(--blue)':'var(--border)'}`,
                      background:form.momentum===v?'rgba(59,130,246,0.12)':'var(--s3)',
                      color:form.momentum===v?'var(--blue)':'var(--t3)', fontSize:12, fontWeight:form.momentum===v?600:400, cursor:'pointer'
                    }}>{v}</button>
                  ))}
                </div>
              </Field>
              <Field label="DXY Confirms Trade?">
                <select style={inp({cursor:'pointer'})} value={form.dxyConfirms} onChange={e=>set('dxyConfirms',e.target.value)}>
                  {['','Yes aligned','No conflicts','Neutral'].map(v=><option key={v} value={v}>{v||'— Select —'}</option>)}
                </select>
              </Field>
            </Row>
            <Field label={`Confidence: ${form.confidence}/10`}>
              <input type="range" min={1} max={10} value={form.confidence} onChange={e=>set('confidence',+e.target.value)}
                style={{ width:'100%', accentColor:'var(--blue)' }}/>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'var(--t3)', marginTop:2 }}>
                <span>Low</span><span>High</span>
              </div>
            </Field>
          </div>
        )}

        {/* STEP 3 — Trade Levels */}
        {step===3 && (
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <div style={{ fontWeight:700, fontSize:17, color:'var(--t1)' }}>Trade Levels</div>
            {[['entry','Entry Price','var(--blue)'],['sl','Stop Loss','var(--red)'],['tp','Take Profit','var(--green)']].map(([k,l,c])=>(
              <Field key={k} label={l}>
                <input style={inp({ borderColor:`${c}40`, fontFamily:'var(--mono)', fontSize:16 })}
                  type="number" step="0.00001" value={form[k]} onChange={e=>set(k,e.target.value)}/>
              </Field>
            ))}
            <Row>
              <Field label="Risk ($)"><input style={inp({fontFamily:'var(--mono)'})} type="number" value={form.risk} onChange={e=>set('risk',+e.target.value)}/></Field>
              <Field label="Capital ($)"><input style={inp({fontFamily:'var(--mono)'})} type="number" value={form.capital} onChange={e=>set('capital',+e.target.value)}/></Field>
            </Row>
            {calc.lotSize && (
              <div style={{ background:'var(--s3)', borderRadius:10, padding:16, display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, border:`1px solid ${venueColor}25` }}>
                {[[calc.isCrypto?'Position Size':'Lot Size',calc.lotSize,venueColor],
                  [calc.isCrypto?'SL ($)':'SL (pips)',calc.slPips,'var(--red)'],
                  ['R:R',calc.rr?`1:${calc.rr}`:'—',parseFloat(calc.rr)>=2?'var(--green)':'var(--amber)']
                ].map(([l,v,c])=>(
                  <div key={l} style={{ textAlign:'center' }}>
                    <div style={{ fontSize:10, color:'var(--t3)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:5 }}>{l}</div>
                    <div style={{ fontFamily:'var(--mono)', fontWeight:700, fontSize:22, color:c }}>{v}</div>
                  </div>
                ))}
              </div>
            )}
            <Field label="Trade Rationale">
              <textarea style={{ ...inp(), height:80, resize:'vertical' }} value={form.rationale}
                onChange={e=>set('rationale',e.target.value)} placeholder="Why are you taking this trade?"/>
            </Field>
          </div>
        )}

        {/* STEP 4 — 8-item System Alignment Score + Review */}
        {step===4 && (
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <div style={{ fontWeight:700, fontSize:17, color:'var(--t1)' }}>System Alignment Score</div>

            {/* Score hero */}
            <div style={{ background:'var(--s3)', borderRadius:12, padding:'18px 20px', display:'flex', justifyContent:'space-between', alignItems:'center',
              border:`1px solid ${scoreColor}30` }}>
              <div>
                <div style={{ fontFamily:'var(--mono)', fontSize:42, fontWeight:800, color:scoreColor, lineHeight:1 }}>{score}<span style={{ fontSize:20, color:'var(--t3)' }}>/8</span></div>
                <div style={{ fontSize:13, fontWeight:600, color:scoreColor, marginTop:6 }}>{scoreLabel}</div>
              </div>
              <div style={{ width:80, height:80, position:'relative' }}>
                <svg viewBox="0 0 80 80" width={80} height={80}>
                  <circle cx={40} cy={40} r={32} fill="none" stroke="var(--s2)" strokeWidth={8}/>
                  <circle cx={40} cy={40} r={32} fill="none" stroke={scoreColor} strokeWidth={8}
                    strokeDasharray={2*Math.PI*32} strokeDashoffset={2*Math.PI*32*(1-score/8)}
                    strokeLinecap="round" transform="rotate(-90 40 40)"/>
                </svg>
              </div>
            </div>

            {/* 8 items */}
            <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
              {[
                ['HTF Aligned',       'htfBias',    [['Bullish','var(--green)'],['Bearish','var(--red)'],['Neutral','var(--t3)']], v => v && v !== 'Neutral'],
                ['$$ Liquidity Taken','liquidity',  [['Yes','var(--amber)'],['Partial','var(--amber)'],['No','var(--t3)']], v => v === 'Yes'],
                ['Entry Confirmation','entryConf',  [['HH+HL','var(--green)'],['LL+LH','var(--red)'],['Partial','var(--amber)'],['None yet','var(--t3)']], v => v==='HH+HL'||v==='LL+LH'],
                ['Distance & Momentum','momentum',  [['Strong','var(--green)'],['Moderate','var(--amber)'],['Weak','var(--red)']], v => v==='Strong'||v==='Moderate'],
                ['Not Chasing',       'notChasing', [['Waiting','var(--green)'],['Chasing','var(--red)']], v => v==='Waiting'],
                ['Mentor Check',      'mentorCheck',[['Yes','var(--green)'],['No','var(--red)']], v => v==='Yes'],
                ['My System',         'mySystem',   [['Yes','var(--green)'],['Improvising','var(--red)']], v => v==='Yes'],
                ['DXY Confirms',      'dxyConfirms',[['Yes aligned','var(--green)'],['No conflicts','var(--red)'],['Neutral','var(--t3)']], v => v==='Yes aligned'],
              ].map(([label, field, opts, isGood], i) => {
                const val = form[field];
                const good = val && isGood(val);
                return (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 14px', borderRadius:9,
                    background:'var(--s3)', border:`1px solid ${good?'rgba(34,197,94,0.15)':val?'rgba(239,68,68,0.12)':'var(--border)'}` }}>
                    <span style={{ width:18, height:18, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center',
                      background: good?'var(--green)':val?'var(--red)':'var(--border)', fontSize:11, flexShrink:0, color:'#fff' }}>
                      {good ? '✓' : val ? '✕' : ''}
                    </span>
                    <span style={{ fontSize:13, color:'var(--t2)', flex:1 }}>{label}</span>
                    <div style={{ display:'flex', gap:5, flexWrap:'wrap', justifyContent:'flex-end' }}>
                      {opts.map(([optVal, optColor]) => (
                        <button key={optVal} onClick={() => set(field, optVal)} style={{
                          padding:'3px 10px', borderRadius:12, border:`1px solid ${form[field]===optVal?optColor:'var(--border)'}`,
                          background: form[field]===optVal?`${optColor}18`:'transparent',
                          color: form[field]===optVal?optColor:'var(--t3)', fontSize:11, cursor:'pointer', fontWeight:form[field]===optVal?600:400
                        }}>{optVal}</button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            <div style={{ borderTop:'1px solid var(--border)', paddingTop:14, display:'flex', flexDirection:'column', gap:6 }}>
              {[['Pair',`${form.pair}`],['Direction',form.direction],['Setup',form.setup],
                form.entry?['Entry',form.entry]:null, form.sl?['SL',form.sl]:null,
                calc.rr?['R:R',`1:${calc.rr}`]:null
              ].filter(Boolean).map(([k,v],i)=>(
                <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'6px 0', borderBottom:'1px solid var(--border)' }}>
                  <span style={{ fontSize:12, color:'var(--t3)' }}>{k}</span>
                  <span style={{ fontSize:13, fontFamily:/\d/.test(v)?'var(--mono)':'inherit', color:'var(--t1)', fontWeight:500 }}>{v}</span>
                </div>
              ))}
            </div>

            {/* Venue-aware approve button */}
            <div style={{ padding:'12px 16px', borderRadius:10, border:`1px solid ${venueColor}30`, background:`${venueColor}08`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span style={{ fontSize:13, color:'var(--t2)' }}>Send to execution queue via</span>
              <span style={{ fontSize:13, fontWeight:700, color:venueColor }}>{venueLabel}</span>
            </div>
          </div>
        )}
      </div>

      {/* Nav */}
      <div style={{ display:'flex', gap:10 }}>
        <button onClick={()=>setStep(s=>Math.max(1,s-1))} disabled={step===1} style={{
          flex:1, padding:'13px', borderRadius:9, border:'1px solid var(--border)',
          background:'var(--s2)', color:step===1?'var(--t3)':'var(--t1)',
          fontWeight:600, fontSize:14, cursor:step===1?'not-allowed':'pointer' }}>← Back</button>
        {step<4 ? (
          <button onClick={()=>setStep(s=>s+1)} style={{
            flex:2, padding:'13px', borderRadius:9, border:'none', background:'var(--blue)',
            color:'#fff', fontWeight:600, fontSize:14, cursor:'pointer' }}>
            Continue → {STEPS[step]}
          </button>
        ) : (
          <button onClick={handleSave} style={{
            flex:2, padding:'13px', borderRadius:9, border:'none',
            background: saved?'var(--green)':venueColor, color:'#fff', fontWeight:700, fontSize:14, cursor:'pointer', transition:'all 0.2s' }}>
            {saved?'✓ Saved!':`💾 Save & Queue → ${venueLabel}`}
          </button>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { LogTrade });
