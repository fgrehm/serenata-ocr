# vi: ft=sh

docker build -t serenata-ocr .
mkdir -p $HOME/.aws
docker run -ti --rm -v $HOME/.aws:/root/.aws -v `pwd`:/var/task serenata-ocr
