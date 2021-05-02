import config from './config';
import { MongoClient } from 'mongodb';

export function getConnection(): MongoClient {
    return new MongoClient(config.mongo_uri, { useUnifiedTopology: true });
}