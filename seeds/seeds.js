const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { descriptors, places, imageFileNames, imageURLs } = require('./seedHelpers');

mongoose.connect('mongodb+srv://dbadmin:0SA0wdnCRv14XFFA@yelpcampcluster.tghp0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Successfully connected to MongoDB.")
    })
    .catch((err) => {
        console.log("Error in MongoDB connection:");
        console.log(err);
    });

const sample = array => array[Math.floor(Math.random() * array.length)];

async function seedDB() {
    await Campground.deleteMany({});
    for (let i = 0; i < 100; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const random15 = Math.floor(Math.random() * 15);
        let ran15 = Math.floor(Math.random() * 15);
        while (ran15 === random15) {
            ran15 = Math.floor(Math.random() * 15);
        }
        const price = 10 + Math.floor(Math.random() * 20);
        const cg = new Campground({
            author: '604cacdf69a5970015ea83aa',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            geometry: {
                type: "Point",
                coordinates: [cities[random1000].longitude, cities[random1000].latitude]
            },
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                {
                    filename: imageFileNames[random15],
                    url: imageURLs[random15]
                },
                {
                    filename: imageFileNames[ran15],
                    url: imageURLs[ran15]
                }
            ],
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Et placeat architecto dolores nulla voluptates, a animi dicta labore explicabo beatae facere omnis quidem eos, odio ipsa ducimus necessitatibus ratione amet, nobis id nisi quas quo! Facere?',
            price: price
        })
        await cg.save();
    }
}

seedDB();