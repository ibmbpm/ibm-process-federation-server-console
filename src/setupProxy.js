/*
 Copyright IBM Corp. 2023
*/

const { createProxyMiddleware } = require('http-proxy-middleware');

// list of PFS end points
let pfsNodesEndpoints = process.env.PFSNODESENDPOINTS.split(',');

/**
 * Returns the first target in the list
 * @param {*} req
 * @returns
 */
function getTarget(req) {
  const target = pfsNodesEndpoints[0];
  console.log(`Proxy. Target is ${target}`);
  return target;
}

/**
 * Handles response
 * @param {*} res
 */
function handleResponse(res) {
  console.log(`Proxy. Handling response`);
}

/**
 * Handles errors.
 * Move the failing node url at the end of the list.
 *
 * @param {*} err
 * @param {*} req
 * @param {*} res
 * @param {*} target
 */
function handleError(err, req, res, target) {
  console.log(`Proxy. Error ${err.code}`);
  console.log(`Could not contact ${target.href}`);

  // move node
  const pfsnode = pfsNodesEndpoints.shift();
  pfsNodesEndpoints.push(pfsnode);
  console.log(`Next target will be ${pfsNodesEndpoints[0]}`);

  // ending the response
  res.writeHead(500, {
    'Content-Type': 'text/plain',
  });
  res.end();
}

module.exports = function(app) {
  app.use(
    createProxyMiddleware('/pfsconsole/api/', {
      secure: false,
      changeOrigin: true,
      router: getTarget,
      onProxyRes: handleResponse,
      onError: handleError,
    })
  );
};
