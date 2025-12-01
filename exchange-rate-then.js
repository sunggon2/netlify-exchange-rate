const currencyNames = {
  USD: '달러',
  KRW: '원',
  EUR: '유로',
  JPY: '엔',
  CNY: '위안',
};

document.getElementById('convertBtn').addEventListener('click', convertCurrency);

function convertCurrency() {
  const amount = parseFloat(document.getElementById('amount').value);
  const fromCurrency = document.getElementById('fromCurrency').value;
  const toCurrency = document.getElementById('toCurrency').value;

  if (isNaN(amount) || amount <= 0) {
    document.getElementById('result').innerText = '올바른 금액을 입력하세요.';
    return;
  }

  if (fromCurrency === toCurrency) {
    document.getElementById('result').innerText = '서로 다른 통화를 선택하세요.';
    return;
  }

  // 👉 외부 환율 API가 아니라, Netlify Function을 호출
  const url = `/.netlify/functions/get-rate?base=${fromCurrency}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (data.result === 'success') {
        const rate = data.conversion_rates[toCurrency];
        if (!rate) {
          document.getElementById('result').innerText =
            '선택한 통화의 환율 정보를 찾을 수 없습니다.';
          return;
        }

        const convertedAmount = amount * rate;
        const fromCurrencyName = currencyNames[fromCurrency];
        const toCurrencyName = currencyNames[toCurrency];

        document.getElementById('result').innerText =
          `${amount} ${fromCurrencyName}는 ${convertedAmount.toFixed(2)} ${toCurrencyName}입니다.`;
      } else {
        document.getElementById('result').innerText =
          '환율 정보를 가져오는 데 실패했습니다.';
      }
    })
    .catch((error) => {
      document.getElementById('result').innerText =
        '오류가 발생했습니다: ' + error.message;
    });
}
