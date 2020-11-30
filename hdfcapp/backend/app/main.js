'use strict'


const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const { buildCAClient, registerAndEnrollUser, enrollAdmin } = require('../../../test-application/javascript/CAUtil.js');
const { buildCCPOrg1, buildWallet } = require('../../../test-application/javascript/AppUtil.js');
const jwt = require("jsonwebtoken");
const auth = require("../middlewares/jwt");


const channelName = 'mychannel';
const chaincodeName = 'spa';
const mspOrg1 = 'HDFCMSP';
const memberAssetCollectionName = 'assetCollection';
const org1PrivateCollectionName = 'HDFCMSPUserCollection';
const walletPath = path.join(__dirname, "..", 'wallet');
const org1UserId = 'User1';

function prettyJSONString(inputString) {
    return JSON.stringify(JSON.parse(inputString), null, 2);
}

exports.initAuth = [
    async (req, res) => {
        try {
            // build an in memory object with the network configuration (also known as a connection profile)
            const ccp = buildCCPOrg1();

            // build an instance of the fabric ca services client based on
            // the information in the network configuration
            const caClient = buildCAClient(FabricCAServices, ccp, 'ca.hdfc.example.com');

            // setup the wallet to hold the credentials of the application user
            const wallet = await buildWallet(Wallets, walletPath);

            // in a real application this would be done on an administrative flow, and only once
            await enrollAdmin(caClient, wallet, mspOrg1);

            // in a real application this would be done only when a new user was required to be added
            // and would be part of an administrative flow
            await registerAndEnrollUser(caClient, wallet, mspOrg1, org1UserId, 'hdfc.user');

            // Create a new gateway instance for interacting with the fabric network.
            // In a real application this would be done as the backend server session is setup for
            // a user that has been verified.
            const gateway = new Gateway();


            try {
                // setup the gateway instance
                // The user will now be able to create connections to the fabric network and be able to
                // submit transactions and query. All transactions submitted by this gateway will be
                // signed by this user using the credentials stored in the wallet.

                await gateway.connect(ccp, {
                    wallet,
                    identity: org1UserId,
                    discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
                });

                // Build a network instance based on the channel where the smart contract is deployed
                const network = await gateway.getNetwork(channelName);

                // Get the contract from the network.
                const contract = network.getContract(chaincodeName);



                console.log("Created Contract")

                // Let's try a query type operation (function).
                // This will be sent to just one peer and the results will be shown.
                console.log('\n--> Submit Transaction: InitLedger, function creates the initial set of assets on the ledger');
                let result = await contract.submitTransaction('InitAuth');
                res.send(`*** Result: committed***`);


            } finally {
                // Disconnect from the gateway when the application is closing
                // This will close all connections to the network
                gateway.disconnect();
            }
        } catch (error) {
            console.error(`******** FAILED to run the application: ${error}`);
        }
    }]


exports.init = [
    auth,
    async (req, res) => {
        try {
            // build an in memory object with the network configuration (also known as a connection profile)
            const ccp = buildCCPOrg1();

            // build an instance of the fabric ca services client based on
            // the information in the network configuration
            const caClient = buildCAClient(FabricCAServices, ccp, 'ca.hdfc.example.com');

            // setup the wallet to hold the credentials of the application user
            const wallet = await buildWallet(Wallets, walletPath);

            // in a real application this would be done on an administrative flow, and only once
            await enrollAdmin(caClient, wallet, mspOrg1);

            // in a real application this would be done only when a new user was required to be added
            // and would be part of an administrative flow
            await registerAndEnrollUser(caClient, wallet, mspOrg1, org1UserId, 'hdfc.user');

            // Create a new gateway instance for interacting with the fabric network.
            // In a real application this would be done as the backend server session is setup for
            // a user that has been verified.
            const gateway = new Gateway();


            try {
                // setup the gateway instance
                // The user will now be able to create connections to the fabric network and be able to
                // submit transactions and query. All transactions submitted by this gateway will be
                // signed by this user using the credentials stored in the wallet.

                await gateway.connect(ccp, {
                    wallet,
                    identity: org1UserId,
                    discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
                });

                // Build a network instance based on the channel where the smart contract is deployed
                const network = await gateway.getNetwork(channelName);

                // Get the contract from the network.
                const contract = network.getContract(chaincodeName);



                console.log("Created Contract")

                // Let's try a query type operation (function).
                // This will be sent to just one peer and the results will be shown.
                console.log('\n--> Submit Transaction: InitLedger, function creates the initial set of assets on the ledger');
                let result = await contract.submitTransaction('InitLedger');
                res.send(`*** Result: committed***`);


            } finally {
                // Disconnect from the gateway when the application is closing
                // This will close all connections to the network
                gateway.disconnect();
            }
        } catch (error) {
            console.error(`******** FAILED to run the application: ${error}`);
        }
    }]



