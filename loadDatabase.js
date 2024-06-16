const data = require('./test_data');
const Item = require("./models/item");
const mongoose = require("mongoose");

const URL = "mongodb+srv://demo:demo123@cluster0.9fys4ee.mongodb.net/project3?retryWrites=true&w=majority&appName=Cluster0"
mongoose.connect(URL)
    .then(() => {
        console.log("Connected");
        clear_data().then(load_data).then(() => {
            setTimeout(() => {
                console.log("Closing connection");
                mongoose.connection.close();
                process.exit(0)
            }, 5000);
        })
    })
    .catch(err => {
        console.error(err);
        console.error("Problem connecting. Exiting now");
        process.exit(1);
    });

const clear_data = async() => {
    return await Item.deleteMany()
        .then(() => {
            console.log("Data cleared");
        })
        .catch(err => {
            console.error("Error clearing data");
            console.error(err);
        });

}

const load_data = () => {
    for (let item of data) {
        console.info(`Processing item:`);
        console.info(item);
        const newItem = new Item({
            _id: new mongoose.Types.ObjectId(),
            title: item.name,
            details: item.details,
            image: item.image,
            seller: new mongoose.Types.ObjectId(item.seller),
            condition: item.condition,
            price: item.price,
            totalOffers: item.totalOffers,
            active: item.active
        });

        newItem.save()
            .then(result => {
                console.log(`item saved: ${ result }`);
            })
            .catch(err => {
                console.error("Error saving item");
                console.error(err);
            });
    }
}