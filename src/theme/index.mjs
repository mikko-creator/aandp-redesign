// index.mjs - template modules, rendered in this order. A module whose file does not exist yet is skipped with a
// warning, so lanes can build before the others have written theirs. system = 404 + redirect stubs (FOUNDATION).
export const MODULES = ['home', 'shop', 'pages', 'system'];
