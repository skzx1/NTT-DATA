#!/usr/bin/env bash
set -euo pipefail
export AWS_PAGER=""
export AWS_DEFAULT_REGION=ap-southeast-1
export SAM_CLI_TELEMETRY=0
account="$(aws sts get-caller-identity --query Account --output text)"
[[ "$account" == "109991964227" ]] || { echo 'WRONG ACCOUNT'; exit 1; }
cd "$(dirname "$0")/.."
sam validate --lint --region ap-southeast-1 --template-file template.yaml
sam deploy --template-file template.yaml --stack-name marginsight-demo --region ap-southeast-1 --resolve-s3 --capabilities CAPABILITY_IAM --parameter-overrides AIEnabled=true AIRegion=us-east-1 --no-execute-changeset --no-confirm-changeset --no-fail-on-empty-changeset
echo 'CHANGE SET PREPARED ONLY. Review IAM/resource changes before executing.'
