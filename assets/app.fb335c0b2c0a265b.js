/* Pure locale negotiation. Country is a hint, never proof of language or identity. */
(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.TiboLocale=api;
})(typeof globalThis!=='undefined'?globalThis:this,()=>{
  'use strict';
  const NAMES=Object.freeze({en:'English',ko:'한국어',ja:'日本語','zh-Hans':'简体中文','zh-Hant':'繁體中文',es:'Español','pt-BR':'Português (Brasil)',fr:'Français',de:'Deutsch',ar:'العربية'});
  const C=Object.freeze({KR:['ko'],JP:['ja'],CN:['zh-Hans'],TW:['zh-Hant'],HK:['zh-Hant','en'],MO:['zh-Hant','pt-BR'],SG:['en','zh-Hans'],US:['en','es'],GB:['en'],AU:['en'],NZ:['en'],IE:['en'],CA:['en','fr'],FR:['fr'],BE:['fr','de'],CH:['de','fr'],DE:['de'],AT:['de'],LU:['fr','de'],ES:['es'],MX:['es'],AR:['es'],CL:['es'],CO:['es'],PE:['es'],EC:['es'],BO:['es'],UY:['es'],PY:['es'],VE:['es'],CR:['es'],GT:['es'],PA:['es'],DO:['es'],SV:['es'],HN:['es'],NI:['es'],BR:['pt-BR'],PT:['pt-BR'],AO:['pt-BR'],MZ:['pt-BR'],SA:['ar'],AE:['ar','en'],EG:['ar'],JO:['ar'],LB:['ar','fr'],MA:['ar','fr'],DZ:['ar','fr'],TN:['ar','fr'],KW:['ar'],QA:['ar','en'],BH:['ar'],OM:['ar'],IQ:['ar'],YE:['ar'],PS:['ar']});
  function normalize(raw){
    if(typeof raw!=='string'||raw.length>64)return null;
    const tag=raw.trim().replace(/_/g,'-').toLowerCase();
    if(!/^[a-z]{2,3}(?:-[a-z0-9]{2,8})*$/.test(tag))return null;
    const parts=tag.split('-'),base=parts[0];
    if(base==='zh'){
      if(parts.includes('hant'))return 'zh-Hant';
      if(parts.includes('hans'))return 'zh-Hans';
      return parts.some(p=>['tw','hk','mo'].includes(p))?'zh-Hant':'zh-Hans';
    }
    if(base==='pt')return 'pt-BR';
    return Object.prototype.hasOwnProperty.call(NAMES,base)?base:null;
  }
  function country(raw){
    if(typeof raw!=='string')return null;
    const c=raw.toUpperCase();
    return /^[A-Z]{2}$/.test(c)&&!['XX','ZZ'].includes(c)?c:null;
  }
  function preferred(values){
    if(!Array.isArray(values))return [];
    return [...new Set(values.slice(0,20).map(normalize).filter(Boolean))];
  }
  function resolve({manual=null,languages=[],country:hint=null,policy='language-first'}={}){
    const explicit=normalize(manual);
    if(explicit)return {locale:explicit,source:'manual'};
    const browser=preferred(languages),c=country(hint),regional=C[c]||[];
    if(policy==='country-first'&&regional.length){
      const locale=browser.find(l=>regional.includes(l))||regional[0];
      return {locale,source:'country'};
    }
    if(browser.length)return {locale:browser[0],source:'browser'};
    if(regional.length)return {locale:regional[0],source:'country'};
    return {locale:'en',source:'fallback'};
  }
  function parseAcceptLanguage(value){
    if(typeof value!=='string')return [];
    return value.slice(0,2048).split(',').slice(0,24).map((raw,index)=>{
      const [tag,...params]=raw.trim().split(';');let q=1;
      for(const p of params){if(/^\s*q\s*=/i.test(p)){const s=p.split('=')[1]?.trim();q=/^(?:0(?:\.\d{0,3})?|1(?:\.0{0,3})?)$/.test(s||'')?Number(s):0;}}
      return {tag,q,index};
    }).filter(o=>o.q>0&&normalize(o.tag)).sort((a,b)=>b.q-a.q||a.index-b.index).map(o=>o.tag);
  }
  let segmenter=null;
  function graphemes(value){
    const text=String(value);
    if(typeof Intl!=='undefined'&&typeof Intl.Segmenter==='function'){segmenter ||= new Intl.Segmenter(undefined,{granularity:'grapheme'});return [...segmenter.segment(text)].map(x=>x.segment);}
    // Older engines: preserve Unicode code points; exact combined-emoji counts may differ.
    return Array.from(text);
  }
  return Object.freeze({NAMES,COUNTRIES:C,normalize,country,preferred,resolve,parseAcceptLanguage,graphemes});
});

