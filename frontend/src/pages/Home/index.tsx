import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Music, Plus } from 'lucide-react';

export const Home: React.FC = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">Potpourri Music</h1>
        <p className="text-gray-600">Gerencie suas músicas e potpourris</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music className="h-5 w-5" />
              Músicas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Visualize e gerencie sua coleção de músicas
            </p>
            <Link to="/list-musics">
              <Button 
                className="w-full"
                style={{ backgroundColor: '#3b11e0', borderColor: '#3b11e0' }}
              >
                Ver Lista de Músicas
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Potpourris
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Crie e organize seus potpourris musicais
            </p>
            <Link to="/list-potpourris">
              <Button 
                className="w-full"
                style={{ backgroundColor: '#3b11e0', borderColor: '#3b11e0' }}
              >
                Ver Lista de Potpourris
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
