import { IPerson } from '../../../Models/Person.Interface';
import { DataGrid, GridColDef } from '@material-ui/data-grid';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'id', width: 70 },
  { field: 'name', headerName: 'nombre', width: 130 },
  { field: 'surname', headerName: 'apellido', width: 130 },
  { field: 'rut', headerName: 'rut', width: 100 },
];

export const TableOfPeople = (props: { people: IPerson[] }) => {
  const people = props.people.sort((a, b) =>
    a.name.fatherName > b.name.fatherName ? 1 : -1
  );

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
    <div style={{ height: 300, width: '100%' }}>
      <DataGrid rows={rows} columns={columns} pageSize={20} density='compact' />
    </div>
  );
};
