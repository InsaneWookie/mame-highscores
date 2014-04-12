
cd $1
for file in *.hi; do    
    curl --form "game=@$file" --form "version=$2" "$3"
done