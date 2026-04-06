import { useState, useMemo, useEffect, useRef } from "react";

/* ─── Global CSS ─── */
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

*, *::before, *::after { box-sizing: border-box; }

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.93); }
  to   { opacity: 1; transform: scale(1); }
}
@keyframes popIn {
  0%   { opacity: 0; transform: scale(0.9) translateY(10px); }
  65%  { transform: scale(1.02) translateY(-1px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}
@keyframes lineDrawIn {
  from { stroke-dashoffset: 2000; }
  to   { stroke-dashoffset: 0; }
}
@keyframes barGrow {
  from { transform: scaleY(0); }
  to   { transform: scaleY(1); }
}
@keyframes slideRight {
  from { transform: scaleX(0); }
  to   { transform: scaleX(1); }
}
@keyframes rowSlide {
  from { opacity: 0; transform: translateX(-10px); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes pulse-dot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.5; transform: scale(0.7); }
}
@keyframes countUp {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}

.card-enter  { animation: fadeUp  0.48s cubic-bezier(0.22,1,0.36,1) both; }
.tab-content { animation: fadeUp  0.4s  cubic-bezier(0.22,1,0.36,1) both; }
.modal-bd    { animation: fadeIn  0.2s  ease both; }
.modal-box   { animation: popIn   0.35s cubic-bezier(0.22,1,0.36,1) both; }
.row-enter   { animation: rowSlide 0.3s cubic-bezier(0.22,1,0.36,1) both; }
.bar-grow    { transform-origin: bottom; animation: barGrow    0.6s  cubic-bezier(0.22,1,0.36,1) both; }
.prog-bar    { transform-origin: left;   animation: slideRight 0.75s cubic-bezier(0.22,1,0.36,1) both; }
.count-in    { animation: countUp 0.4s ease both; }

.fin-card {
  background: var(--card);
  border-radius: 14px;
  border: 1px solid var(--bdr);
  transition: transform 0.22s cubic-bezier(0.22,1,0.36,1), box-shadow 0.22s ease;
}
.fin-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 32px rgba(0,0,0,0.08);
}

.live-dot {
  width: 7px; height: 7px; border-radius: 50%; background: #1D9E75;
  animation: pulse-dot 2s ease-in-out infinite;
}
`;

const INITIAL_TRANSACTIONS = [
  { id:1,  date:"2025-01-05", description:"Salary Deposit",      amount: 85000, category:"Salary",        type:"income"  },
  { id:2,  date:"2025-01-08", description:"Rent Payment",        amount:-22000, category:"Housing",       type:"expense" },
  { id:3,  date:"2025-01-10", description:"Grocery Store",       amount: -3200, category:"Food",          type:"expense" },
  { id:4,  date:"2025-01-12", description:"Netflix Subscription",amount:  -649, category:"Entertainment", type:"expense" },
  { id:5,  date:"2025-01-15", description:"Freelance Project",   amount: 15000, category:"Freelance",     type:"income"  },
  { id:6,  date:"2025-01-18", description:"Electricity Bill",    amount: -1800, category:"Utilities",     type:"expense" },
  { id:7,  date:"2025-01-20", description:"Restaurant Dinner",   amount: -1200, category:"Food",          type:"expense" },
  { id:8,  date:"2025-01-22", description:"Gym Membership",      amount:  -999, category:"Health",        type:"expense" },
  { id:9,  date:"2025-01-25", description:"Swiggy Order",        amount:  -580, category:"Food",          type:"expense" },
  { id:10, date:"2025-01-28", description:"Internet Bill",       amount:  -999, category:"Utilities",     type:"expense" },
  { id:11, date:"2025-02-05", description:"Salary Deposit",      amount: 85000, category:"Salary",        type:"income"  },
  { id:12, date:"2025-02-07", description:"Rent Payment",        amount:-22000, category:"Housing",       type:"expense" },
  { id:13, date:"2025-02-10", description:"Clothing Shopping",   amount: -4500, category:"Shopping",      type:"expense" },
  { id:14, date:"2025-02-12", description:"Dividend Income",     amount:  3200, category:"Investment",    type:"income"  },
  { id:15, date:"2025-02-14", description:"Grocery Store",       amount: -2800, category:"Food",          type:"expense" },
  { id:16, date:"2025-02-18", description:"Petrol",              amount: -2000, category:"Transport",     type:"expense" },
  { id:17, date:"2025-02-20", description:"Doctor Visit",        amount: -1500, category:"Health",        type:"expense" },
  { id:18, date:"2025-02-22", description:"Amazon Order",        amount: -3200, category:"Shopping",      type:"expense" },
  { id:19, date:"2025-02-25", description:"Electricity Bill",    amount: -1900, category:"Utilities",     type:"expense" },
  { id:20, date:"2025-03-05", description:"Salary Deposit",      amount: 85000, category:"Salary",        type:"income"  },
  { id:21, date:"2025-03-07", description:"Rent Payment",        amount:-22000, category:"Housing",       type:"expense" },
  { id:22, date:"2025-03-10", description:"Grocery Store",       amount: -3500, category:"Food",          type:"expense" },
  { id:23, date:"2025-03-14", description:"Freelance Project",   amount: 20000, category:"Freelance",     type:"income"  },
  { id:24, date:"2025-03-16", description:"Movie Tickets",       amount:  -800, category:"Entertainment", type:"expense" },
  { id:25, date:"2025-03-18", description:"Phone Bill",          amount:  -699, category:"Utilities",     type:"expense" },
  { id:26, date:"2025-03-20", description:"Gym Membership",      amount:  -999, category:"Health",        type:"expense" },
  { id:27, date:"2025-03-24", description:"Mutual Fund SIP",     amount:-10000, category:"Investment",    type:"expense" },
  { id:28, date:"2025-03-28", description:"Restaurant",          amount: -1800, category:"Food",          type:"expense" },
  { id:29, date:"2025-04-05", description:"Salary Deposit",      amount: 85000, category:"Salary",        type:"income"  },
  { id:30, date:"2025-04-07", description:"Rent Payment",        amount:-22000, category:"Housing",       type:"expense" },
  { id:31, date:"2025-04-10", description:"Grocery Store",       amount: -3100, category:"Food",          type:"expense" },
  { id:32, date:"2025-04-12", description:"Travel Booking",      amount: -8000, category:"Travel",        type:"expense" },
  { id:33, date:"2025-04-15", description:"Dividend Income",     amount:  4500, category:"Investment",    type:"income"  },
  { id:34, date:"2025-04-18", description:"Clothing",            amount: -2500, category:"Shopping",      type:"expense" },
  { id:35, date:"2025-04-22", description:"Internet Bill",       amount:  -999, category:"Utilities",     type:"expense" },
  { id:36, date:"2025-04-25", description:"Swiggy Order",        amount:  -750, category:"Food",          type:"expense" },
  { id:37, date:"2025-05-05", description:"Salary Deposit",      amount: 85000, category:"Salary",        type:"income"  },
  { id:38, date:"2025-05-07", description:"Rent Payment",        amount:-22000, category:"Housing",       type:"expense" },
  { id:39, date:"2025-05-10", description:"Grocery Store",       amount: -2900, category:"Food",          type:"expense" },
  { id:40, date:"2025-05-12", description:"Concert Tickets",     amount: -3000, category:"Entertainment", type:"expense" },
  { id:41, date:"2025-05-15", description:"Freelance Project",   amount: 12000, category:"Freelance",     type:"income"  },
  { id:42, date:"2025-05-18", description:"Car Service",         amount: -4500, category:"Transport",     type:"expense" },
  { id:43, date:"2025-05-22", description:"Gym Membership",      amount:  -999, category:"Health",        type:"expense" },
  { id:44, date:"2025-05-25", description:"Mutual Fund SIP",     amount:-10000, category:"Investment",    type:"expense" },
  { id:45, date:"2025-06-05", description:"Salary Deposit",      amount: 90000, category:"Salary",        type:"income"  },
  { id:46, date:"2025-06-07", description:"Rent Payment",        amount:-22000, category:"Housing",       type:"expense" },
  { id:47, date:"2025-06-10", description:"Grocery Store",       amount: -3300, category:"Food",          type:"expense" },
  { id:48, date:"2025-06-14", description:"Electricity Bill",    amount: -2200, category:"Utilities",     type:"expense" },
  { id:49, date:"2025-06-18", description:"Amazon Shopping",     amount: -5500, category:"Shopping",      type:"expense" },
  { id:50, date:"2025-06-22", description:"Restaurant",          amount: -2100, category:"Food",          type:"expense" },
];

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const CAT_COLORS = {
  Housing:"#3B6D11", Food:"#BA7517", Entertainment:"#7F77DD",
  Utilities:"#1D9E75", Health:"#D4537E", Shopping:"#378ADD",
  Transport:"#888780", Investment:"#D85A30", Salary:"#27500A",
  Freelance:"#533489", Travel:"#0F6E56",
};
const CAT_ICONS = {
  Housing:"🏠", Food:"🍽️", Entertainment:"🎬", Utilities:"⚡",
  Health:"❤️", Shopping:"🛍️", Transport:"🚗", Investment:"📈",
  Salary:"💼", Freelance:"💡", Travel:"✈️",
};

const fmt = n => new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(Math.abs(n));
const fmtShort = n => {
  const abs = Math.abs(n);
  if (abs >= 100000) return `₹${(abs/100000).toFixed(1)}L`;
  if (abs >= 1000)   return `₹${(abs/1000).toFixed(1)}K`;
  return `₹${abs}`;
};

/* ── Count-up hook ── */
function useCountUp(target, dur = 950) {
  const [val, setVal] = useState(0);
  const raf = useRef(null);
  useEffect(() => {
    const t0 = Date.now();
    const step = () => {
      const p = Math.min((Date.now()-t0)/dur, 1);
      setVal(Math.round(target * (1 - Math.pow(1-p, 3))));
      if (p < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [target, dur]);
  return val;
}
function CountFmt({ n }) { return <>{fmt(useCountUp(n))}</>; }

/* ── Sparkline ── */
function Sparkline({ data, color, h = 36 }) {
  if (!data.length) return null;
  const mn = Math.min(...data), mx = Math.max(...data), rng = mx-mn||1;
  const W = 80;
  const pts = data.map((v,i) => {
    const x = (i/(data.length-1))*W;
    const y = h - 3 - ((v-mn)/rng)*(h-6);
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${h}`} style={{width:W,height:h,display:"block"}}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round"
        strokeDasharray="500" strokeDashoffset="500"
        style={{animation:"lineDrawIn 0.9s cubic-bezier(0.22,1,0.36,1) 0.3s both"}}/>
      {(() => {
        const last = data[data.length-1];
        const x = W, y = h - 3 - ((last-mn)/rng)*(h-6);
        return <circle cx={x} cy={y} r="2.5" fill={color} style={{opacity:0,animation:"fadeIn 0.3s ease 1.1s both"}}/>;
      })()}
    </svg>
  );
}

