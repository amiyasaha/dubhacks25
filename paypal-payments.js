const axios = require("axios");

const CLIENT_ID = "AR2g3t6K6ml4SHq8qsos5CoF8wL0S0toZQdCm4LroBKYTMv0XDNd2tAitsqXuwQXYmcGHBbAY714rW2n";
const CLIENT_SECRET = "ECnoFCZwhjYsyE25Xlc6rfgLbCocmCh9HkiPLfcY-4X8VmDk2rB_O6bV0VZdkFNxbRHysM9Sya72UJ9V";
const ENV = "sandbox";

const API_BASE = ENV === "sandbox" 
  ? "https://api-m.sandbox.paypal.com" 
  : "https://api-m.paypal.com";

const OAUTH_URL = `${API_BASE}/v1/oauth2/token`;
const PAYOUTS_URL = `${API_BASE}/v1/payments/payouts`;

async function getAccessToken() {
  const response = await axios({
    method: "post",
    url: OAUTH_URL,
    auth: { username: CLIENT_ID, password: CLIENT_SECRET },
    headers: { "Accept": "application/json", "Accept-Language": "en_US" },
    data: "grant_type=client_credentials"
  });
  return response.data.access_token;
}

async function createPayout(accessToken, senderBatchId, senderEmail, recipientEmail, amount, currency = "USD") {
  const payload = {
    sender_batch_header: {
      sender_batch_id: senderBatchId,
      email_subject: "You have a payout!"
    },
    items: [{
      recipient_type: "EMAIL",
      amount: { value: amount, currency: currency },
      receiver: recipientEmail,
      note: `Payout from ${senderEmail}`,
      sender_item_id: `item_${senderBatchId}_1`
    }]
  };

  const response = await axios.post(PAYOUTS_URL, payload, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`
    }
  });

  return response.data;
}

async function getPayoutStatus(accessToken, payoutBatchId) {
  const response = await axios.get(`${PAYOUTS_URL}/${payoutBatchId}`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`
    }
  });
  return response.data;
}

async function sendPayoutWithPolling(senderEmail, recipientEmail, amount, currency = "USD", pollInterval = 2000, maxAttempts = 15) {
  const accessToken = await getAccessToken();
  const senderBatchId = `batch_${Date.now()}`;

  const payoutResponse = await createPayout(accessToken, senderBatchId, senderEmail, recipientEmail, amount, currency);
  const batchId = payoutResponse.batch_header?.payout_batch_id;

  const finalStatuses = new Set(["SUCCESS", "COMPLETED", "DENIED", "FAILED"]);
  let attempts = 0;
  let details = null;

  while (attempts < maxAttempts) {
    details = await getPayoutStatus(accessToken, batchId);
    const status = details.batch_header?.batch_status;
    if (finalStatuses.has(status)) break;
    await new Promise(res => setTimeout(res, pollInterval));
    attempts++;
  }

  return details;
}

module.exports = {
  getAccessToken,
  createPayout,
  getPayoutStatus,
  sendPayoutWithPolling
};
