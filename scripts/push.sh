#!/bin/sh

setup_git() {
  git config --global user.email "admin-login@datopian.com"
  git config --global user.name "datopianbot"
}

commit_website_files() {
  git add status.csv
  git commit --message "Travis build: $TRAVIS_BUILD_NUMBER"
}

upload_files() {
  git push --force https://${GH_TOKEN}@github.com/datahq/frontend-functional-tests.git > /dev/null 2>&1
}

setup_git
commit_website_files
upload_files