export const PAGE_SIZE = 5;
//Added this as a way to take care of filtered results going out of bounds, now the Filter takes this into account. NAME is the param name that we use to keep track of the page number
export const IS_PAGINATED = { NAME: 'page', bookings: true };
//freezing so that it can only be set here, in one place, to avoid losing track of it. It's meant to be a simple configuration type system after all.
Object.freeze(IS_PAGINATED);
