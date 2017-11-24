# vi: ft=sh
# Starts a bash shell within a docker container that resembles a lambda env, the Deskfile is also loaded there
if [ -z "${LAMBDA_TASK_ROOT}" ]; then
  echo 'in lambda'
else
  echo 'not in lambda'
fi

docker build -t serenata-ocr .

mkdir -p $HOME/.aws
docker run -ti --rm -v $HOME/.aws:/root/.aws -v `pwd`:/var/task serenata-ocr
