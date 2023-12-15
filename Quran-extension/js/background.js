'use strict';
var bkg = chrome.extension.getBackgroundPage();
const GetVerse = "https://kwwibqnsmj.execute-api.us-east-1.amazonaws.com/getVerse"
chrome.alarms.onAlarm.addListener(function() {
  chrome.storage.sync.get(['status', 'sound'], async function(obj) {
    if(obj.status === 'ON') {
      chrome.browserAction.setBadgeText({text: 'ON'});
      chrome.browserAction.setBadgeBackgroundColor({color:'#71cd9f'});
      var notificationSound = new Audio("/../audio/pull-out.mp3");
      const randomAyah = await getRandomAyah();

      // Check if random Ayah data is available
      if (randomAyah) {
        const { text, surah, numberInSurah } = randomAyah;
        const surahName = surah.englishNameTranslation;

        // Create a notification with the Ayah information
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'icon/48.png',
          title: 'Random Ayah Reminder',
          message: `Surah: ${surahName}\nAyah: ${text}\nNumber in Surah: ${numberInSurah}`,
          priority: 0
        });
      }
      if (obj.sound === 'ON') {
        notificationSound.play();
      }
    } else {
      chrome.browserAction.setBadgeText({text: 'OFF'});
      chrome.browserAction.setBadgeBackgroundColor({color:'#e92d4c'});
    }
  });
});

chrome.runtime.onInstalled.addListener(async details => {
  await getRandomAyah();
  console.log('previousVersion', details.previousVersion);
});

chrome.notifications.onButtonClicked.addListener(function() {
  chrome.storage.sync.get(['minutes'], function(item) {
    chrome.alarms.create({delayInMinutes: item.minutes});
  });
});

async function getRandomAyah() {
  // Generate a random number between 1 and 6236
  const randomNumber = Math.floor(Math.random() * 6236) + 1;

  // API URL with the random number
  const apiUrl = `https://api.alquran.cloud/v1/ayah/${randomNumber}`;

  try {
    // Fetch data from the API
    const response = await fetch(apiUrl);
    const data = await response.json();

    // Check if the response is successful
    if (data.code === 200) {
      const { text, surah, numberInSurah } = data.data;
      const surahName = surah.englishNameTranslation;

      // Log the result
      console.log(`Random Ayah: ${text}`);
      console.log(`Surah: ${surahName}`);
      console.log(`Number in Surah: ${numberInSurah}`);

      // You can return the data or do additional processing here
      return data.data;
    } else {
      // Log an error if the response is not successful
      console.error(`Error fetching Ayah: ${data.code}`);
    }
  } catch (error) {
    // Log any network or other errors
    console.error('Error:', error.message);
  }
}