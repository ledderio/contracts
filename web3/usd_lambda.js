require('dotenv').config()

const contractABI = [
    {
        "constant": false,
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "isOwner",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "previousOwner",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "rate",
                "type": "uint256"
            }
        ],
        "name": "setRate",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "getRate",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }
];

const Web3 = require('web3')
const Tx = require('ethereumjs-tx');
const axios = require('axios');
const web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/" + process.env.INFURA_API_KEY))
const API_URL = 'https://api.coinmarketcap.com/v1/ticker/ethereum/?convert=USD';

function sendSigned(txData, cb) {
    const privateKey = Buffer.from(process.env.WALLET_KEY, 'hex');
    const transaction = new Tx(txData)
    transaction.sign(privateKey)
    const serializedTx = transaction.serialize().toString('hex')
    web3.eth.sendSignedTransaction('0x' + serializedTx, cb)
}

function createTX(rate, txCount) {
    var contract = new web3.eth.Contract(contractABI,  process.env.ORACLE_USD_ADDRESS);
    let tx_builder = contract.methods.setRate(rate);
    let encoded_tx = tx_builder.encodeABI();
    const txData = {
        nonce: web3.utils.toHex(txCount),
        gasLimit: web3.utils.toHex(50000),
        gasPrice: web3.utils.toHex(1e9),
        to:  process.env.ORACLE_USD_ADDRESS,
        from: process.env.OWNER_ACCOUNT,
        data: encoded_tx,
        value: "0x0"
    }
    return txData;
}

function setRate(rate) {
    web3.eth.getTransactionCount(process.env.OWNER_ACCOUNT).then(txCount => {
            const txData = createTX(rate, txCount);
            sendSigned(txData, function (err, result) {
                if (err) return console.log('error', err);
                console.log('sent', result);
            })
        }
    );
}

axios.get(API_URL)
    .then(function (response) {
        let value = Math.round(response.data[0].price_usd * 1000);
        console.log("RATE " + value);
        setRate(value);
        console.log("SUCCES UPDATE");
    })
    .catch(function (error) {
        console.log(error);
    });


