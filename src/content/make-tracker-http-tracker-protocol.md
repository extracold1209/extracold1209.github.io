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

일단 나의 목표는 http 프로토콜 기반 트래커 개발하는 것이기 때문에, http 프로토콜 위에서 어떤 인자로 주고받아야 하는지 보도록 하겠다.

[Tracker Protocol](https://wiki.theory.org/index.php/BitTorrent_Tracker_Protocol) 에 따라 이 req, res 를 인터페이스로 작성해보면 다음과 같다.

### Request

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

파라미터에 대한 설명은 아래와 같다.

- info_hash: 토렌트 파일 고유의 해시. 이 해시와 동일한 요청들끼리 묶어서 피어간 통신을 진행한다.
- peer_id: 피어 고유의 값. info_hash 와 peer_id 는 urlencoded 20byte string 이어야 한다.
- uploaded, downloaded, left: 이 피어가 해당 해시에서 업로드한 바이트수, 다운로드한 바이트수, 다운로드 완료까지 남은 바이트수이다.
  특히 left 는 좀 중요한데, left가 0이라는 것은 완전한 파일을 가지고있는 피어라는 뜻이기 때문에, 이를 '시더' 라고 부르기 때문이다. (반대는 '리처' 라고 부른다)
- event: 이 요청이 어떤 동작을 위해 요청된 신호인지 판단하는 값이다. 값의 의미는 아래와 같다. 값이 없는경우 stopped 와 동일하게 취급한다.
  - started: 공유를 위한 첫 요청이다. 프로그램이 새로 실행되었거나, 토렌트가 신규 추가되었거나 하는 등의 요청
  - stopped: 공유를 정지했을때 트래커에 보내는 신호이다. graceful stop 신호로 트래커는 이 신호를 받으면 피어 풀에서 해당 피어를 정리한다.
  - completed: 파일을 완성한 경우 피어가 보내는 신호. 이미 100% 다운로드인 상태에서 시작된 경우 이 신호를 다시 보내지는 않는다.

### Response

```typescript
type PeerDictionary = {
    'peer id': string, // 혹은 id. request 에 인자로 no_peer_id 가 있는 경우 제공하지 않아도 된다.
    ip: string,
    port: number,
}

type TrackerResponseParams = {
    'warning message'?: string; // 경고문이 발생은 하나 연결 동작은 그대로 진행
    interval: number; // 트래커에 피어목록 재요청을 하기까지의 interval
    'min interval'?: number;
    'tracker id': string;
    complete: number; // 시더의 수
    incomplete: number; // 리처의 수
    peers: PeerDictionary[]; // 피어목록. buffer 타입 / dict 타입이 있으나 여기선 dict 타입만 언급
}

type TrackerFailResponseParams = {
    'failure reason': string; // 에러가 발생한 경우 발생 원인을 표기할 수 있는 프로퍼티
}
```

요청결과값은 위의 포맷을 기본사항으로 bencode 된 결과값을 전송하면 된다.

저 결과를 받은 토렌트 프로그램은 피어목록을 확인하고, 각 피어들끼리 토렌트 파일 조각을 요청하여 서로 공유를 시작할 것이다.

### 결론

결론적으로 트래커는 event: started 인 요청을 받으면 해당 요청을 보낸 피어의 ip, port, info_hash 및 left 등과 같은 값을 가지고 상태를 판단해,  
info_hash 로 묶인 피어목록 (swarm 이라고 한다) 을 관리하는 주체라고 볼 수 있을 것이다.

여러 요청들을 통해 피어목록에 피어를 추가하고, response 에 그 목록을 담아 전달하고, 시더가 될 수 있는 피어들을 구분해내는 역할말이다.

다음번에는 이 타입을 기준으로 nodejs + express + typescript 위에서 기본적인 트래커를 만들어 볼 예정이다.
