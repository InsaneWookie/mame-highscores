@ECHO off

FOR %%X in ("%1\*.hi") DO (
curl -F game=@%%X "%2"
)
