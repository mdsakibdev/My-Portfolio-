/**
 * The copyright year, computed on the server inside a cached scope.
 * Cache Components forbids calling new Date() during plain prerendering;
 * the "use cache" directive is the documented way to prerender such values.
 * Edit the cacheLife below if the value should refresh more often.
 */
export default async function CopyrightYear() {
  "use cache";

  const year = new Date().getFullYear();

  return <span suppressHydrationWarning>{year}</span>;
}
