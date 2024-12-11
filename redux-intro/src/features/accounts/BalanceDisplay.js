import { useSelector } from 'react-redux';
import { formatCurrency } from '../../scripts/currency';

function BalanceDisplay() {
  const balance = useSelector((store) => store.account.balance);
  const currency = useSelector((store) => store.account.nativeCurrencyCode);
  return <div className="balance">{formatCurrency(balance, currency)}</div>;
}

export default BalanceDisplay;
