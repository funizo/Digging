const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const cors = require('cors');
const bcrypt = require('bcrypt');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const { MongoClient } = require('mongodb');
const { ObjectId } = require('mongodb') ;
const MongoStore = require('connect-mongo');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.json());
app.use(cors());
app.use(passport.initialize());
app.use(session({
  secret: '1234',
  resave : false,
  saveUninitialized : false,
  cookie : { maxAge : 60 * 60 * 1000 },
  store: MongoStore.create({
    mongoUrl:'mongodb+srv://panda:1234@panda.1pgmndf.mongodb.net/?retryWrites=true&w=majority',
    dbName: 'panda'
  })
}));

app.use(passport.session())
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

passport.use(new LocalStrategy(async (EnterId, EnterPw, cb) => {
  let result = await db.collection('user').findOne({ username : EnterId});
  if (!result) {
    return cb(null, false, { message: '아이디 DB에 없음' });
  }
  if (result.password == EnterPw) {
    return cb(null, result);
  } else {
    return cb(null, false, { message: '비번불일치' });
  }
}))

passport.serializeUser((user, done) => {
  process.nextTick(() => {
    done(null, { id: user._id, username: user.username })
  })
})

passport.deserializeUser(async(user, done) => {
  let result = await db.collection('user').findOne({_id : new ObjectId(user.id) })
  
  process.nextTick(() => {
    return done(null, result)
  })
})





app.post('/signup' ,async (req, res) => {
  const userData = req.body;
  console.log(userData);
  
  await db.collection('user').insertOne({
    username:userData.username,
    email:userData.email,
    password:userData.password,
    address:userData.address,
    subaddress:userData.subaddress
  });
  res.send("ok");
});


app.post('/login' , async(req,res,next) => {
  passport.authenticate('local',(error,user,info)=>{
    if (error) return res.status(500).json(error)
    if (!user) return res.status(401).json(info.message)
    req.logIn(user,(err)=> {
      if(err) return next(err);
      res.send("ok");
    })
  })(req, res, next);
});

app.get('/mypage', async(req,res) => {
  console.log(req.user);

});






//이거 맨밑으로
app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'pandaproject/build/index.html'))
})


