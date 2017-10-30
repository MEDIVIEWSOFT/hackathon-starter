#!/usr/bin/env bash
sleep 10

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

add_environment_vars PORT $(aws ssm get-parameters --region ap-northeast-2 --names PORT --query Parameters[0].Value)

nc -zv 127.0.0.1 $PORT
