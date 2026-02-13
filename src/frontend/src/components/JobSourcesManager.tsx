import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Edit, Trash2, Loader2 } from 'lucide-react';
import { useGetJobSources, useToggleJobSource, useDeleteJobSource } from '../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import type { JobSource } from '../backend';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useState } from 'react';

interface JobSourcesManagerProps {
  onEdit: (source: JobSource) => void;
}

export default function JobSourcesManager({ onEdit }: JobSourcesManagerProps) {
  const { data: sources = [], isLoading, error } = useGetJobSources();
  const toggleSource = useToggleJobSource();
  const deleteSource = useDeleteJobSource();
  const [deleteConfirm, setDeleteConfirm] = useState<JobSource | null>(null);

  const handleToggle = async (source: JobSource) => {
    await toggleSource.mutateAsync({ id: source.id, enabled: !source.enabled });
  };

  const handleDelete = async () => {
    if (deleteConfirm) {
      await deleteSource.mutateAsync(deleteConfirm.id);
      setDeleteConfirm(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load job sources. Please try again.
        </AlertDescription>
      </Alert>
    );
  }

  if (sources.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No job sources configured yet. Add your first source to get started.
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sources.map((source) => (
              <TableRow key={Number(source.id)}>
                <TableCell className="font-medium">{source.name}</TableCell>
                <TableCell className="max-w-xs truncate text-muted-foreground">
                  {source.url}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{source.fetchType}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={source.enabled}
                      onCheckedChange={() => handleToggle(source)}
                      disabled={toggleSource.isPending}
                    />
                    <span className="text-sm text-muted-foreground">
                      {source.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(source)}
                      className="gap-2"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteConfirm(source)}
                      disabled={deleteSource.isPending}
                      className="gap-2 text-destructive hover:text-destructive"
                    >
                      {deleteSource.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Job Source</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteConfirm?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
