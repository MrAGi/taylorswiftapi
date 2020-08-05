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
      { pk: '2020', sk: `08` },
      {
        pkn: 'playcountyear',
        skn: 'playcountmonth',
        index: 'playcount-index',
      }
    );

    const { august2020Counts } = PLAY_COUNT_RESULTS;
    expect(results).toStrictEqual(august2020Counts);
  });
});
