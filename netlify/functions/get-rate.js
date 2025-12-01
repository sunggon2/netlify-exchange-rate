// netlify/functions/get-rate.js

const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));

exports.handler = async (event) => {
  try {
    const base =
      (event.queryStringParameters && event.queryStringParameters.base) ||
      'USD';

    const apiKey = process.env.EXCHANGE_API_KEY;
    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          result: 'error',
          message: '서버에 EXCHANGE_API_KEY 환경변수가 설정되어 있지 않습니다.',
        }),
      };
    }

    const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${base}`;

    const response = await fetch(url);
    const data = await response.json();

    // 그대로 프론트로 전달 (result, conversion_rates 등)
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        result: 'error',
        message: error.message,
      }),
    };
  }
};
