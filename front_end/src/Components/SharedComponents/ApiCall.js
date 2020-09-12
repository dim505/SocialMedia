import Axios from "axios";

//${process.env.REACT_APP_BackEndUrl}/api/Payment/GetPaymentHistory/${this.state.results[0].email}
export const ApiCall = async (Method, url, PostData) => {
  const BearerToken = window.getTokenSilently;
  var result;

  if (Method === "Get") {
    try {
      await Axios.get(`${url}`, {
        headers: { Authorization: `bearer ${BearerToken}` },
      }).then((results) => {
        result = results.data;
      });
      return result;
    } catch (error) {
      console.log(error);
    }
  } else if (Method === "Post") {
    try {
      await Axios.post(`${url}`, PostData, {
        headers: { Authorization: `bearer ${BearerToken}` },
      }).then((results) => {
        result = results.data;
      });
      return result;
    } catch (error) {
      console.log(error);
    }
  }
};