exports.getAllAssets = [
    auth,
    async (req, res) => {
        try {
            // build an in memory object with the network configuration (also known as a connection profile)
            const ccp = buildCCPOrg1();

            // build an instance of the fabric ca services client based on
            // the information in the network configuration
            const caClient = buildCAClient(FabricCAServices, ccp, 'ca.hdfc.example.com');

            // setup the wallet to hold the credentials of the application user
            const wallet = await buildWallet(Wallets, walletPath);

            // in a real application this would be done on an administrative flow, and only once
            await enrollAdmin(caClient, wallet, mspOrg1);

            // in a real application this would be done only when a new user was required to be added
            // and would be part of an administrative flow
            await registerAndEnrollUser(caClient, wallet, mspOrg1, org1UserId, 'hdfc.user');

            // Create a new gateway instance for interacting with the fabric network.
            // In a real application this would be done as the backend server session is setup for
            // a user that has been verified.
            const gateway = new Gateway();


            try {
                // setup the gateway instance
                // The user will now be able to create connections to the fabric network and be able to
                // submit transactions and query. All transactions submitted by this gateway will be
                // signed by this user using the credentials stored in the wallet.

                await gateway.connect(ccp, {
                    wallet,
                    identity: org1UserId,
                    discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
                });

                // Build a network instance based on the channel where the smart contract is deployed
                const network = await gateway.getNetwork(channelName);

                // Get the contract from the network.
                const contract = network.getContract(chaincodeName);



                console.log("Created Contract", contract)

                // Let's try a query type operation (function).
                // This will be sent to just one peer and the results will be shown.
                console.log('\n--> Evaluate Transaction: GetAllAssets, function returns all the current assets on the ledger');
                const accType = req.user.AccountType
                if (accType == "user") {
                    console.log(req.user.AccountType)
                    let result = await contract.evaluateTransaction('GetAllAccountsOwner', req.user.firstName);
                    res.send(result);
                }
                else {
                    let result = await contract.evaluateTransaction('GetAllAccounts');
                    res.send(result);
                }

                //res.send(`*** Result: ${prettyJSONString(result.toString())}`);

            } finally {
                // Disconnect from the gateway when the application is closing
                // This will close all connections to the network
                gateway.disconnect();
            }
        } catch (error) {
            console.error(`******** FAILED to run the application: ${error}`);
        }
    }]


