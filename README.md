# Simple credential issuer CLI

```shell
pnpm i
```
Then:
```shell
node src/create-credential.js
node src/verify-credential.js
node src/list-identifiers.js
node src/verify-credentials.js
```

To create a credential from an existing template:
1. (Only on fresh install) Create an "identifier" for the credential issuer
2. Open create-credential.js and tweak any hardcoded values (comments left next to each item you need to change)
    ```shell
   node src/create-credential.js
   `````
3. If you want to verify before using, copy and paste the output from create-credential.js to verify-credential.js and run
   ```shell
   node src/verify-credential.js
   `````

To create a completely new type of credential:
1. Copy "create-credential.js" into a new file, e.g. "create-credential-<credential-name>.js"
2. Make modifications to the credential as you please. The thing you'll most likely want to change is the "credentialSubject" object (where "claims" or assertion about an entity are made: https://www.w3.org/TR/vc-data-model-2.0/#credential-subject)