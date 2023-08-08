import * as currencyCloud from 'currency-cloud';

const loginId = 'tech@keewe.eu';
const apiKey = '8f6568f36d852eb44e876fa82935429a9666393b4a1a4bf3af6e91b761d42b31';

const conversionId = 'd9b16e34-463d-4d7d-b89e-15f8ea010c0f';

currencyCloud.authentication.login({
  environment: 'demo',
  loginId: loginId,
  apiKey: apiKey
})
  .then(() => {
    return currencyCloud.conversions.find();
  })
  .then((res) => {
    const conversion = res.conversions.find((conv) => {
      return conv.id === conversionId;
    });

    if (conversion) {
      console.log('Conversion details: ' + JSON.stringify(conversion, null, 2));
    } else {
      console.log('Conversion not found.');
    }
  })
  .then(currencyCloud.authentication.logout)
  .catch(console.log);
