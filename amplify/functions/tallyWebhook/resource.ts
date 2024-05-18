import { defineFunction, secret } from '@aws-amplify/backend'

export const tallyWebhook = defineFunction({
	entry: './main.ts',
	environment: {
		TALLY_SIGNATURE: secret('TALLY_SIGNATURE'),
		SONG_PATH: 'songs/amplify-suno.mp3',
		VERIFIED_SES_FROM_EMAIL: 'mtliendo@focusotter.com',
	},
})
