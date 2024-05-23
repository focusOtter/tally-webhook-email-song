# Tally Webhook Email Song

![arch diagram](./readmeImages/tally-webhook-song-email-arch.png)

## Preparation

I create a new react ts vite app with `npm create vite@latest`

Next up I created the Tally form: https://tally.so/r/wAle4D

> 🗒️ I have to use a real stripe connected account so I set it to $1. Also Tally takes 5% on free plan but 0% when on pro plan.

After this I create a super simple landing page to verify the form is created and working.

## Backend Development

### Lambda Function Creation

I kick things off by initialing amplify and the sandbox

```sh
npm create amplify@latest
```

I don't need data or auth, so I remove those folders and add in a function and s3 bucket.

I start with my function and follow [the docs](https://docs.amplify.aws/react/build-a-backend/functions/set-up-function/) to create one.

Super easy.

### Storage Bucket Creation

Next I want to add a bucket to hold my song. I follow [the docs](https://docs.amplify.aws/react/build-a-backend/storage/authorization/) here to not only create the bucket but add the needed auth rules.

Instead of adding the business logic in the function I'm going to push this up:

```sh
npx amplify sandbox --profile focus-otter-youtube
```

Whoops, the terminal yelled at me. It's now the following:

```sh
npx ampx sandbox --profile focus-otter-youtube
```

Once this was setup, I downloaded a song I made from Suno and put it in a `songs` folder in S3.

## Tally Webhook Setup

This seems simple enough. Once my deployment is done, I'll get a webhook URL in my `amplify_outputs.json` file. I'll grab that and head to my Tally form, click on integrations, and then select HTTP webhook.

It's asking for the webhook endpoint and provides a signing secret (uuid).

That _was_ simple. Now to verify:

I follow [this site](https://tally.so/help/webhooks).

> 🗒️ A Tally webhook endpoint has a 10-second timeout

I get what looks good enough to test up an running. I hardcoded my secret signature value for now.

This is my first attempt:

```ts
import * as crypto from 'crypto'

export const handler = async (event: {
	body: object
	headers: { ['tally-signature']: string }
}) => {
	// your function code goes here
	console.log('the event', event)
	const webhookPayload = event.body
	const receivedSignature = event.headers['tally-signature']

	// Replace 'YOUR_SIGNING_SECRET' with your signing secret
	const yourSigningSecret = 'my-secret-value'

	// Calculate the signature using the signing secret and the payload
	const calculatedSignature = crypto
		.createHmac('sha256', yourSigningSecret)
		.update(JSON.stringify(webhookPayload)) //! This is wrong, I figure it out later. No need to stringify
		.digest('base64')

	// Compare the received signature with the calculated signature
	if (receivedSignature === calculatedSignature) {
		// Signature is valid, process the webhook payload
		console.log('Webhook payload valid!:', webhookPayload)
	} else {
		// Signature is invalid, reject the webhook request
		console.log('Webhook payload invalid!')
	}
	return 'Hello, World!'
}
```

Now I'm going to spend 1 _real_ dollar and test this out. Oh wait!! Stupid me lol. Why don't I just remove the stripe payment part from the form 😅

I removed it. Note I also changed the value of the name field to `myName`. This isn't the title text or the placeholder, but the field name.

### Testing

In one tab I have the form, in another I have the AWS Cloudwatch console for my lambda.

Worked first try :) The body is a string. So I'll have to mess up the secret to verify I get invalid...I do.

### Adding the tally signature as a secret

I close the sandbox and run the following command after following [this doc](https://docs.amplify.aws/react/deploy-and-host/fullstack-branching/secrets-and-vars/#local-environment):

```sh
npx ampx sandbox secret set TALLY_SIGNATURE --profile focus-otter-youtube
```

Wait...I'm following the docs but it says the signature is invalid.

After 30 minutes of troublehshooting, I realized the signature was never valid. I misread the logs 🤦‍♂️

The tweak was that I didn't need to stringify when doing `.update(JSON.stringify(webhookPayload))`. I'll add that comment to the snippet above.

## Getting the presigned URL

I initially thought I needed to [get the object from S3](https://github.com/mtliendo/simple-stripe-checkout/blob/main/amplify/functions/stripe-checkout/helpers/getObjectFromS3.ts) but turns out I just need to grab a presigned URL. Fortunately I have [that code](https://github.com/mtliendo/fullstack-ticketer/blob/main/amplify/customResources/functions/utils/saveImageAndReturnSignedURL.ts#L28-L38) as well.

I tested this and it works just fine :)

## Sending the email

I thought I had a snippet for this as well, but it's for [sending a raw email attachment](https://github.com/mtliendo/simple-stripe-checkout/blob/ed0b7d67365741f1b4fcb1c1878dcca277e40ae1/amplify/functions/stripe-checkout/helpers/sendSESEmailWithAttachment.ts#L4). I'll use this in another project.

I used Bedrock to create the code. Tested it out and....it failed. Oh, of course: I forgot to add the IAM policy.

I used Bedrock for this as well:

```ts
const sesPolicy = new PolicyStatement({
	effect: Effect.ALLOW,
	actions: ['ses:SendEmail', 'ses:SendRawEmail'],
	resources: ['*'],
})
```

I added that to the role policy and am ready to test this out!
It worked :)

All that's left from here is to clean up the code and make the UI pretty. I'll likely add Tailwind and DaisyUI in addition to moving some of the backend code into their own files.

Thanks for following along!

## Moving to Prod

I was wondering what the experience would be like making this a real thing. My AWS account is in the sandbox so I can send emails to everyone. It's a pretty healthy account and has my focusotter.com domain on it for my site and email so I simply requested prod access and gave the reason that I'm a content creator🤷‍♂️

Regarding Amplify, I had to remind myself that the sandbox is just that...and ephemeral space. So I pushed my app to GitHub, added back in my envvars, and added my secret. I made sure to give them all the same names.

One thing is that my function URL is going to be newly generated and I had to put my song in the bucket. Fortunately, Amplify's hosting console has file management. The Lambda console also let's me see my envVars and cloudwatch logs 😮. I had to click on the link to the Lambda console to get the function URL, but once I got that, I went over to Tally and updated my form to use my new lambda url. This didn't require me to update my secret 👌

From there, I tested out my site and everything still worked. Hopefully I get prod access soon so everyone can test this out!
