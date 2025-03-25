import WaveSurfer from 'https://unpkg.com/wavesurfer.js@7/dist/wavesurfer.esm.js'
import RecordPlugin from 'https://unpkg.com/wavesurfer.js@7/dist/plugins/record.esm.js'

let isStart = false
let alphabet 
let mapper

if(_.lang = 'en'){
  _.state.topic = 'en'
}


const cache = {}
 
const messages = [
  "너무 잘했어",
  "탁월한 솜씨인걸?",
  "대회 나가도 될것 같아!"
]

let pos = 0

let map = {}

let isFinish = false
let timeout = 0
let intv = 0

let level = 0
let step = 0
let down = 10 
const limit = [20,15,10]

let cnt = 0
let form = 0
let count = 0
let initTime = 0

const state = [
  { level : -1, scores : []}, // [1/0,time, concent]
  { level : -1, scores : []},
  { level : -1, scores : []}
]

const chart = new Donutty( document.getElementById( "S_CHART" ),{ 
  color: "#2870b3",
  max : 20,
  value : 10,
  text: function(state) {
    return state.value
  }
})

//https://codepen.io/simeydotme/pen/rrOEmO/

const music = new Audio('/music/train.mp3')
music.volume = 0.5
//music.volume = 50

let wavesurfer = 0
let rec = 0

export function create(){
  cnt = 0
  isStart = false
  //music.play()
 
  document.querySelectorAll(`#${_.id} ul > li`).forEach(elem=>{elem.className = ''})
  
  step = 0
  count = 0


  if(_.lang == 'en'){
    _.state.topic = 'en'
  } else {
    _.state.topic = 'object'
  }

  alphabet = _.lang == 'ko' ? _DATA[_.state.topic] :  _DATA['en'][_.data]
  mapper = _.lang == 'ko' ?  _MAPPER : _MAPPER_EN

  wavesurfer = WaveSurfer.create({
    container: '#wave',
    waveColor: '#7f58a1',
    height : document.querySelector('#wave').offsetHeight,
    progressColor: '#2d1333',
    barWidth: 5,
    barGap: 1,
    barRadius: 2,
    //url : '/v1/a/audio/646b5736386a05de196e4b58'
  });
  
  rec = wavesurfer.registerPlugin(RecordPlugin.create())
  
  rec.on('record-end', (blob) => {
    //isFile = true
    //form = new FormData();
    //form.append("file", blob, 'voice.wav')
  })


  setLevel()

  isFinish = false

  const videoElement = $.query('video')
  canvasElement = $.query('canvas')
  canvasCtx = canvasElement.getContext('2d')

  $.faceMesh.onResults(onResults);

  $.camera = new Camera(videoElement, {
    onFrame: async () => {
      await $.faceMesh.send({image: videoElement});
    },
    width: 460,
    height: 250
  });
  $.camera.start();

  start()
}


let isListen = false

export function event(){

  $.query('td[name=t_1]').addEventListener('click',elem=>{
    
    console.log('listen start....')

    if(isListen){
      isListen = false
      rec.stopRecording()
    } else {
      isListen = true
      rec.startRecording()
    }

    $.listen(out=>{
      console.log('listend,',out)

      //if (rec.isRecording()) {
      //  rec.stopRecording()
      //} else {
      //rec.stopRecording() //record.startRecording({ deviceId })
      //}

      calc(elem, out.trim())
    })
  })

  /*
  document.querySelectorAll('#K_SPEAK td').forEach(e=>{
    e.addEventListener('click',elem=>{
      console.log(elem.target.attributes.name.textContent, elem.target.value)
      const value = elem.target.textContent
      calc(elem,value)
    })
  
    e.addEventListener('mouseover',elem=>{
      console.log(elem.target.attributes.name.textContent, elem.target.textContent)
      const value = elem.target.textContent
  
      if(value == cnt ){
  
      } else {
  
      }
    })
  })
  */  
}

