const {BN, balance, ether, should, shouldFail, time} = require('openzeppelin-test-helpers');

const CrowdsaleICO = artifacts.require('CrowdsaleICO');
const PreToken = artifacts.require('LedderPreToken');
const OracleUSDETH = artifacts.require('OracleUSDETH');

async function buyTokenAndCheckBalance(investor, investmentAmount, expectedTokenAmount) {
    await this.crowdsale.buyTokens(investor, {value: investmentAmount, from: investor});
    (await this.token.balanceOf(investor)).should.be.bignumber.equal(expectedTokenAmount);
    (await this.token.totalSupply()).should.be.bignumber.equal(expectedTokenAmount);
}

contract('CrowdsaleICO', function ([_, deployer, owner, wallet, investor]) {

    const RATE = new BN(10);//Start token rate - $0.01
    const firstThresholdDiscount = 10;
    const secondThresholdDiscount = 20;
    const firstThresholdAmount = new BN('500000000000000000000000');
    const secondThresholdAmount = new BN('5000000000000000000000000');
    const tokenCount = new BN('20000000000000000000000000');
    const increaseStep = new BN('1000000000000000000000000');
    const minUsdAmount = new BN('50000000000000000000000'); //$50

    beforeEach(async function () {
        this.token = await PreToken.new(tokenCount, {from: deployer});
        this.oracle = await OracleUSDETH.new({from: deployer});
        this.crowdsale = await CrowdsaleICO.new(
            this.oracle.address,
            wallet,
            RATE,
            minUsdAmount,
            this.token.address,
            increaseStep,
            firstThresholdAmount,
            secondThresholdAmount,
            firstThresholdDiscount,
            secondThresholdDiscount,
            {from: owner}
        );

        await this.token.addMinter(this.crowdsale.address, {from: deployer});
        await this.token.renounceMinter({from: deployer});
        await this.oracle.setRate(new BN(100000), {from: deployer});//Oracle rate - $100
    });

    it('should create crowdsale with correct parameters', async function () {
        should.exist(this.token);
        should.exist(this.crowdsale);
        should.exist(this.oracle);
        (await this.crowdsale.wallet()).should.be.equal(wallet);
    });

    it('should reject payments by disadvantage cap', async function () {
        await buyTokenAndCheckBalance.call(this, investor, ether('0.5'), ether('5000'));
        await shouldFail.reverting(this.crowdsale.buyTokens(investor, {value: ether('0.49'), from: investor}));
    });

    it('should accept payments during the sale', async function () {
        await buyTokenAndCheckBalance.call(this, investor, ether('5'), ether('50000'));
    });

    it('should discount 10%', async function () {
        await buyTokenAndCheckBalance.call(this, investor, ether('6'), ether('66000'));
        await buyTokenAndCheckBalance.call(this, investor, ether('50'), ether('616000'));
    });

    it('should discount 20%', async function () {
        await buyTokenAndCheckBalance.call(this, investor, ether('51'), ether('612000'));
    });

    it('the cost rises by 1% after the sale of each of the next million tokens', async function () {
        await buyTokenAndCheckBalance.call(this, investor, ether('100'), ether('1200000'));
        await buyTokenAndCheckBalance.call(this, investor, ether('100'), ether('2388118.811881188118811880'));//1% rise
        await buyTokenAndCheckBalance.call(this, investor, ether('100'), ether('3564589.400116482236458938'));//2% rise
        await buyTokenAndCheckBalance.call(this, investor, ether('1'), ether('3574298.137980559906361850'));//3% rise
    });

    it('the price is determined at the beginning of the transaction', async function () {
        await buyTokenAndCheckBalance.call(this, investor, ether('1000'), ether('12000000'));
        await buyTokenAndCheckBalance.call(this, investor, ether('10'), ether('12098214.285714285714285713'));//12% rise
    });

    it('should reject payments over cap', async function () {
        await buyTokenAndCheckBalance.call(this, investor, ether('1666'), ether('19992000'));
        await shouldFail.reverting(this.crowdsale.buyTokens(investor, {value: ether('1'), from: investor}));
    });

});
