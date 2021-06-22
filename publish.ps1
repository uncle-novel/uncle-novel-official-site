#!/bin/bash
# author:unclezs
# url:blog.unclezs.com
# 编译 上传到 page分支进行自动部署
npm run build
# Set-Location docs/.vuepress/dist
# git init
# git add -A .
# git config user.name "unclezs"
# git config user.email "unclezs@qq.com"
# git commit -a -m "$1" --branch
# git remote add origin git@github.com:unclezs/uncle-novel-official-site.git
# git branch page
# git push -f -u origin page
# Set-Location ../../../

#rsync -avz --chmod 777 ./docs/.vuepress/dist/ root@uncle-novel.unclezs.com:/www/wwwroot/app.unclezs.com/

scp -r ./docs/.vuepress/dist/* root@uncle-novel.unclezs.com:/www/wwwroot/app.unclezs.com/
# 源码上传到main

# git add -A . 
# git commit -m $args[0]
# git push -u origin main

 