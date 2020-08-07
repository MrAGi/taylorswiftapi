import { createSpyObj } from 'jest-createspyobj';
import api from '../index';
import { DynamoDBHelper } from '../../dynamodb';
import { createEventObject, ENDPOINTS, POST_METHOD } from './__helpers__';

jest.mock('../../dynamodb');

import { SONG_DETAILS } from './__helpers__';

const debug = require('debug')('screencloud-api:api:tests:add');

describe('add api', () => {
  let lambdaContextSpy;

  beforeEach(() => {
    jest.clearAllMocks();

    lambdaContextSpy = createSpyObj('lambdaContext', ['done']);
  });

  it('check no body response', async () => {
    const { addSongs } = ENDPOINTS;

    await api.proxyRouter(
      createEventObject(addSongs, POST_METHOD),
      lambdaContextSpy
    );
    expect(lambdaContextSpy.done).toHaveBeenCalledWith(
      null,
      expect.objectContaining({
        statusCode: 400,
        body: JSON.stringify({ error: 'songs not provided as an array' }),
      })
    );
  });

  it('check validation of songs with missing properties', async () => {
    const { addSongs } = ENDPOINTS;

    const { invalid } = SONG_DETAILS;

    await api.proxyRouter(
      createEventObject(addSongs, POST_METHOD, invalid),
      lambdaContextSpy
    );
    expect(lambdaContextSpy.done).toHaveBeenCalledWith(
      null,
      expect.objectContaining({
        statusCode: 400,
        body: JSON.stringify({
          error: 'one or more songs is not valid - missing property',
        }),
      })
    );
  });

  it('check validation of songs with invalid property values - string', async () => {
    const { addSongs } = ENDPOINTS;

    const { invalidPropertiesString } = SONG_DETAILS;

    await api.proxyRouter(
      createEventObject(addSongs, POST_METHOD, invalidPropertiesString),
      lambdaContextSpy
    );
    expect(lambdaContextSpy.done).toHaveBeenCalledWith(
      null,
      expect.objectContaining({
        statusCode: 400,
        body: JSON.stringify({
          error:
            'one or more songs is not valid - property has invalid datatype - should be string',
        }),
      })
    );
  });

  it('check validation of songs with invalid property values - array', async () => {
    const { addSongs } = ENDPOINTS;

    const { invalidPropertiesArray } = SONG_DETAILS;

    await api.proxyRouter(
      createEventObject(addSongs, POST_METHOD, invalidPropertiesArray),
      lambdaContextSpy
    );
    expect(lambdaContextSpy.done).toHaveBeenCalledWith(
      null,
      expect.objectContaining({
        statusCode: 400,
        body: JSON.stringify({
          error:
            'one or more songs is not valid - writer property has invalid datatype - should be array',
        }),
      })
    );
  });

  it('check validation of songs with invalid property values - array items string', async () => {
    const { addSongs } = ENDPOINTS;

    const { invalidPropertiesArrayString } = SONG_DETAILS;

    await api.proxyRouter(
      createEventObject(addSongs, POST_METHOD, invalidPropertiesArrayString),
      lambdaContextSpy
    );
    expect(lambdaContextSpy.done).toHaveBeenCalledWith(
      null,
      expect.objectContaining({
        statusCode: 400,
        body: JSON.stringify({
          error:
            'one or more songs is not valid - writer property has invalid datatype - items should be strings',
        }),
      })
    );
  });

  it('check validation of songs with invalid property values - boolean', async () => {
    const { addSongs } = ENDPOINTS;

    const { invalidPropertiesBoolean } = SONG_DETAILS;

    await api.proxyRouter(
      createEventObject(addSongs, POST_METHOD, invalidPropertiesBoolean),
      lambdaContextSpy
    );
    expect(lambdaContextSpy.done).toHaveBeenCalledWith(
      null,
      expect.objectContaining({
        statusCode: 400,
        body: JSON.stringify({
          error:
            'one or more songs is not valid - property has invalid datatype - should be boolean',
        }),
      })
    );
  });

  it('check validation of songs with invalid property values - featuring array', async () => {
    const { addSongs } = ENDPOINTS;

    const { invalidPropertiesFeaturing } = SONG_DETAILS;

    await api.proxyRouter(
      createEventObject(addSongs, POST_METHOD, invalidPropertiesFeaturing),
      lambdaContextSpy
    );
    expect(lambdaContextSpy.done).toHaveBeenCalledWith(
      null,
      expect.objectContaining({
        statusCode: 400,
        body: JSON.stringify({
          error:
            'one or more songs is not valid - featuring property has invalid datatype - should be array',
        }),
      })
    );
  });

  it('check validation of songs with invalid property values - featuring array contents', async () => {
    const { addSongs } = ENDPOINTS;

    const { invalidPropertiesFeaturingString } = SONG_DETAILS;

    await api.proxyRouter(
      createEventObject(
        addSongs,
        POST_METHOD,
        invalidPropertiesFeaturingString
      ),
      lambdaContextSpy
    );
    expect(lambdaContextSpy.done).toHaveBeenCalledWith(
      null,
      expect.objectContaining({
        statusCode: 400,
        body: JSON.stringify({
          error:
            'one or more songs is not valid - featuring property has invalid datatype - items should be strings',
        }),
      })
    );
  });

  it('check validation of songs with valid property values', async () => {
    const { addSongs } = ENDPOINTS;

    const { valid } = SONG_DETAILS;

    await api.proxyRouter(
      createEventObject(addSongs, POST_METHOD, valid),
      lambdaContextSpy
    );

    expect(lambdaContextSpy.done).toHaveBeenCalledWith(
      null,
      expect.objectContaining({
        statusCode: 200,
        body: JSON.stringify({}),
      })
    );
  });
});
