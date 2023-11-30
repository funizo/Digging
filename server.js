const express = require('express')
const app = express()
const path = require('path')
app.use(express.json())
const cors = require('cors')
app.use(express.json())
app.use(cors())
const { MongoClient } = require('mongodb')
const { ObjectId } = require('mongodb') 
let db
const url = 'mongodb+srv://panda:1234@panda.1pgmndf.mongodb.net/?retryWrites=true&w=majority'
new MongoClient(url).connect().then((client)=>{
  console.log('DB연결성공')
  db = client.db('panda')
}).catch((err)=>{
  console.log(err)
})



app.listen(8080, () => {
    console.log('http://localhost:8080 에서 서버 실행중')
})


app.use(express.static(path.join(__dirname, 'pandaproject/build')))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pandaproject/build/index.html'))
})

app.get('/mypage' ,async (req, res) => {
  console.log("mypage call "+ new Date());
  try {
    let result = await db.collection('post').findOne({ _id : new ObjectId("6566e9ed627b65215cfb1419") })
    console.log(result)
    res.send(result);
  } catch(error) {
    console.error('Error fetching data from MongoDB:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
})











//이거 맨밑으로
app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'pandaproject/build/index.html'))
})


