import { RootState } from "@/redux/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DeviceFingerprintState {
    fingerprintNumber: string | null;
}

const initialState: DeviceFingerprintState = {
  fingerprintNumber: null,
};

const deviceFingerprintSlice = createSlice({
  name: "deviceFingerprint",
  initialState,
  reducers: {
    setFingerprintNumber: (state, action: PayloadAction<string | null>) => {
      state.fingerprintNumber = action.payload;
    },
  },
});

export const { setFingerprintNumber } = deviceFingerprintSlice.actions;
export default deviceFingerprintSlice.reducer;

// Selector to get the current fingerprint
export const useCurrentFingerprint = (state: RootState) =>
  state.deviceFingerprint.fingerprintNumber;
