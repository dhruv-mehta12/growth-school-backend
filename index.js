const scrape = require('./scraper')
const Database = require('./database')
const { parse } = require('json2csv')
const fs = require('fs')

async function main() {
    try{
        const db = new Database()
        await db.connect()
        
        for (let i = 1; i <= 10000; i++) {
            scrape(i, db)
        }
        
        process.on('SIGINT', async () => {
            const allDocuments = await db.getAllDocuments()
            let extract = []
        
            for (document of allDocuments) {
                extract.push({
                    url: document.url,
                    votes: document.votes,
                    views: document.views
                })
            }
            const csv = parse(extract)
        
            fs.writeFileSync('./questions.csv', csv, 'utf8')

            console.log(`scraped ${await db.getCount()} questions`)
            console.log("Writing CSV...");
            console.log("Shutting down the application...");

            process.exit()
        })
    } catch (err) {
        console.log(`Error occured while scrapping: ${err}`)
    }
}

main()
