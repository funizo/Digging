const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const cors = require('cors');
const bcrypt = require('bcrypt');
const session = require('express-session');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const { MongoClient } = require('mongodb');
const { ObjectId } = require('mongodb') ;
const MongoStore = require('connect-mongo');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
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
  let result = await db.collection('user').findOne({ username: EnterId });
  if (!result) {
    return cb(null, false, { message: '아이디 DB에 없음' });
  }
  if (result.password == EnterPw) {
    return cb(null, result);
  } else {
    return cb(null, false, { message: '비밀번호 불일치' });
  }
}));
function generateToken(user) {
  return jwt.sign({ 
    id: user._id, 
    username: user.username, 
    address: user.address, 
    subaddress: user.subaddress, 
    email: user.email }, 'your-secret-key');
}

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'), // 수정된 부분
  secretOrKey: 'your-secret-key', // 사용할 시크릿 키
};
passport.use(new JwtStrategy(jwtOptions, (jwtPayload, cb) => {
  db.collection('user').findOne({ _id: new ObjectId(jwtPayload.id) }, (err, user) => {
    if (err) {
      return cb(err, false);
    }
    if (user) {
      return cb(null, user);
    } else {
      return cb(null, false);
    }
  });
}));


passport.serializeUser((user, done) => {
  process.nextTick(() => {
    done(null, { id: user._id, username: user.username })
  })
})

passport.deserializeUser(async(user, done) => {
  let result = await db.collection('user').findOne({_id : new ObjectId(user.id) })  
  return done(null, result)
  });






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
  res.json({ message: 'ok' });
});


app.post('/login' , (req,res,next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(401).json({ error: info.message });

    const token = generateToken(user);
    res.json({ token });
  })(req, res, next);
});

app.get('/protected', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({ message: 'Protected resource' });
});

app.get('/mypage', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({
    id: req.user._id,
    username: req.user.username,
    email: req.user.email,
    address: req.user.address,
    subaddress: req.user.subaddress,
  });
});






//이거 맨밑으로
app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'pandaproject/build/index.html'))
})


