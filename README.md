<p> 
    <strong>For creating new service you should enter next command: </strong>
    <code>
        serverless create --template [template name, as example: aws-nodejs] --path [service_name]
    </code>
</p>
<p>
    <strong>For creating new  on TypeScript you should enter next command: </strong>
    <code>
        serverless create --template aws-nodejs-typescript --path [service_name]
    </code>
</p>
<p> 
    <strong>For deploy service you should go to your service folder: cd [your_service_folder_name] and enter next command: </strong>
    <code>
        sls deploy
    </code>
</p>
<p>
    <strong>For testing locally you should install serverless-offline package and enter next command: </strong>
    <code>
        sls offline start
    </code>
</p>

<p>
    For creating Public Bucket Policy, you need to dismiss "Block all public access" option and add next policy in field:
</p>
 <pre>
        {
            "Version": "2008-10-17",
            "Statement": [
                {
                    "Sid": "AllowPublicRead",
                    "Effect": "Allow",
                    "Principal": {
                        "AWS": "*"
                    },
                    "Action": "s3:GetObject",
                    "Resource": "arn:aws:s3:::aws-shop-be-import-service/*"
                }
            ]
        }
</pre>
<p>
    Configuration for correct uploading to S3 bucket CSV files:
</p>
<h3>
    Bucket policy
</h3>
<pre>
  {
      "Version": "2012-10-17",
      "Id": "Policy1613559523522",
      "Statement": [
          {
              "Sid": "Stmt1613559520235",
              "Effect": "Allow",
              "Principal": "*",
              "Action": [
                  "s3:PutObject",
                  "s3:PutObjectAcl"
              ],
              "Resource": "arn:aws:s3:::imported-from-xsl-products/*"
          }
      ]
  }  
</pre>
<h3>
   Cross-origin resource sharing (CORS)
</h3>
<pre>
  [
      {
          "AllowedHeaders": [
              "*"
          ],
          "AllowedMethods": [
              "PUT",
              "POST",
              "DELETE"
          ],
          "AllowedOrigins": [
              "*"
          ],
          "ExposeHeaders": []
      }
  ]
</pre>
