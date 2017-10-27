#!/usr/bin/env bash
set -e

# update instance
yum -y update

# install g++ make
yum install -y gcc-c++ make
yum install -y golang

# add nodejs to yum
curl --silent --location https://rpm.nodesource.com/setup_6.x | sudo -E bash -
yum -y install nodejs

# install ssm-env
go get -u "github.com/remind101/ssm-env"
export PATH=$PATH:${GOPATH//://bin:}/bin

# install pm2 module globaly
npm install -g pm2
pm2 update