exports.register = [
    auth,
    async (req, res) => {
        try {
            // build an in memory object with the network configuration (also known as a connection profile)
            const ccp = buildCCPOrg1();

            // build an instance of the fabric ca services client based on
            // the information in the network configuration
            const caClient = buildCAClient(FabricCAServices, ccp, 'ca.hdfc.example.com');

            // setup the wallet to hold the credentials of the application user
            const wallet = await buildWallet(Wallets, walletPath);

            // in a real application this would be done on an administrative flow, and only once
            await enrollAdmin(caClient, wallet, mspOrg1);

            // in a real application this would be done only when a new user was required to be added
            // and would be part of an administrative flow
            await registerAndEnrollUser(caClient, wallet, mspOrg1, org1UserId, 'hdfc.user');

            // Create a new gateway instance for interacting with the fabric network.
            // In a real application this would be done as the backend server session is setup for
            // a user that has been verified.
            const gateway = new Gateway();


            try {
                // setup the gateway instance
                // The user will now be able to create connections to the fabric network and be able to
                // submit transactions and query. All transactions submitted by this gateway will be
                // signed by this user using the credentials stored in the wallet.

                await gateway.connect(ccp, {
                    wallet,
                    identity: org1UserId,
                    discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
                });

                // Build a network instance based on the channel where the smart contract is deployed
                const network = await gateway.getNetwork(channelName);

                // Get the contract from the network.
                const contract = network.getContract(chaincodeName);



                console.log("Created Contract", contract)
                let randomNumber = Math.floor(Math.random() * 10000) + 1;
                let assetID1 = `${randomNumber}`;
                // Let's try a query type operation (function).
                // This will be sent to just one peer and the results will be shown.
                const transientData = {
                    "name": req.body.name,
                    "ID": assetID1,
                    "address": req.body.address,
                    "sex": req.body.sex
                }
                const name = req.body.name
                console.log('\n**************** As Org1 Client ****************');
                console.log('Adding Assets to work with:\n--> Submit Transaction: RegisterUser Private Data' + assetID1);

                const result = await contract.createTransaction('Register')
                let transData = Buffer.from(JSON.stringify(transientData));
                console.log({ asset_properties: transData })
                result.setTransient({ asset_properties: transData })
                result.setEndorsingOrganizations(mspOrg1);
                result.submit();
                console.log('Adding Assets to work with:\n--> Submit Transaction: RegisterUser Blockchain ' + assetID1);
                const result2 = await contract.submitTransaction('RegisterAcc', assetID1, name)
                res.send(result2)


            } finally {
                // Disconnect from the gateway when the application is closing
                // This will close all connections to the network
                gateway.disconnect();
            }
        } catch (error) {
            console.error(`******** FAILED to run the application: ${error}`);
        }
    }]

exports.registerAuth = [async (req, res) => {
    try {
        // build an in memory object with the network configuration (also known as a connection profile)
        const ccp = buildCCPOrg1();

        // build an instance of the fabric ca services client based on
        // the information in the network configuration
        const caClient = buildCAClient(FabricCAServices, ccp, 'ca.hdfc.example.com');

        // setup the wallet to hold the credentials of the application user
        const wallet = await buildWallet(Wallets, walletPath);

        // in a real application this would be done on an administrative flow, and only once
        await enrollAdmin(caClient, wallet, mspOrg1);

        // in a real application this would be done only when a new user was required to be added
        // and would be part of an administrative flow
        await registerAndEnrollUser(caClient, wallet, mspOrg1, org1UserId, 'hdfc.user');

        // Create a new gateway instance for interacting with the fabric network.
        // In a real application this would be done as the backend server session is setup for
        // a user that has been verified.
        const gateway = new Gateway();


        try {
            // setup the gateway instance
            // The user will now be able to create connections to the fabric network and be able to
            // submit transactions and query. All transactions submitted by this gateway will be
            // signed by this user using the credentials stored in the wallet.

            await gateway.connect(ccp, {
                wallet,
                identity: org1UserId,
                discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
            });

            // Build a network instance based on the channel where the smart contract is deployed
            const network = await gateway.getNetwork(channelName);

            // Get the contract from the network.
            const contract = network.getContract(chaincodeName);



            console.log("Created Contract", contract)
            // Let's try a query type operation (function).
            // This will be sent to just one peer and the results will be shown.
            const transientData = {
                "username": req.body.username,
                "password": req.body.password,
                "bank": req.body.bank,
            }
            const name = req.body.name
            console.log('\n**************** As Org1 Client ****************');
            console.log('Adding Assets to work with:\n--> Submit Transaction: RegisterAuth Private Data ' + "sanath");

            const result = await contract.createTransaction('RegisterAuth')
            let transData = Buffer.from(JSON.stringify(transientData));
            console.log({ login: transData })
            result.setTransient({ login: transData })
            result.setEndorsingOrganizations(mspOrg1);
            result.submit();
            //console.log(result)
            res.send(result)
            // console.log('Adding Assets to work with:\n--> Submit Transaction: RegisterUser Blockchain ' + assetID1);
            // const result2 = await contract.submitTransaction('RegisterAcc', assetID1, name)
            // res.send(result2)


        } finally {
            // Disconnect from the gateway when the application is closing
            // This will close all connections to the network
            gateway.disconnect();
        }
    } catch (error) {
        console.error(`******** FAILED to run the application: ${error}`);
    }
}]

