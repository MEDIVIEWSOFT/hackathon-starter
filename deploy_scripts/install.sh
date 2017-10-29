#!/usr/bin/env bash
set -e

# update instance
yum -y update

# install CodeDeploy
export AWS_REGION=ap-northeast-2
cd /home/ec2-user
yum install -y ruby aws-cli
aws s3 cp s3://aws-codedeploy-$AWS_REGION/latest/install . --region $AWS_REGION
chmod +x ./install
./install auto
rm -f install

# add nodejs to yum
curl --silent --location https://rpm.nodesource.com/setup_6.x | sudo -E bash -
yum -y install make gcc gcc-c++ nodejs default-jre ImageMagick

# install latest stable node version with "n"
npm install -g n
n stable

export PORT=$(aws ssm get-parameters --region ap-northeast-2 --names PORT --query Parameters[0].Value)
echo "export PORT=$(aws ssm get-parameters --region ap-northeast-2 --names PORT --query Parameters[0].Value)" >> ~/.bash_profile

# install pm2 module globaly
npm install -g pm2
pm2 update
