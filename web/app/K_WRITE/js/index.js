let isStart = false
const alphabet = _DATA[_.state.topic]
const mapper = _MAPPER

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
const limit = [20,10,5]

let cnt = 0

let orgImg = 0
let count = 0
let initTime = 0


let target = 0
let wrong = 0
let startTime = 0

function compareCanvases(data1, data2) {
  //const ctx1 = canvas1.getContext('2d');
  //const ctx2 = canvas2.getContext('2d');
  //const data1 = ctx1.getImageData(0, 0, canvas1.width, canvas1.height).data;
  //const data2 = ctx2.getImageData(0, 0, canvas2.width, canvas2.height).data;

  // Ensure both canvases have the same size
  if (data1.length !== data2.length) {
      throw new Error('Canvas sizes do not match!');
  }

  let diffCount = 0;
  const totalPixels = data1.length / 4; // Each pixel has 4 values (RGBA)

  // Compare pixel-by-pixel
  for (let i = 0; i < data1.length; i += 4) {
      const rDiff = Math.abs(data1[i] - data2[i]);
      const gDiff = Math.abs(data1[i + 1] - data2[i + 1]);
      const bDiff = Math.abs(data1[i + 2] - data2[i + 2]);
      const alphaDiff = Math.abs(data1[i + 3] - data2[i + 3]);

      // Threshold: Count as different if the difference exceeds a certain value
      if (rDiff > 10 || gDiff > 10 || bDiff > 10 || alphaDiff > 10) {
          diffCount++;
      }
  }

  // Calculate the percentage of difference
  const differencePercentage = (diffCount / totalPixels) * 100;
  const similarityPercentage = 100 - differencePercentage;

  return { similarityPercentage, differencePercentage };
}

const state = [
  { level : -1, scores : []}, // [1/0,time, concent]
  { level : -1, scores : []},
  { level : -1, scores : []}
]

const chart = new Donutty( document.getElementById( "W_CHART" ),{ 
  color: "#2870b3",
  max : 20,
  value : 10,
  text: function(state) {
    return state.value
  }
})

let ctx = 0
let canvas = 0

//https://codepen.io/simeydotme/pen/rrOEmO/

const music = new Audio('/music/train.mp3')
music.volume = 0.5
//music.volume = 50

