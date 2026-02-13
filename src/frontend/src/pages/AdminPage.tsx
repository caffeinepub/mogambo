import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Settings } from 'lucide-react';
import AdminGuard from '../components/AdminGuard';
import JobSourcesManager from '../components/JobSourcesManager';
import JobSourceEditorDialog from '../components/JobSourceEditorDialog';
import AdSettingsPanel from '../components/AdSettingsPanel';
import type { JobSource } from '../backend';

export default function AdminPage() {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingSource, setEditingSource] = useState<JobSource | null>(null);

  const handleAddNew = () => {
    setEditingSource(null);
    setIsEditorOpen(true);
  };

  const handleEdit = (source: JobSource) => {
    setEditingSource(source);
    setIsEditorOpen(true);
  };

  const handleCloseEditor = () => {
    setIsEditorOpen(false);
    setEditingSource(null);
  };

  return (
    <AdminGuard>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
            <p className="text-muted-foreground">
              Manage job sources and application settings
            </p>
          </div>

          <Tabs defaultValue="sources" className="space-y-6">
            <TabsList>
              <TabsTrigger value="sources" className="gap-2">
                <Settings className="h-4 w-4" />
                Job Sources
              </TabsTrigger>
              <TabsTrigger value="ads" className="gap-2">
                <Settings className="h-4 w-4" />
                Ad Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="sources" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Job Sources</CardTitle>
                      <CardDescription>
                        Manage the job portals that Mogambo aggregates from
                      </CardDescription>
                    </div>
                    <Button onClick={handleAddNew} className="gap-2">
                      <Plus className="h-4 w-4" />
                      Add Source
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <JobSourcesManager onEdit={handleEdit} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ads" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>AdSense Settings</CardTitle>
                  <CardDescription>
                    Configure ad display and monetization settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AdSettingsPanel />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <JobSourceEditorDialog
        open={isEditorOpen}
        onClose={handleCloseEditor}
        source={editingSource}
      />
    </AdminGuard>
  );
}
