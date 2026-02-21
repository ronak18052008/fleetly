import { useState } from 'react';
import { BaseCrudService } from '@/integrations';
import { Drivers } from '@/entities';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface DriverRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DriverRegistrationModal({ isOpen, onClose, onSuccess }: DriverRegistrationModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    contactNumber: '',
    email: '',
    licenseNumber: '',
    licenseExpiryDate: '',
    licenseStatus: 'Valid',
    safetyScore: 85,
    tripCompletionRate: 100,
    dutyStatus: 'Off Duty',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'safetyScore' || name === 'tripCompletionRate' ? parseInt(value) : value
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
      const newDriver: Drivers = {
        _id: crypto.randomUUID(),
        fullName: formData.fullName,
        contactNumber: formData.contactNumber,
        email: formData.email,
        licenseNumber: formData.licenseNumber,
        licenseExpiryDate: formData.licenseExpiryDate,
        licenseStatus: formData.licenseStatus,
        safetyScore: formData.safetyScore,
        tripCompletionRate: formData.tripCompletionRate,
        dutyStatus: formData.dutyStatus,
      };

      await BaseCrudService.create('drivers', newDriver);
      
      // Reset form
      setFormData({
        fullName: '',
        contactNumber: '',
        email: '',
        licenseNumber: '',
        licenseExpiryDate: '',
        licenseStatus: 'Valid',
        safetyScore: 85,
        tripCompletionRate: 100,
        dutyStatus: 'Off Duty',
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error registering driver:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">Register New Driver</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-paragraph text-sm text-foreground block mb-2">Full Name *</label>
            <Input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="John Doe"
              required
              className="font-paragraph text-sm"
            />
          </div>

          <div>
            <label className="font-paragraph text-sm text-foreground block mb-2">Email *</label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              required
              className="font-paragraph text-sm"
            />
          </div>

          <div>
            <label className="font-paragraph text-sm text-foreground block mb-2">Contact Number *</label>
            <Input
              type="tel"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              placeholder="+1 (555) 000-0000"
              required
              className="font-paragraph text-sm"
            />
          </div>

          <div>
            <label className="font-paragraph text-sm text-foreground block mb-2">License Number *</label>
            <Input
              type="text"
              name="licenseNumber"
              value={formData.licenseNumber}
              onChange={handleChange}
              placeholder="DL123456"
              required
              className="font-paragraph text-sm"
            />
          </div>

          <div>
            <label className="font-paragraph text-sm text-foreground block mb-2">License Expiry Date *</label>
            <Input
              type="date"
              name="licenseExpiryDate"
              value={formData.licenseExpiryDate}
              onChange={handleChange}
              required
              className="font-paragraph text-sm"
            />
          </div>

          <div>
            <label className="font-paragraph text-sm text-foreground block mb-2">License Status</label>
            <Select value={formData.licenseStatus} onValueChange={(value) => handleSelectChange('licenseStatus', value)}>
              <SelectTrigger className="font-paragraph text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Valid">Valid</SelectItem>
                <SelectItem value="Expired">Expired</SelectItem>
                <SelectItem value="Expiring Soon">Expiring Soon</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="font-paragraph text-sm text-foreground block mb-2">Duty Status</label>
            <Select value={formData.dutyStatus} onValueChange={(value) => handleSelectChange('dutyStatus', value)}>
              <SelectTrigger className="font-paragraph text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="On Duty">On Duty</SelectItem>
                <SelectItem value="Off Duty">Off Duty</SelectItem>
                <SelectItem value="Suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-paragraph text-sm text-foreground block mb-2">Safety Score</label>
              <Input
                type="number"
                name="safetyScore"
                value={formData.safetyScore}
                onChange={handleChange}
                min="0"
                max="100"
                className="font-paragraph text-sm"
              />
            </div>
            <div>
              <label className="font-paragraph text-sm text-foreground block mb-2">Completion Rate (%)</label>
              <Input
                type="number"
                name="tripCompletionRate"
                value={formData.tripCompletionRate}
                onChange={handleChange}
                min="0"
                max="100"
                className="font-paragraph text-sm"
              />
            </div>
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
              {isSubmitting ? 'Registering...' : 'Register Driver'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
