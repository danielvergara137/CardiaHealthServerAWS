var logger          = require('morgan'),
    cors            = require('cors'),
    http            = require('http'),
    express         = require('express'),
    dotenv          = require('dotenv'),
    errorhandler    = require('errorhandler'),
    bodyParser      = require('body-parser'),
    helmet          = require('helmet'),
    secrets = require('./secrets'),
    awsController = require('./aws-controller');
 
var app = express();
app.use(helmet())
 
dotenv.load();
 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({origin:true,credentials: true}));
 
if (process.env.NODE_ENV === 'development') {
  app.use(logger('dev'));
  app.use(errorhandler())
}
 
app.post('/aws/upload', awsController.uploadFile);
 
var port = process.env.PORT || 5000;
var server = http.createServer(app);
 
server.listen(port, function (err) {
  console.log('listening in http://localhost:' + port);
});