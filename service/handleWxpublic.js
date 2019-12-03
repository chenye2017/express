const jsdom = require('jsdom')
const {JSDOM} = jsdom
const cheerio = require('cheerio')

function handleWxPublic(data)
{
    const dom = new JSDOM(data, { runScripts: "dangerously" });
    var back = dom.window.document.getElementById('js_content').innerHTML
    /*$ = cheerio.load(data)
    let back = $('#js_content').html()*/
    return back
}

module.exports = {
    handleWxPublic
}