#!/usr/bin/env bash
set -e

# update instance
yum -y update

# install CodeDeploy
export AWS_REGION=ap-northeast-2
export AWS_CODEDEPLOY_BUCKET=aws-codedeploy-ap-northeast-2
cd /home/ec2-user
yum install -y ruby aws-cli
wget https://$AWS_CODEDEPLOY_BUCKET.s3.amazonaws.com/latest/install
chmod +x ./install
./install auto
rm -f install

# add nodejs to yum
curl --silent --location https://rpm.nodesource.com/setup_8.x | sudo -E bash -
yum install -y make gcc gcc-c++ nodejs default-jre ImageMagick

# install latest stable node version with "n"
npm install -g n
n stable

# setup enviroment variables
add_environment_vars() {
  if [ ! -z $2 ]; then
    export $1=$2
    hasEnv=`grep "export $1" ~/.bash_profile | cat`
    if [ -z "$hasEnv" ]; then
      echo "export $1=$2" >> ~/.bash_profile
    else
      sed -i "/export $1=\b/c\export $1=$2" ~/.bash_profile
    fi
  fi
}

PORT_org=$(aws ssm get-parameters --region ap-northeast-2 --names PORT --query Parameters[0].Value)
PORT_=$(sed -e 's/^"//' -e 's/"$//' <<<"$PORT_org")
add_environment_vars PORT $PORT_

# install pm2 module globaly
npm install -g pm2
pm2 update