;
window.TiboTranslations = {"en":{"brand":"The Codex community’s reset-wish plaza","language":"Language","auto":"Automatic","about":"About","newsTool":"X mood","motionOff":"Pause motion","motionOn":"Resume motion","heart":"Send a heart","heartHint":"A little love","bow":"Make a bow","bowHint":"With all sincerity","hearts":"Hearts sent","bows":"Hopeful bows","characters":"Wish characters","hero":"Saint Tibo, one more.","lead":"Out of tokens. Still full of hope.","plaque":"Patron of one more reset · unofficial fan art","note":"One more, please… ♡","chat":"Waiting room","sampleChat":"Sample chat","newsTitle":"𝕏 Reset news","changeMood":"Change mood ↗","fiction":"Not a forecast · fictional speech","buildPrompt":"After the reset, I’ll…","ship":"Ship my first app 🚀","bug":"Fix that bug 🐛","shipText":"After the reset, I’ll ship my first app!","bugText":"After the reset, I’ll fix that bug!","placeholder":"Write a message…","chatLabel":"Local demo message","send":"Send message","close":"Close","back":"Back to the plaza","demo":"LOCAL DEMO","noServer":"No shared chat","demoNotice":"Clicks, characters and chat are local demos. Check the reset calendar below for the X news connection status.","externalNotice":"External-count preview. Characters represent clicks, not connected users.","disclaimer":"Unofficial fan project; not affiliated with OpenAI. Hearts and bows do not reset usage limits.","fictionFooter":"Speech bubbles are fictional user thoughts, not quotations.","aboutTitle":"A little wish, not a reset button.","aboutBody":"Start with five characters. A new bowing companion joins at 1, 3, 6, 10… clicks. Refreshing clears the local counts. Chat stays on this screen. The central character is generated fan art, not an endorsement or a religious claim.","aboutSafety":"X moods are previews, not live X data or reset probabilities. A human must review source, author, date and scope before publication. Original chat and approved news text are not automatically translated.","aboutPrivacy":"Language choice is stored only on this device when allowed. We do not request GPS. After deployment a same-site endpoint may supply a country code; no address or raw IP is returned. Shared totals, moderation and live feeds still need a server.","signalTitle":"New mood, new wishes.","signalIntro":"Only a local visual preview. This does not read X posts or calculate a reset probability.","signalState":"Mood preview","example":"Fictional user speech · not a quote","signalSafety":"Live news requires a human-approved source, author, time and audience. Click counts never change the news state.","applyMood":"Use this mood","readWish":"Show a wish","wishLabel":"A wish you can read without animation","bubbleLabel":"Fictional thought","me":"Me","meLocal":"Me · local","skip":"Skip to heart and bow buttons","canvasLabel":"Pixel wish plaza. More accepted clicks add bowing characters. These characters are an illustration, not an online-user count. Equivalent counts and controls are available as text.","portraitAlt":"Seated pixel fan-art character with a halo and a small cat. Unofficial generated art.","pageTitle":"TIBO, PLS. — A little reset wish","toolsLabel":"Plaza tools","statsLabel":"Local clicks and illustrated character counts","countTitle":"{count} wish characters; {visible} visible. Not a count of online users.","growth":"{total} wishes · {remaining} to the next companion","growthOverflow":"{total} wishes · {count} companions off-screen","meterLabel":"{remaining} more wishes to the next companion","rateAction":"Too fast. Take a short pause and try again.","actionStatus":"{hearts} hearts · {bows} bows · {count} new companions. Local screen only.","actionExternal":"Local action emitted. Shared totals change only with a confirmed snapshot.","chatIdle":"Local only · not saved to a server.","chatEmpty":"Write a message first.","chatRate":"Wait three seconds between messages.","chatSent":"Added locally. You can send again in three seconds.","chatTooLong":"Use at most 160 characters. Your message was not sent.","loadError":"The artwork could not load. Reopen the complete HTML file.","badgeDemo":"DEMO · X offline","badgeStale":"Review expired","badgeApproved":"Reviewed-data preview","badgeReview":"Recheck","badgeData":"Reviewed data","sourceLink":"@{account} original ↗","sourceTime":"Posted {posted} · reviewed {reviewed}","audience":"Audience: {audience}","sourceOriginal":"Original wording · not translated","newsTitleDemo":"Preview X moods. These are not live announcements.","newsTitleApproved":"Reviewed-data preview; this browser has not verified the source.","localeBrowser":"Automatic · browser language","localeCountry":"Automatic · country hint","localeFallback":"Automatic · English fallback","localeManual":"Manual language choice","localeUnsaved":"Language works now, but this browser cannot save it.","state.unknown.label":"News unverified","state.unknown.caption":"No odds to quote. Still time to bow.","state.unknown.description":"No reviewed, current reset news is connected.","state.unknown.short":"News unverified","speech.unknown":["No odds to quote. Still time to bow.","Tokens: zero. Hope: still compiling."],"short.unknown":["News unverified","♡ News unverified"],"state.buzz.label":"Community hopeful","state.buzz.caption":"The timeline is loud. No announcement yet.","state.buzz.description":"Community speculation, not an official reset announcement.","state.buzz.short":"Community hopeful","speech.buzz":["The timeline is loud. No announcement yet.","Rumors need sources. Wishes need hearts."],"short.buzz":["Community hopeful","♡ Community hopeful"],"state.hint.label":"Announcement preview","state.hint.caption":"A hint is not a reset. Check before coding.","state.hint.description":"An official preview is not proof of completion or eligibility.","state.hint.short":"Announcement preview","speech.hint":["A hint is not a reset. Check before coding.","This bow is a preorder."],"short.hint":["Announcement preview","♡ Announcement preview"],"state.confirmed.label":"Reset announced","state.confirmed.caption":"Thank-you bows! Check your account first.","state.confirmed.description":"Check the announcement’s audience, timing and your usage.","state.confirmed.short":"Reset announced","speech.confirmed":["Thank-you bows! Check your account first.","Switching from hopeful bows to thankful bows."],"short.confirmed":["Reset announced","♡ Reset announced"],"state.delayed.label":"Delayed or paused","state.delayed.caption":"Extra time for wishes. Stretch those knees.","state.delayed.description":"A delay or pause has been announced; wait for a new update.","state.delayed.short":"Delayed or paused","speech.delayed":["Extra time for wishes. Stretch those knees.","Even bowing needs a cooldown."],"short.delayed":["Delayed or paused","♡ Delayed or paused"],"state.stale.label":"Review needed","state.stale.caption":"Check the date before celebrating.","state.stale.description":"The review expired. Old news is not a current announcement.","state.stale.short":"Review needed","speech.stale":["Check the date before celebrating.","Yesterday’s post is not today’s promise."],"short.stale":["Review needed","♡ Review needed"],"samples":["After the reset, I’ll ship my first app!","Tokens: zero. Hope: still compiling.","Rumors need sources. Wishes need hearts.","A little love ❤️","After the reset, I’ll fix that bug!","Even bowing needs a cooldown."],"speech.ambient":["A little love ♡","With all sincerity 🙇","Tokens: zero. Hope: still compiling."],"speech.heart":["A little love ♡","With all sincerity 🙇","Tokens: zero. Hope: still compiling."],"speech.bow":["A little love ♡","With all sincerity 🙇","Tokens: zero. Hope: still compiling."],"speech.join":["A little love ♡","With all sincerity 🙇","Tokens: zero. Hope: still compiling."],"loading":"Loading the plaza…","retryLoad":"Try again","clearDraft":"Clear this draft","draftRestored":"Draft restored in this tab. It expires after 30 minutes.","draftCleared":"Draft cleared.","draftHint":"Only the unsent draft is saved in this tab for up to 30 minutes. Nothing is sent.","connectionUnavailable":"The shared connection is unavailable. Nothing was added to the shared count.","queueFull":"Too many pending wishes. Wait for the connection to recover.","readOnlyConnection":"Read-only connection test · messages stay local.","resumeMotion":"Resume motion","fxLabel":"Light effects","fxAuto":"Automatic","fxRich":"Rich","fxSoft":"Gentle","fxOff":"Static lights","fxReduced":"Reduced motion takes priority.","fxStopped":"Lights are static. Character actions remain enabled.","fxSoftActive":"Gentle light · fewer particles.","fxRichActive":"Halo · stars · petals · click reactions","reset.waiting":"Waiting for a reviewed reset","reset.disconnected":"X collection is not connected","reset.paused":"Celebration paused by the operator","reset.demo":"Blessing-day preview","reset.celebrating":"A day of blessings · thank you!","reset.announced":"Announced · not confirmed as applied","reset.history":"Previous reset · celebration ended","reset.stale":"Source needs rechecking","reset.revoked":"Reset verification withdrawn · review needed","reset.demoRibbon":"DEMO · BLESSING SHOWER","reset.ribbon":"THANK YOU · BLESSING DAY","reset.demoBadge":"DEMO · no real reset verified","reset.feed":"Reset calendar","reset.connected":"connected","reset.notConnected":"not connected","reset.stopPreview":"End preview","reset.preview":"Preview blessing day","reset.demoNote":"Two-minute local visual rehearsal. No real reset has been verified.","reset.noteActive":"Gold showers continue until the end of the event day. Check your own account and eligible plan.","reset.noteWaiting":"Only a reviewed, completed reset can start this celebration. A post timestamp is not its effective time.","reset.details":"Reset timing & evidence","reset.timeUnknown":"Exact time not stated","reset.banked":"Banked reset credit","reset.usage":"Usage reset","reset.source":"Read the source","reset.effectiveLabel":"Effective date / time","reset.localLabel":"Your local time","reset.publishedLabel":"Post published","reset.scopeLabel":"Eligible users","reset.kindLabel":"Reset type","reset.endLabel":"Celebration ends","reset.approvedLabel":"Reviewed","reset.checkedLabel":"Source last checked"},"ko":{"brand":"코덱스 유저들의 리셋 기원 광장","language":"언어","auto":"자동 선택","about":"안내","newsTool":"X 연출","motionOff":"움직임 끄기","motionOn":"움직임 켜기","heart":"하트 보내기","heartHint":"마음을 전해요","bow":"큰절 올리기","bowHint":"정성을 다해요","hearts":"보낸 하트","bows":"올린 큰절","characters":"기원 캐릭터","hero":"성 티보여, 한 번만.","lead":"토큰은 바닥났고, 정성은 남았습니다.","plaque":"리셋의 성인 · 비공식 팬아트","note":"성 티보여, 토큰을… ♡","chat":"리셋 대기실","sampleChat":"샘플 대화","newsTitle":"𝕏 리셋 소식","changeMood":"연출 바꾸기 ↗","fiction":"실제 확률 아님 · 창작 대사","buildPrompt":"리셋되면 저는…","ship":"첫 앱 배포 🚀","bug":"버그 잡기 🐛","shipText":"리셋되면 첫 앱을 배포할 거예요!","bugText":"리셋되면 그 버그를 잡을 거예요!","placeholder":"메시지를 입력하세요…","chatLabel":"로컬 데모 메시지","send":"메시지 보내기","close":"닫기","back":"광장으로 돌아가기","demo":"로컬 데모","noServer":"공용 채팅 미연결","demoNotice":"클릭·캐릭터·채팅은 로컬 데모입니다. X 리셋 소식의 연결 여부는 아래 리셋 달력에서 확인하세요.","externalNotice":"외부 집계 미리보기입니다. 캐릭터는 클릭 연출이며 실제 접속자 수가 아닙니다.","disclaimer":"비공식 팬 프로젝트 · OpenAI와 제휴 관계가 아닙니다. 하트·큰절은 실제 사용량 리셋과 무관합니다.","fictionFooter":"말풍선은 유저의 상상을 담은 창작이며 실제 인용이 아닙니다.","aboutTitle":"작은 기원이지, 진짜 리셋 버튼은 아니에요.","aboutBody":"5명에서 시작해 클릭 합계 1, 3, 6, 10회…마다 절하는 동료가 합류합니다. 새로고침하면 로컬 클릭이 초기화되고 대화는 내 화면에만 남습니다. 중앙 이미지는 생성 팬아트이며 인물의 지지나 종교적 지위를 뜻하지 않습니다.","aboutSafety":"X 상태는 연출용이며 실제 X 조회나 리셋 확률이 아닙니다. 공개 소식은 원문·작성자·시점·대상을 사람이 검토해야 합니다. 실제 채팅과 승인된 소식 원문은 자동 번역하지 않습니다.","aboutPrivacy":"허용된 경우 언어 선택만 이 기기에 저장합니다. GPS 권한을 요청하지 않습니다. 배포 후 같은 사이트에서 국가 코드만 받을 수 있으며 주소나 원본 IP는 응답에 포함하지 않습니다. 공용 집계·신고·실시간 소식은 서버 연결이 필요합니다.","signalTitle":"소식이 바뀌면, 기도의 말투도 바뀝니다.","signalIntro":"내 화면에서만 적용되는 연출 테스트입니다. 실제 X 게시물을 읽거나 리셋 확률을 계산하지 않습니다.","signalState":"연출 상태","example":"유저 말풍선 예시 · 실제 인용 아님","signalSafety":"실서비스에서는 출처·작성자·시점·적용 대상을 운영자가 확인하고 승인해야 합니다. 클릭 수로 뉴스 상태가 바뀌지는 않습니다.","applyMood":"이 분위기로 기원하기","readWish":"기원 한 줄 보기","wishLabel":"움직임 없이 읽는 기원 문구","bubbleLabel":"유저의 속마음","me":"나","meLocal":"나 · 로컬","skip":"하트·큰절 버튼으로 이동","canvasLabel":"픽셀 기원 광장. 클릭이 쌓이면 큰절하는 캐릭터가 늘어납니다. 실제 접속자 수가 아닌 연출이며 같은 정보와 조작 버튼을 텍스트로 제공합니다.","portraitAlt":"후광 앞에 앉은 픽셀 캐릭터와 작은 고양이. 생성된 비공식 팬아트입니다.","pageTitle":"TIBO, PLS. — 성 티보의 리셋 기원 광장","toolsLabel":"광장 도구","statsLabel":"로컬 클릭 및 연출용 캐릭터 집계","countTitle":"기원 캐릭터 {count}명 · 화면 표시 {visible}명. 실제 접속자 수가 아닙니다.","growth":"기원 {total}회 · 새 동료까지 {remaining}회","growthOverflow":"기원 {total}회 · 화면 밖 동료 {count}명","meterLabel":"다음 큰절 동료까지 {remaining}회","rateAction":"너무 빠르게 누르고 있어요. 잠시 쉬고 다시 눌러주세요.","actionStatus":"하트 {hearts}개 · 큰절 {bows}회 · 새 동료 {count}명. 내 화면에만 반영됩니다.","actionExternal":"로컬 액션을 보냈습니다. 외부 집계는 승인 스냅샷이 올 때만 바뀝니다.","chatIdle":"로컬 체험 · 서버에 저장되지 않아요.","chatEmpty":"메시지를 먼저 입력해주세요.","chatRate":"메시지는 3초 간격으로 보낼 수 있어요.","chatSent":"내 화면에 추가했어요. 3초 뒤 다시 보낼 수 있어요.","chatTooLong":"160자 이내로 입력해주세요. 메시지는 전송되지 않았어요.","loadError":"이미지를 불러오지 못했어요. 완전한 HTML 파일을 다시 열어주세요.","badgeDemo":"DEMO · X 미연결","badgeStale":"검토 유효기간 만료","badgeApproved":"승인 데이터 미리보기","badgeReview":"재검토","badgeData":"승인 데이터","sourceLink":"@{account} 원문 ↗","sourceTime":"게시 {posted} · 검토 {reviewed}","audience":"적용 대상: {audience}","sourceOriginal":"원문 표시 · 번역하지 않음","newsTitleDemo":"X 소식별 연출을 바꿔보세요. 실제 소식이 아닙니다.","newsTitleApproved":"승인 데이터 미리보기입니다. 이 브라우저가 원문을 검증한 것은 아닙니다.","localeBrowser":"자동 · 브라우저 선호 언어","localeCountry":"자동 · 접속 국가 참고","localeFallback":"자동 · 영어 기본값","localeManual":"직접 선택한 언어","localeUnsaved":"언어는 적용됐지만 이 브라우저에서는 저장할 수 없어요.","state.unknown.label":"소식 미확인","state.unknown.caption":"확률은 몰라도 큰절은 확실하다.","state.unknown.description":"승인된 최신 리셋 소식이 아직 연결되지 않았습니다.","state.unknown.short":"소식 미확인","speech.unknown":["확률은 몰라도 큰절은 확실하다.","토큰은 0, 정성은 컴파일 중."],"short.unknown":["소식 미확인","♡ 소식 미확인"],"state.buzz.label":"커뮤니티 기대 중","state.buzz.caption":"타임라인은 뜨거운데 공지는 아직.","state.buzz.description":"커뮤니티의 기대나 추측이며 공식 발표가 아닙니다.","state.buzz.short":"커뮤니티 기대 중","speech.buzz":["타임라인은 뜨거운데 공지는 아직.","소문은 소문. 정성은 진심."],"short.buzz":["커뮤니티 기대 중","♡ 커뮤니티 기대 중"],"state.hint.label":"공식 예고 확인","state.hint.caption":"예고는 예고. 적용은 확인하고!","state.hint.description":"공식 예고가 있어도 실행 완료나 내 계정 적용은 보장되지 않습니다.","state.hint.short":"공식 예고 확인","speech.hint":["예고는 예고. 적용은 확인하고!","이번 큰절은 사전 예약입니다."],"short.hint":["공식 예고 확인","♡ 공식 예고 확인"],"state.confirmed.label":"리셋 공지 확인","state.confirmed.caption":"감사의 큰절! 내 계정부터 확인!","state.confirmed.description":"공지의 적용 대상·시점과 자신의 사용량을 확인하세요.","state.confirmed.short":"리셋 공지 확인","speech.confirmed":["감사의 큰절! 내 계정부터 확인!","기원용 큰절에서 감사용 큰절로 전환."],"short.confirmed":["리셋 공지 확인","♡ 리셋 공지 확인"],"state.delayed.label":"지연·보류 안내","state.delayed.caption":"기도 연장전입니다. 무릎 스트레칭!","state.delayed.description":"지연 또는 보류 안내입니다. 새로운 공지를 기다립니다.","state.delayed.short":"지연·보류 안내","speech.delayed":["기도 연장전입니다. 무릎 스트레칭!","큰절에도 쿨다운이 필요합니다."],"short.delayed":["지연·보류 안내","♡ 지연·보류 안내"],"state.stale.label":"최신 소식 재확인","state.stale.caption":"지난 공지를 오늘의 기적으로 보진 말자.","state.stale.description":"검토 유효기간이 지났습니다. 과거 소식을 현재 공지로 표시하지 않습니다.","state.stale.short":"최신 소식 재확인","speech.stale":["지난 공지를 오늘의 기적으로 보진 말자.","어제의 소식은 오늘의 약속이 아닙니다."],"short.stale":["최신 소식 재확인","♡ 최신 소식 재확인"],"samples":["리셋되면 첫 앱을 배포할 거예요!","토큰은 0, 정성은 컴파일 중.","소문은 소문. 정성은 진심.","마음을 전해요 ❤️","리셋되면 그 버그를 잡을 거예요!","큰절에도 쿨다운이 필요합니다."],"speech.ambient":["마음을 전해요 ♡","정성을 다해요 🙇","토큰은 0, 정성은 컴파일 중."],"speech.heart":["마음을 전해요 ♡","정성을 다해요 🙇","토큰은 0, 정성은 컴파일 중."],"speech.bow":["마음을 전해요 ♡","정성을 다해요 🙇","토큰은 0, 정성은 컴파일 중."],"speech.join":["마음을 전해요 ♡","정성을 다해요 🙇","토큰은 0, 정성은 컴파일 중."],"loading":"광장을 불러오는 중…","retryLoad":"다시 불러오기","clearDraft":"초안 지우기","draftRestored":"이 탭의 초안을 복원했어요. 30분 뒤 만료됩니다.","draftCleared":"초안을 지웠어요.","draftHint":"작성 중인 초안만 이 탭에 최대 30분 보관합니다. 서버로 보내지 않아요.","connectionUnavailable":"공용 연결을 사용할 수 없어 공유 집계에 반영하지 않았어요.","queueFull":"전송 대기 중인 기원이 많아요. 연결 복구 후 다시 눌러주세요.","readOnlyConnection":"읽기 전용 연결 시험 · 메시지는 로컬에만 남습니다.","resumeMotion":"움직임 다시 켜기","fxLabel":"빛 연출","fxAuto":"자동","fxRich":"풍성하게","fxSoft":"가볍게","fxOff":"조명 정지","fxReduced":"움직임 끄기 설정이 우선 적용됩니다.","fxStopped":"조명은 고정됩니다. 캐릭터 동작은 그대로예요.","fxSoftActive":"가벼운 빛 · 입자 수를 줄였습니다.","fxRichActive":"후광 · 별빛 · 꽃잎 · 클릭 반응","reset.waiting":"승인된 리셋 소식을 기다리는 중","reset.disconnected":"X 수집기 미연결","reset.paused":"운영자가 축복 연출을 일시 중지했어요","reset.demo":"축복의 날 미리보기","reset.celebrating":"오늘은 축복의 날 · 감사합니다!","reset.announced":"예고 확인 · 적용 완료 전","reset.history":"지난 리셋 · 축복 연출 종료","reset.stale":"원문 재확인이 필요해요","reset.revoked":"리셋 확인 취소 · 재검토 필요","reset.demoRibbon":"DEMO · 축복의 비","reset.ribbon":"감사합니다 · 축복의 날","reset.demoBadge":"DEMO · 실제 리셋 확인 아님","reset.feed":"리셋 달력","reset.connected":"연결됨","reset.notConnected":"미연결","reset.stopPreview":"미리보기 끝내기","reset.preview":"축복의 날 미리보기","reset.demoNote":"2분간 내 화면에서만 보는 연출입니다. 실제 리셋을 확인한 상태가 아니에요.","reset.noteActive":"해당 리셋 날짜가 끝날 때까지 금빛 축복이 이어집니다. 적용 대상과 본인 계정을 별도로 확인하세요.","reset.noteWaiting":"검토·승인된 적용 완료 소식만 축복을 켭니다. 트윗 게시 시각을 리셋 시각으로 대신하지 않아요.","reset.details":"리셋 시점과 근거","reset.timeUnknown":"정확한 시각 미공개","reset.banked":"보관형 리셋 지급","reset.usage":"사용량 리셋","reset.source":"원문 보기","reset.effectiveLabel":"실제 적용일 / 시각","reset.localLabel":"내 지역 시각","reset.publishedLabel":"트윗 게시","reset.scopeLabel":"적용 대상","reset.kindLabel":"리셋 유형","reset.endLabel":"축복 종료","reset.approvedLabel":"운영자 검토","reset.checkedLabel":"원문 마지막 확인"},"ja":{"brand":"Codexユーザーのリセット祈願広場","language":"言語","auto":"自動選択","about":"案内","newsTool":"Xの演出","motionOff":"動きを止める","motionOn":"動きを再開","heart":"ハートを送る","heartHint":"気持ちを届けよう","bow":"お辞儀する","bowHint":"心を込めて","hearts":"送ったハート","bows":"お辞儀の数","characters":"祈願キャラクター","hero":"聖ティボよ、もう一度。","lead":"トークンはゼロ。でも希望はあります。","plaque":"リセットの守護者 · 非公式ファンアート","note":"もう一度だけ… ♡","chat":"リセット待合室","sampleChat":"サンプル会話","newsTitle":"𝕏 リセット情報","changeMood":"演出を変更 ↗","fiction":"予測ではありません · 創作の台詞","buildPrompt":"リセットされたら…","ship":"初めてのアプリを公開 🚀","bug":"バグを直す 🐛","shipText":"リセットされたら初めてのアプリを公開します！","bugText":"リセットされたらあのバグを直します！","placeholder":"メッセージを入力…","chatLabel":"ローカルデモのメッセージ","send":"メッセージを送信","close":"閉じる","back":"広場に戻る","demo":"ローカルデモ","noServer":"共有チャット未接続","demoNotice":"クリック・キャラクター・チャットはローカルデモです。X情報の接続状態は下のリセットカレンダーをご確認ください。","externalNotice":"外部集計のプレビューです。キャラクターはクリック数の演出で、接続者数ではありません。","disclaimer":"非公式ファンプロジェクトです。OpenAIとの提携はありません。ハートやお辞儀で使用上限はリセットされません。","fictionFooter":"吹き出しは架空のユーザーの台詞で、実際の引用ではありません。","aboutTitle":"小さな願い。本物のリセットボタンではありません。","aboutBody":"5人から始まり、合計1、3、6、10回…のクリックで仲間が増えます。再読み込みで回数は初期化されます。会話はこの画面だけに表示されます。中央は生成されたファンアートで、本人の支持や宗教的地位を表しません。","aboutSafety":"Xの状態はプレビューで、最新情報やリセット確率ではありません。公開前に人が原文・作者・日時・対象を確認する必要があります。実際の会話と承認された情報の原文は自動翻訳しません。","aboutPrivacy":"許可された場合、言語設定のみを端末に保存します。GPSは要求しません。公開後は同じサイトから国コードを受け取れますが、住所や元のIPは返しません。共通集計・管理・最新情報にはサーバーが必要です。","signalTitle":"情報が変わると、願いの言葉も変わります。","signalIntro":"この画面だけの演出テストです。Xの投稿を読んだり、リセット確率を計算したりしません。","signalState":"演出の状態","example":"創作の吹き出し · 実際の引用ではありません","signalSafety":"公開情報は出典・作者・日時・対象を人が確認し承認します。クリック数では情報の状態は変わりません。","applyMood":"この雰囲気にする","readWish":"願いの言葉を読む","wishLabel":"アニメーションなしで読める願い","bubbleLabel":"架空の心の声","me":"私","meLocal":"私 · ローカル","skip":"ハートとお辞儀のボタンへ","canvasLabel":"ピクセル祈願広場。クリックでお辞儀するキャラクターが増えます。接続者数ではなく演出です。同じ情報とボタンをテキストでも提供します。","portraitAlt":"後光の前に座るピクセルキャラクターと小さな猫。生成された非公式ファンアートです。","pageTitle":"TIBO, PLS. — 小さなリセット祈願","toolsLabel":"広場のツール","statsLabel":"ローカルのクリック数と演出用キャラクター数","countTitle":"キャラクター{count}人 · 表示{visible}人。接続者数ではありません。","growth":"願い{total}回 · 次の仲間まで{remaining}回","growthOverflow":"願い{total}回 · 画面外の仲間{count}人","meterLabel":"次の仲間まであと{remaining}回","rateAction":"少し速すぎます。ひと休みしてから押してください。","actionStatus":"ハート{hearts}個 · お辞儀{bows}回 · 新しい仲間{count}人。この画面だけの表示です。","actionExternal":"ローカルの操作を送りました。共通集計は承認されたデータでのみ変わります。","chatIdle":"ローカルのみ · サーバーには保存しません。","chatEmpty":"メッセージを入力してください。","chatRate":"送信は3秒間隔です。","chatSent":"この画面に追加しました。3秒後にまた送れます。","chatTooLong":"160文字以内で入力してください。送信されていません。","loadError":"画像を読み込めませんでした。完全なHTMLファイルを開き直してください。","badgeDemo":"DEMO · X未接続","badgeStale":"確認期限切れ","badgeApproved":"承認データのプレビュー","badgeReview":"再確認","badgeData":"承認データ","sourceLink":"@{account}の原文 ↗","sourceTime":"投稿 {posted} · 確認 {reviewed}","audience":"対象: {audience}","sourceOriginal":"原文表示 · 翻訳なし","newsTitleDemo":"Xの演出を試します。実際の発表ではありません。","newsTitleApproved":"承認データのプレビューです。このブラウザーは原文を検証していません。","localeBrowser":"自動 · ブラウザーの言語","localeCountry":"自動 · 国情報を参考","localeFallback":"自動 · 英語を使用","localeManual":"手動で選んだ言語","localeUnsaved":"言語を適用しましたが、このブラウザーでは保存できません。","state.unknown.label":"情報未確認","state.unknown.caption":"確率は不明。でもお辞儀は確実。","state.unknown.description":"確認済みの最新リセット情報はまだ接続されていません。","state.unknown.short":"情報未確認","speech.unknown":["確率は不明。でもお辞儀は確実。","トークンはゼロ。希望はコンパイル中。"],"short.unknown":["情報未確認","♡ 情報未確認"],"state.buzz.label":"コミュニティが期待中","state.buzz.caption":"タイムラインはにぎやか。発表はまだ。","state.buzz.description":"コミュニティの期待や推測で、公式発表ではありません。","state.buzz.short":"コミュニティが期待中","speech.buzz":["タイムラインはにぎやか。発表はまだ。","噂には出典を。願いにはハートを。"],"short.buzz":["コミュニティが期待中","♡ コミュニティが期待中"],"state.hint.label":"公式予告を確認","state.hint.caption":"予告は予告。適用は確認してから。","state.hint.description":"公式予告があっても、完了や対象アカウントは保証されません。","state.hint.short":"公式予告を確認","speech.hint":["予告は予告。適用は確認してから。","今回のお辞儀は事前予約です。"],"short.hint":["公式予告を確認","♡ 公式予告を確認"],"state.confirmed.label":"リセット発表を確認","state.confirmed.caption":"感謝のお辞儀！まず自分のアカウントを確認。","state.confirmed.description":"発表の対象・時刻と自分の使用量を確認してください。","state.confirmed.short":"リセット発表を確認","speech.confirmed":["感謝のお辞儀！まず自分のアカウントを確認。","祈願のお辞儀から感謝のお辞儀へ。"],"short.confirmed":["リセット発表を確認","♡ リセット発表を確認"],"state.delayed.label":"延期・保留","state.delayed.caption":"祈願の延長戦。膝を伸ばそう。","state.delayed.description":"延期または保留の案内です。新しい発表を待ちます。","state.delayed.short":"延期・保留","speech.delayed":["祈願の延長戦。膝を伸ばそう。","お辞儀にも休憩が必要です。"],"short.delayed":["延期・保留","♡ 延期・保留"],"state.stale.label":"最新情報を再確認","state.stale.caption":"喜ぶ前に日付を確認しよう。","state.stale.description":"確認期限が切れました。過去の情報は最新の発表ではありません。","state.stale.short":"最新情報を再確認","speech.stale":["喜ぶ前に日付を確認しよう。","昨日の投稿は今日の約束ではありません。"],"short.stale":["最新情報を再確認","♡ 最新情報を再確認"],"samples":["リセットされたら初めてのアプリを公開します！","トークンはゼロ。希望はコンパイル中。","噂には出典を。願いにはハートを。","気持ちを届けよう ❤️","リセットされたらあのバグを直します！","お辞儀にも休憩が必要です。"],"speech.ambient":["気持ちを届けよう ♡","心を込めて 🙇","トークンはゼロ。希望はコンパイル中。"],"speech.heart":["気持ちを届けよう ♡","心を込めて 🙇","トークンはゼロ。希望はコンパイル中。"],"speech.bow":["気持ちを届けよう ♡","心を込めて 🙇","トークンはゼロ。希望はコンパイル中。"],"speech.join":["気持ちを届けよう ♡","心を込めて 🙇","トークンはゼロ。希望はコンパイル中。"],"loading":"広場を読み込み中…","retryLoad":"再読み込み","clearDraft":"下書きを消す","draftRestored":"このタブの下書きを復元しました。30分後に期限が切れます。","draftCleared":"下書きを消しました。","draftHint":"未送信の下書きだけをこのタブに最大30分保存します。送信はされません。","connectionUnavailable":"共有接続が利用できないため、共有カウントには追加されていません。","queueFull":"送信待ちが多すぎます。接続の回復後にもう一度お試しください。","readOnlyConnection":"読み取り専用の接続テスト・メッセージはローカルのみです。","resumeMotion":"動きを再開","fxLabel":"光の演出","fxAuto":"自動","fxRich":"豊かに","fxSoft":"控えめ","fxOff":"照明を停止","fxReduced":"動きを減らす設定が優先されます。","fxStopped":"照明は静止します。キャラクターの動きは維持します。","fxSoftActive":"控えめな光・粒子を削減。","fxRichActive":"後光・星・花びら・クリック反応","reset.waiting":"確認済みのリセット情報を待っています","reset.disconnected":"X収集機能は未接続です","reset.paused":"運営者が演出を一時停止しました","reset.demo":"祝福の日のプレビュー","reset.celebrating":"祝福の日 · ありがとう！","reset.announced":"予告のみ · 適用は未確認","reset.history":"過去のリセット · 演出終了","reset.stale":"情報源の再確認が必要です","reset.revoked":"リセット確認を取り消し・再確認が必要です","reset.demoRibbon":"DEMO · 祝福のシャワー","reset.ribbon":"ありがとう · 祝福の日","reset.demoBadge":"DEMO · 実際のリセットは未確認","reset.feed":"リセットカレンダー","reset.connected":"接続済み","reset.notConnected":"未接続","reset.stopPreview":"プレビュー終了","reset.preview":"祝福の日を体験","reset.demoNote":"2分間のローカル演出です。実際のリセットを確認したものではありません。","reset.noteActive":"イベント当日の終了まで金色の祝福が続きます。対象プランとご自身のアカウントをご確認ください。","reset.noteWaiting":"確認・承認された適用完了情報でのみ開始します。投稿時刻と適用時刻は別です。","reset.details":"リセット時刻と根拠","reset.timeUnknown":"正確な時刻は未公表","reset.banked":"保管型リセット付与","reset.usage":"使用量リセット","reset.source":"原文を見る","reset.effectiveLabel":"適用日 / 時刻","reset.localLabel":"あなたの地域の時刻","reset.publishedLabel":"投稿時刻","reset.scopeLabel":"対象ユーザー","reset.kindLabel":"リセットの種類","reset.endLabel":"演出終了","reset.approvedLabel":"承認時刻","reset.checkedLabel":"原文の最終確認"},"zh-Hans":{"brand":"Codex用户的重置祈愿广场","language":"语言","auto":"自动选择","about":"说明","newsTool":"X动态演示","motionOff":"暂停动画","motionOn":"恢复动画","heart":"送出爱心","heartHint":"传递心意","bow":"鞠躬祈愿","bowHint":"诚意满满","hearts":"已送爱心","bows":"祈愿次数","characters":"祈愿角色","hero":"圣蒂博，再来一次。","lead":"额度用完了，希望还在。","plaque":"重置守护者 · 非官方同人作品","note":"再来一次吧… ♡","chat":"重置等候室","sampleChat":"示例聊天","newsTitle":"𝕏 重置消息","changeMood":"切换演示 ↗","fiction":"不是概率预测 · 台词为创作","buildPrompt":"重置后，我要…","ship":"发布第一个应用 🚀","bug":"修复那个错误 🐛","shipText":"重置后，我要发布第一个应用！","bugText":"重置后，我要修复那个错误！","placeholder":"输入消息…","chatLabel":"本地演示消息","send":"发送消息","close":"关闭","back":"返回广场","demo":"本地演示","noServer":"未连接共享聊天","demoNotice":"点击、角色和聊天均为本地演示。X 消息的连接状态请查看下方重置日历。","externalNotice":"外部统计预览。角色代表点击效果，不是在线人数。","disclaimer":"非官方粉丝项目，与OpenAI没有合作关系。爱心和鞠躬不会重置使用额度。","fictionFooter":"气泡是虚构用户的心声，不是真实引述。","aboutTitle":"一个小小的心愿，不是真正的重置按钮。","aboutBody":"从5个角色开始，累计点击1、3、6、10次…时加入新伙伴。刷新会清空本地计数。聊天仅保留在当前页面。中央角色是生成的同人作品，不代表本人支持或宗教身份。","aboutSafety":"X状态仅为预览，不是实时消息或重置概率。发布前须由人核实原文、作者、时间和适用对象。真实聊天及已批准的消息原文不会自动翻译。","aboutPrivacy":"允许时仅在此设备保存语言选择。不请求GPS定位。部署后，同站接口可提供国家代码，但不会返回地址或原始IP。共享统计、管理及实时消息仍需服务器。","signalTitle":"消息变了，祈愿的语气也会改变。","signalIntro":"只影响本页面的视觉演示，不读取X帖子，也不计算重置概率。","signalState":"演示状态","example":"虚构用户台词 · 非真实引述","signalSafety":"实时消息须经人工核实来源、作者、时间和对象并批准。点击数不会改变消息状态。","applyMood":"使用这个氛围","readWish":"读一句祈愿","wishLabel":"无需动画即可阅读的祈愿","bubbleLabel":"虚构心声","me":"我","meLocal":"我 · 本地","skip":"跳到爱心和鞠躬按钮","canvasLabel":"像素祈愿广场。点击越多，鞠躬角色越多。这是视觉演示，不是在线人数。相同信息和操作也以文字提供。","portraitAlt":"光环前坐着的像素角色和小猫。生成的非官方同人作品。","pageTitle":"TIBO, PLS. — 重置祈愿广场","toolsLabel":"广场工具","statsLabel":"本地点击数和演示角色数","countTitle":"祈愿角色{count}个 · 显示{visible}个。不是在线人数。","growth":"祈愿{total}次 · 再点{remaining}次加入新伙伴","growthOverflow":"祈愿{total}次 · 屏幕外伙伴{count}个","meterLabel":"再祈愿{remaining}次加入新伙伴","rateAction":"点击太快了，请稍作休息再试。","actionStatus":"爱心{hearts}个 · 鞠躬{bows}次 · 新伙伴{count}个。仅显示在本页面。","actionExternal":"已发出本地操作。共享统计只随确认数据更新。","chatIdle":"仅在本地 · 不保存到服务器。","chatEmpty":"请先输入消息。","chatRate":"每隔3秒可以发送一次。","chatSent":"已添加到本页面，3秒后可再次发送。","chatTooLong":"请控制在160字以内，消息尚未发送。","loadError":"图片加载失败，请重新打开完整的HTML文件。","badgeDemo":"DEMO · X未连接","badgeStale":"审核已过期","badgeApproved":"已审核数据预览","badgeReview":"重新核查","badgeData":"已审核数据","sourceLink":"@{account} 原文 ↗","sourceTime":"发布 {posted} · 审核 {reviewed}","audience":"适用对象：{audience}","sourceOriginal":"原文显示 · 未翻译","newsTitleDemo":"体验X消息演示，并非真实公告。","newsTitleApproved":"已审核数据预览。本浏览器没有验证原文。","localeBrowser":"自动 · 浏览器语言","localeCountry":"自动 · 参考国家信息","localeFallback":"自动 · 默认英语","localeManual":"手动选择语言","localeUnsaved":"语言已应用，但此浏览器无法保存设置。","state.unknown.label":"消息未核实","state.unknown.caption":"概率不知道，鞠躬是认真的。","state.unknown.description":"尚未连接已核实的最新重置消息。","state.unknown.short":"消息未核实","speech.unknown":["概率不知道，鞠躬是认真的。","额度为零，希望还在编译。"],"short.unknown":["消息未核实","♡ 消息未核实"],"state.buzz.label":"社区期待中","state.buzz.caption":"时间线很热闹，公告还没来。","state.buzz.description":"社区的期待或推测，不是官方重置公告。","state.buzz.short":"社区期待中","speech.buzz":["时间线很热闹，公告还没来。","传闻要看来源，祈愿要有爱心。"],"short.buzz":["社区期待中","♡ 社区期待中"],"state.hint.label":"已确认官方预告","state.hint.caption":"预告不等于完成，先确认再开工。","state.hint.description":"官方预告不保证已完成，也不保证适用于你的账户。","state.hint.short":"已确认官方预告","speech.hint":["预告不等于完成，先确认再开工。","这次鞠躬算是提前预约。"],"short.hint":["已确认官方预告","♡ 已确认官方预告"],"state.confirmed.label":"已确认重置公告","state.confirmed.caption":"先鞠躬感谢，再检查自己的账户！","state.confirmed.description":"请确认公告的适用对象、时间和自己的使用情况。","state.confirmed.short":"已确认重置公告","speech.confirmed":["先鞠躬感谢，再检查自己的账户！","从祈愿的鞠躬切换到感谢的鞠躬。"],"short.confirmed":["已确认重置公告","♡ 已确认重置公告"],"state.delayed.label":"延期或暂停","state.delayed.caption":"祈愿加时赛，先伸伸膝盖。","state.delayed.description":"已发布延期或暂停消息，等待新的更新。","state.delayed.short":"延期或暂停","speech.delayed":["祈愿加时赛，先伸伸膝盖。","鞠躬也需要冷却时间。"],"short.delayed":["延期或暂停","♡ 延期或暂停"],"state.stale.label":"需要重新核查","state.stale.caption":"庆祝之前，先看日期。","state.stale.description":"审核已过期，旧消息不能当成当前公告。","state.stale.short":"需要重新核查","speech.stale":["庆祝之前，先看日期。","昨天的帖子不是今天的承诺。"],"short.stale":["需要重新核查","♡ 需要重新核查"],"samples":["重置后，我要发布第一个应用！","额度为零，希望还在编译。","传闻要看来源，祈愿要有爱心。","传递心意 ❤️","重置后，我要修复那个错误！","鞠躬也需要冷却时间。"],"speech.ambient":["传递心意 ♡","诚意满满 🙇","额度为零，希望还在编译。"],"speech.heart":["传递心意 ♡","诚意满满 🙇","额度为零，希望还在编译。"],"speech.bow":["传递心意 ♡","诚意满满 🙇","额度为零，希望还在编译。"],"speech.join":["传递心意 ♡","诚意满满 🙇","额度为零，希望还在编译。"],"loading":"正在加载广场…","retryLoad":"重新加载","clearDraft":"清除草稿","draftRestored":"已恢复此标签页的草稿，30分钟后过期。","draftCleared":"草稿已清除。","draftHint":"仅在此标签页保存未发送的草稿，最多30分钟，不会上传。","connectionUnavailable":"共享连接不可用，未计入共享总数。","queueFull":"等待发送的祈愿过多，请在连接恢复后重试。","readOnlyConnection":"只读连接测试 · 消息仅保留在本地。","resumeMotion":"恢复动画","fxLabel":"光效","fxAuto":"自动","fxRich":"丰富","fxSoft":"轻量","fxOff":"静态灯光","fxReduced":"优先遵循减少动态效果的设置。","fxStopped":"灯光保持静止，角色动作不变。","fxSoftActive":"轻柔光效 · 减少粒子。","fxRichActive":"光环 · 星光 · 花瓣 · 点击反馈","reset.waiting":"等待审核后的重置信息","reset.disconnected":"X 采集尚未连接","reset.paused":"管理员已暂停庆祝","reset.demo":"祝福日预览","reset.celebrating":"今天是祝福日 · 谢谢！","reset.announced":"已预告 · 尚未确认生效","reset.history":"以往重置 · 庆祝已结束","reset.stale":"需要重新核实来源","reset.revoked":"重置确认已撤回 · 需要复核","reset.demoRibbon":"演示 · 祝福之雨","reset.ribbon":"谢谢 · 祝福日","reset.demoBadge":"演示 · 未核实真实重置","reset.feed":"重置日历","reset.connected":"已连接","reset.notConnected":"未连接","reset.stopPreview":"结束预览","reset.preview":"预览祝福日","reset.demoNote":"仅在本机展示两分钟。并未确认真实重置。","reset.noteActive":"金色祝福持续到活动当日结束。请另行确认适用套餐和自己的账户。","reset.noteWaiting":"只有审核确认已生效的重置才会启动。发帖时间不等于生效时间。","reset.details":"重置时间与依据","reset.timeUnknown":"未公布准确时间","reset.banked":"发放可储存重置","reset.usage":"使用额度重置","reset.source":"查看原文","reset.effectiveLabel":"生效日期 / 时间","reset.localLabel":"你的当地时间","reset.publishedLabel":"发帖时间","reset.scopeLabel":"适用用户","reset.kindLabel":"重置类型","reset.endLabel":"庆祝结束","reset.approvedLabel":"审核时间","reset.checkedLabel":"最后核实来源"},"zh-Hant":{"brand":"Codex使用者的重置祈願廣場","language":"語言","auto":"自動選擇","about":"說明","newsTool":"X動態演示","motionOff":"暫停動畫","motionOn":"恢復動畫","heart":"送出愛心","heartHint":"傳遞心意","bow":"鞠躬祈願","bowHint":"誠意滿滿","hearts":"已送愛心","bows":"祈願次數","characters":"祈願角色","hero":"聖蒂博，再來一次。","lead":"額度用完了，希望還在。","plaque":"重置守護者 · 非官方同人作品","note":"再來一次吧… ♡","chat":"重置等候室","sampleChat":"範例聊天","newsTitle":"𝕏 重置消息","changeMood":"切換演示 ↗","fiction":"不是機率預測 · 台詞為創作","buildPrompt":"重置後，我要…","ship":"發布第一個應用程式 🚀","bug":"修復那個錯誤 🐛","shipText":"重置後，我要發布第一個應用程式！","bugText":"重置後，我要修復那個錯誤！","placeholder":"輸入訊息…","chatLabel":"本機演示訊息","send":"傳送訊息","close":"關閉","back":"返回廣場","demo":"本機演示","noServer":"未連線共用聊天","demoNotice":"點擊、角色和聊天均為本機示範。X 消息的連線狀態請查看下方重設日曆。","externalNotice":"外部統計預覽。角色代表點擊效果，不是線上人數。","disclaimer":"非官方粉絲專案，與OpenAI沒有合作關係。愛心與鞠躬不會重置使用額度。","fictionFooter":"氣泡是虛構使用者的心聲，不是真實引述。","aboutTitle":"一個小小的心願，不是真正的重置按鈕。","aboutBody":"從5個角色開始，累計點擊1、3、6、10次…時加入新夥伴。重新整理會清空本機計數。聊天僅保留在目前頁面。中央角色是生成的同人作品，不代表本人支持或宗教身分。","aboutSafety":"X狀態僅為預覽，不是即時消息或重置機率。發布前須由人核實原文、作者、時間與適用對象。真實聊天及已批准的消息原文不會自動翻譯。","aboutPrivacy":"允許時僅在此裝置儲存語言選擇。不請求GPS定位。部署後，同站介面可提供國家代碼，但不會回傳地址或原始IP。共用統計、管理與即時消息仍需伺服器。","signalTitle":"消息變了，祈願的語氣也會改變。","signalIntro":"只影響本頁面的視覺演示，不讀取X貼文，也不計算重置機率。","signalState":"演示狀態","example":"虛構使用者台詞 · 非真實引述","signalSafety":"即時消息須經人工核實來源、作者、時間與對象並批准。點擊數不會改變消息狀態。","applyMood":"使用這個氛圍","readWish":"讀一句祈願","wishLabel":"無需動畫即可閱讀的祈願","bubbleLabel":"虛構心聲","me":"我","meLocal":"我 · 本機","skip":"跳到愛心與鞠躬按鈕","canvasLabel":"像素祈願廣場。點擊越多，鞠躬角色越多。這是視覺演示，不是線上人數。相同資訊與操作也以文字提供。","portraitAlt":"光環前坐著的像素角色與小貓。生成的非官方同人作品。","pageTitle":"TIBO, PLS. — 重置祈願廣場","toolsLabel":"廣場工具","statsLabel":"本機點擊數與演示角色數","countTitle":"祈願角色{count}個 · 顯示{visible}個。不是線上人數。","growth":"祈願{total}次 · 再點{remaining}次加入新夥伴","growthOverflow":"祈願{total}次 · 螢幕外夥伴{count}個","meterLabel":"再祈願{remaining}次加入新夥伴","rateAction":"點擊太快了，請稍作休息再試。","actionStatus":"愛心{hearts}個 · 鞠躬{bows}次 · 新夥伴{count}個。僅顯示在本頁面。","actionExternal":"已發出本機操作。共用統計只隨確認資料更新。","chatIdle":"僅在本機 · 不儲存到伺服器。","chatEmpty":"請先輸入訊息。","chatRate":"每隔3秒可以傳送一次。","chatSent":"已新增到本頁面，3秒後可再次傳送。","chatTooLong":"請控制在160字以內，訊息尚未傳送。","loadError":"圖片載入失敗，請重新開啟完整的HTML檔案。","badgeDemo":"DEMO · X未連接","badgeStale":"審核已過期","badgeApproved":"已審核資料預覽","badgeReview":"重新核查","badgeData":"已審核資料","sourceLink":"@{account} 原文 ↗","sourceTime":"發布 {posted} · 審核 {reviewed}","audience":"適用對象：{audience}","sourceOriginal":"原文顯示 · 未翻譯","newsTitleDemo":"體驗X消息演示，並非真實公告。","newsTitleApproved":"已審核資料預覽。本瀏覽器沒有驗證原文。","localeBrowser":"自動 · 瀏覽器語言","localeCountry":"自動 · 參考國家資訊","localeFallback":"自動 · 預設英語","localeManual":"手動選擇語言","localeUnsaved":"語言已套用，但此瀏覽器無法儲存設定。","state.unknown.label":"消息未核實","state.unknown.caption":"機率不知道，鞠躬是認真的。","state.unknown.description":"尚未連接已核實的最新重置消息。","state.unknown.short":"消息未核實","speech.unknown":["機率不知道，鞠躬是認真的。","額度為零，希望還在編譯。"],"short.unknown":["消息未核實","♡ 消息未核實"],"state.buzz.label":"社群期待中","state.buzz.caption":"時間線很熱鬧，公告還沒來。","state.buzz.description":"社群的期待或推測，不是官方重置公告。","state.buzz.short":"社群期待中","speech.buzz":["時間線很熱鬧，公告還沒來。","傳聞要看來源，祈願要有愛心。"],"short.buzz":["社群期待中","♡ 社群期待中"],"state.hint.label":"已確認官方預告","state.hint.caption":"預告不等於完成，先確認再開工。","state.hint.description":"官方預告不保證已完成，也不保證適用於你的帳號。","state.hint.short":"已確認官方預告","speech.hint":["預告不等於完成，先確認再開工。","這次鞠躬算是提前預約。"],"short.hint":["已確認官方預告","♡ 已確認官方預告"],"state.confirmed.label":"已確認重置公告","state.confirmed.caption":"先鞠躬感謝，再檢查自己的帳號！","state.confirmed.description":"請確認公告的適用對象、時間與自己的使用情況。","state.confirmed.short":"已確認重置公告","speech.confirmed":["先鞠躬感謝，再檢查自己的帳號！","從祈願的鞠躬切換到感謝的鞠躬。"],"short.confirmed":["已確認重置公告","♡ 已確認重置公告"],"state.delayed.label":"延期或暫停","state.delayed.caption":"祈願延長賽，先伸伸膝蓋。","state.delayed.description":"已發布延期或暫停消息，等待新的更新。","state.delayed.short":"延期或暫停","speech.delayed":["祈願延長賽，先伸伸膝蓋。","鞠躬也需要冷卻時間。"],"short.delayed":["延期或暫停","♡ 延期或暫停"],"state.stale.label":"需要重新核查","state.stale.caption":"慶祝之前，先看日期。","state.stale.description":"審核已過期，舊消息不能當成目前公告。","state.stale.short":"需要重新核查","speech.stale":["慶祝之前，先看日期。","昨天的貼文不是今天的承諾。"],"short.stale":["需要重新核查","♡ 需要重新核查"],"samples":["重置後，我要發布第一個應用程式！","額度為零，希望還在編譯。","傳聞要看來源，祈願要有愛心。","傳遞心意 ❤️","重置後，我要修復那個錯誤！","鞠躬也需要冷卻時間。"],"speech.ambient":["傳遞心意 ♡","誠意滿滿 🙇","額度為零，希望還在編譯。"],"speech.heart":["傳遞心意 ♡","誠意滿滿 🙇","額度為零，希望還在編譯。"],"speech.bow":["傳遞心意 ♡","誠意滿滿 🙇","額度為零，希望還在編譯。"],"speech.join":["傳遞心意 ♡","誠意滿滿 🙇","額度為零，希望還在編譯。"],"loading":"正在載入廣場…","retryLoad":"重新載入","clearDraft":"清除草稿","draftRestored":"已還原此分頁的草稿，30分鐘後到期。","draftCleared":"草稿已清除。","draftHint":"只在此分頁保存未傳送的草稿，最多30分鐘，不會上傳。","connectionUnavailable":"共享連線無法使用，未計入共享總數。","queueFull":"等待傳送的祈願過多，請在連線恢復後重試。","readOnlyConnection":"唯讀連線測試 · 訊息僅保留在本機。","resumeMotion":"恢復動畫","fxLabel":"光效","fxAuto":"自動","fxRich":"豐富","fxSoft":"輕量","fxOff":"靜態燈光","fxReduced":"優先遵循減少動態效果的設定。","fxStopped":"燈光保持靜止，角色動作不變。","fxSoftActive":"輕柔光效 · 減少粒子。","fxRichActive":"光環 · 星光 · 花瓣 · 點擊回饋","reset.waiting":"等待審核後的重設消息","reset.disconnected":"X 蒐集尚未連線","reset.paused":"管理員已暫停慶祝","reset.demo":"祝福日預覽","reset.celebrating":"今天是祝福日 · 謝謝！","reset.announced":"已預告 · 尚未確認生效","reset.history":"過往重設 · 慶祝已結束","reset.stale":"需要重新核實來源","reset.revoked":"重置確認已撤回 · 需要複核","reset.demoRibbon":"示範 · 祝福之雨","reset.ribbon":"謝謝 · 祝福日","reset.demoBadge":"示範 · 未核實真實重設","reset.feed":"重設日曆","reset.connected":"已連線","reset.notConnected":"未連線","reset.stopPreview":"結束預覽","reset.preview":"預覽祝福日","reset.demoNote":"僅在本機展示兩分鐘。並未確認真實重設。","reset.noteActive":"金色祝福持續到活動當日結束。請另行確認適用方案及自己的帳戶。","reset.noteWaiting":"只有審核確認已生效的重設才會啟動。發文時間不等於生效時間。","reset.details":"重設時間與依據","reset.timeUnknown":"未公布準確時間","reset.banked":"發放可儲存重設","reset.usage":"使用額度重設","reset.source":"查看原文","reset.effectiveLabel":"生效日期 / 時間","reset.localLabel":"你的當地時間","reset.publishedLabel":"發文時間","reset.scopeLabel":"適用使用者","reset.kindLabel":"重設類型","reset.endLabel":"慶祝結束","reset.approvedLabel":"審核時間","reset.checkedLabel":"最後核實來源"},"es":{"brand":"La plaza de deseos de la comunidad de Codex","language":"Idioma","auto":"Automático","about":"Acerca de","newsTool":"Ambiente X","motionOff":"Pausar movimiento","motionOn":"Reanudar movimiento","heart":"Enviar corazón","heartHint":"Un poco de cariño","bow":"Hacer reverencia","bowHint":"De todo corazón","hearts":"Corazones enviados","bows":"Reverencias","characters":"Personajes","hero":"San Tibo, una vez más.","lead":"Sin tokens, pero con esperanza.","plaque":"Patrón de un reinicio más · arte de fans no oficial","note":"Una vez más, por favor… ♡","chat":"Sala de espera","sampleChat":"Chat de ejemplo","newsTitle":"𝕏 Noticias del reinicio","changeMood":"Cambiar ambiente ↗","fiction":"No es una predicción · diálogos ficticios","buildPrompt":"Después del reinicio…","ship":"Publicar mi primera app 🚀","bug":"Arreglar ese error 🐛","shipText":"¡Después del reinicio publicaré mi primera app!","bugText":"¡Después del reinicio arreglaré ese error!","placeholder":"Escribe un mensaje…","chatLabel":"Mensaje de demostración local","send":"Enviar mensaje","close":"Cerrar","back":"Volver a la plaza","demo":"DEMO LOCAL","noServer":"Sin chat compartido","demoNotice":"Los clics, personajes y el chat son demos locales. Consulta el calendario de reinicios para ver el estado de la conexión con X.","externalNotice":"Vista previa de recuentos externos. Los personajes representan clics, no usuarios conectados.","disclaimer":"Proyecto de fans no oficial, sin afiliación con OpenAI. Los corazones y las reverencias no reinician los límites de uso.","fictionFooter":"Los bocadillos son pensamientos ficticios, no citas reales.","aboutTitle":"Un pequeño deseo, no un botón de reinicio real.","aboutBody":"Empieza con cinco personajes. Se suma uno a los 1, 3, 6, 10… clics. Recargar borra los recuentos locales. El chat queda en esta pantalla. El personaje central es arte generado de fans, no un respaldo ni una afirmación religiosa.","aboutSafety":"Los estados de X son vistas previas, no noticias en vivo ni probabilidades. Una persona debe revisar fuente, autor, fecha y destinatarios antes de publicar. El chat real y los textos aprobados no se traducen automáticamente.","aboutPrivacy":"El idioma se guarda solo en este dispositivo cuando se permite. No pedimos GPS. Tras el despliegue, el mismo sitio puede aportar un código de país, sin devolver dirección ni IP original. Los recuentos compartidos y la moderación requieren un servidor.","signalTitle":"Nuevo ambiente, nuevos deseos.","signalIntro":"Solo es una vista previa local. No lee publicaciones de X ni calcula probabilidades de reinicio.","signalState":"Ambiente de prueba","example":"Diálogo ficticio · no es una cita","signalSafety":"Las noticias requieren revisión humana de fuente, autor, fecha y destinatarios. Los clics nunca cambian el estado de las noticias.","applyMood":"Usar este ambiente","readWish":"Leer un deseo","wishLabel":"Un deseo accesible sin animación","bubbleLabel":"Pensamiento ficticio","me":"Yo","meLocal":"Yo · local","skip":"Ir a los botones de corazón y reverencia","canvasLabel":"Plaza de deseos con personajes de píxeles. Los clics añaden personajes haciendo reverencias. No es un recuento de usuarios conectados. La misma información y los controles están disponibles como texto.","portraitAlt":"Personaje de píxeles sentado con aureola y un gato pequeño. Arte generado de fans no oficial.","pageTitle":"TIBO, PLS. — Un pequeño deseo de reinicio","toolsLabel":"Herramientas de la plaza","statsLabel":"Clics locales y personajes ilustrados","countTitle":"{count} personajes; {visible} visibles. No son usuarios conectados.","growth":"{total} deseos · {remaining} para otro compañero","growthOverflow":"{total} deseos · {count} fuera de pantalla","meterLabel":"Faltan {remaining} deseos para otro compañero","rateAction":"Demasiado rápido. Espera un momento y vuelve a intentarlo.","actionStatus":"{hearts} corazones · {bows} reverencias · {count} nuevos compañeros. Solo en esta pantalla.","actionExternal":"Acción local emitida. Los totales cambian solo con datos confirmados.","chatIdle":"Solo local · no se guarda en un servidor.","chatEmpty":"Escribe un mensaje primero.","chatRate":"Espera tres segundos entre mensajes.","chatSent":"Añadido localmente. Puedes enviar de nuevo en tres segundos.","chatTooLong":"Usa como máximo 160 caracteres. No se envió el mensaje.","loadError":"No se pudo cargar el arte. Abre de nuevo el archivo HTML completo.","badgeDemo":"DEMO · X sin conexión","badgeStale":"Revisión caducada","badgeApproved":"Vista de datos revisados","badgeReview":"Revisar","badgeData":"Datos revisados","sourceLink":"Original de @{account} ↗","sourceTime":"Publicado {posted} · revisado {reviewed}","audience":"Destinatarios: {audience}","sourceOriginal":"Texto original · sin traducir","newsTitleDemo":"Prueba ambientes de X. No son anuncios reales.","newsTitleApproved":"Vista de datos revisados; este navegador no ha verificado la fuente.","localeBrowser":"Automático · idioma del navegador","localeCountry":"Automático · referencia del país","localeFallback":"Automático · inglés por defecto","localeManual":"Idioma elegido manualmente","localeUnsaved":"El idioma se aplicó, pero este navegador no puede guardarlo.","state.unknown.label":"Noticias sin verificar","state.unknown.caption":"No sé la probabilidad, pero sí inclinarme.","state.unknown.description":"Todavía no hay noticias actuales revisadas conectadas.","state.unknown.short":"Noticias sin verificar","speech.unknown":["No sé la probabilidad, pero sí inclinarme.","Cero tokens. La esperanza sigue compilando."],"short.unknown":["Noticias sin verificar","♡ Noticias sin verificar"],"state.buzz.label":"La comunidad espera","state.buzz.caption":"Mucho ruido, pero aún sin anuncio.","state.buzz.description":"Especulación de la comunidad, no un anuncio oficial.","state.buzz.short":"La comunidad espera","speech.buzz":["Mucho ruido, pero aún sin anuncio.","Los rumores necesitan fuentes; los deseos, corazones."],"short.buzz":["La comunidad espera","♡ La comunidad espera"],"state.hint.label":"Avance oficial","state.hint.caption":"Un adelanto no es un reset. Compruébalo.","state.hint.description":"El avance no garantiza que termine ni que incluya tu cuenta.","state.hint.short":"Avance oficial","speech.hint":["Un adelanto no es un reset. Compruébalo.","Esta reverencia es una reserva anticipada."],"short.hint":["Avance oficial","♡ Avance oficial"],"state.confirmed.label":"Reset anunciado","state.confirmed.caption":"¡Reverencias de gratitud! Revisa tu cuenta.","state.confirmed.description":"Comprueba los destinatarios, el momento y tu uso.","state.confirmed.short":"Reset anunciado","speech.confirmed":["¡Reverencias de gratitud! Revisa tu cuenta.","De reverencias de esperanza a reverencias de gratitud."],"short.confirmed":["Reset anunciado","♡ Reset anunciado"],"state.delayed.label":"Retrasado o en pausa","state.delayed.caption":"Prórroga de deseos. ¡Estira las rodillas!","state.delayed.description":"Se anunció un retraso o pausa. Espera otra actualización.","state.delayed.short":"Retrasado o en pausa","speech.delayed":["Prórroga de deseos. ¡Estira las rodillas!","Hasta las reverencias necesitan descanso."],"short.delayed":["Retrasado o en pausa","♡ Retrasado o en pausa"],"state.stale.label":"Revisión necesaria","state.stale.caption":"Mira la fecha antes de celebrar.","state.stale.description":"La revisión caducó. Una noticia antigua no es un anuncio actual.","state.stale.short":"Revisión necesaria","speech.stale":["Mira la fecha antes de celebrar.","El post de ayer no es una promesa para hoy."],"short.stale":["Revisión necesaria","♡ Revisión necesaria"],"samples":["¡Después del reinicio publicaré mi primera app!","Cero tokens. La esperanza sigue compilando.","Los rumores necesitan fuentes; los deseos, corazones.","Un poco de cariño ❤️","¡Después del reinicio arreglaré ese error!","Hasta las reverencias necesitan descanso."],"speech.ambient":["Un poco de cariño ♡","De todo corazón 🙇","Cero tokens. La esperanza sigue compilando."],"speech.heart":["Un poco de cariño ♡","De todo corazón 🙇","Cero tokens. La esperanza sigue compilando."],"speech.bow":["Un poco de cariño ♡","De todo corazón 🙇","Cero tokens. La esperanza sigue compilando."],"speech.join":["Un poco de cariño ♡","De todo corazón 🙇","Cero tokens. La esperanza sigue compilando."],"loading":"Cargando la plaza…","retryLoad":"Volver a cargar","clearDraft":"Borrar borrador","draftRestored":"Borrador restaurado en esta pestaña. Caduca en 30 minutos.","draftCleared":"Borrador borrado.","draftHint":"Solo el borrador sin enviar se guarda en esta pestaña, durante un máximo de 30 minutos. No se envía nada.","connectionUnavailable":"La conexión compartida no está disponible. No se ha sumado al contador compartido.","queueFull":"Hay demasiados deseos pendientes. Espera a que vuelva la conexión.","readOnlyConnection":"Prueba de conexión de solo lectura · los mensajes siguen siendo locales.","resumeMotion":"Reanudar animación","fxLabel":"Efectos de luz","fxAuto":"Automático","fxRich":"Intenso","fxSoft":"Suave","fxOff":"Luz estática","fxReduced":"Se prioriza la reducción de movimiento.","fxStopped":"Luces estáticas. Se mantienen las acciones de los personajes.","fxSoftActive":"Luz suave · menos partículas.","fxRichActive":"Halo · estrellas · pétalos · reacciones","reset.waiting":"Esperando un reinicio revisado","reset.disconnected":"La conexión con X no está configurada","reset.paused":"El operador pausó la celebración","reset.demo":"Vista previa del día de bendiciones","reset.celebrating":"Día de bendiciones · ¡gracias!","reset.announced":"Anunciado · aplicación no confirmada","reset.history":"Reinicio anterior · celebración finalizada","reset.stale":"Es necesario volver a comprobar la fuente","reset.revoked":"Verificación retirada · requiere revisión","reset.demoRibbon":"DEMO · LLUVIA DE BENDICIONES","reset.ribbon":"GRACIAS · DÍA DE BENDICIONES","reset.demoBadge":"DEMO · sin reinicio real verificado","reset.feed":"Calendario de reinicios","reset.connected":"conectado","reset.notConnected":"sin conexión","reset.stopPreview":"Terminar vista previa","reset.preview":"Ver día de bendiciones","reset.demoNote":"Ensayo visual local de dos minutos. No se ha verificado ningún reinicio real.","reset.noteActive":"La lluvia dorada continúa hasta terminar el día del evento. Comprueba tu plan y tu cuenta.","reset.noteWaiting":"Solo un reinicio completado y revisado activa la celebración. La hora de publicación no es la hora de aplicación.","reset.details":"Fecha del reinicio y evidencia","reset.timeUnknown":"Hora exacta no indicada","reset.banked":"Crédito de reinicio guardado","reset.usage":"Reinicio de uso","reset.source":"Ver fuente","reset.effectiveLabel":"Fecha / hora de aplicación","reset.localLabel":"Tu hora local","reset.publishedLabel":"Publicación","reset.scopeLabel":"Usuarios elegibles","reset.kindLabel":"Tipo de reinicio","reset.endLabel":"Fin de la celebración","reset.approvedLabel":"Revisado","reset.checkedLabel":"Última comprobación"},"pt-BR":{"brand":"A praça de desejos da comunidade Codex","language":"Idioma","auto":"Automático","about":"Sobre","newsTool":"Clima do X","motionOff":"Pausar movimento","motionOn":"Retomar movimento","heart":"Enviar coração","heartHint":"Um pouco de carinho","bow":"Fazer reverência","bowHint":"De todo o coração","hearts":"Corações enviados","bows":"Reverências","characters":"Personagens","hero":"Santo Tibo, mais uma vez.","lead":"Sem tokens, mas com esperança.","plaque":"Padroeiro de mais um reset · arte de fã não oficial","note":"Mais uma vez, por favor… ♡","chat":"Sala de espera","sampleChat":"Conversa de exemplo","newsTitle":"𝕏 Notícias do reset","changeMood":"Mudar clima ↗","fiction":"Não é previsão · falas fictícias","buildPrompt":"Depois do reset, vou…","ship":"Publicar meu primeiro app 🚀","bug":"Corrigir aquele bug 🐛","shipText":"Depois do reset, vou publicar meu primeiro app!","bugText":"Depois do reset, vou corrigir aquele bug!","placeholder":"Escreva uma mensagem…","chatLabel":"Mensagem da demonstração local","send":"Enviar mensagem","close":"Fechar","back":"Voltar à praça","demo":"DEMO LOCAL","noServer":"Sem chat compartilhado","demoNotice":"Cliques, personagens e chat são demos locais. Veja o calendário de resets para conferir a conexão com o X.","externalNotice":"Prévia de contagem externa. Os personagens representam cliques, não usuários conectados.","disclaimer":"Projeto de fãs não oficial, sem vínculo com a OpenAI. Corações e reverências não restauram os limites de uso.","fictionFooter":"Os balões são pensamentos fictícios, não citações reais.","aboutTitle":"Um pequeno desejo, não um botão de reset real.","aboutBody":"Começa com cinco personagens. Um novo chega aos 1, 3, 6, 10… cliques. Recarregar zera as contagens locais. A conversa fica só nesta tela. O personagem central é arte gerada de fã, não um endosso ou uma afirmação religiosa.","aboutSafety":"Os estados do X são prévias, não notícias ao vivo ou probabilidades. Uma pessoa precisa revisar fonte, autor, data e público antes da publicação. Conversas reais e textos aprovados não são traduzidos automaticamente.","aboutPrivacy":"O idioma é salvo só neste dispositivo, quando permitido. Não pedimos GPS. Após o deploy, o mesmo site pode fornecer um código de país, sem devolver endereço ou IP original. Contagens compartilhadas e moderação precisam de servidor.","signalTitle":"Novas notícias, novos desejos.","signalIntro":"É apenas uma prévia visual local. Não lê posts do X nem calcula a probabilidade de reset.","signalState":"Clima de demonstração","example":"Fala fictícia · não é uma citação","signalSafety":"Notícias ao vivo exigem revisão humana de fonte, autor, data e público. Os cliques nunca mudam o estado das notícias.","applyMood":"Usar este clima","readWish":"Ler um desejo","wishLabel":"Um desejo acessível sem animação","bubbleLabel":"Pensamento fictício","me":"Eu","meLocal":"Eu · local","skip":"Ir aos botões de coração e reverência","canvasLabel":"Praça de desejos com personagens em pixels. Mais cliques adicionam personagens fazendo reverências. Não é uma contagem de usuários conectados. As mesmas informações e controles estão disponíveis em texto.","portraitAlt":"Personagem em pixels sentado com uma auréola e um gatinho. Arte gerada de fã não oficial.","pageTitle":"TIBO, PLS. — Um pequeno desejo de reset","toolsLabel":"Ferramentas da praça","statsLabel":"Cliques locais e personagens ilustrados","countTitle":"{count} personagens; {visible} visíveis. Não são usuários conectados.","growth":"{total} desejos · faltam {remaining} para um companheiro","growthOverflow":"{total} desejos · {count} fora da tela","meterLabel":"Faltam {remaining} desejos para o próximo companheiro","rateAction":"Rápido demais. Faça uma pausa e tente novamente.","actionStatus":"{hearts} corações · {bows} reverências · {count} novos companheiros. Apenas nesta tela.","actionExternal":"Ação local emitida. Totais compartilhados mudam só com dados confirmados.","chatIdle":"Apenas local · não salvo no servidor.","chatEmpty":"Escreva uma mensagem primeiro.","chatRate":"Espere três segundos entre mensagens.","chatSent":"Adicionado localmente. Você pode enviar de novo em três segundos.","chatTooLong":"Use no máximo 160 caracteres. A mensagem não foi enviada.","loadError":"Não foi possível carregar a arte. Abra novamente o HTML completo.","badgeDemo":"DEMO · X desconectado","badgeStale":"Revisão expirada","badgeApproved":"Prévia de dados revisados","badgeReview":"Revisar","badgeData":"Dados revisados","sourceLink":"Original de @{account} ↗","sourceTime":"Publicado {posted} · revisado {reviewed}","audience":"Público: {audience}","sourceOriginal":"Texto original · sem tradução","newsTitleDemo":"Experimente climas do X. Não são anúncios reais.","newsTitleApproved":"Prévia de dados revisados; este navegador não verificou a fonte.","localeBrowser":"Automático · idioma do navegador","localeCountry":"Automático · referência do país","localeFallback":"Automático · inglês padrão","localeManual":"Idioma escolhido manualmente","localeUnsaved":"O idioma foi aplicado, mas este navegador não pode salvá-lo.","state.unknown.label":"Notícias não verificadas","state.unknown.caption":"Não sei a chance, mas sei fazer reverência.","state.unknown.description":"Ainda não há notícias atuais revisadas conectadas.","state.unknown.short":"Notícias não verificadas","speech.unknown":["Não sei a chance, mas sei fazer reverência.","Zero tokens. A esperança continua compilando."],"short.unknown":["Notícias não verificadas","♡ Notícias não verificadas"],"state.buzz.label":"Comunidade esperançosa","state.buzz.caption":"A timeline está agitada. Sem anúncio ainda.","state.buzz.description":"É expectativa da comunidade, não anúncio oficial.","state.buzz.short":"Comunidade esperançosa","speech.buzz":["A timeline está agitada. Sem anúncio ainda.","Rumores precisam de fontes; desejos, de corações."],"short.buzz":["Comunidade esperançosa","♡ Comunidade esperançosa"],"state.hint.label":"Prévia oficial","state.hint.caption":"Uma prévia não é um reset. Confira antes.","state.hint.description":"A prévia não garante conclusão nem acesso na sua conta.","state.hint.short":"Prévia oficial","speech.hint":["Uma prévia não é um reset. Confira antes.","Esta reverência é uma reserva antecipada."],"short.hint":["Prévia oficial","♡ Prévia oficial"],"state.confirmed.label":"Reset anunciado","state.confirmed.caption":"Reverências de gratidão! Confira sua conta.","state.confirmed.description":"Confira o público, o horário e o seu uso.","state.confirmed.short":"Reset anunciado","speech.confirmed":["Reverências de gratidão! Confira sua conta.","De reverências de esperança para gratidão."],"short.confirmed":["Reset anunciado","♡ Reset anunciado"],"state.delayed.label":"Adiado ou pausado","state.delayed.caption":"Prorrogação dos desejos. Alongue os joelhos!","state.delayed.description":"Há um aviso de adiamento ou pausa. Aguarde atualização.","state.delayed.short":"Adiado ou pausado","speech.delayed":["Prorrogação dos desejos. Alongue os joelhos!","Até reverência precisa de intervalo."],"short.delayed":["Adiado ou pausado","♡ Adiado ou pausado"],"state.stale.label":"Revisão necessária","state.stale.caption":"Confira a data antes de comemorar.","state.stale.description":"A revisão expirou. Notícia antiga não é anúncio atual.","state.stale.short":"Revisão necessária","speech.stale":["Confira a data antes de comemorar.","O post de ontem não é promessa para hoje."],"short.stale":["Revisão necessária","♡ Revisão necessária"],"samples":["Depois do reset, vou publicar meu primeiro app!","Zero tokens. A esperança continua compilando.","Rumores precisam de fontes; desejos, de corações.","Um pouco de carinho ❤️","Depois do reset, vou corrigir aquele bug!","Até reverência precisa de intervalo."],"speech.ambient":["Um pouco de carinho ♡","De todo o coração 🙇","Zero tokens. A esperança continua compilando."],"speech.heart":["Um pouco de carinho ♡","De todo o coração 🙇","Zero tokens. A esperança continua compilando."],"speech.bow":["Um pouco de carinho ♡","De todo o coração 🙇","Zero tokens. A esperança continua compilando."],"speech.join":["Um pouco de carinho ♡","De todo o coração 🙇","Zero tokens. A esperança continua compilando."],"loading":"Carregando a praça…","retryLoad":"Recarregar","clearDraft":"Apagar rascunho","draftRestored":"Rascunho restaurado nesta aba. Expira em 30 minutos.","draftCleared":"Rascunho apagado.","draftHint":"Somente o rascunho não enviado fica nesta aba por até 30 minutos. Nada é enviado.","connectionUnavailable":"A conexão compartilhada está indisponível. Nada foi adicionado à contagem compartilhada.","queueFull":"Há muitos desejos pendentes. Aguarde a conexão voltar.","readOnlyConnection":"Teste de conexão somente leitura · mensagens apenas locais.","resumeMotion":"Retomar animação","fxLabel":"Efeitos de luz","fxAuto":"Automático","fxRich":"Intenso","fxSoft":"Suave","fxOff":"Luz estática","fxReduced":"A redução de movimento tem prioridade.","fxStopped":"Luzes estáticas. As ações dos personagens continuam.","fxSoftActive":"Luz suave · menos partículas.","fxRichActive":"Halo · estrelas · pétalas · reações","reset.waiting":"Aguardando um reset revisado","reset.disconnected":"A coleta do X não está conectada","reset.paused":"O operador pausou a celebração","reset.demo":"Prévia do dia de bênçãos","reset.celebrating":"Dia de bênçãos · obrigado!","reset.announced":"Anunciado · aplicação não confirmada","reset.history":"Reset anterior · celebração encerrada","reset.stale":"É necessário rever a fonte","reset.revoked":"Confirmação retirada · revisão necessária","reset.demoRibbon":"DEMO · CHUVA DE BÊNÇÃOS","reset.ribbon":"OBRIGADO · DIA DE BÊNÇÃOS","reset.demoBadge":"DEMO · nenhum reset real verificado","reset.feed":"Calendário de resets","reset.connected":"conectado","reset.notConnected":"não conectado","reset.stopPreview":"Encerrar prévia","reset.preview":"Ver dia de bênçãos","reset.demoNote":"Ensaio visual local de dois minutos. Nenhum reset real foi confirmado.","reset.noteActive":"A chuva dourada continua até o fim do dia do evento. Confira seu plano e sua conta.","reset.noteWaiting":"Apenas um reset aplicado e revisado inicia a celebração. O horário da publicação não é o da aplicação.","reset.details":"Data do reset e evidência","reset.timeUnknown":"Horário exato não informado","reset.banked":"Crédito de reset armazenado","reset.usage":"Reset de uso","reset.source":"Ver fonte","reset.effectiveLabel":"Data / hora de aplicação","reset.localLabel":"Seu horário local","reset.publishedLabel":"Publicação","reset.scopeLabel":"Usuários elegíveis","reset.kindLabel":"Tipo de reset","reset.endLabel":"Fim da celebração","reset.approvedLabel":"Revisado","reset.checkedLabel":"Última verificação"},"fr":{"brand":"La place des vœux de la communauté Codex","language":"Langue","auto":"Automatique","about":"À propos","newsTool":"Ambiance X","motionOff":"Arrêter l’animation","motionOn":"Reprendre l’animation","heart":"Envoyer un cœur","heartHint":"Un peu d’affection","bow":"S’incliner","bowHint":"Avec sincérité","hearts":"Cœurs envoyés","bows":"Révérences","characters":"Personnages","hero":"Saint Tibo, encore une fois.","lead":"Plus de tokens. Toujours de l’espoir.","plaque":"Patron d’un reset de plus · fan art non officiel","note":"Encore une fois… ♡","chat":"Salle d’attente","sampleChat":"Exemples de messages","newsTitle":"𝕏 Nouvelles du reset","changeMood":"Changer d’ambiance ↗","fiction":"Pas une prévision · dialogues fictifs","buildPrompt":"Après le reset, je vais…","ship":"Publier ma première app 🚀","bug":"Corriger ce bug 🐛","shipText":"Après le reset, je publierai ma première app !","bugText":"Après le reset, je corrigerai ce bug !","placeholder":"Écrire un message…","chatLabel":"Message de démonstration locale","send":"Envoyer le message","close":"Fermer","back":"Retour à la place","demo":"DÉMO LOCALE","noServer":"Pas de chat partagé","demoNotice":"Clics, personnages et chat sont des démos locales. Consultez le calendrier pour connaître l’état de la connexion X.","externalNotice":"Aperçu des comptes externes. Les personnages représentent des clics, pas des utilisateurs connectés.","disclaimer":"Projet de fans non officiel, sans affiliation avec OpenAI. Les cœurs et les révérences ne réinitialisent pas les limites d’utilisation.","fictionFooter":"Les bulles sont des pensées fictives, pas de vraies citations.","aboutTitle":"Un petit vœu, pas un véritable bouton de reset.","aboutBody":"Cinq personnages au départ. Un compagnon arrive à 1, 3, 6, 10… clics. Recharger efface les comptes locaux. Les messages restent sur cet écran. Le personnage central est un fan art généré, sans approbation personnelle ni statut religieux revendiqué.","aboutSafety":"Les états X sont des aperçus, pas des nouvelles en direct ni des probabilités. Une personne doit vérifier source, auteur, date et public avant publication. Les vrais messages et les textes approuvés ne sont pas traduits automatiquement.","aboutPrivacy":"La langue est enregistrée sur cet appareil uniquement, si autorisé. Aucun GPS n’est demandé. Après déploiement, le site peut fournir un code pays, sans retourner d’adresse ni d’IP brute. Les comptes partagés et la modération nécessitent un serveur.","signalTitle":"De nouvelles nouvelles, de nouveaux vœux.","signalIntro":"Simple aperçu visuel local. Aucun post X n’est lu et aucune probabilité de reset n’est calculée.","signalState":"Ambiance de démonstration","example":"Dialogue fictif · pas une citation","signalSafety":"Les nouvelles nécessitent une validation humaine de la source, de l’auteur, de la date et du public. Les clics ne modifient jamais leur état.","applyMood":"Utiliser cette ambiance","readWish":"Lire un vœu","wishLabel":"Un vœu accessible sans animation","bubbleLabel":"Pensée fictive","me":"Moi","meLocal":"Moi · local","skip":"Aller aux boutons cœur et révérence","canvasLabel":"Place de vœux en pixels. Les clics ajoutent des personnages qui s’inclinent. Il ne s’agit pas d’utilisateurs connectés. Les mêmes informations et commandes sont disponibles en texte.","portraitAlt":"Personnage en pixels assis avec une auréole et un chaton. Fan art généré non officiel.","pageTitle":"TIBO, PLS. — Un petit vœu de reset","toolsLabel":"Outils de la place","statsLabel":"Clics locaux et personnages illustrés","countTitle":"{count} personnages ; {visible} visibles. Pas un compte d’utilisateurs connectés.","growth":"{total} vœux · encore {remaining} pour un compagnon","growthOverflow":"{total} vœux · {count} compagnons hors écran","meterLabel":"Encore {remaining} vœux pour le prochain compagnon","rateAction":"Trop rapide. Faites une petite pause avant de réessayer.","actionStatus":"{hearts} cœurs · {bows} révérences · {count} nouveaux compagnons. Sur cet écran seulement.","actionExternal":"Action locale émise. Les totaux changent seulement avec des données confirmées.","chatIdle":"Local uniquement · rien n’est enregistré sur un serveur.","chatEmpty":"Écrivez un message d’abord.","chatRate":"Attendez trois secondes entre deux messages.","chatSent":"Ajouté localement. Nouvel envoi possible dans trois secondes.","chatTooLong":"160 caractères maximum. Le message n’a pas été envoyé.","loadError":"L’image n’a pas pu être chargée. Rouvrez le fichier HTML complet.","badgeDemo":"DÉMO · X hors ligne","badgeStale":"Validation expirée","badgeApproved":"Aperçu des données validées","badgeReview":"À vérifier","badgeData":"Données validées","sourceLink":"Original de @{account} ↗","sourceTime":"Publié {posted} · vérifié {reviewed}","audience":"Public concerné : {audience}","sourceOriginal":"Texte original · non traduit","newsTitleDemo":"Tester les ambiances X. Ce ne sont pas de vraies annonces.","newsTitleApproved":"Aperçu des données validées ; ce navigateur n’a pas vérifié la source.","localeBrowser":"Automatique · langue du navigateur","localeCountry":"Automatique · indication du pays","localeFallback":"Automatique · anglais par défaut","localeManual":"Langue choisie manuellement","localeUnsaved":"La langue est appliquée, mais ce navigateur ne peut pas l’enregistrer.","state.unknown.label":"Nouvelles non vérifiées","state.unknown.caption":"Aucune probabilité à citer. On peut s’incliner.","state.unknown.description":"Aucune nouvelle récente validée n’est encore connectée.","state.unknown.short":"Nouvelles non vérifiées","speech.unknown":["Aucune probabilité à citer. On peut s’incliner.","Zéro token. L’espoir compile toujours."],"short.unknown":["Nouvelles non vérifiées","♡ Nouvelles non vérifiées"],"state.buzz.label":"La communauté espère","state.buzz.caption":"La timeline s’agite. Pas encore d’annonce.","state.buzz.description":"Des suppositions, pas une annonce officielle de reset.","state.buzz.short":"La communauté espère","speech.buzz":["La timeline s’agite. Pas encore d’annonce.","Les rumeurs veulent des sources, les vœux des cœurs."],"short.buzz":["La communauté espère","♡ La communauté espère"],"state.hint.label":"Annonce préliminaire","state.hint.caption":"Un indice n’est pas un reset. Vérifions.","state.hint.description":"L’annonce ne garantit ni l’exécution ni votre éligibilité.","state.hint.short":"Annonce préliminaire","speech.hint":["Un indice n’est pas un reset. Vérifions.","Cette révérence est une précommande."],"short.hint":["Annonce préliminaire","♡ Annonce préliminaire"],"state.confirmed.label":"Reset annoncé","state.confirmed.caption":"Révérences de gratitude ! Vérifiez votre compte.","state.confirmed.description":"Vérifiez le public, l’horaire et votre utilisation.","state.confirmed.short":"Reset annoncé","speech.confirmed":["Révérences de gratitude ! Vérifiez votre compte.","Des révérences d’espoir à celles de gratitude."],"short.confirmed":["Reset annoncé","♡ Reset annoncé"],"state.delayed.label":"Retard ou pause","state.delayed.caption":"Prolongation des vœux. Étirez les genoux !","state.delayed.description":"Un retard ou une pause est annoncé. Attendons la suite.","state.delayed.short":"Retard ou pause","speech.delayed":["Prolongation des vœux. Étirez les genoux !","Même les révérences ont besoin de repos."],"short.delayed":["Retard ou pause","♡ Retard ou pause"],"state.stale.label":"À vérifier de nouveau","state.stale.caption":"Regardez la date avant de célébrer.","state.stale.description":"La validation a expiré. Une vieille nouvelle n’est pas actuelle.","state.stale.short":"À vérifier de nouveau","speech.stale":["Regardez la date avant de célébrer.","Le post d’hier n’est pas une promesse pour aujourd’hui."],"short.stale":["À vérifier de nouveau","♡ À vérifier de nouveau"],"samples":["Après le reset, je publierai ma première app !","Zéro token. L’espoir compile toujours.","Les rumeurs veulent des sources, les vœux des cœurs.","Un peu d’affection ❤️","Après le reset, je corrigerai ce bug !","Même les révérences ont besoin de repos."],"speech.ambient":["Un peu d’affection ♡","Avec sincérité 🙇","Zéro token. L’espoir compile toujours."],"speech.heart":["Un peu d’affection ♡","Avec sincérité 🙇","Zéro token. L’espoir compile toujours."],"speech.bow":["Un peu d’affection ♡","Avec sincérité 🙇","Zéro token. L’espoir compile toujours."],"speech.join":["Un peu d’affection ♡","Avec sincérité 🙇","Zéro token. L’espoir compile toujours."],"loading":"Chargement de la place…","retryLoad":"Recharger","clearDraft":"Effacer le brouillon","draftRestored":"Brouillon restauré dans cet onglet. Il expire dans 30 minutes.","draftCleared":"Brouillon effacé.","draftHint":"Seul le brouillon non envoyé est conservé dans cet onglet, pendant 30 minutes au maximum. Rien n’est envoyé.","connectionUnavailable":"La connexion partagée est indisponible. Rien n’a été ajouté au compteur partagé.","queueFull":"Trop de souhaits en attente. Attendez le rétablissement de la connexion.","readOnlyConnection":"Test de connexion en lecture seule · messages uniquement locaux.","resumeMotion":"Reprendre les animations","fxLabel":"Effets lumineux","fxAuto":"Automatique","fxRich":"Riche","fxSoft":"Doux","fxOff":"Lumière fixe","fxReduced":"La réduction des animations est prioritaire.","fxStopped":"Les lumières sont fixes. Les personnages restent animés.","fxSoftActive":"Lumière douce · moins de particules.","fxRichActive":"Halo · étoiles · pétales · réactions","reset.waiting":"En attente d’une réinitialisation vérifiée","reset.disconnected":"La collecte X n’est pas connectée","reset.paused":"Célébration suspendue par l’opérateur","reset.demo":"Aperçu du jour de bénédictions","reset.celebrating":"Jour de bénédictions · merci !","reset.announced":"Annonce · application non confirmée","reset.history":"Ancienne réinitialisation · fête terminée","reset.stale":"La source doit être revérifiée","reset.revoked":"Confirmation retirée · nouvelle vérification requise","reset.demoRibbon":"DÉMO · PLUIE DE BÉNÉDICTIONS","reset.ribbon":"MERCI · JOUR DE BÉNÉDICTIONS","reset.demoBadge":"DÉMO · aucune réinitialisation vérifiée","reset.feed":"Calendrier des réinitialisations","reset.connected":"connecté","reset.notConnected":"non connecté","reset.stopPreview":"Fermer l’aperçu","reset.preview":"Voir le jour de bénédictions","reset.demoNote":"Démonstration locale de deux minutes. Aucune réinitialisation réelle n’a été vérifiée.","reset.noteActive":"La pluie dorée dure jusqu’à la fin du jour de l’événement. Vérifiez votre formule et votre compte.","reset.noteWaiting":"Seule une réinitialisation appliquée et approuvée déclenche la fête. Publication et application ont des horaires distincts.","reset.details":"Date et justificatifs","reset.timeUnknown":"Heure exacte non indiquée","reset.banked":"Crédit de réinitialisation en réserve","reset.usage":"Réinitialisation de l’usage","reset.source":"Voir la source","reset.effectiveLabel":"Date / heure d’application","reset.localLabel":"Votre heure locale","reset.publishedLabel":"Publication","reset.scopeLabel":"Utilisateurs concernés","reset.kindLabel":"Type de réinitialisation","reset.endLabel":"Fin de la célébration","reset.approvedLabel":"Vérification","reset.checkedLabel":"Dernier contrôle de la source"},"de":{"brand":"Der Reset-Wunschplatz der Codex-Community","language":"Sprache","auto":"Automatisch","about":"Info","newsTool":"X-Stimmung","motionOff":"Bewegung pausieren","motionOn":"Bewegung fortsetzen","heart":"Herz senden","heartHint":"Ein bisschen Liebe","bow":"Verbeugen","bowHint":"Von ganzem Herzen","hearts":"Gesendete Herzen","bows":"Verbeugungen","characters":"Wunschfiguren","hero":"Heiliger Tibo, noch einmal.","lead":"Keine Tokens. Aber noch Hoffnung.","plaque":"Schutzpatron eines weiteren Resets · inoffizielle Fankunst","note":"Noch einmal, bitte… ♡","chat":"Warteraum","sampleChat":"Beispielnachrichten","newsTitle":"𝕏 Reset-Neuigkeiten","changeMood":"Stimmung ändern ↗","fiction":"Keine Prognose · erfundene Aussagen","buildPrompt":"Nach dem Reset werde ich…","ship":"Meine erste App starten 🚀","bug":"Diesen Bug beheben 🐛","shipText":"Nach dem Reset veröffentliche ich meine erste App!","bugText":"Nach dem Reset behebe ich diesen Bug!","placeholder":"Nachricht schreiben…","chatLabel":"Nachricht der lokalen Demo","send":"Nachricht senden","close":"Schließen","back":"Zurück zum Platz","demo":"LOKALE DEMO","noServer":"Kein gemeinsamer Chat","demoNotice":"Klicks, Figuren und Chat sind lokale Demos. Den X-Verbindungsstatus findest du im Reset-Kalender.","externalNotice":"Vorschau externer Zähler. Figuren stehen für Klicks, nicht für verbundene Nutzer.","disclaimer":"Inoffizielles Fanprojekt ohne Verbindung zu OpenAI. Herzen und Verbeugungen setzen keine Nutzungslimits zurück.","fictionFooter":"Sprechblasen sind erfundene Gedanken, keine echten Zitate.","aboutTitle":"Ein kleiner Wunsch, kein echter Reset-Knopf.","aboutBody":"Start mit fünf Figuren. Nach 1, 3, 6, 10… Klicks kommt jemand dazu. Neuladen löscht die lokalen Zähler. Der Chat bleibt auf diesem Bildschirm. Die zentrale Figur ist generierte Fankunst, keine persönliche Unterstützung oder religiöse Behauptung.","aboutSafety":"X-Zustände sind Vorschauen, keine Live-Meldungen oder Wahrscheinlichkeiten. Quelle, Autor, Zeitpunkt und Zielgruppe müssen vor Veröffentlichung von einem Menschen geprüft werden. Echte Chattexte und freigegebene Originalmeldungen werden nicht automatisch übersetzt.","aboutPrivacy":"Die Sprachwahl wird, falls erlaubt, nur auf diesem Gerät gespeichert. GPS wird nicht angefragt. Nach Bereitstellung kann dieselbe Website einen Ländercode liefern, ohne Adresse oder rohe IP zurückzugeben. Gemeinsame Zähler und Moderation benötigen einen Server.","signalTitle":"Neue Nachrichten, neue Wünsche.","signalIntro":"Nur eine lokale visuelle Vorschau. Liest keine X-Beiträge und berechnet keine Reset-Wahrscheinlichkeit.","signalState":"Vorschau-Stimmung","example":"Erfundene Aussage · kein Zitat","signalSafety":"Live-Meldungen benötigen menschliche Prüfung von Quelle, Autor, Zeitpunkt und Zielgruppe. Klickzahlen ändern niemals den Nachrichtenstatus.","applyMood":"Diese Stimmung verwenden","readWish":"Einen Wunsch lesen","wishLabel":"Ein Wunsch ohne Animation","bubbleLabel":"Erfundener Gedanke","me":"Ich","meLocal":"Ich · lokal","skip":"Zu Herz- und Verbeugungsknöpfen","canvasLabel":"Pixel-Wunschplatz. Mehr Klicks fügen verbeugende Figuren hinzu. Die Figuren zeigen keine Zahl verbundener Nutzer. Dieselben Informationen und Bedienelemente gibt es als Text.","portraitAlt":"Sitzende Pixelfigur mit Heiligenschein und kleinem Kätzchen. Generierte, inoffizielle Fankunst.","pageTitle":"TIBO, PLS. — Ein kleiner Reset-Wunsch","toolsLabel":"Werkzeuge des Platzes","statsLabel":"Lokale Klicks und illustrierte Figuren","countTitle":"{count} Wunschfiguren; {visible} sichtbar. Keine Online-Nutzerzahl.","growth":"{total} Wünsche · noch {remaining} bis zum Begleiter","growthOverflow":"{total} Wünsche · {count} außerhalb des Bildes","meterLabel":"Noch {remaining} Wünsche bis zum nächsten Begleiter","rateAction":"Zu schnell. Kurz pausieren und erneut versuchen.","actionStatus":"{hearts} Herzen · {bows} Verbeugungen · {count} neue Begleiter. Nur auf diesem Bildschirm.","actionExternal":"Lokale Aktion gesendet. Gemeinsame Zähler ändern sich nur mit bestätigten Daten.","chatIdle":"Nur lokal · nicht auf einem Server gespeichert.","chatEmpty":"Bitte zuerst eine Nachricht schreiben.","chatRate":"Drei Sekunden zwischen Nachrichten warten.","chatSent":"Lokal hinzugefügt. In drei Sekunden ist die nächste Nachricht möglich.","chatTooLong":"Höchstens 160 Zeichen. Die Nachricht wurde nicht gesendet.","loadError":"Die Grafik konnte nicht geladen werden. Die vollständige HTML-Datei erneut öffnen.","badgeDemo":"DEMO · X offline","badgeStale":"Prüfung abgelaufen","badgeApproved":"Vorschau geprüfter Daten","badgeReview":"Erneut prüfen","badgeData":"Geprüfte Daten","sourceLink":"Original von @{account} ↗","sourceTime":"Veröffentlicht {posted} · geprüft {reviewed}","audience":"Zielgruppe: {audience}","sourceOriginal":"Originaltext · nicht übersetzt","newsTitleDemo":"X-Stimmungen ausprobieren. Keine echten Ankündigungen.","newsTitleApproved":"Vorschau geprüfter Daten; dieser Browser hat die Quelle nicht geprüft.","localeBrowser":"Automatisch · Browsersprache","localeCountry":"Automatisch · Länderhinweis","localeFallback":"Automatisch · Englisch als Standard","localeManual":"Manuell gewählte Sprache","localeUnsaved":"Die Sprache ist aktiv, kann in diesem Browser aber nicht gespeichert werden.","state.unknown.label":"Nachrichten ungeprüft","state.unknown.caption":"Keine Quote bekannt. Verbeugen geht trotzdem.","state.unknown.description":"Noch keine geprüften aktuellen Reset-Meldungen verbunden.","state.unknown.short":"Nachrichten ungeprüft","speech.unknown":["Keine Quote bekannt. Verbeugen geht trotzdem.","Null Tokens. Die Hoffnung kompiliert weiter."],"short.unknown":["Nachrichten ungeprüft","♡ Nachrichten ungeprüft"],"state.buzz.label":"Die Community hofft","state.buzz.caption":"Die Timeline ist laut. Noch keine Ankündigung.","state.buzz.description":"Erwartungen der Community, keine offizielle Ankündigung.","state.buzz.short":"Die Community hofft","speech.buzz":["Die Timeline ist laut. Noch keine Ankündigung.","Gerüchte brauchen Quellen. Wünsche brauchen Herzen."],"short.buzz":["Die Community hofft","♡ Die Community hofft"],"state.hint.label":"Offizielle Vorschau","state.hint.caption":"Ein Hinweis ist kein Reset. Erst prüfen!","state.hint.description":"Die Vorschau garantiert weder Abschluss noch Berechtigung.","state.hint.short":"Offizielle Vorschau","speech.hint":["Ein Hinweis ist kein Reset. Erst prüfen!","Diese Verbeugung ist eine Vorbestellung."],"short.hint":["Offizielle Vorschau","♡ Offizielle Vorschau"],"state.confirmed.label":"Reset angekündigt","state.confirmed.caption":"Dankbare Verbeugungen! Erst das Konto prüfen.","state.confirmed.description":"Zielgruppe, Zeitpunkt und eigene Nutzung prüfen.","state.confirmed.short":"Reset angekündigt","speech.confirmed":["Dankbare Verbeugungen! Erst das Konto prüfen.","Von hoffnungsvollen zu dankbaren Verbeugungen."],"short.confirmed":["Reset angekündigt","♡ Reset angekündigt"],"state.delayed.label":"Verzögert oder pausiert","state.delayed.caption":"Verlängerung der Wünsche. Knie strecken!","state.delayed.description":"Eine Verzögerung oder Pause wurde angekündigt.","state.delayed.short":"Verzögert oder pausiert","speech.delayed":["Verlängerung der Wünsche. Knie strecken!","Auch Verbeugungen brauchen eine Pause."],"short.delayed":["Verzögert oder pausiert","♡ Verzögert oder pausiert"],"state.stale.label":"Erneute Prüfung nötig","state.stale.caption":"Vor dem Feiern das Datum prüfen.","state.stale.description":"Die Prüfung ist abgelaufen. Alte Meldungen sind nicht aktuell.","state.stale.short":"Erneute Prüfung nötig","speech.stale":["Vor dem Feiern das Datum prüfen.","Der Post von gestern ist kein Versprechen für heute."],"short.stale":["Erneute Prüfung nötig","♡ Erneute Prüfung nötig"],"samples":["Nach dem Reset veröffentliche ich meine erste App!","Null Tokens. Die Hoffnung kompiliert weiter.","Gerüchte brauchen Quellen. Wünsche brauchen Herzen.","Ein bisschen Liebe ❤️","Nach dem Reset behebe ich diesen Bug!","Auch Verbeugungen brauchen eine Pause."],"speech.ambient":["Ein bisschen Liebe ♡","Von ganzem Herzen 🙇","Null Tokens. Die Hoffnung kompiliert weiter."],"speech.heart":["Ein bisschen Liebe ♡","Von ganzem Herzen 🙇","Null Tokens. Die Hoffnung kompiliert weiter."],"speech.bow":["Ein bisschen Liebe ♡","Von ganzem Herzen 🙇","Null Tokens. Die Hoffnung kompiliert weiter."],"speech.join":["Ein bisschen Liebe ♡","Von ganzem Herzen 🙇","Null Tokens. Die Hoffnung kompiliert weiter."],"loading":"Der Platz wird geladen…","retryLoad":"Neu laden","clearDraft":"Entwurf löschen","draftRestored":"Entwurf in diesem Tab wiederhergestellt. Er läuft nach 30 Minuten ab.","draftCleared":"Entwurf gelöscht.","draftHint":"Nur der ungesendete Entwurf bleibt bis zu 30 Minuten in diesem Tab. Es wird nichts gesendet.","connectionUnavailable":"Die gemeinsame Verbindung ist nicht verfügbar. Der gemeinsame Zähler wurde nicht erhöht.","queueFull":"Zu viele ausstehende Wünsche. Bitte warte auf die Verbindung.","readOnlyConnection":"Schreibgeschützter Verbindungstest · Nachrichten bleiben lokal.","resumeMotion":"Animationen fortsetzen","fxLabel":"Lichteffekte","fxAuto":"Automatisch","fxRich":"Üppig","fxSoft":"Dezent","fxOff":"Statisches Licht","fxReduced":"Reduzierte Bewegung hat Vorrang.","fxStopped":"Statisches Licht. Figuren bleiben animiert.","fxSoftActive":"Sanftes Licht · weniger Partikel.","fxRichActive":"Heiligenschein · Sterne · Blüten · Klickreaktionen","reset.waiting":"Warten auf eine geprüfte Zurücksetzung","reset.disconnected":"X-Abfrage ist nicht verbunden","reset.paused":"Feier vom Betreiber pausiert","reset.demo":"Vorschau des Segenstages","reset.celebrating":"Ein Tag voller Segen · danke!","reset.announced":"Angekündigt · noch nicht bestätigt","reset.history":"Frühere Zurücksetzung · Feier beendet","reset.stale":"Quelle muss erneut geprüft werden","reset.revoked":"Bestätigung zurückgezogen · Prüfung nötig","reset.demoRibbon":"DEMO · SEGENSREGEN","reset.ribbon":"DANKE · TAG DES SEGENS","reset.demoBadge":"DEMO · keine echte Zurücksetzung bestätigt","reset.feed":"Reset-Kalender","reset.connected":"verbunden","reset.notConnected":"nicht verbunden","reset.stopPreview":"Vorschau beenden","reset.preview":"Segenstag ansehen","reset.demoNote":"Zweiminütige lokale Vorschau. Es wurde keine echte Zurücksetzung bestätigt.","reset.noteActive":"Der goldene Regen dauert bis zum Ende des Ereignistages. Prüfe deinen Tarif und dein Konto.","reset.noteWaiting":"Nur eine geprüfte, erfolgte Zurücksetzung startet die Feier. Veröffentlichungs- und Wirksamkeitszeit sind nicht dasselbe.","reset.details":"Zeitpunkt und Nachweis","reset.timeUnknown":"Genaue Uhrzeit nicht angegeben","reset.banked":"Gespeicherter Reset-Gutschein","reset.usage":"Nutzung zurückgesetzt","reset.source":"Quelle ansehen","reset.effectiveLabel":"Wirksames Datum / Uhrzeit","reset.localLabel":"Deine Ortszeit","reset.publishedLabel":"Veröffentlicht","reset.scopeLabel":"Berechtigte Nutzer","reset.kindLabel":"Art der Zurücksetzung","reset.endLabel":"Ende der Feier","reset.approvedLabel":"Geprüft","reset.checkedLabel":"Quelle zuletzt geprüft"},"ar":{"brand":"ساحة أمنيات إعادة الضبط لمجتمع Codex","language":"اللغة","auto":"تلقائي","about":"حول الساحة","newsTool":"أجواء X","motionOff":"إيقاف الحركة","motionOn":"استئناف الحركة","heart":"أرسل قلبًا","heartHint":"قليل من المحبة","bow":"انحنِ تقديرًا","bowHint":"بكل إخلاص","hearts":"القلوب المرسلة","bows":"مرات الانحناء","characters":"شخصيات الأمنيات","hero":"يا تيبو القديس، مرة أخرى.","lead":"نفدت الرموز، وبقي الأمل.","plaque":"حارس إعادة الضبط · رسم معجبين غير رسمي","note":"مرة أخرى، من فضلك… ♡","chat":"غرفة الانتظار","sampleChat":"دردشة تجريبية","newsTitle":"𝕏 أخبار إعادة الضبط","changeMood":"تغيير الأجواء ↗","fiction":"ليست توقعات · عبارات خيالية","buildPrompt":"بعد إعادة الضبط سأقوم بـ…","ship":"نشر تطبيقي الأول 🚀","bug":"إصلاح ذلك الخطأ 🐛","shipText":"بعد إعادة الضبط سأنشر تطبيقي الأول!","bugText":"بعد إعادة الضبط سأصلح ذلك الخطأ!","placeholder":"اكتب رسالة…","chatLabel":"رسالة تجريبية محلية","send":"إرسال الرسالة","close":"إغلاق","back":"العودة إلى الساحة","demo":"عرض محلي","noServer":"لا توجد دردشة مشتركة","demoNotice":"النقرات والشخصيات والدردشة عروض محلية. تحقق من تقويم إعادة الضبط لمعرفة حالة اتصال أخبار X.","externalNotice":"معاينة عدادات خارجية. تمثل الشخصيات النقرات، لا المستخدمين المتصلين.","disclaimer":"مشروع معجبين غير رسمي ولا يرتبط بـOpenAI. القلوب والانحناءات لا تعيد ضبط حدود الاستخدام.","fictionFooter":"الفقاعات أفكار خيالية للمستخدمين، وليست اقتباسات حقيقية.","aboutTitle":"أمنية صغيرة، لا زر حقيقي لإعادة الضبط.","aboutBody":"تبدأ الساحة بخمس شخصيات. ينضم رفيق عند 1 ثم 3 ثم 6 ثم 10 نقرات وهكذا. إعادة تحميل الصفحة تمسح العدادات المحلية. تبقى الدردشة على هذه الشاشة. الشخصية المركزية رسم مولّد للمعجبين، ولا تعني تأييدًا شخصيًا أو ادعاءً دينيًا.","aboutSafety":"حالات X معاينات، وليست أخبارًا مباشرة أو احتمالات لإعادة الضبط. يجب أن يراجع شخص المصدر والكاتب والتاريخ والفئة المعنية قبل النشر. لا تُترجم الدردشة الحقيقية ونصوص الأخبار المعتمدة تلقائيًا.","aboutPrivacy":"يُحفظ اختيار اللغة على هذا الجهاز فقط عندما يُسمح بذلك. لا نطلب GPS. بعد النشر يمكن أن يقدّم الموقع نفسه رمز البلد دون عنوان أو عنوان IP خام. العدادات المشتركة والإشراف والأخبار المباشرة تحتاج إلى خادم.","signalTitle":"أخبار جديدة، وأمنيات جديدة.","signalIntro":"معاينة مرئية محلية فقط. لا تقرأ منشورات X ولا تحسب احتمال إعادة الضبط.","signalState":"حالة العرض","example":"عبارة خيالية · ليست اقتباسًا","signalSafety":"تتطلب الأخبار المباشرة موافقة بشرية بعد مراجعة المصدر والكاتب والوقت والفئة المعنية. لا تغيّر النقرات حالة الأخبار.","applyMood":"استخدام هذه الأجواء","readWish":"اقرأ أمنية","wishLabel":"أمنية يمكن قراءتها دون حركة","bubbleLabel":"فكرة خيالية","me":"أنا","meLocal":"أنا · محلي","skip":"الانتقال إلى زري القلب والانحناء","canvasLabel":"ساحة أمنيات بشخصيات بكسلية. تضيف النقرات شخصيات تنحني. هذه رسومات وليست عدد المستخدمين المتصلين. تتوفر المعلومات والأزرار نفسها نصيًا.","portraitAlt":"شخصية بكسلية جالسة أمام هالة وبجانبها قط صغير. رسم مولّد غير رسمي للمعجبين.","pageTitle":"TIBO, PLS. — أمنية صغيرة لإعادة الضبط","toolsLabel":"أدوات الساحة","statsLabel":"النقرات المحلية وعدد الشخصيات المرسومة","countTitle":"{count} شخصية أمنيات؛ الظاهر منها {visible}. ليس عدد المستخدمين المتصلين.","growth":"{total} أمنية · بقي {remaining} لرفيق جديد","growthOverflow":"{total} أمنية · {count} رفيق خارج الشاشة","meterLabel":"بقي {remaining} من الأمنيات حتى الرفيق التالي","rateAction":"النقر سريع جدًا. انتظر قليلًا ثم حاول مجددًا.","actionStatus":"{hearts} قلب · {bows} انحناء · {count} رفيق جديد. على هذه الشاشة فقط.","actionExternal":"أُرسلت العملية المحلية. لا تتغير العدادات المشتركة إلا ببيانات مؤكدة.","chatIdle":"محلي فقط · لا تُحفظ الرسالة على خادم.","chatEmpty":"اكتب رسالة أولًا.","chatRate":"انتظر ثلاث ثوانٍ بين الرسائل.","chatSent":"أُضيفت محليًا. يمكنك الإرسال مجددًا بعد ثلاث ثوانٍ.","chatTooLong":"الحد الأقصى 160 حرفًا. لم تُرسل الرسالة.","loadError":"تعذّر تحميل الرسم. أعد فتح ملف HTML الكامل.","badgeDemo":"عرض تجريبي · X غير متصل","badgeStale":"انتهت صلاحية المراجعة","badgeApproved":"معاينة بيانات معتمدة","badgeReview":"إعادة المراجعة","badgeData":"بيانات معتمدة","sourceLink":"الأصل من @{account} ↗","sourceTime":"نُشر {posted} · روجع {reviewed}","audience":"الفئة المعنية: {audience}","sourceOriginal":"النص الأصلي · دون ترجمة","newsTitleDemo":"جرّب أجواء X. هذه ليست إعلانات حقيقية.","newsTitleApproved":"معاينة بيانات معتمدة؛ لم يتحقق هذا المتصفح من المصدر.","localeBrowser":"تلقائي · لغة المتصفح","localeCountry":"تلقائي · استرشاد بالبلد","localeFallback":"تلقائي · الإنجليزية الافتراضية","localeManual":"لغة مختارة يدويًا","localeUnsaved":"طُبقت اللغة، لكن هذا المتصفح لا يستطيع حفظها.","state.unknown.label":"الأخبار غير مؤكدة","state.unknown.caption":"لا نعرف الاحتمال، لكن الانحناء صادق.","state.unknown.description":"لم تُربط أخبار حديثة معتمدة عن إعادة الضبط بعد.","state.unknown.short":"الأخبار غير مؤكدة","speech.unknown":["لا نعرف الاحتمال، لكن الانحناء صادق.","صفر من الرموز، والأمل ما زال يُبنى."],"short.unknown":["الأخبار غير مؤكدة","♡ الأخبار غير مؤكدة"],"state.buzz.label":"المجتمع متفائل","state.buzz.caption":"الخط الزمني صاخب، ولا إعلان بعد.","state.buzz.description":"توقعات المجتمع وليست إعلانًا رسميًا.","state.buzz.short":"المجتمع متفائل","speech.buzz":["الخط الزمني صاخب، ولا إعلان بعد.","الشائعات تحتاج مصادر، والأمنيات تحتاج قلوبًا."],"short.buzz":["المجتمع متفائل","♡ المجتمع متفائل"],"state.hint.label":"تمهيد رسمي","state.hint.caption":"التلميح ليس إعادة ضبط. تحقّق أولًا.","state.hint.description":"التمهيد لا يضمن التنفيذ أو شمول حسابك.","state.hint.short":"تمهيد رسمي","speech.hint":["التلميح ليس إعادة ضبط. تحقّق أولًا.","هذا الانحناء حجز مسبق."],"short.hint":["تمهيد رسمي","♡ تمهيد رسمي"],"state.confirmed.label":"إعلان إعادة الضبط","state.confirmed.caption":"انحناء امتنان! تحقّق من حسابك أولًا.","state.confirmed.description":"تحقّق من الفئة المعنية والتوقيت واستخدام حسابك.","state.confirmed.short":"إعلان إعادة الضبط","speech.confirmed":["انحناء امتنان! تحقّق من حسابك أولًا.","من انحناء الأمل إلى انحناء الامتنان."],"short.confirmed":["إعلان إعادة الضبط","♡ إعلان إعادة الضبط"],"state.delayed.label":"تأجيل أو إيقاف","state.delayed.caption":"وقت إضافي للأمنيات. أرح ركبتيك!","state.delayed.description":"صدر تنبيه بتأجيل أو إيقاف. انتظر تحديثًا جديدًا.","state.delayed.short":"تأجيل أو إيقاف","speech.delayed":["وقت إضافي للأمنيات. أرح ركبتيك!","حتى الانحناء يحتاج إلى استراحة."],"short.delayed":["تأجيل أو إيقاف","♡ تأجيل أو إيقاف"],"state.stale.label":"إعادة التحقق مطلوبة","state.stale.caption":"تحقّق من التاريخ قبل الاحتفال.","state.stale.description":"انتهت صلاحية المراجعة. الخبر القديم ليس إعلانًا حاليًا.","state.stale.short":"إعادة التحقق مطلوبة","speech.stale":["تحقّق من التاريخ قبل الاحتفال.","منشور الأمس ليس وعدًا لليوم."],"short.stale":["إعادة التحقق مطلوبة","♡ إعادة التحقق مطلوبة"],"samples":["بعد إعادة الضبط سأنشر تطبيقي الأول!","صفر من الرموز، والأمل ما زال يُبنى.","الشائعات تحتاج مصادر، والأمنيات تحتاج قلوبًا.","قليل من المحبة ❤️","بعد إعادة الضبط سأصلح ذلك الخطأ!","حتى الانحناء يحتاج إلى استراحة."],"speech.ambient":["قليل من المحبة ♡","بكل إخلاص 🙇","صفر من الرموز، والأمل ما زال يُبنى."],"speech.heart":["قليل من المحبة ♡","بكل إخلاص 🙇","صفر من الرموز، والأمل ما زال يُبنى."],"speech.bow":["قليل من المحبة ♡","بكل إخلاص 🙇","صفر من الرموز، والأمل ما زال يُبنى."],"speech.join":["قليل من المحبة ♡","بكل إخلاص 🙇","صفر من الرموز، والأمل ما زال يُبنى."],"loading":"جارٍ تحميل الساحة…","retryLoad":"إعادة التحميل","clearDraft":"مسح المسودة","draftRestored":"تمت استعادة مسودة هذا التبويب. تنتهي صلاحيتها بعد 30 دقيقة.","draftCleared":"تم مسح المسودة.","draftHint":"تُحفظ المسودة غير المرسلة في هذا التبويب لمدة 30 دقيقة كحد أقصى. لا يتم إرسال أي شيء.","connectionUnavailable":"الاتصال المشترك غير متاح. لم تتم إضافة شيء إلى العداد المشترك.","queueFull":"هناك أمنيات كثيرة بانتظار الإرسال. انتظر عودة الاتصال.","readOnlyConnection":"اختبار اتصال للقراءة فقط · تبقى الرسائل محلية.","resumeMotion":"استئناف الحركة","fxLabel":"تأثيرات الضوء","fxAuto":"تلقائي","fxRich":"غني","fxSoft":"هادئ","fxOff":"إضاءة ثابتة","fxReduced":"إعداد تقليل الحركة له الأولوية.","fxStopped":"الإضاءة ثابتة وتبقى حركات الشخصيات مفعّلة.","fxSoftActive":"ضوء هادئ · جزيئات أقل.","fxRichActive":"هالة · نجوم · بتلات · تفاعل مع النقر","reset.waiting":"بانتظار إعادة ضبط تمت مراجعتها","reset.disconnected":"جمع منشورات X غير متصل","reset.paused":"أوقف المشرف الاحتفال مؤقتًا","reset.demo":"معاينة يوم البركات","reset.celebrating":"يوم البركات · شكرًا!","reset.announced":"إعلان فقط · التطبيق غير مؤكد","reset.history":"إعادة ضبط سابقة · انتهى الاحتفال","reset.stale":"يجب إعادة التحقق من المصدر","reset.revoked":"سُحب تأكيد إعادة الضبط · تلزم المراجعة","reset.demoRibbon":"تجربة · أمطار البركات","reset.ribbon":"شكرًا · يوم البركات","reset.demoBadge":"تجربة · لم يتم تأكيد إعادة ضبط حقيقية","reset.feed":"تقويم إعادة الضبط","reset.connected":"متصل","reset.notConnected":"غير متصل","reset.stopPreview":"إنهاء المعاينة","reset.preview":"معاينة يوم البركات","reset.demoNote":"عرض محلي لمدة دقيقتين. لم يتم تأكيد إعادة ضبط حقيقية.","reset.noteActive":"تستمر الأمطار الذهبية حتى نهاية يوم الحدث. تحقق من خطتك وحسابك بشكل منفصل.","reset.noteWaiting":"يبدأ الاحتفال فقط بعد مراجعة وتأكيد التطبيق. وقت المنشور ليس وقت تطبيق إعادة الضبط.","reset.details":"التوقيت والأدلة","reset.timeUnknown":"لم يُذكر الوقت الدقيق","reset.banked":"رصيد إعادة ضبط محفوظ","reset.usage":"إعادة ضبط الاستخدام","reset.source":"عرض المصدر","reset.effectiveLabel":"تاريخ / وقت التطبيق","reset.localLabel":"توقيتك المحلي","reset.publishedLabel":"وقت النشر","reset.scopeLabel":"المستخدمون المؤهلون","reset.kindLabel":"نوع إعادة الضبط","reset.endLabel":"نهاية الاحتفال","reset.approvedLabel":"وقت المراجعة","reset.checkedLabel":"آخر تحقق من المصدر"}};
;
/* Bundled translations: no runtime AI/translation API, no GPS, no IP lookup vendor.
 * Optional same-origin country hint is fetched once, without cookies, with a timeout.
 */
