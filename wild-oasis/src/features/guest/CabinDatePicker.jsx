import { addDays, eachDayOfInterval, parseISO } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
import DatePicker from 'react-datepicker';
import { getNextClearDate } from '../../utils/helpers';

function CabinDatePicker({ reservedDates }) {
  const [startDate, setStartDate] = useState();
  //we want to block out all the days that are already booked so they cannot be selected - I'm creating a flat array of all the dates so I can use an includes statement
  const allBookedDates = useMemo(
    () =>
      reservedDates
        .map((dateRange) =>
          eachDayOfInterval({
            start: dateRange.startDate,
            end: dateRange.endDate,
          })
        )
        .flat(),
    [reservedDates]
  );

  const dpFormatDateRanges = useMemo(
    () =>
      reservedDates.map((dateRange) => {
        return { start: dateRange.startDate, end: dateRange.endDate };
      }),
    [reservedDates]
  );

  useEffect(() => {
    const clearDate = getNextClearDate(allBookedDates);

    setStartDate(clearDate);
  }, [allBookedDates]);

  return (
    <DatePicker
      selected={startDate}
      excludeDateIntervals={dpFormatDateRanges}
    />
  );
}

export default CabinDatePicker;
