import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from '@aws-sdk/client-secrets-manager';

const DEV = process.env.NODE_ENV !== 'production';

async function decryptSecrets (secretId: string, region = 'us-east-1') {
    const client = new SecretsManagerClient({ region });

    let response;

    try {
        response = await client.send(
            new GetSecretValueCommand({
                SecretId: secretId,
                VersionStage: "AWSCURRENT", // VersionStage defaults to AWSCURRENT if unspecified
            })
        );
    } catch (error) {
        // For a list of exceptions thrown, see
        // https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
        throw error;
    }

    const secretStr = response.SecretString;

    if (secretStr && secretStr.length) {
        return JSON.parse(secretStr);
    }

    return {};
}

export const secrets = await decryptSecrets(!DEV ? process.env.VAULT_NAME : import.meta.env.VAULT_NAME);