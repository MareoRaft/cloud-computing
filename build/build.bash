cd /Users/Matthew/programming/javascript/CloudComputing/ &&

# babel www/scripts6/main.js > www/scripts/main.js && # no babeling at this point

node build/r.js -o mainConfigFile=www/scripts/main.js baseUrl=www/scripts name=main out=www/scripts/main-optimized.min.js generateSourceMap=true preserveLicenseComments=false optimize=uglify2 &&

echo 'done'
