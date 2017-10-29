#!/usr/bin/env bash
sleep 10

port_=$(aws ssm get-parameters --region ap-northeast-2 --names PORT --query Parameters[0].Value)
port=$(sed -e 's/^"//' -e 's/"$//' <<<"$port_")

nc -zv 127.0.0.1 $port
