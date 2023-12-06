import { configureStore } from "@reduxjs/toolkit";
import showLibraryReducer from "./slices/showLibrary";

const store = configureStore({
  reducer: {
    showLibrary: showLibraryReducer
  },
});

export default store;