
_ = {
  id : "HOME",
  lang : 'ko',
  data : "",
  userId : 'pibo',
  len : '',
  state : {
    topic : 'object',
    type : '',
    tutor : 'main',
    repeat : 0,
    level : 0,
    time : 10
  } ,
  script : {} // id and code
}

function $(ev){
  console.log('Target', _.id)
  $.event = ev
  const script = _.script[_.id]
  return script
}

/*
document.getElementById('#home').addEventListener('mouseover',elem=>{
  if(navigator.vibrate)
    navigator.vibrate([200, 100, 200]);
})

/*
var hammertime = new Hammer(document.body);
hammertime.on('swipeleft', function(ev) {
  document.getElementById('home').className = 'animate__animated animate__fadeIn'
  document.getElementById('test').className = 'animate__animated animate__zoomOut'
});

hammertime.on('swiperight', function(ev) {
  //document.getElementById('home').className = 'animate__animated animate__fadeOut'
  document.getElementById('test2').style.display = 'block'
  document.getElementById('test2').className = 'animate__animated animate__slideInRight'
})

hammertime.on('swipeup', function(ev) {
	alert('up')
})

hammertime.on('swipedown', function(ev) {
	alert('down')
})
*/

let isLoad = false

$.load = async (bot, lang='ko', data="" , type='slide', text=bot)=>{
  isLoad = false

  _.lang = lang
  _.data = data

  //$.tts(text)
  $.bg.pause()
  if(navigator.vibrate)
    navigator.vibrate([200, 100, 200]);

  //pibo.mode('avatar',{ value : true})

  console.log('loading',bot)
  // css load

  if(!_.script[bot]){
    isLoad = true
    const css = document.createElement("link")
    css.setAttribute("rel", "stylesheet")
    css.setAttribute("type", "text/css")
    css.setAttribute("href", `/app/${bot}/css/index.css`)
    document.getElementsByTagName("head")[0].appendChild(css)  
    

    // html load
    const data = await fetch(`/app/${bot}/index.html`)
    const html = await data.text()
    const body = html.split('<body>')[1].split('</body>')[0]

    const article = document.createElement("article")
    article.id = bot
    article.innerHTML = body;
    document.querySelector('main').appendChild(article)

    if(type =='slide'){
      document.getElementById(_.id).className = `animate__animated animate__fadeOut`
      //document.getElementById('test').style.display = 'block'
      article.className = `animate__animated animate__fadeIn`
    } else {
      document.getElementById(_.id).className = `animate__animated animate__fadeOut`
      article.className = `animate__animated animate__zoomIn`
    }
  } else {
    if(type =='slide'){
      document.getElementById(_.id).className = `animate__animated animate__fadeOut`
      document.getElementById(bot).style.display = 'block'
      document.getElementById(bot).className = `animate__animated animate__fadeIn`
    } else {
      document.getElementById(_.id).className = `animate__animated animate__fadeOut`
      document.getElementById(bot).style.display = 'block'
      document.getElementById(bot).className = `animate__animated animate__zoomIn`
    }   
  }

  const oldId = _.id

  setTimeout(()=>{
    document.getElementById(oldId).style.display = 'none'
    //_.id = 'MAIN' 
  },1000)

  // script load

  if(!_.script[bot]){
    const script = await import(`/app/${bot}/js/index.js`)
    _.script[bot] = script
    $[bot] = script
    console.log('>',$)

    if(_.script[bot].init){
      const resp = _.script[bot].init(data)
      if(resp instanceof Promise)
        await resp
    }
  } 

  if(_.script[_.id] && _.script[_.id].destroy)
    _.script[_.id].destroy(data)

  _.id = bot

  if(_.script[bot].create)
    _.script[bot].create(data)

  if(_.script[bot].event && isLoad)
    _.script[bot].event(data)
}

let _SPEAK = 0
let isSpeak = false
let _AUDIO = 0
let isPlay = false

$.tts = (text, lang='ko')=>{
  if(isSpeak)
    _SPEAK.pause()

  if(pibo)
    pibo.tell(text, { lang })
  
  isSpeak = true
  //if(isPlay)
  //  _AUDIO.pause()
  //_SPEAK = new Audio(`/v1/tts?text=${text}&lang=${lang}`)
  _SPEAK = new Audio(`http://oe-sapi.circul.us/v1/tts?text=${text}&lang=${lang}&rate=${ lang == 'en' ? 'x-slow' : 'medium'}`)
  _SPEAK.play()
  _SPEAK.addEventListener('ended',e=>{
    isSpeak = false

    if (isPlay)
      fadeOut()
  })
}

let isExit = false

let exitTime = 0

