import { useState, useEffect } from 'react';

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

const getDaysAgo = (timestamp) => {
  const today = new Date(); today.setHours(0,0,0,0);
  const past = new Date(timestamp); past.setHours(0,0,0,0);
  return Math.floor((today - past) / ONE_DAY_MS);
};

const formatDate = (daysAgo) => {
  const d = new Date(Date.now() - daysAgo * ONE_DAY_MS);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};



export default function App() {
  const [questions, setQuestions] = useState([]);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [ticker, setTicker] = useState(0);

  useEffect(() => {
    const t = setInterval(() => { setCurrentTime(Date.now()); setTicker(p => p+1); }, 60000);
    return () => clearInterval(t);
  }, []);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;
    setQuestions(prev => [{ id: crypto.randomUUID(), title: title.trim(), url: url.trim(), dateAdded: Date.now(), isReviewed: false }, ...prev]);
    setTitle(''); setUrl('');
  };

  const markDone = (id) => setQuestions(prev => prev.map(q => q.id === id ? {...q, isReviewed: true} : q));
  const del = (id) => { if (confirm('Remove this problem?')) setQuestions(prev => prev.filter(q => q.id !== id)); };

  const due = questions.filter(q => !q.isReviewed && getDaysAgo(q.dateAdded) >= 10);
  const active = questions.filter(q => !q.isReviewed && getDaysAgo(q.dateAdded) < 10);

  const todayStr = new Date(currentTime).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div style={styles.root}>
      <style>{CSS}</style>

      {/* NAV */}
      <header style={styles.nav}>
        <div style={styles.navLeft}>
          <div style={styles.logoMark}>
            <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
              <rect x="2"  y="2"  width="13" height="13" rx="2" fill="#4dff91"/>
              <rect x="19" y="2"  width="13" height="13" rx="2" fill="#ff4d4d" opacity="0.8"/>
              <rect x="2"  y="19" width="13" height="13" rx="2" fill="#ffe066" opacity="0.8"/>
              <rect x="19" y="19" width="13" height="13" rx="2" fill="white" opacity="0.15"/>
              <rect x="6"  y="6"  width="5"  height="5"  rx="1" fill="#0a0a0a" opacity="0.25"/>
              <rect x="23" y="6"  width="5"  height="5"  rx="1" fill="#0a0a0a" opacity="0.25"/>
              <rect x="6"  y="23" width="5"  height="5"  rx="1" fill="#0a0a0a" opacity="0.25"/>
            </svg>
          </div>
          <div>
            <div style={styles.appTitle}>DSA<span style={{color:'#4dff91'}}>.</span>TRACKER</div>
            <div style={styles.appSub}>10-DAY SPACED REPETITION</div>
          </div>
        </div>
        <div style={styles.navRight}>
          <div style={styles.datePill}>{todayStr}</div>
          <div style={styles.statPill}>
            <span style={{color:'#ff4d4d', fontWeight:700}}>{due.length}</span>
            <span style={{opacity:0.4, margin:'0 4px'}}>/</span>
            <span style={{opacity:0.6}}>{active.length + due.length}</span>
            <span style={{opacity:0.35, marginLeft:6, fontSize:10}}>PROBLEMS</span>
          </div>
        </div>
      </header>

      <main style={styles.main}>

        {/* FORM */}
        <form onSubmit={handleAdd} style={styles.formCard} className="form-card">
          <div style={styles.formLabel}>
            <span style={{color:'#4dff91', fontFamily:'monospace', marginRight:8}}>›</span>
            LOG NEW PROBLEM
          </div>
          <div style={styles.formRow}>
            <input
              className="dsa-input"
              style={{...styles.input, flex:1.2}}
              placeholder="Problem title — e.g. Two Sum"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
            <input
              className="dsa-input"
              style={{...styles.input, flex:1}}
              placeholder="LeetCode URL"
              type="url"
              value={url}
              onChange={e => setUrl(e.target.value)}
              required
            />
            <button type="submit" style={styles.addBtn} className="add-btn">
              <span style={{fontSize:18, lineHeight:1}}>+</span> ADD
            </button>
          </div>
        </form>

        {/* DUE */}
        <section style={{marginBottom:48}}>
          <div style={styles.sectionHeader}>
            <div style={styles.sectionTitle}>
              <span style={{...styles.dot, background:'#ff4d4d', boxShadow:'0 0 8px #ff4d4d'}} className="blink-dot"/>
              READY FOR REVISION
            </div>
            <div style={{...styles.countBadge, borderColor:'#ff4d4d33', color:'#ff4d4d'}}>
              {due.length} DUE
            </div>
          </div>

          {due.length === 0 ? (
            <div style={styles.emptyDue}>
              <div style={{fontSize:11, letterSpacing:2, opacity:0.35}}>NO PROBLEMS OVERDUE</div>
              <div style={{fontSize:11, opacity:0.2, marginTop:4}}>keep grinding — the queue will fill up</div>
            </div>
          ) : (
            <div style={{display:'flex', flexDirection:'column', gap:10}}>
              {due.map(q => {
                const days = getDaysAgo(q.dateAdded);
                return (
                  <div key={q.id} style={styles.dueCard} className="due-card">
                    <div style={{...styles.dueBar, background:'#ff4d4d'}}/>
                    <div style={{flex:1, minWidth:0}}>
                      <div style={styles.dueName}>{q.title}</div>
                      <div style={styles.dueMeta}>
                        <span style={{opacity:0.4}}>SOLVED</span>
                        <span style={{color:'#ff4d4d'}}>{formatDate(getDaysAgo(q.dateAdded))}</span>
                        <span style={{opacity:0.2}}>·</span>
                        <span style={{opacity:0.4}}>{days} DAYS AGO</span>
                        <span style={{opacity:0.2}}>·</span>
                        <a href={q.url} target="_blank" rel="noopener noreferrer" style={styles.solveLink}>
                          SOLVE AGAIN ↗
                        </a>
                      </div>
                    </div>
                    <button onClick={() => markDone(q.id)} style={styles.doneBtn} className="done-btn">
                      ✓ DONE
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* TIMELINE */}
        <section>
          <div style={styles.sectionHeader}>
            <div style={styles.sectionTitle}>
              <span style={{...styles.dot, background:'#4dff91', boxShadow:'0 0 8px #4dff91'}}/>
              ACTIVE PIPELINE
            </div>
            <div style={{...styles.countBadge, borderColor:'#4dff9133', color:'#4dff91'}}>
              {active.length} ACTIVE
            </div>
          </div>

          <div style={{position:'relative'}}>
            {/* vertical spine */}
            <div style={styles.spine}/>

            {Array.from({length:10}, (_,i) => i).map(daysAgo => {
              const qs = active.filter(q => getDaysAgo(q.dateAdded) === daysAgo);
              let label = formatDate(daysAgo);
              if (daysAgo === 0) label = 'TODAY';
              else if (daysAgo === 1) label = 'YESTERDAY';
              const daysLeft = 10 - daysAgo;

              const isAlt = daysAgo % 2 !== 0;
              return (
                <div key={daysAgo} style={{
                  ...styles.dayRow,
                  background: 'transparent',
                  borderRadius: 10,
                  marginBottom: 6,
                  border: `1px solid ${isAlt ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.07)'}`,
                }}>
                  <div style={{...styles.node, background: daysAgo === 0 ? '#4dff91' : 'rgba(255,255,255,0.25)', boxShadow: daysAgo === 0 ? `0 0 12px #4dff91` : 'none'}}/>

                  <div style={styles.dayContent}>
                    <div style={styles.dayHeader}>
                      <span style={{...styles.dayLabel, color: daysAgo === 0 ? '#4dff91' : 'white'}}>
                        {label}
                        {daysAgo > 0 && <span style={{color:'rgba(255,255,255,0.3)', fontSize:11, marginLeft:8}}>{formatDate(daysAgo)}</span>}
                      </span>
                      <span style={{opacity:0.3, fontSize:11}}>
                        {daysLeft}D LEFT
                      </span>
                    </div>

                    {qs.length === 0 ? (
                      <div style={styles.noQ}>— no problems logged —</div>
                    ) : (
                      <div style={{display:'flex', flexDirection:'column', gap:6, marginTop:8}}>
                        {qs.map(q => (
                          <div key={q.id} style={{
                            ...styles.qItem,
                            background: 'rgba(255,255,255,0.92)',
                            border: '1px solid rgba(255,255,255,0.3)',
                          }} className="q-item">
                            <a href={q.url} target="_blank" rel="noopener noreferrer" style={{...styles.qName, color: '#111'}}>
                              {q.title}
                            </a>
                            <button onClick={() => del(q.id)} style={{...styles.delBtn, color: 'rgba(0,0,0,0.35)'}} className="del-btn" title="Remove">
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}

const styles = {
  root: {
    minHeight: '100vh',
    background: '#2a2a2a',
    color: 'white',
    fontFamily: '"DM Mono", "Fira Mono", "Courier New", monospace',
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 28px',
    borderBottom: '1px solid rgba(255,255,255,0.07)',
    background: '#0d0d0d',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  navLeft: { display: 'flex', alignItems: 'center', gap: 14 },
  logoMark: {
    width: 44, height: 44,
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 8,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  appTitle: { fontSize: 16, fontWeight: 700, letterSpacing: 4, color: 'white' },
  appSub: { fontSize: 9, letterSpacing: 3, color: 'rgba(255,255,255,0.3)', marginTop: 1 },
  navRight: { display: 'flex', alignItems: 'center', gap: 10 },
  datePill: {
    fontSize: 10, letterSpacing: 2, color: 'rgba(255,255,255,0.3)',
    padding: '5px 12px', border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 4,
  },
  statPill: {
    fontSize: 12, padding: '5px 12px',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 4, background: 'rgba(255,255,255,0.03)',
    display: 'flex', alignItems: 'center',
  },
  main: { maxWidth: 860, margin: '0 auto', padding: '40px 28px' },
  formCard: {
    background: '#111',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 10,
    padding: '20px 24px',
    marginBottom: 48,
  },
  formLabel: { fontSize: 10, letterSpacing: 3, color: 'rgba(255,255,255,0.4)', marginBottom: 14 },
  formRow: { display: 'flex', gap: 10, flexWrap: 'wrap' },
  input: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 6,
    padding: '11px 14px',
    color: 'white',
    fontSize: 13,
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'border-color 0.2s',
    minWidth: 160,
  },
  addBtn: {
    background: '#4dff91',
    color: '#000',
    border: 'none',
    borderRadius: 6,
    padding: '11px 22px',
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 2,
    fontFamily: 'inherit',
    cursor: 'pointer',
    display: 'flex', alignItems: 'center', gap: 8,
    whiteSpace: 'nowrap',
    transition: 'all 0.15s',
  },
  sectionHeader: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 11, letterSpacing: 3, fontWeight: 700, color: 'rgba(255,255,255,0.7)',
    display: 'flex', alignItems: 'center', gap: 10,
  },
  dot: { width: 7, height: 7, borderRadius: '50%', display: 'inline-block', flexShrink: 0 },
  countBadge: {
    fontSize: 10, letterSpacing: 2, fontWeight: 700,
    padding: '3px 10px', borderRadius: 3, border: '1px solid',
  },
  emptyDue: {
    textAlign: 'center', padding: '32px 0',
    border: '1px dashed rgba(255,255,255,0.07)',
    borderRadius: 8,
  },
  dueCard: {
    background: '#111', border: '1px solid rgba(255,77,77,0.2)',
    borderRadius: 8, padding: '14px 16px',
    display: 'flex', alignItems: 'center', gap: 14,
    position: 'relative', overflow: 'hidden',
    transition: 'border-color 0.2s',
  },
  dueBar: { width: 3, height: '100%', position: 'absolute', left: 0, top: 0, borderRadius: '4px 0 0 4px' },
  dueName: { fontSize: 15, fontWeight: 500, color: 'white', marginBottom: 6, paddingLeft: 4 },
  dueMeta: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 10, letterSpacing: 1, paddingLeft: 4 },
  solveLink: { color: '#4dffb4', textDecoration: 'none', fontWeight: 700 },
  doneBtn: {
    background: 'rgba(77,255,145,0.1)', color: '#4dff91',
    border: '1px solid rgba(77,255,145,0.3)',
    borderRadius: 5, padding: '8px 16px',
    fontSize: 11, fontWeight: 700, letterSpacing: 2,
    fontFamily: 'inherit', cursor: 'pointer', whiteSpace: 'nowrap',
    transition: 'all 0.15s',
  },
  spine: {
    position: 'absolute', left: 5, top: 10, bottom: 10,
    width: 1, background: 'rgba(255,255,255,0.08)',
  },
  dayRow: {
    position: 'relative', paddingLeft: 30, paddingBottom: 28,
    display: 'flex', gap: 0,
  },
  node: {
    position: 'absolute', left: 0, top: 10,
    width: 11, height: 11, borderRadius: '50%',
    border: '2px solid #2a2a2a',
    flexShrink: 0,
  },
  dayContent: { flex: 1, minWidth: 0 },
  dayHeader: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: 8, flexWrap: 'wrap', gap: 6,
  },
  dayLabel: { fontSize: 13, fontWeight: 700, letterSpacing: 2 },

  noQ: { fontSize: 11, color: 'rgba(255,255,255,0.2)', fontStyle: 'italic', marginTop: 6 },
  qItem: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 6, padding: '9px 12px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    transition: 'border-color 0.15s',
  },
  qName: { fontSize: 13, color: 'rgba(255,255,255,0.85)', textDecoration: 'none', flex: 1 },
  delBtn: {
    background: 'none', border: 'none', cursor: 'pointer',
    color: 'rgba(255,255,255,0.2)', fontSize: 18, lineHeight: 1,
    padding: '0 4px', fontFamily: 'inherit',
    transition: 'color 0.15s',
  },
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&display=swap');
  * { box-sizing: border-box; }

  .form-card { transition: border-color 0.2s; }
  .form-card:focus-within { border-color: rgba(77,255,145,0.3) !important; }

  .dsa-input:focus { border-color: rgba(77,255,145,0.5) !important; background: rgba(77,255,145,0.04) !important; }
  .dsa-input::placeholder { color: rgba(255,255,255,0.2); }

  .add-btn:hover { background: #6fffaa !important; transform: translateY(-1px); }
  .add-btn:active { transform: scale(0.97); }

  .due-card:hover { border-color: rgba(255,77,77,0.4) !important; }
  .done-btn:hover { background: rgba(77,255,145,0.2) !important; border-color: rgba(77,255,145,0.5) !important; }

  .q-item:hover { border-color: rgba(255,255,255,0.15) !important; }
  .q-item:hover .del-btn { color: rgba(255,77,77,0.7) !important; }

  @keyframes blink { 0%,100% { opacity:1; } 50% { opacity:0.2; } }
  .blink-dot { animation: blink 1.5s ease-in-out infinite; }
`;
