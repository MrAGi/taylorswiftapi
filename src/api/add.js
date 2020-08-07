import Debug from 'debug';
import ApiBuilder from 'claudia-api-builder';
import { DynamoDBHelper } from '../dynamodb';
import { SONG_PROPERTIES } from './helpers';

const debug = Debug('screencloud-api:add');

const helper = new DynamoDBHelper();

const validateSongs = (songs) => {
  for (const item of songs) {
    if (!SONG_PROPERTIES.every((elem) => Object.keys(item).includes(elem))) {
      return { valid: false, reason: 'missing property' };
    }

    const {
      song,
      artist,
      album,
      writer,
      year,
      june,
      july,
      august,
      cover,
      albumVersion,
      singleVersion,
      remix,
      live,
      piano,
      featuring,
    } = item;

    if (
      ![song, artist, album, year, june, july, august].every(
        (elem) => typeof elem === 'string'
      )
    ) {
      return {
        valid: false,
        reason: 'property has invalid datatype - should be string',
      };
    }

    if (
      ![cover, singleVersion, albumVersion, remix, live, piano].every(
        (elem) => typeof elem === 'boolean'
      )
    ) {
      return {
        valid: false,
        reason: 'property has invalid datatype - should be boolean',
      };
    }

    if (!Array.isArray(writer)) {
      return {
        valid: false,
        reason: 'writer property has invalid datatype - should be array',
      };
    } else {
      if (!writer.every((elem) => typeof elem === 'string')) {
        return {
          valid: false,
          reason:
            'writer property has invalid datatype - items should be strings',
        };
      }
    }

    if (featuring !== undefined) {
      if (!Array.isArray(featuring)) {
        return {
          valid: false,
          reason: 'featuring property has invalid datatype - should be array',
        };
      } else {
        if (!featuring.every((elem) => typeof elem === 'string')) {
          return {
            valid: false,
            reason:
              'featuring property has invalid datatype - items should be strings',
          };
        }
      }
    }
  }

  return { valid: true };
};

export const add = (api) => {
  api.post(
    '/songs/add',
    async (request) => {
      if (Object.prototype.hasOwnProperty.call(request, 'body')) {
        const { body } = request;
        if (Array.isArray(body)) {
          const result = validateSongs(body);
          const { valid, reason } = result;
          if (valid) {
            const result = await helper.putItems(body);
            return result;
          }
          return new ApiBuilder.ApiResponse(
            { error: `one or more songs is not valid - ${reason}` },
            { 'Context-Type': 'text/json' },
            400
          );
        }
        return new ApiBuilder.ApiResponse(
          { error: 'songs not provided as an array' },
          { 'Context-Type': 'text/json' },
          400
        );
      }
    },
    { apiKeyRequired: true }
  );
};

export default add;
