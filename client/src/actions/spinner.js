import { SPINNING } from "./types";

export const setLoading = isLoading => async dispatch => {
  dispatch({
    type: SPINNING,
    payload: isLoading
  })
}