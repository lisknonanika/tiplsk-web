const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const config = require('./config');
const request = require('./request');

const app = express();
app.set('secret', config.secret);
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(helmet());
app.use(session({
    name: 'tiplsk-session',
    secret: 'cookie-secret',
    resave: false,
    saveUninitialized: false
}));

const router = express.Router();
app.use('/', router);

/**
 * 認証処理
 */
router.get('/', (req, res) => {
    (async () => {
        if (session.token) res.redirect('/user');
        else if (req.query.error) res.render('index', {error: 'Authentication failed.'});
        else if (req.query.timeout) res.render('index', {error: 'Session Timeout.'});
        else res.render('index', {error: ''});
    })().catch((err) => {
        // SYSTEM ERROR
        console.log(err);
    });
});

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
        else session.token = data.token;
        res.redirect(redirectUrl);
    })().catch((err) => {
        // SYSTEM ERROR
        console.log(err);
    });
});

router.post('/logout', (req, res) => {
    (async () => {
        session.token = null;
        res.redirect('/');
    })().catch((err) => {
        // SYSTEM ERROR
        console.log(err);
    });
});

router.get('/user', (req, res) => {
    (async () => {
        if (!session.token) {
            res.redirect('/?timeout=true');
            return;
        }

        const data = await request({
            method: 'GET',
            url: `${config.apiUrl}user`,
            headers: {'x-access-token': session.token},
            json: true
        });
        if (data.result) res.render('user', data);
        else res.redirect('/?timeout=true');
    })().catch((err) => {
        console.log(err);
        // SYSTEM ERROR
    });
});

app.listen(config.listenPort);
console.log(`TipLisk WEB Start`);
