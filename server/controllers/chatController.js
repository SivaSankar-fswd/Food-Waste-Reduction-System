exports.chatWithBot = async (req, res) => {
  const message = req.body.message.toLowerCase();

  let reply = "Sorry, I didn't understand. You can ask about donating or requesting food.";

  if (message.includes("donate")) {
    reply = "Login as Donor → Go to Donate/Share Food → Fill details → Click Post Food Donation.";
  }
  else if (message.includes("request")) {
    reply = "Login as NGO/Receiver → Open Request Food → Click Accept on available food.";
  }
  else if (message.includes("contact")) {
    reply = "Donor and receiver contact details are shared after order acceptance.";
  }
  else if (message.includes("status")) {
    reply = "Donors can see donation status in Donor Dashboard. Receivers can view history in Receiver Dashboard.";
  }
  else if (message.includes("login")) {
    reply = "Use your registered email and password to login.";
  }
  else if (message.includes("register")) {
    reply = "Click Register and choose role as Donor or NGO/Receiver.";
  }

  res.json({ reply });
};
