FROM amd64/ubuntu:18.04

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV LC_ALL=C.UTF-8
ENV LANG=C.UTF-8

# install some dependencies
RUN apt-get update && apt-get install -y python3 python3-pip bash curl

RUN pip3 install --upgrade pip

WORKDIR /usr/src/app

COPY . .
RUN pip3 install -r requirements.txt

RUN curl -O https://mafft.cbrc.jp/alignment/software/mafft_7.490-1_amd64.deb
RUN dpkg -i mafft_7.490-1_amd64.deb

ENTRYPOINT ["/usr/src/app/entrypoint.sh"]


# ENTRYPOINT ["/usr/src/app/entrypoint.sh"]