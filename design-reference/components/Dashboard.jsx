// Dashboard.jsx v2 — EV hero, trading colors, POIWatcher setup names
const { useState, useEffect } = React;

function EVHero({ trades }) {
  const closed = trades.filter(t => t.status === 'Closed');
  const wins = closed.filter(t => t.outcome === 'Win');
  const losses = closed.filter(t => t.outcome === 'Loss');
  const wr = wins.length / closed.length;
  const avgWin = wins.length ? wins.reduce((a,t)=>a+t.pnl,0)/wins.length : 0;
  const avgLoss = losses.length ? Math.abs(losses.reduce((a,t)=>a+t.pnl,0)/losses.length) : 0;
  const ev = (wr * avgWin) - ((1-wr) * avgLoss);
  const totalPnl = closed.reduce((a,t)=>a+t.pnl,0);
  const avgRR = (closed.reduce((a,t)=>a+t.rr,0)/closed.length).toFixed(2);

  return (
    <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', gap:12, marginBottom:16 }}>
      {/* EV Hero */}
      <div style={{ background:'var(--s2)', border:'1px solid var(--border)', borderRadius:12, padding:'22px 24px',
        position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:0, right:0, width:120, height:120,
          background:'radial-gradient(circle at top right, rgba(34,197,94,0.08), transparent 70%)' }}/>
        <div style={{ fontSize:11, color:'var(--t3)', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:8 }}>Expected Value / Trade</div>
        <div style={{ fontFamily:'var(--mono)', fontSize:38, fontWeight:700, color: ev>=0?'var(--green)':'var(--red)', lineHeight:1 }}>
          {ev>=0?'+':''}{ev.toFixed(2)}
        </div>
        <div style={{ fontSize:12, color:'var(--t3)', marginTop:8 }}>
          ({(wr*100).toFixed(0)}% WR × ${avgWin.toFixed(0)} avg) − ({((1-wr)*100).toFixed(0)}% × ${avgLoss.toFixed(0)})
        </div>
        <div style={{ display:'flex', gap:16, marginTop:14 }}>
          <span style={{ fontSize:12, color:'var(--green)' }}>▲ {wins.length} wins</span>
          <span style={{ fontSize:12, color:'var(--red)' }}>▼ {losses.length} losses</span>
          <span style={{ fontSize:12, color:'var(--t3)' }}>{closed.length} closed</span>
        </div>
      </div>
      {/* Metric cards */}
      {[
        { l:'Net P&L', v:`$${totalPnl.toLocaleString()}`, c:'var(--green)', s:'This month', d:'+18%' },
        { l:'Avg R:R', v:`${avgRR}R`, c:'var(--t1)', s:'All setups', d:'+0.3R' },
        { l:'Win Rate', v:`${(wr*100).toFixed(0)}%`, c: wr>=0.6?'var(--green)':wr>=0.45?'var(--amber)':'var(--red)', s:`${wins.length}W · ${losses.length}L` },
      ].map(m => (
        <div key={m.l} style={{ background:'var(--s2)', border:'1px solid var(--border)', borderRadius:12, padding:'22px 20px' }}>
          <div style={{ fontSize:11, color:'var(--t3)', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:10 }}>{m.l}</div>
          <div style={{ fontFamily:'var(--mono)', fontSize:30, fontWeight:700, color:m.c, lineHeight:1 }}>{m.v}</div>
          {m.s && <div style={{ fontSize:12, color:'var(--t3)', marginTop:8 }}>{m.s}</div>}
          {m.d && <div style={{ fontSize:12, color:'var(--green)', marginTop:4 }}>▲ {m.d} vs last week</div>}
        </div>
      ))}
    </div>
  );
}

