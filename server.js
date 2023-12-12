const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const cors = require('cors');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
require('dotenv').config();
const { MongoClient } = require('mongodb');
const { ObjectId } = require('mongodb');
const { S3Client } = require('@aws-sdk/client-s3');
const multer = require('multer');
const multerS3 = require('multer-s3');
const s3 = new S3Client({
    region: 'ap-northeast-2',
    credentials: {
        accessKeyId: process.env.S3_KEY,
        secretAccessKey: process.env.S3_SECRET,
    },
});

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'digging',
        key: function (req, file, cb) {
            cb(null, Date.now().toString()); //업로드시 파일명 변경가능
        },
    }),
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(passport.initialize());

let db;
const url =
    'mongodb+srv://panda:1234@panda.1pgmndf.mongodb.net/?retryWrites=true&w=majority';
new MongoClient(url)
    .connect()
    .then((client) => {
        console.log('DB연결성공');
        db = client.db('panda');
    })
    .catch((err) => {
        console.log(err);
    });

app.listen(8080, () => {
    console.log('http://localhost:8080 에서 서버 실행중');
});

app.use(express.static(path.join(__dirname, 'pandaproject/build')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pandaproject/build/index.html'));
});

passport.use(
    new LocalStrategy(async (EnterId, EnterPw, cb) => {
        let result = await db.collection('user').findOne({ username: EnterId });
        if (!result) {
            return cb(null, false, { message: '아이디 DB에 없음' });
        }
        if (result.password == EnterPw) {
            return cb(null, result);
        } else {
            return cb(null, false, { message: '비밀번호 불일치' });
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
        'your-secret-key'
    );
}

function getFormattedDate() {
    const today = new Date();
    const year = today.getFullYear().toString().slice(-2);
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const day = ('0' + today.getDate()).slice(-2);
    return `${year}. ${month}. ${day}`;
}

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'), // 수정된 부분
    secretOrKey: 'your-secret-key', // 사용할 시크릿 키
};
passport.use(
    new JwtStrategy(jwtOptions, (jwtPayload, cb) => {
        db.collection('user').findOne(
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
    '/verify',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        res.json({ message: '토큰이 유효합니다.' });
    }
);

app.post('/signup', async (req, res) => {
    const userData = req.body;
    console.log(userData);

    await db.collection('user').insertOne({
        username: userData.username,
        email: userData.email,
        password: userData.password,
        address: userData.address,
        subaddress: userData.subaddress,
    });
    res.json({ message: 'ok' });
});

///////////////////////////////////////////////////

app.post('/bookregister', upload.single('image'), async (req, res) => {
    // console.log(req.body);
    const writeData = req.body;

    await db.collection('book').insertOne({
        id: writeData.id,
        username: writeData.username,
        bookTitle: writeData.title,
        bookContent: writeData.content,
        price: writeData.price,
        bookImg: req.file ? req.file.location : '',
    });
    res.json({ message: 'ok' });
});

app.get('/category/book', async (req, res) => {
    const result = await db.collection('book').find().toArray();
    res.json({ result: result });
});
app.get('/book/search', async (req, res) => {
    const result = await db
        .collection('book')
        .find({ bookTitle: { $regex: req.query.val } })
        .toArray();
    console.log(result);
    res.json({ result: result });
});

app.delete('/category/book/bookdetail', async (req, res) => {
    console.log(req.body._id);
    try {
        const bookId = req.body._id;
        await db.collection('book').deleteOne({ _id: new ObjectId(bookId) });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '서버 오류' });
    }
    res.send('삭제완료');
});

app.post('/book/bookedit', upload.single('image'), async (req, res) => {
    let objId = new ObjectId(req.body._id);
    await db.collection('book').updateOne(
        { _id: objId },
        {
            $set: {
                id: req.body.id,
                username: req.body.username,
                bookTitle: req.body.title,
                bookContent: req.body.content,
                price: req.body.price,
                bookImg: req.file ? req.file.location : '',
            },
        }
    );
    res.json({ message: 'ok' });
});

///////////////////////////////////////////////////

app.get('/category/fashion', async (req, res) => {
    const result = await db.collection('fashion').find().toArray();
    res.json({ result: result });
});

app.post('/fashionregister', upload.single('image'), async (req, res) => {
    // console.log(req.body);
    const writeData = req.body;

    await db.collection('fashion').insertOne({
        id: writeData.id,
        username: writeData.username,
        fashionTitle: writeData.title,
        fashionContent: writeData.content,
        price: writeData.price,
        fashionImg: req.file ? req.file.location : '',
    });
    res.json({ message: 'ok' });
});

app.get('/fashion/search', async (req, res) => {
    const result = await db
        .collection('fashion')
        .find({ fashionTitle: { $regex: req.query.val } })
        .toArray();
    console.log(result);
    res.json({ result: result });
});

app.delete('/category/fashion/fashiondetail', async (req, res) => {
    console.log(req.body._id);
    try {
        const fashionId = req.body._id;
        await db
            .collection('fashion')
            .deleteOne({ _id: new ObjectId(fashionId) });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '서버 오류' });
    }
    res.send('삭제완료');
});

