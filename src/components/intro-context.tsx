"use client";

import { createContext, useContext } from "react";

/** True once the preloader has finished and the page is free to animate in. */
export const IntroContext = createContext(false);

export const useIntroReady = () => useContext(IntroContext);
