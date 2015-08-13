#!/bin/bash

cd ./app/styles/

compass compile && echo "Successfully compiled sass"

cd ../../

cp main.css dist/main.css

jspm bundle-sfx app/app dist/main.js

echo "Done!"