app.post('/fashion/fashionedit', upload.single('image'), async (req, res) => {
    let objId = new ObjectId(req.body._id);
    await db.collection('fashion').updateOne(
        { _id: objId },
        {
            $set: {
                id: req.body.id,
                username: req.body.username,
                fashionTitle: req.body.title,
                fashionContent: req.body.content,
                price: req.body.price,
                fashionImg: req.file ? req.file.location : '',
            },
        }
    );
    res.json({ message: 'ok' });
});

///////////////////////////////////////////////////

app.get('/category/electronic', async (req, res) => {
    const result = await db.collection('electronic').find().toArray();
    res.json({ result: result });
});

app.post('/electronicregister', upload.single('image'), async (req, res) => {
    // console.log(req.body);
    const writeData = req.body;

    await db.collection('electronic').insertOne({
        id: writeData.id,
        username: writeData.username,
        electronicTitle: writeData.title,
        electronicContent: writeData.content,
        price: writeData.price,
        electronicImg: req.file ? req.file.location : '',
    });
    res.json({ message: 'ok' });
});

app.get('/electronic/search', async (req, res) => {
    const result = await db
        .collection('electronic')
        .find({ electronicTitle: { $regex: req.query.val } })
        .toArray();
    console.log(result);
    res.json({ result: result });
});

app.delete('/category/electronic/electronicdetail', async (req, res) => {
    console.log(req.body._id);
    try {
        const electronicId = req.body._id;
        await db
            .collection('electronic')
            .deleteOne({ _id: new ObjectId(electronicId) });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '서버 오류' });
    }
    res.send('삭제완료');
});

app.post(
    '/electronic/electronicedit',
    upload.single('image'),
    async (req, res) => {
        let objId = new ObjectId(req.body._id);
        await db.collection('electronic').updateOne(
            { _id: objId },
            {
                $set: {
                    id: req.body.id,
                    username: req.body.username,
                    electronicTitle: req.body.title,
                    electronicContent: req.body.content,
                    price: req.body.price,
                    electronicImg: req.file ? req.file.location : '',
                },
            }
        );
        res.json({ message: 'ok' });
    }
);

///////////////////////////////////////////////////

app.get('/category/toy', async (req, res) => {
    const result = await db.collection('toy').find().toArray();
    res.json({ result: result });
});

app.post('/toyregister', upload.single('image'), async (req, res) => {
    // console.log(req.body);
    const writeData = req.body;

    await db.collection('toy').insertOne({
        id: writeData.id,
        username: writeData.username,
        toyTitle: writeData.title,
        toyContent: writeData.content,
        price: writeData.price,
        toyImg: req.file ? req.file.location : '',
    });
    res.json({ message: 'ok' });
});

