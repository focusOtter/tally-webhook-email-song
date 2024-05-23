# Content Stuff

These are just my freeform thoughts.

## Blog Post: How to email a digital product with Tally forms and AWS Amplify Gen 2

_Cover Image_: This should include Tally, Lambda, S3, Amplify and SES icons. A simple backdrop (nothing crazy AI generated) with an architecture diagram should work. Make sure to include service names and not just the icons

_Story_: My first foray into the world of

Something like the following will probably work:

1. Title: Intro on how it's tough to sell a digital product but it shouldn't be.
2. Frontend Overview

- Vite
- HaiKei
- Tailwind/DaisyUI
- Tally Form

3. Backend Overviews

- Amplify init
- Create S3 Bucket
- Deploy to ensure creation
- Create Lambda Function
- Extend Lambda with Function URL and S3 permissions

4. Backend Lambda Function Logic

- Ensure verify SES Emails due to sandbox
- Add Secrets: Tally webhook sig, bucket name,email, put product in S3
- Write backend code to verify sig
- Code to get item from S3 as presigned URL
- Code to send via SES

5. Deploy and Test and Destroy
6. Moving to Production

- Getting SES in production
- Getting Published to Amplify Hosting
- link to custom domain

## Video

Use blog as an outline. Show the frontend. Create the form. Build the backend.

## Social Content

- readme
- blog
- video

Use Canva + Excalidraw for the cover images. Video Tap to create the shortform video clips, youtube meta stuff
