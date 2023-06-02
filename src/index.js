export default ({ filter }, { env, exceptions }) => {
	const { InvalidPayloadException } = exceptions;

	filter('items.create', async (input, { collection }) => {

		if (collection !== 'customers') return input;
		if (input.phone_number === undefined) {
			throw new InvalidPayloadException('No Phone Number has been provided');
		}

		const accountSid = env.TWILIO_ACCOUNT_SID;
		const authToken = env.TWILIO_AUTH_TOKEN;
		const client = require('twilio')(accountSid, authToken);

		client.lookups.v2.phoneNumbers(input.phone_number).fetch().then(
			phone_number => {
				if(!phone_number.valid){
					throw new InvalidPayloadException('Phone Number is not valid');
				}
				return input;
			}
		);
	});
};
