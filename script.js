const PRODUTOS=[
 {id:1,n:"Bolo de Cenoura com Chocolate",d:"Massa fofinha e cobertura cremosa",p:45,e:"🥕"},
 {id:2,n:"Bolo de Chocolate",d:"Recheio de brigadeiro",p:55,e:"🍫"},
 {id:3,n:"Bolo de Morango",d:"Chantilly e morangos frescos",p:68,e:"🍓"},
 {id:4,n:"Bolo de Fubá",d:"Receita da vovó, perfeito com café",p:32,e:"🌽"},
 {id:5,n:"Torta de Limão",d:"Base crocante e merengue",p:60,e:"🍋"},
 {id:6,n:"Bolo de Coco",d:"Úmido, com coco fresco",p:48,e:"🥥"},
 {id:7,n:"Red Velvet",d:"Cream cheese e massa aveludada",p:75,e:"❤️"},
 {id:8,n:"Cupcakes (caixa com 6)",d:"Sabores variados",p:36,e:"🧁"}
];
const CARDAPIO={
 "Bolos (fatia)":[["Cenoura com chocolate",9],["Chocolate",10],["Fubá",6],["Red Velvet",13]],
 "Doces":[["Brigadeiro (un.)",3.5],["Beijinho (un.)",3.5],["Torta de limão (fatia)",12],["Cupcake (un.)",7]],
 "Bebidas":[["Café expresso",5],["Cappuccino",9],["Suco natural",8],["Chocolate quente",10]]
};
const fmt=v=>v.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const cart={};
const $=s=>document.querySelector(s);
const norm=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();

function add(key,name,price){cart[key]=cart[key]||{name,price,qty:0};cart[key].qty++;render()}
function renderProducts(q=''){
 const list=PRODUTOS.filter(x=>norm(x.n+' '+x.d).includes(q));
 $('#prodGrid').innerHTML=list.map(x=>`<article class="card"><div class="pic" aria-hidden="true">${x.e}</div><div class="body"><h3>${x.n}</h3><small>${x.d}</small><div class="row"><span class="price">${fmt(x.p)}</span><button class="add" data-p="${x.id}">Adicionar</button></div></div></article>`).join('');
 $('#prodEmpty').style.display=list.length?'none':'block';
}
function renderMenu(q=''){
 let html='',n=0;
 for(const [cat,items] of Object.entries(CARDAPIO)){
  const f=items.filter(i=>norm(i[0]+' '+cat).includes(q));
  if(!f.length)continue;n+=f.length;
  html+=`<div><h3>${cat}</h3>${f.map(i=>`<div class="item"><span>${i[0]}</span><span class="dots"></span><b>${fmt(i[1])}</b><button aria-label="Adicionar ${i[0]}" data-m="${cat}|${i[0]}|${i[1]}">+</button></div>`).join('')}</div>`;
 }
 $('#menu').innerHTML=html;$('#menuEmpty').style.display=n?'none':'block';
}
function render(){
 const ks=Object.keys(cart).filter(k=>cart[k].qty>0);
 let total=0,count=0;
 $('#items').innerHTML=ks.length?ks.map(k=>{const c=cart[k];total+=c.price*c.qty;count+=c.qty;return `<div class="ci"><b>${c.name}</b><span>${fmt(c.price*c.qty)}</span><div class="qty"><button data-d="-1" data-k="${k}" aria-label="Diminuir">−</button>${c.qty}<button data-d="1" data-k="${k}" aria-label="Aumentar">+</button></div><span></span></div>`}).join(''):'<p class="sub">Seu carrinho está vazio. Adicione um produto para começar.</p>';
 $('#total').textContent=fmt(total);$('#count').textContent=count;
}
function search(){const q=norm($('#q').value.trim());renderProducts(q);renderMenu(q);
 if(q){const t=document.querySelector(PRODUTOS.some(x=>norm(x.n+' '+x.d).includes(q))?'#produtos':'#cardapio');t.scrollIntoView()}}
document.addEventListener('click',e=>{
 const b=e.target.closest('button');if(!b)return;
 if(b.dataset.p){const x=PRODUTOS.find(y=>y.id==b.dataset.p);add('p'+x.id,x.n,x.p)}
 else if(b.dataset.m){const [c,n,p]=b.dataset.m.split('|');add('m'+c+n,n,+p)}
 else if(b.dataset.k){cart[b.dataset.k].qty+=+b.dataset.d;render()}
});
$('#q').addEventListener('input',()=>{const q=norm($('#q').value.trim());renderProducts(q);renderMenu(q)});
$('#q').addEventListener('keydown',e=>{if(e.key==='Enter')search()});
const dr=$('#drawer');
$('#openCart').onclick=()=>dr.classList.add('open');
$('#closeCart').onclick=$('#closeBg').onclick=()=>dr.classList.remove('open');
$('#clear').onclick=()=>{for(const k in cart)delete cart[k];render()};
$('#checkout').onclick=()=>{
 const ks=Object.keys(cart).filter(k=>cart[k].qty>0);if(!ks.length)return;
 let t=0;const l=ks.map(k=>{const c=cart[k];t+=c.price*c.qty;return `${c.qty}x ${c.name} - ${fmt(c.price*c.qty)}`});
 window.open('https://wa.me/5511943944490?text='+encodeURIComponent('Olá, Rafeli Bolos! Quero fazer um pedido:\n'+l.join('\n')+'\nTotal: '+fmt(t)),'_blank');
};
const od=$('#o-data'),min=new Date();min.setDate(min.getDate()+2);
od.min=min.toISOString().slice(0,10);
$('#o-ent').onchange=()=>{$('#o-endwrap').style.display=$('#o-ent').value==='Entrega'?'flex':'none'};
$('#o-send').onclick=()=>{
 const v=id=>$(id).value.trim(),err=m=>{$('#o-err').textContent=m};
 if(!v('#o-nome'))return err('Informe seu nome.');
 if(v('#o-tel').replace(/\D/g,'').length<10)return err('Informe um telefone válido com DDD.');
 if(!v('#o-qtd'))return err('Informe o tamanho ou a quantidade.');
 if(!od.value)return err('Escolha a data desejada.');
 if(od.value<od.min)return err('A data deve ser com pelo menos 2 dias de antecedência.');
 const ent=$('#o-ent').value==='Entrega';
 if(ent&&!v('#o-end'))return err('Informe o endereço de entrega.');
 err('');
 const [y,m,d]=od.value.split('-');
 const t=['Olá, Rafeli Bolos! Quero fazer uma encomenda:',
  'Nome: '+v('#o-nome'),'Telefone: '+v('#o-tel'),'Item: '+$('#o-tipo').value,
  v('#o-sabor')&&'Sabor/recheio: '+v('#o-sabor'),'Tamanho/quantidade: '+v('#o-qtd'),
  'Data: '+d+'/'+m+'/'+y,ent?'Entrega em: '+v('#o-end'):'Retirada na loja',
  v('#o-msg')&&'Mensagem no bolo: '+v('#o-msg'),v('#o-obs')&&'Observações: '+v('#o-obs')].filter(Boolean).join('\n');
 window.open('https://wa.me/5511943944490?text='+encodeURIComponent(t),'_blank');
};
renderProducts();renderMenu();render();