export function create(){

  // fabric.js로 캔버스 생성
  //const canvas = new fabric.Canvas('drawingCanvas');


  canvas = document.getElementById('drawingCanvas');
  ctx = canvas.getContext('2d');
  const modeButton = document.getElementById('pen_mode');

  let drawing = false; // 드로잉 상태
  let isErasing = false; // 지우기 모드 상태
  let lastX = 0, lastY = 0; // 이전 마우스 위치

  // 초기 스타일 설정
  ctx.lineWidth = 16;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = 'black';

  // 모드 전환 버튼 이벤트
  modeButton.addEventListener('click', () => {
    if(isErasing){
      isErasing = false;
      ctx.strokeStyle = 'black'; // 드로잉 색상
      ctx.globalCompositeOperation = 'source-over'; // 일반 드로잉 모드
    } else {
      isErasing = true;
      ctx.globalCompositeOperation = 'destination-out'; // 지우기 모드
      ctx.lineWidth = 32; // 지우개 크기 설정
    }
  });

  // 그리기 시작
  canvas.addEventListener('mousedown', (e) => {
      drawing = true;
      [lastX, lastY] = [e.offsetX, e.offsetY]; // 시작 위치 저장
  });

  // 마우스 이동 중 그리기 또는 지우기
  canvas.addEventListener('mousemove', (e) => {
      if (!drawing) return;

      const [currentX, currentY] = [e.offsetX, e.offsetY];

      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(currentX, currentY);
      ctx.stroke();

      [lastX, lastY] = [currentX, currentY];
  });

  // 그리기 끝내기
  canvas.addEventListener('mouseup', () => {
      drawing = false;
  });

  // 캔버스를 벗어날 때 그리기 종료
  canvas.addEventListener('mouseleave', () => {
      drawing = false;
  })
  //------------------------------------------------------
  // 그리기 시작
  canvas.addEventListener('touchstart', (e) => {
    const { x, y } = getTouchPosition(e);
    startDrawing(x, y);
  });

  canvas.addEventListener('touchmove', (e) => {
      const { x, y } = getTouchPosition(e);
      draw(x, y);
  });

  canvas.addEventListener('touchend', stopDrawing);

  // 드로잉 시작
  function startDrawing(x, y) {
      drawing = true;
      [lastX, lastY] = [x, y];
  }

  // 드로잉 진행
  function draw(x, y) {
      if (!drawing) return;

      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(x, y);
      ctx.stroke();

      [lastX, lastY] = [x, y];
  }

  // 드로잉 종료
  function stopDrawing() {
      drawing = false;
  }

  // 터치 좌표 계산 (캔버스 기준)
  function getTouchPosition(event) {
      const touch = event.touches[0]; // 첫 번째 터치
      const rect = canvas.getBoundingClientRect();
      return {
          x: touch.clientX - rect.left,
          y: touch.clientY - rect.top,
      };
  }

  // 브러시 설정
  /*
  canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
  canvas.freeDrawingBrush.width = 5;
  canvas.freeDrawingBrush.color = '#000000';

  // 현재 모드: 'draw' 또는 'erase'
  let mode = 'draw';

  // 그리기 모드 설정 함수
  function setMode(newMode) {
      mode = newMode;
      if (mode === 'draw') {
          canvas.isDrawingMode = true;
          canvas.freeDrawingBrush.color = '#000000'; // 원하는 색상 설정
      } else if (mode === 'erase') {
          canvas.isDrawingMode = true;
          canvas.freeDrawingBrush.color = '#ffffff'; // 지우개 색상 (배경색으로 설정)
      }
  }
  */
  // 초기 모드 설정 (그리기 모드)
  //setMode('draw');



  cnt = 0
  isStart = false
  //music.play()
 
  document.querySelectorAll(`#${_.id} ul > li`).forEach(elem=>{elem.className = ''})
  
  step = 0
  count = 0

  setLevel()

  isFinish = false

  const videoElement = $.query('video')
  canvasElement = $.query('canvas[name=output_canvas]')
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



export function event(){

  document.querySelector('#K_WRITE td[name=t_1]').addEventListener('click',elem=>{
    $.listen(out=>{
      console.log('listened.....',out)
      calc(elem, out.trim())
    })
  })

  /*
  document.querySelectorAll('#K_WRITE td').forEach(e=>{
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

function start(isStep){
  cnt = 0

  document.querySelectorAll('#K_WRITE td').forEach(e=>{ e.className = ''})

  startTime = Date.now()
  unfocusTime = 0

  clearInterval(intv)

  if(isStep)
    setLevel()

  down = limit[level] 
  chart.set("value", down)    
  map = {}

  clearInterval(intv)

  const arr = []

  const alpha = sample(Object.keys(alphabet))
  arr.push(alpha)
  /*
  document.querySelectorAll('#K_WRITE td').forEach(el=>{
    const alpha = sample(Object.keys(alphabet))
    arr.push(alpha)
   //el.style.backgroundImage = `url('/app/#K_WRITE/${alpha[0]}')`
    //el.style.backgroundSize="100% 100%";
    el.textContent = alpha
  })
  */
  target = arr.random()

  document.querySelector('#K_WRITE td[name=t_1]').textContent = alphabet[target][0]//mapper[target]
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = '240px "Noto Sans KR"'; // 폰트 설정
  ctx.fillStyle = 'rgb(0,0,0,1)'; // 글씨 색상
  ctx.textAlign = "center";
  ctx.fillText(alphabet[target][0], 450, 320); // 글씨와 출력 위치

  orgImg = ctx.getImageData(0, 0, canvas.width, canvas.height)

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = '240px "Noto Sans KR"'; // 폰트 설정
  ctx.fillStyle = 'rgb(0,0,0,0.1)'; // 글씨 색상
  ctx.textAlign = "center";
  ctx.fillText(alphabet[target][0], 450, 320); // 글씨와 출력 위치

  console.log(target,alphabet[target])
  console.log(alphabet[target][Object.keys(alphabet[target])[0]])
  const img = alphabet[target][Object.keys(alphabet[target])[0]]

  const el = document.querySelector('#K_WRITE div[name=target] img')
  el.src = `/image/i_${_.state.topic}/${img}.png`
  //const char = target.split('_')
  //el.textContent = char[1] + ' ' + char[2] + '\n' + alphabet[turn]
  //el.textContent = alphabet[target]
  getAverageRGB(el.src)

  console.log(Object.keys(alphabet[target]),mapper[Object.keys(alphabet[target])])

  document.getElementById('w_human').src =`https://oe-napi.circul.us/v1/txt2human?text="${mapper[target]} ${alphabet[target][Object.keys(alphabet[target])[0]]}"&voice=main&type=mp4&lang=ko`

  $.tts(`${mapper[target]} ${alphabet[target][Object.keys(alphabet[target])[0]]}`)

  setTimeout(()=>{
    $.tts(Object.keys(alphabet[target])[0])
  },1000)

  /*
  setTimeout(()=>{
    const audio = new Audio(`https://s-rapi.circul.us/v1/stream/game/${target}`)
    audio.play()
  },1000)
  */

  intv = setInterval(()=>{
    //alert("test")
    //elem_cnt.innerText = --down
    chart.set( "value", --down )

    const { similarityPercentage, differencePercentage } = compareCanvases(ctx.getImageData(0, 0, canvas.width, canvas.height).data, orgImg.data)
    console.log(`Similarity: ${similarityPercentage.toFixed(2)}%`);
    console.log(`Difference: ${differencePercentage.toFixed(2)}%`);
    //ctx.getImageData(0, 0, canvas.width, canvas.height)

    //elem_cnt.className = 'animate__animated animate__zoomIn'
    /*
    $.tts(mapper[target])

    setTimeout(()=>{
      $.tts(Object.keys(alphabet[target])[0])
    },1000)
    */

    if(similarityPercentage > 90)
      calc($.query('td[name=write]'), alphabet[target][Object.keys(alphabet[target])[0]])

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

function calc(elem, value){
  console.log($.query('td[name=write]'),value)
  const pass = new Audio('/app/ANIMAL/sound/pass.mp3')
  const fail = new Audio('/app/ANIMAL/sound/fail.mp3')
  const spendTime = Date.now() - startTime

  if(value == alphabet[target][Object.keys(alphabet[target])[0]]){ 
    const char = value
    $.tts(value)
    elem.className = 'animate__animated animate__zoomOut'


    clearInterval(intv)
    $.query(`li[name=t${count % 10}]`).className = 'pass'
    $.query('.img').src = '/app/COLOR/image/positive-vote.png'

    $.shuffle(messages)
    //const complete = new Audio('/bot/official-game/sound/complete.mp3')
    pass.play()
    setTimeout(next,2000)
    state[step].scores.push([true, spendTime,unfocusTime])
  
    $.tts(messages[0])
      
  } else if(elem != undefined){

    const char = value
    $.tts(value)
    //audio.play()
    fail.play()

    //elem.target.style.color = 'black'
    //elem.target.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
    elem.className = 'animate__animated animate__flip fail'
    //elem.target.style.backgroundBlendMode = 'overlay';
    
    elemd.textContent = `${value}`
    setTimeout(()=>{
      elem.className = ''
      elem.textContent = ''
      elem.color = ''
    },2000)
  } else {
    clearInterval(intv)


    $.query(`li[name=t${count % 10}]`).className = 'fail'
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