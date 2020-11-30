# Simple-Payment-Application-HLF
A Simple Payment Application to handle payments across 2 banks on Hyperledger Fabric Blockchain platform

# Chaincode Execution

>cd test-network

>./network.sh up -s couchdb -ca

>./network.sh createChannel

>./network.sh deployCC -ccn spa -cccg ${PWD}/../spa-chaincode/collection-config.json

# Backend Execution

>cd hdfcapp/backend

>npm i

>node start

# Frontend Execution

>cd hdfcapp/frontend

>npm i

>npm start


# Build Frontend for Production

>cd hdfcapp/frontend

>npm i

> Change the URL in the package.json

>npm run build

>Serve the build folder along with the index file
