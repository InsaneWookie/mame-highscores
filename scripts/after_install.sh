#!/bin/bash
#do DB backup
mkdir -p /home/ec2-user/mame-backups
docker-compose -f /home/ec2-user/mame-highscores/docker-compose.aws.yml exec -T db pg_dump -U postgres mame-highscores > "/home/ec2-user/mame-backups/mame-highscores-`date +'%Y-%m-%d'`.sql"
tar -czvf "/home/ec2-user/mame-backups/mame-highscores-`date +'%Y-%m-%d'`.tar.gz" -C "/home/ec2-user/mame-backups" "mame-highscores-`date +'%Y-%m-%d'`.sql"
aws s3 cp "/home/ec2-user/mame-backups/mame-highscores-`date +'%Y-%m-%d'`.tar.gz" s3://mame-highscores-backup
rm "/home/ec2-user/mame-backups/mame-highscores-`date +'%Y-%m-%d'`.sql"
rm "/home/ec2-user/mame-backups/mame-highscores-`date +'%Y-%m-%d'`.tar.gz"

#clean up unused containers (we run out of disk space otherwise)
docker image prune

#pull container
echo $(aws ecr get-authorization-token --region ap-southeast-2 --output text --query 'authorizationData[].authorizationToken' | base64 -d | cut -d: -f2) | docker login -u AWS https://474801623431.dkr.ecr.ap-southeast-2.amazonaws.com --password-stdin
docker-compose -f /home/ec2-user/mame-highscores/docker-compose.aws.yml pull

#run migrations
docker-compose -f /home/ec2-user/mame-highscores/docker-compose.aws.yml run --rm app node ./node_modules/typeorm/cli.js migration:run