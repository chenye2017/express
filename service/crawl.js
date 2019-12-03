const https = require('https')

function crawlGet(url) {
    return new Promise((resolve, reject) => {
        https.get(url, function (res) {
            var data = "";
            res.on('data', function (chunk) {
                data += chunk;
            });
            res.on("end", function () {
                resolve(data);
            });
        }).on('error', (e) => {
            reject(e)
        });
    })

}

module.exports = {
    crawlGet
}