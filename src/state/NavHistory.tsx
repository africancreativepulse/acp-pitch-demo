import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

/**
 * Real navigation-history tracking, replacing the previous fixed
 * "logical parent per screen" (`backTo` prop) DemoHeader used to carry.
 * That approach broke as soon as a screen gained more than one real
 * entry point -- e.g. Admin Oversight is reachable from Operations Hub's
 * own card, from Campaign Detail's Collection & Verification chain, AND
 * from Supervisor Review's "Resolved by Admin Oversight" link, but a
 * single hardcoded `backTo="/operations"` could only ever be right for
 * one of those three paths.
 *
 * This tracks the REAL stack of routes visited in this tab's session,
 * driven by React Router's own `useNavigationType()` (PUSH/POP/REPLACE --
 * public, documented API, not an undocumented internals like
 * `history.state.idx`):
 *  - PUSH (a real forward navigation -- clicking a Link, calling
 *    navigate(path)): append the new location.
 *  - REPLACE (this demo's two guard-redirects -- an invalid campaign id,
 *    an invalid onboarding role): swap the top entry, since a redirect
 *    isn't a real step a user took and shouldn't become a fake "back"
 *    target.
 *  - POP (the browser/OS back gesture, OR our own Back button calling
 *    navigate(-1)): drop the top entry, mirroring exactly what the
 *    browser's own history just did.
 *
 * `canGoBack` is only true once the stack holds more than one entry --
 * i.e. there's a genuine previous screen in this session to return to.
 * On a fresh load or a direct/deep-linked URL, the stack starts at
 * length 1 (just the current screen) and canGoBack is false -- DemoHeader
 * uses that to fall back to Splash instead of calling navigate(-1), which
 * would otherwise exit the tab entirely (there's nothing in the browser's
 * own history before a freshly loaded page).
 */
const NavHistoryContext = createContext<{ canGoBack: boolean }>({ canGoBack: false });

export function NavHistoryProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigationType = useNavigationType();
  const stackRef = useRef<string[]>([]);
  const isFirstRender = useRef(true);
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    const key = location.pathname + location.search;
    const stack = stackRef.current;

    if (isFirstRender.current) {
      // The very first location this tab ever rendered this session --
      // whatever it is (Splash, or a direct/deep link straight into any
      // other route), there is nothing real before it.
      stack.push(key);
      isFirstRender.current = false;
    } else if (navigationType === "PUSH") {
      stack.push(key);
    } else if (navigationType === "REPLACE") {
      stack[stack.length - 1] = key;
    } else if (navigationType === "POP") {
      if (stack.length > 1) stack.pop();
      else stack[0] = key; // defensive -- keeps the stack's top honest even if a POP somehow arrives with nothing behind it
    }

    setCanGoBack(stack.length > 1);
  }, [location.pathname, location.search, navigationType]);

  return <NavHistoryContext.Provider value={{ canGoBack }}>{children}</NavHistoryContext.Provider>;
}

export function useCanGoBack() {
  return useContext(NavHistoryContext).canGoBack;
}
