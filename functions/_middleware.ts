// Canonical host: www.xiluetsmiledesign.com → xiluetsmiledesign.com (301, path and query kept).
// Pages' _redirects cannot match on host, so this runs in front of every request instead.
export const onRequest: PagesFunction = async ({ request, next }) => {
  const url = new URL(request.url);
  if (url.hostname.startsWith("www.")) {
    url.hostname = url.hostname.slice(4);
    return Response.redirect(url.toString(), 301);
  }
  return next();
};
