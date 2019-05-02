require('dotenv').config()


const Web3 = require('web3')
const Tx = require('ethereumjs-tx');
const web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/" + process.env.INFURA_API_KEY))


/*
web3.eth.getBalance("0xFB6E4ED253a59FBDC5Bc19a50420E659B277863B", (err, wei) => {
    balance = web3.utils.fromWei(wei, 'ether')
    console.log(balance)
});*/


web3.eth.getTransactionCount("0xFB6E4ED253a59FBDC5Bc19a50420E659B277863B", (err, count) => {

    console.log(count)
});


web3.eth.getTr("0xFB6E4ED253a59FBDC5Bc19a50420E659B277863B", (err, count) => {

    console.log(count)
});


9UGKRGYGDETKKH4GN6MH7SXN9PN4X2D5C9