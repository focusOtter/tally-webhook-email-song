import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'

export const s3Client = new S3Client()

export const generatePresignedURL = async (
	Bucket: string,
	Key: string,
	expiresIn: number
) => {
	const url = await getSignedUrl(
		s3Client,
		new GetObjectCommand({
			Bucket,
			Key,
		}),
		{
			expiresIn, // URL expires in 1 hour
		}
	)
	return url
}
