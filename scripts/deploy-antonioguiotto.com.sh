#!/usr/bin/env bash

BUCKET=antonioguiotto.com
APP_PATH=./WEB-4

echo "Removing all files from bucket $BUCKET"
aws s3 rm s3://$BUCKET --recursive --profile=a1

echo "Syncing files to $BUCKET"
aws s3 sync $APP_PATH s3://$BUCKET/ --profile=a1

echo "S3 Upload complete"

echo "Invalidating cloudfrond distribution to get fresh cache"
aws cloudfront create-invalidation --distribution-id=E35044XML0GVE1 --paths / --profile=a1

echo "Deployment complete"

