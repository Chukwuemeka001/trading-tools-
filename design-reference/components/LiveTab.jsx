// LiveTab.jsx v2 — Dual venue: MT5 (blue) + Bitunix (orange)
function LiveTab() {
  const [activeLog, setActiveLog] = React.useState('all');

  const mt5Positions = [
    { ticket:1234568, symbol:'GBPUSD',  dir:'Long',  entry:1.2695, current:1.2718, sl:1.2660, tp:1.2780, lots:0.5,  pnl:115,  openTime:'2026-04-24 08:02', paper:true  },
  ];
  const bitunixPositions = [
    { ticket:9900001, symbol:'BTCUSDT', dir:'Short', entry:67800, current:68100,   sl:68400,  tp:65500,  size:0.03, pnl:-90,  openTime:'2026-04-23 09:15', paper:true  },
  ];
  const pendingOrders = [
    { id:'exec_001', symbol:'EURUSD',  venue:'mt5',     dir:'BUY',  entry:1.0720, sl:1.0685, tp:1.0810, lot:0.3,   status:'limit_placed', placedAt:'07:45' },
    { id:'exec_002', symbol:'ETHUSDT', venue:'bitunix', dir:'SELL', entry:3050,   sl:3110,   tp:2880,   lot:0.1,   status:'limit_placed', placedAt:'06:30' },
  ];
  const execLog = [
    { ts:'09:15:32', venue:'bitunix', event:'Limit FILLED — BTCUSDT Short @ 67800',          type:'success' },
    { ts:'07:45:11', venue:'mt5',     event:'BUY LIMIT placed — EURUSD @ 1.0720 | 24h expiry', type:'limit'   },
    { ts:'07:44:58', venue:'mt5',     event:'Trade approved — EURUSD Long | lot=0.3 | paper',  type:'approved'},
    { ts:'06:30:00', venue:'bitunix', event:'SELL LIMIT placed — ETHUSDT @ 3050 | 24h expiry', type:'limit'   },
    { ts:'06:00:00', venue:'mt5',     event:'Heartbeat OK — equity $10,115',                   type:'success' },
  ];

  const filteredLog = activeLog === 'all' ? execLog : execLog.filter(l => l.venue === activeLog);

  const venueColor = (v) => v === 'bitunix' ? 'var(--orange)' : 'var(--blue)';
  const venueLabel = (v) => v === 'bitunix' ? 'Bitunix' : 'MT5';
  const pnlColor = (v) => v > 0 ? 'var(--green)' : v < 0 ? 'var(--red)' : 'var(--t3)';

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16, paddingBottom:40 }}>

      {/* Status bar */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:10 }}>
        {[
          { label:'Backend',        val:'Offline',      color:'var(--red)' },
          { label:'MT5 EA',         val:'Disconnected', color:'var(--t3)' },
          { label:'Bitunix API',    val:'Connected',    color:'var(--green)' },
          { label:'Mode',           val:'Paper Trading',color:'var(--amber)' },
        ].map(s => (
          <div key={s.label} style={{ background:'var(--s2)', border:'1px solid var(--border)', borderRadius:10, padding:'12px 16px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span style={{ fontSize:12, color:'var(--t3)' }}>{s.label}</span>
            <span style={{ fontSize:12, fontWeight:600, color:s.color, display:'flex', alignItems:'center', gap:6 }}>
              <span style={{ width:6, height:6, borderRadius:'50%', background:s.color, display:'inline-block' }}/>
              {s.val}
            </span>
          </div>
        ))}
      </div>

      {/* Paper mode banner */}
      <div style={{ background:'rgba(245,158,11,0.07)', border:'1px solid rgba(245,158,11,0.25)', borderRadius:10, padding:'10px 16px', display:'flex', alignItems:'center', gap:10 }}>
        <span style={{ fontSize:16 }}>🧪</span>
        <div>
          <span style={{ fontWeight:600, color:'var(--amber)', fontSize:13 }}>Paper Trading Mode Active</span>
          <span style={{ fontSize:12, color:'var(--t3)', marginLeft:12 }}>All executions are simulated. Set <code style={{ color:'var(--t2)' }}>PAPER_TRADING_MODE=false</code> on Render to go live.</span>
        </div>
      </div>

      {/* ── MT5 Positions ── */}
      <VenueSection
        icon="📊" title="MT5 Positions" color="var(--blue)"
        count={mt5Positions.length}
        emptyMsg="No open MT5 positions. Connect POIWatcher EA."
        emergencyLabel="🛑 MT5 Emergency Stop">
        {mt5Positions.map(p => <PositionCard key={p.ticket} p={p} venue="mt5" pnlColor={pnlColor}/>)}
      </VenueSection>

      {/* ── Bitunix Positions ── */}
      <VenueSection
        icon="🟧" title="Bitunix Positions" color="var(--orange)"
        count={bitunixPositions.length}
        emptyMsg="No open Bitunix positions."
        emergencyLabel="🟧 Bitunix Close All">
        {bitunixPositions.map(p => <PositionCard key={p.ticket} p={p} venue="bitunix" pnlColor={pnlColor}/>)}
      </VenueSection>

      {/* ── Pending Limit Orders ── */}
      <div>
        <SectionHead title="Pending Limit Orders" count={pendingOrders.length} accent="var(--amber)"/>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:10 }}>
          {pendingOrders.map(o => (
            <div key={o.id} style={{ background:'var(--s2)', border:`1px solid ${venueColor(o.venue)}30`,
              borderLeft:`3px solid ${venueColor(o.venue)}`, borderRadius:10, padding:'14px 16px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <span style={{ fontFamily:'var(--mono)', fontWeight:700, fontSize:15, color:'var(--t1)' }}>{o.symbol}</span>
                  <VenuePill venue={o.venue}/>
                  <span style={{ fontSize:11, padding:'2px 8px', borderRadius:4, fontWeight:600,
                    background: o.dir==='BUY'?'rgba(34,197,94,0.1)':'rgba(239,68,68,0.1)',
                    color: o.dir==='BUY'?'var(--green)':'var(--red)' }}>{o.dir}</span>
                </div>
                <span style={{ fontSize:10, color:'var(--amber)' }}>LIMIT · {o.placedAt}</span>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8 }}>
                {[['Entry',o.entry],['SL',o.sl],['TP',o.tp],['Lot',o.lot]].map(([k,v])=>(
                  <div key={k} style={{ background:'var(--s3)', borderRadius:7, padding:'7px 10px' }}>
                    <div style={{ fontSize:10, color:'var(--t3)' }}>{k}</div>
                    <div style={{ fontFamily:'var(--mono)', fontSize:13, fontWeight:600, color:'var(--t1)' }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Execution Log ── */}
      <div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
          <SectionHead title="Execution Log" accent="var(--t3)"/>
          <div style={{ display:'flex', gap:4 }}>
            {['all','mt5','bitunix'].map(v => (
              <button key={v} onClick={()=>setActiveLog(v)} style={{
                padding:'4px 12px', borderRadius:20, border:`1px solid ${activeLog===v?venueColor(v):'var(--border)'}`,
                background: activeLog===v?`${venueColor(v)}15`:'transparent',
                color: activeLog===v?venueColor(v):'var(--t3)', fontSize:11, fontWeight:500, cursor:'pointer'
              }}>{v==='all'?'All':venueLabel(v)}</button>
            ))}
          </div>
        </div>
        <div style={{ background:'var(--s2)', border:'1px solid var(--border)', borderRadius:10, overflow:'hidden' }}>
          {filteredLog.map((l, i) => (
            <div key={i} style={{ display:'flex', gap:12, alignItems:'center', padding:'10px 16px',
              borderBottom: i<filteredLog.length-1?'1px solid var(--border)':'none' }}>
              <span style={{ fontFamily:'var(--mono)', fontSize:11, color:'var(--t3)', flexShrink:0 }}>{l.ts}</span>
              <VenuePill venue={l.venue}/>
              <span style={{ width:6, height:6, borderRadius:'50%', flexShrink:0,
                background: l.type==='success'?'var(--green)':l.type==='limit'?'var(--amber)':l.type==='approved'?'var(--blue)':'var(--t3)' }}/>
              <span style={{ fontSize:12, color:'var(--t2)' }}>{l.event}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Refresh */}
      <div style={{ display:'flex', gap:10 }}>
        <button style={{ flex:1, padding:'11px', borderRadius:8, border:'1px solid var(--border)', background:'var(--s2)', color:'var(--t2)', fontSize:13, cursor:'pointer' }}>↻ Refresh All</button>
        <button style={{ flex:1, padding:'11px', borderRadius:8, border:'1px solid rgba(245,158,11,0.3)', background:'rgba(245,158,11,0.08)', color:'var(--amber)', fontSize:13, cursor:'pointer', fontWeight:600 }}>🧪 Test Pipeline</button>
      </div>
    </div>
  );
}

function VenueSection({ icon, title, color, count, emptyMsg, emergencyLabel, children }) {
  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ width:3, height:16, background:color, borderRadius:2 }}/>
          <span style={{ fontWeight:700, fontSize:14, color:'var(--t1)' }}>{icon} {title}</span>
          <span style={{ fontSize:11, background:'var(--s3)', color:'var(--t3)', borderRadius:10, padding:'1px 8px' }}>{count}</span>
        </div>
        <button style={{ padding:'6px 14px', borderRadius:8, border:`1px solid rgba(239,68,68,0.3)`,
          background:'rgba(239,68,68,0.07)', color:'var(--red)', fontSize:12, fontWeight:600, cursor:'pointer' }}>
          {emergencyLabel}
        </button>
      </div>
      {count === 0
        ? <div style={{ background:'var(--s2)', border:'1px solid var(--border)', borderRadius:10, padding:'24px 20px', textAlign:'center', color:'var(--t3)', fontSize:13 }}>{emptyMsg}</div>
        : children}
    </div>
  );
}

function PositionCard({ p, venue, pnlColor }) {
  const color = venue === 'bitunix' ? 'var(--orange)' : 'var(--blue)';
  const accent = p.pnl > 0 ? 'var(--green)' : p.pnl < 0 ? 'var(--red)' : 'var(--t3)';
  const sym = p.symbol || p.pair;

  return (
    <div style={{ background:'var(--s2)', border:'1px solid var(--border)',
      borderLeft:`3px solid ${accent}`, borderRadius:10, padding:'16px', marginBottom:10 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ fontFamily:'var(--mono)', fontWeight:700, fontSize:16, color:'var(--t1)' }}>{sym}</span>
          <VenuePill venue={venue}/>
          <span style={{ fontSize:12, padding:'3px 10px', borderRadius:5, fontWeight:600,
            background: p.dir==='Long'?'rgba(34,197,94,0.12)':'rgba(239,68,68,0.12)',
            color: p.dir==='Long'?'var(--green)':'var(--red)' }}>{p.dir==='Long'?'▲':'▼'} {p.dir}</span>
          {p.paper && <span style={{ fontSize:10, padding:'2px 7px', borderRadius:4, background:'rgba(245,158,11,0.1)', color:'var(--amber)', fontWeight:600 }}>PAPER</span>}
        </div>
        <div style={{ textAlign:'right' }}>
          <div style={{ fontFamily:'var(--mono)', fontWeight:700, fontSize:18, color:pnlColor(p.pnl) }}>
            {p.pnl > 0 ? '+' : ''}${p.pnl}
          </div>
          <div style={{ fontSize:10, color:'var(--t3)' }}>Unrealized P&L</div>
        </div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:8 }}>
        {[['Entry', p.entry],['Current', p.current],['SL', p.sl],['TP', p.tp],['Size', p.lots||p.size]].map(([k,v])=>(
          <div key={k} style={{ background:'var(--s3)', borderRadius:7, padding:'8px 10px' }}>
            <div style={{ fontSize:10, color:'var(--t3)', marginBottom:3 }}>{k}</div>
            <div style={{ fontFamily:'var(--mono)', fontSize:13, fontWeight:600,
              color: k==='SL'?'var(--red)':k==='TP'?'var(--green)':'var(--t1)' }}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{ height:4, background:'var(--s3)', borderRadius:2, overflow:'hidden', marginTop:12 }}>
        <div style={{ height:'100%', width:`${Math.min(100,Math.abs((p.current-p.entry)/(p.tp-p.entry))*100)}%`,
          background: p.pnl>0?'var(--green)':'var(--red)', borderRadius:2 }}/>
      </div>
      <div style={{ fontSize:11, color:'var(--t3)', marginTop:8 }}>
        Ticket #{p.ticket} · {p.openTime}
      </div>
    </div>
  );
}

function VenuePill({ venue }) {
  const isB = venue === 'bitunix';
  return (
    <span style={{ fontSize:10, padding:'2px 8px', borderRadius:4, fontWeight:700, letterSpacing:'0.04em',
      background: isB?'rgba(249,115,22,0.15)':'rgba(59,130,246,0.15)',
      color: isB?'var(--orange)':'var(--blue)',
      border: `1px solid ${isB?'rgba(249,115,22,0.3)':'rgba(59,130,246,0.3)'}` }}>
      {isB ? 'BITUNIX' : 'MT5'}
    </span>
  );
}

function SectionHead({ title, count, accent }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
      {accent && <span style={{ width:3, height:16, background:accent, borderRadius:2 }}/>}
      <span style={{ fontWeight:600, fontSize:14, color:'var(--t1)' }}>{title}</span>
      {count !== undefined && <span style={{ fontSize:11, background:'var(--s3)', color:'var(--t3)', borderRadius:10, padding:'1px 8px' }}>{count}</span>}
    </div>
  );
}

function Empty({ msg }) {
  return (
    <div style={{ background:'var(--s2)', border:'1px solid var(--border)', borderRadius:10, padding:'28px 20px', textAlign:'center', color:'var(--t3)', fontSize:13, marginBottom:10 }}>
      {msg}
    </div>
  );
}

Object.assign(window, { LiveTab, VenuePill, SectionHead, Empty });
