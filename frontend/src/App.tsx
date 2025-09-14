import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { ListMusics } from './pages/music/ListMusics';
import { UpdateMusic } from './pages/music/UpdateMusic';
import { ListPotpourris } from './pages/potpourri/ListPotpourris';
import { AddPotpourri } from './pages/potpourri/AddPotpourri';

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
          <Route path="/list-potpourris" element={
            <Layout>
              <ListPotpourris />
            </Layout>
          } />
          <Route path="/add-potpourri" element={
            <Layout>
              <AddPotpourri />
            </Layout>
          } />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;