export async function sendPushNotification(
  expoPushTokens: string[],
  form: any
) {
  const successfulTokens = [];
  const failedTokens = [];

  // Loop through each token and send a notification
  for (const token of expoPushTokens) {
    const message = {
      to: token,
      sound: "default",
      ...form,
    };

    const response = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });

    const responseData = await response.json();

    if (responseData.data.status === "ok") {
      successfulTokens.push(token);
    } else {
      failedTokens.push(token);
      console.log(responseData);
    }
  }

  // Now, you have lists of successful and failed tokens
  console.log("Successful Tokens:", successfulTokens);
  console.log("Failed Tokens:", failedTokens);
}