app.get('/toy/search', async (req, res) => {
    const result = await db
        .collection('toy')
        .find({ toyTitle: { $regex: req.query.val } })
        .toArray();
    console.log(result);
    res.json({ result: result });
});

app.delete('/category/toy/toydetail', async (req, res) => {
    console.log(req.body._id);
    try {
        const toyId = req.body._id;
        await db.collection('toy').deleteOne({ _id: new ObjectId(toyId) });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '서버 오류' });
    }
    res.send('삭제완료');
});

app.post('/toy/toyedit', upload.single('image'), async (req, res) => {
    let objId = new ObjectId(req.body._id);
    await db.collection('toy').updateOne(
        { _id: objId },
        {
            $set: {
                id: req.body.id,
                username: req.body.username,
                toyTitle: req.body.title,
                toyContent: req.body.content,
                price: req.body.price,
                toyImg: req.file ? req.file.location : '',
            },
        }
    );
    res.json({ message: 'ok' });
});

///////////////////////////////////////////////////

app.get('/category/goods', async (req, res) => {
    const result = await db.collection('goods').find().toArray();
    res.json({ result: result });
});

app.post('/goodsregister', upload.single('image'), async (req, res) => {
    // console.log(req.body);
    const writeData = req.body;

    await db.collection('goods').insertOne({
        id: writeData.id,
        username: writeData.username,
        goodsTitle: writeData.title,
        goodsContent: writeData.content,
        price: writeData.price,
        goodsImg: req.file ? req.file.location : '',
    });
    res.json({ message: 'ok' });
});

app.get('/goods/search', async (req, res) => {
    const result = await db
        .collection('goods')
        .find({ goodsTitle: { $regex: req.query.val } })
        .toArray();
    console.log(result);
    res.json({ result: result });
});

app.delete('/category/goods/goodsdetail', async (req, res) => {
    console.log(req.body._id);
    try {
        const goodsId = req.body._id;
        await db.collection('goods').deleteOne({ _id: new ObjectId(goodsId) });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '서버 오류' });
    }
    res.send('삭제완료');
});

app.post('/goods/goodsedit', upload.single('image'), async (req, res) => {
    let objId = new ObjectId(req.body._id);
    await db.collection('goods').updateOne(
        { _id: objId },
        {
            $set: {
                id: req.body.id,
                username: req.body.username,
                goodsTitle: req.body.title,
                goodsContent: req.body.content,
                price: req.body.price,
                goodsImg: req.file ? req.file.location : '',
            },
        }
    );
    res.json({ message: 'ok' });
});

///////////////////////////////////////////////////

app.post('/login', (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!user) return res.status(401).json({ error: info.message });

        const token = generateToken(user);
        const expiration = new Date(Date.now() + 60 * 60 * 1000); // 1시간
        res.json({ token, expiration: expiration.getTime() });
        console.log('Server Log:', { token, expiration });
    })(req, res, next);
});

app.post('/logout', (req, res) => {
    // 클라이언트 측에서의 토큰 및 만료 시간 삭제
    res.clearCookie('token');
    res.clearCookie('tokenExpiration');

    // 또는 클라이언트 측에서 사용하는 로컬 스토리지의 값 삭제
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiration');

    res.json({ message: '로그아웃 성공' });
});

app.get(
    '/protected',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        res.json({ message: 'Protected resource' });
    }
);

app.get(
    '/mypage',
    passport.authenticate('jwt', { session: false }),
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

app.delete('/category/book/bookdetail', async (req, res) => {
    console.log(req.body._id);
    try {
        const bookId = req.body._id;
        await db.collection('book').deleteOne({ _id: new ObjectId(bookId) });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '서버 오류' });
    }
    res.send('삭제완료');
});

app.post('/edit', upload.single('image'), async (req, res) => {
    let objId = new ObjectId(req.body._id);
    await db.collection('book').updateOne(
        { _id: objId },
        {
            $set: {
                id: req.body.id,
                username: req.body.username,
                bookTitle: req.body.title,
                bookContent: req.body.content,
                price: req.body.price,
                bookImg: req.file ? req.file.location : '',
            },
        }
    );
    res.json({ message: 'ok' });
});

