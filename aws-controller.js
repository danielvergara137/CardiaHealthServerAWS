'use strict';
 
const aws = require('aws-sdk');
const fs = require('fs');
const http = require('http');
var secrets = require('./secrets');
 
const s3 = new aws.S3({
    signatureVersion: 'v4',
    region: 'us-east-2' // Change for your Region, check inside your browser URL for S3 bucket ?region=...
});
 
exports.uploadFile = function (req, res) {
    const fileName = req.query['file-name'];
    const fileType = req.query['file-type'];
	const stringtowrite = req.query['string-write']
    const s3Params = {
        Bucket: secrets.aws_bucket,
        Key:   fileName,
        Expires: 60,
        ContentType: fileType,
        ACL: 'private'
    };
    
    s3.getSignedUrl('putObject', s3Params, (err, data) => {
        if (err) {
            console.log(err);
            return res.end();
        }
        const returnData = {
            signedRequest: data,
            url: `https://${secrets.aws_bucket}.s3.amazonaws.com/${fileName}`
        };
 
        const reqUrl = returnData['signedRequest']
    });
	
	const file = fs.writeFile(fileName, stringtowrite, function(err){
		if(err) console.log(err);
		else console.log('archivo creado');
	});
	
	return http.put(reqUrl, file).json();
		
};
 
 
