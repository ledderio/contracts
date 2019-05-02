require('dotenv').config()

const contractABI =  [
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
        "type": "function"
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
        "type": "function"
    },
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
                "name": "beneficiary",
                "type": "address"
            }
        ],
        "name": "buyTokens",
        "outputs": [],
        "payable": true,
        "stateMutability": "payable",
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
        "type": "function"
    },
    {
        "inputs": [
            {
                "name": "oracleAddress",
                "type": "address"
            },
            {
                "name": "startRate",
                "type": "uint256"
            },
            {
                "name": "wallet",
                "type": "address"
            },
            {
                "name": "minUsdAmount",
                "type": "uint256"
            },
            {
                "name": "token",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
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
        "type": "event"
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
        "type": "event"
    },
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
        "type": "function"
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
        "type": "function"
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
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "beneficiary",
                "type": "address"
            },
            {
                "name": "tokens",
                "type": "uint256"
            }
        ],
        "name": "sendDirectTokens",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

const Web3 = require('web3')
const Tx = require('ethereumjs-tx');
const web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/" + process.env.INFURA_API_KEY))


function sendSigned(txData, cb) {
    const privateKey = Buffer.from(process.env.WALLET_KEY, 'hex')
    const transaction = new Tx(txData)
    transaction.sign(privateKey)
    const serializedTx = transaction.serialize().toString('hex')
    web3.eth.sendSignedTransaction('0x' + serializedTx, cb)
}

function createTX(sendAddress, count, contractAddress, txCount) {
    var contract = new web3.eth.Contract(contractABI, contractAddress);

    let ad = sendAddress.toString('hex');
    let tx_builder = contract.methods.sendDirectTokens(ad,count );
    //let tx_builder = contract.methods.buyTokensForUsd(ad, count);
    let encoded_tx = tx_builder.encodeABI();
    console.log(encoded_tx)
    const txData = {
        nonce: web3.utils.toHex(txCount),
        gasLimit: web3.utils.toHex(5000000),
        gasPrice: web3.utils.toHex(30e9),
        to: contractAddress,
        from: process.env.OWNER_ACCOUNT,
        data: encoded_tx,
        value: "0x0"
    }
    return txData;
}



function buyUSD(address, amountUSD, contract) {
    web3.eth.getTransactionCount(process.env.OWNER_ACCOUNT).then(txCount => {
            const txData = createTX(address, amountUSD, contract, txCount);
            sendSigned(txData, function (err, result) {
                if (err) return console.log('error', err);
                console.log('sent', result);
            })
        }
    );
}

//104434                                           50000000000000000000000
buyUSD("0x43b63ddfF8AD2aB2762D90b7fC55c9BE37546Bfc", '10000000000000000000', "0xe914617Fe1f285864B6397C239D90Abf43a78799");
