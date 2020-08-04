import aws from 'aws-sdk';

const debug = require('debug')('screencloud-api:dynamodb');

export class DynamoDBHelper {
  constructor() {
    this.docClient = new aws.DynamoDB.DocumentClient();
  }
}

export default DynamoDBHelper;
