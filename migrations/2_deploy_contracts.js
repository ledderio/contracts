var Oracle = artifacts.require("./oracle/OracleUSDETH.sol");
var STO = artifacts.require("./crowdsale/CrowdsaleSTO.sol");
var ICO = artifacts.require("./crowdsale/CrowdsaleICO.sol");
var LPT = artifacts.require("./tokens/LedderPreToken.sol");
var LST = artifacts.require("./tokens/LedderSharesToken.sol");

const STO_TOKEN_COUNT = "5000000000000000000000";    // 5000 tokens
const STO_MIN_USD_AMOUNT = "5000000000000000000000000"; // $5000
const STO_RATE = 40000;// $40 = 1 token
const STO_WALLET = "0xec251c7ac4b1920732c627021aea95185cc79a25";

const ICO_TOKEN_COUNT = "20000000000000000000000000";//20 mil tokens
const ICO_INCREASE_STEP = "1000000000000000000000000";// 1 mil;
const ICO_MIN_USD_AMOUNT = "50000000000000000000000";// $50
const ICO_FIRST_THRESHOLD_DISCOUNT = 10;// 10%
const ICO_FIRST_THRESHOLD_AMOUNT = "500000000000000000000000";// $500
const ICO_SECOND_THRESHOLD_DISCOUNT = 20;// 20%
const ICO_SECOND_THRESHOLD_AMOUNT = "5000000000000000000000000";// $5000
const ICO_START_RATE = 10;// $0.01 = 1 token
const ICO_WALLET = "0xec251c7ac4b1920732c627021aea95185cc79a25";


module.exports = function (deployer) {
    deployer.then(async () => {
        const oracleContract = await deployer.deploy(Oracle);
        const lptContract = await deployer.deploy(LPT, ICO_TOKEN_COUNT);
        const icoContract = await deployer.deploy(
            ICO,
            oracleContract.address,
            ICO_WALLET,
            ICO_START_RATE,
            ICO_MIN_USD_AMOUNT,
            lptContract.address,
            ICO_INCREASE_STEP,
            ICO_FIRST_THRESHOLD_AMOUNT,
            ICO_SECOND_THRESHOLD_AMOUNT,
            ICO_FIRST_THRESHOLD_DISCOUNT,
            ICO_SECOND_THRESHOLD_DISCOUNT,
        );
        await lptContract.addMinter(icoContract.address);

        const lstContract = await deployer.deploy(LST, STO_TOKEN_COUNT);
        const stoContract = await  deployer.deploy(
            STO,
            oracleContract.address,
            STO_WALLET,
            STO_RATE,
            STO_MIN_USD_AMOUNT,
            lstContract.address
        );
        await lstContract.addMinter(stoContract.address);

    });
};
