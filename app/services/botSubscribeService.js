const botID = Number(process.env.TELEGRAM_BOT_ID);
function handlePublicChatSubscription(msg) {
  return msg?.new_chat_member?.id === botID && msg?.new_chat_participant?.id === botID;
}
function handlePrivateChatSubscription(msg) {
  return !!msg?.chat?.id;
}
function handlePublicChatUnsubscription(update) {
  return update?.left_chat_participant?.id === botID && update?.left_chat_member?.id === botID;
}

module.exports = {
  handlePublicChatSubscription,
  handlePrivateChatSubscription,
  handlePublicChatUnsubscription,
};
