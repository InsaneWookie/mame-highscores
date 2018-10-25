#!/bin/bash

docker tag mame_highscores_app:latest 474801623431.dkr.ecr.ap-southeast-2.amazonaws.com/mame-highscores/app:latest
docker push 474801623431.dkr.ecr.ap-southeast-2.amazonaws.com/mame-highscores/app:latest