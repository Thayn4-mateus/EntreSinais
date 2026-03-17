/* =========================
NAVEGAÇÃO
========================= */

const telas = document.querySelectorAll(".tela")

function mostrarTela(id){

telas.forEach(t=> t.classList.remove("ativa"))
document.getElementById(id).classList.add("ativa")

if(id === "tela2"){
iniciarCamera()
}

}

document.getElementById("btnSinais").onclick = () => mostrarTela("tela2")
document.getElementById("btnFrases").onclick = () => mostrarTela("tela4")
document.getElementById("btnListaSinais").onclick = () => mostrarTela("tela3")

document.querySelectorAll(".voltar").forEach(botao=>{
botao.onclick = () => mostrarTela(botao.dataset.voltar)
})

/* =========================
ELEMENTOS
========================= */

const video1 = document.getElementById("video1")
const video2 = document.getElementById("video2")
const canvas = document.getElementById("canvas2")
const ctx = canvas.getContext("2d")

const fraseTela = document.getElementById("fraseDetectada")
const statusSistema = document.getElementById("statusSistema")

/* =========================
FRASES
========================= */

const frases = [
"Olá, tudo bem com você?",
"Ok, muito obrigado",
"Obrigado pela ajuda",
"Eu estou aprendendo Libras",
]

/* =========================
GESTOS TREINADOS
========================= */

let gestosTreinados = {
"0":[0,0,0.2689363470724418,-0.16166313428299509,0.48132644323237384,-0.4486015327184686,0.6299917493356587,-0.6944192795829744,0.7715687475902049,-0.8732988701813537,0.28791590606992873,-0.9500276904578169,0.3793610482302322,-1.2992287565608238,0.43167526441919785,-1.518798984550098,0.47668068036678046,-1.7157396136708827,0.12881135122871856,-0.9908844139418824,0.19273237693375161,-1.378255449897509,0.24109161208005336,-1.62372947072286,0.28434161033579736,-1.8323894408538386,-0.02463150867648542,-0.9465052131364783,0.003341178759834191,-1.3174162568791523,0.04405506917475352,-1.5523314914134003,0.09136782303975502,-1.7613656131103266,-0.18488882060216996,-0.830803423331557,-0.1945289111818621,-1.1214753363113257,-0.17989231503518419,-1.3162160869066064,-0.1521200045874788,-1.5054791856561078],
"1":[0,0,0.28181633877941176,-0.24092940406895583,0.48124760806281947,-0.5345123340394277,0.6403028832867605,-0.7303229585852535,0.7514441893474624,-0.9479626368909891,0.20988476592315125,-0.9749171443716779,0.42795335460542017,-1.2121066455755176,0.6442406494623649,-1.191077855666769,0.7898577293071132,-1.1318925126330661,0.13219828705495862,-0.9911211208358003,0.4134175311053121,-1.2674319727215655,0.6524059353424508,-1.2126036895356291,0.7928029154753363,-1.0933858871782702,0.08110108933820698,-0.96288583651758,0.3515452080920339,-1.2400624284807515,0.591619092822103,-1.1692203798611223,0.7335920627451159,-1.034972941587674,0.07222460970798905,-0.8874653783731529,0.30392163643848363,-1.128285040081318,0.4963599578324423,-1.0954066401516827,0.6265339499567939,-0.9876561027254273],
"2":[0,0,-0.004168312335287685,-0.41090028723426303,0.044228040559317505,-0.7891013844149004,0.15906463717798663,-1.0424696390382233,0.27747588571199905,-1.178146846527639,-0.01243569196687721,-1.0604694836129869,0.25247192876339136,-1.464807990652934,0.433624133160766,-1.6913818252479573,0.5725739243317682,-1.8648272473689718,0.0512602959311028,-0.9933135684204538,0.3530179476303911,-1.483479309837813,0.5439876695838468,-1.7370046024671055,0.6857868294324092,-1.9351043496237672,0.16026057251960535,-0.8635661975621065,0.433741722797398,-1.3454483581394037,0.6106703857634808,-1.6131555292219737,0.7416724315394264,-1.8309004293772317,0.3138756231323727,-0.6803603946416079,0.5109176910124834,-1.0913429872160427,0.6219455638555123,-1.3203298979159779,0.7189969764057662,-1.5195513250340802],
"3":[0,0,0.029002389413709775,-0.5295543555102913,0.2528993315071237,-1.000089754994527,0.5512485690974557,-1.214243962794749,0.7953575408704032,-1.2770298480351823,0.22646237642568406,-1.1912753632707052,0.6079936163320486,-1.6497428110854937,0.8533609903519206,-1.8494147598351542,1.0500234405163427,-1.991474093885671,0.3586129459509787,-0.9330070460017791,0.9115987622085114,-1.2739302296023403,0.8459376395139584,-1.0595612515255175,0.6813744177638758,-0.907487696354542,0.5083402289170676,-0.6181067347575434,0.9863989470094392,-0.9204300495208075,0.8854095967534625,-0.744498285111034,0.7315023125862534,-0.6369666175515828,0.6357917693898477,-0.2972540502491243,0.9932498849676185,-0.5600878852131439,0.8981539410171452,-0.44726330823391636,0.7602488047686271,-0.3598209899877844]
}

