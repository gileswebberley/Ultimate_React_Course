import { useState, useEffect } from 'react';
//CURRENCY CONVERTER ----------------------------------------------
// `https://api.frankfurter.app/latest?amount=100&from=EUR&to=USD`
const ConverterURL = 'https://api.frankfurter.app/latest?';

function CurrencyConverter() {
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [amount, setAmount] = useState('100');
  const [outputAmount, setOutputAmount] = useState('');

  useEffect(
    function () {
      const controller = new AbortController();
      async function convertCurrency() {
        console.log(
          `Search term is: ${ConverterURL}amount=${amount}&from=${fromCurrency}&to=${toCurrency}`
        );
        try {
          const res = await fetch(
            `${ConverterURL}amount=${amount}&from=${fromCurrency}&to=${toCurrency}`,
            { signal: controller.signal }
          );
          const data = res?.ok ? await res.json() : {};
          setOutputAmount(data.rates[toCurrency]);
          console.log(`result from query is: ${JSON.stringify(data)}`);
        } catch (error) {
          console.log(error.message);
        } finally {
        }
      }
      if (amount !== '' && toCurrency !== fromCurrency) convertCurrency();
      else if (toCurrency === fromCurrency) setOutputAmount(amount);
      else setOutputAmount('');
      return () => {
        controller.abort();
      };
    },
    [fromCurrency, toCurrency, amount]
  );

  return (
    <div>
      <div>
        <b>
          <u>Currency Converter</u>
        </b>
      </div>
      <input
        type="text"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <select
        value={fromCurrency}
        onChange={(e) => setFromCurrency(e.target.value)}
      >
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
      </select>
      <select
        value={toCurrency}
        onChange={(e) => setToCurrency(e.target.value)}
      >
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
      </select>
      <p>{`${amount} ${fromCurrency} = ${outputAmount} ${toCurrency}`}</p>
    </div>
  );
}

export default CurrencyConverter;
