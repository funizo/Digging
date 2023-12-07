const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const path = require("path");
const cors = require("cors");
const bcrypt = require("bcrypt");
const session = require("express-session");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
const { MongoClient } = require("mongodb");
const { ObjectId } = require("mongodb");
const MongoStore = require("connect-mongo");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(passport.initialize());
app.use(
  session({
    secret: "1234",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60 * 60 * 1000 },
    store: MongoStore.create({
      mongoUrl:
        "mongodb+srv://panda:1234@panda.1pgmndf.mongodb.net/?retryWrites=true&w=majority",
      dbName: "panda",
    }),
  })
);

app.use(passport.session());
let db;
const url =
  "mongodb+srv://panda:1234@panda.1pgmndf.mongodb.net/?retryWrites=true&w=majority";
new MongoClient(url)
  .connect()
  .then((client) => {
    console.log("DB연결성공");
    db = client.db("panda");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(8080, () => {
  console.log("http://localhost:8080 에서 서버 실행중");
});

app.use(express.static(path.join(__dirname, "pandaproject/build")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "pandaproject/build/index.html"));
});

passport.use(
  new LocalStrategy(async (EnterId, EnterPw, cb) => {
    let result = await db.collection("user").findOne({ username: EnterId });
    if (!result) {
      return cb(null, false, { message: "아이디 DB에 없음" });
    }
    if (result.password == EnterPw) {
      return cb(null, result);
    } else {
      return cb(null, false, { message: "비밀번호 불일치" });
    }
  })
);

function generateToken(user) {
  return jwt.sign(
    {
      id: user._id,
      username: user.username,
      address: user.address,
      subaddress: user.subaddress,
      email: user.email,
    },
    "your-secret-key"
  );
}

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("Bearer"), // 수정된 부분
  secretOrKey: "your-secret-key", // 사용할 시크릿 키
};
passport.use(
  new JwtStrategy(jwtOptions, (jwtPayload, cb) => {
    db.collection("user").findOne(
      { _id: new ObjectId(jwtPayload.id) },
      (err, user) => {
        if (err) {
          return cb(err, false);
        }
        if (user) {
          return cb(null, user);
        } else {
          return cb(null, false);
        }
      }
    );
  })
);

app.get(
  "/verify",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ message: "토큰이 유효합니다." });
  }
);

passport.serializeUser((user, done) => {
  process.nextTick(() => {
    done(null, { id: user._id, username: user.username });
  });
});

passport.deserializeUser(async (user, done) => {
  let result = await db
    .collection("user")
    .findOne({ _id: new ObjectId(user.id) });
  return done(null, result);
});

app.post("/signup", async (req, res) => {
  const userData = req.body;
  console.log(userData);

  await db.collection("user").insertOne({
    username: userData.username,
    email: userData.email,
    password: userData.password,
    address: userData.address,
    subaddress: userData.subaddress,
  });
  res.json({ message: "ok" });
});

app.post("/bookregister", upload.single("image"), async (req, res) => {
  // console.log(req.body);
  const writeData = req.body;

  await db.collection("book").insertOne({
    id: writeData.id,
    username: writeData.username,
    bookTitle: writeData.title,
    bookContent: writeData.content,
    price: writeData.price,
    bookImg: req.file ? req.file.location : "",
  });
  res.json({ message: "ok" });
});

app.get("/category/book", async (req, res) => {
  const result = await db.collection("book").find().toArray();
  res.json({ result: result });
});

app.get("/search", async (req, res) => {
  const result = await db
    .collection("book")
    .find({ bookTitle: { $regex: req.query.val } })
    .toArray();
  console.log(result);
  res.json({ result: result });
});

app.post("/login", (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(401).json({ error: info.message });

    const token = generateToken(user);
    const expiration = new Date(Date.now() + 60 * 60 * 1000); // 1시간
    res.json({ token, expiration: expiration.getTime() });
    console.log("Server Log:", { token, expiration });
  })(req, res, next);
});
app.post("/logout", (req, res) => {
  // 클라이언트 측에서의 토큰 및 만료 시간 삭제
  res.clearCookie("token");
  res.clearCookie("tokenExpiration");

  // 또는 클라이언트 측에서 사용하는 로컬 스토리지의 값 삭제
  localStorage.removeItem("token");
  localStorage.removeItem("tokenExpiration");

  res.json({ message: "로그아웃 성공" });
});

app.get(
  "/protected",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ message: "Protected resource" });
  }
);

app.get(
  "/mypage",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      address: req.user.address,
      subaddress: req.user.subaddress,
    });
  }
);

app.post("/board", async (req, res) => {
  const boardData = req.body;
  const today = new Date();
  const year = today.getFullYear().toString().slice(-2);
  const month = ("0" + (today.getMonth() + 1)).slice(-2);
  const day = ("0" + today.getDate()).slice(-2);
  const formattedDate = `${year}. ${month}. ${day}`;
  boardData.date = formattedDate;

  await db.collection("board").insertOne({
    id: boardData.id,
    number: boardData.number,
    title: boardData.title,
    content: boardData.content,
    writer: boardData.writer,
    views: boardData.views,
    date: boardData.date,
  });
  res.json({ message: "ok" });
});

app.get("/board", async (req, res) => {
  try {
    const boardData = await db.collection("board").find({}).toArray();
    res.json(boardData);
  } catch (error) {
    console.error("패치 에러:", error.message);
    res.status(500).json({ error: "서버에러" });
  }
});

app.get("/board/:id", async (req, res) => {
  let result = await db
    .collection("board")
    .find()
    .skip((req.params.id - 1) * 5)
    .limit(5)
    .toArray();
  res.render("board.ejs", { 게시판: result });
});

app.delete("/category/book/bookdetail", async (req, res) => {
  console.log(req.body._id);
  try {
    const bookId = req.body._id;
    await db.collection("book").deleteOne({ _id: new ObjectId(bookId) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "서버 오류" });
  }
  res.send("삭제완료");
});

app.post("/edit", upload.single("image"), async (req, res) => {
  let objId = new ObjectId(req.body._id);
  await db.collection("book").updateOne(
    { _id: objId },
    {
      $set: {
        id: req.body.id,
        username: req.body.username,
        bookTitle: req.body.title,
        bookContent: req.body.content,
        price: req.body.price,
        bookImg: req.file ? req.file.location : "",
      },
    }
  );
  res.json({ message: "ok" });
});

app.post("/addToWishlist", upload.single("image"), async (req, res) => {
  let objId = new ObjectId(req.body.id);
  console.log(req.body);
  console.log(objId);
  await db.collection("user").updateOne(
    { _id: objId },
    {
      $set: {
        bookTitle: req.body.title,
        price: req.body.price,
        bookImg: req.body.image,
      },
    }
  );
  res.json({ message: "ok" });
});

//이거 맨밑으로
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "pandaproject/build/index.html"));
});
