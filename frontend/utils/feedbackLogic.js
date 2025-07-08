export const validateFeedback = ({ rating, comments }) => {
  if (!rating || rating < 1 || rating > 5) {
    return { valid: false, message: 'Rating must be between 1 and 5' };
  }
  if (comments.length < 3) {
    return { valid: false, message: 'Please provide a meaningful comment' };
  }
  return { valid: true };
};