let unfocusTime = 0
let lastTime = 0

function onResults(results) {
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
  if (results.multiFaceLandmarks) {

    for (const landmarks of results.multiFaceLandmarks) {
      drawConnectors(canvasCtx, landmarks, FACEMESH_TESSELATION,{color: '#C0C0C070', lineWidth: 1});
      drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_EYE, {color: '#30FF30'});
      drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_EYEBROW, {color: '#30FF30'});
      drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_IRIS, {color: '#30FF30'});
      drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_EYE, {color: '#3030FF'});
      drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_EYEBROW, {color: '#3030FF'});
      drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_IRIS, {color: '#3030FF'});
      drawConnectors(canvasCtx, landmarks, FACEMESH_FACE_OVAL, {color: '#E0E0E0'});
      drawConnectors(canvasCtx, landmarks, FACEMESH_LIPS, {color: '#FF3030'});
    }
  }
  canvasCtx.restore();
}

export function destroy(){
  clearInterval(intv)
  document.querySelector('#wave').innerHTML = ``
  //clearTimeout(timeout)
  //music.pause()
  //music.currentTime = 0
}

function sample(arr){
  let key = JSON.stringify(arr);

  if (
    cache[key] == undefined ||
    (cache[key] != undefined && cache[key].length == 0)
  ) {
    cache[key] = JSON.parse(JSON.stringify(arr));
  } else if (cache[key].length == 1) {
    return cache[key].pop();
  }
  //console.log('CACHE', cache);

  let point = ~~(Math.random() * cache[key].length);
  let item = cache[key][point];
  cache[key].splice(point, 1);
  return item;
}

let target = 0
let wrong = 0
let startTime = 0

function start(isStep){
  cnt = 0

  document.querySelectorAll('#K_SPEAK td').forEach(e=>{ e.className = ''})
  wavesurfer.empty()
  startTime = Date.now()
  unfocusTime = 0

  clearInterval(intv)

  //$.query('td[name=t_2]').textContent = 'Start!'

  if(isStep)
    setLevel()

  down = limit[level] 
  chart.set("value", down)    
  map = {}

  clearInterval(intv)

  target = alphabet.random()

  let a = 'a'
  if(target[0].indexOf('a','e') > -1)
    a = 'an'

  const st = _SENTENCE[target].random()
  

  const item = st.replace(new RegExp(target, 'gi'),`<span style='font-size:96px;color:red;'>${target}</span>`)
  document.querySelector('#K_SPEAK td[name=t_1]').innerHTML = `<p style='font-size:72px;'>${item}</p>`//mapper[target]

  //document.querySelector('#K_SPEAK td[name=t_1]').innerHTML = `<p style='font-size:72px'>I see ${a}</p><p style='font-size:160px'>${target}</p>`//mapper[target]

  console.log(target)

  const el = document.querySelector('#K_SPEAK div[name=target] img')
  el.src = `/image/${_.lang}/${_.data.toLowerCase()}/${target}.png`
  //const char = target.split('_')
  //el.textContent = char[1] + ' ' + char[2] + '\n' + alphabet[turn]
  //el.textContent = alphabet[target]
  getAverageRGB(el.src)


  document.getElementById('s_human').src =`https://oe-napi.circul.us/v1/txt2human?text="${item}"&voice=main&type=mp4&lang=${_.lang}`

  //$.tts(`${target}, ${target}, ${target}.`,_.lang)


  intv = setInterval(()=>{
    //elem_cnt.innerText = --down
    chart.set( "value", --down )


    if(down == 0)
      calc()

  },1000)  
}

function setLevel(){
  let lv = 0
  let type = '초급'
  let passed = 0

  if(step != 0){
   
    for(const score of state[step - 1].scores){
      if(score[0] == true)
        passed += 1
    }

    if(passed == 10){
      lv = 2
      type = '상급'
    } else if(passed > 5){
      lv = 1
    } else { 
      type = '초급'
      lv = 0
    }
  }
  
  $.tts(`${type} 레벨로 게임을 시작해 볼게.`)

  $.query(`li[name=s${step}`).className = `lv${lv}`
  $.query(`li[name=s${step}`).textContent = type

  state[step].level = lv

  level = lv 
}

