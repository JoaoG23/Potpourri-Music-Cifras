import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { ListMusics } from './pages/music/ListMusics';
import { AddMusic } from './pages/music/AddMusic';
import { UpdateMusic } from './pages/music/UpdateMusic';
import { ListPotpourris } from './pages/potpourri/ListPotpourris';
import { AddPotpourri } from './pages/potpourri/AddPotpourri';
import { ViewPotpourri } from './pages/potpourri/ViewPotpourri';
import { RemovePotpourri } from './pages/potpourri/RemovePotpourri';
import { RemoveMusic } from './pages/music/RemoveMusic';
import { UpdatePotpourri } from './pages/potpourri/UpdatePotpourri';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
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
          <Route path="/add-music" element={
            <Layout>
              <AddMusic />
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
          <Route path="/update-potpourri/:id" element={
            <Layout>
              <UpdatePotpourri />
            </Layout>
          } />
          <Route path="/view-potpourri/:id" element={
            <Layout>
              <ViewPotpourri />
            </Layout>
          } />
          <Route path="/list-potpourris/remove/:id" element={
            <Layout>
              <RemovePotpourri />
            </Layout>
          } />
          <Route path="/list-musics/remove/:id" element={
            <Layout>
              <RemoveMusic />
            </Layout>
          } />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;