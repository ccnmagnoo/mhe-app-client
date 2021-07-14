import { DataGrid, GridColDef } from '@material-ui/data-grid';
import { convertToMine, Mine } from '../../../Functions/convertToMine';
import {
  IBeneficiary,
  iBeneficiaryConverter,
} from '../../../Models/Beneficiary.interface';
import { IClassroom } from '../../../Models/Classroom.interface';
import React from 'react';
import { CSVLink } from 'react-csv';
import Button from '@material-ui/core/Button';

//pdf
import { Report } from '../Report/Report';
import { PDFDownloadLink } from '@react-pdf/renderer';

//icons
import TableChartIcon from '@material-ui/icons/TableChart';
import ReceiptIcon from '@material-ui/icons/Receipt';
import { dbKey } from '../../../Models/databaseKeys';
import { refUuid } from '../../../Config/credential';
import { db } from '../../../Config/firebase';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'id', width: 40 },
  { field: 'name', headerName: 'nombre', width: 130 },
  { field: 'surname', headerName: 'apellido', width: 130 },
  { field: 'rut', headerName: 'rut', width: 100 },
];

export const ListView = (props: { room: IClassroom; workDone: boolean }) => {
  //
  //states 🅿⛽ list with details
  const [people, setPeople] = React.useState<IBeneficiary[]>([]);

  //call beneficiaries/suscribed
  React.useEffect(() => {
    const onSubmitPeople = async () => {
      //call firebase suscribed 🔥🔥🔥🔥
      try {
        //change colection router
        const routeDb = props.workDone
          ? `${dbKey.act}/${refUuid}/${dbKey.cvn}` /*consolidated route*/
          : `${dbKey.act}/${refUuid}/${dbKey.sus}`; /*suscribed route*/

        const ref = db.collection(routeDb).withConverter(iBeneficiaryConverter);
        const promises = props.room.enrolled.map((uuid) => {
          return ref.doc(uuid).get();
        });
        //Promise all
        const snapshot = await Promise.all(promises);
        console.log('snapshots', snapshot.length, 'first', snapshot[0].data());

        //create list of persons without undef
        const peopleList: IBeneficiary[] = [];
        for (let snap of snapshot) {
          const it = snap.data();
          if (it !== undefined) {
            console.log('push beneficiary', it.rut);
            peopleList.push(it);
          }
        }

        //sort list with surname
        const peopleSort = peopleList.sort((a, b) =>
          a.name.fatherName > b.name.fatherName ? 1 : -1
        );

        setPeople(peopleSort);

        //
      } catch (error) {
        console.log('error fetching suscribed', error);
      }
    };

    onSubmitPeople();
  }, [props.workDone, props.room.enrolled]);

  //csv contents
  const [csv, setCsv] = React.useState<Mine[]>([]);
  React.useEffect(() => {
    console.log('download csv suscribed');
    const data = people.map((it, i) => convertToMine(it, props.room, i + 1));
    setCsv(data);
  }, [people, props.room]);

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
      <br />
      {/*datos csv 🎲🎲*/}
      <Button variant='contained' color='primary' size='small'>
        <CSVLink
          data={csv}
          separator={';'}
          filename={`${props.room.cityOnOp} ${
            props.room.idCal
          } ${props.room.dateInstance.toLocaleDateString()}.csv`}
        >
          <TableChartIcon color='action' />
        </CSVLink>
      </Button>
      {/*PDF 📃📃📃*/}
      <Button variant='contained' color='secondary' size='small'>
        <PDFDownloadLink
          document={<Report room={props.room} people={people} />}
          fileName='cvn.pdf'
        >
          {({ blob, url, loading, error }) =>
            loading ? 'generating...' : <ReceiptIcon color='action' />
          }
        </PDFDownloadLink>
      </Button>
      {/*<img src={`data:image/svg+xml;utf8,${sign}`} alt='no' />*/}
    </>
  );
};
