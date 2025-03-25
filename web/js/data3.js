const _DATA = {
    en : {
        "A": ["airplane","alligator","ambulance","ant","apple","armond"],//, "ant", "arm"],
        "B": ["ball","bear","bell","bicycle","bird","bus"],//, "bat", "bed"], 
        "AB": ["airplane","alligator","ambulance","ant","apple","armond", "ball","bear","bell","bicycle","bird","bus"],
        "C": ["cat"],//, "car", "cup"],
        "D": ["dog"],//, "dad", "dot"], 2
        "E": ["egg"],//, "ear", "eye"],
        "F": ["fox"],//, "fun", "fox"], 3
        "G": ["goat"],//, "gum", "gift"],
        "H": ["hat"],//, "hop", "hug"], 4
        "I": ["ice"],//, "ink", "ill"],
        "J": ["jam"],//, "jet", "jug"], 5
        "K": ["key"],//, "kit", "kid"],
        "L": ["lip"],//, "lip", "leg"], 6
        "M": ["man"],//, "map", "mat"],
        "N": ["net"],//, "nap", "nut"], 7
        "O": ["owl"],//, "off", "oil"],
        "P": ["pen"],//, "pig", "pot"], 8
        "Q": ["quiz"],//, "quit", "queen"],
        "R": ["rat"],//, "run", "red"], 9
        "S": ["sun"],//, "sit", "sad"],
        "T": ["top"],//, "tap", "toy"], 10
        "U": ["up"],//, "up", "use"],
        "V": ["van"],//, "vet", "vase"], 11
        "W": ["win"],//, "wet", "wig"],
        "X": ["xray"],//, "box", "fox"],12
        "Y": ["yak"],//, "yes", "yarn"],
        "Z": ["zoo"],//, "zoo", "zap"] 13
    },
    object : {
        "ㄱ": ["가방","구두","그네"],
        "ㄴ": ["넥타이","냄비","냉장고"],
        "ㄷ": ["드라이기","다리","단추"],
        "ㄹ": ["라디오","리본","립스틱"],
        "ㅁ": ["모자","마이크","미끄럼틀"],
        "ㅂ": ["반지","빗","비행기"],
        "ㅅ": ["시소","시계","색연필"],
        "ㅇ": ["어항","유모차","의자"],
        "ㅈ": ["자동차","주사위","자전거"],
        "ㅊ": ["책","칫솔","청소기"],
        "ㅋ": ["컴퓨터","커튼","카메라"],
        "ㅌ": ["티셔츠","트럭","튜브"],
        "ㅍ": ["프라이팬","피아노","퍼즐"],
        "ㅎ": ["허수아비","휴지","핸드폰"]
        
    },
    food : {
        "ㄱ" : ["김밥","계란프라이","감자튀김"],
        "ㄴ" : ["냉면","녹차","송편"],
        "ㄷ" : ["두부","도넛","돈까스"],
        "ㄹ" : ["라면","롤케이크","레몬에이드"],
        "ㅁ" : ["만두","물","마카롱"],
        "ㅂ" : ["붕어빵","밥","불고기"],
        "ㅅ" : ["소시지","스테이크","샌드위치"],
        "ㅇ" : ["우유","아이스크림","요구르트"],
        "ㅈ" : ["자장면","장어구이","잼"],
        "ㅊ" : ["치킨","초밥","초콜릿"],
        "ㅋ" : ["카레","쿠키","커피"],
        "ㅌ" : ["토스트","타코","탕후루"],
        "ㅍ" : ["피자","파스타","팝콘"],
        "ㅎ" : ["햄버거","핫도그","호떡"],
        
    },
    animal : {
        "ㄱ" : ["감","귤","구아바"],
        "ㄴ" : ["바나나"],		
        "ㄷ" : ["딸기","두리안","대추"],
        "ㄹ" : ["레몬","라임","리치"],
        "ㅁ" : ["망고","무화과","멜론"],
        "ㅂ" : ["블루베리","배","복숭아"],
        "ㅅ" : ["사과","수박","석류"],
        "ㅇ" : ["용과","아보카도","올리브"],
        "ㅈ" : ["자두","자몽"],	
        "ㅊ" : ["체리","청포도","참외"],
        "ㅋ" : ["키위","코코넛"],	
        "ㅌ" : ["토마토"],		
        "ㅍ" : ["포도","파인애플","파파야"],
        "ㅎ" : ["한라봉"]		
              
    },
    fruit : {
        "ㄱ" : ["고양이","개","기린"],
        "ㄴ" : ["나비","너구리","늑대"],
        "ㄷ" : ["돼지","달팽이","독수리"],
        "ㄹ" : ["라마","고릴라","얼룩말"],
        "ㅁ" : ["말","곰","다람쥐"],
        "ㅂ" : ["뱀","비둘기","반딧불이"],
        "ㅅ" : ["사슴","사자","소"],
        "ㅇ" : ["원숭이","악어","오리"],
        "ㅈ" : ["쥐","지렁이","공작새"],
        "ㅊ" : ["치타","참새","고슴도치"],
        "ㅋ" : ["코끼리","코알라","캥거루"],
        "ㅌ" : ["타조","토끼","낙타"],
        "ㅍ" : ["판다","표범","플라밍고"],
        "ㅎ" : ["하이에나","호랑이","하마"]
    }
}

