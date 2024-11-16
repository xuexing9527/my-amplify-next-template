import type { Schema } from "../resource"
import { env } from "$amplify/env/add-user-to-group"
import {
  AdminAddUserToGroupCommand,
  CognitoIdentityProviderClient,
} from "@aws-sdk/client-cognito-identity-provider"

type Handler = Schema["addUserToGroup"]["functionHandler"]
const client = new CognitoIdentityProviderClient({ region: env.AWS_DEFAULT_REGION })

export const handler: Handler = async (event) => {
  const { userId, groupName } = event.arguments
  console.log('userId: ', userId)
  console.log('groupName: ', groupName)
  const command = new AdminAddUserToGroupCommand({
    Username: userId,
    GroupName: groupName,
    UserPoolId: env.AMPLIFY_AUTH_USERPOOL_ID,
  })
  const response = await client.send(command)
  return response
}