function levenshtein(a, b) {
  const tmp = [];
  let i, j, alen = a.length, blen = b.length, cost;

  if (alen === 0) return blen;
  if (blen === 0) return alen;

  for (i = 0; i <= alen; i++) {
    tmp[i] = [i];
  }

  for (j = 0; j <= blen; j++) {
    tmp[0][j] = j;
  }

  for (i = 1; i <= alen; i++) {
    for (j = 1; j <= blen; j++) {
      cost = (a[i - 1] === b[j - 1]) ? 0 : 1;
      tmp[i][j] = Math.min(tmp[i - 1][j] + 1, tmp[i][j - 1] + 1, tmp[i - 1][j - 1] + cost);
    }
  }

  const maxLength = Math.max(a.length, b.length);
  const similarity = (1 -  tmp[alen][blen] / maxLength) * 100;

  return similarity;
}


function calc(elem, value){
  console.log('calc',value)
  const pass = new Audio('/app/ANIMAL/sound/pass.mp3')
  const fail = new Audio('/app/ANIMAL/sound/fail.mp3')
  const spendTime = Date.now() - startTime


  if(value != undefined){
  //const val = levenshtein(value.toLowerCase().trim(), target)
  //console.log('levenper', val)

    if(value.toLowerCase().trim().indexOf(target > -1)){ // 한단어만? // target
      const char = value
      $.tts(`${value}, ${value}.`,_.lang)
      elem.target.className = 'animate__animated animate__zoomOut'


      clearInterval(intv)
      $.query(`li[name=t${count % 10}]`).className = 'pass'
      $.query(`li[name=t${count % 10}]`).textContent = '○'
      $.query('.img').src = '/app/COLOR/image/positive-vote.png'

      $.shuffle(messages)
      //const complete = new Audio('/bot/official-game/sound/complete.mp3')
      pass.play()
      setTimeout(next,2000)
      state[step].scores.push([true, spendTime,unfocusTime])
    
      $.tts(messages[0])
        
    } else {
      const char = value
      $.tts(`${value}, ${value}.`,_.lang)
      //audio.play()
      fail.play()
  
      //elem.target.style.color = 'black'
      //elem.target.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
      elem.target.className = 'animate__animated animate__flip fail'
      //elem.target.style.backgroundBlendMode = 'overlay';
      
    
      //elem.target.textContent = `${value}`
      setTimeout(()=>{
        //elem.target.className = ''
        //elem.target.textContent = ''
        elem.target.color = ''
      },2000)   
    }
  } else if(elem != undefined){

    const char = value
    $.tts(`${value}, ${value}.`,_.lang)
    //audio.play()
    fail.play()

    //elem.target.style.color = 'black'
    //elem.target.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
    elem.target.className = 'animate__animated animate__flip fail'
    //elem.target.style.backgroundBlendMode = 'overlay';
    
  
    //elem.target.textContent = `${value}`
    setTimeout(()=>{
      //elem.target.className = ''
      //elem.target.textContent = ''
      elem.target.color = ''
    },2000)
  
  } else {
    clearInterval(intv)


    $.query(`li[name=t${count % 10}]`).className = 'fail'
    $.query(`li[name=t${count % 10}]`).textContent = '×'
    $.query('.img').src = '/app/COLOR/image/negative-vote.png'
    state[step].scores.push([false, spendTime,unfocusTime])
    $.tts('다음번에는 좀더 잘해보는게 좋을것 같아!')

    setTimeout(()=>{
      if(elem)
        elem.target.className = ''
      next()
    },2000)    
  }
}