exports.login = [async (req, res) => {
    try {
        // build an in memory object with the network configuration (also known as a connection profile)
        const ccp = buildCCPOrg1();

        // build an instance of the fabric ca services client based on
        // the information in the network configuration
        const caClient = buildCAClient(FabricCAServices, ccp, 'ca.hdfc.example.com');

        // setup the wallet to hold the credentials of the application user
        const wallet = await buildWallet(Wallets, walletPath);

        // in a real application this would be done on an administrative flow, and only once
        await enrollAdmin(caClient, wallet, mspOrg1);

        // in a real application this would be done only when a new user was required to be added
        // and would be part of an administrative flow
        await registerAndEnrollUser(caClient, wallet, mspOrg1, org1UserId, 'hdfc.user');

        // Create a new gateway instance for interacting with the fabric network.
        // In a real application this would be done as the backend server session is setup for
        // a user that has been verified.
        const gateway = new Gateway();


        try {
            // setup the gateway instance
            // The user will now be able to create connections to the fabric network and be able to
            // submit transactions and query. All transactions submitted by this gateway will be
            // signed by this user using the credentials stored in the wallet.

            await gateway.connect(ccp, {
                wallet,
                identity: org1UserId,
                discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
            });

            // Build a network instance based on the channel where the smart contract is deployed
            const network = await gateway.getNetwork(channelName);

            // Get the contract from the network.
            const contract = network.getContract(chaincodeName);



            console.log("Created Contract", contract)

            // Let's try a query type operation (function).
            // This will be sent to just one peer and the results will be shown.
            console.log('\n--> Evaluate Transaction: Login', req.body.username);
            let result = await contract.evaluateTransaction('Login', req.body.username, req.body.password);
            const obj = JSON.parse(result);

            let userData = {
                firstName: obj.UserName,
                bank: obj.Bank,
                AccountType: obj.AccountType,
                AccountNo: obj.AccountNo
            };
            const jwtPayload = userData;
            const jwtData = {
                expiresIn: process.env.JWT_TIMEOUT_DURATION,
            };
            const secret = process.env.JWT_SECRET;
            //Generated JWT token with Payload and secret.
            userData.token = jwt.sign(jwtPayload, secret, jwtData);
            console.log(userData);
            res.send(userData);

        } finally {
            // Disconnect from the gateway when the application is closing
            // This will close all connections to the network
            gateway.disconnect();
        }
    } catch (error) {
        console.error(`******** FAILED to run the application: ${error}`);
    }
}]

