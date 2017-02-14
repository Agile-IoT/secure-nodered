FROM resin/raspberrypi3-node:7.2.1

WORKDIR /opt/secure-nodered
COPY . /opt/secure-nodered
RUN npm install
EXPOSE 1880

#RUN npm install -g node-red-dashboard

#RUN npm install -g node-red-contrib-graphs

#RUN npm install -g node-red-contrib-influxdb

#RUN npm install -g node-red-contrib-resinio

#COPY agile-node-red-nodes agile-node-red-nodes

#RUN npm install -g agile-node-red-nodes

RUN git clone https://github.com/agile-iot/node-red-idm-token-node /opt/node-red-idm-token-node
CP /opt/node-red-idm-token-node/*.js  secure-nodered/node_modules/node-red/nodes/
CP /opt/node-red-idm-token-node/*.html secure-nodered/node_modules/node-red/nodes/
CMD node index
