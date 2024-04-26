var express = require("express");
var app = express();
var Memo = {};
const JSONbig = require("json-bigint-native");

// 行列の掛け算
function matMul(a, b) {
  let res = [
    [0n, 0n],
    [0n, 0n],
  ];
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {
      for (let k = 0; k < 2; k++) {
        res[i][j] = res[i][j] + a[i][k] * b[k][j];
      }
    }
  }
  return res;
}

// 行列の累乗
function matPow(a, n) {
  let res = [
    [1n, 0n],
    [0n, 1n],
  ];
  while (n > 0) {
    if (n & 1n) res = matMul(a, res);
    a = matMul(a, a);
    n >>= 1n;
  }
  return res;
}

function fibonacci(n) {
  if (typeof n !== "bigint") return 0n;
  if (n < 0n) return 0n;
  if (Number.isInteger(n)) return 0n;
  let m = [
    [1n, 1n],
    [1n, 0n],
  ];
  m = matPow(m, n);
  return m[1][0];
}

app.get("/fib", function (req, res) {
  if (isNaN(req.query.n)) {
    return res.status(400).json({
      status: 400,
      message: "Bad Request",
    });
  }
  const n = BigInt(req.query.n);
  const result = fibonacci(n);
  if (result === 0n) {
    return res.status(400).json({
      status: 400,
      message: "Bad Request",
    });
  }
  res.type("json").send(
    JSONbig.stringify({
      result: result,
    }),
  );
});

app.listen(3000, function () {});

module.exports = app;
module.exports.fibonacci = fibonacci;
module.exports.matMul = matMul;
module.exports.matPow = matPow;