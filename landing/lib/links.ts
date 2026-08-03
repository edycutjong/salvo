/** Single source of truth for every external destination on the page. */
export const LINKS = {
  console: 'https://api.salvo.edycu.dev/console',
  video: 'https://youtu.be/s50Px56hu8A',
  pitch: 'https://salvo.edycu.dev/pitch.html',
  api: 'https://api.salvo.edycu.dev',
  apiDocs: 'https://api.salvo.edycu.dev/docs',
  health: 'https://api.salvo.edycu.dev/healthz',
  github: 'https://github.com/edycutjong/salvo',
  license: 'https://github.com/edycutjong/salvo/blob/main/LICENSE',
  issues: 'https://github.com/edycutjong/salvo/issues',
  devpost: 'https://backblaze-generative-media.devpost.com',
  genblaze: 'https://pypi.org/project/genblaze/',
  backblaze: 'https://www.backblaze.com/cloud-storage',
} as const;

export const CURL_SNIPPET = `curl -X POST https://api.salvo.edycu.dev/campaigns \\
  -H 'content-type: application/json' \\
  -d '{"brief":"eco water bottle for hikers","n":6}'`;
