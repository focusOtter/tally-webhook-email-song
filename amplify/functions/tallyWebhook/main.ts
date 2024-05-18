import { env } from '$amplify/env/main'
import { verifyTallyWebhook } from './utils/verifyTallyWebhook'
import { generatePresignedURL } from './utils/generatePresignedURL'
import { sendHTMLEmail } from './utils/sendHTMLEmail'

const processFields = async (
	fieldsData: [{ label: string; value: string }]
) => {
	//* I can mark these as required (!) because they're required fields in my form.
	const email = fieldsData.find((field) => field.label === 'email')!.value
	const firstName = fieldsData.find(
		(field) => field.label === 'firstName'
	)!.value

	// this is the email that was in the form and should be verified in SES if in sandbox
	console.log('the email', email)
	console.log('the first name', firstName)

	// Get the song url from S3

	const url = await generatePresignedURL(
		env.SONG_STORAGE_BUCKET_NAME,
		env.SONG_PATH,
		3600 //expires in 1 hour
	)
	// Send email with the song
	await sendHTMLEmail(
		env.VERIFIED_SES_FROM_EMAIL,
		[email],
		'Your song has arrived!',
		`
		<html>
		<body>
		<h1>Hello from Focus Otter Music!</h1>
		<p>Hey ${firstName}, thanks so much for your purchase!</p>
		<p>Here is <a href="${url}">your song</a>. Hope you enjoy!</p>
		</body>
		</html>
	`
	)
}

export const handler = async (event: {
	body: string
	headers: { ['tally-signature']: string }
}) => {
	const validatedWebhookPayload = await verifyTallyWebhook(
		event.body,
		event.headers['tally-signature'],
		env.TALLY_SIGNATURE
	)

	switch (validatedWebhookPayload.eventType) {
		case 'FORM_RESPONSE':
			await processFields(validatedWebhookPayload.data.fields)
			break

		default:
			break
	}

	return 'Function end!'
}
