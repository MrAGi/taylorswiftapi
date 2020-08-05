import { DynamoDB } from 'aws-sdk';
import { DynamoDBHelper } from '../index';

import { SWIFT, GUEST_RESULTS } from './__helpers__';

const debug = require('debug')('screencloud-api:dynamodb:tests:guests');

describe('guest queries', () => {
  const helper = new DynamoDBHelper();

  beforeEach(async () => {
    await helper.putItems(SWIFT);
  });

  it('check correct results return for query on featuring/guest index', async () => {
    const results = await helper.getItems(
      { pk: 'Ed Sheeran' },
      {
        pkn: 'featuring',
        index: 'featuring-song-index',
      }
    );

    const { edSheeranSongs } = GUEST_RESULTS;
    expect(results).toStrictEqual(edSheeranSongs);
  });
});
