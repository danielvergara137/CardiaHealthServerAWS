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
	var reqUrl;
	const stringtowrite = req.body['content']
	
	const params = {
        Bucket: secrets.aws_bucket,
        Key: fileName, // File name you want to save as in S3
		ContentType: fileType,
        Body: stringtowrite
    };
	
	s3.upload(params, function(err, data) {
        if (err) {
            throw err;
        }
		return true;
        console.log(`File uploaded successfully. ${data.Location}`);
    });
		
};
 
 
