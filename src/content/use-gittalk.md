---
templateKey: blog-post
id: fa1f5110-2bdb-11ea-93f4-1b7c262eedc0
title: github 블로그에 gitalk 로 코멘트 기능 적용하기
slug: /2019/11/31/use-gittalk
description: ''
tags:
  - blog
  - library
headerImage: ''
date: 2019-12-31T14:43:58.235Z
---

게시판 기반 서비스에는 웬만해선 댓글기능이 있는게 좋다.

업무로 운영하는 Docs 에서는 해당 기능 제공을 위해 [disqus](https://disqus.com/) 를 사용한다.
disqus 는 상용서비스지만 무료로도 충분히 사용할만 하다.

disqus 는 댓글 대시보드도 제공하고, 댓글에 대해 관리자의 승인이 있기 전까지는 안보여주거나 할수도 있다.

기능이 강력해서 좋긴한데.. 기본적인 기능만 사용하기엔 오히려 불편한 점도 많았다.  
일례로, 댓글을 관리자가 일정시간 허용을 안하면.. 댓글이 삭제된다.

뭐 사실 주구장창 얘기는 했는데 그냥 블로그 템플릿에서 gitalk 라는 라이브러리를 쓰길래 그대로 썼는데, 
생각보다 깔끔하고 동작방식도 편해서 사용방법을 적어둔다.

---

# gitalk 란?

![gitalk_1](/images/gitalk_1.png)

preact 베이스, 데이터저장은 github issue 를 활용한 라이브러리이다.

스타가 3.8k 나 있는거보면 오지게 유명한 라이브러리가 아닐까? 싶었는데,  
검색해도 뭐가 안나온다.. 이슈가 거의다 중국어인거 보니까 중국산(?) 라이브러리 인 것 같다.

그런데, github issue 베이스 데이터저장이 대체 뭔가 싶다.

지금 이 블로그 보면 아래 댓글란이 이렇게 생겨먹었다.

![gitalk_2](/images/gitalk_2.png)

이게 gitalk 인데, 이 데이터들은 실제로는 github.io 블로그에 이슈로서 등록되어있다.

![gitalk_3](/images/gitalk_3.png)

이렇게 말이다. 이 태그를 id 로, 이슈의 코멘트를 댓글로서 활용하고 있다.  
관리및 댓글 확인을 github 기능을 통해 수행하니 엄청 편한 것 같다.

# 적용방법

## OAuth Apps 생성하기

github 의 이슈를 활용하기 위해서 gitalk 는 OAuth 기능을 사용해야한다.

- [링크 - Github OAuth Application 생성](https://github.com/settings/applications/new) 혹은 깃헙 세팅 -> Developer Settings -> OAuth Apps -> New OAuth App 을 클릭하자

![gitalk_4](/images/gitalk_4.png)

- 위와 같이 세팅하기
- 생성하기

생성한 후 OAuth Apps 에 생성된 개체를 클릭하면, `Client ID`, `Client Secret` 이 만들어져 있다. 이걸 사용해야 한다.

## gitalk 적용하기

[참고 - gitalk README](https://github.com/gitalk/gitalk#usage)

아까 만들어진 ID, Secret 값을 넣으면 된다.
여기서 입력한 id (기본값은 location.path) 에 따라 이슈에 label 이 달리고, 해당 페이지에서의 gitalk 는 그 이슈의 코멘트를 읽어와서 보여주는 형식이라고 보면 된다.

매 페이지 별로 주소가 다르기 때문에 그에 맞는 다른 이슈에서 코멘트를 읽어온다.
만약 이슈가 없다면 자동으로 이슈를 생성해주기도 한다. (단, admin 으로 등록된 유저가 로그인하여 해당 페이지를 확인할 때 생성됨)

---

간단한 것 같으면서도 관리도 쉬운 gitalk.  
굳이 github 블로그가 아니어도 도입하기 쉬워보이니까 간단한 코멘트 기능 구현은 이 라이브러리로 만들어도 좋을 것 같다.

끗-