function EquityCurve({ data }) {
  const [hoverIdx, setHoverIdx] = useState(null);
  const W = 100, H = 60;
  const vals = data.map(d => d.pnl);
  const minV = Math.min(...vals), maxV = Math.max(...vals);
  const range = maxV - minV || 1;
  const pts = vals.map((v, i) => [
    (i / (vals.length - 1)) * W,
    H - ((v - minV) / range) * (H - 6) - 3
  ]);
  const pathD = pts.map((p,i) => `${i===0?'M':'L'}${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(' ');
  const areaD = pathD + ` L${W},${H} L0,${H} Z`;

  return (
    <div style={{ background:'var(--s2)', border:'1px solid var(--border)', borderRadius:12, padding:'20px 22px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
        <span style={{ fontWeight:600, fontSize:14, color:'var(--t1)' }}>Equity Curve</span>
        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          {hoverIdx !== null && (
            <span style={{ fontFamily:'var(--mono)', fontSize:13, color: data[hoverIdx].pnl>=0?'var(--green)':'var(--red)' }}>
              {data[hoverIdx].date} · {data[hoverIdx].pnl>=0?'+':''}${data[hoverIdx].pnl}
            </span>
          )}
          <span style={{ fontFamily:'var(--mono)', color:'var(--green)', fontWeight:700, fontSize:16 }}>+$1,290</span>
        </div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width:'100%', height:140, overflow:'visible', display:'block' }}
        onMouseLeave={() => setHoverIdx(null)}>
        <defs>
          <linearGradient id="eqG2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.18"/>
            <stop offset="100%" stopColor="#22c55e" stopOpacity="0"/>
          </linearGradient>
        </defs>
        {/* SC zone band (subtle grey) */}
        <rect x={0} y={H*0.35} width={W} height={H*0.12} fill="rgba(107,114,128,0.06)" rx="0.5"/>
        <path d={areaD} fill="url(#eqG2)"/>
        <path d={pathD} fill="none" stroke="#22c55e" strokeWidth="0.7" strokeLinejoin="round"/>
        {pts.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={hoverIdx===i?1.8:0.8}
            fill={hoverIdx===i?'#22c55e':'transparent'}
            style={{ cursor:'crosshair' }}
            onMouseEnter={() => setHoverIdx(i)}/>
        ))}
        {hoverIdx !== null && (
          <line x1={pts[hoverIdx][0]} y1={0} x2={pts[hoverIdx][0]} y2={H}
            stroke="rgba(107,114,128,0.4)" strokeWidth="0.4" strokeDasharray="2,2"/>
        )}
      </svg>
      <div style={{ display:'flex', justifyContent:'space-between', marginTop:6 }}>
        {data.filter((_,i)=>i%3===0).map((d,i)=>(
          <span key={i} style={{ fontSize:10, color:'var(--t3)', fontFamily:'var(--mono)' }}>{d.date.replace('Apr ','')}</span>
        ))}
      </div>
    </div>
  );
}

function SetupChart({ data }) {
  const max = Math.max(...data.map(d=>d.trades));
  return (
    <div style={{ background:'var(--s2)', border:'1px solid var(--border)', borderRadius:12, padding:'20px 22px' }}>
      <div style={{ fontWeight:600, fontSize:14, color:'var(--t1)', marginBottom:16 }}>Setup Performance</div>
      {data.map((d, i) => {
        const wr = Math.round((d.wins/d.trades)*100);
        const c = wr>=65?'var(--green)':wr>=45?'var(--amber)':'var(--red)';
        return (
          <div key={i} style={{ marginBottom:14 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
              <span style={{ fontSize:12, color:'var(--t2)' }}>{d.name}</span>
              <div style={{ display:'flex', gap:12, fontFamily:'var(--mono)', fontSize:12 }}>
                <span style={{ color:c }}>{wr}%</span>
                <span style={{ color:'var(--t3)' }}>{d.avgRR}R</span>
                <span style={{ color:'var(--t3)' }}>{d.trades}T</span>
              </div>
            </div>
            <div style={{ height:6, background:'var(--s3)', borderRadius:3, overflow:'hidden' }}>
              <div style={{ width:`${(d.trades/max)*100}%`, height:'100%', background:c, borderRadius:3, opacity:0.75 }}/>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SessionChart({ data }) {
  return (
    <div style={{ background:'var(--s2)', border:'1px solid var(--border)', borderRadius:12, padding:'20px 22px' }}>
      <div style={{ fontWeight:600, fontSize:14, color:'var(--t1)', marginBottom:16 }}>Session Win Rate</div>
      <div style={{ display:'flex', gap:20, alignItems:'flex-end', height:120 }}>
        {data.map((s,i) => {
          const wr = s.wins/s.total;
          const BAR = 90;
          return (
            <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
              <span style={{ fontFamily:'var(--mono)', fontSize:13, fontWeight:600, color: wr>=0.6?'var(--green)':wr>=0.4?'var(--amber)':'var(--red)' }}>
                {Math.round(wr*100)}%
              </span>
              <div style={{ width:'100%', height:BAR, display:'flex', flexDirection:'column', justifyContent:'flex-end', gap:1 }}>
                <div style={{ width:'100%', height:`${wr*BAR}px`, background:'var(--green)', borderRadius:'4px 4px 0 0', opacity:0.8 }}/>
                <div style={{ width:'100%', height:`${(1-wr)*BAR}px`, background:'var(--red)', borderRadius:'0 0 4px 4px', opacity:0.5 }}/>
              </div>
              <span style={{ fontSize:12, color:'var(--t3)' }}>{s.name}</span>
              <span style={{ fontSize:11, color:'var(--t3)', fontFamily:'var(--mono)' }}>{s.wins}W·{s.losses}L</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DrawdownMeter({ pct=12 }) {
  const c = pct<10?'var(--green)':pct<18?'var(--amber)':'var(--red)';
  const dashArr = 2*Math.PI*36;
  const dashOff = dashArr * (1 - pct/25);
  return (
    <div style={{ background:'var(--s2)', border:'1px solid var(--border)', borderRadius:12, padding:'20px 22px', display:'flex', flexDirection:'column', alignItems:'center' }}>
      <div style={{ fontWeight:600, fontSize:14, color:'var(--t1)', marginBottom:16, alignSelf:'flex-start' }}>Max Drawdown</div>
      <svg width={100} height={100} viewBox="0 0 100 100">
        <circle cx={50} cy={50} r={36} fill="none" stroke="var(--s3)" strokeWidth={8}/>
        <circle cx={50} cy={50} r={36} fill="none" stroke={c} strokeWidth={8}
          strokeDasharray={dashArr} strokeDashoffset={dashOff}
          strokeLinecap="round" transform="rotate(-90 50 50)" style={{ transition:'stroke-dashoffset 0.8s ease' }}/>
        <text x={50} y={46} textAnchor="middle" fill={c} fontSize={16} fontWeight="700" fontFamily="var(--mono)">{pct}%</text>
        <text x={50} y={62} textAnchor="middle" fill="var(--t3)" fontSize={9}>of 25% limit</text>
      </svg>
      <div style={{ fontSize:12, color:'var(--t3)', marginTop:8, textAlign:'center' }}>Monthly DD limit: 20% · Weekly: 10%</div>
    </div>
  );
}

function OpenPositions({ trades }) {
  const open = trades.filter(t=>t.status==='Open');
  return (
    <div style={{ background:'var(--s2)', border:'1px solid var(--border)', borderRadius:12, padding:'20px 22px' }}>
      <div style={{ fontWeight:600, fontSize:14, color:'var(--t1)', marginBottom:14 }}>Open Positions
        <span style={{ marginLeft:8, fontSize:11, background:'rgba(245,158,11,0.12)', color:'var(--amber)', padding:'2px 8px', borderRadius:10 }}>{open.length}</span>
      </div>
      {open.length===0 ? <div style={{ fontSize:13, color:'var(--t3)' }}>No open trades</div> :
        open.map(t=>(
          <div key={t.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 12px',
            background:'var(--s3)', borderRadius:8, marginBottom:6 }}>
            <div>
              <span style={{ fontFamily:'var(--mono)', fontWeight:700, fontSize:14, color:'var(--t1)' }}>{t.pair}</span>
              <span style={{ marginLeft:8, fontSize:11, color: t.dir==='Long'?'var(--green)':'var(--red)' }}>{t.dir}</span>
            </div>
            <div style={{ textAlign:'right' }}>
              <div style={{ fontFamily:'var(--mono)', fontSize:12, color:'var(--t3)' }}>{t.rr}R target</div>
              <div style={{ fontSize:11, color:'var(--amber)' }}>OPEN</div>
            </div>
          </div>
        ))
      }
    </div>
  );
}

function RecentTrades({ trades }) {
  return (
    <div style={{ background:'var(--s2)', border:'1px solid var(--border)', borderRadius:12, padding:'20px 22px' }}>
      <div style={{ fontWeight:600, fontSize:14, color:'var(--t1)', marginBottom:14 }}>Recent Trades</div>
      <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
        {[...trades].reverse().slice(0,6).map(t=>(
          <div key={t.id} style={{ display:'grid', gridTemplateColumns:'1fr auto auto auto auto', gap:'6px 14px',
            alignItems:'center', padding:'10px 12px', borderRadius:8, background:'var(--s3)' }}>
            <div>
              <span style={{ fontFamily:'var(--mono)', fontWeight:700, fontSize:14, color:'var(--t1)', marginRight:8 }}>{t.pair}</span>
              <span style={{ fontSize:11, padding:'2px 7px', borderRadius:4, fontWeight:600,
                background:t.dir==='Long'?'rgba(34,197,94,0.1)':'rgba(239,68,68,0.1)',
                color:t.dir==='Long'?'var(--green)':'var(--red)' }}>{t.dir}</span>
            </div>
            <span style={{ fontSize:11, color:'var(--t3)' }}>{t.session}</span>
            <span style={{ fontSize:12, fontFamily:'var(--mono)', color:'var(--t2)' }}>{t.rr}R</span>
            <span style={{ fontSize:11, color:'var(--t3)', fontFamily:'var(--mono)' }}>{t.date.slice(5)}</span>
            <span style={{ fontFamily:'var(--mono)', fontWeight:700, fontSize:14,
              color:t.status==='Open'?'var(--amber)':t.outcome==='Win'?'var(--green)':'var(--red)' }}>
              {t.status==='Open'?'OPEN':t.outcome==='Win'?`+$${t.pnl}`:`-$${Math.abs(t.pnl)}`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Dashboard() {
  const trades = window.SAMPLE_TRADES;
  return (
    <div style={{ paddingBottom:40 }}>
      <EVHero trades={trades}/>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>
        <EquityCurve data={window.EQUITY_DATA}/>
        <DrawdownMeter pct={12}/>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>
        <SetupChart data={window.SETUP_STATS}/>
        <SessionChart data={window.SESSION_STATS}/>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 2fr', gap:12 }}>
        <OpenPositions trades={trades}/>
        <RecentTrades trades={trades}/>
      </div>
    </div>
  );
}

Object.assign(window, { Dashboard });
