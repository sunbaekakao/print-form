(function(){
var __st=document.createElement('style');
__st.textContent=".po-lbl{font-size:13px;font-weight:500;color:var(--text-primary);margin-bottom:8px}\n.po-block{background:var(--surface-2);border:0.5px solid var(--border);border-radius:18px;padding:18px;display:flex;flex-direction:column;gap:16px}\n.po-cta{background:var(--fill-accent);color:var(--on-accent);border:none;border-radius:12px;padding:14px;font-weight:500;font-size:16px;cursor:pointer;width:100%}\n.po-cta:hover{background:var(--fill-accent-hover)}\n.po-addbtn{width:100%;border:none;background:var(--surface-1);border-radius:12px;padding:14px;color:var(--text-secondary);cursor:pointer;font-size:14px;font-weight:500}\n.po-addbtn:hover{background:var(--fill-control-hover)}\n.po-num{width:82px;text-align:center}\n.po-unit{font-size:13px;color:var(--text-muted);white-space:nowrap}\n.po-ghost{background:none;border:none;color:var(--text-secondary);font-size:13px;cursor:pointer;padding:2px 0}";
document.head.appendChild(__st);
var __root=document.getElementById('po-root');
__root.innerHTML="<h2 class=\"sr-only\">인쇄물 주문 폼: 품목과 지점을 고르고 수량을 넣어 주문합니다</h2>\n<div style=\"padding:1rem 0; display:flex; flex-direction:column; gap:16px\">\n  <div>\n    <div style=\"font-size:20px;font-weight:500\">무엇을 주문할까요?</div>\n    <div style=\"font-size:14px;color:var(--text-secondary);margin-top:2px\">품목과 지점을 고르고 수량만 넣으면 돼요</div>\n  </div>\n  <div id=\"po-blocks\" style=\"display:flex; flex-direction:column; gap:12px\"></div>\n  <button type=\"button\" id=\"po-add\" class=\"po-addbtn\"><i class=\"ti ti-plus\" aria-hidden=\"true\"></i> 품목 추가</button>\n  <div style=\"display:flex; flex-direction:column; gap:12px; margin-top:4px\">\n    <div><div class=\"po-lbl\">요청자</div><input id=\"po-name\" type=\"text\" placeholder=\"이름 (선택)\" style=\"width:100%\"></div>\n    <div id=\"po-warn\" style=\"color:var(--text-danger); font-size:13px\"></div>\n    <div style=\"font-size:13px; color:var(--text-secondary); text-align:center\" id=\"po-count\">아직 담긴 주문이 없어요</div>\n    <button type=\"button\" id=\"po-submit\" class=\"po-cta\">주문 요청하기</button>\n  </div>\n</div>";

(function(){
 var NL=String.fromCharCode(10);
 var PUM=["등록신청서","전단지","생활규칙표","생활시간표","사감 메세지카드","냉장고 스티커","경고 스티커","사감패드 순찰안내"];
 var APRINT=["등록신청서","전단지","생활규칙표","생활시간표"];
 var JI=["대치","강남","송파","강동","하남","신촌","분당","김포","동탄","센텀","수성","본사"];
 var CH=["당일","1영업일","2영업일","3영업일","5영업일"];
 var CHN=[0,1,2,3,5];
 var CARDS=["자유기술","마스크착용","음식물","자유벌점","베개사용","전자기기","친목금지","소음발생1회차","소음발생2회차","중간입실","통로물건","휴대폰제출","향냄새","자리비움","졸음주의"];
 var WD=["일","월","화","수","목","금","토"];
 var HOL={"2026-01-01":1,"2026-02-16":1,"2026-02-17":1,"2026-02-18":1,"2026-03-01":1,"2026-03-02":1,"2026-05-05":1,"2026-05-24":1,"2026-05-25":1,"2026-06-06":1,"2026-08-15":1,"2026-08-17":1,"2026-09-24":1,"2026-09-25":1,"2026-09-26":1,"2026-09-28":1,"2026-10-03":1,"2026-10-05":1,"2026-10-09":1,"2026-12-25":1,"2027-01-01":1};
 var host=document.getElementById("po-blocks");
 var warn=document.getElementById("po-warn");
 var countEl=document.getElementById("po-count");
 var submitBtn=document.getElementById("po-submit");
 var pillBase="font-size:14px; padding:8px 15px; border-radius:999px; cursor:pointer; line-height:1; white-space:nowrap; ";
 var pillIdle=pillBase+"background:var(--surface-1); border:0.5px solid var(--border); color:var(--text-primary)";
 var pillOn=pillBase+"background:var(--bg-accent); border:0.5px solid var(--border-accent); color:var(--text-accent); font-weight:500";
 function isAprint(v){return APRINT.indexOf(v)>=0}
 function isCard(v){return v==="사감 메세지카드"}
 function key(d){var m=d.getMonth()+1;var day=d.getDate();return d.getFullYear()+"-"+(m<10?"0"+m:m)+"-"+(day<10?"0"+day:day);}
 function isOff(d){var w=d.getDay();return w===0||w===6||HOL[key(d)];}
 function shipDate(n){var d=new Date();var a=0;while(a<n){d.setDate(d.getDate()+1);if(!isOff(d))a++;}return d;}
 function fmt(d){return (d.getMonth()+1)+"/"+d.getDate()+"("+WD[d.getDay()]+")";}
 function dueOpts(sel){return CH.map(function(lab,i){var ds=fmt(shipDate(CHN[i]));return '<option value="'+lab+'" data-d="'+ds+'"'+(lab===sel?' selected':'')+'>'+lab+' · '+ds+'</option>'}).join('')}
 function shipOpts(){return JI.map(function(br){return '<option value="'+br+'">'+br+'로 모아서</option>'}).join('')}
 function opts(a,sel){return a.map(function(v){return '<option'+(v===sel?' selected':'')+'>'+v+'</option>'}).join('')}
 function pill(br){var b=document.createElement("button");b.type="button";b.textContent=br;b.dataset.branch=br;b.style.cssText=pillIdle;return b;}
 function togglePill(b,onOn,onOff){b.addEventListener("click",function(){if(b.dataset.on==="1"){b.dataset.on="";b.style.cssText=pillIdle;if(onOff)onOff();}else{b.dataset.on="1";b.style.cssText=pillOn;if(onOn)onOn();}});}
 function cardRows(){return CARDS.map(function(n){return '<div style="display:flex; align-items:center; gap:6px; min-width:0"><span style="flex:1; min-width:0; font-size:13px; color:var(--text-secondary); white-space:nowrap">'+n+'</span><input type="number" min="0" step="1" class="po-cqty po-num" data-type="'+n+'" placeholder="0" style="width:56px"><span class="po-unit">장</span></div>'}).join('')}
 function refreshQc(block){block.querySelector(".po-qcwrap").style.display=block.querySelector(".po-qc").children.length>0?"":"none"}
 function addQrow(block,br){
  var qc=block.querySelector(".po-qc");
  var bulk=block.querySelector(".po-bulk");
  var bv=(bulk&&bulk.value&&Number(bulk.value)>0)?String(Math.round(Number(bulk.value))):"";
  var row=document.createElement("div"); row.className="po-qrow"; row.dataset.branch=br;
  row.style.cssText="display:flex; align-items:center; gap:10px";
  row.innerHTML='<span style="width:56px; font-size:14px; white-space:nowrap">'+br+'</span><input type="number" min="0" step="1" class="po-qty po-num" placeholder="0" style="margin-left:auto"><span class="po-unit">장</span>';
  qc.appendChild(row);
  var inp=row.querySelector("input"); if(bv)inp.value=bv; refreshQc(block); inp.focus(); inp.select();
 }
 function copyPanel(block,src){
  var vals={}; src.querySelectorAll(".po-cqty").forEach(function(i){vals[i.dataset.type]=i.value});
  block.querySelectorAll(".po-cpanel").forEach(function(pn){if(pn===src)return;pn.querySelectorAll(".po-cqty").forEach(function(i){i.value=vals[i.dataset.type]||""})});
  recount();
 }
 function addPanel(block,br){
  var h=block.querySelector(".po-cardpanels");
  var p=document.createElement("div"); p.className="po-cpanel"; p.dataset.branch=br;
  p.style.cssText="border:0.5px solid var(--border); border-radius:14px; padding:12px 14px; display:flex; flex-direction:column; gap:10px; background:var(--surface-1)";
  p.innerHTML='<div style="display:flex; align-items:center; gap:8px"><span style="font-weight:500; font-size:15px">'+br+'</span><button type="button" class="po-copyall po-ghost" style="margin-left:auto; white-space:nowrap"><i class="ti ti-copy" aria-hidden="true"></i> 모든 지점에 복사</button></div><div style="display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:10px 14px">'+cardRows()+'</div>';
  p.querySelector(".po-copyall").addEventListener("click",function(){copyPanel(block,p)});
  h.appendChild(p);
 }
 function toggleMode(d){
  var v=d.querySelector(".po-item").value;
  d.querySelector(".po-duewrap").style.display=isAprint(v)?"":"none";
  d.querySelector(".po-branchwrap").style.display=isCard(v)?"none":"";
  d.querySelector(".po-cards").style.display=isCard(v)?"":"none";
 }
 function addBlock(){
  var d=document.createElement("div"); d.className="po-block";
  d.innerHTML='<div style="display:flex; gap:8px; align-items:center"><select class="po-item" style="flex:1; min-width:0; font-size:15px">'+opts(PUM,"등록신청서")+'</select><button type="button" class="po-delblock po-ghost" aria-label="이 품목 삭제" style="padding:6px"><i class="ti ti-trash" style="font-size:18px" aria-hidden="true"></i></button></div><div class="po-duewrap"><div class="po-lbl">출고 희망일</div><select class="po-due" style="width:100%">'+dueOpts("2영업일")+'</select></div><div class="po-branchwrap"><div class="po-lbl">보낼 지점</div><div class="po-pills" style="display:flex; gap:8px; flex-wrap:wrap"></div><div class="po-qcwrap" style="display:none; flex-direction:column; gap:10px; margin-top:14px"><div style="display:flex;align-items:center;gap:10px;background:var(--surface-1);border-radius:10px;padding:10px 12px"><span style="font-size:13px;color:var(--text-secondary);white-space:nowrap">선택한 지점 모두 같은 수량</span><input type="number" min="0" step="1" class="po-bulk po-num" placeholder="0" style="margin-left:auto"><span class="po-unit">장</span></div><div class="po-qc" style="display:flex; flex-direction:column; gap:9px"></div></div></div><div class="po-cards" style="display:none; flex-direction:column; gap:12px"><div class="po-lbl">보낼 지점</div><div class="po-cbpills" style="display:flex; gap:8px; flex-wrap:wrap"></div><div class="po-cardpanels" style="display:flex; flex-direction:column; gap:10px"></div></div><div class="po-optbtnwrap"><button type="button" class="po-optbtn po-ghost"><i class="ti ti-settings" aria-hidden="true"></i> 세부 설정 · 배송지 / 따로 결제 / 메모</button></div><div class="po-opts" style="display:none; flex-direction:column; gap:12px; border-top:0.5px solid var(--border); padding-top:12px"><div><div class="po-lbl">배송지</div><select class="po-ship" style="width:100%"><option value="__each__">지점별로 각각 (기본)</option>'+shipOpts()+'</select></div><div><div class="po-lbl">결제</div><select class="po-pay" style="width:100%"><option value="together">묶어서 한 번에 (기본)</option><option value="split">지점별로 따로 결제</option></select></div><div><div class="po-lbl">메모</div><input type="text" class="po-memo" placeholder="특이사항이 있으면 적어주세요" style="width:100%"></div></div>';
  var pc=d.querySelector(".po-pills");
  JI.forEach(function(br){var b=pill(br);togglePill(b,function(){addQrow(d,br)},function(){var q=d.querySelector('.po-qrow[data-branch="'+br+'"]');if(q)q.remove();refreshQc(d);recount()});pc.appendChild(b)});
  var cb=d.querySelector(".po-cbpills");
  JI.forEach(function(br){var b=pill(br);togglePill(b,function(){addPanel(d,br)},function(){var p=d.querySelector('.po-cpanel[data-branch="'+br+'"]');if(p)p.remove();recount()});cb.appendChild(b)});
  d.querySelector(".po-bulk").addEventListener("input",function(){var bv=this.value;if(!bv||Number(bv)<=0)return;var v=String(Math.round(Number(bv)));d.querySelectorAll(".po-qc .po-qty").forEach(function(i){i.value=v});recount()});
  var ob=d.querySelector(".po-optbtn");
  ob.addEventListener("click",function(){d.querySelector(".po-opts").style.display="flex";d.querySelector(".po-optbtnwrap").style.display="none"});
  d.querySelector(".po-delblock").addEventListener("click",function(){d.remove();recount()});
  d.querySelector(".po-item").addEventListener("change",function(){toggleMode(d);recount()});
  host.appendChild(d);
  toggleMode(d);
 }
 function recount(){
  var n=0,tot=0;
  host.querySelectorAll(".po-block").forEach(function(b){
   var item=b.querySelector(".po-item").value;
   if(isCard(item)){b.querySelectorAll(".po-cqty").forEach(function(c){var q=Number(c.value);if(q>0){n++;tot+=Math.round(q)}})}
   else{b.querySelectorAll(".po-qc .po-qty").forEach(function(i){var q=Number(i.value);if(q>0){n++;tot+=Math.round(q)}})}
  });
  countEl.textContent=n===0?"아직 담긴 주문이 없어요":("담긴 주문 "+n+"건 · 합계 "+tot.toLocaleString()+"장");
  submitBtn.textContent=n>0?(n+"건 주문 요청하기"):"주문 요청하기";
 }
 document.getElementById("po-add").addEventListener("click",function(){warn.textContent="";addBlock()});
 host.addEventListener("input",recount);
 submitBtn.addEventListener("click",function(){
  var sections=[];
  host.querySelectorAll(".po-block").forEach(function(b){
   var item=b.querySelector(".po-item").value;
   var dsel=b.querySelector(".po-due"); var due=dsel.value; var dd=dsel.options[dsel.selectedIndex].dataset.d;
   var ship=b.querySelector(".po-ship").value;
   var pay=b.querySelector(".po-pay").value;
   var memo=b.querySelector(".po-memo").value.trim();
   var lines=[];
   if(isCard(item)){
    b.querySelectorAll(".po-cpanel").forEach(function(pn){
     var parts=[];
     pn.querySelectorAll(".po-cqty").forEach(function(c){var q=c.value;if(q&&Number(q)>0)parts.push(c.dataset.type+" "+Math.round(Number(q)))});
     if(parts.length)lines.push("- "+pn.dataset.branch+": "+parts.join(", "));
    });
   }else{
    b.querySelectorAll(".po-qrow").forEach(function(q){var v=q.querySelector(".po-qty").value;if(v&&Number(v)>0)lines.push("- "+q.dataset.branch+" "+Math.round(Number(v))+"장")});
   }
   if(!lines.length)return;
   var head="["+item+"]";
   if(isAprint(item))head+=" 출고 "+due+"("+dd+" 예정)";
   if(ship!=="__each__")head+=" · 배송지 "+ship;
   if(pay==="split")head+=" · 지점별 따로 결제";
   if(memo)head+=" · 메모: "+memo;
   sections.push(head+NL+lines.join(NL));
  });
  if(sections.length===0){warn.textContent="지점과 수량을 넣어주세요";return;}
  warn.textContent="";
  var name=document.getElementById("po-name").value.trim();
  var msg="인쇄물 주문할게. 아래를 성원애드피아/에이프린트에 결제창 직전까지 넣어줘. 배송지와 '따로 결제' 표시에 맞게 주문을 나눠서 넣어줘."+NL+(name?("요청자: "+name+NL):"")+NL+sections.join(NL+NL);
  sendPrompt(msg);
 });
 addBlock();
})();
})();