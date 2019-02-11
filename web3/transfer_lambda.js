require('dotenv').config()

const contractABI =[
    {
        "constant": true,
        "inputs": [],
        "name": "rate",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
        "signature": "0x2c4e722e"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "weiRaised",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
        "signature": "0x4042b66f"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "wallet",
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
        "signature": "0x521eb273"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "beneficiary",
                "type": "address"
            },
            {
                "name": "usd",
                "type": "uint256"
            }
        ],
        "name": "buyTokensForUsd",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function",
        "signature": "0x58867762"
    },
    {
        "constant": false,
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function",
        "signature": "0x715018a6"
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
        "type": "function",
        "signature": "0x8da5cb5b"
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
        "type": "function",
        "signature": "0x8f32d59b"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "beneficiary",
                "type": "address"
            }
        ],
        "name": "buyTokens",
        "outputs": [],
        "payable": true,
        "stateMutability": "payable",
        "type": "function",
        "signature": "0xec8ac4d8"
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
        "type": "function",
        "signature": "0xf2fde38b"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "getCurrentRate",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
        "signature": "0xf7fb07b0"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "token",
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
        "signature": "0xfc0c546a"
    },
    {
        "inputs": [
            {
                "name": "oracle",
                "type": "address"
            },
            {
                "name": "wallet",
                "type": "address"
            },
            {
                "name": "rate",
                "type": "uint256"
            },
            {
                "name": "minUsdAmount",
                "type": "uint256"
            },
            {
                "name": "token",
                "type": "address"
            },
            {
                "name": "increaseStep",
                "type": "uint256"
            },
            {
                "name": "firstThresholdAmount",
                "type": "uint256"
            },
            {
                "name": "secondThresholdAmount",
                "type": "uint256"
            },
            {
                "name": "firstThresholdDiscount",
                "type": "uint256"
            },
            {
                "name": "secondThresholdDiscount",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor",
        "signature": "constructor"
    },
    {
        "payable": true,
        "stateMutability": "payable",
        "type": "fallback"
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
        "type": "event",
        "signature": "0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "purchaser",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "beneficiary",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "value",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "TokensPurchased",
        "type": "event",
        "signature": "0x6faf93231a456e552dbc9961f58d9713ee4f2e69d15f1975b050ef0911053a7b"
    }
];

const Web3 = require('web3')
const Tx = require('ethereumjs-tx');
const web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/" + process.env.INFURA_API_KEY))


function sendSigned(txData, cb) {
    const privateKey = new Buffer(process.env.WALLET_KEY, 'hex')
    const transaction = new Tx(txData)
    transaction.sign(privateKey)
    const serializedTx = transaction.serialize().toString('hex')
    web3.eth.sendSignedTransaction('0x' + serializedTx, cb)
}

function createTX(address1, usd, contractAddress,txCount) {

    var contract = new web3.eth.Contract(contractABI, "0x6DD75726B8C04ecD68F7256A0749c642e8bc2906");
    var s=1000;
    let ad= '0x43b63ddfF8AD2aB2762D90b7fC55c9BE37546Bfc'.toString('hex');
    let tx_builder = contract.methods.buyTokensForUsd(ad,s );
    let encoded_tx = tx_builder.encodeABI();
    console.log(encoded_tx)
    const txData = {
        nonce: web3.utils.toHex(txCount),
        gasLimit: web3.utils.toHex(5000000),
        gasPrice: web3.utils.toHex(30e9),
        to: "0x6DD75726B8C04ecD68F7256A0749c642e8bc2906",
        from: process.env.OWNER_ACCOUNT,
        data: encoded_tx,
        value: "0x0"
    }
    return txData;
}

function buyUSD(address, amountUSD,contract) {
    web3.eth.getTransactionCount(process.env.OWNER_ACCOUNT).then(txCount => {
            const txData = createTX(address, amountUSD,contract, txCount);
            sendSigned(txData, function (err, result) {
                if (err) return console.log('error', err);
                console.log('sent', result);
            })
        }
    );
}

//104434
buyUSD("0x43b63ddfF8AD2aB2762D90b7fC55c9BE37546Bfc", 10000,"0xf691caf28404027A56d00e35332B346FfF872C6C");
