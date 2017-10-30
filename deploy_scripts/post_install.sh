#!/usr/bin/env bash
set -e

# install my app
cd ~/ws2018-ticket
npm install

# setup enviroment variables
add_environment_vars() {
  if [ ! -z $2 ]; then
    tmp=$2
    tmp2=$(sed -e 's/^"//' -e 's/"$//' <<< "$tmp")
    export $1=$tmp2
  
    hasEnv=`grep "export $1" ~/.bash_profile | cat`
    if [ -z "$hasEnv" ]; then
      echo "export $1=$tmp2" >> ~/.bash_profile
    else
      sed -i "/export $1=\b/c\export $1=$tmp2" ~/.bash_profile
    fi
  fi
}

add_environment_vars MONGODB_URI $(aws ssm get-parameters --region ap-northeast-2 --names MONGODB_URI --query Parameters[0].Value)
add_environment_vars MONGOLAB_URI $(aws ssm get-parameters --region ap-northeast-2 --names MONGOLAB_URI --query Parameters[0].Value)
add_environment_vars SESSION_SECRET $(aws ssm get-parameters --region ap-northeast-2 --names SESSION_SECRET --query Parameters[0].Value --with-decryption)

add_environment_vars GOOGLE_ID $(aws ssm get-parameters --region ap-northeast-2 --names GOOGLE_ID --query Parameters[0].Value)
add_environment_vars GOOGLE_SECRET $(aws ssm get-parameters --region ap-northeast-2 --names GOOGLE_SECRET --query Parameters[0].Value)
add_environment_vars LINKEDIN_ID $(aws ssm get-parameters --region ap-northeast-2 --names LINKEDIN_ID --query Parameters[0].Value)
add_environment_vars LINKEDIN_SECRET $(aws ssm get-parameters --region ap-northeast-2 --names LINKEDIN_SECRET --query Parameters[0].Value)
add_environment_vars LINKEDIN_CALLBACK_URL $(aws ssm get-parameters --region ap-northeast-2 --names LINKEDIN_CALLBACK_URL --query Parameters[0].Value)
add_environment_vars MAILGUN_ADDR $(aws ssm get-parameters --region ap-northeast-2 --names MAILGUN_ADDR --query Parameters[0].Value)
add_environment_vars MAILGUN_PASSWORD $(aws ssm get-parameters --region ap-northeast-2 --names MAILGUN_PASSWORD --query Parameters[0].Value)

add_environment_vars IMP_AMOUNT $(aws ssm get-parameters --region ap-northeast-2 --names IMP_AMOUNT --query Parameters[0].Value)
add_environment_vars IMP_KEY $(aws ssm get-parameters --region ap-northeast-2 --names IMP_KEY --query Parameters[0].Value)
add_environment_vars IMP_SECRET $(aws ssm get-parameters --region ap-northeast-2 --names IMP_SECRET --query Parameters[0].Value)

PORT_org=$(aws ssm get-parameters --region ap-northeast-2 --names PORT --query Parameters[0].Value)
PORT_=$(sed -e 's/^"//' -e 's/"$//' <<<"$PORT_org")
add_environment_vars PORT $PORT_

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
