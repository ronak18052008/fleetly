import { useState } from 'react';
import { BaseCrudService } from '@/integrations';
import { Vehicles } from '@/entities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface VehicleRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function VehicleRegistrationModal({ isOpen, onClose, onSuccess }: VehicleRegistrationModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    model: '',
    licensePlate: '',
    vehicleType: 'Truck',
    maxLoadCapacity: 5000,
    odometerReading: 0,
    status: 'Available',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'maxLoadCapacity' || name === 'odometerReading' ? parseInt(value) : value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const newVehicle: Vehicles = {
        _id: crypto.randomUUID(),
        name: formData.name,
        model: formData.model,
        licensePlate: formData.licensePlate,
        vehicleType: formData.vehicleType,
        maxLoadCapacity: formData.maxLoadCapacity,
        odometerReading: formData.odometerReading,
        status: formData.status,
      };

      await BaseCrudService.create('vehicles', newVehicle);
      
      // Reset form
      setFormData({
        name: '',
        model: '',
        licensePlate: '',
        vehicleType: 'Truck',
        maxLoadCapacity: 5000,
        odometerReading: 0,
        status: 'Available',
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error registering vehicle:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">Register New Vehicle</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-paragraph text-sm text-foreground block mb-2">Vehicle Name *</label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Truck 001"
              required
              className="font-paragraph text-sm"
            />
          </div>

          <div>
            <label className="font-paragraph text-sm text-foreground block mb-2">Model *</label>
            <Input
              type="text"
              name="model"
              value={formData.model}
              onChange={handleChange}
              placeholder="Volvo FH16"
              required
              className="font-paragraph text-sm"
            />
          </div>

          <div>
            <label className="font-paragraph text-sm text-foreground block mb-2">License Plate *</label>
            <Input
              type="text"
              name="licensePlate"
              value={formData.licensePlate}
              onChange={handleChange}
              placeholder="ABC-1234"
              required
              className="font-paragraph text-sm"
            />
          </div>

          <div>
            <label className="font-paragraph text-sm text-foreground block mb-2">Vehicle Type</label>
            <Select value={formData.vehicleType} onValueChange={(value) => handleSelectChange('vehicleType', value)}>
              <SelectTrigger className="font-paragraph text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Truck">Truck</SelectItem>
                <SelectItem value="Van">Van</SelectItem>
                <SelectItem value="Pickup">Pickup</SelectItem>
                <SelectItem value="Tanker">Tanker</SelectItem>
                <SelectItem value="Flatbed">Flatbed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="font-paragraph text-sm text-foreground block mb-2">Max Load Capacity (kg)</label>
            <Input
              type="number"
              name="maxLoadCapacity"
              value={formData.maxLoadCapacity}
              onChange={handleChange}
              min="0"
              className="font-paragraph text-sm"
            />
          </div>

          <div>
            <label className="font-paragraph text-sm text-foreground block mb-2">Odometer Reading (km)</label>
            <Input
              type="number"
              name="odometerReading"
              value={formData.odometerReading}
              onChange={handleChange}
              min="0"
              className="font-paragraph text-sm"
            />
          </div>

          <div>
            <label className="font-paragraph text-sm text-foreground block mb-2">Status</label>
            <Select value={formData.status} onValueChange={(value) => handleSelectChange('status', value)}>
              <SelectTrigger className="font-paragraph text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Available">Available</SelectItem>
                <SelectItem value="On Trip">On Trip</SelectItem>
                <SelectItem value="In Shop">In Shop</SelectItem>
                <SelectItem value="Out of Service">Out of Service</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1 font-paragraph text-sm"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 font-paragraph text-sm"
            >
              {isSubmitting ? 'Registering...' : 'Register Vehicle'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
