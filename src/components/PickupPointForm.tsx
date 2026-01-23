import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Edit2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PickupPointFormProps {
  onAdd: (point: { name: string; address: string; latitude: number; longitude: number; quantity?: number; person_id?: string; grupo?: string }) => Promise<void>;
  editingPoint?: { id: string; name: string; address: string; latitude: number; longitude: number; quantity?: number; person_id?: string; grupo?: string } | null;
  onCancelEdit?: () => void;
}

interface Person {
  name: string;
  person_id: string;
}

const PickupPointForm = ({ onAdd, editingPoint, onCancelEdit }: PickupPointFormProps) => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [personId, setPersonId] = useState("");
  const [grupo, setGrupo] = useState("");
  const [people, setPeople] = useState<Person[]>([]);
  const [editingPersonIndex, setEditingPersonIndex] = useState<number | null>(null);
  const [newPersonName, setNewPersonName] = useState("");
  const [newPersonId, setNewPersonId] = useState("");
  const { toast } = useToast();

  // Helper function to parse names and person_ids
  const parsePeople = (nameStr: string, personIdStr?: string): Person[] => {
    if (!nameStr) return [];
    const names = nameStr.split(',').map(n => n.trim()).filter(n => n);
    const personIds = personIdStr ? personIdStr.split(',').map(id => id.trim()).filter(id => id) : [];
    
    return names.map((name, idx) => ({
      name,
      person_id: personIds[idx] || ""
    }));
  };

  // Update form when editing point changes
  useEffect(() => {
    if (editingPoint) {
      setName(editingPoint.name);
      setAddress(editingPoint.address);
      setLatitude(editingPoint.latitude.toString());
      setLongitude(editingPoint.longitude.toString());
      // Handle quantity: use the actual value if it exists (including 0), otherwise default to 1
      // Check for null, undefined, or NaN explicitly
      const qty = editingPoint.quantity != null && !isNaN(editingPoint.quantity) 
        ? editingPoint.quantity 
        : 1;
      setQuantity(qty.toString());
      setPersonId(editingPoint.person_id || "");
      setGrupo(editingPoint.grupo || "");
      
      // Parse people from name and person_id
      const parsedPeople = parsePeople(editingPoint.name, editingPoint.person_id);
      // If we parsed multiple people or the name contains commas, use the parsed array
      // Otherwise, create a single-person array
      if (parsedPeople.length > 0) {
        setPeople(parsedPeople);
      } else {
        setPeople([{ name: editingPoint.name || "", person_id: editingPoint.person_id || "" }]);
      }
    } else {
      setName("");
      setAddress("");
      setLatitude("");
      setLongitude("");
      setQuantity("1");
      setPersonId("");
      setGrupo("");
      setPeople([]);
    }
    setEditingPersonIndex(null);
    setNewPersonName("");
    setNewPersonId("");
  }, [editingPoint]);

  const handleAddPerson = () => {
    if (!newPersonName.trim()) {
      toast({
        title: "Error",
        description: "El nombre es requerido",
        variant: "destructive",
      });
      return;
    }
    setPeople([...people, { name: newPersonName.trim(), person_id: newPersonId.trim() }]);
    setNewPersonName("");
    setNewPersonId("");
  };

  const handleEditPerson = (index: number) => {
    setEditingPersonIndex(index);
    setNewPersonName(people[index].name);
    setNewPersonId(people[index].person_id);
  };

  const handleSavePersonEdit = () => {
    if (editingPersonIndex === null || !newPersonName.trim()) {
      toast({
        title: "Error",
        description: "El nombre es requerido",
        variant: "destructive",
      });
      return;
    }
    const updatedPeople = [...people];
    updatedPeople[editingPersonIndex] = {
      name: newPersonName.trim(),
      person_id: newPersonId.trim()
    };
    setPeople(updatedPeople);
    setEditingPersonIndex(null);
    setNewPersonName("");
    setNewPersonId("");
  };

  const handleDeletePerson = (index: number) => {
    const updatedPeople = people.filter((_, i) => i !== index);
    setPeople(updatedPeople);
    if (editingPersonIndex === index) {
      setEditingPersonIndex(null);
      setNewPersonName("");
      setNewPersonId("");
    }
  };

  const handleCancelPersonEdit = () => {
    setEditingPersonIndex(null);
    setNewPersonName("");
    setNewPersonId("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // If we have people array, use it; otherwise use the name field
    const finalName = people.length > 0 
      ? people.map(p => p.name).join(", ")
      : name;
    const finalPersonId = people.length > 0
      ? people.map(p => p.person_id).filter(id => id).join(", ")
      : personId.trim();

    if (!finalName || !address || !latitude || !longitude) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos requeridos",
        variant: "destructive",
      });
      return;
    }

    const quantityNum = parseInt(quantity, 10);
    if (isNaN(quantityNum) || quantityNum < 0) {
      toast({
        title: "Error",
        description: "La cantidad debe ser un número entero positivo",
        variant: "destructive",
      });
      return;
    }

    try {
      await onAdd({
        ...(editingPoint && { id: editingPoint.id }),
        name: finalName,
        address,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        quantity: quantityNum,
        person_id: finalPersonId || undefined,
        grupo: grupo.trim() || undefined,
      });

      if (!editingPoint) {
        setName("");
        setAddress("");
        setLatitude("");
        setLongitude("");
        setQuantity("1");
        setPersonId("");
        setGrupo("");
        setPeople([]);
      }

      toast({
        title: editingPoint ? "Punto actualizado" : "Punto agregado",
        description: editingPoint 
          ? "El punto de recogida ha sido actualizado exitosamente"
          : "El punto de recogida ha sido agregado exitosamente",
      });
    } catch (error) {
      // Error handling is done in handleAddPickupPoint, but we catch here to prevent unhandled promise rejection
      console.error("Error adding/updating pickup point:", error);
    }
  };

  // Determine if we should show the multi-person interface
  // Show it if: editing a point with multiple names, or if we already have multiple people in the array
  const hasMultiplePeople = editingPoint 
    ? (editingPoint.name?.includes(',') || people.length > 1)
    : people.length > 1;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
          {!hasMultiplePeople ? (
            <div>
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Bodega Centro"
              />
            </div>
          ) : (
            <div className="space-y-3">
              <Label>Personas en este punto ({people.length})</Label>
              <div className="space-y-2 max-h-[200px] overflow-y-auto border rounded-md p-3">
                {people.map((person, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded-md">
                    {editingPersonIndex === index ? (
                      <div className="flex-1 space-y-2">
                        <Input
                          value={newPersonName}
                          onChange={(e) => setNewPersonName(e.target.value)}
                          placeholder="Nombre"
                          className="text-sm"
                        />
                        <Input
                          value={newPersonId}
                          onChange={(e) => setNewPersonId(e.target.value)}
                          placeholder="ID Pasajero (opcional)"
                          className="text-sm"
                        />
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            size="sm"
                            onClick={handleSavePersonEdit}
                            className="flex-1"
                          >
                            Guardar
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={handleCancelPersonEdit}
                            className="flex-1"
                          >
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{person.name || "Sin nombre"}</p>
                          {person.person_id && (
                            <p className="text-xs text-muted-foreground">ID: {person.person_id}</p>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleEditPerson(index)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => handleDeletePerson(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
              {editingPersonIndex === null && (
                <div className="space-y-2 border rounded-md p-3 bg-muted/50">
                  <Label className="text-sm">Agregar nueva persona</Label>
                  <Input
                    value={newPersonName}
                    onChange={(e) => setNewPersonName(e.target.value)}
                    placeholder="Nombre de la persona"
                    className="text-sm"
                  />
                  <Input
                    value={newPersonId}
                    onChange={(e) => setNewPersonId(e.target.value)}
                    placeholder="ID Pasajero (opcional)"
                    className="text-sm"
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleAddPerson}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Persona
                  </Button>
                </div>
              )}
            </div>
          )}
          <div>
            <Label htmlFor="address">Dirección</Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Av. Reforma 123"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="latitude">Latitud</Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="19.4326"
              />
            </div>
            <div>
              <Label htmlFor="longitude">Longitud</Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="-99.1332"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="quantity">Cantidad</Label>
            <Input
              id="quantity"
              type="number"
              min="0"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="1"
            />
          </div>
          <div>
            <Label htmlFor="person_id">ID Pasajero (Opcional)</Label>
            <Input
              id="person_id"
              value={personId}
              onChange={(e) => setPersonId(e.target.value)}
              placeholder="Ej: PER-001, PER-002 (separados por coma para múltiples)"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Si no especificas un ID, este punto contará como 1 pasajero. Si especificas IDs (separados por coma), se contarán esos pasajeros específicos.
            </p>
          </div>
          <div>
            <Label htmlFor="grupo">Grupo (Opcional)</Label>
            <Input
              id="grupo"
              value={grupo}
              onChange={(e) => setGrupo(e.target.value)}
              placeholder="Ej: Grupo A"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Asigna este punto a un grupo para optimizaciones separadas
            </p>
          </div>
          <div className="flex gap-2">
            {editingPoint && onCancelEdit && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancelEdit}
                className="flex-1"
              >
                Cancelar
              </Button>
            )}
            <Button type="submit" className={editingPoint ? "flex-1" : "w-full"}>
              <Plus className="w-4 h-4 mr-2" />
              {editingPoint ? "Actualizar Punto" : "Agregar Punto"}
            </Button>
          </div>
        </form>
  );
};

export default PickupPointForm;
