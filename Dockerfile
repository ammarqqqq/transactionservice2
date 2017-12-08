# Set the base image to Ubuntu
FROM fintechinnovation/ubuntunodejsnvmdebug
# File Author / Maintainer
MAINTAINER Ammar Iqbal

RUN mkdir /certs
ADD /certs /certs
RUN cd /certs && cat star_monifair_com.crt DigiCertCA.crt >> chain.crt
RUN cd /certs && cat star_monifair_com.key >> chain.key

RUN apt-get install -y ca-certificates

# FILEBEAT
#RUN apt-get install -y wget
RUN apt-get update &&\
    apt-get install wget
RUN wget https://download.elastic.co/beats/filebeat/filebeat_1.3.1_amd64.deb \
 && dpkg -i filebeat_1.3.1_amd64.deb \
 && rm filebeat_1.3.1_amd64.deb

RUN apt-get update

RUN apt-get install  -y git-core
RUN apt-get update

RUN apt-get update
RUN apt-get dist-upgrade -y

RUN apt-get update
ADD /filebeat.yml /etc/filebeat/filebeat.yml

RUN mkdir -p /etc/pki/tls/certs
ADD /logstash-beats.crt /etc/pki/tls/certs/logstash-beats.crt


ADD nodestart.sh ./nodestart.sh
RUN chmod +x ./nodestart.sh

# Expose port
EXPOSE 8020
EXPOSE 9922
ADD ./src /src
ADD ./package.json /package.json
RUN npm install

#CMD /etc/init.d/filebeat start && ./nodestart.sh
CMD /etc/init.d/filebeat start &&  nodemon -L --watch "/src" /src/start.js
#CMD  nodemon -L --watch "/src" /src/start.js