'use strict';
(()=>{
  const Core=window.TiboLocale, dict=window.TiboTranslations;
  const config={policy:'language-first',geoEndpoint:'/api/locale',geoTimeoutMs:1500,...window.TIBO_LOCALE_CONFIG};
  const KEY='tibo-language-v1';let manual=null,saveFailed=false,hint=null,attempted=false,geoState='not-requested',selectRevision=0;
  try{manual=Core.normalize(localStorage.getItem(KEY));}catch(_){/* privacy mode/file URL */}
  const browserLanguages=()=>{try{return navigator.languages?.length?[...navigator.languages]:[navigator.language];}catch(_){return [];}};
  let selected=Core.resolve({manual,languages:browserLanguages(),policy:config.policy});
  const subscribers=new Set();const numberCache=new Map(),dateCache=new Map();
  const t=(key,values={})=>{
    let value=dict[selected.locale]?.[key]??dict.en[key]??key;
    if(typeof value!=='string')return value;
    return value.replace(/\{([a-zA-Z]+)\}/g,(_,k)=>String(values[k]??`{${k}}`));
  };
  const number=(n,compact=true)=>{
    const key=selected.locale+':'+(compact&&n>99999);
    try{if(!numberCache.has(key))numberCache.set(key,new Intl.NumberFormat(selected.locale,{notation:compact&&n>99999?'compact':'standard',maximumFractionDigits:1}));return numberCache.get(key).format(n);}catch(_){return String(n);}
  };
  const date=(value,withDate=false)=>{
    const at=new Date(value);if(!Number.isFinite(at.getTime()))return '';
    const key=selected.locale+':'+withDate;
    try{if(!dateCache.has(key))dateCache.set(key,new Intl.DateTimeFormat(selected.locale,withDate?{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}:{hour:'2-digit',minute:'2-digit'}));return dateCache.get(key).format(at);}catch(_){return at.toISOString();}
  };
  function translateDOM(){
    document.documentElement.lang=selected.locale;
    document.documentElement.dir=selected.locale==='ar'?'rtl':'ltr';
    document.title=t('pageTitle');
    document.querySelectorAll('[data-i18n]').forEach(el=>{el.textContent=t(el.dataset.i18n);});
    for(const [attr,data] of [['aria-label','i18nAria'],['title','i18nTitle'],['placeholder','i18nPlaceholder'],['alt','i18nAlt']]){
      document.querySelectorAll(`[data-${data.replace(/[A-Z]/g,c=>'-'+c.toLowerCase())}]`).forEach(el=>el.setAttribute(attr,t(el.dataset[data])));
    }
    const label=document.getElementById('localeStatus');
    if(label)label.textContent=saveFailed?t('localeUnsaved'):t({browser:'localeBrowser',country:'localeCountry',fallback:'localeFallback',manual:'localeManual'}[selected.source]);
    const control=document.getElementById('languageSelect');if(control)control.value=manual||'auto';
    document.querySelectorAll('.wish-chip').forEach((el,i)=>{el.dataset.wish=t(i?'bugText':'shipText');});
    for(const fn of subscribers)fn(selected);
    window.dispatchEvent(new CustomEvent('tibo:languagechange',{detail:{...selected}}));
  }
  function reselect(){selected=Core.resolve({manual,languages:browserLanguages(),country:hint,policy:config.policy});translateDOM();}
  function select(value){
    if(value!=='auto'&&!Core.normalize(value))return false;
    manual=value==='auto'?null:Core.normalize(value);selectRevision++;saveFailed=false;
    try{if(manual)localStorage.setItem(KEY,manual);else localStorage.removeItem(KEY);}catch(_){saveFailed=true;}
    reselect();if(!manual)requestCountry();return true;
  }
  // Endpoint is constrained to this origin, no credentials, no followable redirect.
  async function requestCountry(){
    if(attempted)return;
    if(!/^https?:$/.test(location.protocol)||config.geoEndpoint===false){geoState='skipped';return;}
    // Manual language or a supported browser preference needs no country lookup.
    if(manual||(config.policy!=='country-first'&&Core.preferred(browserLanguages()).length)){geoState='not-needed';return;}
    attempted=true;
    let url;try{url=new URL(config.geoEndpoint,location.href);if(url.origin!==location.origin)throw Error('origin');}catch(_){geoState='rejected';return;}
    const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),Math.min(3000,Math.max(250,Number(config.geoTimeoutMs)||1500)));
    geoState='pending';
    try{
      const r=await fetch(url,{credentials:'omit',cache:'no-store',redirect:'error',signal:controller.signal,headers:{Accept:'application/json'}});
      if(!r.ok||!r.headers.get('content-type')?.includes('application/json'))throw Error('response');
      // Bound the body as well as timeout, including streamed/chunked responses.
      let text='';const reader=r.body?.getReader();
      if(reader){const decoder=new TextDecoder();let bytes=0;while(true){const {value,done}=await reader.read();if(done)break;bytes+=value.byteLength;if(bytes>2048){await reader.cancel();throw Error('oversize');}text+=decoder.decode(value,{stream:true});}text+=decoder.decode();}
      else {text=await r.text();if(text.length>2048)throw Error('oversize');}
      const data=JSON.parse(text);if(!data||data.version!==1)throw Error('version');
      hint=Core.country(data.country);geoState=hint?'received':'unknown';
      // Manual choice always wins, including one made while a request was in flight.
      if(!manual)reselect();
    }catch(_){geoState=controller.signal.aborted?'timeout':'unavailable';}
    finally{clearTimeout(timer);}
  }
  const control=document.getElementById('languageSelect');
  const auto=document.createElement('option');auto.value='auto';auto.dataset.i18n='auto';control.append(auto);
  for(const [tag,name] of Object.entries(Core.NAMES)){const option=document.createElement('option');option.value=tag;option.textContent=name;option.lang=tag;option.dir=tag==='ar'?'rtl':'ltr';control.append(option);}
  control.addEventListener('change',()=>select(control.value));
  window.addEventListener('languagechange',()=>{if(!manual){reselect();requestCountry();}});
  window.TiboI18n=Object.freeze({t,number,date,select,requestCountry,
    get locale(){return selected.locale;},get dir(){return selected.locale==='ar'?'rtl':'ltr';},
    subscribe(fn){subscribers.add(fn);return ()=>subscribers.delete(fn);},
    diagnostics(){return {...selected,manual,geoState,country:hint,saveFailed,policy:config.policy,selectRevision};}});
  translateDOM();
  const injected=window.TIBO_LOCALE_HINT;
  if(injected?.version===1){hint=Core.country(injected.country);geoState=hint?'injected':'unknown';reselect();}
  else requestCountry();
})();

