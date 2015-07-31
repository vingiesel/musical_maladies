#!/bin/bash

cp main.css dist/main.css

jspm bundle-sfx app/app dist/main.js

echo "Done!"