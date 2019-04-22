const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const config = require('./config');
const request = require('./request');
const utils = require('./utils');

const app = express();
app.set('secret', config.secret);
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use(helmet());
app.use(session({
    name: 'tiplsk-session',
    secret: 'cookie-secret',
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
        maxAge: 15 * 60 * 1000
    }
}));

const router = express.Router();
app.use('/', router);

/**
 * ログイン画面表示
 */
router.get('/', (req, res) => {
    (async () => {
        if (req.session.token) res.redirect('/user');
        else if (req.query.error) res.render('index', {error: 'Authentication failed.', utils: utils});
        else if (req.query.timeout) res.render('index', {error: 'Session Timeout.', utils: utils});
        else res.render('index', {error: '', utils: utils});
    })().catch((err) => {
        // SYSTEM ERROR
        console.log(err);
        req.session.token = null;
        res.status(500);
        res.render('500');
    });
});

/**
 * ログイン処理
 */
router.post('/login', (req, res) => {
    (async () => {
        const data = await request({
            method: 'POST',
            url: `${config.apiUrl}auth`,
            headers: {'content-type': 'application/json'},
            body: req.body,
            json: true
        });
        let redirectUrl = '/';
        if (!data.result) redirectUrl = `${redirectUrl}?error=true`
        else req.session.token = data.token;
        res.redirect(redirectUrl);
    })().catch((err) => {
        // SYSTEM ERROR
        console.log(err);
        req.session.token = null;
        res.status(500);
        res.render('500');
    });
});

/**
 * ログアウト処理
 */
router.post('/logout', (req, res) => {
    (async () => {
        req.session.token = null;
        res.redirect('/');
    })().catch((err) => {
        // SYSTEM ERROR
        console.log(err);
        req.session.token = null;
        res.status(500);
        res.render('500');
    });
});

/**
 * ユーザー情報画面表示
 */
router.get('/user', (req, res) => {
    (async () => {
        if (!req.session.token) {
            res.redirect('/?timeout=true');
            return;
        }

        const userData = await request({
            method: 'GET',
            url: `${config.apiUrl}user`,
            headers: {'x-access-token': req.session.token},
            json: true
        });

        const historyData = await request({
            method: 'GET',
            url: `${config.apiUrl}history?offset=0&limit=20`,
            headers: {'x-access-token': req.session.token},
            json: true
        });
        let histories = [];
        if (historyData.datas) histories = historyData.datas;
        const params = {
            user: userData,
            history: histories,
            utils: utils
        }
        if (userData.result && historyData.result) res.render('user', params);
        else res.redirect('/?timeout=true');
    })().catch((err) => {
        // SYSTEM ERROR
        console.log(err);
        req.session.token = null;
        res.status(500);
        res.render('500');
    });
});

app.use((req, res, next) => {
    res.status(404);
    res.render('404');
});

app.listen(config.listenPort);
console.log(`TipLisk WEB Start`);
