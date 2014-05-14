
cd $1
for file in *.hi; do    
    curl --form "game=@$file" "$2"
done