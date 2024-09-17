
export async function isProcessOnChain(id) {
  const start = performance.now();
  // console.log('==> [isProcessOnChain]');

  const queryObject = {
    query:
      `{
        transactions (
          ids: "${id}"
        ) {
          edges {
            node {
              id
              owner {
                address
              }
              tags {
                name
                value
              }
            }
          }
        }
      }`
  };

  try {
    const response = await fetchGraphQL(queryObject);
    // console.log("response:", response)

    const end = performance.now();
    // console.log(`<== [isProcessOnChain] [${Math.round(end - start)} ms]`);

    if (response.length == 0)
      return '';
    else
      return response[0].node.id;
  } catch (error) {
    console.log("isProcessOnChain -> ERR:", error);
    return '';
  }
}

export async function fetchGraphQL(queryObject) {
  const response = await fetch('https://arweave.net/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // 'Authorization': 'Bearer YOUR_TOKEN',
    },
    body: JSON.stringify(queryObject),
  });

  const data = await response.json();
  // console.log("==> data:", data)
  return data.data.transactions.edges;
}