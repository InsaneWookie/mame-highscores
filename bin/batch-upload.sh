
#SCORE_PATH=hi/*
#SCORE_PATH=$2
#URL="$2"
#echo $SCORE_PATH
#echo $URL
cd $1
for file in *.hi; do    
    curl -F "game=@$file" "$2"
done