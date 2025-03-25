import { addDays, eachDayOfInterval } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
import { getNextClearDate } from '../../utils/helpers';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Input from '../../ui/Input';
import { useSettings } from '../settings/useSettings';
import SpinnerMini from '../../ui/SpinnerMini';
import toast from 'react-hot-toast';

function CabinDatePicker({ reservedDates }) {
  const [availDate, setAvailDate] = useState(null);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  //get the settings cos we've got a maximum booking length to implement
  const { isLoading, error, settings } = useSettings();
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

    setAvailDate(clearDate);
  }, [allBookedDates]);

  if (isLoading) return <SpinnerMini />;
  if (error)
    toast.error(
      `We had a problem getting some information required, please contact us to let us know`
    );

  //lots of fiddling to get datepicker working for us
  function handleDateSelect(dates) {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    // setAvailDate(null);
  }

  return (
    <DatePicker
      selected={availDate}
      minDate={availDate}
      //   maxDate={addDays(startDate, settings?.maxBookingLength)}
      onChange={handleDateSelect}
      excludeDateIntervals={dpFormatDateRanges}
      startDate={startDate}
      endDate={endDate}
      //   todayButton="Go To Today"
      selectsRange
      swapRange
      //   selectsDisabledDaysInRange
      //   fixedHeight
      customInput={<Input />}
      dateFormat="do MMMM yyyy"
      inline
    />
  );
}

export default CabinDatePicker;