/* ── Full line chart with grid ── */
function LineChart({ monthlyData, k, dark }) {
  const vals = monthlyData.map(d=>d.balance);
  const mn=Math.min(...vals), mx=Math.max(...vals), rng=mx-mn||1;
  const W=500,H=140,pl=50,pr=12,pt=10,pb=30;
  const iW=W-pl-pr, iH=H-pt-pb;
  const pts = vals.map((v,i)=>{
    const x = pl + (i/(vals.length-1))*iW;
    const y = pt + iH - ((v-mn)/rng)*iH;
    return {x,y,v};
  });
  const polyStr = pts.map(p=>`${p.x},${p.y}`).join(" ");
  const area = `${pl},${pt+iH} ${polyStr} ${pl+iW},${pt+iH}`;
  const gridLines = 4;
  const gridColor = dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)";
  const labelColor = dark ? "#666" : "#aaa";

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",height:H}} key={k}>
      <defs>
        <linearGradient id={`lg-${k}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1D9E75" stopOpacity="0.18"/>
          <stop offset="100%" stopColor="#1D9E75" stopOpacity="0"/>
        </linearGradient>
      </defs>
      {/* grid lines */}
      {Array.from({length:gridLines+1}).map((_,i)=>{
        const y = pt + (i/gridLines)*iH;
        const val = mx - (i/gridLines)*rng;
        return (
          <g key={i}>
            <line x1={pl} y1={y} x2={pl+iW} y2={y} stroke={gridColor} strokeWidth="1"/>
            <text x={pl-6} y={y+4} textAnchor="end" fontSize="9" fill={labelColor}>{fmtShort(val)}</text>
          </g>
        );
      })}
      {/* area */}
      <polygon points={area} fill={`url(#lg-${k})`} style={{opacity:0,animation:"fadeIn 0.7s ease 0.5s both"}}/>
      {/* line */}
      <polyline points={polyStr} fill="none" stroke="#1D9E75" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round"
        strokeDasharray="2000" strokeDashoffset="2000"
        style={{animation:"lineDrawIn 1.1s cubic-bezier(0.22,1,0.36,1) 0.1s both"}}/>
      {/* dots + labels */}
      {pts.map((p,i)=>(
        <g key={i} style={{opacity:0,animation:`fadeIn 0.3s ease ${0.9+i*0.07}s both`}}>
          <circle cx={p.x} cy={p.y} r="3.5" fill="#1D9E75" stroke={dark?"#242424":"white"} strokeWidth="1.5"/>
          <text x={p.x} y={pt+iH+20} textAnchor="middle" fontSize="9" fill={labelColor}>{monthlyData[i]?.month}</text>
        </g>
      ))}
    </svg>
  );
}

/* ── Bar chart ── */
function BarChart({ monthlyData, k, dark }) {
  const max = Math.max(...monthlyData.flatMap(d=>[d.income,d.expenses]));
  const W=500,H=140,pl=50,pr=12,pt=10,pb=30;
  const iW=W-pl-pr, iH=H-pt-pb;
  const gw = iW/monthlyData.length;
  const bw = Math.min(gw*0.3, 16);
  const gap = 3;
  const gridColor = dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)";
  const labelColor = dark ? "#666" : "#aaa";

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",height:H}} key={k}>
      {[0,0.25,0.5,0.75,1].map((r,i)=>{
        const y = pt + r*iH;
        return (
          <g key={i}>
            <line x1={pl} y1={y} x2={pl+iW} y2={y} stroke={gridColor} strokeWidth="1"/>
            <text x={pl-6} y={y+4} textAnchor="end" fontSize="9" fill={labelColor}>{fmtShort((1-r)*max)}</text>
          </g>
        );
      })}
      {monthlyData.map((d,i)=>{
        const cx = pl + i*gw + gw/2;
        const ih = (d.income/max)*iH;
        const eh = (d.expenses/max)*iH;
        const del = `${i*0.06}s`;
        return (
          <g key={i}>
            <rect x={cx-bw-gap/2} y={pt+iH-ih} width={bw} height={ih} fill="#1D9E75" rx="2" opacity="0.85"
              style={{transformOrigin:`${cx-bw/2-gap/2}px ${pt+iH}px`,opacity:0,
                animation:`barGrow 0.55s cubic-bezier(0.22,1,0.36,1) ${del} both, fadeIn 0.3s ease ${del} both`}}/>
            <rect x={cx+gap/2} y={pt+iH-eh} width={bw} height={eh} fill="#E05A2B" rx="2" opacity="0.85"
              style={{transformOrigin:`${cx+bw/2+gap/2}px ${pt+iH}px`,opacity:0,
                animation:`barGrow 0.55s cubic-bezier(0.22,1,0.36,1) ${0.04+i*0.06}s both, fadeIn 0.3s ease ${0.04+i*0.06}s both`}}/>
            <text x={cx} y={pt+iH+20} textAnchor="middle" fontSize="9" fill={labelColor}>{d.month}</text>
          </g>
        );
      })}
    </svg>
  );
}

