import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAddJobSource, useUpdateJobSource } from '../hooks/useQueries';
import { Loader2 } from 'lucide-react';
import type { JobSource, FetchType } from '../backend';

interface JobSourceEditorDialogProps {
  open: boolean;
  onClose: () => void;
  source: JobSource | null;
}

export default function JobSourceEditorDialog({ open, onClose, source }: JobSourceEditorDialogProps) {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [fetchType, setFetchType] = useState<FetchType>('json' as FetchType);

  const addSource = useAddJobSource();
  const updateSource = useUpdateJobSource();

  const isEditing = !!source;
  const mutation = isEditing ? updateSource : addSource;

  useEffect(() => {
    if (source) {
      setName(source.name);
      setUrl(source.url);
      setFetchType(source.fetchType);
    } else {
      setName('');
      setUrl('');
      setFetchType('json' as FetchType);
    }
  }, [source, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !url.trim()) return;

    try {
      if (isEditing) {
        await updateSource.mutateAsync({
          id: source.id,
          name: name.trim(),
          url: url.trim(),
          fetchType,
        });
      } else {
        await addSource.mutateAsync({
          name: name.trim(),
          url: url.trim(),
          fetchType,
        });
      }
      onClose();
    } catch (error) {
      console.error('Failed to save source:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Job Source' : 'Add Job Source'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update the job source configuration'
              : 'Add a new job portal to aggregate listings from'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Source Name</Label>
            <Input
              id="name"
              placeholder="e.g. Indeed, LinkedIn"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={mutation.isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">Source URL</Label>
            <Input
              id="url"
              placeholder="https://example.com/jobs"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={mutation.isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fetchType">Fetch Type</Label>
            <Select
              value={fetchType}
              onValueChange={(value) => setFetchType(value as FetchType)}
              disabled={mutation.isPending}
            >
              <SelectTrigger id="fetchType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="json">JSON</SelectItem>
                <SelectItem value="rss">RSS</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={mutation.isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim() || !url.trim() || mutation.isPending}>
              {mutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : isEditing ? (
                'Update'
              ) : (
                'Add Source'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
