var api = require('etherscan-api').init('9UGKRGYGDETKKH4GN6MH7SXN9PN4X2D5C9');
var balance = api.account.balance('0xB96F8110f795Ec7dE384795E0b5fae2491C1CD78');
balance.then(function (balanceData) {

    if (balanceData.status = 1) {
        let endValue = balanceData.result;
        console.log("END" + endValue);

        var account = '0xb96f8110f795ec7de384795e0b5fae2491c1cd78'
        var txlist = api.account.txlist(account, 1, 'latest', 1, 100, 'asc');

        var current = Number(endValue);

        txlist.then(function (balanceData) {

            for (let i = 0; i < (balanceData.result.length); i++) {
                var n = balanceData.result.length - i - 1;
                let t = balanceData.result[n];



                if (t.from == account) {

                //    console.log("minus: " + t.gasUsed * t.gasPrice);
                //    console.log("value: " + t.value);
                    current = current + Number(t.value) + Number(t.gasUsed * t.gasPrice);
                } else {
                   // console.log("plus value: " + t.value);
                    current = current - t.value ;
                }
                console.log("timeStamp: " + new Date(t.timeStamp * 1000)+" current: "+current);


            }
        });
    }


});


