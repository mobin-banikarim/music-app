let express = require('express');
let app = express();
let path = require('path');
let ejs = require('ejs');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let session = require('express-session');
let MongoDBStore = require('connect-mongodb-session')(session);
let backup = require('mongodb-backup');
let { exec } = require('child_process');
let cron = require('node-cron');
const fs = require('fs');


let User = require('./models/User');

let DBUrl = 'mongodb://127.0.0.1:27017/music';
let backupPath = path.join(__dirname, 'backup');

const store = new MongoDBStore({
    uri: DBUrl,
    collection: 'sessions',
});

app.use(
    session({
      secret: 'my secret',
      resave: false,
      saveUninitialized: false,
      store: store
    })
);

app.use(express.static(path.join(__dirname, '/')));
app.set('views' , path.join(__dirname , 'views'));
app.use(bodyParser.urlencoded({ extended: false }))
app.set('view engine' , 'ejs');

let homeRoute = require('./Routes/homeRoute');
let registerRoute = require('./Routes/registerRoute');
let adminRoute = require('./Routes/adminRoute');

app.use((req , res , next) => {
    if (!req.session.isLogin) {
        return next();
    }
    User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
})

app.use(homeRoute);
app.use(registerRoute);
app.use('/admin' , adminRoute);
app.use((req, res , next) => {
    res.render('404' , {
        isLogin : req.session.isLogin,
    });
})

mongoose.connect(DBUrl)
.then(() => {
    app.listen(3000);
    console.log('Connected Database');
})
.catch((err) => {
    console.log(err);
});


const dbName = 'music';
const outputPath = path.resolve(__dirname, 'backups/music');

const backupMongoDB = (dbName, outputPath) => {
  const timestamp = new Date().toISOString().replace(/T/, '_').replace(/:/g, '-').replace(/\..+/, '');
  const backupDir = path.join(outputPath, `${dbName}_backup_${timestamp}`);

  try {
    fs.mkdirSync(backupDir, { recursive: true });
  } catch (err) {
    console.error(`Error creating directory: ${err.message}`);
    return;
  }

  const command = `mongodump --db=${dbName} --out="${backupDir}"`;
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Stderr: ${stderr}`);
      return;
    }
    console.log(`Backup successfully created at: ${backupDir}`);
  });
};

cron.schedule('35 11 * * *', () => {
  backupMongoDB(dbName, outputPath);
});
