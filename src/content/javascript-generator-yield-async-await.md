---
templateKey: blog-post
id: javascript-generator-yield-async-await
title: Javascript - Generator-Yield/Next & Async-Await
slug: /2019/08/27/javascript-generator-yield-async-await
description: es6 generator 와 async-await 에 대하여
tags:
  - translate
  - javascript
headerImage: ''
date: 2019-08-27T23:48:56.000Z
---


> 출처 : https://codeburst.io/javascript-generator-yield-next-async-await-e428b0cb52e4
> 문제 및 오역은 댓글로 달아주시면 처리하도록 하겠습니다.

<p align="center">. . .</p>

# Generator (ES6) -

> generator 함수는 사용자의 요구에 따라 다른 시간대에 다양한 결과 값을 제공해주며,
> 그 내부 상태 또한 관리할 수 있는 함수입니다.
> generator 함수는 `function*` 문법을 통해 사용할 수 있습니다.

제너레이터 함수와 일반 함수의 차이점은 단일 실행에서 완료까지 실행됨에 있어,  
제너레이터 함수는 **로직을 일시정지하거나, 재개할 수 있다** 는 점에서 차이가 있습니다.
로직은 그대로 실행되지만 그 트리거는 우리가 그대로 가지고 있는 셈이죠.

제너레이터 함수는 비동기를 제어하는데 좀 더 좋을 수 있어도, 동기 로직에 대해서도 좋은 문법이라고 할 수는 없습니다.

> Note: 제너레이터 함수가 실행되면 새로운 제너레이터 객체를 반환합니다.

일시정지와 재개는 `yield` & `next` 키워드를 통해 수행됩니다.
이제 이 키워드들이 무엇이고, 어떤 일을 하는지 살펴봅시다.

# Yield/Next -

> `yield` 키워드는 제너레이터 함수를 일시정지 시키고, `yield` 키워드가 들어간 표현식 우측값의 결과값을 함수를 호출한 측에게 반환합니다.
> 이 키워드는 제너레이터 버전의 `return` 키워드라고 생각하면 되겠네요.

