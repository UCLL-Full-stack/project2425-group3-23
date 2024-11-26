import React from 'react';
import {Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography} from '@mui/material';

type GenericErrorDialogProps = {
    open: boolean;
    errorMessage: string;
    onClose: () => void;
};

const GenericErrorDialog: React.FC<GenericErrorDialogProps> = ({ open, errorMessage, onClose }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Error</DialogTitle>
            <DialogContent>
                <Typography>⚠️ {errorMessage}</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default GenericErrorDialog;