const _SENTENCE = {
    "airplane": [
      "Airplanes fly high.",
      "I see an airplane.",
      "Airplanes are big."
    ],
    "alligator": [
      "Alligators have teeth.",
      "Green alligators swim.",
      "Alligators eat fish."
    ],
    "ambulance": [
      "Ambulances are loud.",
      "I hear an ambulance.",
      "Ambulances help people."
    ],
    "ant": [
      "Ants are tiny.",
      "Ants work hard.",
      "I see ten ants."
    ],
    "apple": [
      "Apples are red.",
      "I eat an apple.",
      "Apples taste sweet."
    ],
    "armond": [
      "Armonds are crunchy.",
      "I like armonds.",
      "Armonds grow on trees."
    ],
    "ball": [
      "I kick the ball.",
      "The ball rolls.",
      "Balls bounce high."
    ],
    "bear": [
      "Bears are furry.",
      "Bears eat honey.",
      "Bears sleep long."
    ],
    "bell": [
      "Bells ring loud.",
      "I hear the bell.",
      "School bells chime."
    ],
    "bicycle": [
      "I ride bikes.",
      "Bikes have wheels.",
      "My bike is blue."
    ],
    "bird": [
      "Birds can fly.",
      "Birds sing songs.",
      "Birds build nests."
    ],
    "bus": [
      "Buses are yellow.",
      "I ride the bus.",
      "Many take buses."
    ]
  }

 const _STORY = {
  "airplane": {
    "title": "My First Airplane Ride",
    "story": [
      "The airplane is big and white.",
      "I climb into the airplane with my mom.",
      "The airplane flies high above the clouds.",
      "I see tiny houses from the airplane window.",
      "The airplane lands safely at our new home."
    ]
  },
  "alligator": {
    "title": "Ally the Alligator",
    "story": [
      "Ally the alligator lives in a swamp.",
      "The alligator has many sharp teeth.",
      "This alligator loves to swim in muddy water.",
      "The alligator makes friends with a turtle.",
      "Every night, the alligator sleeps under the stars."
    ]
  },
  "ambulance": {
    "title": "The Brave Ambulance",
    "story": [
      "The ambulance waits at the hospital.",
      "When people call, the ambulance rushes to help.",
      "The ambulance has bright lights and a loud siren.",
      "Doctors ride in the ambulance to help sick people.",
      "The ambulance brings everyone safely to the hospital."
    ]
  },
  "ant": {
    "title": "Andy the Ant",
    "story": [
      "Andy the ant lives under a big tree.",
      "The ant works hard to find food every day.",
      "This little ant carries crumbs bigger than itself.",
      "The ant shares food with all its friends.",
      "At night, the ant sleeps in its tiny home."
    ]
  },
  "apple": {
    "title": "The Red Apple",
    "story": [
      "A red apple grows on a tall tree.",
      "The sun makes the apple grow big and sweet.",
      "A boy picks the apple from the tree.",
      "He takes a bite of the juicy apple.",
      "The apple was the best he ever tasted."
    ]
  },
  "armond": {
    "title": "Armond's Adventure",
    "story": [
      "Armond finds a magic key in his garden.",
      "With the key, Armond opens a secret door.",
      "Behind the door, Armond sees a beautiful forest.",
      "Armond meets friendly animals who show him around.",
      "When it's time to go home, Armond promises to return soon."
    ]
  },
  "ball": {
    "title": "The Bouncy Ball",
    "story": [
      "Tim got a new red ball for his birthday.",
      "The ball bounces very high when he throws it.",
      "One day, the ball rolls into the neighbor's yard.",
      "Tim finds his ball behind some flowers.",
      "He plays with his ball every afternoon now."
    ]
  },
  "bear": {
    "title": "Berry the Bear",
    "story": [
      "Berry the bear lives in a forest cave.",
      "The bear loves to eat honey and berries.",
      "When winter comes, the bear gets very sleepy.",
      "The bear sleeps through the cold snowy months.",
      "In spring, the bear wakes up hungry and happy."
    ]
  },
  "bell": {
    "title": "The Magic Bell",
    "story": [
      "Sara finds a small golden bell in the attic.",
      "When she rings the bell, butterflies appear.",
      "The bell makes different colors when shaken gently.",
      "Sara shows the bell to her best friend Tom.",
      "They discover the bell grants one wish every full moon."
    ]
  },
  "bicycle": {
    "title": "My First Bicycle",
    "story": [
      "Dad brings home a shiny new bicycle.",
      "The bicycle has two wheels and blue handlebars.",
      "I learn to ride my bicycle in the park.",
      "My bicycle goes fast when I pedal hard.",
      "I love riding my bicycle every day."
    ]
  },
  "bird": {
    "title": "Blu the Bird",
    "story": [
      "Blu the bird builds a nest in our tree.",
      "The bird lays three tiny blue eggs.",
      "Every morning, the bird sings a beautiful song.",
      "We watch the bird teach its babies to fly.",
      "When autumn comes, the bird flies south for winter."
    ]
  },
  "bus": {
    "title": "The Yellow Bus",
    "story": [
      "The yellow bus stops at my house every morning.",
      "I climb onto the bus with my lunch box.",
      "The bus takes me and my friends to school.",
      "After school, the bus brings us back home.",
      "I wave goodbye to the bus driver until tomorrow."
    ]
  }
}


