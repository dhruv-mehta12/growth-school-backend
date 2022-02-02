const cheerio = require('cheerio')
const request = require('request-promise')
const Bottleneck = require('bottleneck')
// # SETTING MAX CONCURRENCY AS 5
const limiter = new Bottleneck({
    maxConcurrent: 5,
    minTimeout: 1000
  });

const {QUESTION_URL, VOTES, VIEWS} = require('./selectors')

// Main scraping function
async function scrape(pageNo, db){

    console.log(`Scraping page ${pageNo}`)
    try{
        const response = await limiter.schedule(() => request.get({
            uri: `https://stackoverflow.com/questions?tab=newest&page=${pageNo}`,
            gzip: true
            }))
    
        const $ = cheerio.load(response)

        const questionUrls = $(QUESTION_URL)
        const votes        = $(VOTES)
        const views        = $(VIEWS)
                        
        for (let i = 0; i < questionUrls.length; i++) {
            try{
                const questionUrl       = questionUrls[i.toString()]["attribs"]["href"]
                const vote              = votes[i.toString()]["children"][0]["data"]
                const view              = views[i.toString()]["children"][0]["data"]
                console.log({questionUrl, vote, view})

                const add = {
                    url: questionUrl,
                    numberOfVotes: vote,
                    numberOfViews: view
                }

                db.addToDatabase(add)

            } catch (e) {
                console.log(e)
            }
        }
    } catch(e){
        console.log(e)
    }
}

module.exports = scrape
