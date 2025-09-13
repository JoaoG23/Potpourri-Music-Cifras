import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { ListMusics } from './pages/music/ListMusics';
import { UpdateMusic } from './pages/music/UpdateMusic';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <Layout>
              <Home />
            </Layout>
          } />
          <Route path="/list-musics" element={
            <Layout>
              <ListMusics />
            </Layout>
          } />
          <Route path="/update-music/:id" element={
            <Layout>
              <UpdateMusic />
            </Layout>
          } />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;