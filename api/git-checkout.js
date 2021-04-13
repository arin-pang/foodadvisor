const git = require('isomorphic-git');
const fs = require('fs-extra');
const http = require('isomorphic-git/http/node');

const checkout = async () => {

  await git.clone({
    fs,
    http,
    dir: '/usr/src/food-advisor',
    //corsProxy: 'https://cors.isomorphic-git.org',
    ref: process.env.CUSTOM_WEBHOOK_REPO_REF,
    remote: process.env.CUSTOM_WEBHOOK_REPO_REMOTE,
    url: process.env.CUSTOM_WEBHOOK_REPO_URL,
    singleBranch: true,
    depth: 1
  })
  console.log('done');

}

checkout();
