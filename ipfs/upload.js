const { create } = require('ipfs-http-client');

const ipfs = create('https://ipfs.infura.io:5001');

async function run() {
  const files = [
    {
      path: '/',
      content: JSON.stringify({
        name: 'test1',
      }),
    },
    {
      path: '/',
      content: JSON.stringify({
        name: 'test2',
      }),
    },
    {
      path: '/',
      content: JSON.stringify({
        name: 'test3',
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
