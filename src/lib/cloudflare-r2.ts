import { AwsClient } from 'aws4fetch';

interface R2Config {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
}

const r2Config: R2Config = {
  accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
  accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
  secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
  bucketName: process.env.CLOUDFLARE_R2_BUCKET_NAME!
};

if (!r2Config.accountId || !r2Config.accessKeyId || !r2Config.secretAccessKey || !r2Config.bucketName) {
  throw new Error('Missing Cloudflare R2 configuration in environment variables');
}

export async function generatePresignedUploadUrl(filename: string, contentType: string) {
  const aws = new AwsClient({
    accessKeyId: r2Config.accessKeyId,
    secretAccessKey: r2Config.secretAccessKey,
    service: 's3'
  });

  const url = `https://${r2Config.accountId}.r2.cloudflarestorage.com/${r2Config.bucketName}/${filename}`;
  const signedRequest = await aws.sign(new Request(url, {
    method: 'PUT',
    headers: {
      'Content-Type': contentType
    }
  }));

  return {
    url: signedRequest.url,
    key: filename
  };
}
