# Fonts

Humn Sprt uses two typefaces:

- **Playfair Display** — editorial display serif (all display variants)
- **Inter** — geometric sans-serif for UI and body copy

Both are free for commercial use under the SIL Open Font License.

## Required files

Place in `assets/fonts/`:

```
PlayfairDisplay-Regular.ttf
PlayfairDisplay-Medium.ttf
PlayfairDisplay-Italic.ttf
Inter-Light.ttf
Inter-Regular.ttf
Inter-Medium.ttf
Inter-SemiBold.ttf
```

## Where to get them

- Playfair Display: https://fonts.google.com/specimen/Playfair+Display
- Inter: https://fonts.google.com/specimen/Inter

Download the static TTFs (not variable fonts) and keep the original
license files alongside them in the repo.

## Why static TTFs
`expo-font` doesn't yet support variable fonts consistently across
iOS and Android. Static weights keep rendering identical on both
platforms.

## Fallback
If any font fails to load the app degrades gracefully to system fonts
at the same point sizes (see `src/hooks/useAppFonts.ts`).
