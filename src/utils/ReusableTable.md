# ReusableTable Component

A comprehensive, reusable table component built with Material-UI that provides sorting, pagination, search, selection, and export functionality.

## Features

- ✅ **Sorting**: Click column headers to sort data
- ✅ **Pagination**: Built-in pagination with customizable rows per page
- ✅ **Search**: Global search across all columns
- ✅ **Selection**: Single and multi-row selection with checkboxes
- ✅ **Export**: CSV export functionality
- ✅ **Responsive**: Mobile-friendly design
- ✅ **Customizable**: Highly configurable with props
- ✅ **Actions**: Add, delete, and custom actions
- ✅ **Sticky Header**: Header stays visible while scrolling
- ✅ **Fixed Height**: Scrollable table with fixed height

## Basic Usage

```jsx
import ReusableTable from 'utils/ReusableTable';

const MyComponent = () => {
  const [data, setData] = useState([
    { id: 1, name: 'John', email: 'john@example.com' },
    { id: 2, name: 'Jane', email: 'jane@example.com' }
  ]);

  const headCells = [
    { id: 'name', numeric: false, label: 'Name' },
    { id: 'email', numeric: false, label: 'Email' }
  ];

  return <ReusableTable data={data} headCells={headCells} title="Users" />;
};
```

## Props

### Data Props

| Prop        | Type  | Default | Description                              |
| ----------- | ----- | ------- | ---------------------------------------- |
| `data`      | Array | `[]`    | Array of objects to display in the table |
| `headCells` | Array | `[]`    | Column configuration array               |

### Table Configuration

| Prop               | Type    | Default        | Description               |
| ------------------ | ------- | -------------- | ------------------------- |
| `title`            | String  | `"Data Table"` | Table title               |
| `showCheckbox`     | Boolean | `true`         | Show selection checkboxes |
| `showSearch`       | Boolean | `true`         | Show search field         |
| `showAddButton`    | Boolean | `true`         | Show add button           |
| `showDeleteButton` | Boolean | `true`         | Show delete button        |
| `showPagination`   | Boolean | `true`         | Show pagination           |
| `showExport`       | Boolean | `true`         | Show export button        |

### Styling

| Prop          | Type    | Default | Description                     |
| ------------- | ------- | ------- | ------------------------------- |
| `tableHeight` | Number  | `500`   | Fixed height of table in pixels |
| `dense`       | Boolean | `false` | Dense table layout              |

### Search

| Prop                | Type     | Default       | Description              |
| ------------------- | -------- | ------------- | ------------------------ |
| `searchPlaceholder` | String   | `"Search..."` | Search field placeholder |
| `searchValue`       | String   | `""`          | Controlled search value  |
| `onSearchChange`    | Function | `() => {}`    | Search change handler    |

### Actions

| Prop            | Type     | Default | Description                 |
| --------------- | -------- | ------- | --------------------------- |
| `onAdd`         | Function | `null`  | Add button click handler    |
| `onDelete`      | Function | `null`  | Delete button click handler |
| `onRowClick`    | Function | `null`  | Row click handler           |
| `onMenuClick`   | Function | `null`  | Menu button click handler   |
| `customActions` | Node     | `null`  | Custom action buttons       |

### Export

| Prop             | Type   | Default      | Description           |
| ---------------- | ------ | ------------ | --------------------- |
| `exportFilename` | String | `"data.csv"` | Export filename       |
| `exportHeaders`  | Array  | `[]`         | Export column headers |

### Pagination

| Prop                 | Type   | Default       | Description           |
| -------------------- | ------ | ------------- | --------------------- |
| `rowsPerPageOptions` | Array  | `[5, 10, 25]` | Rows per page options |
| `defaultRowsPerPage` | Number | `5`           | Default rows per page |

### Custom Render Functions

| Prop            | Type     | Default | Description             |
| --------------- | -------- | ------- | ----------------------- |
| `renderCell`    | Function | `null`  | Custom cell renderer    |
| `renderActions` | Function | `null`  | Custom actions renderer |

## headCells Configuration

Each column is defined with the following structure:

