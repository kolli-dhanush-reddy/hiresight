/**
 * Returns chart colors that adapt to the current theme (light/dark).
 * Reads CSS custom properties from the document root so they always
 * reflect the active theme without needing a re-render on toggle.
 */
export function useChartColors() {
  const style = getComputedStyle(document.documentElement);
  const get = (v: string) => `hsl(${style.getPropertyValue(v).trim()})`;

  return {
    grid:       get("--border"),
    axis:       get("--muted-foreground"),
    tooltip: {
      background: get("--card"),
      border:     get("--border"),
      color:      get("--card-foreground"),
    },
  };
}
