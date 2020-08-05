import aws from 'aws-sdk';

const debug = require('debug')('screencloud-api:dynamodb');

const config = {
  ...(process.env.MOCK_DYNAMODB_ENDPOINT && {
    endpoint: process.env.MOCK_DYNAMODB_ENDPOINT,
    sslEnabled: false,
    region: 'local',
  }),
};

const CHUNK_SIZE = 25; //for batch requests

const requestChunk = (requests) => {
  // break large array of requests in smaller batches
  const chunks = [];
  let index = 0;
  while (index < requests.length) {
    chunks.push(requests.slice(index, CHUNK_SIZE + index));
    index += CHUNK_SIZE;
  }
  return chunks;
};

const createBatchPutRequest = (requests) => {
  const params = {
    RequestItems: {
      [process.env.DYNAMODB_TABLE_NAME]: requests,
    },
  };

  return params;
};

export class DynamoDBHelper {
  constructor() {
    this.docClient = new aws.DynamoDB.DocumentClient(config);
  }

  async getItems(
    values,
    config = { pkn: 'artist', skn: 'song', index: undefined }
  ) {
    const { pk, sk } = values;
    const { pkn, skn, index } = config;
    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      KeyConditionExpression: `#${pkn} = :${pkn}`,
      ExpressionAttributeNames: {
        [`#${pkn}`]: `${pkn}`,
      },
      ExpressionAttributeValues: {
        [`:${pkn}`]: pk,
      },
    };

    if (sk !== undefined) {
      params.KeyConditionExpression = `#${pkn} = :${pkn} and begins_with(#${skn}, :${skn})`;
      params.ExpressionAttributeNames[`#${skn}`] = `${skn}`;
      params.ExpressionAttributeValues[`:${skn}`] = sk;
    }

    if (index !== undefined) {
      params.IndexName = index;
    }

    try {
      const result = await this.docClient.query(params).promise();
      const { Items } = result;
      return Items;
    } catch (error) {
      debug(error);
      throw error;
    }
  }

  async putItems(items) {
    const requests = [];

    for (const item of items) {
      //   debug(item);
      const {
        song,
        artist,
        album,
        writer,
        year,
        june,
        july,
        august,
        cover,
        albumVersion: albumversion,
        singleVersion: singleversion,
        remix,
        live: liveversion,
        piano,
      } = item;

      const request = {
        PutRequest: {
          Item: {
            artist,
            song,
            album,
            year,
            cover: cover | 0,
            albumversion: albumversion | 0,
            singleversion: singleversion | 0,
            remix: remix | 0,
            liveversion: liveversion | 0,
            piano: piano | 0,
          },
        },
      };

      requests.push(request);
    }

    let batches = [];

    if (requests.length > 25) {
      // need to break up as batches limited to 25
      batches = requestChunk(requests);
    } else {
      batches = [requests];
    }

    // create the requests
    const batchRequests = [];
    for (const batch of batches) {
      const batchRequest = createBatchPutRequest(batch);
      batchRequests.push(batchRequest);
    }

    const batchPromises = [];

    try {
      for (const request of batchRequests) {
        batchPromises.push(this.docClient.batchWrite(request).promise());
      }

      await Promise.all(batchPromises);
    } catch (error) {
      debug(error);
    }
  }
}

export default DynamoDBHelper;
