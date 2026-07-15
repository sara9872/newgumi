import { build } from 'vite';
import vue from '@vitejs/plugin-vue';

await build({
  plugins: [vue()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
