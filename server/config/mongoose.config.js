
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, {

    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
})
    .then(() => {
        console.log("Established connection to the database")

})
    .catch(err => console.log("Something went wrong ", err));
