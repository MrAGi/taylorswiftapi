import { createSpyObj } from 'jest-createspyobj';
import api from '../index';
import { DynamoDBHelper } from '../../dynamodb';
import { GET_METHOD, createPathEventObject, ENDPOINTS } from './__helpers__';

import { SWIFT } from '../../dynamodb/__tests__/__helpers__';
import { PLAY_COUNT_DATA } from './__helpers__';

// jest.mock('../../dynamodb');

const debug = require('debug')('screencloud-api:api:tests:playcount');

describe('play count api', () => {
  const helper = new DynamoDBHelper();
  let lambdaContextSpy;

  beforeEach(async () => {
    jest.clearAllMocks();
    await helper.putItems(SWIFT);

    lambdaContextSpy = createSpyObj('lambdaContext', ['done']);
  });

  it('invalid query parameters', async () => {
    const { playCount } = ENDPOINTS;

    await api.proxyRouter(
      createPathEventObject(playCount, GET_METHOD, {
        year: 'hello',
        month: 8,
        limit: 25,
      }),
      lambdaContextSpy
    );
    expect(lambdaContextSpy.done).toHaveBeenCalledWith(
      null,
      expect.objectContaining({
        statusCode: 400,
        body: JSON.stringify({ error: 'parameters should be integers' }),
      })
    );
  });

  it('valid query parameters', async () => {
    const { playCount } = ENDPOINTS;
    const { august2020 } = PLAY_COUNT_DATA;

    await api.proxyRouter(
      createPathEventObject(playCount, GET_METHOD, {
        year: 2020,
        month: 8,
        limit: 25,
      }),
      lambdaContextSpy
    );
    expect(lambdaContextSpy.done).toHaveBeenCalledWith(
      null,
      expect.objectContaining({
        statusCode: 200,
        body: JSON.stringify(august2020),
      })
    );
  });

  it('valid query parameters - album', async () => {
    const { albumCount } = ENDPOINTS;
    const { albumsAugust2020 } = PLAY_COUNT_DATA;

    await api.proxyRouter(
      createPathEventObject(albumCount, GET_METHOD, {
        year: 2020,
        month: 8,
      }),
      lambdaContextSpy
    );
    expect(lambdaContextSpy.done).toHaveBeenCalledWith(
      null,
      expect.objectContaining({
        statusCode: 200,
        body: JSON.stringify(albumsAugust2020),
      })
    );
  });
});