```jsx
const headCells = [
  {
    id: 'fieldName', // Field name in data object
    numeric: false, // true for right alignment
    label: 'Column Label' // Display label
  }
];
```

## Examples

### Basic Table

```jsx
<ReusableTable
  data={users}
  headCells={[
    { id: 'name', numeric: false, label: 'Name' },
    { id: 'email', numeric: false, label: 'Email' }
  ]}
  title="Users"
/>
```

### Table with Actions

```jsx
<ReusableTable
  data={products}
  headCells={productColumns}
  title="Products"
  onAdd={() => setAddDialogOpen(true)}
  onDelete={() => deleteSelected()}
  renderActions={(row) => (
    <IconButton onClick={() => editProduct(row.id)}>
      <EditIcon />
    </IconButton>
  )}
/>
```

### Table without Selection

```jsx
<ReusableTable
  data={reports}
  headCells={reportColumns}
  title="Reports"
  showCheckbox={false}
  showAddButton={false}
  showDeleteButton={false}
  onRowClick={(event, row) => viewReport(row.id)}
/>
```

### Custom Cell Rendering

```jsx
<ReusableTable
  data={orders}
  headCells={orderColumns}
  title="Orders"
  renderCell={(field, row) => {
    if (field === 'status') {
      return <Chip label={row.status} color={row.status === 'completed' ? 'success' : 'warning'} />;
    }
    return row[field];
  }}
/>
```

### Table with Custom Actions

```jsx
<ReusableTable
  data={invoices}
  headCells={invoiceColumns}
  title="Invoices"
  customActions={
    <Button variant="outlined" onClick={bulkAction}>
      Bulk Action
    </Button>
  }
/>
```

## Data Structure

Your data array should contain objects with unique `id` fields:

```jsx
const data = [
  {
    id: 1, // Required: unique identifier
    name: 'John Doe',
    email: 'john@example.com',
    status: 'active'
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    status: 'inactive'
  }
];
```

## Event Handlers

### onAdd

```jsx
const handleAdd = () => {
  setAddDialogOpen(true);
};
```

### onDelete

```jsx
const handleDelete = () => {
  const selectedIds = selected; // selected is managed internally
  // Delete logic here
};
```

### onRowClick

```jsx
const handleRowClick = (event, row) => {
  navigate(`/details/${row.id}`);
};
```

### renderActions

```jsx
const renderActions = (row) => (
  <Box>
    <IconButton onClick={() => editItem(row.id)}>
      <EditIcon />
    </IconButton>
    <IconButton onClick={() => deleteItem(row.id)}>
      <DeleteIcon />
    </IconButton>
  </Box>
);
```

## Styling

The component uses Material-UI's theme system. You can customize styles by passing additional props to the MainCard component:

```jsx
<ReusableTable
  data={data}
  headCells={headCells}
  sx={{
    '& .MuiTableHead-root': {
      backgroundColor: 'primary.main'
    }
  }}
/>
```

## Mobile Responsiveness

The table automatically adapts to mobile screens:

- Search field becomes full width
- Add button becomes full width
- Toolbar stacks vertically
- Button text shortens on small screens

## Performance Tips

1. **Use React.useMemo for filtered data** if you have complex filtering logic
2. **Implement virtualization** for very large datasets (1000+ rows)
3. **Use stable IDs** for better performance with selection
4. **Debounce search** for better UX with large datasets

## Migration from Custom Tables

To migrate from your existing table implementation:

1. Define your `headCells` array
2. Ensure your data has unique `id` fields
3. Replace your table JSX with `<ReusableTable />`
4. Move your event handlers to the appropriate props
5. Test and adjust styling as needed

## Troubleshooting

### Common Issues

1. **Selection not working**: Ensure your data objects have unique `id` fields
2. **Sorting not working**: Check that `headCells.id` matches your data field names
3. **Search not working**: Verify your data structure and field names
4. **Export not working**: Ensure `exportHeaders` array is properly configured

### Performance Issues

1. **Large datasets**: Consider implementing server-side pagination
2. **Slow rendering**: Use `React.memo` for your data array
3. **Memory leaks**: Clean up event listeners in useEffect cleanup

