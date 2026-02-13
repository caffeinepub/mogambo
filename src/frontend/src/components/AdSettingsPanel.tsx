import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useAdSettings } from '../hooks/useAdSettings';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export default function AdSettingsPanel() {
  const { settings, updateSettings } = useAdSettings();
  const [enabled, setEnabled] = useState(settings.enabled);
  const [publisherId, setPublisherId] = useState(settings.publisherId);

  useEffect(() => {
    setEnabled(settings.enabled);
    setPublisherId(settings.publisherId);
  }, [settings]);

  const handleSave = () => {
    updateSettings({ enabled, publisherId });
    toast.success('Ad settings saved successfully');
  };

  const hasChanges =
    enabled !== settings.enabled || publisherId !== settings.publisherId;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="ads-enabled">Enable Ads</Label>
          <p className="text-sm text-muted-foreground">
            Show AdSense ads throughout the application
          </p>
        </div>
        <Switch
          id="ads-enabled"
          checked={enabled}
          onCheckedChange={setEnabled}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="publisher-id">AdSense Publisher ID</Label>
        <Input
          id="publisher-id"
          placeholder="ca-pub-XXXXXXXXXXXXXXXX"
          value={publisherId}
          onChange={(e) => setPublisherId(e.target.value)}
        />
        <p className="text-sm text-muted-foreground">
          Your Google AdSense publisher/client ID (e.g., ca-pub-1234567890123456)
        </p>
      </div>

      <Button onClick={handleSave} disabled={!hasChanges}>
        Save Settings
      </Button>
    </div>
  );
}
