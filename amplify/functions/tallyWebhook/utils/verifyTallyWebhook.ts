import * as crypto from 'crypto'

type WebhookPayload = {
	data: {
		fields: [{ label: string; value: string }]
	}
	eventType: string
}

export const verifyTallyWebhook = async (
	webhookPayload: string,
	receivedSignature: string,
	yourSigningSecret: string
) => {
	const calculatedSignature = crypto
		.createHmac('sha256', yourSigningSecret)
		.update(webhookPayload)
		.digest('base64')

	// Compare the received signature with the calculated signature
	if (receivedSignature === calculatedSignature) {
		// Signature is valid, process the webhook payload
		const validatedWebhookPayload: WebhookPayload = JSON.parse(webhookPayload)
		return validatedWebhookPayload
	} else {
		// Signature is invalid, reject the webhook request
		throw Error('Webhook payload invalid!')
	}
}
