import aws from 'aws-sdk';

const debug = require('debug')('screencloud-api:dynamodb');

import {
  generateWriterSortKey,
  generatFeatureSortKey,
  generatePlayCountSortKey,
} from './helpers';

/**
 * Configuration for DynamoDB for working with Dynalite
 * @constant
 * @type {Object}
 */
const config = {
  ...(process.env.MOCK_DYNAMODB_ENDPOINT && {
    endpoint: process.env.MOCK_DYNAMODB_ENDPOINT,
    sslEnabled: false,
    region: 'local',
  }),
};

/**
 * Chunking size for batach requests (limited by DynamoDB)
 * @constant
 * @type {Number}
 * @default
 */
const CHUNK_SIZE = 25; //for batch requests

/** @typedef {Object} SongRequestItem
 * @property {string} artist The partition key value
 * @property {string} song The sort key value
 * @property {string} album The album name
 * @property {Array<string>} writers List of song writers
 * @property {string} year Release year for song
 * @property {Number} cover Cover version flag
 * @property {Number} albumversion Album version flag
 * @property {Number} singleversion Single version flag
 * @property {Number} remix Remix flag
 * @property {Number} liveversion Live version flag
 * @property {Number} piano Piano version flag
 * @property {Array<string>} featuring List of song performers
 */

/** @typedef {Object} WriterRequestItem
 * @property {string} artist The partition key value
 * @property {string} song The sort key value
 * @property {string} writer The writer's name
 */

/** @typedef {Object} FeaturingRequestItem
 * @property {string} artist The partition key value
 * @property {string} song The sort key value
 * @property {string} writer The featuring performer's name
 */

/** @typedef {Object} PlayCountRequestItem
 * @property {string} artist The partition key value
 * @property {string} song The sort key value
 * @property {Number} playcount The total plays for this song
 * @property {string} playcountyearmonth The year and month for the play count e.g. YYYY-MM.
 */

/** @typedef {Object} PutItem
 * @property {(SongRequestItem|WriterRequestItem|FeaturingRequestItem|PlayCountRequestItem)} Item for insertion into DynamoDB
 */

/** @typedef {Object} PutRequest
 * @property PutRequest {PutItem} Items for insertion into DynamoDB
 */

/**
 * Separates dynamodb request array into chunks of the CHUNK_SIZE
 * @param {Array.<PutRequest>} requests An array of dynamodb requests
 * @returns {Array<Array<PutRequest>>}
 */
const requestChunk = (requests) => {
  // break large array of dynamodb requests in smaller batches
  const chunks = [];
  let index = 0;
  while (index < requests.length) {
    chunks.push(requests.slice(index, CHUNK_SIZE + index));
    index += CHUNK_SIZE;
  }
  return chunks;
};

/** @typedef {Object} RequestItems
 * @property [k: string] {Array<PutRequest>} The table name
 */

/** @typedef {Object} BatchPutRequest
 * @property {RequestItems} RequestItems
 */

/**
 * Adds boiler plate request info required for a batchput operation to array of dynamodb requests
 * @param {Array.<PutRequest>} requests An array of dynamodb request
 * @returns {BatchPutRequest}
 */
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
    config = {
      pkn: 'artist',
      skn: 'song',
      index: undefined,
      begins: false,
      desc: false,
      limit: 10,
    }
  ) {
    const { pk, sk } = values;
    const { pkn, skn, index, begins, desc, limit } = config;
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
      params.KeyConditionExpression = `#${pkn} = :${pkn} and ${
        begins ? `begins_with(#${skn}, :${skn})` : `#${skn} = :${skn}`
      }`;
      params.ExpressionAttributeNames[`#${skn}`] = `${skn}`;
      params.ExpressionAttributeValues[`:${skn}`] = sk;
    }

    if (index !== undefined) {
      params.IndexName = index;
    }

    if (desc !== undefined) {
      params.ScanIndexForward = !desc;
    }

    if (limit !== undefined) {
      params.Limit = limit;
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
        writer: writers,
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
        featuring,
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

      for (const writer of writers) {
        const writerRequest = {
          PutRequest: {
            Item: {
              artist,
              song: generateWriterSortKey(writer, song),
              writer,
            },
          },
        };

        requests.push(writerRequest);
      }

      if (featuring !== undefined) {
        for (const guest of featuring) {
          const guestRequest = {
            PutRequest: {
              Item: {
                artist,
                song: generatFeatureSortKey(guest, song),
                featuring: guest,
              },
            },
          };

          requests.push(guestRequest);
        }
      }

      // deal with the play count - this needs to be improved as no indication what year etc. counts are from
      // assuming 2020 for the moment and just hard coing dates.
      const JuneRequest = {
        PutRequest: {
          Item: {
            artist,
            song: generatePlayCountSortKey(june, '2020', '06', song),
            playcount: parseInt(june),
            playcountyearmonth: '2020-06',
          },
        },
      };

      const JulyRequest = {
        PutRequest: {
          Item: {
            artist,
            song: generatePlayCountSortKey(july, '2020', '07', song),
            playcount: parseInt(july),
            playcountyearmonth: '2020-07',
          },
        },
      };

      const AugustRequest = {
        PutRequest: {
          Item: {
            artist,
            song: generatePlayCountSortKey(august, '2020', '08', song),
            playcount: parseInt(august),
            playcountyearmonth: '2020-08',
          },
        },
      };

      requests.push(JuneRequest);
      requests.push(JulyRequest);
      requests.push(AugustRequest);

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