function next(){
  pos = 0

  if(++count % 10 == 0){ // 단계 올림
    if(count == 30){
      const totalTime = Date.now() - initTime
      clearInterval(intv)
      console.log(totalTime, state)

      let pass_cnt = 0
      let fail_cnt = 0

      let pass_time = 0
      let fail_time = 0

      let stage = 0
      let advise = 0

      for(const step of state){
        stage += step.level
        for(const score of step.scores)
          if(score[0]){
            pass_cnt += 1
            pass_time += score[1]
          } else {
            fail_cnt += 1
            fail_time += score[1]
          }
      }

      let medal_img = ''
      let pass_img = ''
      let speed_img = ''
      let concent_img = 'step3'

      if(stage == 5){ // 훌륭
        advise = '금메달'
        medal_img = 'gold'
      } else if(stage == 4){ // 우수
        advise = '은메달'
        medal_img = 'silver'
      } else if(stage == 3){ // 보통
        advise = '동메달'
        medal_img = 'bronze'
      } else if(stage == 2){ // 미흡 
        advise = '노메달'
        medal_img = 'no'
      } else { 
        advise = '시합포기'
        medal_img = 'diagnosis'
      }

      const percent = pass_cnt * 100 / (pass_cnt + fail_cnt)

      if(percent > 80)
        pass_img = 'step3'
      if(percent > 60)
        pass_img = 'step2'
      else
        pass_img = 'step1'

      const time = pass_time / pass_cnt

      if(time < 5)
        speed_img = 'step3'
      else if(time < 10)
        speed_img = 'step2'
      else
        speed_img = 'step1'

      console.log(percent,time)

      document.querySelector('footer').style.visibility = 'visible' 
      document.querySelector('footer img.medal').src = `/image/${medal_img}.png`
      document.querySelector('footer span.score').src = advise

      document.querySelector('footer img.acc').src = `/image/${pass_img}.png`
      document.querySelector('footer img.spd').src = `/image/${speed_img}.png`
      document.querySelector('footer img.cct').src = `/image/${concent_img}.png`

      $.tts(`고생했어! ${Math.round(totalTime/1000)}초 동안, ${advise} 등급으로 게임을 마무리 했어. 총 30회 중에 평균 ${Math.round(pass_time / (30 * 1000))}초로 ${pass_cnt}회 성공했어. ${fail_cnt}회 실패했는데 다음번에 좀더 잘해보자!`)
      
      setTimeout($.exit,10000)


    } else {
      // 카운트
      document.querySelectorAll(`#${_.id} ul.check > li`).forEach(elem=>{elem.className = ''})

      ++step
      start(true) // 단계 소개
    }
  } else 
    start()
}

function getAverageRGB(url) {
  const imgEl = new Image(256, 256);
  imgEl.src = url;

  var blockSize = 5, // only visit every 5 pixels
      defaultRGB = {r:0,g:0,b:0}, // for non-supporting envs
      canvas = document.createElement('canvas'),
      context = canvas.getContext && canvas.getContext('2d'),
      data, width, height,
      i = -4,
      length,
      rgb = {r:0,g:0,b:0},
      cnt = 0;

  if (!context) {
      return defaultRGB;
  }

  imgEl.onload = function() {
    height = canvas.height = imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
    width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;
  
    context.drawImage(imgEl, 0, 0);
  
    try {
        data = context.getImageData(0, 0, width, height);
    } catch(e) {
        /* security error, img on diff domain */
        return defaultRGB;
    }
  
    length = data.data.length;
  
    while ( (i += blockSize * 4) < length ) {
        ++cnt;
        rgb.r += data.data[i];
        rgb.g += data.data[i+1];
        rgb.b += data.data[i+2];
    }
  
    // ~~ used to floor values
    rgb.r = ~~(rgb.r/cnt);
    rgb.g = ~~(rgb.g/cnt);
    rgb.b = ~~(rgb.b/cnt);

    $.query('div[name=target]').style.backgroundColor = `rgba(${rgb.r},${rgb.g},${rgb.b},1)`

  }
}