app.post('/addToWishlist', upload.single('image'), async (req, res) => {
    let objId = new ObjectId(req.body.id);
    console.log(req.body);
    console.log(objId);
    await db.collection('user').updateOne(
        { _id: objId },
        {
            $set: {
                bookTitle: req.body.title,
                price: req.body.price,
                bookImg: req.body.image,
            },
        }
    );
    res.json({ message: 'ok' });
});
/////////////////////////////////////////////////////
app.get('/board', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = 10;
        const skip = (page - 1) * pageSize;

        const result = await db
            .collection('board')
            .find()
            .skip(skip)
            .limit(pageSize)
            .toArray();

        res.json({ result });
    } catch (error) {
        console.error('게시판 데이터를 가져오는 중 에러 발생:', error);
        res.status(500).json({
            message: '게시판 데이터를 가져오는 중 에러가 발생했습니다.',
        });
    }
});
app.post('/board', async (req, res) => {
    const boardData = req.body;
    boardData.date = getFormattedDate(); //함수 받아오기;

    await db.collection('board').insertOne({
        id: boardData.id,
        title: boardData.title,
        content: boardData.content,
        writer: boardData.writer,
        views: boardData.views,
        date: boardData.date,
        comments: [],
    });
    res.json({ message: 'ok' });
});

app.get('/board', async (req, res) => {
    try {
        const boardData = await db.collection('board').find({}).toArray();
        res.json(boardData);
    } catch (error) {
        console.error('패치 에러:', error.message);
        res.status(500).json({ error: '서버에러' });
    }
});

