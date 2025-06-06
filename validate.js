const { isNotaryToolAvailable } = require('@electron/notarize/lib/notarytool');
const {
	validateNotaryToolAuthorizationArgs,
	validateLegacyAuthorizationArgs
} = require('@electron/notarize/lib/validate-args');

function getAuthInfo() {
	const {
		APPLE_ID: appleId,
		APPLE_ID_PASSWORD: appleIdPassword,
		APPLE_API_KEY: appleApiKey,
		APPLE_API_KEY_ID: appleApiKeyId,
		APPLE_API_KEY_ISSUER: appleApiIssuer,
		API_KEY_ID: legacyApiKey,
		API_KEY_ISSUER_ID: legacyApiIssuer,
		TEAM_SHORT_NAME: teamShortName,
		APPLE_TEAM_ID: teamId,
		APPLE_KEYCHAIN: keychain,
		APPLE_KEYCHAIN_PROFILE: keychainProfile
	} = process.env;

	return {
		appleId,
		appleIdPassword,
		appleApiKey,
		appleApiKeyId,
		appleApiIssuer,
		teamShortName,
		teamId,
		keychain,
		keychainProfile,
		legacyApiIssuer,
		legacyApiKey
	};
}

module.exports = async () => {
	const options = getAuthInfo();

	if (options.legacyApiIssuer) {
		console.log('WARNING: legacy no longer supported');
	}
	
	if (!await isNotaryToolAvailable()) {
		console.log('WARNING: notarytool not found; legacy no longer supported')
	}
	
	try {
		const creds = validateNotaryToolAuthorizationArgs(options);
		return {
			...creds,
			tool: 'notarytool'
		};
	} catch (e) {
		console.error(e);
	}
};
