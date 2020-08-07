import { createSpyObj } from 'jest-createspyobj';
import api from '../index';
import { DynamoDBHelper } from '../../dynamodb';
import {
  GET_METHOD,
  createPathEventObject,
  createEventObject,
  ENDPOINTS,
} from './__helpers__';

import { SWIFT } from '../../dynamodb/__tests__/__helpers__';
import { SONG_DATA } from './__helpers__';

// jest.mock('../../dynamodb');

const debug = require('debug')('screencloud-api:api:tests:playcount');

describe('songs api', () => {
  const helper = new DynamoDBHelper();
  let lambdaContextSpy;

  beforeEach(async () => {
    jest.clearAllMocks();
    await helper.putItems(SWIFT);

    lambdaContextSpy = createSpyObj('lambdaContext', ['done']);
  });

  it('invalid query parameters', async () => {
    const { year } = ENDPOINTS;

    await api.proxyRouter(
      createPathEventObject(year, GET_METHOD, {
        year: '2020',
      }),
      lambdaContextSpy
    );
    expect(lambdaContextSpy.done).toHaveBeenCalledWith(
      null,
      expect.objectContaining({
        statusCode: 400,
        body: JSON.stringify({
          error: 'year should an integer and be valid year in YYYY format',
        }),
      })
    );
  });

  it('invalid query parameters - YY', async () => {
    const { year } = ENDPOINTS;

    await api.proxyRouter(
      createPathEventObject(year, GET_METHOD, {
        year: 20,
      }),
      lambdaContextSpy
    );
    expect(lambdaContextSpy.done).toHaveBeenCalledWith(
      null,
      expect.objectContaining({
        statusCode: 400,
        body: JSON.stringify({
          error: 'year should an integer and be valid year in YYYY format',
        }),
      })
    );
  });

  it('valid query parameters', async () => {
    const { year } = ENDPOINTS;
    const { songs2020 } = SONG_DATA;

    await api.proxyRouter(
      createPathEventObject(year, GET_METHOD, {
        year: 2020,
      }),
      lambdaContextSpy
    );
    expect(lambdaContextSpy.done).toHaveBeenCalledWith(
      null,
      expect.objectContaining({
        statusCode: 200,
        body: JSON.stringify(songs2020),
      })
    );
  });

  it('cover songs', async () => {
    const { cover } = ENDPOINTS;
    const { covers } = SONG_DATA;

    await api.proxyRouter(
      createEventObject(cover, GET_METHOD),
      lambdaContextSpy
    );
    expect(lambdaContextSpy.done).toHaveBeenCalledWith(
      null,
      expect.objectContaining({
        statusCode: 200,
        body: JSON.stringify(covers),
      })
    );
  });

  it('remix songs', async () => {
    const { remix } = ENDPOINTS;
    const { remixes } = SONG_DATA;

    await api.proxyRouter(
      createEventObject(remix, GET_METHOD),
      lambdaContextSpy
    );
    expect(lambdaContextSpy.done).toHaveBeenCalledWith(
      null,
      expect.objectContaining({
        statusCode: 200,
        body: JSON.stringify(remixes),
      })
    );
  });

  it('search invalid writer', async () => {
    const { writer } = ENDPOINTS;
    const { songs2020 } = SONG_DATA;

    await api.proxyRouter(
      createPathEventObject(writer, GET_METHOD, {
        name: undefined,
      }),
      lambdaContextSpy
    );
    expect(lambdaContextSpy.done).toHaveBeenCalledWith(
      null,
      expect.objectContaining({
        statusCode: 400,
        body: JSON.stringify({
          error: 'name is not defined',
        }),
      })
    );
  });

  it('search valid writer', async () => {
    const { writer } = ENDPOINTS;
    const { writer: writerSongs } = SONG_DATA;

    await api.proxyRouter(
      createPathEventObject(writer, GET_METHOD, {
        name: 'Ed Sheeran',
      }),
      lambdaContextSpy
    );
    expect(lambdaContextSpy.done).toHaveBeenCalledWith(
      null,
      expect.objectContaining({
        statusCode: 200,
        body: JSON.stringify(writerSongs),
      })
    );
  });

  it('search valid song', async () => {
    const { searchSongs } = ENDPOINTS;
    const { songsBeginsWithE } = SONG_DATA;

    await api.proxyRouter(
      createPathEventObject(searchSongs, GET_METHOD, {
        artist: 'Taylor Swift',
        song: 'E',
      }),
      lambdaContextSpy
    );
    expect(lambdaContextSpy.done).toHaveBeenCalledWith(
      null,
      expect.objectContaining({
        statusCode: 200,
        body: JSON.stringify(songsBeginsWithE),
      })
    );
  });
});
