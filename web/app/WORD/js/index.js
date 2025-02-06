const complete = new Audio(`./sound/complete.mp3`)

const stat = {
  pass : 0,
  fail : 0,
  key_pass : 0, 
  key_fail : 0,
  fastTime : 9999999999999999999999999999999999, // 기록
  slowTime : 0,
  duration : 0, // 총 시간
}

let alphabet = _.lang == 'ko' ? _DATA[_.state.topic] :  _DATA['en']
let mapper = _.lang == 'ko' ?  _MAPPER : _MAPPER_EN

if(_.lang = 'en'){
  _.state.topic = 'en'
}
/*{
	"ㄱ" : ["김밥","계란프라이","감자튀김"],
	"ㄴ" : ["냉면","녹차"],
	"ㄷ" : ["두부","도넛","돈까스"],
	"ㄹ" : ["라면","롤케이크","레몬에이드"],
	"ㅁ" : ["만두","물","마카롱"],
	"ㅂ" : ["붕어빵","불고기","밥"],
	"ㅅ" : ["소시지","스테이크","샌드위치"],
	"ㅇ" : ["우유","아이스크림","요구르트"],
	"ㅈ" : ["자장면","장어구이","잼"],
	"ㅊ" : ["치킨","초밥","초콜릿"],
	"ㅋ" : ["카레","쿠키"],
	"ㅌ" : ["토스트","타코","탕후루"],
	"ㅍ" : ["피자","파스타","팝콘"],
	"ㅎ" : ["햄버거","핫도그","호떡"]
}

const mapper = {
	"ㄱ" : "기역",
	"ㄴ" : "니은",
	"ㄷ" : "디귿",
	"ㄹ" : "리을",
	"ㅁ" : "미음",
	"ㅂ" : "비읍",
	"ㅅ" : "시옷",
	"ㅇ" : "이응",
	"ㅈ" : "지읒",
	"ㅊ" : "치읓",
	"ㅋ" : "키역",
	"ㅌ" : "티긑",
	"ㅍ" : "피읖",
	"ㅎ" : "히읍"
}
*/
let point = 0
let item = null

let isFinish = false
let timeout = 0
let intv = 0

let level = 1
let step = 0
let down = 25 
const limit = [30,25,20]

let cnt = 0

let count = 0
let initTime = 0
let unfocusTime = 0

const state = [
  { level : -1, scores : []}, // [1/0,time, concent]
  { level : -1, scores : []},
  { level : -1, scores : []}
]

const chart = new Donutty( document.getElementById( "WORD_D" ),{ 
  color: "#2870b3",
  max : 30,
  value : 30,
  text: function(state) {
    return state.value
  }
})

/*
const pass = new Audio('/app/COLOR/sound/pass.mp3')
const fail = new Audio('/app/COLOR/sound/fail.mp3')
const complete = new Audio('/app/COLOR/sound/complete.mp3')
*/

const music = new Audio('/music/train.mp3')
music.volume = 0.5

export function create(){
 // music.play()


  alphabet = _.lang == 'ko' ? _DATA[_.state.topic] :  _DATA['en']
  mapper = _.lang == 'ko' ?  _MAPPER : _MAPPER_EN

  if(_.lang = 'en'){

    $.queryAll('tr[name=en]').forEach(item=>{
      item.style.display = ''
    })
    $.queryAll('tr[name=ko]').forEach(item=>{
      item.style.display = 'none'
    })
    _.state.topic = 'en'
  } else {
    $.queryAll('tr[name=ko]').forEach(item=>{
      item.style.display = ''
    })
    $.queryAll('tr[name=en]').forEach(item=>{
      item.style.display = 'none'
    })  }

  document.querySelectorAll(`#${_.id} ul > li`).forEach(elem=>{elem.className = ''})
  document.querySelectorAll(`#${_.id} ul > li`).forEach(elem=>{elem.textContent = ''})
  
  step = 0
  count = 0

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
  $.camera.start()

  start()
}

export function destroy(){
  clearInterval(intv)
  music.pause()
  music.currentTime = 0
}

let target = 0
let startTime = 0

let lastTime = Date.now()

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
  startTime = Date.now()

  document.querySelector("tr[name=word]").innerHTML = ""
  
  step = 0
  point = 0
  unfocusTime = 0

  clearInterval(intv)

  if(isStep)
    setLevel()

  down = limit[level] 
  chart.set("value", down)   
  
  const target = Object.keys(alphabet).random()

  let str = alphabet[target][0]
  if(_.lang == 'ko'){

    for(let i = 0 ; i < alphabet[target][0].length ; i++){
      const v = $.getVowel(alphabet[target][0].charAt(i))
      str += v.f+v.s+v.t
    }
  }

  console.log('====vowel',str)
  item = { k : str, value : alphabet[target][0]}

  const eng = new Audio(`http://oe-sapi.circul.us/tts?text=${item.k}&lang=${_.lang}`)
  eng.play()

  for(let i = 0 ; i < item.k.length ; i++){
    const td  = document.createElement('td')
    td.innerText = item.k.charAt(i).toUpperCase()

    let key = item.k.charAt(i).toUpperCase()
    if(item.k.charAt(i) == " ")
      key = "_"
    td.setAttribute('name',`_${i}_${key}`)
    document.querySelector("#WORD tr[name=word]").appendChild(td)
  }

  intv = setInterval(()=>{
    chart.set( "value", --down )

    if(down == 0){
      calc()
    }
  },1000) 

}

