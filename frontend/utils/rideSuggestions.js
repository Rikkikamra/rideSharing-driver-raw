export const getSuggestedRides = (rideHistory, preferredLocations) => {
  const suggestions = [];

  rideHistory.forEach(ride => {
    const fromMatch = preferredLocations.find(loc => ride.from.includes(loc.label));
    const toMatch = preferredLocations.find(loc => ride.to.includes(loc.label));
    if (fromMatch || toMatch) {
      suggestions.push({
        ...ride,
        reason: fromMatch ? 'You often depart from here' : 'You often go to this place'
      });
    }
  });

  return suggestions.slice(0, 5);
};