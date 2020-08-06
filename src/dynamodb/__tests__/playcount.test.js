import { DynamoDB } from 'aws-sdk';
import { DynamoDBHelper } from '../index';

import { SWIFT, PLAY_COUNT_RESULTS } from './__helpers__';

const debug = require('debug')('screencloud-api:dynamodb:tests:playcount');

describe('play count queries', () => {
  const helper = new DynamoDBHelper();

  beforeEach(async () => {
    await helper.putItems(SWIFT);
  });

  it('check correct results return for query on play count for given song', async () => {
    const results = await helper.getItems(
      { pk: 'Taylor Swift', sk: `Exile-p-2020-` },
      {
        pkn: 'artist',
        skn: 'song',
        begins: true,
      }
    );

    const { exilePlayCounts } = PLAY_COUNT_RESULTS;
    expect(results).toStrictEqual(exilePlayCounts);
  });

  it('check correct results return for query on play count for given year/month', async () => {
    const results = await helper.getItems(
      { pk: '2020-08' },
      {
        pkn: 'playcountyearmonth',
        index: 'count-index',
        desc: true,
        limit: 10,
      }
    );

    const { august2020Counts } = PLAY_COUNT_RESULTS;
    expect(results).toStrictEqual(august2020Counts);
  });

  it('check correct results return for query on play count for given year/month and count value', async () => {
    const results = await helper.getItems(
      { pk: '2020-08', sk: 105 },
      {
        pkn: 'playcountyearmonth',
        skn: 'playcount',
        index: 'count-index',
        desc: true,
        operator: '>',
      }
    );

    const { august2020CountGreaterThan105 } = PLAY_COUNT_RESULTS;
    expect(results).toStrictEqual(august2020CountGreaterThan105);
  });

  it('check correct results return for query on play count for given year/month and count value comparison', async () => {
    const results = await helper.getItems(
      { pk: '2020-08', sk: 20, skc: 30 },
      {
        pkn: 'playcountyearmonth',
        skn: 'playcount',
        index: 'count-index',
        desc: true,
        between: true,
      }
    );

    const { august2020CountBetween20and30 } = PLAY_COUNT_RESULTS;
    expect(results).toStrictEqual(august2020CountBetween20and30);
  });
});
