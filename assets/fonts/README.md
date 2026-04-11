# Fonts

Drop the following font files into this directory before the first
native build. All are free for commercial use under SIL Open Font License.

- `PlayfairDisplay-Regular.ttf`
- `PlayfairDisplay-Medium.ttf`
- `PlayfairDisplay-Italic.ttf`
- `Inter-Light.ttf`
- `Inter-Regular.ttf`
- `Inter-Medium.ttf`
- `Inter-SemiBold.ttf`

Sources:

- Playfair Display — https://fonts.google.com/specimen/Playfair+Display
- Inter — https://fonts.google.com/specimen/Inter

`src/hooks/useAppFonts.ts` loads these at runtime via `expo-font`.
Until the real files are in place, the app will render with system
fonts at the same point sizes.
