import { SNS, SharedIniFileCredentials } from 'aws-sdk'
import { env } from 'process';
import { ChatTopicsTypes } from './chatTopicsTypes';

function getSnsProvider(credentials?: SharedIniFileCredentials) {
  const endpointUrl = env.SQS_ENDPOINT_URL;
  const region = env.SQS_REGION ?? 'eu-central-1'

  if (!credentials) {
    console.log("AWS")
    return new SNS({
      region: region
    })
  }

  if (endpointUrl) {
    console.log({ endpointUrl, region })
    const config: SNS.ClientConfiguration = {
      region: region,
      endpoint: endpointUrl,
      credentials: credentials
    };

    return new SNS(config);
  }
  console.log("AWS")
  return new SNS({
    region: region
  })
}

export async function deliveryChatMessage<T>(topic: ChatTopicsTypes, res: T) {
  const credentials = new SharedIniFileCredentials({ profile: 'test-profile' });

  if (!credentials.accessKeyId || !credentials.secretAccessKey) {
    await executeSNS(undefined, topic, res);
    return;
  }

  await executeSNS(credentials, topic, res);
}

async function executeSNS<T>(credentials: SharedIniFileCredentials | undefined, topic: ChatTopicsTypes, res: T) {
  const sns = getSnsProvider(credentials)

  const topicArn = getTopicArn(topic)

  if (!topicArn) {
    return
  }

  const topics = await sns.listTopics().promise()

  topics.Topics?.forEach(async x => {

    const message = JSON.stringify(res)

    const params = {
      Message: message,
      TopicArn: x.TopicArn
    };

    await sns.publish(params).promise()

  })

}

function getTopicArn(topic: ChatTopicsTypes) {
  switch (topic) {

    case (ChatTopicsTypes.NEW_CHAT):
      return env.CREATE_CHAT_NOTIFY_URL;

    case (ChatTopicsTypes.CONTINUE_CHAT):
      return env.CONTINUE_CHAT_NOTIFY_URL;

  }
}
