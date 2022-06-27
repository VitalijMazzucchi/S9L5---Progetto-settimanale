let addcredito: number = 0;  //variabile di quanto si vuole caricare che viene modificata con  la funzione ricaricaCredito
const tariffaminuto: number = 0.20; //costante ssatto alla risposta e costo al minuto

class Tempo{ //classe tempo con dati non privati perche non sono dati sensibili
  min: number;
  sec: number;
  constructor(min: number, sec: number) { 
    this.min = min; 
    this.sec = sec;
  }
};
// classe Smartphone con solo il credito non definito e messo nel costruttore 
//perche ho ipotizzato che i telefoni fossero nuovi, lunico dato che cambia e il credito 
//perche quando compro il telefono posso comprarlo con o senza credito
class Smartphone {
  private _credito: number;
  private _numerochiamate: number = 0;
  min: number = 0;
  sec: number = 0;
  interval: number | undefined;
  registroChiamate:Tempo[]=[];
  constructor(
    credito: number
  ) {
    this._credito = credito;
  };

  get credito(): number {
    return this._credito;
  };
  set credito(credito: number) {
    this._credito = credito;
  };
  get numerochiamate(): number {
    return this._numerochiamate;
  };
  set numerochiamate(numerochiamate: number) {
    this._numerochiamate = numerochiamate;
  };

  getnumerochiamate(): number {
    return this._numerochiamate++;
  };
  resetnumerochiamate(): number {
    return (this._numerochiamate = 0);
  };
  ricarica(): number {
    return (this._credito = this._credito + addcredito);
  };
  scarica(): number {
    return (this._credito = this._credito - tariffaminuto);
  };
};

let iphone = new Smartphone(0); //User1
let samsung = new Smartphone(0); //user2
let huawei = new Smartphone(0); //user3
let arr:Smartphone[]=[]; //array tipizzato per gestire dinamicamente gli oggetti
arr.push(iphone, samsung, huawei);

document.addEventListener('DOMContentLoaded', () =>{ //al caricamento della pagina mi crea l html dinamicamente
 arr.forEach((ele, i) => {
    let div = <HTMLDivElement> document.querySelector('.container');
    if(div !== null){
       let div2= document.createElement('div');
    div2.innerHTML=`<button onclick="temp(${i})"><i class="bi bi-telephone"></i></button>
    <p class="tempo${i}">0:0</p>
    <button onclick="stoptemp(${i})"><i class="bi bi-telephone-x"></i></i></button>
    <p class="credito${i}">saldo iniziale:0 </p>
    <button onclick="ricaricaCredito(${i})"><i class="bi bi-cash-coin"></i></button>
    <input type="range" min="5" max="30" step="5" list="tickmarks" id="valric${i}" >
    <datalist id="tickmarks" >
    <option value="5" label="5">5</option>
    <option value="10" label="10">10</option>
    <option value="15" label="15">15</option>
    <option value="20"label="20">20</option>
    <option value="25" label="25">25</option>
    <option value="30" label="30">30</option>
    </datalist>
    <p><span class="chiamate${i}">Numero chiamate: 0</span></p>
    <p>Durata chiamate:<span class="registroChiamate${i}">Nessuna Chiamata</span></p>
    <button onclick="reschiamate(${i})"><i class="bi bi-x-circle"></i> Chiamate</button>`;
    div.appendChild(div2) ;   
    }
})   
});

function temp(i:number){//funzione inizio chiamata
  if(!arr[i].interval){
    if(arr[i].credito>= tariffaminuto){
    arr[i].scarica(); //scatto alla risposta
    arr[i].getnumerochiamate();//metodo che incrementa numero chiamate
    let span = <HTMLSpanElement> document.querySelector('.chiamate'+ i);
    span.innerText=`${arr[i].numerochiamate}`;
    arr[i].interval=setInterval( setTimer,1000,i) ;
    stampaInfo(i);} 
    else{
    alert('Credito insufficente');
   }
  }else{
  alert('riaggancia prima di effettuare una nuova chiamata')
  };
  };    

  function setTimer(i:number){//funzione cronometro he dopo 1 minuto scala 0.20 (const)
    arr[i].sec++;
    if (arr[i].sec >= 60) {
        arr[i].sec = 0;
        arr[i].min++
      
      if(arr[i].credito<tariffaminuto){//se il credito non e sufficente interrompe la chiamata, se non hai soldi usa il piccione viaggiatore
       stoptemp(i)
       alert('chiamata interrotta per creditoinsufficente')
      } else {
        arr[i].scarica()
        stampaInfo(i)
      };
    };
   let p= <HTMLParagraphElement> document.querySelector('.tempo'+ i);
   if(p!== null){
    p.innerText= `${ arr[i].min}:${arr[i].sec }`;
   }
   
};

function stoptemp(i:number){//funzione fine chiamata 
  clearInterval(arr[i].interval);
  const tempoChiamata = new Tempo(arr[i].min, arr[i].sec) ;
  if(arr[i].min!==0 || arr[i].sec!==0){arr[i].registroChiamate.push(tempoChiamata)};
  arr[i].sec = 0;
  arr[i].min = 0;
  arr[i].interval=undefined;
  let p= <HTMLParagraphElement> document.querySelector('.tempo'+i);
  if(p!== null){
    p.innerText= `${arr[i].min }:${  arr[i].sec }`;
  };
  stampaInfo(i);
};

function ricaricaCredito(i:number){//funzione che ricarica il credito
  let valRic= <HTMLInputElement> document.querySelector('#valric'+i);
  addcredito = +valRic.value;
  arr[i].ricarica();
  stampaInfo(i); 
};

function stampaInfo(i:number){//funzione che mi stampa i dati a schermo
  let credito =<HTMLParagraphElement> document.querySelector('.credito'+i);
  if(credito!==null){
    credito.innerText=`Credito: ${arr[i].credito.toFixed(2)}`;  
  };
  let span = <HTMLSpanElement> document.querySelector('.chiamate'+i);
  if(span!==null){
    span.innerText=`Numero chiamate:${arr[i].numerochiamate}`;
  };
  let registroChiamate = <HTMLParagraphElement> document.querySelector('.registroChiamate' + i);
  if(registroChiamate!==null && arr[i].registroChiamate.length!==0 || arr[i].registroChiamate.length!==0){
    registroChiamate.innerHTML='';
    arr[i].registroChiamate.forEach((ele,i)=>{
    let p = document.createElement('p');
    p.innerText=`Chiamata ${i + 1}: ${ele.min}m-${ele.sec}s`;
    registroChiamate.appendChild(p);
                   
    });
  } else  {
    registroChiamate.innerText='Nessuna Chiamata';
  };
};
 
function reschiamate(i:number){//funzione che cancella numero chiamate e tempi delle chiamate
  arr[i].resetnumerochiamate();
  arr[i].registroChiamate=[];
  stampaInfo(i);
};
 