/* ── Donut ── */
function Donut({ data, k }) {
  const total = data.reduce((s,d)=>s+d.value,0);
  let cum = 0;
  const R=62, r=40, cx=74, cy=74;
  const segs = data.map(d=>{
    const pct=d.value/total, s=cum*2*Math.PI-Math.PI/2;
    cum+=pct;
    const e=cum*2*Math.PI-Math.PI/2;
    const x1=cx+R*Math.cos(s),y1=cy+R*Math.sin(s);
    const x2=cx+R*Math.cos(e),y2=cy+R*Math.sin(e);
    const ix1=cx+r*Math.cos(s),iy1=cy+r*Math.sin(s);
    const ix2=cx+r*Math.cos(e),iy2=cy+r*Math.sin(e);
    return{...d,pct,path:`M ${x1} ${y1} A ${R} ${R} 0 ${pct>.5?1:0} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${r} ${r} 0 ${pct>.5?1:0} 0 ${ix1} ${iy1} Z`};
  });
  return (
    <svg viewBox="0 0 148 148" style={{width:"100%",maxWidth:148}} key={k}>
      {segs.map((s,i)=>(
        <path key={i} d={s.path} fill={s.color}
          style={{opacity:0,animation:`fadeIn 0.4s ease ${0.08+i*0.08}s both`,cursor:"default"}}/>
      ))}
      <text x={cx} y={cy-7} textAnchor="middle" fontSize="10" fill="#888780" fontFamily="Inter,sans-serif">Spend</text>
      <text x={cx} y={cx+8} textAnchor="middle" fontSize="11" fontWeight="600" fill="#5F5E5A" fontFamily="Inter,sans-serif">{fmtShort(total)}</text>
    </svg>
  );
}

