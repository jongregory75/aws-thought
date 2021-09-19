const AWS = require("aws-sdk");
const fs = require("fs");

//create interface with DynamoDB
//DocumentClient creates the dynamodb service object
AWS.config.update({
  region: "us-east-2",
  endpoint: "http://localhost:8000",
});
const dynamodb = new AWS.DynamoDB.DocumentClient({ apiVersion: "2012-08-10" });

//reads in users.json
console.log("Importing thoughts into DynamoDB. Please wait.");
const allUsers = JSON.parse(
  fs.readFileSync("./server/seed/users.json", "utf8")
);

//loops over allUsers array and create params object with the elements in the array
allUsers.forEach((user) => {
  const params = {
    TableName: "Thoughts",
    Item: {
      username: user.username,
      createdAt: user.createdAt,
      thought: user.thought,
    },
  };

  //make a call to the database with the service interface object, dynamodb
  dynamodb.put(params, (err, data) => {
    if (err) {
      console.error(
        "Unable to add thought",
        user.username,
        ". Error JSON:",
        JSON.stringify(err, null, 2)
      );
    } else {
      console.log("PutItem succeeded:", user.username);
    }
  });
});
//
