const express = require("express")
const cors = require("cors")
const path = require('path')
const fs = require('fs')

const app = express()

var corsOptions = {
  origin: "http://localhost:8080",
};

app.use(cors())

app.use(cors(corsOptions))

app.use(express.json())

const dir = path.join(__dirname, '/public')

app.use(express.static(dir))

app.get("/", (req, res) => {
  res.sendFile(dir + "/index.html");
});

app.get("/api", (req,res)=>{
    var data = fs.readFileSync(dir + "/db.json")
    data = JSON.parse(data)
    res.send(data)
})

app.get('/api/resources', (req,res) =>{
    //class to connect to the database
    const dbclient = require('mongodb').MongoClient;

    const link = "mongodb+srv://kunal_02:Kunald%402797@portfolio-mumbai.z4wh5.mongodb.net/wdad6655?retryWrites=true&w=majority";

    //create an arrow function to handle our connection;

    dbclient.connect(link, (err,db) =>{

        if(err){
            console.log(err)
        }

        else{
            console.log("Connected successfully")
            try {
                var dbo = db.db("wdad6655")
                dbo.collection("files").find({}, { _id: 0 }).toArray(function(err, result) {
                    if (err) throw err;
                    res.send(result)
                    db.close();
                  });
            } catch (error) {
                console.log("Failed to load data")
            }
                
        }
      })
    })


// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});