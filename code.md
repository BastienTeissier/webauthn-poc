## Registration :

```
const options = generateRegistrationOptions({
      rpName,
      rpID,
      userID: user.id,
      userName: user.email,
      // Don't prompt users for additional information about the authenticator
      // (Recommended for smoother UX)
      attestationType: 'none',
      // Prevent users from re-registering existing authenticators
      /* excludeCredentials: userAuthenticators.map(authenticator => ({
        id: authenticator.credentialID,
        type: 'public-key',
        // Optional
        transports: authenticator.transports,
      })), */
    });
```

```
const data = {
  attestation: 'none',
  authenticatorSelection: {
    residentKey: 'preferred',
    userVerification: 'preferred',
    requireResidentKey: false,
  },
  challenge: 'KNZxXvwbf_1iH-Xi5zeJfTxx56UNcbYOnfXUKnGAWfA',
  excludeCredentials: [],
  extensions: { credProps: true },
  pubKeyCredParams: [],
  rp: { name: 'SimpleWebAuthn Example', id: 'localhost' },
  timeout: 60000,
  user: {
    id: '6e762751-4dcb-40e2-95fb-678dc5c91394',
    name: 'try1@try.fr',
    displayName: 'try1@try.fr',
  },
};
```

```
const credential = {
  authenticatorAttachment: 'platform',
  clientExtensionResults: { credProps: { rk: true } },
  id: 'ARlQgx7kO0waUCTQ4k - URz0ebO - jUgiQ8ToVI_zlGR0',
  rawId: 'ARlQgx7kO0waUCTQ4k - URz0ebO - jUgiQ8ToVI_zlGR0',
  response: {
    attestationObject:
      'o2NmbXRkbm9uZWdhdHRTdG10oGhhdXRoRGF0YVikSZYN5YgOjGh0NBcPZHZgW4_krrmihjLHmVzzuoMdl2NFAAAAAK3OAAI1vMYKZIsLJfHwVQMAIAEZUIMe5DtMGlAk0OJPlEc9Hmzvo1IIkPE6FSP85RkdpQECAyYgASFYIAb47_PZrTjq4FeoXch5h3OWEMMUs4osoE2WSueHb0cyIlggqdyvrYggmDkFqEC84khwrz65uxWIKFjsYtppxI4dDE0',
    clientDataJSON:
      'eyJ0eXBlIjoid2ViYXV0aG4uY3JlYXRlIiwiY2hhbGxlbmdlIjoic2ZfYmhUWllVRFdpa1FDOTJvM196U0pROF9WTm9ROWhKWFVZcGhuUDNJUSIsIm9yaWdpbiI6Imh0dHA6Ly9sb2NhbGhvc3Q6MzAwMCIsImNyb3NzT3JpZ2luIjpmYWxzZX0',
    transports: ['internal'],
  },
  type: 'public - key',
};
```

```
const { verified, registrationInfo } = await verifyRegistrationResponse({
      response: credential,
      expectedChallenge: user.currentChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
    });
```

```
const authenticator = {} as Authenticator;
authenticator.rawId = credential.rawId;
authenticator.credentialID = registrationInfo.credentialID;
authenticator.credentialPublicKey = registrationInfo.credentialPublicKey;
authenticator.counter = registrationInfo.counter;
authenticator.credentialDeviceType = credential.type;
authenticator.transports = credential.transports;
authenticator.user = user;
```

## Login :

```
const options = generateAuthenticationOptions({
      // Require users to use a previously-registered authenticator
      allowCredentials: user.authenticators.map(authenticator => ({
        id: authenticator.credentialID,
        type: 'public-key',
        // Optional
        transports: [],
      })),
      userVerification: 'preferred',
    });
```

```
const options = {
  allowCredentials: [
    {
      id: 'VvBQdubpupuEDqF1BCULTkuPLhwD-awgI8zbxJHRXzw',
      type: 'public-key',
      transports: ['internal'],
    },
  ],
  challenge: 'wh-9Fgg8em4OLUZ9vVeaWPVIACj0SVqjqw1iJJ9laLA',
  extensions: undefined,
  rpId: undefined,
  timeout: 60000,
  userVerification: 'preferred',
};
```

```
const credential = await startAuthentication(
    {
        allowCredentials: [
            {
            id: 'VvBQdubpupuEDqF1BCULTkuPLhwD-awgI8zbxJHRXzw',
            type: 'public-key',
            transports: ['internal'],
            },
        ],
        challenge: 'wh-9Fgg8em4OLUZ9vVeaWPVIACj0SVqjqw1iJJ9laLA',
        extensions: undefined,
        rpId: undefined,
        timeout: 60000,
        userVerification: 'preferred',
    };
);
```

```
const credential = {
  authenticatorAttachment: 'platform',
  clientExtensionResults: {},
  id: 'VvBQdubpupuEDqF1BCULTkuPLhwD-awgI8zbxJHRXzw',
  rawId: 'VvBQdubpupuEDqF1BCULTkuPLhwD-awgI8zbxJHRXzw',
  response: {
    authenticatorData: 'SZYN5YgOjGh0NBcPZHZgW4_krrmihjLHmVzzuoMdl2MFAAAAAA',
    clientDataJSON: 'eyJ0eXBlIjoid2ViYXV0aG4uZ2V0IiwiY2hhbGxlb…vc3Q6MzAwMCIsImNyb3NzT3JpZ2luIjpmYWxzZX0',
    signature: 'MEUCIQDCuXlRKli7wb3a8qyHb3ijkPsh00J3Ro73WtR…FONDJ3dwL9x9Oxsp8BfYWK4Jd1nRKh_dF9xrY8C5fh0',
    userHandle: '673fc455-7b3e-4a47-8f90-07f05f2a106c'
  },
  authenticatorData: 'SZYN5YgOjGh0NBcPZHZgW4_krrmihjLHmVzzuoMdl2MFAAAAAA',
  clientDataJSON: 'eyJ0eXBlIjoid2ViYXV0aG4uZ2V0IiwiY2hhbGxlbmdlIjoid2gtOUZnZzhlbTRPTFVaOXZWZWFXUFZJQUNqMFNWcWpxdzFpSko5bGFMQSIsIm9yaWdpbiI6Imh0dHA6Ly9sb2NhbGhvc3Q6MzAwMCIsImNyb3NzT3JpZ2luIjpmYWxzZX0',
  signature:'MEUCIQDCuXlRKli7wb3a8qyHb3ijkPsh00J3Ro73WtRxC9qw5gIgFONDJ3dwL9x9Oxsp8BfYWK4Jd1nRKh_dF9xrY8C5fh0',
  userHandle: '673fc455-7b3e-4a47-8f90-07f05f2a106c',
  type: 'public-key',
}
```

```
const { verified } = await verifyAuthenticationResponse({
      response,
      expectedChallenge: user.currentChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      authenticator: authenticator,
    });
```

```

```
