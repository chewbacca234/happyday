const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

const getDailyChallenge = async () => {
  // Setup today's date
  const todayDate = new Date();
  const day = todayDate.getDate();
  const month = todayDate.getMonth() + 1;
  const year = todayDate.getFullYear();
  const today = `${day}-${month}-${year}`;

  try {
    // Get daily challenge backend fetch
    const response = await fetch(`${BACKEND_URL}/dailychallenge/${today}`);
    const getData = await response.json();

    if (getData.result) {
      // If GET fetch result TRUE
      // console.log('[GET DAILY CHALLENGE][TRUE] fetched data =>', getData);
      // Dispatch datas to reducer
      return getData.dailyChallenge;
    } else {
      // If GET fetch result FALSE
      const postResponse = await fetch(`${BACKEND_URL}/dailychallenge`, {
        method: 'POST',
      });
      const postData = await postResponse.json();

      if (postData.result) {
        // If GET fetch result TRUE
        console.log('[POST DAILY CHALLENGE][TRUE] fetched data =>', postData);
        // Dispatch datas to reducer
        return postData.dailyChallenge;
      } else {
        // Log an error message for POST fetch error
        console.error('[ERROR][POST DAILY CHALLENGE] fetch error =>', error);
        return null;
      }
    }
  } catch (error) {
    // Log an error message for GET fetch error
    console.error('[ERROR][GET DAILY CHALLENGE] fetch error =>', error);
    return null;
  }
};

module.exports = getDailyChallenge;
