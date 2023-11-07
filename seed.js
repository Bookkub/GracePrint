const mongoose = require('mongoose'),
    Printmodel = require('./model/print'),
    Commentmodel = require('./model/comment');

// const data = [{
//     name: 'Apple',
//     artist: 'Monalisa',
//     url: 'https://i.pinimg.com/originals/3d/72/0b/3d720bed8403105862e6fb182edae081.jpg'
// },
// {
//     name: 'Pear',
//     artist: 'Mano',
//     url: 'https://images-prod.healthline.com/hlcmsresource/images/AN_images/benefits-of-pears-1296x728-feature.jpg'
// },
// {
//     name: 'Lemon',
//     artist: 'Seesal',
//     url: 'https://www.tastingtable.com/img/gallery/31-types-of-lemons-and-what-makes-them-unique/l-intro-1656086555.jpg'
// }];

async function seedDB() {
    await Printmodel.deleteMany({}).then(() => {
        console.log('Data removal completer');
        // data.forEach(async function (seed) {
        //     try {
        //         const seedPrint = await Printmodel.create(seed)
        //         console.log('New data added');
        //         // try {
        //         //     const comment = await Commentmodel.create({
        //         //         author: 'Tony Stark',
        //         //         text: 'This is my Fav!'
        //         //     })
        //         //     seedPrint.comments.push(comment);
        //         //     seedPrint.save();
        //         // } catch (err) {
        //         //     console.log(err);
        //         // }
        //     } catch (err) {
        //         console.log(err)
        //     }
        // })
    }).catch(err => {
        console.log(err);
    })
}

module.exports = seedDB;