$.exit = (text = '홈 화면으로 돌아갈께.')=>{
  if (!document.fullscreenElement)
    document.documentElement.requestFullscreen()

  if(Date.now() - exitTime < 3000)
    return

  exitTime = Date.now()
  pibo.stop()

  if(isExit || _.id == 'HOME'){
    if(_.id == 'HOME')
      $.tts('사용방법을 알려줄께.')
    return
  }
    
  isExit = true

  //$.bg.play()
  //$.tts(text)
  if(_.script[_.id] && _.script[_.id].destroy){
    _.script[_.id].destroy()
  }

  document.querySelector('footer').style.visibility = 'hidden'
  //pibo.mode('avatar',{ value : false})

  if($.camera)
    $.camera.stop()
  

  document.getElementById('HOME').className = 'animate__animated animate__fadeIn'
  document.getElementById(_.id).className = 'animate__animated animate__zoomOut'
  document.getElementById('HOME').style.display = 'block'
  setTimeout(()=>{
    document.getElementById(_.id).style.display = 'none'
    _.id = 'HOME' 
    isExit = false

    if($.isRepeat){
      $.bg.pause()
      repeat()
    }
  },1000)
}


$.play = (url)=>{  
  //if(isPlay)
  //  _AUDIO.stop()
  isPlay = true
  _AUDIO = new Audio(url)
  _AUDIO.volume = 0.5
  _AUDIO.play()

  _AUDIO.addEventListener('ended',e=>{
    isPlay = false
  })
}

$.fade = 0

$.stop = ()=>{
  if(_AUDIO)
    _AUDIO.pause()
}

window.oncontextmenu = ev=>{
  if(_.script[_.id].oncontextmenu){
    ev.preventDefault()
    //ev.stopPropagation()
    $.event = ev
    _.script[_.id].oncontextmenu(ev)
  }
}


$.query = path =>{
  return document.querySelector(`#${_.id} ${path}`)
}

$.queryAll = path =>{
  return document.querySelectorAll(`#${_.id} ${path}`)
}

$.onContextMenu = 

// https://developer.mozilla.org/ko/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
$.getType = fileName=> {
  if(fileName.indexOf('.') <0)
    return 'application/octet-stream'
  else {
    const ext = fileName.split('.')[1]
    //https://www.feedforall.com/mime-types.htm
    switch(ext){
      case 'avi':
        return 'video/x-msvideo'
      case 'jpeg':
      case 'jpg':
        return 'image/jpeg'
      case 'css':
        return 'text/css'
      case 'gif':
        return 'image/gif' 
      case 'htm':
      case 'html':        
        return 'text/html' 
      case 'js':
        return 'text/javascript' 
      case 'json':
        return 'application/json' 
      case 'mid':        
      case 'midi':
        return 'audio/midi' 
      case 'mpeg':
        return 'video/mpeg' 
      case 'mp3':
        return 'audio/mpeg'   
      case 'mp4':
        return 'video/mp4'     
      case 'pdf':
        return 'application/pdf'        
      case 'wav':
        return 'audio/x-wav' 
      case 'xml':
        return 'application/xml' 
      case 'zip':
        return 'application/zip'   
      case 'png':
        return 'image/png'                         
      default:
        return 'application/octet-stream'               
    }
  }
}

$.isBlob = fileName=> {
  if(fileName.indexOf('.') <0)
    return 'application/octet-stream'
  else {
    const ext = fileName.split('.')[1]
    //https://www.feedforall.com/mime-types.htm
    switch(ext){
      case 'avi':
      case 'jpeg':
      case 'jpg':
      case 'gif':
      case 'mpeg':
      case 'mp3':
      case 'mp4':
      case 'pdf':
      case 'wav':
      case 'zip':
      case 'png':
        return true                         
      default:
        return false               
    }

  }

}

// https://thewebdev.info/2021/10/14/how-to-playback-html-audio-with-fade-in-and-fade-out-with-javascript/
function fadeOut(){
  clearInterval($.fade)
  $.fade = setInterval(() => {
    if (_AUDIO.volume > 0.1) 
      _AUDIO.volume -= 0.1
  
    if (_AUDIO.volume < 0.1) {
      _AUDIO.volume = 0
      _AUDIO.pause()
      clearInterval($.fade)
    }
  }, 100);
}

/*
document.addEventListener('keydown',e=>{
  e.preventDefault()
  console.log(e)
  if (e.keyCode == 36)
    e.preventDefault()
  
})
*/

$.pose = new Pose({locateFile: (file) => {
  return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
}})

$.pose.setOptions({
  selfieMode: true,
  modelComplexity: 1,
  smoothLandmarks: true, // clap
  //enableSegmentation: true,
  //smoothSegmentation: true,
  minDetectionConfidence: 0.7,
  minTrackingConfidence: 0.7
})

$.faceMesh = new FaceMesh({locateFile: (file) => {
  return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
}})

$.faceMesh.setOptions({
  selfieMode: true,
  maxNumFaces: 1,
  //refineLandmarks: true,
  minDetectionConfidence: 0.7,
  minTrackingConfidence: 0.7,
})

