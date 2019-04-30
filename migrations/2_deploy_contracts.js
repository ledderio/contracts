var Oracle = artifacts.require("./oracle/OracleUSDETH.sol");
var STO = artifacts.require("./crowdsale/CrowdsaleSTO.sol");
var ICO = artifacts.require("./crowdsale/CrowdsaleICO.sol");
var LUT = artifacts.require("./tokens/LedderUtilityToken.sol");
var LST = artifacts.require("./tokens/LedderSecurityToken.sol");

const STO_TOKEN_COUNT = "5000000000000000000000";    // 5000 tokens
const STO_MIN_USD_AMOUNT = "5000000000000000000000"; // $5
const STO_RATE = 40000;// $40 = 1 token
const STO_WALLET = "0xFB6E4ED253a59FBDC5Bc19a50420E659B277863B";

const ICO_TOKEN_COUNT = "45000000000000000000000000";//45 mil tokens

const ICO_INCREASE_STEP = "1000000000000000000000000";// 1 mil;
const ICO_MIN_USD_AMOUNT = "5000000000000000000000";// $5

const ICO_START_RATE = 10;// $0.01 = 1 token
const ICO_WALLET = "0x6A798b59dBdf1D988541C79A79F0CBD8c8d8E4B1";




module.exports = function (deployer) {
    deployer.then(async () => {
        const oracleContract = await deployer.deploy(Oracle );
       // await oracleContract.setRate(new BN(160000), {from: deployer});//Oracle rate - $100

        const utContract = await deployer.deploy(LUT, ICO_TOKEN_COUNT);
        const icoContract = await deployer.deploy(
            ICO,
            oracleContract.address,
            ICO_WALLET,
            ICO_START_RATE,
            ICO_MIN_USD_AMOUNT,
            utContract.address,
            ICO_INCREASE_STEP
        );

        await utContract.addMinter(icoContract.address);
        await utContract.renounceMinter();

        const stContract = await deployer.deploy(LST, STO_TOKEN_COUNT);
        const stoContract = await  deployer.deploy(
            STO,
            oracleContract.address,
            STO_WALLET,
            STO_RATE,
            STO_MIN_USD_AMOUNT,
            stContract.address
        );
        await stContract.addMinter(stoContract.address);
        await stContract.renounceMinter();

    });
};
