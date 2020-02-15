---
templateKey: blog-post
id: b45151f0-4fb3-11ea-bbef-4df011a1f7af
title: "[트래커를 만들어보자] 2. HTTP 트래커 정의하기"
slug: /2020/2/15/make-tracker-http-tracker-protocol
description: '비트토렌트 트래커 만들기 2화'
tags:
  - uncategorized
  - javascript
headerImage: '/images/bittorrent.png'
date: 2020-02-15T05:26:23.114Z
---

[토렌트란 무엇인가](/2020/2/11/make-tracker-what-is-torrent) 글에서, 토렌트에 대한 아주 기본적인 내용을 다뤘었다.

그럼 일단 토렌트가 어떻게 동작하는지는 알겠고, 어떤식으로 통신이 이루어지는지는 알겠다.  
그래서 개발을 하려면 어떤 구조로 서버를 만들어놔야 토렌트 프로그램들이 접속할 수 있고, 정보를 가져가서 서로 통신할 수 있단 말인가?

> 글을 작성하는데 아래의 글을 참고하였다. (wiki.theory.org)
> [BitTorrentSpecification](https://wiki.theory.org/index.php/BitTorrentSpecification#Tracker_HTTP.2FHTTPS_Protocol)
> [BitTorrent Tracker Protocol](https://wiki.theory.org/index.php/BitTorrent_Tracker_Protocol)

### 비트토렌트 Request, Response 포맷

먼저 비트토렌트(이하 토렌트) 프로토콜은 [bencode](https://en.wikipedia.org/wiki/Bencode) 라는 포맷을 사용한다.
자바스크립트를 기준으로 생각해본다면, Buffer, number, list, object 구조를 지원하는 포맷이다.

뭐 특정 알고리즘을 이용해 변환하는 식이 있지만 npm 에 이미 잘 되어있다. 간단한 코드 예제로 보자면

```javascript
const bencode = require('bencode')
const data = {
  string: 'Hello World',
  integer: 12345,
  dict: {
    key: 'This is a string within a dictionary'
  },
  list: [ 1, 2, 3, 4, 'string', 5, {} ]
}
 
const result = bencode.encode( data );
console.log('encode result: ', result);

const decodeResult = bencode.decode(result);
console.log('decode result: ', decodeResult);
```

결과는 아래와 같다.

> encode result:  <Buffer 64 34 3a 64 69 63 74 64 33 3a 6b 65 79 33 36 3a 54 68 69 73 20 69 73 20 61 20 73 74 72 69 6e 67 20 77 69 74 68 69 6e 20 61 20 64 69 63 74 69 6f 6e 61 ... >
> decode result:  { dict:
>    { key:
>       <Buffer 54 68 69 73 20 69 73 20 61 20 73 74 72 69 6e 67 20 77 69 74 68 69 6e 20 61 20 64 69 63 74 69 6f 6e 61 72 79> },
>   integer: 12345,
>   list: [ 1, 2, 3, 4, <Buffer 73 74 72 69 6e 67>, 5, {} ],
>   string: <Buffer 48 65 6c 6c 6f 20 57 6f 72 6c 64> }

encode 된 버퍼를 문자열로 변환하면 아래와 같다.

> d4:dictd3:key36:This is a string within a dictionarye7:integeri12345e4:listli1ei2ei3ei4e6:stringi5edee6:string11:Hello Worlde

그냥 이런 포맷으로 송수신되어야 한다는 것 정도만 알고 넘어가면 될 것 같다.
내가 클라이언트에게 정보를 전달할때는 이 포맷으로 만든다음에 전달해야 한다는것 정도만..

### HTTP Tracker Request, Response 규약

비트토렌트의 기본 프로토콜은 http 통신 프로토콜 기반이다. ws, udp, tcp 가 더 있고, 주로 udp 가 사용된다고 알고있다.  
(통신상 부담이 적기때문)

일단 나의 목표는 http 프로토콜 기반 트래커는 개발하는 것이기 때문에, http 프로토콜 위에서 어떤 인자로 주고받아야 하는지 보도록 하겠다.

[Tracker Protocol](https://wiki.theory.org/index.php/BitTorrent_Tracker_Protocol) 에 따라 이 req, res 를 인터페이스로 작성해보면 다음과 같다.

```typescript
enum PeerEvent {
    started = 'started',
    stopped = 'stopped',
    completed = 'completed',
}

type TrackerRequestParams = {
    info_hash: string;
    peer_id: string;
    port: string; // number.
    uploaded: string; // number. amount of uploaded byte since 'started' peer event
    downloaded: string; // number. amount of downloaded byte since 'started' peer event
    left: string; // number. left bytes that peer will be 100% downloaded
    event: PeerEvent
    ip?: string;
    numwant?: string; // number. amount of peers that client want to get
    
    key?: string; // peer identification
    trackerid?: string; // previous tracker id
    
    // extension params
    compact: '0' | '1';
    // no_peer_id?: '0' | '1';
}
```

파라미터에 대한 설명은 아래와 같다. (당연한건 넘어갔음)

- info_hash: 토렌트 파일 고유의 해시. 이 해시와 동일한 요청들끼리 묶어서 피어간 통신을 진행한다.
- peer_id: 피어 고유의 값. info_hash 와 peer_id 는 urlencoded 20byte string 이어야 한다.
- uploaded, downloaded, left: 이 피어가 해당 해시에서 업로드한 바이트수, 다운로드한 바이트수, 다운로드 완료까지 남은 바이트수이다.
  특히 left 는 좀 중요한데, left가 0이라는 것은 완전한 파일을 가지고있는 피어라는 뜻이기 때문에, 이를 '시더' 라고 부르기 때문이다. (반대는 '리처' 라고 부른다)
