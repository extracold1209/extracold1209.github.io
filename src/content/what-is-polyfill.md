---
templateKey: blog-post
id: 436f3350-2c48-11ea-ac68-8f400ec99ae8
title: "[javascript] polyfill 이란?"
slug: /2020/1/1/what-is-polyfill
description: ''
tags:
  - javascript
headerImage: '/images/polyfill_1.jpg'
date: 2020-01-01T03:39:06.874Z
---

![polyfill_1](/images/polyfill_1.jpg)
~~폴리- 필-~~

> 폴리필(polyfill)은 웹 개발에서 기능을 지원하지 않는 웹 브라우저 상의 기능을 구현하는 코드를 뜻한다.
> 기능을 지원하지 않는 웹 브라우저에서 원하는 기능을 구현할 수 있으나, 폴리필 플러그인 로드 때문에 시간과 트래픽이 늘어나고, 브라우저별 기능을 추가하는 것 때문에 코드가 매우 길어지고, 성능이 많이 저하된다는 단점이 있다.
> \- [위키백과](https://ko.wikipedia.org/wiki/%ED%8F%B4%EB%A6%AC%ED%95%84_(%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%98%EB%B0%8D))

---

## 자바스크립트는 코드의 변형이 가능하다.

먼저, 자바스크립트는 프로토타입 기반 언어이다.  
그리고 이 프로토타입의 오염이 자유롭다.

오염의 자유로움이란, 기존 자바스크립트가 가지고있는 어떤 객체들도 기본적으로는 변형이 가능하다는 것이다.

예를들어보자.

자바스크립트를 접해본 사람이라면 console.log 함수를 모르는 사람은 없을 것이다.
하지만 누군가가 브라우저에 아래와 같이 조작해두었다고 하자.

![polyfill_2](/images/polyfill_2.jpg)

물론 개발 담당자가 이런짓을 하기엔 그냥 해킹코드를 넣고 말겠지만(..) 아무튼 중요한 것은 이런 행위가 가능하다는 것이다.

이런 글도 참고해볼 수 있겠다. [What is Prototype Pollution?](https://codeburst.io/what-is-prototype-pollution-49482fc4b638)

---

## 그래서 폴리필이란?

> 그래서 이거랑 polyfill 이랑 무슨 상관인가?

폴리필이란 브라우저의 호환성을 위해, 특정 기능을 지원하지 않는 브라우저에 최대한 동일한 동작이 가능하도록 좋은 의미의 '오염' 을 시키는 행위이다.  
예를들어, Array.prototype.includes 라는 함수가 있다.

참 많이 쓸 것 같기도 하고.. 이름만 들어도 유용해보이는 이 친구는 IE 에서 지원을 안한다.

[Array.prototype.includes() MDN](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/includes)

![polyfill_3](/images/polyfill_3.jpg)
Array.prototype.includes 는 IE 에서 사용불가능이다.

![polyfill_4](/images/polyfill_4.png)
실제로 보면 IE 에서는 해당 함수가 존재하지 않는다.

---

그럼 폴리필을 적용해보자. includes polyfill 은 mdn 의 코드를 따랐다.

![polyfill_5](/images/polyfill_5.png)

잘된다.

---

## 결론

폴리필은 특정 기능을 지원하지 않는 브라우저에서도 동일한 기능을 수행가능하도록 만들기 위해 프로토타입을 변형하는 행위이다.

개같은 IE 때문에 주로 사용하며, 모던 자바스크립트 개발환경에서는 [babel](https://babeljs.io/docs/en/6.26.3/babel-polyfill) 이 이 기능도 포함하여 수행하기 때문에 염두만 해두고 있어도 된다.
