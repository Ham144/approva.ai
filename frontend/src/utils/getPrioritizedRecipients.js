export default function getPrioritizedRecipients({
  isPrioritizeRequestor,
  requestedBy,
  nextAuthorized = [],
}) {
  if (!isPrioritizeRequestor || !requestedBy?._id) {
    return { recipients: nextAuthorized, isActive: false };
  }

  const requestorMatch = nextAuthorized.find(
    (user) => String(user._id) === String(requestedBy._id),
  );

  if (!requestorMatch) {
    return { recipients: nextAuthorized, isActive: false };
  }

  return { recipients: [requestorMatch], isActive: true };
}
