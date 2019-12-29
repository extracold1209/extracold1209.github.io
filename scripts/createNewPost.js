const uuid = require('uuid/v1');
const fs = require('fs');
const path = require('path');
const dayjs = require('dayjs');

const [postName, postFileName] = process.argv.slice(2);

if (!postName) {
  console.log('postname must be present');
}

const now = dayjs();
const targetPath = path.join(__dirname, '..', 'src', 'content', `${postFileName || postName}.md`);
fs.writeFileSync(targetPath, `---
templateKey: blog-post
id: ${uuid()}
title: ${postName}
slug: /${now.year()}/${now.month()}/${now.date()}/${postFileName || postName}
description: ''
tags:
  - uncategorized
headerImage: ''
date: ${now.toISOString()}
---
`, 'utf8');

console.log(targetPath, 'write done');