/* =========================
CAMERA
========================= */

let cameraLigada = false

async function iniciarCamera(){

if(cameraLigada) return
cameraLigada = true

const stream = await navigator.mediaDevices.getUserMedia({
video:{width:480,height:360}
})

video1.srcObject = stream
video2.srcObject = stream

video2.onloadedmetadata = () => {
canvas.width = video2.videoWidth
canvas.height = video2.videoHeight
}

const hands=new Hands({
locateFile:(file)=>
`https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
})

hands.setOptions({
maxNumHands:1,
modelComplexity:1,
minDetectionConfidence:0.7,
minTrackingConfidence:0.7
})

hands.onResults(results=>{

ctx.clearRect(0,0,canvas.width,canvas.height)
ctx.drawImage(video2,0,0,canvas.width,canvas.height)

if(results.multiHandLandmarks){

for(const landmarks of results.multiHandLandmarks){

// 🔥 ISSO NÃO PODE SUMIR
drawConnectors(ctx,landmarks,HAND_CONNECTIONS,{color:"#00FF00",lineWidth:3})
drawLandmarks(ctx,landmarks,{color:"#FF0000",lineWidth:2})

let vetor = vetorDaMao(landmarks)

// 👇 reconhecimento vem DEPOIS
let frase = reconhecerGesto(vetor)

let agora = Date.now()

if(frase 
  && frase !== ultimaFrase 
  && (agora - ultimoTempo > delay)
){

  ultimaFrase = frase
  ultimoTempo = agora

  setTimeout(()=>{
    fraseTela.innerText = frase
    falar(frase)
  },5000)

}

}

}

})

const camera=new Camera(video2,{
onFrame:async()=>{
await hands.send({image:video2})
}
})

camera.start()

}

/* =========================
UTILS
========================= */

function vetorDaMao(landmarks){
let vetor=[]
let baseX = landmarks[0].x
let baseY = landmarks[0].y

let escala = Math.sqrt(
Math.pow(landmarks[9].x - baseX,2) +
Math.pow(landmarks[9].y - baseY,2)
)

for(let i=0;i<21;i++){
vetor.push((landmarks[i].x - baseX)/escala)
vetor.push((landmarks[i].y - baseY)/escala)
}

return vetor
}

function distancia(a,b){
let soma=0
for(let i=0;i<a.length;i++){
let d = a[i]-b[i]
soma += d*d
}
return Math.sqrt(soma)
}

function reconhecerGesto(vetorAtual){

let melhorIndice=null
let menorDistancia=Infinity

for(let indice in gestosTreinados){

let vetorSalvo=gestosTreinados[indice]
let d=distancia(vetorAtual,vetorSalvo)

if(d<menorDistancia){
menorDistancia=d
melhorIndice=indice
}

}

if(menorDistancia < 0.6){
return frases[melhorIndice]
}

return null
}

let falando = false

function falar(texto){

  if(falando) return

  falando = true

  speechSynthesis.cancel() // limpa fila

  const fala = new SpeechSynthesisUtterance(texto)
  fala.lang = "pt-BR"

  // 🔥 espera as vozes carregarem antes de falar
  const falarAgora = () => {
    speechSynthesis.speak(fala)
  }

  if(speechSynthesis.getVoices().length === 0){
    speechSynthesis.onvoiceschanged = falarAgora
  } else {
    falarAgora()
  }

  fala.onend = () => {
    falando = false
  }

}
let ultimaFrase = null
let ultimoTempo = 0
let delay = 7000

/* =========================
SELEÇÃO DE FRASES
========================= */

const frasesTela4 = document.querySelectorAll(".selecionavel p")
let fraseSelecionada = null

frasesTela4.forEach(frase => {
  frase.addEventListener("click", () => {

    // limpa seleção anterior
    frasesTela4.forEach(f => f.classList.remove("selecionado"))

    // aplica nova seleção
    frase.classList.add("selecionado")

    fraseSelecionada = frase.innerText.trim()
  })
})

/* =========================
BOTÃO ESCOLHER
========================= */

const video = document.getElementById("videoAvatar")

document.getElementById("btnEscolher").onclick = () => {

  if(!fraseSelecionada){
    alert("Selecione uma frase primeiro")
    return
  }

  let nomeVideo = fraseSelecionada
  .toLowerCase()
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .replace(/[^\w\s]/g, "")
  .replace(/\s+/g, "_")
  .replace(/^_+|_+$/g, "")

  const caminho = "videos/" + nomeVideo + ".mp4"

  console.log("Carregando vídeo:", caminho)

  video.pause()
  video.src = caminho
  video.load()

  video.oncanplay = () => {
    video.play()
  }

}

  console.log(nomeVideo)

  video.controls = true