;
/* Pixel sprites are extracted from the approved reference composition.
 * There is deliberately NO geometric/rectangle avatar fallback.
 * A single transparent PNG atlas supplies all bodies and poses.
 */
'use strict';
(() => {
  const LIMITS = Object.freeze({ rosterMax: 29, visibleMobile: 11, particlesMax: 32, fps: 30, dprMax: 1.5, spriteCacheMax: 32 });
  const POSES = Object.freeze(['idle', 'heart', 'kneel', 'bow']);
  const CELL = 128, FOOT_Y = 119, VARIANTS = 8;
  // Exact transparent PNG silhouette tops, in atlas pixels, for balloon anchors.
  const ART_TOPS = [[23,23,23,65],[51,37,65,62],[33,33,23,75],[11,11,65,62],
    [37,37,65,65],[9,9,23,75],[32,32,65,62],[51,37,65,65]];
  // Four familiar supporters remain. Recruited bowing sprites fill the inner
  // arc first, then the outer seats. Seats never reshuffle existing characters.
  const SEATS = [
    [.08,.60],[.92,.60],[.10,.815],[.90,.815],
    [.43,.79],[.57,.79],[.38,.745],[.62,.745],[.34,.817],[.66,.817],
    [.28,.82],[.72,.82],[.22,.80],[.78,.80],[.345,.725],[.655,.725],
    [.255,.715],[.745,.715],[.15,.73],[.855,.73],[.095,.665],[.90,.665],
    [.055,.705],[.945,.705],[.29,.60],[.71,.60],[.18,.62],[.82,.62]
  ];
  const MOBILE_SEATS = [
    [.10,.687],[.90,.687],[.095,.794],[.90,.794],
    [.365,.76],[.635,.76],[.25,.735],[.75,.735],[.25,.816],[.75,.816]
  ];
  const clamp = (n,a,b) => Math.max(a,Math.min(b,n));
  const variant = member => Math.abs(Math.trunc(Number(member.color)||0)) % VARIANTS;
  function hash(s) { let h=0;for(const c of String(s))h=(Math.imul(h,31)+c.charCodeAt(0))|0;return h>>>0; }
  let atlas = null, avatars = null, loadPromise = null;

  class PlazaScene {
    static loadAssets() {
      if (loadPromise) return loadPromise;
      const decode = async id => {
        const image = document.getElementById(id);
        if (!image) throw new Error(`Missing embedded pixel artwork: ${id}`);
        await image.decode();
        if (!image.naturalWidth) throw new Error(`Pixel artwork could not be decoded: ${id}`);
        return image;
      };
      loadPromise = Promise.all([decode('pixelAtlas'),decode('pixelAvatars')]).then(([a,b])=>{
        if(a.naturalWidth!==512 || a.naturalHeight!==1024 || b.naturalWidth!==512 || b.naturalHeight!==64)throw new Error('Unexpected sprite atlas dimensions');
        atlas=a;avatars=b;
        return { variants:VARIANTS,poses:POSES.length };
      });
      return loadPromise;
    }
    static avatarSource(index) {
      if(!avatars)throw new Error('Call loadAssets before drawing avatars');
      const c=document.createElement('canvas');c.width=64;c.height=64;
      const g=c.getContext('2d');g.imageSmoothingEnabled=false;
      g.drawImage(avatars,variant({color:index})*64,0,64,64,0,0,64,64);
      return c.toDataURL('image/png');
    }
    constructor(canvas,{reduced=false,ownLabel='나'}={}) {
      if(!atlas)throw new Error('Call loadAssets before constructing the scene');
      this.canvas=canvas;this.ctx=canvas.getContext('2d',{alpha:true});
      if(!this.ctx)throw new Error('This browser does not support the required 2D canvas');
      this.members=[];this.self=null;this.reduced=reduced;this.ownLabel=ownLabel;
      this.particles=[];this.actions=new Map();this.cache=new Map();this.displayed=[];
      this.paintFrames=0;this.lastRender=0;this.raf=0;this.width=1;this.height=1;this.destroyed=false;this.suspended=false;
      this.resizeObserver=new ResizeObserver(()=>this.resize());this.resizeObserver.observe(canvas);
      this.visibility=()=>{
        if(document.hidden){cancelAnimationFrame(this.raf);this.raf=0;this.particles=[];}
        else{this.render(performance.now());this.start();}
      };
      document.addEventListener('visibilitychange',this.visibility);this.resize();this.start();
    }
    resize() {
      if(this.destroyed)return;
      const rect=this.canvas.getBoundingClientRect();this.width=rect.width;this.height=rect.height;
      const dpr=Math.min(window.devicePixelRatio||1,LIMITS.dprMax);
      this.canvas.width=Math.round(rect.width*dpr);this.canvas.height=Math.round(rect.height*dpr);
      this.ctx.setTransform(dpr,0,0,dpr,0,0);this.ctx.imageSmoothingEnabled=false;
      this.render(performance.now());
    }
    setMembers(members,self) {
      this.self=self||null;
      const seen=new Set();this.members=[];
      for(const member of Array.isArray(members)?members:[]) {
        if(!member || typeof member.id!=='string' || seen.has(member.id))continue;
        seen.add(member.id);this.members.push(member);
        if(this.members.length>=LIMITS.rosterMax)break;
      }
      this.render(performance.now());this.start();
    }
    setSuspended(value) {
      const changed=this.suspended!==Boolean(value);this.suspended=Boolean(value);
      if(this.suspended){cancelAnimationFrame(this.raf);this.raf=0;this.particles=[];}
      else if(changed){this.render(performance.now());this.start();}
    }
    setReduced(value) {
      this.reduced=Boolean(value);
      if(this.reduced){cancelAnimationFrame(this.raf);this.raf=0;this.particles=[];this.actions.clear();}
      this.render(performance.now());if(!this.reduced)this.start();
    }
    point(id) {
      if(id===this.self?.id)return{x:this.width*.5,y:this.height*(this.width<520?.819:.815)};
      const i=this.members.filter(m=>m.id!==this.self?.id).findIndex(m=>m.id===id);
      const seats=this.width<520?MOBILE_SEATS:SEATS;
      const p=seats[Math.max(0,i)%seats.length];return{x:p[0]*this.width,y:p[1]*this.height};
    }
    action(id,type,count=1) {
      if(!['heart','bow'].includes(type) || !this.members.some(m=>m.id===id))return false;
      const now=performance.now();this.actions.set(id,{type,at:now});
      if(!this.reduced && type==='heart' && this.displayed.some(m=>m.id===id)) {
        const p=this.point(id);
        for(let i=0;i<clamp(Math.trunc(Number(count)||1),1,3);i++) {
          if(this.particles.length>=LIMITS.particlesMax)this.particles.shift();
          this.particles.push({sx:p.x+18,sy:p.y-50,tx:this.width*.5+(Math.random()-.5)*30,ty:this.height*.43,
            at:now+i*95,duration:1150+Math.random()*200,curve:(Math.random()-.5)*110,size:5+Math.random()*3});
        }
      }
      this.render(now);this.start();return true;
    }
    // Adapter surface for Codex. Server-side validation/rate limiting is still required.
    effects(effects) {
      for(const e of (Array.isArray(effects)?effects:[]).slice(0,64)) {
        if(!e || typeof e.id!=='string' || e.id===this.self?.id)continue;
        if(e.bows)this.action(e.id,'bow');if(e.hearts)this.action(e.id,'heart',2);
      }
    }
    sprite(member,pose) {
      const column=Math.max(0,POSES.indexOf(pose)),row=variant(member),key=`${row}-${column}`;
      if(this.cache.has(key))return this.cache.get(key);
      const canvas=document.createElement('canvas');canvas.width=CELL;canvas.height=CELL;
      const g=canvas.getContext('2d');g.imageSmoothingEnabled=false;
      g.drawImage(atlas,column*CELL,row*CELL,CELL,CELL,0,0,CELL,CELL);
      if(this.cache.size<LIMITS.spriteCacheMax)this.cache.set(key,canvas);
      return canvas;
    }
    poseAt(member,now) {
      const a=this.actions.get(member.id);
      if(!a || this.reduced)return {pose:POSES.includes(member.pose)?member.pose:'idle',dy:0};
      const t=now-a.at;
      if(t>=1900){this.actions.delete(member.id);return {pose:POSES.includes(member.pose)?member.pose:'idle',dy:0};}
      if(a.type==='heart')return {pose:t<950?'heart':'idle',dy:t<750?-Math.sin(t/750*Math.PI)*4:0};
      // Distinct rear-kneel and fully prostrate illustrations. Never flatten an upright body.
      if(t<150)return{pose:'idle',dy:0};
      if(t<360)return{pose:'kneel',dy:2};
      if(t<1390 || member.ritual)return{pose:'bow',dy:0};
      if(t<1690)return{pose:'kneel',dy:2};
      return{pose:'idle',dy:0};
    }
    render(now) {
      if(this.destroyed || this.width<2)return;
      this.paintFrames++;const g=this.ctx,w=this.width,h=this.height;g.clearRect(0,0,w,h);
      const mobile=w<520;
      let people=this.members.filter(m=>m.id!==this.self?.id).slice(0,mobile?LIMITS.visibleMobile-1:LIMITS.rosterMax-1);
      if(this.self)people.push(this.self);
      people.sort((a,b)=>this.point(a.id).y-this.point(b.id).y);
      this.displayed=[];
      // Artwork keeps the same 128 px cell with a common foot anchor at every pose.
      const base=mobile?clamp(w*.19,58,79):clamp(w*.107,73,114);
      for(const member of people) {
        const p=this.point(member.id),self=member.id===this.self?.id;
        const state=this.poseAt(member,now);
        const distance=.89+(p.y/h-.60)*.42;
        const size=Math.round(base*distance*(self?1.07:1));
        const bounce=0; // Idle pixels do not need perpetual canvas repainting.
        const foot=Math.round(p.y+state.dy+bounce),left=Math.round(p.x-size/2),top=Math.round(foot-size*FOOT_Y/CELL);
        g.fillStyle=self?'#ffc4e72f':'#090e2661';g.beginPath();g.ellipse(p.x,p.y+1,size*.26,size*.06,0,0,Math.PI*2);g.fill();
        g.save();
        // Only a new recruit fades in; the PNG art and its foot anchor are unchanged.
        if(!this.reduced && member.joinedAt!=null) {
          const entry=clamp((now-member.joinedAt)/420,0,1);
          g.globalAlpha=.15+.85*entry;
          g.translate(0,(1-entry)*6);
        }
        // Profile characters on the left look toward the centre, not off the page.
        if([2,3,5,6].includes(variant(member)) && p.x<w*.5 && ['idle','heart'].includes(state.pose)){
          g.translate(left+size,top);g.scale(-1,1);g.drawImage(this.sprite(member,state.pose),0,0,size,size);
        }else g.drawImage(this.sprite(member,state.pose),left,top,size,size);
        g.restore();
        this.displayed.push({id:member.id,pose:state.pose,x:left,y:top,size,variant:variant(member),headY:top+size*ART_TOPS[variant(member)][POSES.indexOf(state.pose)]/CELL});
        if(self) {
          const lx=p.x+size*.34,ly=p.y-14;
          g.font='600 10px system-ui';g.textAlign='center';
          const tw=g.measureText(this.ownLabel).width;
          g.fillStyle='#fff0f7';g.beginPath();g.roundRect(lx-tw/2-8,ly-12,tw+16,21,6);g.fill();
          g.fillStyle='#302c43';g.fillText(this.ownLabel,lx,ly+2);
        }
      }
      // Drop stale/unknown actions even for members omitted from the mobile viewport.
      for(const [id,a] of this.actions)if(now-a.at>1900 || !this.members.some(m=>m.id===id))this.actions.delete(id);
      if(!this.reduced) {
        this.particles=this.particles.filter(p=>now-p.at<p.duration);
        for(const p of this.particles) {
          if(now<p.at)continue;
          const t=clamp((now-p.at)/p.duration,0,1),m=1-t;
          const x=m*m*p.sx+2*m*t*(p.sx+p.curve)+t*t*p.tx;
          const y=m*m*p.sy+2*m*t*(p.sy-125)+t*t*p.ty;
          g.save();g.translate(Math.round(x),Math.round(y));g.globalAlpha=Math.min(1,t*8)*(1-Math.max(0,t-.82)/.18);
          g.shadowColor='#ff7cb3';g.shadowBlur=8;this.heart(g,p.size,'#ff90c4');g.restore();
        }
      }
    }
    heart(g,size,color) {
      const u=Math.max(1,Math.round(size/4));g.fillStyle=color;
      const rows=['01100110','11111111','11111111','01111110','00111100','00011000'];
      rows.forEach((row,y)=>{for(let x=0;x<row.length;x++)if(row[x]==='1')g.fillRect((x-4)*u,(y-3)*u,u,u);});
      g.fillStyle='#ffdbef';g.fillRect(-2*u,-2*u,u,u);
    }
    start() {
      if(this.raf || this.reduced || this.suspended || document.hidden || this.destroyed)return;
      const needsPaint=now=>this.particles.length>0||[...this.actions.values()].some(a=>now-a.at<1900)||this.members.some(m=>m.joinedAt!=null&&now-m.joinedAt<450);
      if(!needsPaint(performance.now()))return;
      const tick=now=>{
        this.raf=0;if(document.hidden||this.reduced||this.suspended||this.destroyed)return;
        if(now-this.lastRender>=1000/LIMITS.fps){this.render(now);this.lastRender=now;}
        if(needsPaint(now))this.raf=requestAnimationFrame(tick);
      };this.raf=requestAnimationFrame(tick);
    }
    diagnostics() {
      return {renderer:'concept-png-atlas',atlasLoaded:Boolean(atlas?.complete),atlasSize:[atlas?.naturalWidth,atlas?.naturalHeight],
        spriteCacheSize:this.cache.size,visiblePeople:this.displayed.length,displayed:this.displayed.map(x=>({...x})),limits:LIMITS};
    }
    destroy() {
      this.destroyed=true;cancelAnimationFrame(this.raf);this.raf=0;this.resizeObserver.disconnect();
      document.removeEventListener('visibilitychange',this.visibility);this.cache.clear();this.actions.clear();
    }
  }
  window.TiboScene=PlazaScene;
})();

