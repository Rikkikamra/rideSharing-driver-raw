export const calculateFare = ({ distance, duration, surgeMultiplier = 1, baseFare = 2.5 }) => {
  const perMileRate = 1.75;
  const perMinuteRate = 0.25;
  const estimatedFare = (baseFare + distance * perMileRate + duration * perMinuteRate) * surgeMultiplier;

  return parseFloat(estimatedFare.toFixed(2));
};