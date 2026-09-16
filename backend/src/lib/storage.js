import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import { config } from '../config.js';

const s3 = config.storageMode === 's3' ? new S3Client({
  region: config.s3.region,
  endpoint: config.s3.endpoint || undefined,
  forcePathStyle: Boolean(config.s3.endpoint),
  credentials: { accessKeyId: config.s3.accessKeyId, secretAccessKey: config.s3.secretAccessKey },
}) : null;

export async function putObject(key, body, contentType) {
  if (config.storageMode !== 's3') throw new Error('En producción se requiere STORAGE_MODE=s3');
  await s3.send(new PutObjectCommand({ Bucket: config.s3.bucket, Key: key, Body: body, ContentType: contentType, ServerSideEncryption: config.s3.sse || undefined }));
  return key;
}

export async function getObject(key) {
  if (config.storageMode !== 's3') throw new Error('Almacenamiento S3 no configurado');
  const result = await s3.send(new GetObjectCommand({ Bucket: config.s3.bucket, Key: key }));
  return { stream: result.Body instanceof Readable ? result.Body : Readable.from(result.Body), contentType: result.ContentType };
}
