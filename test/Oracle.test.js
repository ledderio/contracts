
const { BN,should } = require('openzeppelin-test-helpers');
const OracleUSDETH = artifacts.require('OracleUSDETH');


contract('OracleUSDETH', function ([_, owner]) {

    beforeEach(async function () {
        this.oracle = await OracleUSDETH.new({from: owner});
    });

    it('should create crowdsale with correct parameters', async function () {
        should.exist(this.oracle);
    });

    describe('Set Get Rate', function () {
        it('is correctly start rate', async function () {

            await this.oracle.setRate(new BN(10),{from: owner});
            (await this.oracle.getRate()).should.be.bignumber.equal(new BN('10'));

            await this.oracle.setRate(new BN(100),{from: owner});
            (await this.oracle.getRate()).should.be.bignumber.equal(new BN('100'));
        });
    });
});