const mongoose = require('mongoose')

const questionSchema = new mongoose.Schema({
    url: String,
    votes: Number,
    views: Number
})

const Question = new mongoose.model('Question', questionSchema)

class Database{
    
    async connect() {
        await mongoose.connect('mongodb://localhost:27017/myapp')
        console.log("Connected to MongoDB");
    }

    close() {
        console.log("shutting down mongo");
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
}

module.exports = Database