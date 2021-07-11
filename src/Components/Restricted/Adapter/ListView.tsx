import { DataGrid, GridColDef } from '@material-ui/data-grid';
import { convertToMine, Mine } from '../../../Functions/convertToMine';
import { IBeneficiary } from '../../../Models/Beneficiary.interface';
import { IClassroom } from '../../../Models/Classroom.interface';
import React from 'react';
import { CSVLink } from 'react-csv';
import Button from '@material-ui/core/Button';
//pdf
import { Report } from '../Report/Report';
import { PDFDownloadLink } from '@react-pdf/renderer';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'id', width: 40 },
  { field: 'name', headerName: 'nombre', width: 130 },
  { field: 'surname', headerName: 'apellido', width: 130 },
  { field: 'rut', headerName: 'rut', width: 100 },
];

export const ListView = (props: { people: IBeneficiary[]; room: IClassroom }) => {
  //sort list with surname
  const people = props.people.sort((a, b) =>
    a.name.fatherName > b.name.fatherName ? 1 : -1
  );

  //csv contents
  const [csv, setCsv] = React.useState<Mine[]>([]);
  React.useEffect(() => {
    console.log('download csv suscribed');
    const data = people.map((it, i) => convertToMine(it, i));
    setCsv(data);
  }, [people]);

  //reduced 🧒 table view name surname rut
  const rows = people.map((it, i) => {
    console.log('populating table rut:', it.rut);
    return {
      id: i + 1,
      name: it.name.firstName.split(' ')[0],
      surname: it.name.fatherName,
      rut: it.rut,
    };
  });

  //gen Certificate
  const [certificates, setCertificates] = React.useState<undefined | JSX.Element>(
    undefined
  );

  return (
    <>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={20}
          density='compact'
          checkboxSelection
        />
      </div>
      <CSVLink
        data={csv}
        separator={';'}
        filename={`${props.room.cityOnOp} ${
          props.room.idCal
        } ${props.room.dateInstance.toLocaleDateString()}.csv`}
      >
        <Button variant='contained' color='default' size='small'>
          .CSV
        </Button>
      </CSVLink>

      <PDFDownloadLink
        document={<Report room={props.room} people={props.people} />}
        fileName='movielist.pdf'
        style={{
          textDecoration: 'none',
          padding: '10px',
          color: '#4a4a4a',
          backgroundColor: '#f2f2f2',
          border: '1px solid #4a4a4a',
        }}
      >
        {({ blob, url, loading, error }) =>
          loading ? 'Loading document...' : 'Download Pdf'
        }
      </PDFDownloadLink>
    </>
  );
};
