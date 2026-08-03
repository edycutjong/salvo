/** @type {import('next').NextConfig} */

// Static export for GitHub Pages. basePath/assetPrefix are intentionally NOT
// hardcoded or env-driven here — actions/configure-pages@v5 (static_site_generator:
// 'next', generator_config_file: 'landing/next.config.mjs') injects them directly
// into this file at CI build time, correctly handling both project-page subpath
// hosting and a custom domain (basePath ''). Keep this as a plain object literal
// so the codemod can find and patch it.
// All public-asset <img> refs use relative "./…" so they survive any basePath;
// only Next's own /_next/* refs need the injected prefix.
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
