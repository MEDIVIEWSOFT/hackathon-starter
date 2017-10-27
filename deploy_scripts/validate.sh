#!/usr/bin/env bash
sleep 10

export PORT=$(aws ssm get-parameters --region ap-northeast-2 --names PORT --query Parameters[0].Value)
export PORT_=$((10#$PORT + 0))
nc -zv 127.0.0.1 $PORT_
