const HDWalletProvider = require("truffle-hdwallet-provider");
require('dotenv').config()

module.exports = {
    networks: {
        develop: {
            gas: 6700000,
            accounts: 10,
            defaultEtherBalance: 10000,
            blockTime: 1
        },
        ropsten: {
            provider: () => new HDWalletProvider(process.env.MNENOMIC, "https://ropsten.infura.io/v3/" + process.env.INFURA_API_KEY),
            network_id: 3,
            gas: 6700000,
            gasPrice: 10000000000,
            from: process.env.OWNER_ACCOUNT,
        },
        mainnet: {
            provider: () => new HDWalletProvider(process.env.MNENOMIC, "https://mainnet.infura.io/v3/" + process.env.INFURA_API_KEY),
            network_id: 1,
            gas: 6700000,
            gasPrice: 20000000000,
            from: process.env.OWNER_ACCOUNT
        }
    },

    compilers: {
        solc: { version: "0.5.1", optimizer: { enabled: true, runs: 200 } }
    }
}