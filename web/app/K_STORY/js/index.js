let isFinish = false
let isStart = false
let pos = 0
let timeout = 0
let intv = 0

let level = 1
let step = 0
let down = 10 
const limit = [20,10,5]

let count = 0
let initTime = 0


let target = 0

const state = [
  { level : -1, scores : []}, // [1/0,time, concent]
  { level : -1, scores : []},
  { level : -1, scores : []}
]

let canvasElement = 0
let canvasCtx = 0

const pass = new Audio('/app/COLOR/sound/pass.mp3')
const fail = new Audio('/app/COLOR/sound/fail.mp3')

const chart = new Donutty( document.getElementById('HEAD_donut'),{ 
  color: "#b22729",
  max : 20,
  value : 20,
  text: function(state) {
    return state.value
  }
})

const music = new Audio('/music/exercise.mp3')
music.volume = 0.5

export function create(){
  document.querySelectorAll(`#${_.id} ul > li`).forEach(elem=>{elem.className = ''})
  document.querySelectorAll(`#${_.id} ul > li`).forEach(elem=>{elem.textContent = ''})
  
  step = 0
  count = 0
  isStart = false
  //music.play()
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
  })

  $.camera.start()

  const alphabet = _.lang == 'ko' ? _DATA[_.state.topic] :  _DATA['en'][_.data]
  
  target = alphabet.random()
  //$.tts('개미와 베짱이 이야기를 들려줄게. 잘 들어봐!')

  start()
}

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

export function talk(recv){
 
}

export function finish(data){
  console.log('finish',data)
  if(isFinish)
    setTimeout($.exit,1500)
}

export function destroy(){
  music.pause()
  music.currentTime = 0
  clearTimeout(timeout)
  clearInterval(intv)
}

let unfocusTime = 0
let lastTime = 0

let wrong = 0
let startTime = 0

function start(isStep){
  startTime = Date.now()
  unfocusTime = 0

  clearInterval(intv)
  
  if(isStep)
    setLevel()

  down = limit[level] 
  chart.set("value", down)    

  intv = setInterval(()=>{
    chart.set( "value", --down )

    if(down == 0)
      start() 
  },1000)

  next()

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

function calc(side){
  clearInterval(intv)
  const spendTime = Date.now() - startTime

  $.query(`li[name=t${count % 10}]`).className = 'pass'
  $.query(`li[name=t${count % 10}]`).textContent = '○'
  next()

  console.log(step, state)
  //state[step].scores.push([true, spendTime,unfocusTime])

  //$.tts('다음 페이지를 읽어보자.')


  /*
  console.log(side,count)

  if(target == side){
    $.query(`td.${target}`).classList.add('pass')
    $.query(`li[name=t${count % 10}]`).className = 'pass'
    pass.play()

    setTimeout(()=>{
      $.query(`td.${target}`).classList.remove('pass')
      next()
    },1000)

    console.log(step, state)
    state[step].scores.push([true, spendTime,unfocusTime])

    pibo.tell('잘했어 친구!')

  } else {
    $.query(`td.${wrong}`).classList.add('fail')
    $.query(`li[name=t${count % 10}]`).className = 'fail'
    fail.play()
    
    setTimeout(()=>{
      $.query(`td.${wrong}`).classList.remove('fail')
      next()
    },1000)

    state[step].scores.push([false, spendTime,unfocusTime])

    pibo.tell('다음번에는 좀더 잘해보는게 좋을것 같아!')
  }
  */
}



/*,
  "en" : [
    "One bright winter day, ants were drying the seeds they had collected during the summer.
    "<speak>Just then, a loach dying of starvation passed by and begged, <voice name="man4">"Can you give me some food?"</voice></speak>",
    "<speak>The ants asked the grasshopper, <voice name="woman8">"Then what did you do instead of storing food during the summer?"</voice></speak>",
    "<speak>The little rascal answered, <voice name="man4">"I didn't even have time to play. I spent every day singing."</voice></speak>",
    "<speak>Then the ants mocked him and said, <voice name="woman8">"If you are so foolish as to sing all summer, then you can skip meals and just dance all winter."</voice></speak>",
  ]
}
  */

function next(){
  pos = 0

  console.log('next',step)

  const stories = _STORY[target].story

  $.query('.title h1').textContent = target
  
  if(step == stories.length){
    clearInterval(intv)
    $.tts(`이야기 잘 들었어? 다음번에 더 재미난 이야기로 찾아갈게!`)
    document.querySelectorAll(`#${_.id} ul.check > li`).forEach(elem=>{elem.className = ''})

    setTimeout($.exit,5000)
  } else {
    $.tts(stories[step],_.lang)
    $.query('img').src = `/image/${_.lang}/${_.data.toLowerCase()}/story/${stories[step]}.jpg`
    $.query('h2[name=script]').innerHTML = `${stories[step].replace(target.toLowerCase(),`<span style='font-size:48px; color:#b92100;'>${target}</span>`)}<p>${_STORY_KO[target].story[step]}` //.replace(/<[^>]*>?/g, '')



    ++step

    //start() // 단계 소개
  }


}


function nextx(){
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

      //pibo.tell(`고생했어! ${Math.round(totalTime/1000)}초 동안, ${advise} 등급으로 게임을 마무리 했어. 총 30회 중에 평균 ${Math.round(pass_time / (30 * 1000))}초로 ${pass_cnt}회 성공했어. ${fail_cnt}회 실패했는데 다음번에 좀더 잘해보자!`)

      pibo.tell(`고생했어! ${Math.round(totalTime/1000)}초 동안, ${advise} 등급으로 게임을 마무리 했어.`)
      
      
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