FROM python:3.9.1-slim-buster

WORKDIR /home/matt/work

RUN pip3 install tornado==6.1

COPY server ./server
COPY www-built ./www-built



CMD ["python3", "server/main.py"]
