// Journal.jsx v3 — venue badges, signed RR, needs-review banner
function Journal() {
  const [trades, setTrades] = React.useState(window.SAMPLE_TRADES);
  const [search, setSearch] = React.useState('');
  const [outcome, setOutcome] = React.useState('All');
  const [venueFilter, setVenueFilter] = React.useState('All');
  const [sort, setSort] = React.useState('date');
  const [expanded, setExpanded] = React.useState(null);

  const OUTCOMES = ['All','Win','Loss','Open'];
  const VENUES   = ['All','mt5','bitunix'];

  const needsReview = trades.filter(t => t.needsReview || (t.autoLogged && !t.htfBias));

  const filtered = trades.filter(t => {
    const q = search.toLowerCase();
    const ms = !q || (t.pair||'').toLowerCase().includes(q) || (t.setup||'').toLowerCase().includes(q) || (t.session||'').toLowerCase().includes(q);
    const mo = outcome==='All'||(outcome==='Open'?t.status==='Open':t.outcome===outcome);
    const mv = venueFilter==='All'||t.venue===venueFilter;
    return ms && mo && mv;
  }).sort((a,b) => {
    if(sort==='date') return new Date(b.date)-new Date(a.date);
    if(sort==='pnl') return b.pnl-a.pnl;
    if(sort==='rr') return b.rr-a.rr;
    if(sort==='conf') return b.conf-a.conf;
    return 0;
  });

  const closed = trades.filter(t=>t.status==='Closed');
  const wins = closed.filter(t=>t.outcome==='Win');
  const totalPnl = closed.reduce((a,t)=>a+t.pnl,0);

  const Pill = ({ val, active, onClick, color }) => (
    <button onClick={onClick} style={{
      padding:'5px 12px', borderRadius:20, border:`1px solid ${active?(color||'var(--blue)'):'var(--border)'}`,
      background:active?`${color||'var(--blue)'}18`:'transparent',
      color:active?(color||'var(--blue)'):'var(--t3)', fontSize:12, fontWeight:active?600:400,
      cursor:'pointer', transition:'all 0.15s', whiteSpace:'nowrap'
    }}>{val}</button>
  );

  const VenueBadge = ({ venue }) => {
    const isB = venue === 'bitunix';
    return (
      <span style={{ fontSize:10, padding:'2px 7px', borderRadius:4, fontWeight:700,
        background: isB?'rgba(249,115,22,0.15)':'rgba(59,130,246,0.15)',
        color: isB?'var(--orange)':'var(--blue)',
        border:`1px solid ${isB?'rgba(249,115,22,0.25)':'rgba(59,130,246,0.25)'}` }}>
        {isB ? 'BITUNIX' : 'MT5'}
      </span>
    );
  };

  return (
    <div style={{ paddingBottom:40 }}>
      {/* Needs Review Banner */}
      {needsReview.length > 0 && (
        <div style={{ background:'rgba(245,158,11,0.06)', border:'1px solid rgba(245,158,11,0.25)',
          borderRadius:10, padding:'12px 16px', marginBottom:14, display:'flex', alignItems:'center', gap:12 }}>
          <span style={{ fontSize:20 }}>⚠️</span>
          <div>
            <div style={{ fontWeight:600, color:'var(--amber)', fontSize:13 }}>
              {needsReview.length} auto-logged trade{needsReview.length>1?'s':''} need{needsReview.length===1?'s':''} review
            </div>
            <div style={{ fontSize:12, color:'var(--t3)', marginTop:2 }}>
              {needsReview.map(t=>t.pair).join(', ')} — click to add HTF bias, setup type and rationale
            </div>
          </div>
          <button onClick={()=>setOutcome('All')} style={{ marginLeft:'auto', padding:'6px 14px', borderRadius:8,
            border:'1px solid rgba(245,158,11,0.3)', background:'rgba(245,158,11,0.1)',
            color:'var(--amber)', fontSize:12, fontWeight:600, cursor:'pointer', flexShrink:0 }}>
            Review All
          </button>
        </div>
      )}

      {/* Summary strip */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10, marginBottom:14 }}>
        {[
          ['Total', trades.length, 'var(--t1)'],
          [`${wins.length}W / ${closed.length-wins.length}L`, `${Math.round((wins.length/Math.max(closed.length,1))*100)}% WR`, 'var(--green)'],
          ['Net P&L', `${totalPnl>=0?'+':''}$${totalPnl}`, totalPnl>=0?'var(--green)':'var(--red)'],
          ['Open', trades.filter(t=>t.status==='Open').length, 'var(--amber)'],
        ].map(([l,v,c],i)=>(
          <div key={i} style={{ background:'var(--s2)', border:'1px solid var(--border)', borderRadius:10, padding:'12px 16px' }}>
            <div style={{ fontSize:11, color:'var(--t3)', marginBottom:4 }}>{l}</div>
            <div style={{ fontFamily:'var(--mono)', fontWeight:700, fontSize:16, color:c }}>{v}</div>
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div style={{ background:'var(--s2)', border:'1px solid var(--border)', borderRadius:10, padding:'12px 14px', marginBottom:12 }}>
        <input placeholder="Search pair, setup, session…" value={search} onChange={e=>setSearch(e.target.value)}
          style={{ background:'var(--s3)', border:'1px solid var(--border)', borderRadius:8, padding:'9px 13px',
            color:'var(--t1)', fontSize:13, outline:'none', width:'100%', boxSizing:'border-box', marginBottom:10 }}/>
        <div style={{ display:'flex', gap:6, flexWrap:'wrap', alignItems:'center' }}>
          {OUTCOMES.map(o=>(
            <Pill key={o} val={o} active={outcome===o} onClick={()=>setOutcome(o)}
              color={o==='Win'?'var(--green)':o==='Loss'?'var(--red)':o==='Open'?'var(--amber)':'var(--blue)'}/>
          ))}
          <div style={{ width:1, height:16, background:'var(--border)', margin:'0 2px' }}/>
          <Pill val="All" active={venueFilter==='All'} onClick={()=>setVenueFilter('All')}/>
          <Pill val="MT5" active={venueFilter==='mt5'} onClick={()=>setVenueFilter('mt5')} color="var(--blue)"/>
          <Pill val="Bitunix" active={venueFilter==='bitunix'} onClick={()=>setVenueFilter('bitunix')} color="var(--orange)"/>
          <div style={{ marginLeft:'auto' }}>
            <select value={sort} onChange={e=>setSort(e.target.value)}
              style={{ background:'var(--s3)', border:'1px solid var(--border)', borderRadius:8, padding:'6px 10px',
                color:'var(--t2)', fontSize:12, cursor:'pointer', outline:'none' }}>
              <option value="date">↓ Date</option>
              <option value="pnl">↓ P&L</option>
              <option value="rr">↓ R:R</option>
              <option value="conf">↓ Confidence</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table header */}
      <div style={{ display:'grid', gridTemplateColumns:'10px 56px 110px 60px 80px 64px 64px 70px 1fr',
        gap:'0 10px', padding:'6px 14px', marginBottom:4 }}>
        {['','','Pair','Dir','Setup','R:R','P&L','Session','Date'].map((h,i)=>(
          <span key={i} style={{ fontSize:10, color:'var(--t3)', textTransform:'uppercase', letterSpacing:'0.06em' }}>{h}</span>
        ))}
      </div>

      {/* Rows */}
      {filtered.length===0 && (
        <div style={{ background:'var(--s2)', border:'1px solid var(--border)', borderRadius:10, padding:32, textAlign:'center', color:'var(--t3)', fontSize:13 }}>
          No trades match your filters
        </div>
      )}
      {filtered.map(t => {
        const isOpen = t.status==='Open';
        const isWin  = t.outcome==='Win';
        const accent = isOpen?'var(--amber)':isWin?'var(--green)':'var(--red)';
        const open   = expanded===t.id;
        const signedRR = window.fmtRR ? window.fmtRR(t.rr, t.outcome) : `${t.rr}R`;
        const rrColor  = isOpen?'var(--t2)':isWin?'var(--green)':'var(--red)';

        return (
          <div key={t.id} style={{ background:'var(--s2)', border:'1px solid var(--border)', borderRadius:9,
            borderLeft:`3px solid ${accent}`, marginBottom:4, overflow:'hidden' }}>
            {/* Needs review tag */}
            {(t.needsReview||(t.autoLogged&&!t.htfBias)) && (
              <div style={{ background:'rgba(245,158,11,0.07)', borderBottom:'1px solid rgba(245,158,11,0.15)',
                padding:'4px 14px', fontSize:11, color:'var(--amber)' }}>
                ⚠ Needs review — add HTF bias and rationale
              </div>
            )}
            <div onClick={()=>setExpanded(open?null:t.id)}
              style={{ display:'grid', gridTemplateColumns:'10px 56px 110px 60px 80px 64px 64px 70px 1fr',
                gap:'0 10px', alignItems:'center', padding:'11px 14px', cursor:'pointer' }}>
              <span style={{ width:6, height:6, borderRadius:'50%', background:accent, display:'inline-block' }}/>
              <VenueBadge venue={t.venue}/>
              <span style={{ fontFamily:'var(--mono)', fontWeight:700, fontSize:13, color:'var(--t1)' }}>{t.pair}</span>
              <span style={{ fontSize:11, fontWeight:600, color:t.dir==='Long'?'var(--green)':'var(--red)' }}>{t.dir==='Long'?'▲ L':'▼ S'}</span>
              <span style={{ fontSize:11, color:'var(--t3)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }} title={t.setup}>
                {t.setup.split('+')[0].trim().split(' ').slice(0,2).join(' ')}
              </span>
              <span style={{ fontFamily:'var(--mono)', fontSize:12, fontWeight:600, color:rrColor }}>{signedRR}</span>
              <span style={{ fontFamily:'var(--mono)', fontSize:13, fontWeight:700,
                color:isOpen?'var(--amber)':isWin?'var(--green)':'var(--red)' }}>
                {isOpen?'—':isWin?`+$${t.pnl}`:`-$${Math.abs(t.pnl)}`}
              </span>
              <span style={{ fontSize:11, color:'var(--t3)' }}>{t.session}</span>
              {/* Confidence pips */}
              <div style={{ display:'flex', gap:2 }}>
                {Array.from({length:10}).map((_,i)=>(
                  <div key={i} style={{ width:4, height:12, borderRadius:2,
                    background:i<t.conf?(t.conf>=8?'var(--green)':t.conf>=6?'var(--amber)':'var(--red)'):'var(--s3)' }}/>
                ))}
              </div>
            </div>
            {/* Expanded */}
            {open && (
              <div style={{ padding:'0 14px 14px', borderTop:'1px solid var(--border)' }}>
                <div style={{ paddingTop:14, display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(120px,1fr))', gap:10, marginBottom:12 }}>
                  {[['HTF Bias',t.htfBias||'—'],['Setup',t.setup],['Session',t.session||'—'],
                    ['Confidence',`${t.conf}/10`],['Entry',t.entry],['SL',t.sl],['TP',t.tp],['Venue',t.venue==='bitunix'?'Bitunix':'MT5']
                  ].map(([k,v])=>(
                    <div key={k} style={{ background:'var(--s3)', borderRadius:8, padding:'8px 12px' }}>
                      <div style={{ fontSize:10, color:'var(--t3)', marginBottom:3, textTransform:'uppercase', letterSpacing:'0.06em' }}>{k}</div>
                      <div style={{ fontSize:12, fontFamily:'var(--mono)', fontWeight:500,
                        color:v==='Bullish'?'var(--green)':v==='Bearish'?'var(--red)':'var(--t1)' }}>{v}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display:'flex', gap:8 }}>
                  <button style={{ padding:'7px 14px', borderRadius:7, border:'1px solid var(--border)', background:'var(--s3)', color:'var(--t2)', fontSize:12, cursor:'pointer' }}>Edit</button>
                  <button style={{ padding:'7px 14px', borderRadius:7, border:'1px solid var(--border)', background:'var(--s3)', color:'var(--t2)', fontSize:12, cursor:'pointer' }}>Add Notes</button>
                  <button onClick={()=>setTrades(ts=>ts.filter(x=>x.id!==t.id))}
                    style={{ padding:'7px 14px', borderRadius:7, border:'1px solid rgba(239,68,68,0.3)', background:'rgba(239,68,68,0.08)', color:'var(--red)', fontSize:12, cursor:'pointer' }}>Delete</button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

Object.assign(window, { Journal });
