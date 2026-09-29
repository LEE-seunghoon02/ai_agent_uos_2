// ── 연령대별 관심 프로그램 (추정). 실제 연령대 시청률이 생기면 이 표만 바꾸면 됩니다.
// [제목에 포함된 말, 관심 연령대, 기획의도에 주 시청층이 명시된 연령대]
const AGES = [
  {k:'kid',    n:'어린이·청소년'},
  {k:'young',  n:'20·30대'},
  {k:'mid',    n:'40·50대'},
  {k:'senior', n:'60대 이상'},
];
const AUD = [
  ['뉴스특보',''],['재난방송',''],
  ['뉴스광장','mid senior'],['뉴스 930','mid','mid'],['뉴스 12','mid','mid'],['뉴스 5','mid'],
  ['뉴스 7','senior'],['뉴스 9','mid senior'],['뉴스라인','young mid'],['KBS 뉴스',''],
  ['사사건건','mid senior'],['시사기획 창','young mid'],['추적 60분','young mid'],['남북의 창','senior'],
  ['일요진단','mid senior'],['특파원 보고','young mid'],
  ['무엇이든 물어보세요','mid senior'],['생로병사','mid senior'],['생활의 발견','mid'],
  ['인간극장','mid senior'],['아침마당','senior'],['다큐멘터리 3일','young mid'],['같이 삽시다','mid'],
  ['일일드라마','mid senior'],['가요무대','senior','senior'],['백투더뮤직','mid senior'],
  ['스카우트','kid young'],['우리말 겨루기','kid','kid'],
  ['동행','senior'],['사랑의 가족','mid'],['바다 건너 사랑','mid'],
  ['6시 내고향','senior'],['내고향 스페셜','senior','senior'],['네트워크','senior'],['문화스케치','senior'],
  ['전국노래자랑','senior'],
  ['다큐 인사이트','young mid'],['다큐온','young mid'],['역사스페셜','young mid'],['쌤과 함께','young mid'],
  ['진품명품','mid senior'],['동물의 왕국','kid'],['어린이동물티비','kid','kid'],['방과 후 초능력','kid','kid'],
  ['덕클링두','kid','kid'],['주섬주섬','kid','kid'],['또봇','kid'],['밍꼬프렌즈','kid'],
  ['걸작 다큐','mid'],['빙하','young mid'],
  ['걸어서 세계속으로','young mid'],['영상앨범 산','mid senior'],['트레킹노트','mid senior'],
  ['동네 한 바퀴','mid senior'],['한국인의 밥상','mid senior'],['팔도밥상','senior'],['국악 한마당','senior'],
  ['열린음악회','mid senior'],['스포츠 중계석','young mid'],['중계석','mid'],['인생이 영화','young mid'],
  ['독립영화관','young'],
];
