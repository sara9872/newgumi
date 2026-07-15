import { createServer } from 'vite';
import vue from '@vitejs/plugin-vue';

const server = await createServer({
  plugins: [vue()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: false,
  },
});

await server.listen();
server.printUrls();
