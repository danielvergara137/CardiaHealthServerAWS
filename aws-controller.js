'use strict';
 
const aws = require('aws-sdk');
const fs = require('fs');
const http = require('http');
var secrets = require('./secrets');
 
const s3 = new aws.S3({
    signatureVersion: 'v4',
    region: 'sa-east-1' // Change for your Region, check inside your browser URL for S3 bucket ?region=...
});
 
exports.uploadFile = function (req, res) {
    const fileName = req.query['file-name'];
    const fileType = req.query['file-type'];
	var reqUrl = "";
	const stringtowrite = req.body['content'];

	const params = {
        Bucket: secrets.aws_bucket,
        Key:   fileName,
        Body: stringtowrite,
        ContentType: fileType,
    };
	
    var uploadPromise = new aws.S3({apiVersion: '2006-03-01'}).putObject(params).promise();
    uploadPromise.then(
      function(data) {
        console.log("Successfully uploaded data");
		res.send(req.body)
      });
		
};

exports.sign = function (req, res) {
	const fileName = req.query['file-name'];
	const fileType = req.query['file-type'];
	const s3Params = {
		Bucket: secrets.aws_bucket,
		Key: fileName,
		Expires: 60,
		ContentType: fileType,
		ACL: 'private'
	};

	s3.getSignedUrl('putObject', s3Params, (err, data) => {
		if(err){
		  console.log(err);
		  return res.end();
		}
		const returnData = {
		  signedRequest: data,
		  url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
		};
		res.write(JSON.stringify(returnData));
		res.end();
	});
	
};
 
 
