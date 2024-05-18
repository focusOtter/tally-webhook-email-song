import { defineStorage } from '@aws-amplify/backend'
import { tallyWebhook } from '../functions/tallyWebhook/resource'

export const storage = defineStorage({
	name: 'songStorage',
	access: (allow) => ({
		'songs/*': [allow.resource(tallyWebhook).to(['read'])],
	}),
})
