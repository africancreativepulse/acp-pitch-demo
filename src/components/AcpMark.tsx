/**
 * ACP's icon mark -- copied verbatim (static, one-time copy) from the real
 * app's src/design-system/components/AcpMark.tsx. A bold geometric "ACP"
 * lettermark, the "A" rendered as a diagonal slash. The "/" and "C" render
 * in `currentColor` (size/color controlled via `className` at each call
 * site); the "P" is hardcoded to var(--pulse) -- the same brand-accent
 * orange used for "PULSE" in AcpLogo's wordmark beside it.
 *
 * `animated` applies a slow opacity breathe -- pass it for loading-state
 * contexts, omit it for static logo/wordmark placements.
 */
export function AcpMark({
  animated = false,
  className = "",
}: {
  animated?: boolean;
  className?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 3750 1550"
      fill="none"
      className={`${animated ? "animate-ds-breathe" : ""} ${className}`}
      aria-hidden="true"
    >
      <g transform="translate(0,1550) scale(1,-1)">
        {/* "/" (the diagonal "A" slash) and "C" -- inherit the surrounding
            text color. */}
        <g fill="currentColor">
          <path d="M1935 1464 c-219 -32 -412 -139 -532 -295 -59 -77 -110 -184 -133 -280 -17 -73 -19 -120 -20 -433 0 -193 -1 -366 0 -384 l0 -33 158 3 157 3 3 52 c3 58 10 62 50 35 136 -93 333 -132 522 -103 96 15 254 91 330 159 l55 49 -31 35 c-51 59 -181 178 -193 178 -6 0 -31 -16 -56 -35 -86 -65 -128 -79 -245 -79 -108 0 -113 2 -220 59 -33 18 -110 100 -137 146 -29 51 -53 138 -53 196 0 51 26 145 56 203 50 97 187 185 304 196 112 11 244 -32 310 -99 l31 -32 115 119 c62 65 114 122 114 125 -2 18 -173 129 -248 160 -91 39 -261 66 -337 55z" />
          <path d="M866 1332 c-32 -53 -83 -140 -114 -191 -30 -52 -59 -100 -64 -105 -11 -13 -145 -234 -154 -256 -12 -27 -117 -205 -129 -220 -7 -8 -24 -35 -37 -60 -45 -81 -214 -365 -241 -405 -15 -22 -27 -43 -27 -47 0 -5 85 -8 190 -8 l190 0 34 48 c19 26 47 70 61 97 14 28 33 62 43 77 9 14 39 64 66 110 26 45 79 133 116 193 37 61 107 178 156 260 49 83 93 158 99 167 5 9 41 70 80 135 38 65 72 120 75 123 3 3 11 16 18 30 31 59 46 86 59 98 7 7 13 22 13 33 0 18 -9 19 -187 19 l-188 0 -59 -98z" />
        </g>
        {/* "P" -- brand accent orange, matching the wordmark's "PULSE". */}
        <path fill="var(--pulse)" d="M2583 1418 c-8 -14 -12 -263 -4 -276 5 -9 84 -13 327 -15 281 -2 323 -4 351 -19 47 -26 76 -73 81 -132 4 -47 1 -56 -30 -96 -20 -27 -48 -50 -68 -57 -24 -8 -134 -12 -353 -12 l-317 -1 0 -370 c1 -204 3 -377 7 -385 4 -12 34 -15 164 -15 l159 0 0 230 0 230 176 0 c183 0 235 8 333 52 81 36 144 100 194 196 68 128 68 297 2 428 -48 93 -96 145 -175 187 -115 62 -155 67 -518 64 -178 -1 -326 -5 -329 -9z" />
      </g>
    </svg>
  );
}
