"use client";
import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

const AddCategoryModal = ({ open, onClose, onAddCategory }) => {
const [formData, setFormData] = useState({
name: '',
});

const handleChange = (e) => {
setFormData({
...formData,
[e.target.name]: e.target.value,
});
};

const handleSubmit = (e) => {
e.preventDefault();
onAddCategory(formData);
onClose();
};

return (
<Modal open={open} onClose={onClose} aria-labelledby="add-category-modal-title">
<Box
sx={{
position: 'absolute',
top: '50%',
left: '50%',
transform: 'translate(-50%, -50%)',
width: 400,
bgcolor: 'background.paper',
boxShadow: 24,
p: 4,
}}
>
<Typography id="add-category-modal-title" variant="h6" component="h2">
Add Category
</Typography>
<Box component="form" sx={{ mt: 2 }} onSubmit={handleSubmit}>
<TextField
         autoFocus
         margin="dense"
         name="name"
         label="Category Name"
         type="text"
         fullWidth
         value={formData.name}
         onChange={handleChange}
       />
<Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
<Button type="submit" variant="contained" color="primary">
Add
</Button>
<Button variant="contained" onClick={onClose}>
Cancel
</Button>
</Box>
</Box>
</Box>
</Modal>
);
};

export default AddCategoryModal;