export const VERSION = 2;
export const MAX = 1_000_000_000_000;
const exactHalf=n=>Number.isSafeInteger(n*2);
export const formatMoney=n=>new Intl.NumberFormat('vi-VN',{maximumFractionDigits:1}).format(n)+' đ';
export function moneyInput(value) {
  let s = String(value).trim().toLowerCase().replace(/\s|₫|đ/g, '');
  if (!s) return NaN;
  let n;
  if (s.endsWith('k')) {
    s = s.slice(0, -1).replace(',', '.');
    if (!/^\d+(\.\d{1,3})?$/.test(s)) return NaN;
    const [whole,fraction='']=s.split('.');
    n = Number(whole)*1000 + Number(fraction.padEnd(3,'0'));
  } else {
    if (!/^\d+$/.test(s) && !/^\d{1,3}([.,]\d{3})+$/.test(s)) return NaN;
    n = Number(s.replace(/[.,]/g, ''));
  }
  return Number.isSafeInteger(n) && n >= 0 && n <= MAX ? n : NaN;
}
export function shares(amount, split, custom = 0) {
  if (!Number.isSafeInteger(amount) || amount < 0 || amount > MAX) throw Error('Số tiền không hợp lệ');
  const a = split === 'half' ? amount / 2 : split === 'a' ? amount : split === 'b' ? 0 : amount - custom;
  const b = amount - a;
  if (!['half','a','b','custom'].includes(split) || !exactHalf(b) || b < 0 || b > amount) throw Error('Phần chia phải nằm trong tổng số tiền');
  return {a, b};
}
// Historical settlements retain the amount actually settled under the old rule.
export function entryShares(e) {
  if(e.splitPrecision==='legacy'&&e.settlementId&&e.split==='half') return {a:Math.ceil(e.amount/2),b:Math.floor(e.amount/2)};
  return shares(e.amount,e.split,e.custom);
}
function legacyDebt(e) {
  if(e.kind==='opening')return e.balance;
  const p=e.split==='half'?{a:Math.ceil(e.amount/2),b:Math.floor(e.amount/2)}:shares(e.amount,e.split,e.custom);
  return (e.payer==='a'?p.b:-p.a)||0;
}
// Positive balance: B owes A. Integer inputs divided by two produce exact binary halves.
export function debt(e) {
  if (e.kind === 'opening') return e.balance;
  const part = entryShares(e);
  return (e.payer === 'a' ? part.b : -part.a) || 0;
}
export function totals(entries) {
  return entries.reduce((s,e) => {
    s.net += debt(e);
    if (e.kind !== 'opening') {
      const p = entryShares(e);
      s.total += e.amount; s.paid[e.payer] += e.amount;
      s.share.a += p.a; s.share.b += p.b;
      s.categories[e.category] = (s.categories[e.category] || 0) + e.amount;
    }
    if([s.total,s.net,s.paid.a,s.paid.b,s.share.a,s.share.b,...Object.values(s.categories)].some(n=>!exactHalf(n))) throw Error('Tổng tiền vượt giới hạn tính chính xác của app.');
    return s;
  }, {total:0,net:0,paid:{a:0,b:0},share:{a:0,b:0},categories:{}});
}
export function outstanding(entries) { return entries.filter(e=>!e.settlementId); }
export function monthOf(e) { return e.date.slice(0,7); }
export function selectRange(entries, from, to) { return entries.filter(e=>monthOf(e)>=from && monthOf(e)<=to); }
export function closePeriod(db, ids, id, at, label) {
  const chosen = db.expenses.filter(e=>ids.includes(e.id));
  if (!chosen.length || chosen.some(e=>e.settlementId)) throw Error('Kỳ này đã được chốt hoặc không có khoản chi');
  const net = totals(chosen).net;
  const settlement = {id,at,label,net,entryIds:chosen.map(e=>e.id),names:{...db.names}};
  return {...db, expenses:db.expenses.map(e=>ids.includes(e.id)?{...e,settlementId:id}:e), settlements:[settlement,...db.settlements]};
}
export function undoPeriod(db,id) {
  return {...db,expenses:db.expenses.map(e=>{if(e.settlementId!==id)return e;const {splitPrecision,...row}=e;return {...row,settlementId:null};}),settlements:db.settlements.filter(s=>s.id!==id)};
}
export function freshDB() { return {version:VERSION,names:{a:'Nhi',b:'Quyên'},categories:['Ăn uống','Đi chợ','Nhà cửa','Di chuyển','Mua sắm','Khác'],fixedCategories:['Thẻ tín dụng','Khoản vay','Tiền nhà','Gia đình','Khác'],expenses:[],settlements:[],templates:[],fixed:[],updatedAt:null}; }
export function dateValid(s) {
  if (typeof s!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const d=new Date(s+'T12:00:00Z'); return !isNaN(d)&&d.toISOString().slice(0,10)===s;
}
export function validateDB(d) {
  const fail=()=>{throw Error('File backup không đúng định dạng Bunny Pocket hoặc dữ liệu không hợp lệ.');};
  const str=(s,n=100)=>typeof s==='string'&&s.trim().length>0&&s.length<=n;
  const integer=n=>Number.isSafeInteger(n)&&n>=0&&n<=MAX;
  if (!d||![1,VERSION].includes(d.version)||!d.names||!str(d.names.a,30)||!str(d.names.b,30)) fail();
  for (const key of ['categories','fixedCategories']) if (!Array.isArray(d[key])||!d[key].length||d[key].length>100||d[key].some(x=>!str(x))) fail();
  for (const key of ['expenses','settlements','templates','fixed']) if(!Array.isArray(d[key])||d[key].length>100000) fail();
  for(const key of ['expenses','settlements','templates','fixed']) if(new Set(d[key].map(e=>e.id)).size!==d[key].length) fail();
  for (const e of d.expenses) {
    if(!str(e.id)||!str(e.description,200)||!dateValid(e.date)) fail();
    if(e.kind==='opening'){if(!Number.isSafeInteger(e.balance)||Math.abs(e.balance)>MAX) fail();}
    else {if(!integer(e.amount)||!['a','b'].includes(e.payer)||!str(e.category)) fail(); try{shares(e.amount,e.split,e.custom);}catch{fail();}}
    if(e.splitPrecision!==undefined&&(e.splitPrecision!=='legacy'||!e.settlementId||e.split!=='half')) fail();
    if(e.settlementId&&!d.settlements.some(s=>s.id===e.settlementId&&s.entryIds.includes(e.id))) fail();
  }
  for(const s of d.settlements) {
    if(!str(s.id)||!str(s.at)||!str(s.label,200)||!exactHalf(s.net)||!Array.isArray(s.entryIds)||!s.entryIds.length) fail();
    const rows=d.expenses.filter(e=>s.entryIds.includes(e.id));
    const expected=d.version===1?rows.reduce((sum,e)=>sum+legacyDebt(e),0):totals(rows).net;
    if(new Set(s.entryIds).size!==s.entryIds.length||rows.length!==s.entryIds.length||rows.some(e=>e.settlementId!==s.id)||expected!==s.net) fail();
    if(!s.names||!str(s.names.a,30)||!str(s.names.b,30)) fail();
  }
  for(const t of d.templates) if(!str(t.id)||!str(t.name,100)||!str(t.category)||!integer(t.amount)||!Number.isInteger(t.day)||t.day<1||t.day>31) fail();
  for(const f of d.fixed) if(!str(f.id)||!str(f.name,100)||!str(f.category)||!integer(f.amount)||!dateValid(f.due)||typeof f.paid!=='boolean'||(f.paid&&!dateValid(f.paidDate))) fail();
  totals(d.expenses);
  return d;
}
export function migrateDB(data) {
  validateDB(data);
  if(data.version===VERSION)return data;
  const next=structuredClone(data);
  next.version=VERSION;
  for(const e of next.expenses)if(e.settlementId&&e.split==='half')e.splitPrecision='legacy';
  return validateDB(next);
}
export function dueDate(month,day) {
  const [y,m]=month.split('-').map(Number); return `${month}-${String(Math.min(day,new Date(y,m,0).getDate())).padStart(2,'0')}`;
}
export function generateFixed(db,month,makeId) {
  const added=db.templates.filter(t=>!db.fixed.some(f=>f.templateId===t.id&&f.due.slice(0,7)===month)).map(t=>({id:makeId(),templateId:t.id,name:t.name,category:t.category,amount:t.amount,due:dueDate(month,t.day),paid:false,paidDate:null}));
  return {...db,fixed:[...db.fixed,...added]};
}
export function csvCell(v){ const s=String(v??''); return '"'+(/^[\s]*[=+@\-\t\r]/.test(s)?"'"+s:s).replaceAll('"','""')+'"'; }
