(() => {
'use strict';
const el=id=>document.getElementById(id), val=id=>Number(el(id).value), won=n=>Math.round(n).toLocaleString('ko-KR')+'원';
let latest=null;
const required=['v3area','v3cut','v3bends','v3mat','v3cutrate','v3bendrate'];
function calculate(){
 for(const id of required)if(el(id).value.trim()==='')throw Error('전개 면적·절단 길이·절곡 횟수·자재/절단/절곡 단가를 모두 입력하세요.');
 const area=val('v3area'),cut=val('v3cut'),bends=val('v3bends'),yr=val('v3yield')/100,mat=val('v3mat'),cutrate=val('v3cutrate'),bendrate=val('v3bendrate'),setup=val('v3setup'),oh=val('v3overhead')/100,margin=val('v3margin')/100;
 if([area,cut,bends,yr,mat,cutrate,bendrate,setup,oh,margin].some(x=>!Number.isFinite(x)||x<0)||area<=0||yr<=0||yr>1||margin>=1||!Number.isInteger(bends))throw Error('입력값을 확인하세요. 면적·이용률은 양수, 절곡 횟수는 정수, 이익률은 100% 미만이어야 합니다.');
 const kg=area*2*7930/1e9,material=kg/yr*mat,cutting=cut*cutrate,bending=bends*bendrate,direct=material+cutting+bending+setup,totalCost=direct*(1+oh),sales=totalCost/(1-margin);
 return {kg,material,cutting,bending,setup,totalCost,sales,area,cut,bends,yr,mat,cutrate,bendrate,oh,margin,qty:1,kind:'plate',name:'도면1 SUS304 2T 절곡 케이스',materialName:'SUS304 2T'};
}
function show(r){el('v3result').textContent=`도면1 · SUS304 2T · 204(W) × 547(H) × 622(D) mm · 1EA\n전개 소재 중량: ${r.kg.toFixed(3)} kg (소재 이용률 별도)\n자재비: ${won(r.material)}\n레이저 절단비: ${won(r.cutting)}\n절곡비: ${won(r.bending)} (${r.bends}회)\n준비비: ${won(r.setup)}\n간접비 포함 총원가: ${won(r.totalCost)}\n견적가(부가세 제외): ${won(r.sales)}\n※ 전개/공정 입력값은 사용자 검증값입니다. 자동 산출된 절단·절곡 데이터가 아닙니다.`;}
function run(){latest=calculate();show(latest);return latest}
el('v3calculate').onclick=()=>{try{run()}catch(e){latest=null;el('v3result').textContent='계산 불가: '+e.message}};
el('v3applyPrices').onclick=()=>{const prices=(typeof db!=='undefined'&&Array.isArray(db.prices))?db.prices:[];let used=[];for(const [cat,unit,id] of [['material','kg','v3mat'],['cutting','m','v3cutrate'],['bending','ea','v3bendrate']]){const options=prices.filter(p=>p.category===cat&&p.unit.toLowerCase()===unit);if(cat==='material'){const exact=options.find(p=>/SUS\s*304/i.test(p.name+' '+p.external_code));if(exact){el(id).value=exact.unit_price;used.push(exact.name)}else continue}else if(options.length===1){el(id).value=options[0].unit_price;used.push(options[0].name)}else continue}alert(used.length?`적용 단가: ${used.join(', ')}. 나머지는 직접 입력하세요.`:'매칭되는 단가가 없습니다. 블루시스템 CSV의 category/unit과 SUS304 재질명을 확인하세요.');};
el('v3save').onclick=()=>{try{const r=run();const inputs=Object.fromEntries(['v3area','v3cut','v3bends','v3yield','v3mat','v3cutrate','v3bendrate','v3setup','v3overhead','v3margin'].map(id=>[id,el(id).value]));const id=(typeof crypto!=='undefined'&&crypto.randomUUID)?crypto.randomUUID():String(Date.now());const record={...r,id,savedAt:new Date().toISOString(),inputs:{},v3Inputs:inputs,sourceDrawing:'도면1.dxf',revision:'V3',pricingSnapshot:{...inputs}};db.quotes.unshift(record);persist();renderHistory();alert('V3 견적을 브라우저 이력에 저장했습니다. JSON 백업을 권장합니다.')}catch(e){alert(e.message)}};
el('v3export').onclick=()=>{try{const r=run(),rows=[['항목','금액/값'],['도면','도면1.dxf'],['재질','SUS304 2T'],['가로(mm)',204],['높이(mm)',547],['깊이(mm)',622],['수량',1],['전개면적(mm2)',r.area],['절단길이(m)',r.cut],['절곡횟수',r.bends],['중량(kg)',r.kg],['자재비',r.material],['절단비',r.cutting],['절곡비',r.bending],['준비비',r.setup],['총원가',r.totalCost],['견적가(VAT별도)',r.sales]];const csv='﻿'+rows.map(row=>row.map(x=>'"'+String(x).replace(/"/g,'""')+'"').join(',')).join('\r\n');download('drawing1-v3-quote.csv',csv,'text/csv;charset=utf-8')}catch(e){alert(e.message)}};
})();