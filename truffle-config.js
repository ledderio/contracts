module.exports = {
    networks: {
        develop: {
            gas: 6700000,
            accounts: 10,
            defaultEtherBalance: 10000,
            blockTime: 1
        },
    },
    ropsten: {
        network_id: 3,
        host: "localhost",
        port: 8545,
        gas: 2900000,
        from: "0x3650476838876c36d4326f4446023F387CeC7708",
    },
    live: {
        host: "127.0.0.1",
        port: 8545,
        network_id: 1,
    }
}