app.post('/board_detail/:postId', async (req, res) => {
    const postId = req.params.content;
    console.log('req.params.postId:', req.params.postId);
    console.log('req.body:', req.body);
    console.log('postId:', postId);

    // Check if it's a comment or a post view
    if (req.body) {
        // If it has content in the body, it's a comment

        const commentdata = req.body;
        console.log('commentdata', commentdata);

        try {
            await db.collection('comment123').insertOne({
                postId: commentdata.postId,
                content: commentdata.content,
                writerId: commentdata.writerId,
                writer: commentdata.writer,
            });

            res.json({ message: 'ok' });
        } catch (error) {
            console.error('Error adding comment:', error.message);
            res.status(500).json({ message: 'Internal server error' });
        }
    } else {
        // If it doesn't have content in the body, it's a post view
        try {
            // 클라이언트에서 전달한 postId를 사용하여 해당 게시물을 찾음
            const post = await db
                .collection('board')
                .findOne({ _id: new ObjectId(postId) });
            if (!post) {
                return res.status(404).json({ message: 'Post not found' });
            }
            const result = await db.collection('board').updateOne(
                { _id: new ObjectId(postId) },
                { $inc: { views: 1 } } // views를 1 증가시킴
            );
            if (result.matchedCount === 1) {
                res.json({ message: 'OK' });
            } else {
                res.status(404).json({ message: 'Post not found' });
            }
        } catch (error) {
            console.error('Error updating views:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
});

// app.get('/board_detail/:postId', async (req, res) => {
//     const postId = req.params.postId;
//     try {
//         // 클라이언트에서 전달한 postId를 사용하여 해당 게시물을 찾음
//         const post = await db
//             .collection('board')
//             .findOne({ _id: new ObjectId(postId) });

//         if (!post) {
//             return res.status(404).json({ message: 'Post not found' });
//         }

//         res.json(post);
//     } catch (error) {
//         console.error('Error fetching post detail:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// });
app.get('/board_detail/:postId', async (req, res) => {
    const postId = req.params.postId;
    try {
        // 클라이언트에서 전달한 postId를 사용하여 해당 게시물을 찾음
        const post = await db
            .collection('board')
            .findOne({ _id: new ObjectId(postId) });

        const comments = await db
            .collection('comment123')
            .find({ postId: postId })
            .toArray();

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // 게시물과 댓글을 하나의 응답 객체로 합침
        const responseData = {
            post: post,
            comments: comments,
        };

        res.json(responseData);
    } catch (error) {
        console.error('Error fetching post detail:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.put('/board_edit/:postId', async (req, res) => {
    const { postId } = req.params;
    const updatedData = req.body;
    console.log('postId', postId);
    console.log('updatedData', updatedData);
    try {
        await db.collection('board').updateOne(
            { _id: new ObjectId(postId) },
            {
                $set: {
                    title: updatedData.title,
                    content: updatedData.content,
                },
            }
        );

        res.json({ message: 'ok' });
    } catch (error) {
        console.error('수정 에러:', error.message);
        res.status(500).json({ error: '서버 에러' });
    }
});
app.delete('/board_detail/:postId', async (req, res) => {
    const { postId } = req.params;
    const { action, commentId } = req.body;

    try {
        if (action === 'deleteComment') {
            console.log('test');
            // 댓글 삭제 처리
            const result = await db.collection('comment123').deleteOne({
                _id: new ObjectId(commentId),
                postId: postId,
            });

            if (result.deletedCount === 1) {
                res.json({ message: '댓글 삭제 성공' });
            } else {
                res.status(404).json({ error: '댓글을 찾을 수 없습니다.' });
            }
        } else if (action === 'deletePost') {
            // 게시물 삭제 처리
            const result = await db.collection('board').deleteOne({
                _id: new ObjectId(postId),
            });

            if (result.deletedCount === 1) {
                res.json({ message: '게시물 삭제 성공' });
            } else {
                res.status(404).json({ error: '게시물을 찾을 수 없습니다.' });
            }
        } else {
            res.status(400).json({ error: '잘못된 요청입니다.' });
        }
    } catch (error) {
        console.error('삭제 에러:', error.message);
        res.status(500).json({ error: '서버 에러' });
    }
});

/////////////////////////////////////////////////ticket
app.get('/category/ticket', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = 10;
        const skip = (page - 1) * pageSize;

        const result = await db
            .collection('ticket')
            .find()
            .skip(skip)
            .limit(pageSize)
            .toArray();

        res.json({ result });
    } catch (error) {
        console.error('게시판 데이터를 가져오는 중 에러 발생:', error);
        res.status(500).json({
            message: '게시판 데이터를 가져오는 중 에러가 발생했습니다.',
        });
    }
});
app.post('/category/ticket', async (req, res) => {
    const ticketData = req.body;
    ticketData.date = getFormattedDate(); //함수 받아오기;
    console.log(ticketData);
    console.log(
        'Received views:',
        ticketData.views,
        'Type:',
        typeof ticketData.views
    );

    await db.collection('ticket').insertOne({
        id: ticketData.id,
        title: ticketData.title,
        content: ticketData.content,
        writer: ticketData.writer,
        views: ticketData.views,
        date: ticketData.date,
    });
    res.json({ message: 'ok' });
});

app.get('/category/ticket', async (req, res) => {
    try {
        const ticketData = await db.collection('ticket').find({}).toArray();
        res.json(ticketData);
    } catch (error) {
        console.error('패치 에러:', error.message);
        res.status(500).json({ error: '서버에러' });
    }
});

app.post('/category/ticket_detail/:postId', async (req, res) => {
    const postId = req.params.postId;
    try {
        // 클라이언트에서 전달한 postId를 사용하여 해당 게시물을 찾음
        const post = await db
            .collection('ticket')
            .findOne({ _id: new ObjectId(postId) });
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        const result = await db.collection('ticket').updateOne(
            { _id: new ObjectId(postId) },
            { $inc: { views: 1 } } // views를 1 증가시킴
        );
        if (result.matchedCount === 1) {
            res.json({ message: 'OK' });
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    } catch (error) {
        console.error('Error updating views:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/category/ticket_detail/:postId', async (req, res) => {
    const postId = req.params.postId;
    try {
        // 클라이언트에서 전달한 postId를 사용하여 해당 게시물을 찾음
        const post = await db
            .collection('ticket')
            .findOne({ _id: new ObjectId(postId) });

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.json(post);
    } catch (error) {
        console.error('Error fetching post detail:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.put('/category/ticket_edit/:postId', async (req, res) => {
    const { postId } = req.params;
    const updatedData = req.body;
    console.log('postId', postId);
    console.log('updatedData', updatedData);
    try {
        await db.collection('ticket').updateOne(
            { _id: new ObjectId(postId) },
            {
                $set: {
                    title: updatedData.title,
                    content: updatedData.content,
                },
            }
        );

        res.json({ message: 'ok' });
    } catch (error) {
        console.error('수정 에러:', error.message);
        res.status(500).json({ error: '서버 에러' });
    }
});
app.delete('/category/ticket_detail/:postId', async (req, res) => {
    const { postId } = req.params;
    console.log(postId, postId);
    try {
        const result = await db.collection('ticket').deleteOne({
            _id: new ObjectId(postId),
        });

        if (result.deletedCount === 1) {
            res.json({ message: 'ok' });
        } else {
            res.status(404).json({ error: '게시물을 찾을 수 없습니다.' });
        }
    } catch (error) {
        console.error('삭제 에러:', error.message);
        res.status(500).json({ error: '서버 에러' });
    }
});
///////////////////////////////////////////////////
app.post('/share', async (req, res) => {
    const shareData = req.body;
    shareData.date = getFormattedDate(); //함수 받아오기;

    console.log(
        'Received views:',
        shareData.views,
        'Type:',
        typeof shareData.views
    );

    await db.collection('share').insertOne({
        id: shareData.id,
        title: shareData.title,
        content: shareData.content,
        writer: shareData.writer,
        views: shareData.views,
        date: shareData.date,
    });
    res.json({ message: 'ok' });
});

app.get('/share', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = 10;
        const skip = (page - 1) * pageSize;

        const result = await db
            .collection('share')
            .find()
            .skip(skip)
            .limit(pageSize)
            .toArray();

        res.json({ result });
    } catch (error) {
        console.error('게시판 데이터를 가져오는 중 에러 발생:', error);
        res.status(500).json({
            message: '게시판 데이터를 가져오는 중 에러가 발생했습니다.',
        });
    }
});

app.get('/share', async (req, res) => {
    try {
        const shareData = await db.collection('share').find({}).toArray();
        res.json(shareData);
    } catch (error) {
        console.error('패치 에러:', error.message);
        res.status(500).json({ error: '서버에러' });
    }
});

app.post('/share_detail/:postId', async (req, res) => {
    const postId = req.params.postId;
    try {
        // 클라이언트에서 전달한 postId를 사용하여 해당 게시물을 찾음
        const post = await db
            .collection('share')
            .findOne({ _id: new ObjectId(postId) });
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        const result = await db.collection('share').updateOne(
            { _id: new ObjectId(postId) },
            { $inc: { views: 1 } } // views를 1 증가시킴
        );
        if (result.matchedCount === 1) {
            res.json({ message: 'OK' });
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    } catch (error) {
        console.error('Error updating views:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/share_detail/:postId', async (req, res) => {
    const postId = req.params.postId;
    try {
        // 클라이언트에서 전달한 postId를 사용하여 해당 게시물을 찾음
        const post = await db
            .collection('share')
            .findOne({ _id: new ObjectId(postId) });

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.json(post);
    } catch (error) {
        console.error('Error fetching post detail:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.put('/share_edit/:postId', async (req, res) => {
    const { postId } = req.params;
    const updatedData = req.body;
    console.log('postId', postId);
    console.log('updatedData', updatedData);
    try {
        await db.collection('share').updateOne(
            { _id: new ObjectId(postId) },
            {
                $set: {
                    title: updatedData.title,
                    content: updatedData.content,
                },
            }
        );

        res.json({ message: 'ok' });
    } catch (error) {
        console.error('수정 에러:', error.message);
        res.status(500).json({ error: '서버 에러' });
    }
});
app.delete('/share_detail/:postId', async (req, res) => {
    const { postId } = req.params;
    console.log(postId, postId);
    try {
        const result = await db.collection('share').deleteOne({
            _id: new ObjectId(postId),
        });

        if (result.deletedCount === 1) {
            res.json({ message: 'ok' });
        } else {
            res.status(404).json({ error: '게시물을 찾을 수 없습니다.' });
        }
    } catch (error) {
        console.error('삭제 에러:', error.message);
        res.status(500).json({ error: '서버 에러' });
    }
});
////////////////////////////////////////////////////////////
app.post('/event', async (req, res) => {
    const eventData = req.body;
    eventData.date = getFormattedDate(); //함수 받아오기;

    console.log(
        'Received views:',
        eventData.views,
        'Type:',
        typeof eventData.views
    );

    await db.collection('event').insertOne({
        id: eventData.id,
        title: eventData.title,
        content: eventData.content,
        writer: eventData.writer,
        views: eventData.views,
        date: eventData.date,
    });
    res.json({ message: 'ok' });
});

app.get('/event', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = 10;
        const skip = (page - 1) * pageSize;

        const result = await db
            .collection('event')
            .find()
            .skip(skip)
            .limit(pageSize)
            .toArray();

        res.json({ result });
    } catch (error) {
        console.error('게시판 데이터를 가져오는 중 에러 발생:', error);
        res.status(500).json({
            message: '게시판 데이터를 가져오는 중 에러가 발생했습니다.',
        });
    }
});

app.get('/event', async (req, res) => {
    try {
        const eventData = await db.collection('event').find({}).toArray();
        res.json(eventData);
    } catch (error) {
        console.error('패치 에러:', error.message);
        res.status(500).json({ error: '서버에러' });
    }
});

app.post('/event_detail/:postId', async (req, res) => {
    const postId = req.params.postId;
    try {
        // 클라이언트에서 전달한 postId를 사용하여 해당 게시물을 찾음
        const post = await db
            .collection('event')
            .findOne({ _id: new ObjectId(postId) });
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        const result = await db.collection('event').updateOne(
            { _id: new ObjectId(postId) },
            { $inc: { views: 1 } } // views를 1 증가시킴
        );
        if (result.matchedCount === 1) {
            res.json({ message: 'OK' });
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    } catch (error) {
        console.error('Error updating views:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/event_detail/:postId', async (req, res) => {
    const postId = req.params.postId;
    try {
        // 클라이언트에서 전달한 postId를 사용하여 해당 게시물을 찾음
        const post = await db
            .collection('event')
            .findOne({ _id: new ObjectId(postId) });

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.json(post);
    } catch (error) {
        console.error('Error fetching post detail:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.put('/event_edit/:postId', async (req, res) => {
    const { postId } = req.params;
    const updatedData = req.body;
    console.log('postId', postId);
    console.log('updatedData', updatedData);
    try {
        await db.collection('event').updateOne(
            { _id: new ObjectId(postId) },
            {
                $set: {
                    title: updatedData.title,
                    content: updatedData.content,
                },
            }
        );

        res.json({ message: 'ok' });
    } catch (error) {
        console.error('수정 에러:', error.message);
        res.status(500).json({ error: '서버 에러' });
    }
});
app.delete('/event_detail/:postId', async (req, res) => {
    const { postId } = req.params;
    console.log(postId, postId);
    try {
        const result = await db.collection('event').deleteOne({
            _id: new ObjectId(postId),
        });

        if (result.deletedCount === 1) {
            res.json({ message: 'ok' });
        } else {
            res.status(404).json({ error: '게시물을 찾을 수 없습니다.' });
        }
    } catch (error) {
        console.error('삭제 에러:', error.message);
        res.status(500).json({ error: '서버 에러' });
    }
});
/////////////////////////////////////////////////////comment

//이거 맨밑으로
app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'pandaproject/build/index.html'));
});
