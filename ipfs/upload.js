const { create } = require('ipfs-http-client');

const ipfs = create('https://ipfs.infura.io:5001');

async function run() {
  const files = [
    {
      path: '/',
      content: JSON.stringify({
        name: 'Resume',
        description: 'My latest resume',
      }),
    },
    {
      path: '/',
      content: JSON.stringify({
        name: 'Chainshot Certificate',
        description: 'Certificate issued by Chainshot bootcamp',
        image: 'https://ipfs.io/ipfs/QmRhxyUf6173cbmEAQWm4tZ2gFGoQYHgE9NhHBV1X5JMuV',
        attributes: [
          {
            trait_type: 'Issued Date',
            value: '06/28/2022',
          },
          {
            trait_type: 'Recipient Name',
            value: 'Taewoo Ryu',
          },
        ],
      }),
    },
  ];

  for await (const result of ipfs.addAll(files)) {
    console.log(result);
  }
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
run();