;
/* Clicks are a visual wish score, NEVER a headcount of real connected users.
 * This module owns a bounded render roster, not server accounting.
 */
'use strict';
(() => {
  const SETTINGS = Object.freeze({ baseSupporters: 4, maxRecruitsRendered: 24, joinGapMs: 180 });
  const triangle = n => n * (n + 1) / 2;
  function validTotal(value) {
    return Number.isSafeInteger(value) && value >= 0;
  }
  function progressFor(total) {
    if (!validTotal(total)) throw new TypeError('The click total must be a non-negative safe integer.');
    // 1, 3, 6, 10, 15… clicks. Constant-space even for millions of wishes.
    let earned = Math.floor((Math.sqrt(8 * total + 1) - 1) / 2);
    if (triangle(earned) > total) earned--;
    if (triangle(earned + 1) <= total) earned++;
    const previous = triangle(earned), next = triangle(earned + 1);
    return Object.freeze({ total, earned, characters: 5 + earned,
      previous, next, remaining: next - total, fraction: (total - previous) / (next - previous) });
  }

  class CrowdGrowth {
    constructor(scene, self, { onChange = () => {}, onJoin = () => {} } = {}) {
      this.scene = scene; this.self = self; this.onChange = onChange; this.onJoin = onJoin;
      this.lastJoinAt = -Infinity;
      this.total = 0; this.target = 0; this.recruits = []; this.timer = 0; this.destroyed = false;
      this.base = Array.from({ length: SETTINGS.baseSupporters }, (_, i) => ({
        id: `sample-supporter-${i}`, name: '샘플 동료', color: [2, 4, 1, 3][i], pose: 'idle'
      }));
      this.onVisibility = () => {
        if (document.hidden) this.stop();
        else this.drain();
      };
      document.addEventListener('visibilitychange', this.onVisibility);
      this.commit();
    }
    setTotal(total) {
      const p = progressFor(total);
      this.total = total;
      this.target = Math.min(p.earned, SETTINGS.maxRecruitsRendered);
      if (this.recruits.length > this.target) {
        this.stop(); this.recruits.length = this.target; this.commit();
      }
      this.onChange(this.snapshot());
      this.drain();
      return p;
    }
    commit(newMember = null) {
      this.scene.setMembers([...this.base, ...this.recruits, this.self], this.self);
      if (newMember && !this.scene.reduced) this.scene.action(newMember.id, 'bow');
      this.onChange(this.snapshot());
      if (newMember) this.onJoin(newMember);
    }
    drain() {
      if (this.destroyed || this.timer || document.hidden) return;
      if (this.scene.reduced) {
        // No entry animation when motion is disabled. Still show the new PNG poses.
        while (this.recruits.length < this.target) this.recruits.push(this.makeMember());
        this.commit(); return;
      }
      if (this.recruits.length >= this.target) return;
      const now = performance.now(), wait = SETTINGS.joinGapMs - (now - this.lastJoinAt);
      if (wait > 0) {
        this.timer = setTimeout(() => { this.timer = 0; this.drain(); }, wait); return;
      }
      this.lastJoinAt = now;
      const next = this.makeMember(); this.recruits.push(next); this.commit(next);
      if (this.recruits.length < this.target) {
        this.timer = setTimeout(() => { this.timer = 0; this.drain(); }, SETTINGS.joinGapMs);
      }
    }
    makeMember() {
      const index = this.recruits.length;
      return { id: `wish-recruit-${index + 1}`, name: '함께 큰절', color: (index + 1) % 8,
        pose: 'bow', ritual: true, joinedAt: this.scene.reduced ? null : performance.now() };
    }
    motionChanged() {
      this.stop(); this.drain();
    }
    stop() { clearTimeout(this.timer); this.timer = 0; }
    snapshot() {
      const progress = progressFor(this.total);
      const visible = this.scene.displayed.length;
      return { ...progress, renderedRecruits: this.recruits.length, pendingRecruits: this.target - this.recruits.length,
        visibleCharacters: visible, offscreenCharacters: Math.max(0, progress.characters - visible),
        schedulerActive: Boolean(this.timer), limits: SETTINGS };
    }
    destroy() {
      this.destroyed = true; this.stop();
      document.removeEventListener('visibilitychange', this.onVisibility);
    }
  }
  globalThis.TiboRitual = Object.freeze({ progressFor, validTotal, CrowdGrowth, SETTINGS });
})();

