import {test} from 'node:test';
import assert from 'node:assert/strict';
import {moneyInput,shares,debt,totals,outstanding,selectRange,closePeriod,undoPeriod,freshDB,validateDB,generateFixed,dueDate,csvCell} from '../docs/core.js';
const row=(id,amount,payer='a',split='half',date='2026-05-01',custom=0)=>({id,description:'Test '+id,amount,payer,split,date,custom,category:'Đi chợ',settlementId:null});
test('Input accepts integer VND, k, decimal k and grouped amounts; rejects ambiguous or invalid input',()=>{
 for(const [s,n] of [['165700',165700],['165k',165000],['165.7k',165700],['165,7k',165700],['1.234.567',1234567],['1,234,567',1234567],['0',0]])assert.equal(moneyInput(s),n);
 for(const s of ['','-5','1e6','165.7','hello','1.2345k','Infinity','1,23,456'])assert.ok(Number.isNaN(moneyInput(s)),s);
});
test('All split modes conserve every dong and custom B share is exact',()=>{
 assert.deepEqual(shares(50465,'half'),{a:25233,b:25232});
 assert.equal(debt(row('x',155000,'a','custom','2026-05-01',58000)),58000);
 assert.equal(debt(row('x',155000,'b','custom','2026-05-01',58000)),-97000);
 assert.equal(debt(row('x',100,'a','a')),0);
 assert.equal(debt(row('x',100,'b','a')),-100);
 assert.equal(debt(row('x',100,'a','b')),100);
 assert.equal(debt(row('x',100,'b','b')),0);
 assert.throws(()=>shares(100,'custom',101));assert.throws(()=>shares(100,'custom',-1));
 for(let n=0;n<1000;n++){let s=shares(n,'half');assert.equal(s.a+s.b,n);}
});
test('Carry over across months, opening reverse debt and offset payments',()=>{
 const d=freshDB();d.expenses=[row('1',600000),row('2',200000,'b','half','2026-06-01'),row('3',150000,'a','a'),{id:'4',kind:'opening',description:'Opening',date:'2026-04-01',balance:-25000}];
 const s=totals(d.expenses);assert.equal(s.net,175000);assert.equal(s.total,950000);assert.equal(s.share.a,550000);assert.equal(s.share.b,400000);assert.equal(s.paid.a,750000);
 assert.equal(totals(selectRange(d.expenses,'2026-05','2026-06')).net,200000);
});
test('Settlement closes only selected pending rows, preserves report, new expense starts a new balance, undo restores',()=>{
 let d=freshDB();d.expenses=[row('1',600000),row('2',200000,'b','half','2026-06-01'),row('3',100000,'a','half','2026-07-01')];
 d=closePeriod(d,['1','2'],'s1','2026-06-30T00:00:00Z','May + Jun');assert.equal(totals(outstanding(d.expenses)).net,50000);assert.equal(d.settlements[0].net,200000);assert.equal(totals(d.expenses).total,900000);validateDB(d);
 assert.throws(()=>closePeriod(d,['1'],'s2','x','x'));
 d=closePeriod(d,['3'],'s2','2026-07-31T00:00:00Z','Jul');assert.equal(totals(outstanding(d.expenses)).net,0);
 d.expenses.push(row('4',155000,'a','custom','2026-08-01',58000));assert.equal(totals(outstanding(d.expenses)).net,58000);
 d=undoPeriod(d,'s1');assert.equal(totals(outstanding(d.expenses)).net,258000);assert.equal(d.expenses.find(e=>e.id==='3').settlementId,'s2');validateDB(d);
});
test('Zero net and reverse net can be closed',()=>{
 let d=freshDB();d.expenses=[row('a',100),row('b',100,'b')];d=closePeriod(d,['a','b'],'s','now','balanced');assert.equal(d.settlements[0].net,0);validateDB(d);
 let b=freshDB();b.expenses=[row('x',100,'b')];b=closePeriod(b,['x'],'s','now','reverse');assert.equal(b.settlements[0].net,-50);validateDB(b);
});
test('Fixed templates generate once per month; month end clamped; existing amounts/payment status preserved',()=>{
 assert.equal(dueDate('2026-02',31),'2026-02-28');assert.equal(dueDate('2028-02',31),'2028-02-29');
 let d=freshDB();d.templates=[{id:'t',name:'HSBC',category:'Thẻ tín dụng',amount:2500000,day:31}];let i=0;
 d=generateFixed(d,'2026-02',()=>String(++i));assert.equal(d.fixed[0].due,'2026-02-28');d.fixed[0].paid=true;d.fixed[0].paidDate='2026-02-27';d.templates[0].amount=2700000;
 d=generateFixed(d,'2026-02',()=>String(++i));assert.equal(d.fixed.length,1);assert.equal(d.fixed[0].amount,2500000);assert.equal(d.fixed[0].paid,true);
 d=generateFixed(d,'2026-03',()=>String(++i));assert.equal(d.fixed.length,2);assert.equal(d.fixed[1].amount,2700000);assert.equal(totals(d.expenses).net,0);validateDB(d);
});
test('Backup roundtrip includes settled rows; rejects invalid references and corrupt data',()=>{
 let d=freshDB();d.expenses=[row('x',150001)];d=closePeriod(d,['x'],'s','now','May');assert.deepEqual(validateDB(JSON.parse(JSON.stringify(d))),d);
 let c=structuredClone(d);c.expenses[0].amount=1;assert.throws(()=>validateDB(c));c=structuredClone(d);c.expenses[0].settlementId='missing';assert.throws(()=>validateDB(c));
 for(const c of [null,{}, {...freshDB(),version:99}, {...freshDB(),expenses:[row('x',-1)]}, {...freshDB(),expenses:[row('x',1),row('x',2)]}])assert.throws(()=>validateDB(c));
});
test('CSV quotes delimiters and escapes spreadsheet formulas',()=>{assert.equal(csvCell('a,"b"'),'"a,""b"""');assert.equal(csvCell('=SUM(A1)'), '"\'=SUM(A1)"');assert.equal(csvCell('@evil'),'"\'@evil"');});