export function event(){

  document.querySelectorAll('#WORD table.bottom td').forEach(e=>{

    e.addEventListener('click',elem=>{
      console.log('keyclick',elem.target.textContent)
      let key = elem.target.textContent
   
      if(key == " ")
        key = "_"

      calc(elem,key)
    })
  
    e.addEventListener('mouseover',elem=>{
      console.log(elem.target.attributes.name.textContent, elem.target.textContent)
      const value = elem.target.textContent
    })
  })

  document.addEventListener('keypress',e=>{
    console.log(e)

    let key = e.key
   
    if(key == " ")
      key = "_"

    calc(elem,key)

    /*
    if(item.k[point] == e.key){
      const doc = document.querySelector(`#WORD td[name=_${point++}_${key}]`)
      const pass = new Audio('/app/COLOR/sound/pass.mp3')
      doc.classList.add('pass')
      pass.play()

      ++stat.key_pass

      if(point == item.k.length){
        const ko = new Audio(`https://s-tapi.circul.us/v1/tts?text=${item.v}`)
        ko.play()
        ++stat.pass
        complete.play()
        setTimeout(start,1000)
      }

    } else {
      ++stat.key_fail
      const fail = new Audio('/app/COLOR/sound/fail.mp3')
      fail.play()    
    }
    */

  })
}

pibo.ready = ()=>{

  //let serial = localStorage.getItem('robotId')

  pibo.init('c1546094','ops')

  pibo.receive('pibo',(data)=>{
    if(data.alive)
      document.querySelector(`#WORD button[name=robot]`).classList.add('alive')
    else
      document.querySelector(`#WORD button[name=robot]`).classList.remove('alive')
  }) 

  
  pibo.receive('editor', data=>{
    const point = data.value.split('_')[1]
    document.querySelectorAll("#WORD td.alive").forEach(obj=>obj.classList.remove("alive"));
    document.querySelector(`#WORD td[name="t_time|${point}"]`).className = 'active alive'
  })

  pibo.info(data=>{
    console.log(data)
  })
}

//if(serial != null){
//  pibo.init(serial,'stg') //pibo.init(robotId,'stg')
  /*
  pibo.mode('avatar',{ value : true})
  document.querySelector(`button[name=robot]`).textContent = serial
  pibo.stop()

  pibo.info(data=>{
    document.querySelector('#volume').value = data.config.volume
  })
  */
//} else {
//  serial = prompt('input serial')
//  pibo.init(serial,'ops')
//}

function onResults(results) {
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
  if (results.multiFaceLandmarks) {
    //console.log(results.multiFaceLandmarks)
    //console.log('right,',FACEMESH_RIGHT_EYE)
    //console.log('left,',FACEMESH_LEFT_EYE)

    for (const landmarks of results.multiFaceLandmarks) {
      //console.log(landmarks)
      drawConnectors(canvasCtx, landmarks, FACEMESH_TESSELATION, {color: '#C0C0C070', lineWidth: 1});
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

function setLevel(){
  let lv = 1
  let type = '중급'
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
  
  pibo.tell(`${type} 레벨로 게임을 시작해 볼게.`)

  $.query(`li[name=s${step}`).className = `lv${lv}`
  $.query(`li[name=s${step}`).textContent = type

  state[step].level = lv

  level = lv 
}

function calc(elem, key){
  const spendTime = Date.now() - startTime
  console.log(item.k[point],key)
  
  if(item.k[point].toUpperCase() == key){
    const doc = document.querySelector(`#WORD td[name=_${point++}_${key}]`)
    doc.classList.add('pass')

    const pass = new Audio('/app/COLOR/sound/pass.mp3')
    pass.play()

    if(point == item.k.length){
      clearInterval(intv)
      $.query(`li[name=t${count % 10}]`).className = 'pass'
      state[step].scores.push([true, spendTime,unfocusTime])

      const ko = new Audio(`https://s-tapi.circul.us/v1/tts?text=${item.v}&lang=${_.lang}`)
      ko.play()

      complete.play()
      setTimeout(next,1000)
    }


  } else if(elem != undefined){
    const fail = new Audio('/app/COLOR/sound/fail.mp3')
    fail.play()
    elem.target.className = 'animate__animated animate__flip fail'

    setTimeout(()=>{
        elem.target.className = ''
    },2000)
  } else {
    clearInterval(intv)
    $.query(`li[name=t${count % 10}]`).className = 'fail'
    state[step].scores.push([false, spendTime,unfocusTime])
    
    const fail = new Audio('/app/COLOR/sound/fail.mp3')
    fail.play()    
    setTimeout(next,1000)
  }
}

function next(){

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

      pibo.tell(`고생했어! ${Math.round(totalTime/1000)}초 동안, ${advise} 등급으로 게임을 마무리 했어. 총 30회 중에 평균 ${Math.round(pass_time / (30 * 1000))}초로 ${pass_cnt}회 성공했어. ${fail_cnt}회 실패했는데 다음번에 좀더 잘해보자!`)
      
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