$.hands = new Hands({locateFile: (file) => {
  return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
}})

$.hands.setOptions({
  selfieMode: true,
  maxNumHands: 2,
  modelComplexity: 1,
  minDetectionConfidence: 0.7,
  minTrackingConfidence: 0.7
})

$.bg = new Audio('/music/main.mp3')
$.bg.volume = 0.2

$.rand = (min, max)=>{
  return ~~(Math.random() * (max - min + 1)) + min
}

Array.prototype.random = function () {
  return this[Math.floor((Math.random()*this.length))]
}

$.shuffle = array=> { 
  array.sort(() => Math.random() - 0.5)
}

$.listen = cb=>{
  let chunks = []

  if(!$.isRecord){

    console.log("Recording started")
    $.isRecord = true
    //$.query('[name=prompt]').className = 'listen'
    navigator.mediaDevices.getUserMedia({audio: true, video: false}).then(stream=> {

      mediaRecorder = new MediaRecorder(stream, {audioBitsPerSecond: 16000 }) // mimeType :"audio/ogg"

      mediaRecorder.ondataavailable = (e) => {
        chunks.push(e.data)
      }

      mediaRecorder.onstop = (e) => {
        console.log("recorder stopped");
        const fd = new FormData();
        fd.append("file", new Blob(chunks, { type: 'audio/ogg;codecs=opus' }), 'voice.ogg')
      
        fetch(`https://oe-sapi.circul.us/v1/stt?lang=en`, { // https://oe-sapi.circul.us/v1/stt // https://222.112.0.215:59501/v1/stt
          method: 'POST',
          body: fd
        }).then(async res=>{
          const result = await res.json()
          console.log('speech end---',result)
          if(cb)
            cb(result.data.text)
        })
      }

      mediaRecorder.start()

     // $.query(".mic").classList.add('listen')

    }).catch(function(err) {
        console.log(err)
        $.isRecord = false
        mediaRecorder.stop()
        //$.query(".mic").classList.remove('listen')
        //$.query('[name=prompt]').className = ''
        (new Audio("./sound/face.mp3")).play()
    })

  } else {

    $.isRecord = false
    mediaRecorder.stop()
    //$.query(".mic").classList.remove('listen')
    //$.query('[name=prompt]').className = ''

  }

}


$.setTopic = topic =>{ // 주제
  _.state.topic = topic
  $.queryAll('fieldset[name=topic] button').forEach(elem=>{elem.className = 'w50'})
  $.query(`fieldset[name=topic] button[name=${topic}]`).className = 'w50 click'
}

$.setType = type =>{ // 자음 / 모음
  _.state.type = type
  $.queryAll('fieldset[name=type] button').forEach(elem=>{elem.className = 'w50'})
  $.query(`fieldset[name=type] button[name=${type}]`).className = 'w50 click'
}

$.setLevel = level =>{ // 난이도
  _.state.level = level
  $.queryAll('fieldset[name=level] button').forEach(elem=>{elem.className = 'w50'})
  $.query(`fieldset[name=level] button[name=${level}]`).className = 'w50 click'
}

$.setTutor = tutor =>{
  _.state.tutor = tutor
  $.queryAll('fieldset[name=tutor] button').forEach(elem=>{elem.className = 'w50'})
  $.query(`fieldset[name=tutor] button[name=${tutor}]`).className = 'w50 click'
}

$.setRepeat = repeat =>{ // 반복
  _.state.repeat = repeat
  $.queryAll('fieldset[name=repeat] button').forEach(elem=>{elem.className = 'w50'})
  $.query(`fieldset[name=repeat] button[name=${repeat}]`).className = 'w50 click'
}

$.setTime = time =>{ //시간
  _.state.time = time
  $.queryAll('fieldset[name=time] button').forEach(elem=>{elem.className = 'w50'})
  $.query(`fieldset[name=time] button[name=${time}]`).className = 'w50 click'
}


$.getVowel = kor => {
  const f = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ',
             'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ',
             'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
  const s = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ',
             'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ',
             'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'];
  const t = ['', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ',
             'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ',
             'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ',
             'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];

  const ga = 44032;
  let uni = kor.charCodeAt(0);

  uni = uni - ga;

  let fn = parseInt(uni / 588);
  let sn = parseInt((uni - (fn * 588)) / 28);
  let tn = parseInt(uni % 28);

  return {
      f: f[fn],
      s: s[sn],
      t: t[tn]
  }
}

$.message = {
  pass : [
    "이렇게만 계속 하면 될것같아!",
    "탁월한 솜씨인걸? 너무 잘했어.",
    "정말 대회 나가도 될것 같아!"
  ],
  fail : [
    "이번에는 좀더 잘해 보자.",
    "집중해서 이번 게임을 해보자.",
    "한눈팔지 말고 집중해 보자."
  ]
}