;
/* Shared calendar/trust policy. Validation is not authentication: only the server
 * may publish reviewed events. Imported unchanged by the Worker and browser. */
(function(root,factory){const api=factory();root.TiboResetPolicy=api;if(typeof module==='object'&&module.exports)module.exports=api;})(typeof globalThis!=='undefined'?globalThis:this,()=>{
  'use strict';
  const FRESH_MS=10*60*1000;
  function isoTime(v){return typeof v==='string'&&/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d{1,3})?(?:Z|[+-]\d\d:\d\d)$/.test(v)&&validDate(v.slice(0,10))&&Number.isFinite(Date.parse(v))?Date.parse(v):NaN;}
  function validDate(d){if(typeof d!=='string'||!/^\d{4}-\d\d-\d\d$/.test(d))return false;const n=Date.parse(d+'T00:00:00Z');return Number.isFinite(n)&&new Date(n).toISOString().slice(0,10)===d;}
  function validZone(z){try{if(typeof z!=='string'||z.length>80)return false;new Intl.DateTimeFormat('en',{timeZone:z}).format(0);return true;}catch(_){return false;}}
  const formats=new Map();
  function dayAt(ms,zone){if(!validZone(zone)||!Number.isFinite(ms))throw Error('invalid-time-or-zone');let f=formats.get(zone);if(!f){f=new Intl.DateTimeFormat('en-CA-u-ca-iso8601-nu-latn',{timeZone:zone,year:'numeric',month:'2-digit',day:'2-digit'});if(formats.size>32)formats.clear();formats.set(zone,f);}const p=Object.fromEntries(f.formatToParts(ms).map(x=>[x.type,x.value]));return `${p.year}-${p.month}-${p.day}`;}
  function nextDate(day){if(!validDate(day))throw Error('invalid-date');return new Date(Date.parse(day+'T00:00:00Z')+86400000).toISOString().slice(0,10);}
  function midnight(day,zone){if(!validDate(day)||!validZone(zone))throw Error('invalid-date-or-zone');const base=Date.parse(day+'T00:00:00Z');let lo=base-2*86400000,hi=base+2*86400000;while(hi-lo>1){const mid=Math.floor((lo+hi)/2);if(dayAt(mid,zone)<day)lo=mid;else hi=mid;}return hi;}
  // Calendar boundaries rather than +24 h, including 23/25 h DST days.
  const windows=new Map();
  function dayWindow(day,zone){const key=day+'@'+zone;if(windows.has(key))return {...windows.get(key)};const start=midnight(day,zone),end=midnight(nextDate(day),zone);if(dayAt(start,zone)!==day||end<=start)throw Error('nonexistent-calendar-day');const w={start,end};if(windows.size>64)windows.clear();windows.set(key,w);return {...w};}
  function safeText(v,max){return typeof v==='string'&&v.trim().length>0&&v.length<=max&&!/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(v);}
  function sourceURL(raw){try{const u=new URL(raw);if(u.protocol!=='https:'||!['x.com','twitter.com'].includes(u.hostname)||u.port||u.username||u.password||u.search||u.hash)return null;const m=/^\/([A-Za-z0-9_]{1,15})\/status\/(\d{1,22})$/.exec(u.pathname);return m?{account:m[1].toLowerCase(),id:m[2]}:null;}catch(_){return null;}}
  function validate(e,now=Date.now()){
    const no=reason=>({ok:false,reason});
    if(!e||e.version!==1||!safeText(e.id,80)||!['applied','announced','revoked'].includes(e.status)||!['usage-reset','banked-reset'].includes(e.kind))return no('invalid-event');
    if('probability'in e||'percent'in e)return no('not-a-probability');
    if(!safeText(e.summary,300)||!safeText(e.audience,160))return no('summary-and-audience-required');
    const s=e.source,u=sourceURL(s?.url),p=isoTime(s?.publishedAt),a=isoTime(e.approval?.at),c=isoTime(e.checkedAt);
    if(!u||typeof s.account!=='string'||typeof s.authorId!=='string'||!/^\d{1,22}$/.test(s.authorId||'')||u.id!==s.id||u.account!==s.account?.toLowerCase())return no('invalid-source');
    if(e.approval?.status!=='approved'||!safeText(e.approval.by,80)||!Number.isFinite(a)||a>now+60000||!Number.isFinite(p)||p>a+60000)return no('invalid-approval');
    if(!Number.isFinite(c)||c>now+60000||!['valid','unreachable','unavailable','changed'].includes(e.sourceStatus))return no('invalid-source-check');
    const t=e.timing;
    if(!t||!['instant','date'].includes(t.precision)||!validZone(t.timeZone)||!validDate(t.eventDate))return no('date-and-timezone-required');
    let w;try{w=dayWindow(t.eventDate,t.timeZone);}catch(_){return no('invalid-calendar-day');}
    const at=t.precision==='instant'?isoTime(t.effectiveAt):null;
    if(t.precision==='instant'&&(!Number.isFinite(at)||dayAt(at,t.timeZone)!==t.eventDate))return no('inconsistent-effective-time');
    if(t.precision==='date'&&t.effectiveAt!=null)return no('do-not-invent-a-clock-time');
    if(e.status==='applied'&&((at!==null&&at>a+60000)||t.eventDate>dayAt(a,t.timeZone)))return no('future-is-not-applied');
    return {ok:true,value:e,window:{start:Math.max(w.start,a,at??w.start),end:w.end}};
  }
  function state(e,now=Date.now()){
    if(!e)return {active:false,reason:'none'};
    const r=validate(e,now);if(!r.ok)return {active:false,reason:'invalid'};
    if(e.status==='revoked')return {active:false,reason:'revoked',...r.window};
    if(e.status!=='applied')return {active:false,reason:'announced',...r.window};
    if(now>=r.window.end)return {active:false,reason:'history',...r.window};
    if(now<r.window.start)return {active:false,reason:'waiting',...r.window};
    if(e.sourceStatus!=='valid'||now-isoTime(e.checkedAt)>FRESH_MS)return {active:false,reason:'stale',...r.window};
    return {active:true,reason:'celebrating',...r.window};
  }
  return Object.freeze({FRESH_MS,isoTime,validDate,validZone,dayAt,nextDate,dayWindow,safeText,sourceURL,validate,state});
});

;
/* Reset-news state, not a forecast. No scraping, credentials or network calls.
 * UMD so the exact browser validation can also be tested with Node.
 * This validates a UI payload; AUTHORIZATION MUST happen on the server.
 */
(function (root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.TiboSignals = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, () => {
  'use strict';
  const MAX_TTL_MS = 6 * 60 * 60 * 1000;
  const MAX_POST_AGE_MS = 48 * 60 * 60 * 1000;
  // A starting allowlist, not proof of who wrote a post. The backend must verify
  // stable author IDs against its human-approved account configuration.
  const OFFICIAL_ACCOUNTS = Object.freeze(['thsottiaux', 'openai', 'openaidevs']);
  const STATES = Object.freeze({
    unknown: Object.freeze({ label:'소식 미확인', tone:'quiet', icon:'☾', caption:'오늘도 기도는 정상 영업.', description:'아직 승인된 최신 리셋 소식을 연결하지 않았습니다.', short:'확률 미정 · 정성은 진심' }),
    buzz: Object.freeze({ label:'커뮤니티 기대 중', tone:'buzz', icon:'♡', caption:'타임라인은 들썩. 공지는 아직.', description:'커뮤니티의 기대나 추측입니다. 공식 리셋 발표가 아닙니다.', short:'기대는 상승 · 확정은 아님' }),
    hint: Object.freeze({ label:'공식 예고 확인', tone:'hint', icon:'✦', caption:'희망회로, 조심스럽게 가동.', description:'공식 출처에 예고가 있지만 실행 완료나 내 계정 적용은 보장되지 않습니다.', short:'예고 확인 · 적용 전 확인' }),
    confirmed: Object.freeze({ label:'리셋 공지 확인', tone:'confirmed', icon:'♥', caption:'감사의 큰절. 대상부터 확인!', description:'리셋 공지를 확인한 상태입니다. 적용 대상·시점과 자신의 사용량을 확인하세요.', short:'공지 확인 · 계정별 확인 필요' }),
    delayed: Object.freeze({ label:'지연·보류 안내', tone:'delayed', icon:'…', caption:'기도 연장전. 잠깐 스트레칭.', description:'지연 또는 보류 안내가 있는 상태입니다. 새 공지를 기다립니다.', short:'지연 안내 · 무리한 기다림은 금물' }),
    stale: Object.freeze({ label:'최신 소식 재확인', tone:'quiet', icon:'◷', caption:'지난 공지를 오늘의 기적으로 보진 말자.', description:'검토 유효기간이 지났습니다. 과거 공지를 현재 소식으로 표시하지 않습니다.', short:'오래된 신호 · 재검토 필요' })
  });
  const PREVIEW_STATES = Object.freeze(['unknown','buzz','hint','confirmed','delayed']);
  function text(value, max, required = true) {
    return typeof value === 'string' && value.length <= max && (!required || value.trim().length > 0) && !/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/u.test(value);
  }
  function time(value) {
    return typeof value === 'string' && /Z$|[+-]\d\d:\d\d$/.test(value) ? Date.parse(value) : NaN;
  }
  function parseSourceURL(raw) {
    if (typeof raw !== 'string' || raw.length > 300) return null;
    try {
      const url = new URL(raw);
      if (url.protocol !== 'https:' || !['x.com','www.x.com','twitter.com','www.twitter.com'].includes(url.hostname) || url.username || url.password || url.port) return null;
      const match = /^\/([a-zA-Z0-9_]{1,15})\/status\/(\d{15,22})\/?$/.exec(url.pathname);
      if (!match || url.search || url.hash) return null;
      return { url:`https://x.com/${match[1]}/status/${match[2]}`, account:match[1].toLowerCase(), id:match[2] };
    } catch (_) { return null; }
  }
  function validate(snapshot, now = Date.now()) {
    const fail = reason => ({ ok:false, reason });
    if (!snapshot || snapshot.version !== 1 || !Number.isSafeInteger(snapshot.revision) || snapshot.revision < 0) return fail('invalid-version-or-revision');
    if (!PREVIEW_STATES.includes(snapshot.state)) return fail('invalid-state');
    if ('probability' in snapshot || 'percent' in snapshot) return fail('no-probability-estimates');
    if (snapshot.approval?.status !== 'approved' || !text(snapshot.approval.by,80)) return fail('human-approval-required');
    const approvedAt = time(snapshot.approval.at), expiresAt = time(snapshot.expiresAt);
    if (!Number.isFinite(approvedAt) || !Number.isFinite(expiresAt) || approvedAt > now + 60000 || approvedAt < now - MAX_TTL_MS || expiresAt <= now || expiresAt <= approvedAt || expiresAt - approvedAt > MAX_TTL_MS) return fail('invalid-or-expired-review-window');
    if (!text(snapshot.summary,300)) return fail('invalid-summary');
    let source = null;
    if (snapshot.state !== 'unknown') {
      const s = snapshot.source;
      const url = parseSourceURL(s?.url);
      if (!url || !text(s.account,15) || url.account !== s.account.toLowerCase() || !['official','community'].includes(s.kind)) return fail('invalid-source');
      const publishedAt = time(s.publishedAt);
      if (!Number.isFinite(publishedAt) || publishedAt > approvedAt + 60000 || publishedAt > now + 60000 || now - publishedAt > MAX_POST_AGE_MS) return fail('stale-or-future-post');
      if (['hint','confirmed','delayed'].includes(snapshot.state) && (s.kind !== 'official' || !OFFICIAL_ACCOUNTS.includes(url.account))) return fail('official-source-required');
      if (snapshot.state === 'confirmed' && !text(snapshot.audience,160)) return fail('audience-required');
      source = { ...url, kind:s.kind, publishedAt:s.publishedAt };
    }
    return { ok:true, value: {
      version:1, revision:snapshot.revision, state:snapshot.state, source,
      summary:snapshot.summary.trim(), audience:text(snapshot.audience,160,false)?snapshot.audience.trim():'',
      approval:{status:'approved', by:snapshot.approval.by.trim(), at:snapshot.approval.at},
      expiresAt:snapshot.expiresAt
    }};
  }
  class SignalStore {
    constructor({ now = () => Date.now() } = {}) {
      this.now=now; this.listeners=new Set(); this.accepted=null; this.preview='unknown';
      this.mode='demo'; this.revision=-1; this.lastEffective='unknown';
    }
    setResetEvent(event) {
      if(event&&!globalThis.TiboResetPolicy?.validate(event,this.now()).ok)return false;
      this.resetEvent=event;this.emit();return true;
    }
    snapshot() {
      if(this.resetEvent){
        const e=this.resetEvent,p=globalThis.TiboResetPolicy,d=p.state(e,this.now());
        const state=e.status==='revoked'?'unknown':e.status==='announced'?'hint':d.active?'confirmed':'stale';
        return {mode:'approved-reset-feed',state,revision:this.revision,source:{...e.source,kind:'official'},summary:e.summary,audience:e.audience,approval:e.approval,stale:state==='stale',expiresAt:new Date(Math.min(d.end||0,Date.parse(e.checkedAt)+p.FRESH_MS)).toISOString()};
      }
      if (this.mode === 'demo') return { mode:'demo', state:this.preview, revision:-1, source:null, summary:STATES[this.preview].description, audience:'', expiresAt:null, approval:null, stale:false };
      const stale = time(this.accepted.expiresAt) <= this.now();
      return { ...JSON.parse(JSON.stringify(this.accepted)), mode:'adapter-preview', state:stale?'stale':this.accepted.state, stale };
    }
    emit() { const data=this.snapshot(); this.lastEffective=data.state; for(const listener of this.listeners) listener(data); }
    subscribe(listener) { this.listeners.add(listener); listener(this.snapshot()); return () => this.listeners.delete(listener); }
    previewState(state) {
      if (this.resetEvent || this.mode !== 'demo' || !PREVIEW_STATES.includes(state)) return false;
      this.preview=state; this.emit(); return true;
    }
    applyApproved(snapshot) {
      const result=validate(snapshot,this.now());
      if (!result.ok || result.value.revision <= this.revision) return false;
      this.accepted=result.value; this.revision=result.value.revision; this.mode='adapter-preview'; this.emit(); return true;
    }
    refresh() { if(this.snapshot().state !== this.lastEffective) this.emit(); }
    destroy() { this.listeners.clear(); }
  }
  return Object.freeze({ STATES, PREVIEW_STATES, OFFICIAL_ACCOUNTS, MAX_TTL_MS, MAX_POST_AGE_MS, parseSourceURL, validate, SignalStore });
});

;
/* Approved decorative speech only. Chat messages are not automatically quoted.
 * One scheduler, <=2 balloon nodes, no timer/DOM allocation per click.
 */
'use strict';
(() => {
  const SETTINGS = Object.freeze({ maxDesktop: 2, maxMobile: 1, intervalMinMs: 3000,
    intervalMaxMs: 5600, lifeMinMs: 3000, lifeMaxMs: 4200, nudgeCooldownMs: 1500 });
  const LINES={}, NEWS_LINES={}, SHORT_NEWS={};
  for(const kind of ['ambient','heart','bow','join'])Object.defineProperty(LINES,kind,{get:()=>window.TiboI18n.t('speech.'+kind),enumerable:true});
  for(const state of ['unknown','buzz','hint','confirmed','delayed','stale']){
    Object.defineProperty(NEWS_LINES,state,{get:()=>window.TiboI18n.t('speech.'+state),enumerable:true});
    Object.defineProperty(SHORT_NEWS,state,{get:()=>window.TiboI18n.t('short.'+state),enumerable:true});
  }
  const between = (a, b) => a + Math.random() * (b - a);
  const overlaps = (a, b, pad = 5) => a.x < b.x + b.w + pad && a.x + a.w > b.x - pad && a.y < b.y + b.h + pad && a.y + a.h > b.y - pad;

  class SpeechDirector {
    constructor(layer, scene) {
      this.layer = layer; this.scene = scene; this.signalState = 'unknown'; this.active = []; this.recentLines = []; this.recentPeople = [];
      this.timer = 0; this.destroyed = false; this.pending = null; this.created = 0;
      this.reduced = scene.reduced;this.suspended=false; this.nextAt = performance.now() + between(1000, 1800); this.lastNudge = -Infinity;
      this.offLocale=window.TiboI18n.subscribe(()=>{this.clear();this.recentLines=[];this.nextAt=performance.now()+1600;this.schedule();});
      this.onVisibility = () => {
        if (document.hidden) this.pause();
        else { this.nextAt = performance.now() + between(1800, 3200); this.schedule(); }
      };
      document.addEventListener('visibilitychange', this.onVisibility);
      this.resizeObserver = new ResizeObserver(() => { this.clear(); this.schedule(); });
      this.resizeObserver.observe(layer);
      this.schedule();
    }
    static exampleFor(state) { return (NEWS_LINES[state] || NEWS_LINES.unknown)[0]; }
    setSignal(state) {
      const safe=Object.hasOwn(NEWS_LINES,state)?state:'unknown';
      if(this.signalState===safe)return;
      this.signalState=safe;this.clear();this.recentLines=[];this.pending=null;
      this.nextAt=performance.now()+200;this.schedule();
    }
    limit() { return this.scene.width < 520 ? SETTINGS.maxMobile : SETTINGS.maxDesktop; }
    setSuspended(value) {
      if(this.suspended===Boolean(value))return;this.suspended=Boolean(value);
      this.pause();if(!this.suspended){this.nextAt=performance.now()+1800;this.schedule();}
    }
    setReduced(value) {
      this.reduced = Boolean(value);
      this.pause();
      if (!this.reduced) { this.nextAt = performance.now() + between(1500, 2500); this.schedule(); }
    }
    clear() {
      for (const bubble of this.active) bubble.node.remove();
      this.active.length = 0;
    }
    pause() { clearTimeout(this.timer); this.timer = 0; this.pending = null; this.clear(); }
    // A click may request an earlier line, but never an unbounded queue.
    nudge(kind, id) {
      const now = performance.now();
      if (this.reduced || this.suspended || document.hidden || this.destroyed || now - this.lastNudge < SETTINGS.nudgeCooldownMs) return;
      if (Math.random() > .6) return;
      this.lastNudge = now; this.pending = { kind, id };
      this.nextAt = Math.min(this.nextAt, now + between(150, 400)); this.schedule();
    }
    schedule() {
      clearTimeout(this.timer); this.timer = 0;
      if (this.destroyed || this.reduced || this.suspended || document.hidden) return;
      const nextExpiry = this.active.length ? Math.min(...this.active.map(b => b.until)) : Infinity;
      const due = Math.min(this.nextAt, nextExpiry);
      this.timer = setTimeout(() => { this.timer = 0; this.tick(); }, Math.max(20, due - performance.now()));
    }
    tick() {
      if (this.destroyed || this.reduced || this.suspended || document.hidden) return;
      const now = performance.now();
      this.active = this.active.filter(b => {
        if (b.until <= now || !this.scene.displayed.some(m => m.id === b.id)) { b.node.remove(); return false; }
        return true;
      });
      if (now >= this.nextAt) {
        const request = this.pending; this.pending = null;
        this.spawn(request?.kind || 'ambient', request?.id);
        this.nextAt = now + between(SETTINGS.intervalMinMs, SETTINGS.intervalMaxMs);
      }
      this.schedule();
    }
    spawn(kind, preferredId) {
      if (this.active.length >= this.limit()) return false;
      const news = NEWS_LINES[this.signalState] || NEWS_LINES.unknown;
      const pool = this.scene.width < 340
        ? SHORT_NEWS[this.signalState] || SHORT_NEWS.unknown
        : kind === 'ambient' || Math.random() < .8 ? news : LINES[kind] || news;
      let available = pool.filter(line => !this.recentLines.includes(line));
      if (!available.length) available = [...pool];
      const text = available[Math.floor(Math.random() * available.length)];
      let people = this.scene.displayed.filter(m => !this.active.some(b => b.id === m.id));
      // Shuffle once per balloon, never every animation frame.
      for (let i = people.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [people[i], people[j]] = [people[j], people[i]]; }
      people.sort((a, b) => {
        const rank = p => p.id === preferredId ? -2 : this.recentPeople.includes(p.id) ? 1 : 0;
        return rank(a) - rank(b);
      });
      const node = document.createElement('div'); node.className = 'speech random-speech';
      node.dataset.signal = this.signalState; node.dataset.caption=window.TiboI18n.t('bubbleLabel');node.lang=window.TiboI18n.locale;node.dir=window.TiboI18n.dir; node.textContent = text; node.style.visibility = 'hidden'; this.layer.append(node);
      for (const person of people) {
        const box = this.place(node, person);
        if (!box) continue;
        node.dataset.speaker = person.id; node.style.visibility = '';
        this.active.push({ node, id: person.id, text, box, until: performance.now() + between(SETTINGS.lifeMinMs, SETTINGS.lifeMaxMs) });
        this.recentLines.push(text); this.recentLines = this.recentLines.slice(-4);
        this.recentPeople.push(person.id); this.recentPeople = this.recentPeople.slice(-2);
        this.created++; return true;
      }
      // No clear space: skip this line instead of covering the portrait or buttons.
      node.remove(); return false;
    }
    place(node, person) {
      const host = this.layer.getBoundingClientRect();
      const anchorX = person.x + person.size * .5;
      const anchorY = person.headY ?? person.y + person.size * .25;
      const protectedBoxes = ['.hero-copy', '.centerpiece', '.action-row', '.scene-footnote'].map(selector => {
        const rect = this.layer.parentElement.querySelector(selector).getBoundingClientRect();
        return { x: rect.left - host.left, y: rect.top - host.top, w: rect.width, h: rect.height };
      });
      node.style.width = ''; node.style.minWidth = ''; node.style.maxWidth = '';
      const attempt = () => {
        const w = node.offsetWidth, h = node.offsetHeight, y = anchorY - h - 10;
        const candidates = [anchorX - w / 2, anchorX - w + 17, anchorX - 17];
        for (const proposed of candidates) {
          const x = Math.max(6, Math.min(host.width - w - 6, proposed));
          const box = { x, y, w, h: h + 9 };
          if (y < 6 || y + h + 9 > host.height - 6 || Math.abs(anchorX - (x + w / 2)) > w * .75) continue;
          if (protectedBoxes.some(rect => overlaps(box, rect, 7)) || this.active.some(b => overlaps(box, b.box, 9))) continue;
          node.style.left = `${Math.round(x)}px`; node.style.top = `${Math.round(y)}px`;
          node.style.setProperty('--tail-x', `${Math.max(12, Math.min(w - 12, anchorX - x))}px`);
          return box;
        }
        return null;
      };
      const full = attempt();
      if (full) return full;
      // A mobile side column may be too narrow for the normal balloon. Wrap
      // a smaller one there rather than covering the portrait or CTA buttons.
      if (host.width < 520 && (anchorX < host.width * .22 || anchorX > host.width * .78)) {
        const width = Math.floor((host.width - protectedBoxes[1].w) / 2 - 14);
        if (width >= 44) {
          node.style.width = `${Math.min(98, width)}px`;
          node.style.minWidth = '0'; node.style.maxWidth = `${Math.min(98, width)}px`;
          return attempt();
        }
      }
      return null;
    }
    diagnostics() {
      return { signalState:this.signalState, active: this.active.map(({ id, text, box }) => ({ id, text, box: { ...box } })),
        count: this.active.length, generated: this.created, timerActive: Boolean(this.timer),
        pending: Boolean(this.pending), limits: SETTINGS };
    }
    destroy() {
      this.destroyed = true; this.offLocale(); this.pause(); this.resizeObserver.disconnect();
      document.removeEventListener('visibilitychange', this.onVisibility);
    }
  }
  window.TiboSpeech = SpeechDirector;
})();

;
'use strict';
window.initTiboSignalUI=({store,speech})=>{
  const $=id=>document.getElementById(id), I=window.TiboI18n, t=I.t;
  const meta=window.TiboSignals.STATES, dialog=$('signalDialog');
  const buttons=['signalButton','signalHeroButton','signalPanelButton'].map($);
  let expiryTimer=0,destroyed=false;
  function scheduleExpiry(data){
    clearTimeout(expiryTimer);expiryTimer=0;
    if(destroyed||document.hidden||!data.expiresAt||data.stale)return;
    expiryTimer=setTimeout(()=>{expiryTimer=0;store.refresh();},Math.max(10,Date.parse(data.expiresAt)-Date.now()+25));
  }
  function render(data){
    const key='state.'+data.state+'.';const local=data.mode==='demo';
    document.body.dataset.signal=data.state;
    $('signalIcon').textContent=meta[data.state].icon;
    $('signalLabel').textContent=t(key+'label');$('signalCaption').textContent=t(key+'caption');
    $('signalDescription').textContent=local||data.stale?t(key+'description'):data.summary;
    $('signalDescription').lang=local||data.stale?I.locale:'und';$('signalDescription').dir='auto';
    $('signalDescription').title=local?'':t('sourceOriginal');
    $('signalHeroText').textContent=t(key+'short');
    $('signalBadge').textContent=t(local?'badgeDemo':data.stale?'badgeStale':'badgeApproved');
    $('signalHeroBadge').textContent=local?'DEMO':t(data.stale?'badgeReview':'badgeData');
    $('signalSource').hidden=!data.source;$('signalSourceLink').removeAttribute('href');
    $('signalSourceTime').textContent='';$('signalAudience').textContent='';
    if(data.source){
      $('signalSourceLink').href=data.source.url;
      $('signalSourceLink').textContent=t('sourceLink',{account:data.source.account});
      $('signalSourceTime').textContent=t('sourceTime',{posted:I.date(data.source.publishedAt,true),reviewed:I.date(data.approval.at,true)});
      // Preserve reviewed wording; it is never sent to a machine translator.
      $('signalAudience').textContent=data.audience?t('audience',{audience:data.audience}):'';
      $('signalAudience').dir='auto';
    }
    buttons.forEach(button=>{button.disabled=!local;});
    $('signalHeroButton').title=t(local?'newsTitleDemo':'newsTitleApproved');
    if(!local&&dialog.open)dialog.close();
    speech.setSignal(data.state);scheduleExpiry(data);
  }
  function updateExample(){$('signalExample').textContent=window.TiboSpeech.exampleFor($('signalSelect').value);}
  function open(){if(store.snapshot().mode!=='demo')return;$('signalSelect').value=store.snapshot().state;updateExample();dialog.showModal();}
  buttons.forEach(button=>button.addEventListener('click',open));
  $('closeSignal').addEventListener('click',()=>dialog.close());
  $('signalSelect').addEventListener('change',updateExample);
  $('applySignal').addEventListener('click',()=>{store.previewState($('signalSelect').value);dialog.close();});
  const unsubscribe=store.subscribe(render);
  const offLocale=I.subscribe(()=>{render(store.snapshot());updateExample();});
  const onVisibility=()=>{if(document.hidden){clearTimeout(expiryTimer);expiryTimer=0;}else{store.refresh();scheduleExpiry(store.snapshot());}};
  document.addEventListener('visibilitychange',onVisibility);
  return Object.freeze({destroy(){destroyed=true;clearTimeout(expiryTimer);unsubscribe();offLocale();document.removeEventListener('visibilitychange',onVisibility);},refresh(){store.refresh();render(store.snapshot());}});
};

;
/* Only a bounded, tab-scoped unsent draft. No cookies, credentials, user IDs or chat history. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.TiboStorage=api;})(globalThis,()=>{
  'use strict';
  const KEY='tibo-draft-v1',TTL=30*60*1000,MAX=4096;
  class DraftStore{
    constructor(storage,now=()=>Date.now()){this.storage=storage;this.now=now;this.expiresAt=0;}
    read(){
      try{
        const raw=this.storage().getItem(KEY);if(!raw)return '';
        if(raw.length>30000){this.clear();return '';}
        const d=JSON.parse(raw),now=this.now();
        if(d.version!==1||typeof d.text!=='string'||d.text.length>MAX||!Number.isSafeInteger(d.at)||d.at>now+1000||now-d.at>=TTL){this.clear();return '';}
        this.expiresAt=d.at+TTL;return d.text;
      }catch(_){this.clear();return '';}
    }
    write(text){
      if(typeof text!=='string'||text.length>MAX)return false;
      if(!text){this.clear();return true;}
      try{const at=this.now();this.storage().setItem(KEY,JSON.stringify({version:1,text,at}));this.expiresAt=at+TTL;return true;}catch(_){return false;}
    }
    clear(){this.expiresAt=0;try{this.storage().removeItem(KEY);}catch(_){/* Storage can be unavailable in file/private modes. */}}
  }
  return Object.freeze({DraftStore,KEY,TTL,MAX});
});

