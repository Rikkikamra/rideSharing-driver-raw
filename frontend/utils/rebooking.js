export const suggestRebooking = (rideHistory, currentDay) => {
  const sameDayTrips = rideHistory.filter(trip =>
    new Date(trip.date).getDay() === currentDay
  );

  const grouped = {};
  sameDayTrips.forEach(trip => {
    const key = trip.from + '|' + trip.to + '|' + trip.time;
    if (!grouped[key]) grouped[key] = 0;
    grouped[key]++;
  });

  const suggestions = Object.entries(grouped)
    .filter(([_, count]) => count >= 2)
    .map(([key]) => {
      const [from, to, time] = key.split('|');
      return { from, to, time, note: 'You usually ride this route on this day' };
    });

  return suggestions;
};