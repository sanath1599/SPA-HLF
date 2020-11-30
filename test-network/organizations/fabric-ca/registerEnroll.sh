#!/bin/bash

source scriptUtils.sh

function createHDFCCerts() {

  infoln "Enroll the CA admin"
  mkdir -p organizations/peerOrganizations/hdfc.example.com/

  export FABRIC_CA_CLIENT_HOME=${PWD}/organizations/peerOrganizations/hdfc.example.com/
  #  rm -rf $FABRIC_CA_CLIENT_HOME/fabric-ca-client-config.yaml
  #  rm -rf $FABRIC_CA_CLIENT_HOME/msp

  set -x
  fabric-ca-client enroll -u https://hdfccaadmin:hdfccaadminpw@localhost:7054 --caname ca-hdfc --tls.certfiles ${PWD}/organizations/fabric-ca/hdfc/tls-cert.pem
  { set +x; } 2>/dev/null

  echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/localhost-7054-ca-hdfc.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/localhost-7054-ca-hdfc.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/localhost-7054-ca-hdfc.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/localhost-7054-ca-hdfc.pem
    OrganizationalUnitIdentifier: orderer' >${PWD}/organizations/peerOrganizations/hdfc.example.com/msp/config.yaml

  infoln "Register peer0"
  set -x
  fabric-ca-client register --caname ca-hdfc --id.name peer0 --id.secret peer0pw --id.type peer --tls.certfiles ${PWD}/organizations/fabric-ca/hdfc/tls-cert.pem
  { set +x; } 2>/dev/null

  infoln "Register user"
  set -x
  fabric-ca-client register --caname ca-hdfc --id.name user1 --id.secret user1pw --id.type client --tls.certfiles ${PWD}/organizations/fabric-ca/hdfc/tls-cert.pem
  { set +x; } 2>/dev/null

  infoln "Register the org admin"
  set -x
  fabric-ca-client register --caname ca-hdfc --id.name hdfcadmin --id.secret hdfcadminpw --id.type admin --tls.certfiles ${PWD}/organizations/fabric-ca/hdfc/tls-cert.pem
  { set +x; } 2>/dev/null

  mkdir -p organizations/peerOrganizations/hdfc.example.com/peers
  mkdir -p organizations/peerOrganizations/hdfc.example.com/peers/peer0.hdfc.example.com

  infoln "Generate the peer0 msp"
  set -x
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:7054 --caname ca-hdfc -M ${PWD}/organizations/peerOrganizations/hdfc.example.com/peers/peer0.hdfc.example.com/msp --csr.hosts peer0.hdfc.example.com --tls.certfiles ${PWD}/organizations/fabric-ca/hdfc/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/peerOrganizations/hdfc.example.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/hdfc.example.com/peers/peer0.hdfc.example.com/msp/config.yaml

  infoln "Generate the peer0-tls certificates"
  set -x
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:7054 --caname ca-hdfc -M ${PWD}/organizations/peerOrganizations/hdfc.example.com/peers/peer0.hdfc.example.com/tls --enrollment.profile tls --csr.hosts peer0.hdfc.example.com --csr.hosts localhost --tls.certfiles ${PWD}/organizations/fabric-ca/hdfc/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/peerOrganizations/hdfc.example.com/peers/peer0.hdfc.example.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/hdfc.example.com/peers/peer0.hdfc.example.com/tls/ca.crt
  cp ${PWD}/organizations/peerOrganizations/hdfc.example.com/peers/peer0.hdfc.example.com/tls/signcerts/* ${PWD}/organizations/peerOrganizations/hdfc.example.com/peers/peer0.hdfc.example.com/tls/server.crt
  cp ${PWD}/organizations/peerOrganizations/hdfc.example.com/peers/peer0.hdfc.example.com/tls/keystore/* ${PWD}/organizations/peerOrganizations/hdfc.example.com/peers/peer0.hdfc.example.com/tls/server.key

  mkdir -p ${PWD}/organizations/peerOrganizations/hdfc.example.com/msp/tlscacerts
  cp ${PWD}/organizations/peerOrganizations/hdfc.example.com/peers/peer0.hdfc.example.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/hdfc.example.com/msp/tlscacerts/ca.crt

  mkdir -p ${PWD}/organizations/peerOrganizations/hdfc.example.com/tlsca
  cp ${PWD}/organizations/peerOrganizations/hdfc.example.com/peers/peer0.hdfc.example.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/hdfc.example.com/tlsca/tlsca.hdfc.example.com-cert.pem

  mkdir -p ${PWD}/organizations/peerOrganizations/hdfc.example.com/ca
  cp ${PWD}/organizations/peerOrganizations/hdfc.example.com/peers/peer0.hdfc.example.com/msp/cacerts/* ${PWD}/organizations/peerOrganizations/hdfc.example.com/ca/ca.hdfc.example.com-cert.pem

  mkdir -p organizations/peerOrganizations/hdfc.example.com/users
  mkdir -p organizations/peerOrganizations/hdfc.example.com/users/User1@hdfc.example.com

  infoln "Generate the user msp"
  set -x
  fabric-ca-client enroll -u https://user1:user1pw@localhost:7054 --caname ca-hdfc -M ${PWD}/organizations/peerOrganizations/hdfc.example.com/users/User1@hdfc.example.com/msp --tls.certfiles ${PWD}/organizations/fabric-ca/hdfc/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/peerOrganizations/hdfc.example.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/hdfc.example.com/users/User1@hdfc.example.com/msp/config.yaml

  mkdir -p organizations/peerOrganizations/hdfc.example.com/users/Admin@hdfc.example.com

  infoln "Generate the org admin msp"
  set -x
  fabric-ca-client enroll -u https://hdfcadmin:hdfcadminpw@localhost:7054 --caname ca-hdfc -M ${PWD}/organizations/peerOrganizations/hdfc.example.com/users/Admin@hdfc.example.com/msp --tls.certfiles ${PWD}/organizations/fabric-ca/hdfc/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/peerOrganizations/hdfc.example.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/hdfc.example.com/users/Admin@hdfc.example.com/msp/config.yaml

}

function createSBICerts() {

  infoln "Enroll the CA admin"
  mkdir -p organizations/peerOrganizations/sbi.example.com/

  export FABRIC_CA_CLIENT_HOME=${PWD}/organizations/peerOrganizations/sbi.example.com/
  #  rm -rf $FABRIC_CA_CLIENT_HOME/fabric-ca-client-config.yaml
  #  rm -rf $FABRIC_CA_CLIENT_HOME/msp

  set -x
  fabric-ca-client enroll -u https://sbicaadmin:sbicaadminpw@localhost:8054 --caname ca-sbi --tls.certfiles ${PWD}/organizations/fabric-ca/sbi/tls-cert.pem
  { set +x; } 2>/dev/null

  echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/localhost-8054-ca-sbi.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/localhost-8054-ca-sbi.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/localhost-8054-ca-sbi.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/localhost-8054-ca-sbi.pem
    OrganizationalUnitIdentifier: orderer' >${PWD}/organizations/peerOrganizations/sbi.example.com/msp/config.yaml

  infoln "Register peer0"
  set -x
  fabric-ca-client register --caname ca-sbi --id.name peer0 --id.secret peer0pw --id.type peer --tls.certfiles ${PWD}/organizations/fabric-ca/sbi/tls-cert.pem
  { set +x; } 2>/dev/null

  infoln "Register user"
  set -x
  fabric-ca-client register --caname ca-sbi --id.name user1 --id.secret user1pw --id.type client --tls.certfiles ${PWD}/organizations/fabric-ca/sbi/tls-cert.pem
  { set +x; } 2>/dev/null

  infoln "Register the org admin"
  set -x
  fabric-ca-client register --caname ca-sbi --id.name sbiadmin --id.secret sbiadminpw --id.type admin --tls.certfiles ${PWD}/organizations/fabric-ca/sbi/tls-cert.pem
  { set +x; } 2>/dev/null

  mkdir -p organizations/peerOrganizations/sbi.example.com/peers
  mkdir -p organizations/peerOrganizations/sbi.example.com/peers/peer0.sbi.example.com

  infoln "Generate the peer0 msp"
  set -x
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:8054 --caname ca-sbi -M ${PWD}/organizations/peerOrganizations/sbi.example.com/peers/peer0.sbi.example.com/msp --csr.hosts peer0.sbi.example.com --tls.certfiles ${PWD}/organizations/fabric-ca/sbi/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/peerOrganizations/sbi.example.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/sbi.example.com/peers/peer0.sbi.example.com/msp/config.yaml

  infoln "Generate the peer0-tls certificates"
  set -x
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:8054 --caname ca-sbi -M ${PWD}/organizations/peerOrganizations/sbi.example.com/peers/peer0.sbi.example.com/tls --enrollment.profile tls --csr.hosts peer0.sbi.example.com --csr.hosts localhost --tls.certfiles ${PWD}/organizations/fabric-ca/sbi/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/peerOrganizations/sbi.example.com/peers/peer0.sbi.example.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/sbi.example.com/peers/peer0.sbi.example.com/tls/ca.crt
  cp ${PWD}/organizations/peerOrganizations/sbi.example.com/peers/peer0.sbi.example.com/tls/signcerts/* ${PWD}/organizations/peerOrganizations/sbi.example.com/peers/peer0.sbi.example.com/tls/server.crt
  cp ${PWD}/organizations/peerOrganizations/sbi.example.com/peers/peer0.sbi.example.com/tls/keystore/* ${PWD}/organizations/peerOrganizations/sbi.example.com/peers/peer0.sbi.example.com/tls/server.key

  mkdir -p ${PWD}/organizations/peerOrganizations/sbi.example.com/msp/tlscacerts
  cp ${PWD}/organizations/peerOrganizations/sbi.example.com/peers/peer0.sbi.example.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/sbi.example.com/msp/tlscacerts/ca.crt

  mkdir -p ${PWD}/organizations/peerOrganizations/sbi.example.com/tlsca
  cp ${PWD}/organizations/peerOrganizations/sbi.example.com/peers/peer0.sbi.example.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/sbi.example.com/tlsca/tlsca.sbi.example.com-cert.pem

  mkdir -p ${PWD}/organizations/peerOrganizations/sbi.example.com/ca
  cp ${PWD}/organizations/peerOrganizations/sbi.example.com/peers/peer0.sbi.example.com/msp/cacerts/* ${PWD}/organizations/peerOrganizations/sbi.example.com/ca/ca.sbi.example.com-cert.pem

  mkdir -p organizations/peerOrganizations/sbi.example.com/users
  mkdir -p organizations/peerOrganizations/sbi.example.com/users/User1@sbi.example.com

  infoln "Generate the user msp"
  set -x
  fabric-ca-client enroll -u https://user1:user1pw@localhost:8054 --caname ca-sbi -M ${PWD}/organizations/peerOrganizations/sbi.example.com/users/User1@sbi.example.com/msp --tls.certfiles ${PWD}/organizations/fabric-ca/sbi/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/peerOrganizations/sbi.example.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/sbi.example.com/users/User1@sbi.example.com/msp/config.yaml

  mkdir -p organizations/peerOrganizations/sbi.example.com/users/Admin@sbi.example.com

  infoln "Generate the org admin msp"
  set -x
  fabric-ca-client enroll -u https://sbiadmin:sbiadminpw@localhost:8054 --caname ca-sbi -M ${PWD}/organizations/peerOrganizations/sbi.example.com/users/Admin@sbi.example.com/msp --tls.certfiles ${PWD}/organizations/fabric-ca/sbi/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/peerOrganizations/sbi.example.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/sbi.example.com/users/Admin@sbi.example.com/msp/config.yaml

}

function createNPCICerts() {

  infoln "Enroll the CA admin"
  mkdir -p organizations/ordererOrganizations/example.com

  export FABRIC_CA_CLIENT_HOME=${PWD}/organizations/ordererOrganizations/example.com
  #  rm -rf $FABRIC_CA_CLIENT_HOME/fabric-ca-client-config.yaml
  #  rm -rf $FABRIC_CA_CLIENT_HOME/msp

  set -x
  fabric-ca-client enroll -u https://npcicaadmin:npcicaadminpw@localhost:9054 --caname ca-npci --tls.certfiles ${PWD}/organizations/fabric-ca/npci/tls-cert.pem
  { set +x; } 2>/dev/null

  echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/localhost-9054-ca-npci.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/localhost-9054-ca-npci.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/localhost-9054-ca-npci.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/localhost-9054-ca-npci.pem
    OrganizationalUnitIdentifier: orderer' >${PWD}/organizations/ordererOrganizations/example.com/msp/config.yaml

  infoln "Register orderer"
  set -x
  fabric-ca-client register --caname ca-npci --id.name orderer --id.secret ordererpw --id.type orderer --tls.certfiles ${PWD}/organizations/fabric-ca/npci/tls-cert.pem
  { set +x; } 2>/dev/null

  infoln "Register orderer1"
  set -x
  fabric-ca-client register --caname ca-npci --id.name orderer1 --id.secret orderer1pw --id.type orderer --tls.certfiles ${PWD}/organizations/fabric-ca/npci/tls-cert.pem
  { set +x; } 2>/dev/null

  infoln "Register orderer2"
  set -x
  fabric-ca-client register --caname ca-npci --id.name orderer2 --id.secret orderer2pw --id.type orderer --tls.certfiles ${PWD}/organizations/fabric-ca/npci/tls-cert.pem
  { set +x; } 2>/dev/null

  infoln "Register the orderer admin"
  set -x
  fabric-ca-client register --caname ca-npci --id.name ordererAdmin --id.secret ordererAdminpw --id.type admin --tls.certfiles ${PWD}/organizations/fabric-ca/npci/tls-cert.pem
  { set +x; } 2>/dev/null

  mkdir -p organizations/ordererOrganizations/example.com/orderers
  mkdir -p organizations/ordererOrganizations/example.com/orderers/example.com

  #------ start orderer here ------
  mkdir -p organizations/ordererOrganizations/example.com/orderers/orderer.example.com

  infoln "Generate the orderer msp"
  set -x
  fabric-ca-client enroll -u https://orderer:ordererpw@localhost:9054 --caname ca-npci -M ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp --csr.hosts orderer.example.com --csr.hosts localhost --tls.certfiles ${PWD}/organizations/fabric-ca/npci/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/ordererOrganizations/example.com/msp/config.yaml ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/config.yaml

  infoln "Generate the orderer-tls certificates"
  set -x
  fabric-ca-client enroll -u https://orderer:ordererpw@localhost:9054 --caname ca-npci -M ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/tls --enrollment.profile tls --csr.hosts orderer.example.com --csr.hosts localhost --tls.certfiles ${PWD}/organizations/fabric-ca/npci/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/tls/tlscacerts/* ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/tls/ca.crt
  cp ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/tls/signcerts/* ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/tls/server.crt
  cp ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/tls/keystore/* ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/tls/server.key

  mkdir -p ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts
  cp ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/tls/tlscacerts/* ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem

  mkdir -p ${PWD}/organizations/ordererOrganizations/example.com/msp/tlscacerts
  cp ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/tls/tlscacerts/* ${PWD}/organizations/ordererOrganizations/example.com/msp/tlscacerts/tlsca.example.com-cert.pem
  # ----- Orderer end --------

  #------ start orderer 1 here ------
  mkdir -p organizations/ordererOrganizations/example.com/orderers/orderer1.example.com

  infoln "Generate the orderer1 msp"
  set -x
  fabric-ca-client enroll -u https://orderer1:orderer1pw@localhost:9054 --caname ca-npci -M ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer1.example.com/msp --csr.hosts orderer1.example.com --csr.hosts localhost --tls.certfiles ${PWD}/organizations/fabric-ca/npci/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/ordererOrganizations/example.com/msp/config.yaml ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer1.example.com/msp/config.yaml

  infoln "Generate the orderer1-tls certificates"
  set -x
  fabric-ca-client enroll -u https://orderer1:orderer1pw@localhost:9054 --caname ca-npci -M ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer1.example.com/tls --enrollment.profile tls --csr.hosts orderer1.example.com --csr.hosts localhost --tls.certfiles ${PWD}/organizations/fabric-ca/npci/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer1.example.com/tls/tlscacerts/* ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer1.example.com/tls/ca.crt
  cp ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer1.example.com/tls/signcerts/* ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer1.example.com/tls/server.crt
  cp ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer1.example.com/tls/keystore/* ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer1.example.com/tls/server.key

  mkdir -p ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer1.example.com/msp/tlscacerts
  cp ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer1.example.com/tls/tlscacerts/* ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer1.example.com/msp/tlscacerts/tlsca.example.com-cert.pem
  # ----- Orderer 1 end --------

  #------ start orderer 2 here ------
  mkdir -p organizations/ordererOrganizations/example.com/orderers/orderer2.example.com

  infoln "Generate the orderer2 msp"
  set -x
  fabric-ca-client enroll -u https://orderer2:orderer2pw@localhost:9054 --caname ca-npci -M ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer2.example.com/msp --csr.hosts orderer2.example.com --csr.hosts localhost --tls.certfiles ${PWD}/organizations/fabric-ca/npci/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/ordererOrganizations/example.com/msp/config.yaml ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer2.example.com/msp/config.yaml

  infoln "Generate the orderer2-tls certificates"
  set -x
  fabric-ca-client enroll -u https://orderer2:orderer2pw@localhost:9054 --caname ca-npci -M ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer2.example.com/tls --enrollment.profile tls --csr.hosts orderer2.example.com --csr.hosts localhost --tls.certfiles ${PWD}/organizations/fabric-ca/npci/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer2.example.com/tls/tlscacerts/* ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer2.example.com/tls/ca.crt
  cp ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer2.example.com/tls/signcerts/* ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer2.example.com/tls/server.crt
  cp ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer2.example.com/tls/keystore/* ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer2.example.com/tls/server.key

  mkdir -p ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer2.example.com/msp/tlscacerts
  cp ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer2.example.com/tls/tlscacerts/* ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer2.example.com/msp/tlscacerts/tlsca.example.com-cert.pem

# ----- Orderer 2 end --------


  mkdir -p organizations/ordererOrganizations/example.com/users
  mkdir -p organizations/ordererOrganizations/example.com/users/Admin@example.com

  infoln "Generate the admin msp"
  set -x
  fabric-ca-client enroll -u https://ordererAdmin:ordererAdminpw@localhost:9054 --caname ca-npci -M ${PWD}/organizations/ordererOrganizations/example.com/users/Admin@example.com/msp --tls.certfiles ${PWD}/organizations/fabric-ca/npci/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/ordererOrganizations/example.com/msp/config.yaml ${PWD}/organizations/ordererOrganizations/example.com/users/Admin@example.com/msp/config.yaml

}
