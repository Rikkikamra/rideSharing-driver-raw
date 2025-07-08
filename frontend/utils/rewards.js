export const calculateRewards = (trips, totalSpend) => {
  let points = 0;

  points += totalSpend;

  if (trips >= 10) points += 25;
  if (trips >= 20) points += 50;
  if (trips >= 50) points += 100;

  let badge = 'New Rider';
  if (points >= 100) badge = 'Bronze';
  if (points >= 250) badge = 'Silver';
  if (points >= 500) badge = 'Gold';

  return {
    points: Math.floor(points),
    badge,
  };
};