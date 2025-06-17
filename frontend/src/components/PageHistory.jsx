import { useState, useEffect } from 'react';
import { apiService } from '../lib/api';
import { 
  List, 
  ListItem, 
  ListItemText, 
  Button, 
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { format } from 'date-fns';

const PageHistory = ({ pageId, onVersionRestore }) => {
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    if (pageId) {
      loadPageHistory();
    }
  }, [pageId]);

  const loadPageHistory = async () => {
    try {
      setLoading(true);
      const history = await apiService.getPageHistory(pageId);
      setVersions(history);
    } catch (error) {
      console.error('Failed to load page history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePreviewVersion = (version) => {
    setSelectedVersion(version);
    setPreviewOpen(true);
  };

  const handleRestoreVersion = async (versionId) => {
    try {
      setLoading(true);
      await apiService.restorePageVersion(pageId, versionId);
      onVersionRestore?.();
      setPreviewOpen(false);
    } catch (error) {
      console.error('Failed to restore version:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Typography>Loading history...</Typography>;
  }

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Page History
      </Typography>
      <List>
        {versions.map((version) => (
          <ListItem
            key={version._id}
            secondaryAction={
              <>
                <Button 
                  onClick={() => handlePreviewVersion(version)}
                  sx={{ mr: 1 }}
                >
                  Preview
                </Button>
                <Button 
                  onClick={() => handleRestoreVersion(version._id)}
                  variant="contained"
                  color="primary"
                >
                  Restore
                </Button>
              </>
            }
          >
            <ListItemText
              primary={`Version from ${format(new Date(version.createdAt), 'PPpp')}`}
              secondary={`By ${version.createdBy?.name || 'Unknown'}`}
            />
          </ListItem>
        ))}
      </List>

      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Preview Version from {selectedVersion && format(new Date(selectedVersion.createdAt), 'PPpp')}
        </DialogTitle>
        <DialogContent>
          {selectedVersion && (
            <div dangerouslySetInnerHTML={{ __html: selectedVersion.content }} />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>Close</Button>
          <Button 
            onClick={() => selectedVersion && handleRestoreVersion(selectedVersion._id)}
            variant="contained"
            color="primary"
          >
            Restore This Version
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PageHistory; 