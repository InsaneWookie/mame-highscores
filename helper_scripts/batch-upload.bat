@ECHO off

FOR %%X in ("%1\*.hi") DO (
	curl --form game=@%%X "%2"
)
