const mongoose = require("mongoose");
const Product = require("./models/productModel");

const furnitureNames = [
    "Wooden Sofa",
    "King Size Bed",
    "Dining Table",
    "Office Chair",
    "Study Table",
    "Wardrobe",
    "Bookshelf",
    "Coffee Table",
    "TV Unit",
    "Recliner Chair"
];


const products = [];


for(let i = 1; i <= 100; i++){

    products.push({

        name: `${furnitureNames[i % furnitureNames.length]} ${i}`,

        description: "Premium quality furniture for home and office",

        price: Math.floor(Math.random() * 90000) + 5000,

        category: "Accessories",

        brand: "WoodCraft",

        stock: Math.floor(Math.random()*50)+1,

        images:[
            "furniture.jpg"
        ],

        isFeatured: i % 2 === 0,

        discount: Math.floor(Math.random()*20),

        specs:{
            color:"Brown",
            material:"Wood",
            modelNo:`F-${i}`
        }

    });

}



// पहले function बनाएं
async function seedProducts(){

    try{

        await Product.insertMany(products);

        console.log("100 Furniture Products Added");

        process.exit();

    }
    catch(error){

        console.log(error);

        process.exit(1);

    }

}
mongoose.connect("mongodb://127.0.0.1:27017/authDB")
.then(()=>{

    console.log("MongoDB Connected");

    seedProducts();

})
.catch(err=>{

    console.log(err);

});