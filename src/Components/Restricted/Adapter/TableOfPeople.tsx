import { IPerson } from '../../../Models/Person.Interface';
import { DataGrid, GridColDef } from '@material-ui/data-grid';
import { Box } from '@material-ui/core';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'id', width: 70 },
  { field: 'name', headerName: 'nombre', width: 130 },
  { field: 'surname', headerName: 'apellido', width: 130 },
  { field: 'rut', headerName: 'rut', width: 100 },
];

export const TableOfPeople = (props: { people: IPerson[] }) => {
  const people = props.people;

  const rows = people.map((it, i) => {
    console.log('populating table rut:', it.rut);
    return {
      id: i + 1,
      name: it.name.firstName.split(' ')[0],
      surname: it.name.fatherName,
      rut: it.rut,
    };
  });
  //
  //{people.map((it, index) => {
  //return <li key={index}>{it.name.firstName}</li>;
  //})}

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={20}
        density='compact'
        checkboxSelection
      />
      ;
    </div>
  );
};
