#!/usr/bin/env bash
set -e

# install my app
cd ~/ws2018-ticket
npm install

export MONGODB_URI=$(aws ssm get-parameters --region ap-northeast-2 --names MONGODB_URI --query Parameters[0].Value)
export MONGOLAB_URI=$(aws ssm get-parameters --region ap-northeast-2 --names MONGOLAB_URI --query Parameters[0].Value)
export GOOGLE_ID=$(aws ssm get-parameters --region ap-northeast-2 --names GOOGLE_ID --query Parameters[0].Value)
export GOOGLE_SECRET=$(aws ssm get-parameters --region ap-northeast-2 --names GOOGLE_SECRET --query Parameters[0].Value)
export LINKEDIN_ID=$(aws ssm get-parameters --region ap-northeast-2 --names LINKEDIN_ID--query Parameters[0].Value)
export LINKEDIN_SECRET=$(aws ssm get-parameters --region ap-northeast-2 --names LINKEDIN_SECRET --query Parameters[0].Value)
export LINKEDIN_CALLBACK_URL=$(aws ssm get-parameters --region ap-northeast-2 --names LINKEDIN_CALLBACK_URL --query Parameters[0].Value)
export MAILGUN_ADDR=$(aws ssm get-parameters --region ap-northeast-2 --names MAILGUN_ADDR --query Parameters[0].Value)
export MAILGUN_PASSWORD=$(aws ssm get-parameters --region ap-northeast-2 --names MAILGUN_PASSWORD --query Parameters[0].Value)
export IMP_AMOUNT=$(aws ssm get-parameters --region ap-northeast-2 --names IMP_AMOUNT --query Parameters[0].Value)
export IMP_KEY=$(aws ssm get-parameters --region ap-northeast-2 --names IMP_KEY --query Parameters[0].Value)
export IMP_SECRET=$(aws ssm get-parameters --region ap-northeast-2 --names IMP_SECRET --query Parameters[0].Value)

echo "export MONGODB_URI=$(aws ssm get-parameters --region ap-northeast-2 --names MONGODB_URI --query Parameters[0].Value)" >> ~/.bash_profile
echo "export MONGOLAB_URI=$(aws ssm get-parameters --region ap-northeast-2 --names MONGOLAB_URI --query Parameters[0].Value)" >> ~/.bash_profile
echo "export GOOGLE_ID=$(aws ssm get-parameters --region ap-northeast-2 --names GOOGLE_ID --query Parameters[0].Value)" >> ~/.bash_profile
echo "export GOOGLE_SECRET=$(aws ssm get-parameters --region ap-northeast-2 --names GOOGLE_SECRET --query Parameters[0].Value)" >> ~/.bash_profile
echo "export LINKEDIN_ID=$(aws ssm get-parameters --region ap-northeast-2 --names LINKEDIN_ID--query Parameters[0].Value)" >> ~/.bash_profile
echo "export LINKEDIN_SECRET=$(aws ssm get-parameters --region ap-northeast-2 --names LINKEDIN_SECRET --query Parameters[0].Value)" >> ~/.bash_profile
echo "export LINKEDIN_CALLBACK_URL=$(aws ssm get-parameters --region ap-northeast-2 --names LINKEDIN_CALLBACK_URL --query Parameters[0].Value)" >> ~/.bash_profile
echo "export MAILGUN_ADDR=$(aws ssm get-parameters --region ap-northeast-2 --names MAILGUN_ADDR --query Parameters[0].Value)" >> ~/.bash_profile
echo "export MAILGUN_PASSWORD=$(aws ssm get-parameters --region ap-northeast-2 --names MAILGUN_PASSWORD --query Parameters[0].Value)" >> ~/.bash_profile
echo "export IMP_AMOUNT=$(aws ssm get-parameters --region ap-northeast-2 --names IMP_AMOUNT --query Parameters[0].Value)" >> ~/.bash_profile
echo "export IMP_KEY=$(aws ssm get-parameters --region ap-northeast-2 --names IMP_KEY --query Parameters[0].Value)" >> ~/.bash_profile
echo "export IMP_SECRET=$(aws ssm get-parameters --region ap-northeast-2 --names IMP_SECRET --query Parameters[0].Value)" >> ~/.bash_profile

export PORT=$(aws ssm get-parameters --region ap-northeast-2 --names PORT --query Parameters[0].Value)
echo "export PORT=$(aws ssm get-parameters --region ap-northeast-2 --names PORT --query Parameters[0].Value)" >> ~/.bash_profile

# setup NODE_ENV
if [ ! -z "$DEPLOYMENT_GROUP_NAME" ]; then
    export NODE_ENV=$DEPLOYMENT_GROUP_NAME

    hasEnv=`grep "export NODE_ENV" ~/.bash_profile | cat`
    if [ -z "$hasEnv" ]; then
        echo "export NODE_ENV=$DEPLOYMENT_GROUP_NAME" >> ~/.bash_profile
    else
        sed -i "/export NODE_ENV=\b/c\export NODE_ENV=$DEPLOYMENT_GROUP_NAME" ~/.bash_profile
    fi
fi

# add node to startup
hasRc=`grep "su -l $USER" /etc/rc.d/rc.local | cat`
if [ -z "$hasRc" ]; then
    sudo sh -c "echo 'su -l $USER -c \"cd ~/ws2018-ticket;sh ./run.sh\"' >> /etc/rc.d/rc.local"
fi