;
/* Transport building block, NOT an authenticated live backend. Inert until constructed.
 * Inject a same-origin authenticated sender. Exactly-once processing requires durable
 * server-side idempotency; this queue alone cannot provide it.
 */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.TiboTransport=api;})(globalThis,()=>{
  'use strict';
  const LIMITS=Object.freeze({batch:12,pending:120,intervalMs:2000,ttlMs:60000,timeoutMs:8000,maxAttempts:4});
  const validScope=x=>typeof x==='string'&&/^[A-Za-z0-9_-]{1,64}$/.test(x);
  class ActionBatcher{
    constructor({scope,send,onState=()=>{},onAck=()=>{},now=()=>Date.now(),random=Math.random,id=()=>crypto.randomUUID(),setTimer=setTimeout,clearTimer=clearTimeout}={}){
      if(!validScope(scope)||typeof send!=='function')throw new TypeError('A valid room scope and sender are required');
      Object.assign(this,{scope,send,onState,onAck,now,random,id,setTimer,clearTimer});
      this.queue=[];this.flight=null;this.timer=0;this.timerAt=0;this.controller=null;this.destroyed=false;this.paused=false;this.inFlight=false;this.dropped=0;this.lastSend=-Infinity;this.lastState='idle';this.notBefore=0;
    }
    emit(state){this.lastState=state;try{this.onState(this.snapshot());}catch(_){/* UI callbacks cannot corrupt transport state. */}}
    snapshot(){return {state:this.lastState,pending:this.queue.length+(this.flight?.items.length||0),inFlight:this.inFlight,attempt:this.flight?.attempt||0,dropped:this.dropped,paused:this.paused};}
    prune(){const n=this.queue.length;this.queue=this.queue.filter(e=>this.now()-e.at<LIMITS.ttlMs);this.dropped+=n-this.queue.length;}
    enqueue(type){
      if(this.destroyed||this.paused||!['heart','bow'].includes(type))return false;
      this.prune();if(this.snapshot().pending>=LIMITS.pending){this.emit('full');return false;}
      this.queue.push({type,at:this.now()});this.emit('queued');this.schedule();return true;
    }
    schedule(delay=LIMITS.intervalMs){
      if(this.destroyed||this.paused||this.inFlight||this.timer||(!this.queue.length&&!this.flight))return;
      const wait=Math.max(delay,LIMITS.intervalMs-(this.now()-this.lastSend),this.notBefore-this.now(),0);
      this.timerAt=this.now()+wait;
      this.timer=this.setTimer(()=>{this.timer=0;this.flush();},wait);
    }
    async flush(){
      if(this.destroyed||this.paused||this.inFlight)return;
      if(this.timer){this.clearTimer(this.timer);this.timer=0;}
      if(this.now()<this.notBefore||this.now()-this.lastSend<LIMITS.intervalMs){this.schedule();return;}
      this.prune();
      if(this.flight&&this.now()-this.flight.createdAt>=LIMITS.ttlMs){this.dropped+=this.flight.items.length;this.flight=null;this.emit('expired-unconfirmed');}
      if(!this.flight){
        const items=this.queue.splice(0,LIMITS.batch);if(!items.length){this.emit('idle');return;}
        const batchId=this.id();
        if(typeof batchId!=='string'||!/^[A-Za-z0-9_-]{16,80}$/.test(batchId))throw new TypeError('Invalid batch ID');
        const hearts=items.filter(e=>e.type==='heart').length;
        this.flight={items,createdAt:this.now(),attempt:0,payload:Object.freeze({version:1,scope:this.scope,batchId,hearts,bows:items.length-hearts})};
      }
      const flight=this.flight;flight.attempt++;this.lastSend=this.now();this.inFlight=true;
      this.controller=new AbortController();const controller=this.controller;let timeout=0;
      this.emit('sending');
      try{
        const deadline=new Promise((_,reject)=>{timeout=this.setTimer(()=>{controller.abort();reject(Object.assign(new Error('timeout'),{status:408}));},LIMITS.timeoutMs);});
        const ack=await Promise.race([this.send(flight.payload,{signal:controller.signal}),deadline]);
        if(this.destroyed)return;
        if(!ack||ack.batchId!==flight.payload.batchId||ack.scope!==this.scope||!Number.isSafeInteger(ack.accepted)||ack.accepted<0||ack.accepted>flight.items.length)throw Object.assign(new Error('Invalid acknowledgement'),{status:422});
        this.dropped+=flight.items.length-ack.accepted;this.flight=null;this.emit('acknowledged');
        try{this.onAck(ack);}catch(_){/* A rendering failure must not resend an acknowledged batch. */} // Only an acknowledgement; server snapshot remains authoritative.
      }catch(error){
        if(this.destroyed)return;
        const status=Number(error.status)||0;
        const transient=status===0||status===408||status===429||status>=500&&status<=599;
        if(!transient||flight.attempt>=LIMITS.maxAttempts){
          // Stop, retain the SAME in-flight ID until explicit resume. No silent loss or replay under a new ID.
          this.paused=true;this.emit(status===401||status===403?'authorization-required':'paused-unconfirmed');
        }else{
          const serverDelay=Math.min(30000,Math.max(0,Number(error.retryAfterMs)||0));
          this.retryDelay=Math.max(serverDelay,Math.min(30000,1000*2**(flight.attempt-1)*(0.75+this.random()*.5)));
          this.notBefore=this.now()+this.retryDelay;this.emit('retry-wait');
        }
      }finally{
        this.clearTimer(timeout);this.controller=null;this.inFlight=false;
        if(!this.destroyed&&!this.paused){const wait=this.retryDelay||LIMITS.intervalMs;this.retryDelay=0;this.schedule(wait);}
      }
    }
    resume(){if(this.destroyed)return;this.paused=false;this.schedule();}
    destroy(){this.destroyed=true;this.clearTimer(this.timer);this.timer=0;this.controller?.abort();this.queue=[];this.flight=null;}
  }
  return Object.freeze({ActionBatcher,LIMITS,validScope});
});

;
/* Decorative FX policy. No network, counts, news state or user identity here. */
'use strict';
(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.TiboEffectsPolicy=api;
})(typeof window!=='undefined'?window:globalThis,()=>{
  const PROFILES=Object.freeze({
    rich:Object.freeze({stars:13,motes:9,petals:6,burst:7,transientMax:28,actionGap:850,joinGap:1200}),
    soft:Object.freeze({stars:5,motes:3,petals:0,burst:3,transientMax:12,actionGap:1200,joinGap:1600}),
    off:Object.freeze({stars:0,motes:0,petals:0,burst:0,transientMax:0,actionGap:1200,joinGap:1600})
  });
  const choices=Object.freeze(['auto','rich','soft','off']);
  function selectQuality({requested='auto',reduced=false,narrow=false,saveData=false,memory=null,cores=null}={}){
    if(reduced)return 'off';
    if(!choices.includes(requested))requested='auto';
    if(requested!=='auto')return requested;
    const lowMemory=typeof memory==='number'&&Number.isFinite(memory)&&memory>0&&memory<=4;
    const lowCPU=typeof cores==='number'&&Number.isFinite(cores)&&cores>0&&cores<=4;
    return narrow||saveData||lowMemory||lowCPU?'soft':'rich';
  }
  class PulseGate{
    constructor(){this.times=new Map();}
    allow(channel,now,gap){
      if(!['action','join'].includes(channel)||!Number.isFinite(now)||now<0||!Number.isFinite(gap)||gap<0)return false;
      const last=this.times.get(channel);
      if(last!==undefined&&now-last<gap)return false;
      this.times.set(channel,now);return true;
    }
  }
  return Object.freeze({PROFILES,choices,selectQuality,PulseGate});
});

;
/* Living plaza: original PNGs + independently animated light layers.
 * Ambient motion uses fixed CSS elements (no JS frame loop). Transients are
 * bounded, cancellable Web Animations. No fetch, timers, click counting or audio.
 */
'use strict';
window.initTiboEffects=({host,scene,reduced=false})=>{
  const P=window.TiboEffectsPolicy,gate=new P.PulseGate();
  const $=id=>document.getElementById(id),center=$('centerpiece');
  const created=[],active=new Map();
  let destroyed=false,suspended=false,requested='auto',quality='off',profile=P.PROFILES.off;
  let actionPulses=0,joinPulses=0,droppedPulses=0,highWater=0;
  const supportsWA=typeof host.animate==='function';
  const control=$('effectsQuality'),status=$('effectsStatus');
  const connection=navigator.connection;
  function node(parent,cls,text=''){
    const el=document.createElement('span');el.className=cls;el.textContent=text;
    el.setAttribute('aria-hidden','true');parent.append(el);return el;
  }
  function layer(parent,cls){const el=node(parent,cls);el.dataset.fxDecor='';created.push(el);return el;}
  const sky=layer(host,'fx-sky'),garden=layer(host,'fx-garden');
  const beam=layer(center,'fx-beam');for(let i=0;i<3;i++)node(beam,'fx-beam-shaft');
  const crown=layer(center,'fx-crown');node(crown,'fx-crown-ring');
  const orbit=layer(center,'fx-orbit');for(let i=0;i<3;i++)node(orbit,'fx-orbit-star','✦');
  const flare=layer(center,'fx-halo-flare');
  const floor=layer(host,'fx-ground-light');
  const transient=layer(host,'fx-transients');
  const comet=node(sky,'fx-comet');
  const starPositions=[[8,7],[17,21],[29,9],[37,3],[62,9],[76,6],[88,19],[94,4],[5,31],[85,32],[27,28],[67,29],[49,5]];
  const stars=starPositions.map(([x,y],i)=>{
    const el=node(sky,'fx-twinkle',i%3===0?'✦':'·');
    el.style.left=x+'%';el.style.top=y+'%';el.style.setProperty('--delay',(-i*1.37)+'s');
    el.style.setProperty('--duration',(4.7+i%4*1.3)+'s');return el;
  });
  const motes=Array.from({length:9},(_,i)=>{
    const el=node(garden,'fx-mote');el.style.left=(7+(i*23)%86)+'%';el.style.top=(53+(i*7)%29)+'%';
    el.style.setProperty('--delay',(-i*1.9)+'s');el.style.setProperty('--duration',(7+i%3*2)+'s');
    el.style.setProperty('--drift',((i%2?1:-1)*(11+i*2))+'px');return el;
  });
  const petals=Array.from({length:6},(_,i)=>{
    const el=node(garden,'fx-petal');el.style.left=(i%2?83-i*4:8+i*5)+'%';el.style.top=(57+i%3*8)+'%';
    el.style.setProperty('--delay',(-i*2.7)+'s');el.style.setProperty('--duration',(11+i%3*2)+'s');
    el.style.setProperty('--drift',(i%2?-39:41)+'px');return el;
  });
  const lamps=[[12,81],[87,81],[12,27],[91,26]];
  lamps.forEach(([x,y],i)=>{const l=node(garden,'fx-lamp-glow');l.style.left=x+'%';l.style.top=y+'%';l.style.setProperty('--delay',(-i*1.2)+'s');});
  function visible(){return !destroyed&&!suspended&&!document.hidden;}
  function running(){return visible()&&!reduced&&quality!=='off';}
  function clearTransient(){
    for(const [animation,record] of [...active]){active.delete(animation);animation.cancel();if(record.remove)record.el.remove();}
    transient.replaceChildren();
  }
  function label(){
    const t=window.TiboI18n.t;
    status.textContent=t(reduced?'fxReduced':quality==='off'?'fxStopped':quality==='soft'?'fxSoftActive':'fxRichActive');
  }
  function sync(){
    if(destroyed)return;
    const next=P.selectQuality({requested,reduced,narrow:host.clientWidth<720,
      saveData:Boolean(connection?.saveData),memory:navigator.deviceMemory,cores:navigator.hardwareConcurrency});
    if(next!==quality){quality=next;profile=P.PROFILES[quality];clearTransient();}
    host.dataset.fxQuality=quality;
    const go=running();host.classList.toggle('fx-live',go);host.classList.toggle('fx-still',!go);
    stars.forEach((s,i)=>s.hidden=i>=profile.stars);motes.forEach((s,i)=>s.hidden=i>=profile.motes);petals.forEach((s,i)=>s.hidden=i>=profile.petals);
    comet.hidden=quality!=='rich';
    if(!go)clearTransient();label();
  }
  function animate(el,frames,options={},remove=false){
    if(!running()||!supportsWA||active.size>=profile.transientMax){if(remove)el.remove();return false;}
    let a;
    try{a=el.animate(frames,{duration:1300,easing:'ease-out',fill:'none',...options});}
    catch(_){if(remove)el.remove();return false;}
    active.set(a,{el,remove});highWater=Math.max(highWater,active.size);
    const cleanup=()=>{active.delete(a);if(remove)el.remove();};
    a.onfinish=cleanup;a.oncancel=cleanup;return true;
  }
  function pointRect(el){
    const b=host.getBoundingClientRect(),r=el.getBoundingClientRect();
    return{x:r.left-b.left+r.width/2,y:r.top-b.top+r.height/2,width:r.width,height:r.height};
  }
  function puff(x,y,kind,index,count){
    const el=node(transient,'fx-particle '+(kind==='heart'?'fx-heart-particle':'fx-gold-particle'),kind==='heart'?'♥':'✦');
    el.style.left=x+'px';el.style.top=y+'px';
    const angle=(index/count*2*Math.PI)-Math.PI/2;
    const dx=Math.cos(angle)*(quality==='soft'?35:52),dy=Math.sin(angle)*38-35;
    animate(el,[{opacity:0,transform:'translate(-50%,-50%) scale(.4)'},
      {opacity:.85,offset:.22,transform:`translate(calc(-50% + ${dx*.36}px),calc(-50% + ${dy*.36}px)) scale(.9)`},
      {opacity:0,transform:`translate(calc(-50% + ${dx}px),calc(-50% + ${dy-25}px)) scale(.5)`}],
      {duration:1500+index*55,delay:index*30},true);
  }
  function ring(x,y,width,kind){
    const el=node(transient,'fx-wave '+kind);el.style.left=x+'px';el.style.top=y+'px';
    el.style.width=width+'px';el.style.height=Math.max(24,width*.25)+'px';
    animate(el,[{opacity:0,transform:'translate(-50%,-50%) scale(.35)'},
      {opacity:.6,offset:.22,transform:'translate(-50%,-50%) scale(.65)'},
      {opacity:0,transform:'translate(-50%,-50%) scale(1.6)'}],{duration:1550},true);
  }
  function onAction(kind,id){
    if(!['heart','bow'].includes(kind)||!running())return false;
    if(!gate.allow('action',performance.now(),profile.actionGap)){droppedPulses++;return false;}
    actionPulses++;
    const portrait=pointRect($('portrait'));
    // A stable, slow halo pulse; never a screen-wide flash or probability signal.
    animate(flare,[{opacity:0,transform:'scale(.92)'},{opacity:.66,offset:.35,transform:'scale(1.025)'},{opacity:0,transform:'scale(1.12)'}],{duration:1500});
    const counter=$(kind==='heart'?'heartCount':'bowCount');
    animate(counter,[{transform:'scale(1)'},{transform:'scale(1.10)',offset:.35},{transform:'scale(1)'}],{duration:500});
    if(kind==='heart'){
      for(let i=0;i<profile.burst;i++)puff(portrait.x,portrait.y-portrait.height*.3,kind,i,profile.burst);
    }else{
      const p=scene.point(id);ring(p.x,p.y+3,Math.min(230,host.clientWidth*.38),'fx-wave-gold');
      const foot=pointRect(document.querySelector('.saint-plaque'));
      ring(foot.x,foot.y+foot.height*.4,Math.min(330,host.clientWidth*.65),'fx-wave-gold');
      for(let i=0;i<profile.burst-1;i++)puff(portrait.x,portrait.y-portrait.height*.27,kind,i,profile.burst-1);
    }
    return true;
  }
  function onJoin(id){
    if(!running()||!gate.allow('join',performance.now(),profile.joinGap))return false;
    if(!scene.displayed.some(s=>s.id===id))return false;
    joinPulses++;const p=scene.point(id);ring(p.x,p.y+2,85,'fx-wave-pink');return true;
  }
  const change=()=>{requested=P.choices.includes(control.value)?control.value:'auto';sync();};
  const resize=new ResizeObserver(sync);resize.observe(host);
  const pageshow=()=>sync();
  control.addEventListener('change',change);document.addEventListener('visibilitychange',sync);window.addEventListener('pageshow',pageshow);
  connection?.addEventListener?.('change',sync);
  const unsubscribe=window.TiboI18n.subscribe(label);
  sync();
  return Object.freeze({
    onAction,onJoin,
    setReduced(value){reduced=Boolean(value);sync();},
    setSuspended(value){suspended=Boolean(value);sync();},
    diagnostics(){return {version:'living-light-1',requested,quality,running:running(),suspended,reduced,
      supportsWA,active:active.size,transientNodes:transient.childElementCount,highWater,actionPulses,joinPulses,droppedPulses,
      ambientNodes:profile.stars+profile.motes+profile.petals,limits:profile};},
    destroy(){destroyed=true;clearTransient();resize.disconnect();unsubscribe();control.removeEventListener('change',change);
      document.removeEventListener('visibilitychange',sync);window.removeEventListener('pageshow',pageshow);connection?.removeEventListener?.('change',sync);
      created.forEach(el=>el.remove());host.classList.remove('fx-live','fx-still');delete host.dataset.fxQuality;}
  });
};

;
/* Pause costly scene work when it is outside the viewport or behind a modal.
 * Browser tab visibility remains owned by each component. Fallback: modal pause only.
 */
'use strict';
window.initTiboActivity=({scene,speech,effects,host})=>{
  let inView=true,modal=false,destroyed=false;
  const sync=()=>{
    if(destroyed)return;
    modal=Boolean(document.querySelector('dialog[open],.chat-panel.open'));
    const suspended=!inView||modal;
    scene.setSuspended(suspended);speech.setSuspended(suspended);effects?.setSuspended(suspended);
    document.body.classList.toggle('scene-paused',suspended);
  };
  const io=typeof IntersectionObserver==='function'?new IntersectionObserver(entries=>{inView=entries[0]?.isIntersecting!==false;sync();},{rootMargin:'80px'}):null;
  io?.observe(host);
  const mo=new MutationObserver(sync);
  for(const node of [...document.querySelectorAll('dialog'),document.getElementById('chatPanel')])mo.observe(node,{attributes:true,attributeFilter:['open','class']});
  sync();
  return Object.freeze({destroy(){destroyed=true;io?.disconnect();mo.disconnect();}});
};

