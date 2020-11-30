#!/bin/bash

  export PATH=${PWD}/../bin:${PWD}:$PATH

  export FABRIC_CA_CLIENT_HOME=${PWD}/organizations/peerOrganizations/hdfc.example.com/

  infoln "Register peer0"
  set -x
  fabric-ca-client register --caname ca-hdfc --id.name peer1 --id.secret peer1pw --id.type peer --tls.certfiles ${PWD}/organizations/fabric-ca/hdfc/tls-cert.pem
  { set +x; } 2>/dev/null

  mkdir -p organizations/peerOrganizations/hdfc.example.com/peers/peer1.hdfc.example.com

  infoln "Generate the peer0 msp"
  set -x
  fabric-ca-client enroll -u https://peer1:peer1pw@localhost:7054 --caname ca-hdfc -M ${PWD}/organizations/peerOrganizations/hdfc.example.com/peers/peer1.hdfc.example.com/msp --csr.hosts peer1.hdfc.example.com --tls.certfiles ${PWD}/organizations/fabric-ca/hdfc/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/peerOrganizations/hdfc.example.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/hdfc.example.com/peers/peer1.hdfc.example.com/msp/config.yaml

  infoln "Generate the peer0-tls certificates"
  set -x
  fabric-ca-client enroll -u https://peer1:peer1pw@localhost:7054 --caname ca-hdfc -M ${PWD}/organizations/peerOrganizations/hdfc.example.com/peers/peer1.hdfc.example.com/tls --enrollment.profile tls --csr.hosts peer1.hdfc.example.com --csr.hosts localhost --tls.certfiles ${PWD}/organizations/fabric-ca/hdfc/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/peerOrganizations/hdfc.example.com/peers/peer1.hdfc.example.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/hdfc.example.com/peers/peer1.hdfc.example.com/tls/ca.crt

  cp ${PWD}/organizations/peerOrganizations/hdfc.example.com/peers/peer1.hdfc.example.com/tls/signcerts/* ${PWD}/organizations/peerOrganizations/hdfc.example.com/peers/peer1.hdfc.example.com/tls/server.crt

  cp ${PWD}/organizations/peerOrganizations/hdfc.example.com/peers/peer1.hdfc.example.com/tls/keystore/* ${PWD}/organizations/peerOrganizations/hdfc.example.com/peers/peer1.hdfc.example.com/tls/server.key


  IMAGE_TAG=latest docker-compose -f ${PWD}/docker/docker-compose-peer1-hdfc.yaml up -d