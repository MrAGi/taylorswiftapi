import Debug from 'debug';
import ApiBuilder from 'claudia-api-builder';
import startCase from 'lodash.startcase';
import { DynamoDBHelper } from '../dynamodb';
import { SONG_PROPERTIES } from './helpers';
import { GLOBAL_SECONDARY_INDEXES, KEY_ATTRIBUTES } from '../dynamodb/helpers';

const debug = Debug('screencloud-api:songs');

const helper = new DynamoDBHelper();

const validateParams = (year) => {
  if (
    (typeof parseInt(year) !== 'number' && !isNaN(parseInt(year))) ||
    year.toString().length !== 4
  ) {
    return {
      valid: false,
      reason: 'year should an integer and be valid year in YYYY format',
    };
  }
  return { valid: true };
};

export const songs = (api) => {
  api.get(
    '/songs/year/{year}',
    async (request) => {
      const { pathParams } = request;
      const { year } = pathParams;
      const result = validateParams(year);
      const { valid, reason } = result;
      if (valid) {
        const result = await helper.getItems(
          { pk: `${year}` },
          {
            pkn: KEY_ATTRIBUTES.YEAR,
            index: GLOBAL_SECONDARY_INDEXES.YEAR,
          }
        );
        return result;
      }
      return new ApiBuilder.ApiResponse(
        { error: reason },
        { 'Context-Type': 'text/json' },
        400
      );
    },
    { apiKeyRequired: true }
  );

  api.get(
    '/songs/cover',
    async (request) => {
      const result = await helper.getItems(
        { pk: 1 },
        {
          pkn: KEY_ATTRIBUTES.COVER,
          index: GLOBAL_SECONDARY_INDEXES.COVER_VERSION,
        }
      );
      return result;
    },
    { apiKeyRequired: true }
  );

  api.get(
    '/songs/remix',
    async (request) => {
      const result = await helper.getItems(
        { pk: 1 },
        {
          pkn: KEY_ATTRIBUTES.REMIX,
          index: GLOBAL_SECONDARY_INDEXES.REMIX_VERSION,
        }
      );
      return result;
    },
    { apiKeyRequired: true }
  );

  api.get(
    '/songs/writer/{name}',
    async (request) => {
      const { pathParams } = request;
      let { name } = pathParams;

      if (name !== undefined) {
        name = name.replace('%20', ' ');
        name = startCase(name);
        debug(`name is ${name}`);
        const results = await helper.getItems(
          { pk: name },
          {
            pkn: KEY_ATTRIBUTES.WRITER,
            index: GLOBAL_SECONDARY_INDEXES.WRITER,
            begins: true,
          }
        );

        // remove dynamodb key info from song titles
        for (const result of results) {
          result.song = result.song.split('-w-')[0];
        }
        return results;
      }

      return new ApiBuilder.ApiResponse(
        { error: 'name is not defined' },
        { 'Context-Type': 'text/json' },
        400
      );
    },
    { apiKeyRequired: true }
  );

  api.get(
    '/songs/{artist}/{song}',
    async (request) => {
      const { pathParams } = request;
      let { artist, song } = pathParams;

      if (artist !== undefined && song !== undefined) {
        artist = artist.replace('%20', ' ');
        song = song.replace('%20', ' ');
        artist = startCase(artist);
        song = startCase(song);
        debug(`song is ${song}`);
        const results = await helper.getItems(
          { pk: artist, sk: song },
          {
            skn: KEY_ATTRIBUTES.SONG,
            begins: true,
          }
        );

        return results.filter(
          (result) =>
            !result.song.includes('-p-') &&
            !result.song.includes('-w-') &&
            !result.song.includes('-f-')
        );
      }

      return new ApiBuilder.ApiResponse(
        { error: 'name is not defined' },
        { 'Context-Type': 'text/json' },
        400
      );
    },
    { apiKeyRequired: true }
  );
};

export default songs;
