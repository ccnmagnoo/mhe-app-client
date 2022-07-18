import { DataGrid, GridColDef } from '@material-ui/data-grid';
import { convertToCsv, Mine } from '../../../Functions/convertToCsv';
import {
  IBeneficiary,
  iBeneficiaryConverter,
} from '../../../Models/Beneficiary.interface';
import { IRoom } from '../../../Models/Classroom.interface';
import React, { useEffect } from 'react';
import { CSVLink } from 'react-csv';
import Button from '@material-ui/core/Button';

//icons
import TableChartIcon from '@material-ui/icons/TableChart';
import ReceiptIcon from '@material-ui/icons/Receipt';
import { dbKey } from '../../../Models/databaseKeys';
import { where } from 'firebase/firestore';
import driver from '../../../Database/driver';
import { useGenBlob } from '../Report/useGenBlob';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'id', width: 40 },
  { field: 'name', headerName: 'nombre', width: 130 },
  { field: 'surname', headerName: 'apellido', width: 130 },
  { field: 'rut', headerName: 'rut', width: 100 },
];

export const ListView = (props: { room: IRoom; workDone: boolean }) => {
  //
  //states 🅿⛽ list with details
  const [people, setPeople] = React.useState<IBeneficiary[]>([]);
  const [fileIsReady, setFileIsReady] = React.useState<boolean>(false);

  const fileName = `${
    props.room.idCal
  } ${props.room.placeActivity.date.toLocaleDateString()} ${props.room.cityOnOp}`;

  //call beneficiaries/suscribed
  React.useEffect(() => {
    const onSubmitPeople = async () => {
      //call firebase suscribed 🔥🔥🔥🔥
      try {
        //change colection router
        const list = (await driver.get(
          undefined,
          'collection',
          props.workDone ? dbKey.cvn : dbKey.sus,
          iBeneficiaryConverter,
          where('classroom.uuid', '==', props.room.uuid)
        )) as IBeneficiary[];

        console.log('snapshots', list.length, 'first', list[0]);

        //sort list with surname
        const peopleSort = list.sort((a, b) =>
          a.name.fatherName > b.name.fatherName ? 1 : -1
        );

        setPeople(peopleSort);

        //
      } catch (error) {
        console.log('error fetching suscribed', error);
      }
    };

    onSubmitPeople();
  }, [props]);

  //csv contents
  const [csv, setCsv] = React.useState<Mine[]>([]);
  React.useEffect(() => {
    console.log('download csv suscribed');
    const data = people.map((it, i) => convertToCsv(it, props.room, i + 1));
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

  //package download
  const blobFile = useGenBlob(props.room, people, props.workDone) ?? new Blob();
  const fileButton = (
    <Button
      disabled={!fileIsReady}
      variant='contained'
      color={props.workDone ? 'secondary' : 'primary'}
      size='medium'
    >
      <a href={URL.createObjectURL(blobFile)} download={fileName + '.zip'}>
        <ReceiptIcon color='action' titleAccess='.zip' />
      </a>
    </Button>
  );

  useEffect(() => {
    if (blobFile.size > 1000) {
      setFileIsReady(true);
    } else {
      setFileIsReady(false);
    }
  }, [blobFile.size]);

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
      <Button variant='contained' color='primary' size='medium' disabled={!fileIsReady}>
        <CSVLink data={csv} separator={';'} filename={`${fileName}.csv`}>
          <TableChartIcon color='action' titleAccess='.csv' />
        </CSVLink>
      </Button>

      {/*PDF 📃📃📃*/}
      {fileButton}
    </>
  );
};
