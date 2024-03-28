export const initialState = { walletAddress: "" };
export function walletReducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_ADDRESS':
      return { walletAddress: action.data };
    default:
      return state;
  }
}