/* ── Modal ── */
function Modal({ data, onChange, title, onClose, onSubmit, label, bg, card, text, muted, border, accent, darkMode }) {
  return (
    <div className="modal-bd" style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div className="modal-box" style={{background:card,borderRadius:16,padding:"28px",width:"100%",maxWidth:440,boxShadow:"0 24px 60px rgba(0,0,0,0.2)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
          <h2 style={{margin:0,fontSize:16,fontWeight:700,color:text,letterSpacing:"-0.3px"}}>{title}</h2>
          <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",fontSize:18,color:muted,lineHeight:1}}>✕</button>
        </div>
        {[{l:"Date",f:"date",t:"date"},{l:"Description",f:"description",t:"text"},{l:"Amount (₹)",f:"amount",t:"number"}].map(({l,f,t})=>(
          <div key={f} style={{marginBottom:14}}>
            <label style={{display:"block",fontSize:12,color:muted,marginBottom:5,fontWeight:500}}>{l}</label>
            <input type={t} value={data[f]} onChange={e=>onChange(f,e.target.value)}
              style={{width:"100%",padding:"9px 12px",borderRadius:9,border:`1.5px solid ${border}`,background:bg,color:text,fontSize:13,outline:"none",transition:"border-color 0.2s,box-shadow 0.2s",fontFamily:"inherit"}}
              onFocus={e=>{e.target.style.borderColor=accent;e.target.style.boxShadow=`0 0 0 3px ${accent}22`;}}
              onBlur={e=>{e.target.style.borderColor=border;e.target.style.boxShadow="none";}}/>
          </div>
        ))}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:22}}>
          {[{l:"Category",f:"category",opts:Object.keys(CAT_COLORS)},{l:"Type",f:"type",opts:["expense","income"]}].map(({l,f,opts})=>(
            <div key={f}>
              <label style={{display:"block",fontSize:12,color:muted,marginBottom:5,fontWeight:500}}>{l}</label>
              <select value={data[f]} onChange={e=>onChange(f,e.target.value)}
                style={{width:"100%",padding:"9px 12px",borderRadius:9,border:`1.5px solid ${border}`,background:bg,color:text,fontSize:13,fontFamily:"inherit"}}>
                {opts.map(o=><option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          ))}
        </div>
        <div style={{display:"flex",gap:10}}>
          <button onClick={onClose}
            style={{flex:1,padding:"11px",borderRadius:9,border:`1.5px solid ${border}`,background:"transparent",color:text,cursor:"pointer",fontSize:13,fontWeight:500,transition:"background 0.15s",fontFamily:"inherit"}}
            onMouseEnter={e=>e.currentTarget.style.background=darkMode?"#333":"#f4f3ef"}
            onMouseLeave={e=>e.currentTarget.style.background="transparent"}>Cancel</button>
          <button onClick={onSubmit}
            style={{flex:1,padding:"11px",borderRadius:9,border:"none",background:accent,color:"white",cursor:"pointer",fontSize:13,fontWeight:600,transition:"transform 0.12s,opacity 0.12s",fontFamily:"inherit"}}
            onMouseEnter={e=>e.currentTarget.style.opacity="0.88"}
            onMouseLeave={e=>e.currentTarget.style.opacity="1"}
            onMouseDown={e=>e.currentTarget.style.transform="scale(0.97)"}
            onMouseUp={e=>e.currentTarget.style.transform="scale(1)"}>{label}</button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════ MAIN APP ══════════════════════════════ */
export default function App() {
  const [transactions, setTransactions] = useState(()=>{
    try{const s=localStorage.getItem("fin_txns_v2");return s?JSON.parse(s):INITIAL_TRANSACTIONS;}
    catch{return INITIAL_TRANSACTIONS;}
  });
  const [role,setRole]             = useState("admin");
  const [activeTab,setActiveTab]   = useState("dashboard");
  const [tabKey,setTabKey]         = useState(0);
  const [chartKey,setChartKey]     = useState(0);
  const [filterType,setFilterType] = useState("all");
  const [filterCat,setFilterCat]   = useState("all");
  const [search,setSearch]         = useState("");
  const [sortBy,setSortBy]         = useState("date_desc");
  const [dark,setDark]             = useState(false);
  const [showAdd,setShowAdd]       = useState(false);
  const [editTxn,setEditTxn]       = useState(null);
  const [newTxn,setNewTxn]         = useState({date:"",description:"",amount:"",category:"Food",type:"expense"});

  useEffect(()=>{
    if(document.getElementById("ff-css-v2"))return;
    const s=document.createElement("style"); s.id="ff-css-v2"; s.textContent=GLOBAL_CSS;
    document.head.appendChild(s);
    // inject CSS vars
    document.documentElement.style.setProperty("--card","#ffffff");
    document.documentElement.style.setProperty("--bdr","rgba(0,0,0,0.09)");
  },[]);

  useEffect(()=>{
    try{localStorage.setItem("fin_txns_v2",JSON.stringify(transactions));}catch{}
  },[transactions]);

  const switchTab = id => { setActiveTab(id); setTabKey(k=>k+1); };

  const cats = [...new Set(transactions.map(t=>t.category))].sort();

  const filtered = useMemo(()=>{
    let arr=[...transactions];
    if(filterType!=="all") arr=arr.filter(t=>t.type===filterType);
    if(filterCat!=="all")  arr=arr.filter(t=>t.category===filterCat);
    if(search) arr=arr.filter(t=>t.description.toLowerCase().includes(search.toLowerCase())||t.category.toLowerCase().includes(search.toLowerCase()));
    arr.sort((a,b)=>{
      if(sortBy==="date_desc")   return new Date(b.date)-new Date(a.date);
      if(sortBy==="date_asc")    return new Date(a.date)-new Date(b.date);
      if(sortBy==="amount_desc") return Math.abs(b.amount)-Math.abs(a.amount);
      if(sortBy==="amount_asc")  return Math.abs(a.amount)-Math.abs(b.amount);
      return 0;
    });
    return arr;
  },[transactions,filterType,filterCat,search,sortBy]);

  const summary = useMemo(()=>{
    const income=transactions.filter(t=>t.type==="income").reduce((s,t)=>s+t.amount,0);
    const expenses=Math.abs(transactions.filter(t=>t.type==="expense").reduce((s,t)=>s+t.amount,0));
    return{income,expenses,balance:income-expenses,txCount:transactions.length};
  },[transactions]);

  const monthly = useMemo(()=>{
    const m={};
    transactions.forEach(t=>{
      const d=new Date(t.date), k=`${d.getFullYear()}-${d.getMonth()}`;
      if(!m[k]) m[k]={month:MONTHS[d.getMonth()],income:0,expenses:0,year:d.getFullYear(),mo:d.getMonth()};
      if(t.type==="income") m[k].income+=t.amount; else m[k].expenses+=Math.abs(t.amount);
    });
    return Object.values(m).sort((a,b)=>a.year!==b.year?a.year-b.year:a.mo-b.mo).map(d=>({...d,balance:d.income-d.expenses}));
  },[transactions]);

  const catSpend = useMemo(()=>{
    const m={};
    transactions.filter(t=>t.type==="expense").forEach(t=>{ m[t.category]=(m[t.category]||0)+Math.abs(t.amount); });
    return Object.entries(m).map(([k,v])=>({name:k,value:v,color:CAT_COLORS[k]||"#888780"})).sort((a,b)=>b.value-a.value);
  },[transactions]);

  const insights = useMemo(()=>{
    const topCat=catSpend[0];
    const last2=monthly.slice(-2);
    const mChg=last2.length===2?((last2[1].expenses-last2[0].expenses)/last2[0].expenses*100).toFixed(1):null;
    const avgI=monthly.reduce((s,d)=>s+d.income,0)/(monthly.length||1);
    const avgE=monthly.reduce((s,d)=>s+d.expenses,0)/(monthly.length||1);
    const sr=avgI>0?(((avgI-avgE)/avgI)*100).toFixed(1):"0";
    // health score: savings rate 40%, low expense ratio 30%, positive balance 30%
    const srNum=parseFloat(sr), erNum=avgE/avgI*100;
    const healthScore=Math.min(100,Math.round(srNum*0.45 + (100-erNum)*0.3 + (summary.balance>0?25:0)));
    return{topCat,mChg,sr,avgI,avgE,healthScore};
  },[catSpend,monthly,summary]);

  const recentTxns = useMemo(()=>[...transactions].sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,6),[transactions]);

  const bump=()=>setChartKey(k=>k+1);
  const addTxn=()=>{
    if(!newTxn.date||!newTxn.description||!newTxn.amount)return;
    const amt=parseFloat(newTxn.amount); if(isNaN(amt))return;
    setTransactions(p=>[...p,{...newTxn,amount:newTxn.type==="expense"?-Math.abs(amt):Math.abs(amt),id:Date.now()}]);
    setNewTxn({date:"",description:"",amount:"",category:"Food",type:"expense"});
    setShowAdd(false); bump();
  };
  const saveEdit=()=>{
    if(!editTxn)return;
    setTransactions(p=>p.map(t=>t.id===editTxn.id?{...editTxn,amount:editTxn.type==="expense"?-Math.abs(parseFloat(editTxn.amount)):Math.abs(parseFloat(editTxn.amount))}:t));
    setEditTxn(null); bump();
  };
  const del=id=>{setTransactions(p=>p.filter(t=>t.id!==id));bump();};
  const exportCSV=()=>{
    const rows=[["Date","Description","Category","Type","Amount"],...transactions.map(t=>[t.date,t.description,t.category,t.type,t.amount])];
    const a=document.createElement("a");
    a.href=URL.createObjectURL(new Blob([rows.map(r=>r.join(",")).join("\n")],{type:"text/csv"}));
    a.download="transactions.csv"; a.click();
  };

  /* theme */
  const bg    = dark?"#111214":"#F0EFE9";
  const card  = dark?"#1C1D1F":"#FFFFFF";
  const card2 = dark?"#222426":"#F8F7F3";
  const txt   = dark?"#E4E2DC":"#1A1A18";
  const muted = dark?"#6B6A66":"#8A8880";
  const bdr   = dark?"rgba(255,255,255,0.07)":"rgba(0,0,0,0.07)";
  const acc   = "#1D9E75";
  const TABS=[{id:"dashboard",label:"Overview"},{id:"transactions",label:"Transactions"},{id:"insights",label:"Insights"}];
  const sharedModal={bg,card,text:txt,muted,border:bdr,accent:acc,darkMode:dark};

  /* health color */
  const hScore = insights.healthScore;
  const healthColor = hScore>=70?acc:hScore>=45?"#BA7517":"#D85A30";
  const healthLabel = hScore>=70?"Excellent":hScore>=45?"Moderate":"Needs Attention";

  return (
    <div style={{background:bg,minHeight:"100vh",fontFamily:"'Inter','Segoe UI',sans-serif",color:txt,transition:"background 0.3s,color 0.3s"}}>

      {/* ─── Topbar ─── */}
      <div style={{background:card,borderBottom:`1px solid ${bdr}`,padding:"0 28px",display:"flex",alignItems:"center",gap:16,position:"sticky",top:0,zIndex:50,transition:"background 0.3s",height:56}}>
        {/* Logo */}
        <div style={{display:"flex",alignItems:"center",gap:10,flex:1}}>
          <div style={{width:30,height:30,background:`linear-gradient(135deg, #1D9E75 0%, #0F6E56 100%)`,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",transition:"transform 0.3s",cursor:"default",flexShrink:0}}
            onMouseEnter={e=>e.currentTarget.style.transform="rotate(8deg) scale(1.1)"}
            onMouseLeave={e=>e.currentTarget.style.transform="rotate(0) scale(1)"}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div>
            <span style={{fontWeight:700,fontSize:15,letterSpacing:"-0.4px",display:"block",lineHeight:1.1}}>FinFlow</span>
            <span style={{fontSize:10,color:muted,letterSpacing:"0.2px"}}>Personal Finance</span>
          </div>
        </div>
        {/* Nav */}
        <nav style={{display:"flex",gap:1,background:card2,borderRadius:10,padding:3,border:`1px solid ${bdr}`}}>
          {TABS.map(tab=>(
            <button key={tab.id} onClick={()=>switchTab(tab.id)}
              style={{padding:"5px 14px",borderRadius:8,border:"none",cursor:"pointer",fontSize:13,fontWeight:500,
                background:activeTab===tab.id?card:"transparent",
                color:activeTab===tab.id?txt:muted,
                boxShadow:activeTab===tab.id?`0 1px 4px rgba(0,0,0,0.1)`:"none",
                transition:"all 0.18s",whiteSpace:"nowrap"}}>
              {tab.label}
            </button>
          ))}
        </nav>
        {/* Controls */}
        <div style={{display:"flex",alignItems:"center",gap:8,flex:1,justifyContent:"flex-end"}}>
          <div style={{display:"flex",alignItems:"center",gap:6,padding:"4px 10px",borderRadius:8,background:card2,border:`1px solid ${bdr}`,fontSize:12}}>
            <div className="live-dot"/>
            <span style={{color:muted,fontSize:11,fontWeight:500}}>Live</span>
          </div>
          <select value={role} onChange={e=>setRole(e.target.value)}
            style={{padding:"5px 10px",borderRadius:8,border:`1px solid ${bdr}`,background:card2,color:txt,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>
            <option value="admin">🔑 Admin</option>
            <option value="viewer">👁 Viewer</option>
          </select>
          <button onClick={()=>setDark(d=>!d)}
            style={{width:32,height:32,borderRadius:8,border:`1px solid ${bdr}`,background:card2,cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",transition:"transform 0.3s"}}
            onMouseEnter={e=>e.currentTarget.style.transform="rotate(20deg)"}
            onMouseLeave={e=>e.currentTarget.style.transform="rotate(0)"}>
            {dark?"☀":"🌙"}
          </button>
        </div>
      </div>

      {/* ─── Page body ─── */}
      <div style={{maxWidth:1160,margin:"0 auto",padding:"28px 20px"}}>

        {/* Page header */}
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:24,animation:"fadeUp 0.4s cubic-bezier(0.22,1,0.36,1) both"}}>
          <div>
            <h1 style={{fontSize:20,fontWeight:700,margin:"0 0 3px",letterSpacing:"-0.5px"}}>
              {activeTab==="dashboard"?"Financial Overview":activeTab==="transactions"?"Transactions":"Insights & Analytics"}
            </h1>
            <p style={{margin:0,fontSize:13,color:muted,display:"flex",alignItems:"center",gap:6}}>
              {activeTab==="dashboard"&&<><span style={{fontSize:10,background:`${acc}18`,color:acc,padding:"1px 7px",borderRadius:20,fontWeight:600,letterSpacing:"0.3px"}}>6 months</span> All your key metrics at a glance</>}
              {activeTab==="transactions"&&(role==="admin"?"Full access — add, edit, and manage transactions":"View-only mode — contact admin to make changes")}
              {activeTab==="insights"&&"Deep dive into your spending patterns and financial health"}
            </p>
          </div>
          {role==="admin"&&activeTab==="transactions"&&(
            <div style={{display:"flex",gap:8}}>
              <button onClick={exportCSV}
                style={{padding:"8px 14px",borderRadius:9,border:`1px solid ${bdr}`,background:"transparent",color:txt,fontSize:12,cursor:"pointer",fontWeight:500,transition:"all 0.15s",display:"flex",alignItems:"center",gap:5,fontFamily:"inherit"}}
                onMouseEnter={e=>{e.currentTarget.style.background=dark?"#2a2a2a":"#ebe9e3";}}
                onMouseLeave={e=>{e.currentTarget.style.background="transparent";}}>
                ↓ Export CSV
              </button>
              <button onClick={()=>setShowAdd(true)}
                style={{padding:"8px 16px",borderRadius:9,border:"none",background:acc,color:"white",fontSize:13,cursor:"pointer",fontWeight:600,transition:"all 0.15s",display:"flex",alignItems:"center",gap:5,fontFamily:"inherit"}}
                onMouseEnter={e=>{e.currentTarget.style.opacity="0.88";e.currentTarget.style.transform="translateY(-1px)";}}
                onMouseLeave={e=>{e.currentTarget.style.opacity="1";e.currentTarget.style.transform="translateY(0)";}}>
                + Add Transaction
              </button>
            </div>
          )}
        </div>

        {/* ════════════════ DASHBOARD ════════════════ */}
        {activeTab==="dashboard"&&(
          <div key={`d-${tabKey}`} className="tab-content">

            {/* ── Row 1: KPI cards ── */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:20}}>
              {[
                {
                  label:"Net Balance",
                  val:summary.balance,
                  col:summary.balance>=0?acc:"#D85A30",
                  sub: summary.balance>=0 ? "Positive cash flow" : "Negative — review expenses",
                  icon:"💰",
                  spark:monthly.map(d=>d.balance),
                  badge: summary.balance>=0 ? {text:"▲ Healthy",col:acc} : {text:"▼ Watch",col:"#D85A30"},
                },
                {
                  label:"Total Income",
                  val:summary.income,
                  col:"#1D9E75",
                  sub:`Across ${monthly.length} months tracked`,
                  icon:"📥",
                  spark:monthly.map(d=>d.income),
                  badge:{text:`Avg ${fmtShort(insights.avgI)}/mo`,col:"#1D9E75"},
                },
                {
                  label:"Total Expenses",
                  val:summary.expenses,
                  col:"#D85A30",
                  sub:"All outgoing transactions",
                  icon:"📤",
                  spark:monthly.map(d=>d.expenses),
                  badge:{text:`Avg ${fmtShort(insights.avgE)}/mo`,col:"#D85A30"},
                },
                {
                  label:"Savings Rate",
                  val:null,
                  valRaw:`${insights.sr}%`,
                  col:parseFloat(insights.sr)>30?acc:parseFloat(insights.sr)>15?"#BA7517":"#D85A30",
                  sub:"Average monthly savings",
                  icon:"🎯",
                  spark:monthly.map(d=>d.income>0?Math.round((d.income-d.expenses)/d.income*100):0),
                  badge:{text:parseFloat(insights.sr)>30?"On track":"Below 30% target",col:parseFloat(insights.sr)>30?acc:"#BA7517"},
                },
              ].map((c,i)=>(
                <div key={i} className="card-enter fin-card"
                  style={{padding:"18px 20px",animationDelay:`${i*0.09}s`,cursor:"default"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                    <div>
                      <p style={{margin:"0 0 2px",fontSize:11,color:muted,fontWeight:500,textTransform:"uppercase",letterSpacing:"0.6px"}}>{c.label}</p>
                      <p style={{margin:0,fontSize:22,fontWeight:700,color:c.col,letterSpacing:"-0.5px",lineHeight:1.1}}>
                        {c.val!==null?<CountFmt n={c.val}/>:c.valRaw}
                      </p>
                    </div>
                    <div style={{fontSize:20,opacity:0.8,marginTop:2}}>{c.icon}</div>
                  </div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
                    <div>
                      <Sparkline data={c.spark} color={c.col} h={32}/>
                      <p style={{margin:"5px 0 0",fontSize:11,color:muted,lineHeight:1.3}}>{c.sub}</p>
                    </div>
                    <span style={{padding:"2px 8px",borderRadius:20,fontSize:10,fontWeight:600,background:`${c.badge.col}18`,color:c.badge.col,whiteSpace:"nowrap",marginLeft:8,marginBottom:16}}>
                      {c.badge.text}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Row 2: Charts ── */}
            <div style={{display:"grid",gridTemplateColumns:"1.65fr 1fr",gap:14,marginBottom:14}}>
              {/* Balance trend - large */}
              <div className="card-enter fin-card" style={{padding:"22px 24px",animationDelay:"0.38s"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
                  <div>
                    <p style={{margin:0,fontSize:14,fontWeight:600,color:txt,letterSpacing:"-0.2px"}}>Net Balance Trend</p>
                    <p style={{margin:"3px 0 0",fontSize:12,color:muted}}>Monthly closing balance — income minus all outgoing payments</p>
                  </div>
                  <div style={{display:"flex",gap:6,marginTop:2}}>
                    <span style={{fontSize:10,background:`${acc}15`,color:acc,padding:"3px 9px",borderRadius:20,fontWeight:600}}>6M</span>
                  </div>
                </div>
                {/* Quick stats row */}
                <div style={{display:"flex",gap:20,margin:"12px 0 6px",padding:"10px 14px",background:card2,borderRadius:10,border:`1px solid ${bdr}`}}>
                  {[
                    {l:"Peak month",v:fmtShort(Math.max(...monthly.map(d=>d.balance)))},
                    {l:"Lowest month",v:fmtShort(Math.min(...monthly.map(d=>d.balance)))},
                    {l:"Avg balance",v:fmtShort(monthly.reduce((s,d)=>s+d.balance,0)/monthly.length)},
                  ].map((s,i)=>(
                    <div key={i} style={{flex:1,textAlign:"center"}}>
                      <p style={{margin:"0 0 2px",fontSize:10,color:muted,textTransform:"uppercase",letterSpacing:"0.4px"}}>{s.l}</p>
                      <p style={{margin:0,fontSize:13,fontWeight:600,color:txt}}>{s.v}</p>
                    </div>
                  ))}
                </div>
                <LineChart monthlyData={monthly} k={chartKey} dark={dark}/>
              </div>

              {/* Financial Health Score */}
              <div className="card-enter fin-card" style={{padding:"22px 24px",animationDelay:"0.46s",display:"flex",flexDirection:"column"}}>
                <p style={{margin:"0 0 3px",fontSize:14,fontWeight:600,color:txt,letterSpacing:"-0.2px"}}>Financial Health Score</p>
                <p style={{margin:"0 0 18px",fontSize:12,color:muted}}>Composite score based on savings rate, expense ratio, and cash flow balance</p>
                {/* Gauge-style indicator */}
                <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16}}>
                  <div style={{position:"relative",width:130,height:130}}>
                    <svg viewBox="0 0 130 130" style={{width:"100%",height:"100%"}}>
                      {/* bg arc */}
                      <circle cx="65" cy="65" r="54" fill="none" stroke={dark?"#2a2a2a":"#f0efe8"} strokeWidth="10"/>
                      {/* score arc */}
                      <circle cx="65" cy="65" r="54" fill="none" stroke={healthColor} strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={`${(hScore/100)*339} 339`}
                        strokeDashoffset="0"
                        transform="rotate(-90 65 65)"
                        style={{opacity:0,animation:`fadeIn 0.5s ease 0.6s both`}}/>
                      <text x="65" y="60" textAnchor="middle" fontSize="28" fontWeight="700" fill={healthColor} fontFamily="Inter,sans-serif">{hScore}</text>
                      <text x="65" y="76" textAnchor="middle" fontSize="10" fill={muted} fontFamily="Inter,sans-serif">out of 100</text>
                    </svg>
                  </div>
                  <div style={{textAlign:"center"}}>
                    <p style={{margin:"0 0 10px",fontSize:14,fontWeight:600,color:healthColor}}>{healthLabel}</p>
                    <div style={{display:"flex",flexDirection:"column",gap:6,textAlign:"left"}}>
                      {[
                        {l:"Savings rate",v:`${insights.sr}%`,ok:parseFloat(insights.sr)>20},
                        {l:"Expense ratio",v:`${((insights.avgE/insights.avgI)*100).toFixed(0)}%`,ok:insights.avgE/insights.avgI<0.75},
                        {l:"Cash flow",v:summary.balance>0?"Positive":"Negative",ok:summary.balance>0},
                      ].map((row,i)=>(
                        <div key={i} style={{display:"flex",justifyContent:"space-between",gap:20,fontSize:11}}>
                          <span style={{color:muted}}>{row.l}</span>
                          <span style={{fontWeight:600,color:row.ok?acc:"#D85A30"}}>{row.ok?"✓":""} {row.v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Row 3: Income vs Expenses + Spending breakdown ── */}
            <div style={{display:"grid",gridTemplateColumns:"1.3fr 1.7fr",gap:14,marginBottom:14}}>
              {/* Income vs expenses */}
              <div className="card-enter fin-card" style={{padding:"22px 24px",animationDelay:"0.52s"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
                  <div>
                    <p style={{margin:0,fontSize:14,fontWeight:600,color:txt,letterSpacing:"-0.2px"}}>Income vs Expenses</p>
                    <p style={{margin:"3px 0 0",fontSize:12,color:muted}}>Monthly comparison of earnings against spending</p>
                  </div>
                </div>
                <div style={{display:"flex",gap:16,margin:"10px 0 4px"}}>
                  {[{l:"Income",c:"#1D9E75",v:summary.income},{l:"Expenses",c:"#E05A2B",v:summary.expenses}].map(x=>(
                    <span key={x.l} style={{display:"flex",alignItems:"center",gap:5,fontSize:11,color:muted}}>
                      <span style={{width:10,height:10,borderRadius:2,background:x.c,display:"inline-block",flexShrink:0}}/>
                      {x.l} <span style={{color:txt,fontWeight:600,marginLeft:2}}>{fmtShort(x.v)}</span>
                    </span>
                  ))}
                </div>
                <BarChart monthlyData={monthly} k={chartKey} dark={dark}/>
              </div>

              {/* Category breakdown */}
              <div className="card-enter fin-card" style={{padding:"22px 24px",animationDelay:"0.58s"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
                  <div>
                    <p style={{margin:0,fontSize:14,fontWeight:600,color:txt,letterSpacing:"-0.2px"}}>Spending by Category</p>
                    <p style={{margin:"3px 0 0",fontSize:12,color:muted}}>Breakdown of all expense categories — hover to explore</p>
                  </div>
                  <span style={{fontSize:11,color:muted,padding:"2px 8px",border:`1px solid ${bdr}`,borderRadius:6}}>{catSpend.length} categories</span>
                </div>
                <div style={{display:"flex",gap:20,alignItems:"flex-start"}}>
                  <div style={{flexShrink:0}}>
                    <Donut data={catSpend.slice(0,6)} k={chartKey}/>
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    {catSpend.slice(0,6).map((c,i)=>{
                      const total=catSpend.reduce((s,d)=>s+d.value,0);
                      const pct=((c.value/total)*100).toFixed(1);
                      return (
                        <div key={i} style={{marginBottom:9,opacity:0,animation:`fadeUp 0.35s ease ${0.1+i*0.07}s both`}}>
                          <div style={{display:"flex",justifyContent:"space-between",marginBottom:4,fontSize:11.5}}>
                            <span style={{display:"flex",alignItems:"center",gap:5,color:txt}}>
                              <span style={{fontSize:12}}>{CAT_ICONS[c.name]||"•"}</span>
                              <span style={{fontWeight:500}}>{c.name}</span>
                            </span>
                            <span style={{color:muted,fontFamily:"'JetBrains Mono',monospace",fontSize:11}}>{fmtShort(c.value)} <span style={{color:c.color,fontWeight:600}}>{pct}%</span></span>
                          </div>
                          <div style={{height:5,borderRadius:3,background:dark?"#2a2a2a":"#ebe9e3",overflow:"hidden"}}>
                            <div className="prog-bar" style={{height:"100%",borderRadius:3,background:c.color,width:`${pct}%`,animationDelay:`${0.15+i*0.07}s`}}/>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Row 4: Recent Transactions + Cash Flow Summary ── */}
            <div style={{display:"grid",gridTemplateColumns:"1.6fr 1fr",gap:14}}>
              {/* Recent transactions */}
              <div className="card-enter fin-card" style={{padding:"22px 24px",animationDelay:"0.64s"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                  <div>
                    <p style={{margin:0,fontSize:14,fontWeight:600,color:txt,letterSpacing:"-0.2px"}}>Recent Activity</p>
                    <p style={{margin:"3px 0 0",fontSize:12,color:muted}}>Your 6 most recent transactions across all categories</p>
                  </div>
                  <button onClick={()=>switchTab("transactions")}
                    style={{fontSize:12,color:acc,background:"transparent",border:"none",cursor:"pointer",fontWeight:500,padding:"4px 10px",borderRadius:6,transition:"background 0.15s",fontFamily:"inherit"}}
                    onMouseEnter={e=>e.currentTarget.style.background=`${acc}12`}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    View all →
                  </button>
                </div>
                <div>
                  {recentTxns.map((txn,i)=>(
                    <div key={txn.id}
                      style={{display:"flex",alignItems:"center",gap:12,padding:"9px 0",borderBottom:i<recentTxns.length-1?`1px solid ${bdr}`:"none",opacity:0,animation:`rowSlide 0.3s ease ${0.08+i*0.05}s both`,transition:"background 0.12s",borderRadius:8}}
                      onMouseEnter={e=>e.currentTarget.style.background=dark?"rgba(255,255,255,0.03)":"rgba(0,0,0,0.02)"}
                      onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                      <div style={{width:34,height:34,borderRadius:9,background:`${CAT_COLORS[txn.category]||"#888"}15`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,flexShrink:0}}>
                        {CAT_ICONS[txn.category]||"•"}
                      </div>
                      <div style={{flex:1,minWidth:0}}>
                        <p style={{margin:"0 0 1px",fontSize:13,fontWeight:500,color:txt,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{txn.description}</p>
                        <p style={{margin:0,fontSize:11,color:muted}}>{txn.date} <span style={{padding:"1px 6px",borderRadius:4,background:`${CAT_COLORS[txn.category]}18`,color:CAT_COLORS[txn.category]||muted,fontSize:10,fontWeight:600,marginLeft:4}}>{txn.category}</span></p>
                      </div>
                      <div style={{textAlign:"right",flexShrink:0}}>
                        <p style={{margin:0,fontSize:13,fontWeight:700,color:txn.amount>0?acc:"#D85A30",fontFamily:"'JetBrains Mono',monospace"}}>
                          {txn.amount>0?"+":"-"}{fmtShort(txn.amount)}
                        </p>
                        <p style={{margin:"1px 0 0",fontSize:10,color:muted,fontWeight:500}}>{txn.type}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cash flow + month summary */}
              <div style={{display:"flex",flexDirection:"column",gap:14}}>
                {/* Cash flow breakdown */}
                <div className="card-enter fin-card" style={{padding:"22px 24px",animationDelay:"0.7s",flex:1}}>
                  <p style={{margin:"0 0 3px",fontSize:14,fontWeight:600,color:txt,letterSpacing:"-0.2px"}}>Cash Flow Summary</p>
                  <p style={{margin:"0 0 16px",fontSize:12,color:muted}}>Cumulative income and spending breakdown across the tracked period</p>
                  {[
                    {label:"Gross Income",  val:summary.income,   col:acc,    note:`${summary.txCount} total transactions`},
                    {label:"Total Spent",   val:summary.expenses, col:"#D85A30", note:`${catSpend.length} categories`},
                    {label:"Net Position",  val:summary.balance,  col:summary.balance>=0?acc:"#D85A30", note:summary.balance>=0?"Surplus retained":"Deficit"},
                  ].map((row,i)=>(
                    <div key={i} style={{marginBottom:i<2?14:0}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:5}}>
                        <div>
                          <span style={{fontSize:12,fontWeight:500,color:txt}}>{row.label}</span>
                          <span style={{fontSize:10,color:muted,marginLeft:6}}>{row.note}</span>
                        </div>
                        <span style={{fontSize:13,fontWeight:700,color:row.col,fontFamily:"'JetBrains Mono',monospace"}}>
                          {row.val>=0?"+":"-"}{fmtShort(row.val)}
                        </span>
                      </div>
                      {i < 2 && (
                        <div style={{height:4,borderRadius:2,background:dark?"#2a2a2a":"#ebe9e3",overflow:"hidden"}}>
                          <div className="prog-bar"
                            style={{height:"100%",borderRadius:2,background:row.col,
                              width:`${Math.min((row.val/Math.max(summary.income,summary.expenses))*100,100)}%`,
                              animationDelay:`${0.3+i*0.15}s`}}/>
                        </div>
                      )}
                      {i === 2 && <div style={{height:1,background:bdr,margin:"8px 0 0"}}/>}
                    </div>
                  ))}
                </div>

                {/* Latest month highlights */}
                {monthly.length > 0 && (() => {
                  const last = monthly[monthly.length-1];
                  const sr = last.income>0 ? ((last.income-last.expenses)/last.income*100).toFixed(1) : "0";
                  return (
                    <div className="card-enter fin-card" style={{padding:"18px 20px",animationDelay:"0.76s",background:dark?"#1C2A24":"#F0FAF6",border:`1px solid ${dark?"rgba(29,158,117,0.2)":"rgba(29,158,117,0.15)"}`}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                        <p style={{margin:0,fontSize:12,fontWeight:600,color:acc}}>Latest Month — {last.month} {last.year}</p>
                        <span style={{fontSize:10,padding:"2px 7px",borderRadius:12,background:`${acc}20`,color:acc,fontWeight:600}}>Current</span>
                      </div>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                        {[
                          {l:"Income",  v:`+${fmtShort(last.income)}`,   c:acc},
                          {l:"Spent",   v:`-${fmtShort(last.expenses)}`, c:"#D85A30"},
                          {l:"Saved",   v:`${last.balance>=0?"+":"-"}${fmtShort(last.balance)}`, c:last.balance>=0?acc:"#D85A30"},
                          {l:"Rate",    v:`${sr}%`,                       c:parseFloat(sr)>20?acc:"#BA7517"},
                        ].map((s,i)=>(
                          <div key={i} style={{padding:"8px 10px",background:dark?"rgba(255,255,255,0.04)":"rgba(255,255,255,0.6)",borderRadius:8,border:`1px solid ${dark?"rgba(29,158,117,0.12)":"rgba(29,158,117,0.1)"}`}}>
                            <p style={{margin:"0 0 2px",fontSize:10,color:muted,textTransform:"uppercase",letterSpacing:"0.4px",fontWeight:500}}>{s.l}</p>
                            <p style={{margin:0,fontSize:13,fontWeight:700,color:s.c,fontFamily:"'JetBrains Mono',monospace"}}>{s.v}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        )}

        {/* ════════════════ TRANSACTIONS ════════════════ */}
        {activeTab==="transactions"&&(
          <div key={`t-${tabKey}`} className="tab-content">
            <div style={{background:card,borderRadius:14,border:`1px solid ${bdr}`,padding:"14px 16px",marginBottom:14,display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}}>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search transactions…"
                style={{flex:1,minWidth:160,padding:"7px 12px",borderRadius:8,border:`1px solid ${bdr}`,background:bg,color:txt,fontSize:13,outline:"none",transition:"border-color 0.2s,box-shadow 0.2s",fontFamily:"inherit"}}
                onFocus={e=>{e.target.style.borderColor=acc;e.target.style.boxShadow=`0 0 0 3px ${acc}20`;}}
                onBlur={e=>{e.target.style.borderColor=bdr;e.target.style.boxShadow="none";}}/>
              {[
                {val:filterType,set:setFilterType,opts:[["all","All Types"],["income","Income"],["expense","Expense"]]},
                {val:filterCat, set:setFilterCat, opts:[["all","All Categories"],...cats.map(c=>[c,c])]},
                {val:sortBy,    set:setSortBy,    opts:[["date_desc","Newest First"],["date_asc","Oldest First"],["amount_desc","Highest Amount"],["amount_asc","Lowest Amount"]]},
              ].map((s,i)=>(
                <select key={i} value={s.val} onChange={e=>s.set(e.target.value)}
                  style={{padding:"7px 12px",borderRadius:8,border:`1px solid ${bdr}`,background:bg,color:txt,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>
                  {s.opts.map(([v,l])=><option key={v} value={v}>{l}</option>)}
                </select>
              ))}
              <span style={{fontSize:12,color:muted,whiteSpace:"nowrap"}}>{filtered.length} results</span>
            </div>
            {filtered.length===0?(
              <div style={{textAlign:"center",padding:"60px 20px",background:card,borderRadius:14,border:`1px solid ${bdr}`,animation:"scaleIn 0.3s ease both"}}>
                <div style={{fontSize:40,marginBottom:12}}>🔍</div>
                <p style={{fontWeight:600,margin:0,color:txt}}>No transactions found</p>
                <p style={{fontSize:13,color:muted,margin:"4px 0 0"}}>Try adjusting your filters or search query.</p>
              </div>
            ):(
              <div style={{background:card,borderRadius:14,border:`1px solid ${bdr}`,overflow:"hidden"}}>
                <div style={{display:"grid",gridTemplateColumns:"100px 1fr 120px 100px 130px",padding:"10px 16px",borderBottom:`1px solid ${bdr}`,fontSize:11,color:muted,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.5px"}}>
                  <span>Date</span><span>Description</span><span>Category</span><span>Type</span><span style={{textAlign:"right"}}>Amount</span>
                </div>
                {filtered.map((txn,i)=>(
                  <div key={txn.id} className="row-enter"
                    style={{display:"grid",gridTemplateColumns:"100px 1fr 120px 100px 130px",padding:"12px 16px",
                      borderBottom:i<filtered.length-1?`1px solid ${bdr}`:"none",alignItems:"center",
                      transition:"background 0.13s",animationDelay:`${Math.min(i*0.025,0.35)}s`}}
                    onMouseEnter={e=>e.currentTarget.style.background=dark?"rgba(255,255,255,0.03)":"rgba(0,0,0,0.02)"}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <span style={{fontSize:12,color:muted,fontFamily:"'JetBrains Mono',monospace"}}>{txn.date.slice(5)}</span>
                    <span style={{fontSize:13,fontWeight:500,color:txt}}>{txn.description}</span>
                    <span>
                      <span style={{padding:"2px 8px",borderRadius:6,fontSize:11,fontWeight:600,background:`${CAT_COLORS[txn.category]||"#888"}18`,color:CAT_COLORS[txn.category]||"#888"}}>
                        {CAT_ICONS[txn.category]||""} {txn.category}
                      </span>
                    </span>
                    <span>
                      <span style={{padding:"2px 8px",borderRadius:6,fontSize:11,fontWeight:600,background:txn.type==="income"?"#1D9E7518":"#D85A3018",color:txn.type==="income"?"#0F6E56":"#993C1D"}}>
                        {txn.type}
                      </span>
                    </span>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"flex-end",gap:8}}>
                      <span style={{fontSize:13,fontWeight:700,color:txn.amount>0?acc:"#D85A30",fontFamily:"'JetBrains Mono',monospace"}}>
                        {txn.amount>0?"+":"-"}{fmt(txn.amount)}
                      </span>
                      {role==="admin"&&(
                        <div style={{display:"flex",gap:4}}>
                          {[{ic:"✎",cb:()=>setEditTxn({...txn,amount:Math.abs(txn.amount).toString()}),c:muted,b:`1px solid ${bdr}`},
                            {ic:"✕",cb:()=>del(txn.id),c:"#D85A30",b:"1px solid #D85A3030"}].map((b,bi)=>(
                            <button key={bi} onClick={b.cb}
                              style={{width:26,height:26,borderRadius:6,border:b.b,background:"transparent",cursor:"pointer",fontSize:11,color:b.c,display:"flex",alignItems:"center",justifyContent:"center",transition:"transform 0.15s,background 0.15s"}}
                              onMouseEnter={e=>{e.currentTarget.style.transform="scale(1.18)";e.currentTarget.style.background=dark?"#333":"#f0efe8";}}
                              onMouseLeave={e=>{e.currentTarget.style.transform="scale(1)";e.currentTarget.style.background="transparent";}}>
                              {b.ic}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ════════════════ INSIGHTS ════════════════ */}
        {activeTab==="insights"&&(
          <div key={`i-${tabKey}`} className="tab-content">
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
              {[
                {head:"Top Spending Category", body:insights.topCat&&(
                  <><p style={{margin:"8px 0 4px",fontSize:28,fontWeight:700,color:CAT_COLORS[insights.topCat.name]||acc}}>{insights.topCat.name}</p>
                  <p style={{margin:0,fontSize:14,color:muted}}>Total: <span style={{color:txt,fontWeight:600}}>{fmt(insights.topCat.value)}</span></p>
                  <p style={{margin:"4px 0 0",fontSize:12,color:muted}}>across all months tracked</p></>
                )},
                {head:"Avg Monthly Savings Rate", body:(
                  <><p style={{margin:"8px 0 4px",fontSize:28,fontWeight:700,color:parseFloat(insights.sr)>30?acc:"#BA7517"}}>{insights.sr}%</p>
                  <p style={{margin:0,fontSize:13,color:muted}}>Avg income: <span style={{color:txt}}>{fmt(insights.avgI)}</span></p>
                  <p style={{margin:"2px 0 0",fontSize:13,color:muted}}>Avg expenses: <span style={{color:txt}}>{fmt(insights.avgE)}</span></p></>
                )},
                {head:"Month-over-Month Expenses", body:insights.mChg!==null?(
                  <><p style={{margin:"8px 0 4px",fontSize:28,fontWeight:700,color:parseFloat(insights.mChg)<0?acc:"#D85A30"}}>
                    {insights.mChg>0?"+":""}{insights.mChg}%</p>
                  <p style={{margin:0,fontSize:13,color:muted}}>{parseFloat(insights.mChg)<0?"📉 Spending decreased — great work!":"📈 Spending increased vs last month"}</p></>
                ):<p style={{color:muted,fontSize:13}}>Not enough data</p>},
                {head:"Largest Expense", body:(()=>{
                  const top=transactions.filter(t=>t.type==="expense").sort((a,b)=>a.amount-b.amount)[0];
                  return top&&(<><p style={{margin:"8px 0 2px",fontSize:20,fontWeight:700,color:"#D85A30"}}>{fmt(top.amount)}</p>
                  <p style={{margin:0,fontSize:13,fontWeight:500,color:txt}}>{top.description}</p>
                  <p style={{margin:"2px 0 0",fontSize:12,color:muted}}>{top.date} · {top.category}</p></>);
                })()},
              ].map((item,i)=>(
                <div key={i} className="card-enter fin-card"
                  style={{padding:"20px",animationDelay:`${i*0.1}s`,cursor:"default"}}>
                  <p style={{margin:"0 0 4px",fontSize:11,color:muted,textTransform:"uppercase",letterSpacing:"0.5px",fontWeight:600}}>{item.head}</p>
                  {item.body}
                </div>
              ))}
            </div>
            <div className="card-enter fin-card" style={{padding:"20px 24px",animationDelay:"0.45s"}}>
              <p style={{margin:"0 0 14px",fontSize:14,fontWeight:600,color:txt}}>Monthly Summary</p>
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
                  <thead>
                    <tr style={{borderBottom:`1px solid ${bdr}`}}>
                      {["Month","Income","Expenses","Net Savings","Savings Rate"].map(h=>(
                        <th key={h} style={{textAlign:h==="Month"?"left":"right",padding:"6px 12px",fontSize:11,color:muted,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.4px"}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {monthly.map((d,i)=>{
                      const rate=d.income>0?((d.income-d.expenses)/d.income*100).toFixed(1):"0";
                      return (
                        <tr key={i} style={{borderBottom:`1px solid ${bdr}`,transition:"background 0.13s",opacity:0,animation:`fadeUp 0.3s ease ${0.05*i}s both`}}
                          onMouseEnter={e=>e.currentTarget.style.background=dark?"rgba(255,255,255,0.03)":"rgba(0,0,0,0.02)"}
                          onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                          <td style={{padding:"9px 12px",fontWeight:500,color:txt}}>{d.month} {d.year}</td>
                          <td style={{padding:"9px 12px",textAlign:"right",color:"#0F6E56",fontFamily:"'JetBrains Mono',monospace"}}>+{fmt(d.income)}</td>
                          <td style={{padding:"9px 12px",textAlign:"right",color:"#993C1D",fontFamily:"'JetBrains Mono',monospace"}}>-{fmt(d.expenses)}</td>
                          <td style={{padding:"9px 12px",textAlign:"right",color:d.balance>=0?acc:"#D85A30",fontWeight:600,fontFamily:"'JetBrains Mono',monospace"}}>{d.balance>=0?"+":"-"}{fmt(d.balance)}</td>
                          <td style={{padding:"9px 12px",textAlign:"right"}}>
                            <span style={{padding:"2px 8px",borderRadius:6,fontSize:11,fontWeight:600,background:parseFloat(rate)>20?"#1D9E7518":"#D85A3018",color:parseFloat(rate)>20?"#0F6E56":"#993C1D"}}>{rate}%</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {showAdd&&<Modal {...sharedModal} data={newTxn} onChange={(f,v)=>setNewTxn(p=>({...p,[f]:v}))} title="Add Transaction" onClose={()=>setShowAdd(false)} onSubmit={addTxn} label="Add Transaction"/>}
      {editTxn&&<Modal {...sharedModal} data={editTxn} onChange={(f,v)=>setEditTxn(p=>({...p,[f]:v}))} title="Edit Transaction" onClose={()=>setEditTxn(null)} onSubmit={saveEdit} label="Save Changes"/>}
    </div>
  );
}
