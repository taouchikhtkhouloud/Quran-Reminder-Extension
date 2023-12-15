const GetVerse = "https://kwwibqnsmj.execute-api.us-east-1.amazonaws.com/getVerse"
const axios = require('axios');
export default function fetchVerse  () {
    axios.get(GetVerse)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    
}
