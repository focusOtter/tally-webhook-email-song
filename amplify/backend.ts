import { FunctionUrlAuthType } from 'aws-cdk-lib/aws-lambda'
import { tallyWebhook } from './functions/tallyWebhook/resource'
import { defineBackend } from '@aws-amplify/backend'
import { storage } from './storage/resource'
import { PolicyStatement } from 'aws-cdk-lib/aws-iam'

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
	storage,
	tallyWebhook,
})

const funcURL = backend.tallyWebhook.resources.lambda.addFunctionUrl({
	authType: FunctionUrlAuthType.NONE,
})

backend.tallyWebhook.resources.lambda.addToRolePolicy(
	new PolicyStatement({
		actions: ['ses:SendEmail', 'ses:SendRawEmail'],
		resources: ['*'],
	})
)

backend.addOutput({
	custom: {
		tallyWebhookUrl: funcURL.url,
	},
})