exports.kyc = [
    auth,
    async (req, res) => {
        let accType = req.user.AccountType
        if (accType == "operator") {
            try {
                // build an in memory object with the network configuration (also known as a connection profile)
                const ccp = buildCCPOrg1();

                // build an instance of the fabric ca services client based on
                // the information in the network configuration
                const caClient = buildCAClient(FabricCAServices, ccp, 'ca.hdfc.example.com');

                // setup the wallet to hold the credentials of the application user
                const wallet = await buildWallet(Wallets, walletPath);

                // in a real application this would be done on an administrative flow, and only once
                await enrollAdmin(caClient, wallet, mspOrg1);

                // in a real application this would be done only when a new user was required to be added
                // and would be part of an administrative flow
                await registerAndEnrollUser(caClient, wallet, mspOrg1, org1UserId, 'hdfc.user');

                // Create a new gateway instance for interacting with the fabric network.
                // In a real application this would be done as the backend server session is setup for
                // a user that has been verified.
                const gateway = new Gateway();


                try {
                    // setup the gateway instance
                    // The user will now be able to create connections to the fabric network and be able to
                    // submit transactions and query. All transactions submitted by this gateway will be
                    // signed by this user using the credentials stored in the wallet.

                    await gateway.connect(ccp, {
                        wallet,
                        identity: org1UserId,
                        discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
                    });

                    // Build a network instance based on the channel where the smart contract is deployed
                    const network = await gateway.getNetwork(channelName);

                    // Get the contract from the network.
                    const contract = network.getContract(chaincodeName);



                    console.log("Created Contract", contract)

                    // Let's try a query type operation (function).
                    // This will be sent to just one peer and the results will be shown.
                    console.log('\n--> Evaluate Transaction: KYC Update');
                    let result = await contract.evaluateTransaction('UpdateKYC', req.body.accNo);
                    res.send(result);

                } finally {
                    // Disconnect from the gateway when the application is closing
                    // This will close all connections to the network
                    gateway.disconnect();
                }
            } catch (error) {
                console.error(`******** FAILED to run the application: ${error}`);
            }
        }
        else res.send("You are not authorized to run this")
    }]

exports.readPrivateData = [
    auth, async (req, res) => {
        try {
            // build an in memory object with the network configuration (also known as a connection profile)
            const ccp = buildCCPOrg1();

            // build an instance of the fabric ca services client based on
            // the information in the network configuration
            const caClient = buildCAClient(FabricCAServices, ccp, 'ca.hdfc.example.com');

            // setup the wallet to hold the credentials of the application user
            const wallet = await buildWallet(Wallets, walletPath);

            // in a real application this would be done on an administrative flow, and only once
            await enrollAdmin(caClient, wallet, mspOrg1);

            // in a real application this would be done only when a new user was required to be added
            // and would be part of an administrative flow
            await registerAndEnrollUser(caClient, wallet, mspOrg1, org1UserId, 'hdfc.user');

            // Create a new gateway instance for interacting with the fabric network.
            // In a real application this would be done as the backend server session is setup for
            // a user that has been verified.
            const gateway = new Gateway();


            try {
                // setup the gateway instance
                // The user will now be able to create connections to the fabric network and be able to
                // submit transactions and query. All transactions submitted by this gateway will be
                // signed by this user using the credentials stored in the wallet.

                await gateway.connect(ccp, {
                    wallet,
                    identity: org1UserId,
                    discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
                });

                // Build a network instance based on the channel where the smart contract is deployed
                const network = await gateway.getNetwork(channelName);

                // Get the contract from the network.
                const contract = network.getContract(chaincodeName);



                console.log("Created Contract", contract)
                if (req.user.AccountNo) {
                    // Let's try a query type operation (function).
                    // This will be sent to just one peer and the results will be shown.
                    console.log('\n--> Evaluate Transaction: Read Private Data');
                    let result = await contract.evaluateTransaction('ReadUserDetails', req.body.asset);
                    res.send(result);
                }
                else res.send("You do not have any private data")

            } finally {
                // Disconnect from the gateway when the application is closing
                // This will close all connections to the network
                gateway.disconnect();
            }
        } catch (error) {
            console.error(`******** FAILED to run the application: ${error}`);
        }
    }]