;
/* Local-only chat, safe text nodes, IME handling and tab-scoped drafts. */
'use strict';
window.initTiboChat=({CONFIG})=>{
  const $=id=>document.getElementById(id),I=window.TiboI18n,t=I.t;
  const len=value=>window.TiboLocale.graphemes(value).length;
  let composing=false,chatStatusKey='chatIdle',lastMessageAt=-Infinity,chatReleaseTimer=0;
  function chatStatus(key){chatStatusKey=key;$('chatStatus').textContent=t(key);}
  const avatarCache = new Map();
  const drafts = new window.TiboStorage.DraftStore(()=>sessionStorage);
  let draftTimer=0,purgeTimer=0;
  const schedulePurge=()=>{clearTimeout(purgeTimer);purgeTimer=0;if(drafts.expiresAt)purgeTimer=setTimeout(()=>drafts.clear(),Math.max(0,drafts.expiresAt-Date.now()));};
  const saveDraft=()=>{clearTimeout(draftTimer);draftTimer=0;drafts.write($('chatInput').value);schedulePurge();};
  const saveLater=()=>{clearTimeout(draftTimer);draftTimer=setTimeout(saveDraft,300);};
  const restore = drafts.read();
  if(restore){$('chatInput').value=restore;chatStatus('draftRestored');schedulePurge();}
  $('clearDraft').addEventListener('click',()=>{clearTimeout(draftTimer);clearTimeout(purgeTimer);drafts.clear();$('chatInput').value='';updateLength();chatStatus('draftCleared');$('chatInput').focus();});
  const saveOnHide=()=>{if(document.hidden)saveDraft();};
  document.addEventListener('visibilitychange',saveOnHide);
  window.addEventListener('pagehide',saveDraft);
  function avatarSource(color) {
    if (avatarCache.has(color)) return avatarCache.get(color);
    const url = window.TiboScene.avatarSource(color);
    avatarCache.set(color,url);return url;
  }
  function appendMessage(name, text, color, time, local = false) {
    const list = $('chatList');
    const atBottom = list.scrollHeight - list.scrollTop - list.clientHeight < 48;
    const article = document.createElement('div'); article.className = 'chat-item';article.dataset.local=String(local);
    const avatar = document.createElement('img'); avatar.className = 'avatar'; avatar.src = avatarSource(color); avatar.alt = ''; avatar.width = 29; avatar.height = 29;
    const body = document.createElement('div'); body.className = 'chat-message';
    const meta = document.createElement('div'); meta.className = 'chat-meta';
    const strong = document.createElement('strong'); strong.textContent = name;strong.dir='auto';
    const stamp = document.createElement('time'); stamp.textContent = time;
    const paragraph = document.createElement('p'); paragraph.textContent = text;paragraph.dir='auto';paragraph.lang=local?'und':I.locale; // Never insert user text as HTML.
    meta.append(strong, stamp); body.append(meta, paragraph); article.append(avatar,body); list.append(article);
    while (list.children.length > CONFIG.maxMessages) list.firstElementChild.remove();
    if (local || atBottom) list.scrollTop = list.scrollHeight;
  }
  // Only built-in samples change language. User-authored text is never replaced.
  const sampleNames=['TokenDreamer','CodePotato','LastCoffee','PromptMaker','NightBuilder','BugHunter'];
  function localizeSamples(){
    const list=$('chatList'), scroll=list.scrollTop;
    const originals=[...list.children].filter(n=>n.dataset.local==='true');
    list.setAttribute('aria-live','off');list.replaceChildren();
    I.t('samples').forEach((text,i)=>appendMessage(sampleNames[i],text,i,'14:'+String(23+i)));
    originals.forEach(node=>list.append(node));
    while(list.children.length>CONFIG.maxMessages)list.firstElementChild.remove();
    list.scrollTop=scroll;
    requestAnimationFrame(()=>list.setAttribute('aria-live','polite'));
  }
  localizeSamples();$('chatList').scrollTop=0;
  function updateLength(){
    const count=len($('chatInput').value);
    $('charCount').textContent=I.number(count,false)+' / '+I.number(CONFIG.maxChars,false);
    $('chatInput').setAttribute('aria-invalid',String(count>CONFIG.maxChars));
  }
  $('chatInput').addEventListener('compositionstart',()=>{composing=true;});
  $('chatInput').addEventListener('compositionend',()=>{composing=false;updateLength();});
  $('chatInput').addEventListener('keydown',event=>{if(event.key==='Enter'&&(event.isComposing||composing||event.keyCode===229))event.preventDefault();});
  $('chatInput').addEventListener('input',()=>{updateLength();saveLater();});
  document.querySelectorAll('.wish-chip').forEach(button => button.addEventListener('click', () => {
    $('chatInput').value = button.dataset.wish; updateLength();saveLater(); $('chatInput').focus();
  }));
  $('chatForm').addEventListener('submit', event => {
    event.preventDefault();
    if(composing)return;
    const text = $('chatInput').value.trim();
    if(text.length>4096||len(text)>CONFIG.maxChars){chatStatus('chatTooLong');$('chatInput').setAttribute('aria-invalid','true');return;}
    if (!text) { chatStatus('chatEmpty'); return; }
    const now = performance.now();
    if (now - lastMessageAt < CONFIG.chatCooldownMs) { chatStatus('chatRate'); return; }
    lastMessageAt = now;
    const time = I.date(new Date());
    appendMessage(t('meLocal'), text, 0, time, true);
    $('chatInput').value = ''; updateLength();clearTimeout(draftTimer);clearTimeout(purgeTimer);drafts.clear();
    $('chatSend').disabled = true; chatStatus('chatSent');
    clearTimeout(chatReleaseTimer);
    chatReleaseTimer = setTimeout(() => { $('chatSend').disabled = false; chatStatus('chatIdle'); }, CONFIG.chatCooldownMs);
  });


  return Object.freeze({renderLocale(){updateLength();chatStatus(chatStatusKey);localizeSamples();},destroy(){clearTimeout(purgeTimer);clearTimeout(chatReleaseTimer);clearTimeout(draftTimer);document.removeEventListener('visibilitychange',saveOnHide);window.removeEventListener('pagehide',saveDraft);},get messageCount(){return $('chatList').children.length;}});
};

;
/* Keyboard and modal ownership, separate from data and animation. */
'use strict';
window.initTiboDialogs=({mobile})=>{
  const $=id=>document.getElementById(id);
  const inertOutside = [document.querySelector('.locale-bar'),$('plazaPanel'), document.querySelector('.site-header'), $('demoNotice'), document.querySelector('.site-footer'), $('openChat')];
  function openChat() {
    if (!mobile.matches) return;
    $('chatPanel').classList.add('open'); $('chatPanel').setAttribute('role','dialog'); $('chatPanel').setAttribute('aria-modal','true'); $('chatPanel').removeAttribute('aria-hidden');
    $('chatBackdrop').hidden = false; document.body.classList.add('chat-open'); $('openChat').setAttribute('aria-expanded','true');
    inertOutside.forEach(element => { element.inert = true; });
    $('chatInput').focus({ preventScroll:true });
  }
  function closeChat(restore = true) {
    const wasOpen = $('chatPanel').classList.contains('open');
    $('chatPanel').classList.remove('open'); $('chatPanel').removeAttribute('aria-modal'); $('chatPanel').removeAttribute('role');
    if (mobile.matches) $('chatPanel').setAttribute('aria-hidden','true'); else $('chatPanel').removeAttribute('aria-hidden');
    $('chatBackdrop').hidden = true; document.body.classList.remove('chat-open'); $('openChat').setAttribute('aria-expanded','false');
    inertOutside.forEach(element => { element.inert = false; });
    if (wasOpen && restore && mobile.matches) $('openChat').focus({ preventScroll:true });
  }
  $('openChat').addEventListener('click', openChat); $('closeChat').addEventListener('click', () => closeChat()); $('chatBackdrop').addEventListener('click', () => closeChat());
  mobile.addEventListener('change', () => closeChat(false)); closeChat(false);
  document.addEventListener('keydown', event => {
    if (!$('chatPanel').classList.contains('open') || document.querySelector('dialog[open]')) return;
    if (event.key === 'Escape') { event.preventDefault(); closeChat(); }
    if (event.key !== 'Tab') return;
    const focusable = [...$('chatPanel').querySelectorAll('a[href],button:not(:disabled),input:not(:disabled),select:not(:disabled),[tabindex="0"]')].filter(el => el.getClientRects().length);
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
  // Explicit Tab wrap supplements native dialog behavior in embedded browsers.
  const modalTabGuard=event=>{
    if(event.key!=='Tab')return;
    const open=[...document.querySelectorAll('dialog[open]')].at(-1);
    if(!open)return;
    const controls=[...open.querySelectorAll('a[href],button:not(:disabled),select:not(:disabled),input:not(:disabled),textarea:not(:disabled),[tabindex="0"]')].filter(el=>el.getClientRects().length);
    if(!controls.length){event.preventDefault();return;}
    const first=controls[0],last=controls.at(-1),active=document.activeElement;
    if(event.shiftKey&&(active===first||!open.contains(active))){event.preventDefault();last.focus();}
    else if(!event.shiftKey&&(active===last||!open.contains(active))){event.preventDefault();first.focus();}
  };
  document.addEventListener('keydown',modalTabGuard,true);
  const dialog = $('aboutDialog');
  $('aboutButton').addEventListener('click', () => dialog.showModal());
  $('closeAbout').addEventListener('click', () => dialog.close()); $('backToPlaza').addEventListener('click', () => dialog.close());


  return {destroy(){document.removeEventListener('keydown',modalTabGuard,true);}};
};

;
/* Official reset calendar + explicitly marked local visual rehearsal.
 * Visitors fetch one cached SAME-ORIGIN feed, never X. No secrets/auto-approval. */
'use strict';
window.initTiboResetDay=({host,effects,signalStore,speech,transport={}})=>{
  // Dependency injection is for isolated tests; the app always uses same-origin defaults.
  const fetcher=transport.fetcher||((...args)=>fetch(...args));
  const networkAllowed=transport.enabled||(()=>['http:','https:'].includes(location.protocol));
  const P=window.TiboResetPolicy,I=window.TiboI18n,t=I.t,$=id=>document.getElementById(id);
  let feed=null,revision=-1,destroyed=false,previewUntil=0,network='not-connected',failures=0;
  let timer=0,pollTimer=0,controller=null,fetches=0,lastFetch=0,acceptedTime=-1,endpointUnavailable=false;
  const layer=document.createElement('span');layer.className='blessing-shell';layer.setAttribute('aria-hidden','true');layer.dataset.fxDecor='';host.append(layer);
  const ribbon=document.createElement('span');ribbon.className='blessing-ribbon';ribbon.setAttribute('aria-hidden','true');document.querySelector('.hero-copy').append(ribbon);
  const particles=Array.from({length:32},(_,i)=>{
    const el=document.createElement('i');el.className='blessing-drop';el.textContent=i%5===0?'♥':i%3===0?'✦':'◆';
    el.style.setProperty('--pour-delay',(-i*.37)+'s');el.style.setProperty('--pour-duration',(4.8+(i%7)*.39)+'s');layer.append(el);return el;
  });
  for(let i=0;i<3;i++){const ring=document.createElement('i');ring.className='blessing-floor-ring';ring.style.setProperty('--pour-delay',(-i*2.7)+'s');layer.append(ring);}
  function place(){const box=host.getBoundingClientRect(),r=$('portrait').getBoundingClientRect();const x=r.left-box.left+r.width*.5,y=r.top-box.top+r.height*.72;
    particles.forEach((el,i)=>{const dx=((i%2?1:-1)*(40+(i*43)%Math.max(50,Math.round(box.width*.38))));
      el.style.left=x+'px';el.style.top=y+'px';el.style.setProperty('--pour-mid-x',(dx*.58)+'px');el.style.setProperty('--pour-x',dx+'px');el.style.setProperty('--pour-y',Math.max(70,box.height*.79-y)+'px');});
  }
  const resize=new ResizeObserver(place);resize.observe(host);place();
  function date(v,zone){try{return new Intl.DateTimeFormat(I.locale,{dateStyle:'medium',timeStyle:'short',...(zone?{timeZone:zone}:{})}).format(new Date(v));}catch(_){return String(v);}}
  function write(id,value){const e=$(id);if(e.textContent!==value)e.textContent=value;}
  function activeState(){if(previewUntil>Date.now())return {active:true,reason:'demo',end:previewUntil};
    if(network==='paused'||network==='not-connected')return {active:false,reason:network};return P.state(feed?.event);}
  function render(){
    if(destroyed)return;const state=activeState(),isDemo=state.reason==='demo',event=feed?.event;
    host.classList.toggle('reset-celebrating',state.active);document.body.classList.toggle('reset-day',state.active);
    ribbon.hidden=!state.active;ribbon.textContent=t(isDemo?'reset.demoRibbon':'reset.ribbon');
    write('resetTitle',t('reset.'+({none:'waiting',invalid:'stale','not-connected':'disconnected',paused:'paused',waiting:'waiting',demo:'demo',celebrating:'celebrating',announced:'announced',history:'history',stale:'stale',revoked:'revoked'}[state.reason]||'waiting')));
    write('resetProvider',isDemo?t('reset.demoBadge'):t('reset.feed')+' · '+t(network==='connected'?'reset.connected':'reset.notConnected'));
    write('resetPreview',t(isDemo?'reset.stopPreview':'reset.preview'));$('resetPreview').setAttribute('aria-pressed',String(isDemo));
    write('resetNote',t(isDemo?'reset.demoNote':state.active?'reset.noteActive':'reset.noteWaiting'));
    $('resetDetails').hidden=!event||isDemo;
    $('resetSource').hidden=!event||isDemo;$('resetSource').removeAttribute('href');
    if(event&&!isDemo){
      const timing=event.timing;write('resetSummary',event.summary);$('resetSummary').dir='auto';
      write('resetEffective',timing.precision==='instant'?date(timing.effectiveAt,timing.timeZone)+' · '+timing.timeZone:timing.eventDate+' · '+timing.timeZone+' · '+t('reset.timeUnknown'));
      write('resetLocal',timing.precision==='instant'?date(timing.effectiveAt):t('reset.timeUnknown'));
      write('resetPublished',date(event.source.publishedAt));write('resetApproved',date(event.approval.at));write('resetChecked',date(event.checkedAt));write('resetAudience',event.audience);$('resetAudience').dir='auto';
      write('resetKind',t('reset.'+(event.kind==='banked-reset'?'banked':'usage')));
      write('resetEnd',P.validate(event).ok?date(P.validate(event).window.end,timing.timeZone)+' · '+timing.timeZone:'—');
      $('resetSource').href=event.source.url;write('resetSource',t('reset.source')+' · @'+event.source.account+' ↗');
    }
    if(isDemo)speech.setSignal('confirmed');else if(event)signalStore.setResetEvent(event);else{signalStore.setResetEvent(null);speech.setSignal(signalStore.snapshot().state);}
    clearTimeout(timer);timer=0;
    const nexts=[previewUntil,event?Date.parse(event.checkedAt)+P.FRESH_MS:0,state.end||0].filter(n=>n>Date.now());
    if(!document.hidden&&nexts.length)timer=setTimeout(render,Math.min(60000,Math.max(50,Math.min(...nexts)-Date.now()+30)));
  }
  function accept(data){
    if(!data||data.version!==1||!Number.isSafeInteger(data.revision)||data.revision<revision||typeof data.provider!=='string')return false;
    const generated=P.isoTime(data.generatedAt);if(!Number.isFinite(generated)||generated<acceptedTime||generated>Date.now()+300000||Date.now()-generated>300000)return false;
    if(data.event&&!P.validate(data.event).ok)return false;
    feed=data;revision=data.revision;acceptedTime=generated;network=data.provider;failures=0;render();return true;
  }
  function canFetch(){return !destroyed&&!endpointUnavailable&&!document.hidden&&networkAllowed();}
  async function poll(){
    clearTimeout(pollTimer);pollTimer=0;if(!canFetch()||controller)return;
    // Tab switches cannot create a tight poll loop.
    if(Date.now()-lastFetch<45000){pollTimer=setTimeout(poll,45000-(Date.now()-lastFetch));return;}
    lastFetch=Date.now();controller=new AbortController();const timeout=setTimeout(()=>controller?.abort(),5000);fetches++;
    let stop=false;
    try{const response=await fetcher('/api/reset-news',{credentials:'omit',headers:{Accept:'application/json'},signal:controller.signal});
      if([404,503].includes(response.status)){network='not-connected';stop=true;}
      else if(!response.ok)throw Error('feed-response');
      else{if(Number(response.headers.get('content-length'))>64000)throw Error('large-feed');const reader=response.body.getReader(),decoder=new TextDecoder();let text='',bytes=0;try{while(true){const {done,value}=await reader.read();if(done)break;bytes+=value.length;if(bytes>64000){await reader.cancel();throw Error('large-feed');}text+=decoder.decode(value,{stream:true});}text+=decoder.decode();}finally{reader.releaseLock();}if(!accept(JSON.parse(text)))throw Error('invalid-feed');stop=network==='not-connected';}
    }catch(_){failures++;if(!feed)network='not-connected';}
    finally{clearTimeout(timeout);controller=null;if(stop)endpointUnavailable=true;render();if(!stop&&canFetch())pollTimer=setTimeout(poll,Math.min(300000,60000*2**Math.min(failures,2))+Math.random()*15000);}
  }
  const preview=()=>{previewUntil=previewUntil>Date.now()?0:Date.now()+120000;render();};$('resetPreview').addEventListener('click',preview);
  const visibility=()=>{clearTimeout(timer);clearTimeout(pollTimer);if(document.hidden){controller?.abort();return;}render();poll();};
  document.addEventListener('visibilitychange',visibility);window.addEventListener('pageshow',visibility);
  const off=I.subscribe(render);render();poll();
  return Object.freeze({
    refresh(){render();return poll();},
    diagnostics(){return {active:activeState().active,state:activeState().reason,provider:network,preview:previewUntil>Date.now(),fetches,failures,revision,particles:particles.length};},
    destroy(){destroyed=true;clearTimeout(timer);clearTimeout(pollTimer);controller?.abort();off();resize.disconnect();layer.remove();ribbon.remove();host.classList.remove('reset-celebrating');document.body.classList.remove('reset-day');$('resetPreview').removeEventListener('click',preview);document.removeEventListener('visibilitychange',visibility);window.removeEventListener('pageshow',visibility);}
  });
};

;
/* App composition. Sources remain demo-only; the integration seam is not authentication. */
'use strict';
(async () => {
  const $ = id => document.getElementById(id);
  const I=window.TiboI18n,t=I.t;
  const CONFIG = Object.freeze({ maxMessages: 80, maxChars: 160, chatCooldownMs: 3000, actionsPerSecond: 6, ambientMs: 2800 });
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = window.matchMedia('(max-width: 899px)');
  let storedMotion = null;
  try { storedMotion = localStorage.getItem('tibo-demo-motion'); } catch (_) { /* file: storage can be unavailable */ }
  let reduced = storedMotion === 'normal' ? false : storedMotion === 'reduced' ? true : media.matches;
  let hearts = 0, bows = 0, ownHearts = 0, ownBows = 0;
  let source = 'local', confirmedScope = null, revision = -1, actionSequence = 0;
  let recentActions = [];
  let uiStatusTimer = 0;
  $('retryLoad').addEventListener('click',()=>location.reload());
  await window.TiboScene.loadAssets();
  const self = { id: 'local-me', name: t('me'), color: 0 };
  const scene = new window.TiboScene($('plazaCanvas'), { reduced, ownLabel: t('me') });
  let speech = null, effects = null;
  const signalStore = new window.TiboSignals.SignalStore();
  let signalUI = null;
  const compact = n => I.number(n);
  function updateGrowth(snapshot) {
    $('onlineCount').textContent = compact(snapshot.characters);
    const overflow = snapshot.earned > 24 || (scene.width < 520 && snapshot.earned > 6);
    $('growthSummary').textContent = overflow
      ? t('growthOverflow',{total:compact(snapshot.total),count:compact(snapshot.offscreenCharacters)})
      : t('growth',{total:compact(snapshot.total),remaining:compact(snapshot.remaining)});
    $('growthMeter').value = snapshot.fraction;
    $('growthMeter').max = 1;
    $('growthMeter').setAttribute('aria-label', t('meterLabel',{remaining:compact(snapshot.remaining)}));
    $('onlineCount').title = t('countTitle',{count:compact(snapshot.characters),visible:compact(snapshot.visibleCharacters)});
  }
  const crowd = new window.TiboRitual.CrowdGrowth(scene, self, {
    onChange: updateGrowth, onJoin: member => {speech?.nudge('join', member.id);effects?.onJoin(member.id);}
  });
  speech = new window.TiboSpeech($('speechLayer'), scene);
  signalUI = window.initTiboSignalUI({store:signalStore,speech});
  await $('portrait').decode();
  effects=window.initTiboEffects({host:$('scene'),scene,reduced});
  const resetDay=window.initTiboResetDay({host:$('scene'),effects,signalStore,speech});
  let layoutExtra=0;
  function fitScene(){
    const host=$('scene'),hero=document.querySelector('.hero-copy'),center=$('centerpiece');
    const h=host.clientHeight;if(!h)return;
    const ratio=Math.max(.2,Math.min(.4,parseFloat(getComputedStyle(center).top)/h));
    const base=h-layoutExtra;
    const required=hero.offsetTop+hero.offsetHeight+20;
    const next=Math.max(0,Math.ceil(required/ratio-base));
    if(Math.abs(next-layoutExtra)>1){layoutExtra=next;document.querySelector('.page-shell').style.setProperty('--layout-extra',next+'px');}
    updateGrowth(crowd.snapshot());
  }
  const layoutObserver = new ResizeObserver(fitScene);
  layoutObserver.observe($('plazaCanvas'));layoutObserver.observe(document.querySelector('.hero-copy'));fitScene();
  $('sendHeart').disabled = false; $('sendBow').disabled = false;

  function updateMotion(value, save = false) {
    reduced = Boolean(value);
    document.body.classList.toggle('reduced-motion', reduced);
    document.body.classList.toggle('motion-allowed', !reduced);
    effects.setReduced(reduced);
    $('motionButton').setAttribute('aria-pressed', String(reduced));
    $('motionLabel').textContent = t(reduced ? 'motionOn' : 'motionOff');
    scene.setReduced(reduced);
    crowd.motionChanged(); speech.setReduced(reduced);
    if (save) { storedMotion=reduced?'reduced':'normal';try { localStorage.setItem('tibo-demo-motion', reduced ? 'reduced' : 'normal'); } catch (_) {} }
  }
  const activity = window.initTiboActivity({scene,speech,effects,host:$('scene')});
  updateMotion(reduced);
  $('motionButton').addEventListener('click', () => updateMotion(!reduced, true));
  media.addEventListener('change', event => {if(storedMotion!=='normal'&&storedMotion!=='reduced')updateMotion(event.matches);});
  document.addEventListener('visibilitychange', () => document.body.classList.toggle('page-hidden', document.hidden));

  function say(text) {
    clearTimeout(uiStatusTimer);
    // A short debounce avoids dozens of screen-reader announcements during a burst.
    uiStatusTimer = setTimeout(() => { $('actionStatus').textContent = text; }, 300);
  }
  function act(kind) {
    if(source!=='local'){say(t('connectionUnavailable'));return;}
    const now = performance.now();
    recentActions = recentActions.filter(at => now - at < 1000);
    if (recentActions.length >= CONFIG.actionsPerSecond) {
      say(t('rateAction'));
      return;
    }
    recentActions.push(now);
    if (source === 'local' && !Number.isSafeInteger(hearts + bows + 1)) return;
    if (kind === 'heart') ownHearts++; else ownBows++;
    if (source === 'local') {
      if (kind === 'heart') hearts++; else bows++;
      $('heartCount').textContent = compact(hearts); $('bowCount').textContent = compact(bows);
      crowd.setTotal(hearts + bows);
    }
    scene.action(self.id, kind);
    speech.nudge(kind, self.id);
    effects.onAction(kind,self.id);
    say(source === 'local'
      ? t('actionStatus',{hearts:compact(ownHearts),bows:compact(ownBows),count:compact(crowd.snapshot().earned)})
      : t('actionExternal'));
    // This event is NOT proof of an accepted server action. Batch, authenticate,
    // rate-limit and deduplicate it on the server before applying a snapshot.
    window.dispatchEvent(new CustomEvent('tibo:local-action', {
      detail: { type: kind, at: Date.now(), sequence: ++actionSequence, mode: source }
    }));
  }
  $('sendHeart').addEventListener('click', () => act('heart'));
  $('sendBow').addEventListener('click', () => act('bow'));
  const ambientTimer = setInterval(() => {
    if (document.hidden || reduced || scene.suspended) return;
    const visible = scene.members.filter(m => m.id !== self.id && scene.displayed.some(d => d.id === m.id));
    if (!visible.length) return;
    const person = visible[Math.floor(Math.random() * visible.length)];
    scene.action(person.id, person.ritual ? 'bow' : Math.random() < .55 ? 'heart' : 'bow');
  }, CONFIG.ambientMs);

  const chat = window.initTiboChat({CONFIG});

  const dialogs = window.initTiboDialogs({mobile});

  // Deliberate integration seam, not a backend. The local HTML does not fetch
  // data or verify that a caller is a server. Codex must bind this to a verified
  // same-scope stream. Never count a click locally AND again from its snapshot.
  window.TiboPlaza = Object.freeze({
    // This does NOT authenticate X posts. Wire only to a trusted, reviewed server feed.
    applyApprovedSignal(snapshot) { return signalStore.applyApproved(snapshot); },
    applyConfirmedSnapshot(snapshot) {
      if (!snapshot || typeof snapshot.scope !== 'string' || !snapshot.scope.trim() || snapshot.scope.length > 80) return false;
      const valid = window.TiboRitual.validTotal;
      if (!valid(snapshot.revision) || !valid(snapshot.hearts) || !valid(snapshot.bows) || !valid(snapshot.hearts + snapshot.bows)) return false;
      if (confirmedScope !== null && (snapshot.scope !== confirmedScope || snapshot.revision <= revision || snapshot.hearts < hearts || snapshot.bows < bows)) return false;
      source = 'adapter-preview'; confirmedScope = snapshot.scope; revision = snapshot.revision;
      hearts = snapshot.hearts; bows = snapshot.bows;
      $('heartCount').textContent = compact(hearts); $('bowCount').textContent = compact(bows);
      $('demoNotice').querySelector('p').dataset.i18n='readOnlyConnection';$('demoNotice').querySelector('p').textContent=t('readOnlyConnection');
      crowd.setTotal(hearts + bows);
      return true;
    }
  });
  function renderLocale(){
    self.name=t('me');scene.ownLabel=t('me');
    $('heartCount').textContent=compact(hearts);$('bowCount').textContent=compact(bows);
    $('motionLabel').textContent=t(reduced?'motionOn':'motionOff');
    updateGrowth(crowd.snapshot());chat.renderLocale();
    $('actionStatus').textContent='';$('wishText').textContent='';
    scene.render(performance.now());
  }
  const unsubscribeLocale=I.subscribe(renderLocale);renderLocale();
  $('loadingStatus').hidden=true;
  let wishIndex=0;
  $('readWish').addEventListener('click',()=>{
    const lines=I.t('speech.'+(resetDay.diagnostics().active?'confirmed':signalStore.snapshot().state));
    $('wishText').textContent=lines[wishIndex++%lines.length];
  });
  // Read-only diagnostics for reproducible UI tests, not a real server API.
  window.TiboDemo = Object.freeze({ getSnapshot: () => ({ hearts,bows,ownHearts,ownBows,reduced,source,revision,
    particleCount:scene.particles.length,memberCount:scene.members.length,messageCount:$('chatList').children.length,
    resetDay:resetDay.diagnostics(),effects:effects.diagnostics(),paintFrames:scene.paintFrames,rafActive:Boolean(scene.raf),sprite:scene.diagnostics(),crowd:crowd.snapshot(),speech:speech.diagnostics(),
    locale:I.diagnostics(),signal:signalStore.snapshot(),poses:[...scene.actions].map(([id,value])=>({id,type:value.type})),limits:CONFIG }) });
  window.addEventListener('pagehide', event => { if (event.persisted) return; unsubscribeLocale();resetDay.destroy();dialogs.destroy();chat.destroy();activity.destroy();effects.destroy();clearInterval(ambientTimer); clearTimeout(uiStatusTimer); speech.destroy(); signalUI.destroy(); signalStore.destroy(); crowd.destroy(); layoutObserver.disconnect(); scene.destroy(); });
  window.addEventListener('pageshow', event => { if (event.persisted) { document.body.classList.remove('page-hidden'); scene.resize(); scene.start(); signalUI.refresh(); } });
})().catch(error => {
  console.error('Pixel plaza failed to load:',error);
  const status=document.getElementById('actionStatus');
  if(status)status.textContent=window.TiboI18n?.t('loadError')||'Artwork failed to load.';
  const alert=document.getElementById('loadAlert');if(alert){alert.hidden=false;document.getElementById('loadErrorText').textContent=status?.textContent;}
  document.getElementById('loadingStatus').hidden=true;
  for(const id of ['sendHeart','sendBow'])document.getElementById(id).disabled=true;
});

