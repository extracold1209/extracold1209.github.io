---
templateKey: blog-post
id: 49a26100-5b93-11ea-9a70-5515d14e1c2c
title: "[트래커를 만들어보자] 3. Express + Typescript 로 트래커 코드 작성하기 (1)"
slug: /2020/2/15/make-tracker-typescript-express-tracker
description: '비트토렌트 트래커 만들기 3화'
tags:
  - uncategorized
  - javascript
headerImage: '/images/bittorrent.png'
date: 2020-03-01T08:04:34.190Z
---

[HTTP 트래커 정의하기](/2020/2/15/make-tracker-http-tracker-protocol) 에서, HTTP 프로토콜 기반의 트래커에서는 어떤 기능을 정의해야하는지 간단하게 살펴보았다.

그럼 이제 이 HTTP based Bittorrent Request/Response Protocol 을 기반으로 들어오는 정보를 관리하고, 다른 피어가 데이터를 요청할 때 필요한 데이터를 건내줄 수 있도록 서버를 구축해볼 예정이다.  
이 글에서는 피어의 접속이 가능한지 여부를 확인하고, 강제로 failed response 를 내보내서 request/response 의 가능여부만 확인할 것이다. 

> 이 글에서는 [nodejs](https://nodejs.org/dist/latest-v12.x/docs/api/), [express](https://expressjs.com/ko/) 그리고 [typescript](https://www.typescriptlang.org) 에 대해서는 설명하지 않는다.
> 위의 기술스택 및 기본적인 http 웹 통신에 대해서 알지 못하면 글을 읽어도 딱히 써먹지 못할것 같다.
 
트래커 오브젝트는 아래와 같은 객체 구조를 기반으로 개발하기로 하였다.

![structure](/images/torrent_structure.png)

대략의 설명은 아래와 같다.

- 트래커가 가지는 값은 아래와 같다
  - 트래커 고유 ID
  - 피어가 새 정보를 재요청하기까지의 인터벌
  - 다수의 토렌트-피어목록 (스웜)
- 토렌트 오브젝트는 아래와 같은 역할을 한다.
  - infoHash 값 하나마다 토렌트 오브젝트를 가진다.
  - 해당 infoHash 에 붙어있는 피어목록을 가지고, 단순히 이 값을 제어하는 역할을 한다.
- 피어 오브젝트는 아래와 같은 역할을 한다.
  - 피어오브젝트는 토렌트 오브젝트에 종속된다. 즉, 다른 토렌트 오브젝트에 동일한 PeerID 가 있을 수 있다.
  - 현재 피어의 상태와 접속에 필요한 ip:port 정보를 가진다.

---

그럼, 먼저 기본적인 프로젝트를 만들어야 하므로 뼈대를 구현한다.  
개인적으로 yarn 패키지매니저를 사용하고 있기 때문에 이를 기준으로 스크립트를 작성하겠다.

```bash
$ mkdir torrent_test
$ cd torrent_test
$ yarn init -y
```

위만 입력하면 package.json 의 기본구조만 만들어진다.

```json
{
  "name": "torrent_test",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT"
}
```

express + typescript 기반의 프로젝트이기 때문에 필요한 라이브러리를 전부 설치하면 된다.

```bash
$ yarn add -D lodash @types/lodash typescript express @types/express bencode @types/bencode @types/node ts-node
```

그리고 타입스크립트의 tsconfig 기본설정을 위해 아래의 명령어까지 입력하면 필요한 기본설정은 거의 끝이라고 보면 되겠다.

```bash
$ npx typescript --init
``` 

테스트를 위해 express hello world 코드 작성

```typescript
// index.ts

import express from 'express';
import { AddressInfo } from 'net';

const app = express();

app.get('/', (req, res) => {
    res.send('hello world!');
});

const server = app.listen(8080, () => {
    const { address, port } = server.address() as AddressInfo;
    console.log(`server now listening. ${address}:${port}`);
});

```

![helloworld](/images/torrent_helloworld.png)

잘나온다.

먼저 토렌트 피어가 이 트래커로 접속할 수 있는지 response 는 아래와 같이 작성할 것이다.  
결과값은 bencode 형태여야 하며, 구조는

```typescript
type TrackerFailResponseParams = {
    'failure reason': string;
}
```
형태가 될 것이다. 'failure reason' 키가 존재하면 human-readable error message 를 전송할 수 있다.  
자세한 프로토콜은 [여기](https://wiki.theory.org/index.php/BitTorrent_Tracker_Protocol) 에서 재확인할 수 있다.

이번에는 `/torrent` 라는 포인트로 로직을 작성한다.

```typescript
import bencode from 'bencode';

// ...
app.get('/torrent', (req, res) => {
    res.send(bencode.encode({
        'failure reason': 'hello world',
    }));
});
```

개인적으로는 다른 노트북이나 데스크탑이 있어서 이쪽으로 접속을 시도하였다.  
(어떤 토렌트파일도 상관없이 트래커 추가기능을 통해 접속을 시도만 하면 된다. 왜냐면 결과는 무조건 에러이기 때문이다.)

![torrent_failure](/images/torrent_failure.png)

잘되는것 같다.

만약 외부에서 접속이 안되는 경우 공유기의 포트포워딩 및 방화벽 인/아웃바운딩 규칙설정에 대해서도 확인해야 한다.

일단 기본적으로 통신이 되는 것은 확인하였으니, 다음번에는 요청의 실제 request params 를 확인하고, 이를 통해 데이터를 제어하는 로직을 작성해보겠다.
