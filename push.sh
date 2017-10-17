#!/bin/sh

setup_git() {
  git config --global user.email "meiran1991@gmail.com"
  git config --global user.name "mikanebu"
}

commit_website_files() {
  git checkout -b master
  git add status.csv
  git commit --message "Travis build: $TRAVIS_BUILD_NUMBER"
}

upload_files() {
  git push origin master
}

setup_git
commit_website_files
upload_files