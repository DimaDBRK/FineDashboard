import axios from "axios";

export const GetLiveData = async () => {
  console.log("Get live data start");
    try {
      const res = await axios.get(`https://data.binance.com/api/v3/ticker/24hr`);
      if (res.status===200 ) {
        // console.log(res.data[0].quoteVolume)
        const point = {"x":res.data[0].closeTime, "y": res.data[0].quoteVolume}
        return point
      } else {
        throw new Error('Problem with Word Bank API');
      }
    } catch (err) {
      console.log(err.message);
      return false
    }
  
}
 


