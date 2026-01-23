import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Trash2, Edit, Search } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface PickupPoint {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  quantity?: number;
  person_id?: string;
  grupo?: string;
}

interface PickupPointsListProps {
  points: PickupPoint[];
  onRemove: (pointId: string) => void;
  onPointClick?: (point: PickupPoint) => void;
  onEdit?: (point: PickupPoint) => void;
}

const PickupPointsList = ({ points, onRemove, onPointClick, onEdit }: PickupPointsListProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter points based on search query (search in names, address, person_id)
  const filteredPoints = useMemo(() => {
    if (!searchQuery.trim()) {
      return points;
    }
    const query = searchQuery.toLowerCase().trim();
    return points.filter((point) => {
      // Search in name (which may contain comma-separated names)
      const nameMatch = point.name?.toLowerCase().includes(query);
      // Search in address
      const addressMatch = point.address?.toLowerCase().includes(query);
      // Search in person_id
      const personIdMatch = point.person_id?.toLowerCase().includes(query);
      return nameMatch || addressMatch || personIdMatch;
    });
  }, [points, searchQuery]);

  // Helper function to split and format names
  const formatNames = (name: string): string[] => {
    if (!name) return [];
    // Split by comma and clean up
    return name.split(',').map(n => n.trim()).filter(n => n.length > 0);
  };

  if (points.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Puntos de Recogida ({points.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            No hay puntos de recogida agregados. Haz clic en el mapa para agregar puntos.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Puntos de Recogida ({points.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar estudiantes por nombre, dirección o ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        
        {filteredPoints.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No se encontraron puntos que coincidan con "{searchQuery}"
          </p>
        ) : (
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {filteredPoints.map((point) => {
              const names = formatNames(point.name);
              return (
                <div
                  key={point.id}
                  className="p-3 bg-muted rounded-lg flex items-start justify-between gap-2 hover:bg-muted/80 transition-colors cursor-pointer"
                  onClick={() => onPointClick?.(point)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Display all names */}
                      {names.length > 0 ? (
                        <div className="flex flex-col gap-1">
                          {names.map((name, idx) => (
                            <p key={idx} className="font-semibold text-sm">
                              {name}
                            </p>
                          ))}
                        </div>
                      ) : (
                        <p className="font-semibold text-sm">{point.name || 'Sin nombre'}</p>
                      )}
                      {point.grupo && (
                        <span className="px-2 py-0.5 text-xs font-semibold text-purple-700 bg-purple-100 rounded-md border border-purple-300 flex-shrink-0">
                          {point.grupo}
                        </span>
                      )}
                    </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {typeof point.latitude === 'number' ? point.latitude : String(point.latitude)}, {typeof point.longitude === 'number' ? point.longitude : String(point.longitude)}
                </p>
                {point.address && point.address !== `${point.latitude}, ${point.longitude}` && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Dirección: {point.address}
                  </p>
                )}
                    <div className="flex gap-3 mt-1 flex-wrap">
                      <p className="text-xs font-semibold text-primary">
                        Cantidad: {point.quantity !== undefined && point.quantity !== null ? point.quantity : 1}
                      </p>
                      {names.length > 1 && (
                        <p className="text-xs text-muted-foreground">
                          ({names.length} {names.length === 1 ? 'persona' : 'personas'})
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    {onEdit && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(point);
                        }}
                        title={names.length > 1 ? "Editar personas" : "Editar punto"}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Eliminar punto de recogida?</AlertDialogTitle>
                          <AlertDialogDescription>
                            ¿Estás seguro de que deseas eliminar este punto? {names.length > 1 && `Se eliminarán ${names.length} personas.`} Esta acción no se puede deshacer.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => onRemove(point.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </CardContent>
    </Card>
  );
};

export default PickupPointsList;

