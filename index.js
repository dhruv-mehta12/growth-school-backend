const scrape = require('./scrapper')
const Database = require('./database')
const { parse } = require('json2csv')
const fs = require('fs')

async function main() {
    const db = new Database()
    await db.connect()
    
    for (let i = 1; i <= 2; i++) {
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

        console.log("writing csv and gracefully shutting down application");
        process.exit()
    })
}

main()