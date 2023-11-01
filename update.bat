docker stop v1-container
docker rm v1-container
docker stop v2-container
docker rm v2-container
docker rmi test:latest
docker build --tag test:latest .
docker run -dp 3000:1234 -e PORT=1234 --name v1-container test:latest
docker run -dp 3001:2345 -e PORT=2345 -v <path>:app/logs --name v2-container test:latest

