//alert('hello world')

const preset = {
  snd1 : new Audio('/app/PIANO/sound/sound1.mp3'),
  snd2 : new Audio('/app/PIANO/sound/sound2.mp3'),
  snd3 : new Audio('/app/PIANO/sound/sound3.mp3'),
  snd4 : new Audio('/app/PIANO/sound/sound4.mp3'),
  snd5 : new Audio('/app/PIANO/sound/sound5.mp3'),
  snd6 : new Audio('/app/PIANO/sound/sound6.mp3'),
  snd7 : new Audio('/app/PIANO/sound/sound7.mp3'),
  snd8 : new Audio('/app/PIANO/sound/sound8.mp3')
}

const messages = [
  "너무 잘했어",
  "탁월한 솜씨인걸?",
  "대회 나가도 될것 같아!"
]

let isFinish = false
let timeout = 0
let intv = 0

let level = 1
let step = 0
let down = 10 
const limit = [20,10,5]

let cnt = 0

let count = 0
let initTime = 0
let unfocusTime = 0

const state = [
  { level : -1, scores : []}, // [1/0,time, concent]
  { level : -1, scores : []},
  { level : -1, scores : []}
]


const chart = new Donutty( document.getElementById( "PIANO_D" ),{ 
  color: "#2870b3",
  max : 20,
  value : 20,
  text: function(state) {
    return state.value
  }
})

const pass = new Audio('/app/COLOR/sound/pass.mp3')
const fail = new Audio('/app/COLOR/sound/fail.mp3')
const complete = new Audio('/app/COLOR/sound/complete.mp3')

const music = new Audio('/music/train.mp3')
music.volume = 0.5

export function create(){

  music.play()
  //const elem_count = document.querySelector('#COLOR div[name=count]')

  step = 0
  count = 0

  setLevel()

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

  document.querySelectorAll('#PIANO td').forEach(e=>{

    //e.innerText = numbers[i++]
  
    e.addEventListener('click',elem=>{
  
      const piano = {
        snd1 : new Audio('/app/PIANO/sound/sound1.mp3'),
        snd2 : new Audio('/app/PIANO/sound/sound2.mp3'),
        snd3 : new Audio('/app/PIANO/sound/sound3.mp3'),
        snd4 : new Audio('/app/PIANO/sound/sound4.mp3'),
        snd5 : new Audio('/app/PIANO/sound/sound5.mp3'),
        snd6 : new Audio('/app/PIANO/sound/sound6.mp3'),
        snd7 : new Audio('/app/PIANO/sound/sound7.mp3'),
        snd8 : new Audio('/app/PIANO/sound/sound8.mp3')
      }
  
      console.log(elem.target.attributes.name.textContent, elem.target.textContent)
  
      const value = elem.target.attributes.name.textContent
      piano[value].play()

      calc(elem, value)
    
      
    })
  
    e.addEventListener('mouseover',elem=>{
      console.log(elem.target.attributes.name.textContent, elem.target.textContent)  
      const value = elem.target.textContent

    })
  })

  start()
}

export function destroy(){
  clearInterval(intv)
  music.pause()
  music.currentTime = 0
}

let target = 0
let startTime = 0

function start(isStep){

  document.querySelectorAll(`#${_.id} .top td`).forEach(elem=>{elem.className = ''})

  cnt = 1
  target = [$.rand(1,8),$.rand(1,8),$.rand(1,8)]

  startTime = Date.now()
  unfocusTime = 0

  clearInterval(intv)

  if(isStep)
    setLevel()

  down = limit[level] 
  chart.set("value", down)    

  pibo.play(`/home/pi/pibo-resource/sound/sound${target[0]}.mp3`,{ motion : 'yes_h'})
  pibo.play(`/home/pi/pibo-resource/sound/sound${target[1]}.mp3`,{ motion : 'yes_h'})
  pibo.play(`/home/pi/pibo-resource/sound/sound${target[2]}.mp3`,{ motion : 'yes_h'})
  
  $.query('td[name=key1] img').src = `/app/PIANO/image/snd${target[0]}.png`
  $.query('td[name=key2] img').src = `/app/PIANO/image/snd${target[1]}.png`
  $.query('td[name=key3] img').src = `/app/PIANO/image/snd${target[2]}.png`

  /*
  preset[`snd${key[0]}`].play()
  setTimeout(preset[`snd${key[1]}`].play,2000)
  setTimeout(preset[`snd${key[2]}`].play,4000)
  */
  intv = setInterval(()=>{
    chart.set( "value", down-- )

    if(down == 0)
      calc() // fail
    
  },1000)  

}

function onResults(results) {
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
  if (results.multiFaceLandmarks) {

    for (const landmarks of results.multiFaceLandmarks) {
      //console.log(landmarks)
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

function calc(elem,value){
  const spendTime = Date.now() - startTime

  if(value == `snd${target[cnt - 1]}`){
    document.querySelector(`#PIANO td[name=key${cnt++}]`).classList.add('pass')

    pass.play()
    elem.target.className = 'animate__animated animate__zoomOut'
    
    if( pibo && pibo.motion)
      pibo.motion('happy',{ cycle : 1})

    setTimeout(()=>{
      elem.target.className = ''
    },500)

    if( cnt > 3 ){ // three cord
      clearInterval(intv)
      $.query(`li[name=t${count % 10}]`).className = 'pass'
      clearInterval(interval)
      complete.play()

      $.shuffle(messages)
      if(pibo && pibo.tell)
        pibo.tell(messages[0])

      pibo.tell('잘했어 친구!')
      state[step].scores.push([true, spendTime,unfocusTime])

      setTimeout(next,2000)
    }
    
  } else if(elem != undefined) {
    fail.play()
    elem.target.className = 'animate__animated animate__flip fail'

    setTimeout(()=>{
      elem.target.className = ''
    },500)

  } else {
    clearInterval(intv)
    if(pibo && pibo.motion)
      pibo.motion('sad',{ cycle : 1})
    $.query(`li[name=t${count % 10}]`).className = 'fail'
    state[step].scores.push([false, spendTime,unfocusTime])
    pibo.tell('다음번에는 좀더 잘해보는게 좋을것 같아!')

    setTimeout(next,2000)
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