exports.readAsset = [
    auth, async (req, res) => {
        try {
            // build an in memory object with the network configuration (also known as a connection profile)
            const ccp = buildCCPOrg1();

            // build an instance of the fabric ca services client based on
            // the information in the network configuration
            const caClient = buildCAClient(FabricCAServices, ccp, 'ca.hdfc.example.com');

            // setup the wallet to hold the credentials of the application user
            const wallet = await buildWallet(Wallets, walletPath);

            // in a real application this would be done on an administrative flow, and only once
            await enrollAdmin(caClient, wallet, mspOrg1);

            // in a real application this would be done only when a new user was required to be added
            // and would be part of an administrative flow
            await registerAndEnrollUser(caClient, wallet, mspOrg1, org1UserId, 'hdfc.user');

            // Create a new gateway instance for interacting with the fabric network.
            // In a real application this would be done as the backend server session is setup for
            // a user that has been verified.
            const gateway = new Gateway();


            try {
                // setup the gateway instance
                // The user will now be able to create connections to the fabric network and be able to
                // submit transactions and query. All transactions submitted by this gateway will be
                // signed by this user using the credentials stored in the wallet.

                await gateway.connect(ccp, {
                    wallet,
                    identity: org1UserId,
                    discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
                });

                // Build a network instance based on the channel where the smart contract is deployed
                const network = await gateway.getNetwork(channelName);

                // Get the contract from the network.
                const contract = network.getContract(chaincodeName);



                console.log("Created Contract", contract)

                // Let's try a query type operation (function).
                // This will be sent to just one peer and the results will be shown.
                const accType = req.user.AccountType
                if (accType == "user") {
                    console.log(req.user.AccountType) 
                    console.log('\n--> Evaluate Transaction: Read Asset');
                    let result = await contract.evaluateTransaction('GetAccountStatement', req.user.AccountNo);
                    res.send(prettyJSONString(result));
                }
                else {
                    console.log('\n--> Evaluate Transaction: Read Asset');
                    let result = await contract.evaluateTransaction('GetAllTransactions');
                    res.send(prettyJSONString(result));
                }

            } finally {
                // Disconnect from the gateway when the application is closing
                // This will close all connections to the network
                gateway.disconnect();
            }
        } catch (error) {
            console.error(`******** FAILED to run the application: ${error}`);
        }
    }]

exports.transferMoney = [auth, async (req, res) => {
    try {
        // build an in memory object with the network configuration (also known as a connection profile)
        const ccp = buildCCPOrg1();

        // build an instance of the fabric ca services client based on
        // the information in the network configuration
        const caClient = buildCAClient(FabricCAServices, ccp, 'ca.hdfc.example.com');

        // setup the wallet to hold the credentials of the application user
        const wallet = await buildWallet(Wallets, walletPath);

        // in a real application this would be done on an administrative flow, and only once
        await enrollAdmin(caClient, wallet, mspOrg1);

        // in a real application this would be done only when a new user was required to be added
        // and would be part of an administrative flow
        await registerAndEnrollUser(caClient, wallet, mspOrg1, org1UserId, 'hdfc.user');

        // Create a new gateway instance for interacting with the fabric network.
        // In a real application this would be done as the backend server session is setup for
        // a user that has been verified.
        const gateway = new Gateway();


        try {
            // setup the gateway instance
            // The user will now be able to create connections to the fabric network and be able to
            // submit transactions and query. All transactions submitted by this gateway will be
            // signed by this user using the credentials stored in the wallet.

            await gateway.connect(ccp, {
                wallet,
                identity: org1UserId,
                discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
            });

            // Build a network instance based on the channel where the smart contract is deployed
            const network = await gateway.getNetwork(channelName);

            // Get the contract from the network.
            const contract = network.getContract(chaincodeName);



            console.log("Created Contract", contract)

            // Let's try a query type operation (function).
            // This will be sent to just one peer and the results will be shown.
            console.log('\n--> Evaluate Transaction: Transfer');
            console.log(req.body.amount)
            let result = await contract.submitTransaction('Transfer', req.user.AccountNo, req.body.to, req.body.amount);
            console.log(result)
            res.send(`*** Result: Transfer Succesful`);

        } finally {
            // Disconnect from the gateway when the application is closing
            // This will close all connections to the network
            gateway.disconnect();
        }
    } catch (error) {
        console.error(`******** FAILED to run the application: ${error}`);
    }
}]

