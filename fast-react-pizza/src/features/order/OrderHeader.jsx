function OrderHeader({ id, priority, status }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-20 gap-y-2 px-5">
      <h2 className="text-xl font-semibold">Order # {id} Status</h2>

      <div className="space-x-2">
        {priority && (
          <span className="rounded-full bg-red-400 px-2 py-1 text-sm text-stone-100">
            Priority
          </span>
        )}
        <span className="rounded-full bg-green-400 px-2 py-1 text-sm font-semibold text-stone-700">
          {status} order
        </span>
      </div>
    </div>
  );
}

export default OrderHeader;