const _STORY_KO = {
  "airplane": {
    "title": "나의 첫 비행기 여행",
    "story": [
      "비행기는 크고 하얘요.",
      "엄마와 함께 비행기에 올라요.",
      "비행기는 구름 위로 높이 날아요.",
      "비행기 창문으로 작은 집들이 보여요.",
      "비행기가 우리의 새 집에 안전하게 착륙해요."
    ]
  },
  "alligator": {
    "title": "악어 앨리",
    "story": [
      "악어 앨리는 늪지에 살아요.",
      "악어는 날카로운 이빨이 많아요.",
      "이 악어는 진흙탕 물에서 수영하는 것을 좋아해요.",
      "악어는 거북이와 친구가 돼요.",
      "매일 밤, 악어는 별 아래에서 자요."
    ]
  },
  "ambulance": {
    "title": "용감한 구급차",
    "story": [
      "구급차는 병원에서 기다려요.",
      "사람들이 부르면, 구급차는 도우러 달려가요.",
      "구급차는 밝은 불빛과 시끄러운 사이렌이 있어요.",
      "의사들은 아픈 사람들을 돕기 위해 구급차를 타요.",
      "구급차는 모든 사람을 안전하게 병원으로 데려와요."
    ]
  },
  "ant": {
    "title": "개미 앤디",
    "story": [
      "개미 앤디는 큰 나무 아래에 살아요.",
      "개미는 매일 음식을 찾기 위해 열심히 일해요.",
      "이 작은 개미는 자기보다 더 큰 빵 부스러기를 나르고 있어요.",
      "개미는 모든 친구들과 음식을 나눠요.",
      "밤에는 개미가 작은 집에서 자요."
    ]
  },
  "apple": {
    "title": "빨간 사과",
    "story": [
      "빨간 사과가 높은 나무에서 자라요.",
      "태양이 사과를 크고 달콤하게 만들어요.",
      "한 소년이 나무에서 사과를 따요.",
      "그는 즙이 많은 사과를 한 입 베어 물어요.",
      "그 사과는 그가 지금까지 맛본 것 중 최고였어요."
    ]
  },
  "armond": {
    "title": "아몬드의 모험",
    "story": [
      "아몬드는 정원에서 마법 열쇠를 찾아요.",
      "열쇠로 아몬드는 비밀 문을 열어요.",
      "문 뒤에 아몬드는 아름다운 숲을 봐요.",
      "아몬드는 그를 안내해주는 친절한 동물들을 만나요.",
      "집에 갈 시간이 되었을 때, 아몬드는 곧 돌아오기로 약속해요."
    ]
  },
  "ball": {
    "title": "통통 튀는 공",
    "story": [
      "팀은 생일에 새 빨간 공을 받았어요.",
      "그가 던지면 공이 아주 높이 튀어요.",
      "어느 날, 공이 이웃집 마당으로 굴러갔어요.",
      "팀은 꽃 뒤에서 자기 공을 찾았어요.",
      "이제 그는 매일 오후에 공을 가지고 놀아요."
    ]
  },
  "bear": {
    "title": "곰 베리",
    "story": [
      "곰 베리는 숲속 동굴에 살아요.",
      "곰은 꿀과 베리를 먹는 것을 좋아해요.",
      "겨울이 오면, 곰은 매우 졸려져요.",
      "곰은 춥고 눈 내리는 달 동안 잠을 자요.",
      "봄이 되면, 곰은 배고프고 행복하게 일어나요."
    ]
  },
  "bell": {
    "title": "마법의 종",
    "story": [
      "사라는 다락방에서 작은 금색 종을 찾아요.",
      "종을 울리면, 나비들이 나타나요.",
      "종을 부드럽게 흔들면 다양한 색깔이 나와요.",
      "사라는 그녀의 가장 친한 친구 톰에게 종을 보여줘요.",
      "그들은 종이 보름달 때마다 소원을 하나씩 들어준다는 것을 발견해요."
    ]
  },
  "bicycle": {
    "title": "나의 첫 자전거",
    "story": [
      "아빠가 반짝이는 새 자전거를 집에 가져와요.",
      "자전거는 두 개의 바퀴와 파란색 핸들이 있어요.",
      "공원에서 자전거 타는 법을 배워요.",
      "페달을 열심히 밟으면 자전거가 빨리 가요.",
      "매일 자전거 타는 것을 좋아해요."
    ]
  },
  "bird": {
    "title": "새 블루",
    "story": [
      "새 블루는 우리 나무에 둥지를 지어요.",
      "새는 세 개의 작은 파란색 알을 낳아요.",
      "매일 아침, 새는 아름다운 노래를 불러요.",
      "우리는 새가 새끼들에게 날기를 가르치는 것을 지켜봐요.",
      "가을이 오면, 새는 겨울을 보내기 위해 남쪽으로 날아가요."
    ]
  },
  "bus": {
    "title": "노란 버스",
    "story": [
      "노란 버스가 매일 아침 우리 집에 멈춰요.",
      "도시락을 들고 버스에 올라요.",
      "버스는 나와 친구들을 학교에 데려다 줘요.",
      "방과 후, 버스는 우리를 집으로 다시 데려다 줘요.",
      "내일까지 버스 운전사에게 손을 흔들며 작별 인사를 해요."
    ]
  }
}  


const _MAPPER = {
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

const _MAPPER_EN = {
    "A" : "A",
	"B" : "B",
	"C" : "C",
	"D" : "D",
	"E" : "E",
	"F" : "F",
	"G" : "G",
	"H" : "H",
	"I" : "I",
	"J" : "J",
	"K" : "K",
	"L" : "L",
	"M" : "M",
	"N" : "N",
    "O" : "O",    
	"P" : "P",    
    "Q" : "Q",    
	"R" : "R",    
    "S" : "S",    
    "T" : "T",    
    "U" : "U",    
    "V" : "V",    
    "W" : "W",    
    "X" : "X",    
    "Y" : "Y",    
    "Z" : "Z"
}
