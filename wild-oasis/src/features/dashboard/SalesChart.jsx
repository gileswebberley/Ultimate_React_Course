import styled from 'styled-components';
import DashboardBox from './DashboardBox';
import Heading from '../../ui/Heading';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useDarkMode } from '../../context/darkModeContext';
import { eachDayOfInterval, format, isSameDay, subDays } from 'date-fns';

const StyledSalesChart = styled(DashboardBox)`
  grid-column: 1 / -1;

  /* Hack to change grid line colors */
  & .recharts-cartesian-grid-horizontal line,
  & .recharts-cartesian-grid-vertical line {
    stroke: var(--color-grey-300);
  }
`;

const fakeData = [
  { label: 'Jan 09', totalSales: 480, extrasSales: 20 },
  { label: 'Jan 10', totalSales: 580, extrasSales: 100 },
  { label: 'Jan 11', totalSales: 550, extrasSales: 150 },
  { label: 'Jan 12', totalSales: 600, extrasSales: 50 },
  { label: 'Jan 13', totalSales: 700, extrasSales: 150 },
  { label: 'Jan 14', totalSales: 800, extrasSales: 150 },
  { label: 'Jan 15', totalSales: 700, extrasSales: 200 },
  { label: 'Jan 16', totalSales: 650, extrasSales: 200 },
  { label: 'Jan 17', totalSales: 600, extrasSales: 300 },
  { label: 'Jan 18', totalSales: 550, extrasSales: 100 },
  { label: 'Jan 19', totalSales: 700, extrasSales: 100 },
  { label: 'Jan 20', totalSales: 800, extrasSales: 200 },
  { label: 'Jan 21', totalSales: 700, extrasSales: 100 },
  { label: 'Jan 22', totalSales: 810, extrasSales: 50 },
  { label: 'Jan 23', totalSales: 950, extrasSales: 250 },
  { label: 'Jan 24', totalSales: 970, extrasSales: 100 },
  { label: 'Jan 25', totalSales: 900, extrasSales: 200 },
  { label: 'Jan 26', totalSales: 950, extrasSales: 300 },
  { label: 'Jan 27', totalSales: 850, extrasSales: 200 },
  { label: 'Jan 28', totalSales: 900, extrasSales: 100 },
  { label: 'Jan 29', totalSales: 800, extrasSales: 300 },
  { label: 'Jan 30', totalSales: 950, extrasSales: 200 },
  { label: 'Jan 31', totalSales: 1100, extrasSales: 300 },
  { label: 'Feb 01', totalSales: 1200, extrasSales: 400 },
  { label: 'Feb 02', totalSales: 1250, extrasSales: 300 },
  { label: 'Feb 03', totalSales: 1400, extrasSales: 450 },
  { label: 'Feb 04', totalSales: 1500, extrasSales: 500 },
  { label: 'Feb 05', totalSales: 1400, extrasSales: 600 },
  { label: 'Feb 06', totalSales: 1450, extrasSales: 400 },
];

//using npm recharts
function SalesChart({ bookings, period }) {
  const { isDarkMode } = useDarkMode();
  const colors = isDarkMode
    ? {
        totalSales: { stroke: '#4f46e5', fill: '#4f46e5' },
        extrasSales: { stroke: '#22c55e', fill: '#22c55e' },
        text: '#e5e7eb',
        background: '#18212f',
      }
    : {
        totalSales: { stroke: '#4f46e5', fill: '#c7d2fe' },
        extrasSales: { stroke: '#16a34a', fill: '#dcfce7' },
        text: '#374151',
        background: '#fff',
      };

  const dates = eachDayOfInterval({
    start: subDays(new Date(), period),
    end: new Date(),
  });
  // console.log(dates);

  const data = dates.map((date) => {
    return {
      label: format(date, 'MMM dd'),
      totalSales: bookings
        .filter((booking) => isSameDay(date, new Date(booking.created_at)))
        .reduce((acc, cur) => (acc += cur.totalPrice), 0),
      extrasSales: bookings
        .filter((booking) => isSameDay(date, new Date(booking.created_at)))
        .reduce((acc, cur) => (acc += cur.extrasPrice), 0),
    };
  });

  const sales = bookings.reduce((acc, cur) => (acc += cur.totalPrice), 0);

  return (
    <StyledSalesChart>
      <Heading as="h2">
        Sales from {format(dates.at(0), 'do MMM yyyy')} to{' '}
        {format(dates.at(-1), 'do MMM yyyy')}
      </Heading>
      {sales === 0 ? (
        'No Sales to map'
      ) : (
        <ResponsiveContainer width="90%" height={sales ? 300 : 0}>
          <AreaChart data={data} margin={{ bottom: 15 }}>
            <CartesianGrid strokeDasharray="1 1" />
            <XAxis
              dataKey="label"
              tick={{ fill: colors.text }}
              tickLine={{ stroke: colors.text }}
            />
            <YAxis
              label={'£'}
              tick={{ fill: colors.text }}
              tickLine={{ stroke: colors.text }}
            />
            <Tooltip contentStyle={{ backgroundColor: colors.background }} />
            <Area
              dataKey="totalSales"
              type="monotone"
              {...colors.totalSales}
              name="Total Sales"
              unit=" GBP"
            />

            <Area
              dataKey="extrasSales"
              type="monotone"
              {...colors.extrasSales}
              name="Extras Sold"
              unit=" GBP"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </StyledSalesChart>
  );
}

export default SalesChart;
