// Content JSON is shared with the Next.js site (src/content). The functions
// tsconfig has no resolveJsonModule, so the imports are declared here and
// narrowed to typed shapes in _shared.ts. Wrangler (esbuild) bundles the JSON.
declare module "*.json" {
  const value: unknown;
  export default value;
}
