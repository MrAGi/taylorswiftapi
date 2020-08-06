import { DynamoDB } from 'aws-sdk';
import { DynamoDBHelper } from '../index';

import { SWIFT, EXAMPLE_RESULTS } from './__helpers__';

const debug = require('debug')('screencloud-api:dynamodb:tests');

describe('basic queries', () => {
  const helper = new DynamoDBHelper();

  beforeEach(async () => {
    await helper.putItems(SWIFT);
  });

  it('check correct results return for song query', async () => {
    const results = await helper.getItems(
      { pk: 'Taylor Swift', sk: 'Exile' },
      { pkn: 'artist', skn: 'song' }
    );
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

  it('check correct results return for query on cover index', async () => {
    const results = await helper.getItems(
      { pk: 1 },
      {
        pkn: 'cover',
        index: 'cover-index',
      }
    );

    const { coverQueryResults } = EXAMPLE_RESULTS;
    expect(results).toStrictEqual(coverQueryResults);
  });

  it('check correct results return for query on album index', async () => {
    const results = await helper.getItems(
      { pk: 1 },
      {
        pkn: 'albumversion',
        index: 'albumversion-index',
      }
    );

    const { albumVersionQuery } = EXAMPLE_RESULTS;
    expect(results).toStrictEqual(albumVersionQuery);
  });

  it('check correct results return for query on single index', async () => {
    const results = await helper.getItems(
      { pk: 1 },
      {
        pkn: 'singleversion',
        index: 'singleversion-index',
      }
    );

    const { singleVersionQuery } = EXAMPLE_RESULTS;
    expect(results).toStrictEqual(singleVersionQuery);
  });

  it('check correct results return for query on remix index', async () => {
    const results = await helper.getItems(
      { pk: 1 },
      {
        pkn: 'remix',
        index: 'remix-index',
      }
    );

    const { remixQuery } = EXAMPLE_RESULTS;
    expect(results).toStrictEqual(remixQuery);
  });

  it('check correct results return for query on live index', async () => {
    const results = await helper.getItems(
      { pk: 1 },
      {
        pkn: 'liveversion',
        index: 'liveversion-index',
      }
    );

    const { liveVersionQuery } = EXAMPLE_RESULTS;
    expect(results).toStrictEqual(liveVersionQuery);
  });

  it('check correct results return for query on piano index', async () => {
    const results = await helper.getItems(
      { pk: 1 },
      {
        pkn: 'piano',
        index: 'piano-index',
      }
    );

    const { pianoQuery } = EXAMPLE_RESULTS;
    expect(results).toStrictEqual(pianoQuery);
  });
});
