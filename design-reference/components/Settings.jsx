// Settings.jsx v2 — MT5 + Bitunix, Kraken removed
function Settings() {
  const [section, setSection] = React.useState('profile');
  const [saved, setSaved] = React.useState(false);
  const [vals, setVals] = React.useState({
    traderName:'', currency:'USD', startingCapital:10000,
    defaultRisk:1, riskCap:2, beRR:5, maxTrades:3,
    timezone:'UTC', defaultTF:'H1', defaultMarket:'Forex',
    dailyDD:2, weeklyDD:10, monthlyDD:25,
    // MT5
    mt5BackendURL:'https://poiwatcher-backend.onrender.com',
    mt5ExecKey:'', mt5PaperMode:true,
    // Bitunix
    bitunixApiKey:'', bitunixApiSecret:'', bitunixPaperMode:true,
    // Execution
    autoExec:'manual', minScore:6, requireChecklist:true,
    // Sync
    githubToken:'', gistId:'',
    // Display
    equityCurve:true, sessionMonitor:true, publicProfile:false,
  });
  const set = (k, v) => setVals(s => ({ ...s, [k]: v }));
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 1800); };

  const SECTIONS = [
    { id:'profile',     icon:'👤', label:'Profile' },
    { id:'risk',        icon:'⚠️',  label:'Risk Limits' },
    { id:'connections', icon:'🔌', label:'Connections' },
    { id:'execution',   icon:'⚡', label:'Execution' },
    { id:'display',     icon:'🖥️',  label:'Display' },
    { id:'sync',        icon:'☁️',  label:'Cloud Sync' },
    { id:'export',      icon:'📤', label:'Export' },
    { id:'danger',      icon:'🗑️',  label:'Danger Zone' },
  ];

  const inp = (extra={}) => ({
    background:'var(--s3)', border:'1px solid var(--border)', borderRadius:8,
    padding:'10px 13px', color:'var(--t1)', fontSize:13, outline:'none',
    boxSizing:'border-box', fontFamily:'inherit', width:'100%', ...extra
  });
  const lbl = { fontSize:11, color:'var(--t3)', marginBottom:5, display:'block', letterSpacing:'0.04em', textTransform:'uppercase' };
  const Field = ({ label, children }) => <div style={{ marginBottom:16 }}><label style={lbl}>{label}</label>{children}</div>;
  const Row = ({ children }) => <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>{children}</div>;
  const Toggle2 = ({ val, onChange, label, sub }) => (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 0', borderBottom:'1px solid var(--border)' }}>
      <div>
        <div style={{ fontSize:13, color:'var(--t2)' }}>{label}</div>
        {sub && <div style={{ fontSize:11, color:'var(--t3)', marginTop:2 }}>{sub}</div>}
      </div>
      <div onClick={() => onChange(!val)} style={{
        width:40, height:22, borderRadius:11, background:val?'var(--blue)':'var(--s3)',
        border:`1px solid ${val?'var(--blue)':'var(--border)'}`, cursor:'pointer', position:'relative', transition:'all 0.2s', flexShrink:0
      }}>
        <div style={{ position:'absolute', top:3, left:val?20:3, width:14, height:14, borderRadius:'50%', background:'#fff', transition:'left 0.2s' }}/>
      </div>
    </div>
  );

  // Connection card component
  const ConnCard = ({ title, icon, color, status, statusLabel, children }) => (
    <div style={{ background:'var(--s2)', border:`1px solid ${color}25`, borderRadius:12, padding:20, marginBottom:14 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:32, height:32, borderRadius:8, background:`${color}15`, border:`1px solid ${color}30`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>{icon}</div>
          <span style={{ fontWeight:700, fontSize:15, color:'var(--t1)' }}>{title}</span>
        </div>
        <span style={{ fontSize:11, padding:'3px 10px', borderRadius:20, fontWeight:600,
          background:`${status?'var(--green)':'var(--red)'}15`,
          color: status?'var(--green)':'var(--red)',
          border:`1px solid ${status?'var(--green)':'var(--red)'}30`,
          display:'flex', alignItems:'center', gap:6 }}>
          <span style={{ width:5, height:5, borderRadius:'50%', background:status?'var(--green)':'var(--red)' }}/>
          {statusLabel}
        </span>
      </div>
      {children}
    </div>
  );

  const content = {
    profile: (
      <div>
        <H2>Profile</H2>
        <Row>
          <Field label="Trader Name"><input style={inp()} value={vals.traderName} onChange={e=>set('traderName',e.target.value)} placeholder="Your name"/></Field>
          <Field label="Currency">
            <select style={inp({cursor:'pointer'})} value={vals.currency} onChange={e=>set('currency',e.target.value)}>
              {['USD','GBP','EUR','CAD'].map(c=><option key={c}>{c}</option>)}
            </select>
          </Field>
        </Row>
        <Field label="Starting Capital"><input style={inp({fontFamily:'var(--mono)'})} type="number" value={vals.startingCapital} onChange={e=>set('startingCapital',+e.target.value)}/></Field>
        <Row>
          <Field label="Default Timeframe">
            <select style={inp({cursor:'pointer'})} value={vals.defaultTF} onChange={e=>set('defaultTF',e.target.value)}>
              {['M1','M5','M15','H1','H4','D1','W1'].map(t=><option key={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Default Market">
            <select style={inp({cursor:'pointer'})} value={vals.defaultMarket} onChange={e=>set('defaultMarket',e.target.value)}>
              {['Forex','BTC/USDT','Indices','Commodities'].map(m=><option key={m}>{m}</option>)}
            </select>
          </Field>
        </Row>
      </div>
    ),
    risk: (
      <div>
        <H2>Risk Limits</H2>
        <Row>
          <Field label="Default Risk % / Trade"><input style={inp({fontFamily:'var(--mono)'})} type="number" step="0.1" value={vals.defaultRisk} onChange={e=>set('defaultRisk',+e.target.value)}/></Field>
          <Field label="Risk Cap % (hard max)"><input style={inp({fontFamily:'var(--mono)'})} type="number" step="0.1" value={vals.riskCap} onChange={e=>set('riskCap',+e.target.value)}/></Field>
        </Row>
        <Row>
          <Field label={`Break Even Trigger — ${vals.beRR}R`}>
            <input type="range" min={1} max={10} step={0.5} value={vals.beRR} onChange={e=>set('beRR',+e.target.value)} style={{ width:'100%', accentColor:'var(--blue)', marginBottom:4 }}/>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:10, color:'var(--t3)' }}>
              {[1,2,3,4,5,6,7,8,9,10].filter((_,i)=>i%2===0).map(v=><span key={v}>{v}R</span>)}
            </div>
          </Field>
          <Field label={`Max Trades / Day — ${vals.maxTrades}`}>
            <input type="range" min={1} max={10} step={1} value={vals.maxTrades} onChange={e=>set('maxTrades',+e.target.value)} style={{ width:'100%', accentColor:'var(--blue)', marginBottom:4 }}/>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:10, color:'var(--t3)' }}>
              {[1,3,5,7,10].map(v=><span key={v}>{v}</span>)}
            </div>
          </Field>
        </Row>
        <H3>Drawdown Limits</H3>
        {[['dailyDD','Daily Drawdown %',2],['weeklyDD','Weekly Drawdown %',10],['monthlyDD','Monthly Drawdown %',25]].map(([k,l,def])=>(
          <Field key={k} label={l}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <input style={{ ...inp(), flex:1 }} type="number" value={vals[k]} onChange={e=>set(k,+e.target.value)}/>
              <span style={{ fontFamily:'var(--mono)', color:'var(--amber)', fontWeight:700, width:40, textAlign:'right' }}>{vals[k]}%</span>
            </div>
          </Field>
        ))}
      </div>
    ),
    connections: (
      <div>
        <H2>Connections</H2>

        {/* MT5 */}
        <ConnCard title="MT5 (POIWatcher EA)" icon="📊" color="var(--blue)" status={false} statusLabel="Disconnected">
          <Field label="Backend URL">
            <input style={inp({fontFamily:'var(--mono)',fontSize:12})} value={vals.mt5BackendURL} onChange={e=>set('mt5BackendURL',e.target.value)}/>
          </Field>
          <Field label="Execution API Key">
            <input style={inp({fontFamily:'var(--mono)',fontSize:12})} type="password" value={vals.mt5ExecKey} onChange={e=>set('mt5ExecKey',e.target.value)} placeholder="Matches EXECUTION_API_KEY on Render"/>
          </Field>
          <Toggle2 val={vals.mt5PaperMode} onChange={v=>set('mt5PaperMode',v)} label="MT5 Paper Mode" sub="Simulates execution, no real orders"/>
          <div style={{ display:'flex', gap:8, marginTop:12 }}>
            <button style={{ flex:1, padding:'9px', borderRadius:8, border:'1px solid var(--border)', background:'var(--s3)', color:'var(--t2)', fontSize:12, cursor:'pointer' }}>↻ Test Connection</button>
            <button style={{ flex:1, padding:'9px', borderRadius:8, border:'1px solid rgba(239,68,68,0.3)', background:'rgba(239,68,68,0.07)', color:'var(--red)', fontSize:12, fontWeight:600, cursor:'pointer' }}>🛑 Emergency Stop</button>
          </div>
        </ConnCard>

        {/* Bitunix */}
        <ConnCard title="Bitunix (Crypto)" icon="🟧" color="var(--orange)" status={true} statusLabel="Connected">
          <Field label="API Key">
            <input style={inp({fontFamily:'var(--mono)',fontSize:12})} type="password" value={vals.bitunixApiKey} onChange={e=>set('bitunixApiKey',e.target.value)} placeholder="Bitunix API key"/>
          </Field>
          <Field label="API Secret">
            <input style={inp({fontFamily:'var(--mono)',fontSize:12})} type="password" value={vals.bitunixApiSecret} onChange={e=>set('bitunixApiSecret',e.target.value)} placeholder="Bitunix API secret"/>
          </Field>
          <Toggle2 val={vals.bitunixPaperMode} onChange={v=>set('bitunixPaperMode',v)} label="Bitunix Paper Mode" sub="Simulates orders, no real execution"/>
          <div style={{ display:'flex', gap:8, marginTop:12 }}>
            <button style={{ flex:1, padding:'9px', borderRadius:8, border:'1px solid rgba(249,115,22,0.3)', background:'rgba(249,115,22,0.07)', color:'var(--orange)', fontSize:12, fontWeight:500, cursor:'pointer' }}>↻ Test Bitunix API</button>
            <button style={{ flex:1, padding:'9px', borderRadius:8, border:'1px solid rgba(239,68,68,0.3)', background:'rgba(239,68,68,0.07)', color:'var(--red)', fontSize:12, fontWeight:600, cursor:'pointer' }}>🟧 Close All Positions</button>
          </div>
        </ConnCard>

        <div style={{ fontSize:11, color:'var(--t3)', padding:'8px 12px', background:'var(--s3)', borderRadius:8, lineHeight:1.6 }}>
          ℹ️ Credentials are stored in your browser only and never included in exports or cloud sync.
        </div>
      </div>
    ),
    execution: (
      <div>
        <H2>Execution Pipeline</H2>
        <Field label="Auto-Execution Mode">
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {[['manual','Manual approval only (recommended)'],['auto-score',`Auto-approve if score ≥ ${vals.minScore}/8`],['auto-all','Auto-approve all (not recommended)']].map(([v,l])=>(
              <label key={v} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderRadius:8,
                border:`1px solid ${vals.autoExec===v?'var(--blue)':'var(--border)'}`,
                background: vals.autoExec===v?'rgba(59,130,246,0.08)':'var(--s3)', cursor:'pointer' }}>
                <input type="radio" checked={vals.autoExec===v} onChange={()=>set('autoExec',v)} style={{ accentColor:'var(--blue)' }}/>
                <span style={{ fontSize:13, color: vals.autoExec===v?'var(--t1)':'var(--t2)' }}>{l}</span>
              </label>
            ))}
          </div>
        </Field>
        <Field label={`Min System Alignment Score — ${vals.minScore}/8`}>
          <input type="range" min={1} max={8} value={vals.minScore} onChange={e=>set('minScore',+e.target.value)} style={{ width:'100%', accentColor:'var(--blue)' }}/>
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'var(--t3)', marginTop:2 }}>
            <span style={{ color:'var(--red)' }}>0–2 Don't trade</span>
            <span style={{ color:'var(--amber)' }}>3–5 Review</span>
            <span style={{ color:'var(--green)' }}>6–8 Proceed</span>
          </div>
        </Field>
        <Toggle2 val={vals.requireChecklist} onChange={v=>set('requireChecklist',v)} label="Require pre-trade checklist" sub="Block approval if checklist is incomplete"/>
      </div>
    ),
    display: (
      <div>
        <H2>Display</H2>
        <Toggle2 val={vals.sessionMonitor} onChange={v=>set('sessionMonitor',v)} label="Show session clock bar"/>
        <Toggle2 val={vals.equityCurve} onChange={v=>set('equityCurve',v)} label="Show equity curve on dashboard"/>
        <Toggle2 val={vals.publicProfile} onChange={v=>set('publicProfile',v)} label="Public profile (share stats)"/>
      </div>
    ),
    sync: (
      <div>
        <H2>Cloud Sync</H2>
        <p style={{ fontSize:13, color:'var(--t3)', marginBottom:20, lineHeight:1.6 }}>Sync trades to a private GitHub Gist. Only write operations need the token.</p>
        <Field label="GitHub Personal Access Token">
          <input style={inp({fontFamily:'var(--mono)',fontSize:12})} type="password" value={vals.githubToken} onChange={e=>set('githubToken',e.target.value)} placeholder="ghp_..."/>
        </Field>
        <Field label="Gist ID">
          <input style={inp({fontFamily:'var(--mono)',fontSize:12})} value={vals.gistId} onChange={e=>set('gistId',e.target.value)} placeholder="Auto-set after first sync"/>
        </Field>
        <div style={{ display:'flex', gap:10 }}>
          <button style={{ flex:1, padding:'10px', borderRadius:8, border:'none', background:'var(--blue)', color:'#fff', fontWeight:600, fontSize:13, cursor:'pointer' }}>Connect & Push</button>
          <button style={{ flex:1, padding:'10px', borderRadius:8, border:'1px solid var(--border)', background:'var(--s3)', color:'var(--t2)', fontSize:13, cursor:'pointer' }}>Pull from Cloud</button>
        </div>
      </div>
    ),
    export: (
      <div>
        <H2>Export</H2>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {[['Export all trades as CSV','var(--blue)'],['Export all trades as JSON backup','var(--blue)'],['Export for Claude AI analysis','var(--purple)']].map(([l,c])=>(
            <button key={l} style={{ padding:'13px 16px', borderRadius:9, border:`1px solid ${c}30`, background:`${c}10`, color:c, fontSize:13, fontWeight:500, cursor:'pointer', textAlign:'left' }}>{l}</button>
          ))}
        </div>
      </div>
    ),
    danger: (
      <div>
        <H2>Danger Zone</H2>
        <p style={{ fontSize:13, color:'var(--t3)', marginBottom:20, lineHeight:1.6 }}>These actions are irreversible. Make sure you have a backup before proceeding.</p>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {[['Reset all settings to defaults','var(--amber)'],['Clear all trades','var(--red)'],['Wipe all data and start fresh','var(--red)']].map(([l,c])=>(
            <button key={l} style={{ padding:'13px 16px', borderRadius:9, border:`1px solid ${c}40`, background:`${c}08`, color:c, fontSize:13, fontWeight:600, cursor:'pointer', textAlign:'left' }}>{l}</button>
          ))}
        </div>
      </div>
    ),
  };

  return (
    <div style={{ display:'grid', gridTemplateColumns:'200px 1fr', gap:20, paddingBottom:40, minHeight:500 }}>
      <div style={{ background:'var(--s2)', border:'1px solid var(--border)', borderRadius:12, padding:8, alignSelf:'start', position:'sticky', top:0 }}>
        {SECTIONS.map(s => (
          <button key={s.id} onClick={() => setSection(s.id)} style={{
            display:'flex', alignItems:'center', gap:10, width:'100%', padding:'10px 12px',
            borderRadius:8, border:'none', cursor:'pointer', textAlign:'left', transition:'all 0.15s',
            background: section===s.id?'rgba(59,130,246,0.12)':'transparent',
            color: section===s.id?'var(--blue)':'var(--t3)', fontWeight: section===s.id?600:400, fontSize:13
          }}>
            <span style={{ fontSize:15 }}>{s.icon}</span>{s.label}
          </button>
        ))}
      </div>
      <div style={{ background:'var(--s2)', border:'1px solid var(--border)', borderRadius:12, padding:28 }}>
        {content[section]}
        {section !== 'danger' && (
          <button onClick={save} style={{ marginTop:24, padding:'11px 28px', borderRadius:8, border:'none',
            background: saved?'var(--green)':'var(--blue)', color:'#fff', fontWeight:600, fontSize:14, cursor:'pointer', transition:'all 0.2s' }}>
            {saved ? '✓ Saved' : 'Save Settings'}
          </button>
        )}
      </div>
    </div>
  );
}

const H2 = ({ children }) => <div style={{ fontWeight:700, fontSize:17, color:'var(--t1)', marginBottom:20, paddingBottom:12, borderBottom:'1px solid var(--border)' }}>{children}</div>;
const H3 = ({ children }) => <div style={{ fontWeight:600, fontSize:12, color:'var(--t3)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:12, marginTop:4 }}>{children}</div>;

Object.assign(window, { Settings });
