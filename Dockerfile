FROM ubuntu as build

RUN apt-get update -y
RUN apt-get install -y python3-pip

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

RUN pip install pyinstaller

COPY . .

RUN pyinstaller -F run.py

WORKDIR /app/dist

CMD ./run