`yield` 키워드는 엄밀히 말하면 `value` 와 `done` 속성을 가진 `IteratorResult` 오브젝트를 반환합니다. ([iterators 와 iterable 에 대해 모른다면 이걸 읽어보세요](https://codeburst.io/javascript-es6-iterables-and-iterators-de18b54f4d4))

> 한번 `yield` 표현식에 의해 일시정지되면, 제너레이터의 next() 가 호출될때까지 일시정지 상태를 유지합니다.
> 제너레이터의 next() 함수가 실행될 때마다 로직을 재개하고 [iterator](https://codeburst.io/javascript-es6-iterables-and-iterators-de18b54f4d4) 결과를 반환합니다.

음.. 이론은 이정도면 충분할 것 같네요. 이제 예제를 한번 살펴보도록 하죠

```javascript
function* UUIDGenerator() {
    let d, r;
    while(true) {
        yield 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            r = (new Date().getTime() + Math.random()*16)%16 | 0;
            d = Math.floor(d/16);
            return (c=='x' ? r : (r&0x3|0x8)).toString(16);
        });
    }
};
```

여기 보이는 UUIDGenerator 함수는 현재 시간과 랜덤숫자를 시드로 사용해 UUID 를 계산하고, 매 실행마다 새로운 UUID 를 반환하는 제너레이터 함수입니다.

위 함수를 실행시키려면 next() 함수를 호출할 수 있는 제너레이터 객체를 만들어야 합니다.

```javascript
const UUID = UUIDGenerator();
// UUID 는 제너레이터 객체입니다.
UUID.next();
// return {value: 'e35834ae-8694-4e16-8352-6d2368b3ccbf', done: false}
```

UUID.next() 는 매 UUID.next() 마다 새로운 UUID 를 반환할 것이고, done 은 함수가 무한루프이기 때문에 언제나 false 일 것입니다.

> Note: 우리는 무한루프 상태인 상태 위에서 일시정지시켰습니다.
> 제너레이터 로직 아무데서나 '일시정지 점' 을 만들 수 있다는건 굉장한 부분이죠.  
> 뿐만 아니라 외부에 값을 반환할 수도있고, 반대로 외부에서 값을 받을 수도 있습니다.

위와 같이 실제로 제너레이터를 통한 구현체가 꽤 많으며, 큰 비중으로 사용중인 라이브러리도 있습니다. [co](https://github.com/tj/co), [koa](https://koajs.com/), [redux-saga](https://github.com/redux-saga/redux-saga) 가 그 예입니다.

<p align="center">. . .</p>

# Async/Await (ES7)

일반적으로, 콜백은 `Promise` 를 사용해 처리된 데이터와 함께 비동기 작업이 반환될 때 전달 / 호출되었습니다.

> `Async`/`Await` 은 `Promise` 를 이해하고 사용하기 쉽고 편하게만들어 주는 특별한 구문입니다.

`Async` 키워드는 비동기 함수를 정의하는데 사용되고, 이는 [AsyncFunction](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AsyncFunction) 객체를 반환합니다.

`Await` 키워드는 Promise 가 resolve 혹은 reject 로 이행될 때까지 함수를 일시정지하는 역할을 합니다. 그 이후 로직을 재개시키죠. 로직이 재개된 경우, await 표현식은 `Promise` 의 resolve 된 결과값입니다.

## Key Points

1. `Await` 은 무조건 async 함수 안에서만 사용 가능하다
2. async 키워드가 붙은 함수는 언제나 Promise 를 리턴한다.
3. 여러개의 `await` 들은 언제나 한 함수안에서 위에서 아래로 차례대로 실행된다.
4. 만약 promise 가 평범하게 resolve 되었다면, `await promise` 는 그 결과를 반환한다. 에러를 던지는 reject 의 경우는 그냥 `throw` 문을 작성하면 된다.
5. async 함수는 여러개의 promise 를 동시에 기다려주진 않는다.
6. 만약 한 구문에 꼭 순서대로 진행되야할 필요도 없는 `await` 이 계속 호출되면, 성능 이슈가 생길 수 있다.

뭐 여기까진 괜찮네요. 그럼 간단한 예제를 하나 살펴보시죠.

```javascript
async function asyncFunction() {

  const promise = new Promise((resolve, reject) => {
    setTimeout(() => resolve("i am resolved!"), 1000)
  });

  const result = await promise; 
  // wait till the promise resolves (*)

  console.log(result); // "i am resolved!"
}

asyncFunction();
```

`asyncFunction` 의 실행은 `await promise;` 라인에서 일시정지되고, promise 가 처리되면 `result` 변수에 그 결과가 할당되면서 로직이 재개됩니다.  
그래서 코드는 `"i am resolved!"` 를 1초후에 보여주게 됩니다.

<p align="center">. . .</p>

# Generator 와 Async-await - 비교

1. generator/yield 와 async/await 은 둘다 '기다릴 수 있는' 비동기 로직을 작성하는데 사용됩니다. 이 말은 실제로는 비동기이지만 코드만 보면 동기처럼 보이게 해준다는걸 의미합니다.
2. generator 함수는 `yield` 단위로 실행됩니다. 즉 함수의 iterator 에 의해(`next` 함수) 한번에 하나의 yield 문 단위로 실행되고, 반면에 async-await 의 경우는 `await` 단위의 '순서' 대로 실행됩니다.
3. async/await 은 특정 케이스의 generator 를 구현하는데는 보다 쉽게 구현할 수 있습니다.
4. generator 는 언제나 {value: any, done: boolean} 을 반환합니다. 반면에 async 함수는 언제나 Promise 를 반환합니다. 이는 value 가 반환되거나 아니면 에러를 throw 한다는 뜻이 됩니다.
5. async 함수는 generator 와 promise 구현체로 분해될 수 있으며 이 점은 알아둘 만 합니다.

<p align="center">. . .</p>

> 이곳은 개인 홍보이므로 따로 번역은 하지 않았습니다.

Tips Are Appreciated! 💰 😉
My Bitcoin address: 132Ndcy1ZHs6DU4pV3q2X1GzSCdBEXX6pz
My Ethereum address: 0xc46204dfc8449Ffb0f02a9e1aD81F30D3f027010
Please consider **[entering your email](https://goo.gl/forms/MOPINWoY7q1f1APu2)** here if you’d like to be added to my email list and **follow me on [medium](https://medium.com/@ideepak.jsd) to read more article on javascript and on [github](https://github.com/dg92) to see my crazy code.** If anything is not clear or you want to point out something, please comment down below.
