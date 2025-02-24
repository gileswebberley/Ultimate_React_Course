import { formatDistance, parseISO, differenceInDays } from 'date-fns';

// We want to make this function work for both Date objects and strings (which come from Supabase)
export const subtractDates = (dateStr1, dateStr2) =>
  differenceInDays(parseISO(String(dateStr1)), parseISO(String(dateStr2)));

export const formatDistanceFromNow = (dateStr) =>
  formatDistance(parseISO(dateStr), new Date(), {
    addSuffix: true,
  })
    .replace('about ', '')
    .replace('in', 'In');

// Supabase needs an ISO date string. However, that string will be different on every render because the MS or SEC have changed, which isn't good. So we use this trick to remove any time
export const getToday = function (options = {}) {
  const today = new Date();

  // This is necessary to compare with created_at from Supabase, because it it not at 0.0.0.0, so we need to set the date to be END of the day when we compare it with earlier dates
  if (options?.end)
    // Set to the last second of the day
    today.setUTCHours(23, 59, 59, 999);
  else today.setUTCHours(0, 0, 0, 0);
  return today.toISOString();
};

export const formatCurrency = (value) => {
  //going to remove the fractional part if they are .00 as they are not needed
  //apparently value | 0 is an efficient way to achieve the same as Math.floor with bitwise OR, although it might be a little bit dodgy cos it's only meant for integers. so we're saying "if the value rounded down is less than the original value then there must be a fractional part in the value"
  if (Math.floor(value) < value) {
    return new Intl.NumberFormat('en', {
      style: 'currency',
      currency: 'GBP',
    }).format(value);
  } else {
    //remove those redundant decimal digits...
    return new Intl.NumberFormat('en', {
      style: 'currency',
      currency: 'GBP',
      maximumFractionDigits: 0,
    }).format(value);
  }
};

export const camelToFlat = (c) => {
  c = c.replace(/[A-Z]/g, ' $&');
  c = c[0].toUpperCase() + c.slice(1);
  return c;
};
