set /p imageId=imageId:

docker tag %imageId% ccr.ccs.tencentyun.com/ebm-server/ebm-server:latest && docker push ccr.ccs.tencentyun.com/ebm-server/ebm-server:latest

docker rmi $(docker images -q)
