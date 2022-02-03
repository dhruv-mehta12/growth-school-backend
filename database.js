const mongoose = require('mongoose')

const questionSchema = new mongoose.Schema({
    url: String,
    votes: Number,
    views: String
})

const Question = new mongoose.model('Question', questionSchema)

class Database{
    
    async connect() {
        await mongoose.connect('mongodb://localhost:27017/growthSchoolDB')
        console.log("Connected to MongoDB");
    }

    close() {
        console.log("Shutting down mongo");
        mongoose.disconnect();
    }

    async addToDatabase(args){
        Question.create({url: args.url, votes: args.numberOfVotes, views: args.numberOfViews}, (err) => {
            if (err) {
                console.log(err.message);
            }
        })
    }

    async getAllDocuments() {
        return await Question.find({})
    }

    async getCount() {
        return await Question.count()
    }
}

module.exports = Database