exports.Summary = [auth, async (req, res) => {
    try {
        // build an in memory object with the network configuration (also known as a connection profile)
        const ccp = buildCCPOrg1();

        // build an instance of the fabric ca services client based on
        // the information in the network configuration
        const caClient = buildCAClient(FabricCAServices, ccp, 'ca.hdfc.example.com');

        // setup the wallet to hold the credentials of the application user
        const wallet = await buildWallet(Wallets, walletPath);

        // in a real application this would be done on an administrative flow, and only once
        await enrollAdmin(caClient, wallet, mspOrg1);

        // in a real application this would be done only when a new user was required to be added
        // and would be part of an administrative flow
        await registerAndEnrollUser(caClient, wallet, mspOrg1, org1UserId, 'hdfc.user');

        // Create a new gateway instance for interacting with the fabric network.
        // In a real application this would be done as the backend server session is setup for
        // a user that has been verified.
        const gateway = new Gateway();


        try {
            // setup the gateway instance
            // The user will now be able to create connections to the fabric network and be able to
            // submit transactions and query. All transactions submitted by this gateway will be
            // signed by this user using the credentials stored in the wallet.

            await gateway.connect(ccp, {
                wallet,
                identity: org1UserId,
                discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
            });

            // Build a network instance based on the channel where the smart contract is deployed
            const network = await gateway.getNetwork(channelName);

            // Get the contract from the network.
            const contract = network.getContract(chaincodeName);



            console.log("Created Contract", contract)

            // Let's try a query type operation (function).
            // This will be sent to just one peer and the results will be shown.
            console.log('\n--> Evaluate Transaction: Account Summary');
            let result = await contract.evaluateTransaction('Summary', req.user.AccountNo);
            res.send(`*** Result: ${prettyJSONString(result.toString())}`);

        } finally {
            // Disconnect from the gateway when the application is closing
            // This will close all connections to the network
            gateway.disconnect();
        }
    } catch (error) {
        console.error(`******** FAILED to run the application: ${error}`);
    }
}]

exports.Balance = [auth, async (req, res) => {
    try {
        // build an in memory object with the network configuration (also known as a connection profile)
        const ccp = buildCCPOrg1();

        // build an instance of the fabric ca services client based on
        // the information in the network configuration
        const caClient = buildCAClient(FabricCAServices, ccp, 'ca.hdfc.example.com');

        // setup the wallet to hold the credentials of the application user
        const wallet = await buildWallet(Wallets, walletPath);

        // in a real application this would be done on an administrative flow, and only once
        await enrollAdmin(caClient, wallet, mspOrg1);

        // in a real application this would be done only when a new user was required to be added
        // and would be part of an administrative flow
        await registerAndEnrollUser(caClient, wallet, mspOrg1, org1UserId, 'hdfc.user');

        // Create a new gateway instance for interacting with the fabric network.
        // In a real application this would be done as the backend server session is setup for
        // a user that has been verified.
        const gateway = new Gateway();


        try {
            // setup the gateway instance
            // The user will now be able to create connections to the fabric network and be able to
            // submit transactions and query. All transactions submitted by this gateway will be
            // signed by this user using the credentials stored in the wallet.

            await gateway.connect(ccp, {
                wallet,
                identity: org1UserId,
                discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
            });

            // Build a network instance based on the channel where the smart contract is deployed
            const network = await gateway.getNetwork(channelName);

            // Get the contract from the network.
            const contract = network.getContract(chaincodeName);



            console.log("Created Contract", contract)

            // Let's try a query type operation (function).
            // This will be sent to just one peer and the results will be shown.
            console.log('\n--> Evaluate Transaction: Account Summary');
            let result = await contract.evaluateTransaction('Balance', req.user.AccountNo);
            res.send(`*** Balance: ${prettyJSONString(result.toString())}`);

        } finally {
            // Disconnect from the gateway when the application is closing
            // This will close all connections to the network
            gateway.disconnect();
        }
    } catch (error) {
        console.error(`******** FAILED to run the application: ${error}`);
    }
}]
