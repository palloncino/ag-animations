#!/usr/bin/env bash

BUCKET=animation-slot-01
APP_PATH=./NODE-6/dist

echo "Removing all files from bucket $BUCKET"
aws s3 rm s3://$BUCKET --recursive --profile=a1

echo "Syncing files to $BUCKET"
aws s3 sync $APP_PATH s3://$BUCKET/ --profile=a1

echo "S3 Upload complete"