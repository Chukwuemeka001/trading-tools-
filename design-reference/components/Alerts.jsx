// Alerts.jsx — Price alerts + improvements panel
function Alerts() {
  const [alerts, setAlerts] = React.useState([
    { id:1, symbol:'GBP/USD', price:1.2650, label:'SC Zone', dir:'below', active:true,  dist:-0.0012 },
    { id:2, symbol:'BTC/USDT',price:64000, label:'$$ Secondary liquidity', dir:'below', active:true,  dist:300 },
    { id:3, symbol:'EUR/USD', price:1.0820, label:'BOS level', dir:'above', active:false, dist:null },
  ]);
  const [form, setForm] = React.useState({ symbol:'', price:'', label:'SC Zone', dir:'below', custom:'' });
  const [sound, setSound] = React.useState(true);
  const [tg, setTg] = React.useState(false);
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  const addAlert = () => {
    if (!form.symbol || !form.price) return;
    setAlerts(a => [...a, { id: Date.now(), symbol: form.symbol.toUpperCase(),
      price: parseFloat(form.price), label: form.custom || form.label,
      dir: form.dir, active: true, dist: null }]);
    setForm(f => ({...f, symbol:'', price:'', custom:''}));
  };

  const inp = (extra={}) => ({
    background:'var(--s3)', border:'1px solid var(--border)', borderRadius:8,
    padding:'10px 12px', color:'var(--t1)', fontSize:13, outline:'none',
    boxSizing:'border-box', fontFamily:'inherit', width:'100%', ...extra
  });
  const lbl = { fontSize:11, color:'var(--t3)', marginBottom:5, display:'block', textTransform:'uppercase', letterSpacing:'0.06em' };

  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:16, paddingBottom:40 }}>
      {/* Active alerts */}
      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span style={{ fontWeight:600, fontSize:14, color:'var(--t1)' }}>Active Alerts</span>
          <div style={{ display:'flex', gap:10, alignItems:'center' }}>
            <label style={{ display:'flex', alignItems:'center', gap:6, cursor:'pointer', fontSize:12, color:'var(--t3)' }}>
              <Toggle val={sound} onChange={setSound}/> Sound
            </label>
            <label style={{ display:'flex', alignItems:'center', gap:6, cursor:'pointer', fontSize:12, color:'var(--t3)' }}>
              <Toggle val={tg} onChange={setTg}/> Telegram
            </label>
          </div>
        </div>

        {alerts.length === 0 && (
          <div style={{ background:'var(--s2)', border:'1px solid var(--border)', borderRadius:10, padding:32, textAlign:'center', color:'var(--t3)', fontSize:13 }}>
            No alerts set. Add one below.
          </div>
        )}

        {alerts.map(a => (
          <div key={a.id} style={{ background:'var(--s2)', border:'1px solid var(--border)', borderRadius:10,
            borderLeft:`3px solid ${a.active?'var(--blue)':'var(--border)'}`, overflow:'hidden' }}>
            <div style={{ padding:'13px 16px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
                <div>
                  <span style={{ fontFamily:'var(--mono)', fontWeight:700, fontSize:15, color:'var(--t1)' }}>{a.symbol}</span>
                  <span style={{ marginLeft:8, fontSize:11, color:'var(--t3)', background:'var(--s3)', padding:'2px 8px', borderRadius:4 }}>{a.label}</span>
                </div>
                <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                  <Toggle val={a.active} onChange={v => setAlerts(as => as.map(x => x.id===a.id?{...x,active:v}:x))}/>
                  <button onClick={() => setAlerts(as => as.filter(x => x.id !== a.id))}
                    style={{ background:'none', border:'none', color:'var(--t3)', cursor:'pointer', fontSize:16, lineHeight:1 }}>×</button>
                </div>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div>
                  <div style={{ fontSize:10, color:'var(--t3)', marginBottom:2 }}>
                    {a.dir === 'below' ? 'Price crosses below' : 'Price crosses above'}
                  </div>
                  <div style={{ fontFamily:'var(--mono)', fontSize:18, fontWeight:700, color:'var(--t1)' }}>
                    {a.price.toLocaleString()}
                  </div>
                </div>
                {a.dist !== null && (
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontSize:10, color:'var(--t3)', marginBottom:2 }}>Distance</div>
                    <div style={{ fontFamily:'var(--mono)', fontSize:14, fontWeight:600,
                      color: Math.abs(a.dist) < 0.002 ? 'var(--amber)' : 'var(--t2)' }}>
                      {a.dist > 0 ? '+' : ''}{a.dist}
                    </div>
                  </div>
                )}
              </div>
              {/* distance bar */}
              {a.dist !== null && (
                <div style={{ marginTop:10 }}>
                  <div style={{ height:4, background:'var(--s3)', borderRadius:2, overflow:'hidden' }}>
                    <div style={{ height:'100%', width:`${Math.min(100, 100 - Math.abs(a.dist)*5000)}%`,
                      background: Math.abs(a.dist)<0.001?'var(--amber)':'var(--blue)', borderRadius:2, transition:'width 0.4s' }}/>
                  </div>
                  <div style={{ fontSize:10, color:'var(--t3)', marginTop:3 }}>Price proximity</div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add alert form */}
      <div>
        <div style={{ background:'var(--s2)', border:'1px solid var(--border)', borderRadius:12, padding:20, marginBottom:16 }}>
          <div style={{ fontWeight:600, fontSize:14, color:'var(--t1)', marginBottom:16 }}>Add Price Alert</div>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <div><label style={lbl}>Symbol</label>
                <input style={inp()} value={form.symbol} onChange={e=>set('symbol',e.target.value)} placeholder="GBP/USD"/>
              </div>
              <div><label style={lbl}>Price Level</label>
                <input style={inp({fontFamily:'var(--mono)'})} type="number" step="0.00001" value={form.price} onChange={e=>set('price',e.target.value)} placeholder="1.2650"/>
              </div>
            </div>
            <div><label style={lbl}>Zone Type</label>
              <select style={inp({cursor:'pointer'})} value={form.label} onChange={e=>set('label',e.target.value)}>
                {['SC Zone','$$ Secondary liquidity','$$ Primary liquidity','mbms area','BOS level','MBOS level','Structural low','Structural high','Custom'].map(v=><option key={v}>{v}</option>)}
              </select>
            </div>
            {form.label === 'Custom' && (
              <div><label style={lbl}>Custom Label</label>
                <input style={inp()} value={form.custom} onChange={e=>set('custom',e.target.value)} placeholder="My custom zone"/>
              </div>
            )}
            <div><label style={lbl}>Direction</label>
              <div style={{ display:'flex', gap:8 }}>
                {[['below','Price crosses below (looking for buys)'],['above','Price crosses above (looking for sells)']].map(([v,l])=>(
                  <button key={v} onClick={()=>set('dir',v)} style={{
                    flex:1, padding:'8px 6px', borderRadius:8, border:`1px solid ${form.dir===v?'var(--blue)':'var(--border)'}`,
                    background: form.dir===v?'rgba(59,130,246,0.15)':'var(--s3)',
                    color: form.dir===v?'var(--blue)':'var(--t3)', fontSize:11, cursor:'pointer', textAlign:'left'
                  }}>{l}</button>
                ))}
              </div>
            </div>
            <button onClick={addAlert}
              style={{ padding:'11px', borderRadius:8, border:'none', background:'var(--blue)', color:'#fff', fontWeight:600, fontSize:13, cursor:'pointer' }}>
              + Add Alert
            </button>
          </div>
        </div>

        {/* Backend status */}
        <div style={{ background:'var(--s2)', border:'1px solid var(--border)', borderRadius:12, padding:20 }}>
          <div style={{ fontWeight:600, fontSize:14, color:'var(--t1)', marginBottom:14 }}>Backend Status</div>
          {[
            ['Render Backend', 'Offline', 'var(--red)'],
            ['MT5 EA', 'Not connected', 'var(--t3)'],
            ['Price Feed', 'Offline', 'var(--red)'],
            ['Telegram', tg ? 'Configured' : 'Not set', tg?'var(--green)':'var(--t3)'],
          ].map(([k,v,c])=>(
            <div key={k} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'9px 0', borderBottom:'1px solid var(--border)' }}>
              <span style={{ fontSize:13, color:'var(--t2)' }}>{k}</span>
              <span style={{ fontSize:12, fontFamily:'var(--mono)', color:c, display:'flex', alignItems:'center', gap:6 }}>
                <span style={{ width:6, height:6, borderRadius:'50%', background:c, display:'inline-block' }}/>
                {v}
              </span>
            </div>
          ))}
          <button style={{ width:'100%', marginTop:14, padding:'9px', borderRadius:8, border:'1px solid var(--border)',
            background:'var(--s3)', color:'var(--t2)', fontSize:13, cursor:'pointer' }}>
            ↻ Reconnect Backend
          </button>
        </div>
      </div>
    </div>
  );
}

function Toggle({ val, onChange }) {
  return (
    <div onClick={() => onChange(!val)} style={{
      width:34, height:18, borderRadius:9, background: val?'var(--blue)':'var(--s3)',
      border:`1px solid ${val?'var(--blue)':'var(--border)'}`, cursor:'pointer', position:'relative', transition:'all 0.2s', flexShrink:0
    }}>
      <div style={{ position:'absolute', top:2, left: val?16:2, width:12, height:12,
        borderRadius:'50%', background:'#fff', transition:'left 0.2s' }}/>
    </div>
  );
}

Object.assign(window, { Alerts, Toggle });
