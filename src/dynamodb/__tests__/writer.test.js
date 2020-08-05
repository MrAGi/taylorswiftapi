import { DynamoDB } from 'aws-sdk';
import { DynamoDBHelper } from '../index';

import { SWIFT, WRITER_RESULTS } from './__helpers__';

const debug = require('debug')('screencloud-api:dynamodb:tests:writer');

describe('writer queries', () => {
  const helper = new DynamoDBHelper();

  beforeEach(async () => {
    await helper.putItems(SWIFT);
  });

  it('check correct results return for query on writer index', async () => {
    const results = await helper.getItems(
      { pk: 'Aaron Dessner' },
      {
        pkn: 'writer',
        index: 'writer-song-index',
      }
    );

    const { aaronDessnerSongs } = WRITER_RESULTS;
    expect(results).toStrictEqual(aaronDessnerSongs);
  });
});
