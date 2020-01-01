---
templateKey: blog-post
id: 74c35670-2c61-11ea-9e56-f168f23df4cb
title: nodejs, axios 만으로 SNI 검열 우회하기
slug: /2020/1/1/bypass-sni-with-nodejs-axios
description: ''
tags:
  - javascript
headerImage: ''
date: 2020-01-01T06:39:27.061Z
---

참고 : [How can i Disable SNI for a request in node?](https://stackoverflow.com/questions/46779881/how-can-i-disable-sni-for-a-request-in-node)

대한민국은 현재 특정 사이트가 검열하는 검열국가. 차단 방식은

- 도메인 검열을 통한 warning 페이지 리다이렉션
- https 페이지의 경우 SNI 필드 감청을 통한 패킷드랍

워닝페이지 리다이렉션은 https 프로토콜을 막지 못했고, 이를 막기 위해 패킷감청도 하고 있다.

그러나 사람들은 vpn 이나 패킷암호화 앱등을 통해서 볼거할거 다하고 있긴한데.. 나도 어느날 문득 이런 궁금증이 생겼었다.

`SNI 필드를 나도 직접 다룰 수 있다면 이 값을 제어해서 간단하게 우회할 수 있지 않을까?`

---

일단 코드는 이렇다.

`gist:extracold1209/86289c4885da09450fca5dc1cdbe2bc1#axiosCreator.ts`

코드가 굉장히 심플하다.

axios 는 httpsAgent 로 변형된 에이전트를 사용하게 되는데, 각 줄의 뜻은 아래와 같다.

- rejectUnauthorized#L6: false 로 두면 CA 로 부터 인증받지 않은 https 인증서를 사용하는 사이트도 연결을 맺을 수 있다.
- headers#L8: 별 의미는 없다. agent 를 속이기 위함. 없어도 된다.
- **options.servername#L15**: 중요한 부분은 얘인데, 이것이 SNI 검열용 필드에 속한다.
  동일 호스트, 다중 도메인을 위해 존재하는 이 서버네임을 검열용으로 사용하고 있는데, 이를 undefined 로 치환해버리면 이름을 알 수 없으므로 검열을 피할 수 있다.
  
그럼, servername 을 undefined 로 변경해버리면 문제가 있지 않을까?
동일 IP 에 다양한 호스트를 운영하는 사이트에 접속하고자 하는 경우 문제가 발생할 수도 있을지 모르겠지만, 정확히는 잘 모르겠다.

---

이렇게 만들어진 axios 를 통해 요청을 보내보면, 정상적으로 요청을 받을 수 있다.
