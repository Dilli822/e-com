import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, Divider, FormControl, InputLabel, Select, MenuItem, OutlinedInput, Grid } from '@material-ui/core';
import { Container } from '@mui/material';

const CategoryOptions = ({ handleClick }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/e-com/api/categories/list/');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      localStorage.setItem('categories', JSON.stringify(data)); // Save data to local storage
      setCategories(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  return (
    <>
    <Container>
    <br/>
    <Grid container spacing={2}> {/* Grid container */}
      {/* <Grid item xs={3}> 
        <List component="nav">
          {categories.map(category => (
            <React.Fragment key={category.id}>
              <ListItem button onClick={() => handleClick(category.id)}>
                <ListItemText primary={category.name} />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Grid> */}
      <Grid item xs={4}> {/* Select */}
        <FormControl fullWidth>
          <InputLabel id="category-select-label">Select Category</InputLabel>
          <Select
            labelId="category-select-label"
            id="category-select"
            value={selectedCategory}
            onChange={handleChange}
            input={<OutlinedInput label="Select Category" />}
          >
            {categories.map(category => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
    </Grid>
    </Container>
    </>
  );
};

export default CategoryOptions;
