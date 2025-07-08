// Stub: integrate with email/SMS/push provider here
module.exports.sendLogoutNotification = async (userId, method = 'logout') => {
  console.log(`User ${userId} has been ${method === 'logout-all' ? 'logged out from all sessions' : 'logged out'}.`);
  // Integrate with push/email/SMS system here
};