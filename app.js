var port = process.env.PORT || 3000,
    http = require('http'),
    fs = require('fs'),
    AWS = require('aws-sdk');

AWS.config.update({region: 'us-east-2'});

// Create the DynamoDB service object
var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});


var app = http.createServer(function (req, res) {
  if (req.url.indexOf('/img') != -1) {
    var filePath = req.url.split('/img')[1];
    fs.readFile(__dirname + '/public/img' + filePath, function (err, data) {
      if (err) {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.write('Error 404: Resource not found.');
        console.log(err);
      } else {
        res.writeHead(200, {'Content-Type': 'image/svg+xml'});
        res.write(data);
      }  
      res.end();
    });
  } else if (req.url.indexOf('/js') != -1) {
    var filePath = req.url.split('/js')[1];
    fs.readFile(__dirname + '/public/js' + filePath, function (err, data) {
      if (err) {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.write('Error 404: Resource not found.');
        console.log(err);
      } else {
        res.writeHead(200, {'Content-Type': 'text/javascript'});
        res.write(data);
      }  
      res.end();
    });
  } else if(req.url.indexOf('/css') != -1) {
    var filePath = req.url.split('/css')[1];
    fs.readFile(__dirname + '/public/css' + filePath, function (err, data) {
      if (err) {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.write('Error 404: Resource not found.');
        console.log(err);
      } else {
        res.writeHead(200, {'Content-Type': 'text/css'});
        res.write(data);
      }
      res.end();
    });
  } else {
    fs.readFile(__dirname + '/public/index.html', function (err, data) {
      if (err) {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('Error 404: Resource not found.');
        console.log(err);
      } else {
        
        // Set the region 
     
        const params2 = {
          // Specify which items in the results are returned.
          FilterExpression: "Id > :s AND Id < :e",
          // Define the expression attribute value, which are substitutes for the values you want to compare.
          ExpressionAttributeValues: {
            ":s": {N: '0'},
            ":e": {N: '100'}
          },
          // Set the projection expression, which are the attributes that you want.
          ProjectionExpression: "Id",
          TableName: "ProductCatalog",
        };
        
        ddb.scan(params2, function (err, data2) {
          if (err) {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(data);          
          } else {
            var ids = "";
            data2.Items.forEach(function (element, index, array) {
              ids += " " + element.Id['N'];
              console.log(
                  "printing",
                  element.Id
              );
            });

            
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(data + ids);
          }
        });
        
      }
    });
  }
}).listen(port, '0.0.0.0');

module.exports = app;