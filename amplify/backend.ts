import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource.js';
import { data } from './data/resource.js';

defineBackend({
  auth,
  data,
});

const { groups } = backend.auth.resources

// https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_iam.IRole.html
groups["ADMINS"].role