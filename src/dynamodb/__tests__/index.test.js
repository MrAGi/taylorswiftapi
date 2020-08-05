import { DynamoDB } from 'aws-sdk';
import { DynamoDBHelper } from '../index';

import { SWIFT, EXAMPLE_RESULTS } from './__helpers__';

const debug = require('debug')('screencloud-api:dynamodb:tests');

describe('dynamodb helper', () => {
  const helper = new DynamoDBHelper();

  beforeEach(async () => {
    await helper.putItems(SWIFT);
  });

  it('check correct results return for song query', async () => {
    const results = await helper.getItems({ pk: 'Taylor Swift', sk: 'Ex' });
    const { songQueryResult } = EXAMPLE_RESULTS;
    expect(results).toStrictEqual(songQueryResult);
  });

  it('check correct results return for query on year index', async () => {
    const results = await helper.getItems(
      { pk: '2020' },
      {
        pkn: 'year',
        index: 'year-index',
      }
    );

    const { yearQueryResult } = EXAMPLE_RESULTS;
    expect(results).toStrictEqual(yearQueryResult);
  });
});
