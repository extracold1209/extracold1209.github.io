---
templateKey: blog-post
id: 68343120-5c88-11ea-9f1f-29893479fda3
title: "[트래커를 만들어보자] 3. Express + Typescript 로 트래커 코드 작성하기 (2)"
slug: /2020/3/2/make-tracker-typescript-express-tracker-2
description: '비트토렌트 트래커 만들기 4화'
tags:
  - uncategorized
  - javascript
headerImage: '/images/bittorrent.png'
date: 2020-03-02T13:19:12.177Z
---

[트래커 기본 코드 작성하기](/2020/2/15/make-tracker-typescript-express-tracker) 에서, 기본적인 Hello world 코드 위에, BEncode 로 변환된 결과를 토렌트 프로그램으로 보내 커스텀에러를 발생시켜 보았다.

이전 글에서는 그냥 통신이 되는지만 확인했고, 정상적으로 되는것을 확인했다. 그렇다면, 동일한 리퀘스트를 다시 발생시켜서 어떤 쿼리가 들어왔고, 그에 맞춰서 정상적인 결과를 보내보도록 하겠다.

먼저 이번에는 VSCode 의 디버그 모드로 프로젝트를 실행시키고, `/torrent` 경로의 초입점에 브레이크 포인트를 걸어 쿼리를 확인하도록 하였다.

> [Visual Studio Code Debug](https://code.visualstudio.com/docs/editor/debugging) 는 이쪽 글을,
> 설정은 [TS-node debug launch.json gist](https://gist.github.com/cecilemuller/2963155d0f249c1544289b78a1cdd695) 를 참고하면 된다.
> 개인적으로 개발시에는 웹스톰을 애용하기 때문에 더욱 상세히는 생략하도록 하겠다.

## 리퀘스트 확인

![announce_request](/images/torrent_announce_request.png)

다시, [BittorrentProtocol Specification](https://wiki.theory.org/index.php/BitTorrentSpecification#Tracker_HTTP.2FHTTPS_Protocol) 을 확인해보자.  

`Tracker Request Parameters` 파트를 살펴보면 얼추 동일하다는 것을 알 수 있다.

하나씩 확인해보도록 하자.

---
`compact: "1"`

토렌트 클라이언트가 compact mode 를 지원한다는 것이다.  
byte 로 이루어진 response 로 트래커의 부담을 줄일 수 있다. 그러나 이 글에서는 가장 베이직한 Request / Response 만을 다룰 것이다.

---
`downloaded: "0"`

이 토렌트 클라이언트는 리퀘스트를 오픈한 이래(event: started)로 다운로드된 바이트 수가 없다는 것이다.

---
`event: "started"`

이 값은 started, stopped, completed 중 하나여야 한다. 그리고 최초 리퀘스트는 started 로 시작하여야 한다.  
값이 없는 경우도 있는데, 이 경우 일반적인 데이터를 제공해주면 되는 것 같다. (정확히 모르겠음)

---
`info_hash: "..?"`

중요한 값이다. 해당 토렌트의 고유값이 되겠다. 동일한 정보를 가진 토렌트 파일 혹은 마그넷은 이 info_hash 가 동일하고, 이에따라 스웜이 정해진다.

URLEncoded 20bytes SHA1 값이다.  
이 값을 어떻게 저장하느냐는 알아서 할 것인데, 이 글에서는 decode 해서 저장하도록 하겠다.

정말 짜증나는건 그냥 숫자와 URLEncoded character 가 섞여 있다는 것이다. 그래서 기본제공되는 함수 한번만에는 쉽게 해결할 수 없다.

---
`key: "24597cb2"`

peer_id 가 아닌 다른 고유값으로, optional 이다. 이 값을 통해 트래커가 데이터 제공을 판단할 수도 있다.

---
`left: "0"`

다운로드 완료까지 남은 데이터의 byte 수이다. 이 요청은 다운로드 받을 것이 없으므로 이 피어는 시더로서 등록될 것이다.

---
`numwant: "80"`

이 리퀘스트가 한번에 몇개의 피어목록을 원하는지를 표기한 값이다. 일반적으로는 값이 없을때 50을 제공한다. 이건 트래커 맘이다.

---
`peer_id: "-TR2940-tcrmw3mch8gg"`

이 값은 피어 고유값이다. 앞의 두자리수는 토렌트 클라이언트를 나타내는데, TR 은 MacOS 의 Transmission 이라는 프로그램이다. [peer_id](https://wiki.theory.org/index.php/BitTorrentSpecification#peer_id) 를 참고.

이 값 또한 `info_hash` 와 동일하게 인코딩된 값이다.  

---
`port: "51413"`

포트값이다. 설명할 필요도 없다.

---
`supportcrypto: "1"`

특정 암호화된 모드를 지원하는 것으로 보이나, basic specification 은 아니므로 일단 넘어가도록 하겠다.

---
`uploaded: "0"`

해당 토렌트 클라이언트가 `event: started` 리퀘스트를 보낸 이후로 몇 바이트나 공유를 했는지 보여주는 지표이다.

downloaded 와 함께 트래커가 특정피어의 업다운비율(ratio) 를 관리할 때 사용할 수 있겠다.

---

> 근데 뭔가 이상하다. IP 가 없다

IP 가 옵션이다. 이는 request 에서 직접 찾아내야한다.. 없으면 이 피어의 정보를 알 수 없으므로 다른 피어들에게 정보를 줘봤자 피어끼리 통신을 못한다.



///////

IP 뽑는거 / info_hash decode
