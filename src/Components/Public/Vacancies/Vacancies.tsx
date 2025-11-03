import { useEffect, useState } from 'react';
import './Vacancies.css';
import { useLocation } from 'react-router-dom';
import driver from '../../../Database/driver';
import { IRoom, iRoomConverter } from '../../../Models/Classroom.interface';
import { dbKey } from '../../../Models/databaseKeys';
import { currentContext as ctx } from '../../../Models/Program';
//icons
import {
  KeyIcon,
  VacancyIcon,
  SubscribedIcon,
  FreeIcon,
  ValidatedIcon,
  CopyIcon,
} from '../../../Assets/icon';

const Vacancies = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const uuid = searchParams.get('id');

  //room state
  const [room, setRoom] = useState<IRoom | null | undefined>(null);

  //fetch data
  useEffect(() => {
    const fetchData = async () => {
      setRoom(await fetchRoomData());
    };
    fetchData();
  }, [uuid]);

  function handleOnClickKey() {
    room && navigator.clipboard.writeText(room.idCal.slice(1));
    setKeyCopied(() => true);

    setTimeout(() => {
      setKeyCopied(() => false);
    }, 1000);
  }
  const [keyCopied, setKeyCopied] = useState<boolean>(false);

  async function fetchRoomData() {
    try {
      if (uuid) {
        //fetch vacancy data using the uuid
        const fetchRoom = await driver.get<IRoom>(
          uuid,
          'doc',
          dbKey.room,
          iRoomConverter
        );
        console.log('fetched room data:', fetchRoom);
        return fetchRoom as IRoom | undefined;
      }
    } catch (error) {
      console.error('error fetching room data:', error);
    }
  }
  function restVacancies(amount: number | undefined, toRest: number | undefined) {
    if (amount === undefined || toRest === undefined) {
      return 0;
    }
    const op = amount - toRest;

    if (op <= 0) {
      return 0;
    }
    return op;
  }

  return (
    <>
      <main className='container'>
        <section className='header-section'>
          <h2>reporte actividad</h2>
          <article className='article-location'>
            <p>{room?.land.name}</p>
            <p>
              {room?.placeActivity.name}📅{room?.placeActivity.date.toLocaleDateString()}
            </p>
          </article>
          <article className='article-validation-code'>
            <button className='validation-code' onClick={handleOnClickKey}>
              código valida{<KeyIcon />}
              <span>{room?.idCal.slice(1)}</span>
              <CopyIcon style={{ color: '#bbb', width: '1.1rem' }} />
            </button>
            {keyCopied && <p className='msg-copy'>copiado✅</p>}
          </article>
        </section>
        <section className='content-section'>
          <article className='room-data total'>
            <VacancyIcon color='primary' />
            <h3>cupos</h3>
            <p>{room?.vacancies}</p>
          </article>
          <article className='room-data used'>
            <SubscribedIcon color='primary' />
            <h3>inscritos</h3>
            <p>{room?.enrolled.length}</p>
          </article>
          <article className='room-data free'>
            <FreeIcon color='primary' />
            <h3>libres</h3>
            <p>{restVacancies(room?.vacancies, room?.enrolled.length)}</p>
            <meter
              low={0.3 * (room ? room?.vacancies ?? 0 : 0)}
              high={0.6 * (room ? room?.vacancies ?? 0 : 0)}
              optimum={0.8 * (room ? room?.vacancies ?? 0 : 0)}
              max={room ? room?.vacancies ?? 0 : 0}
              value={room ? room?.enrolled.length : 0}
            ></meter>
          </article>
          <article className='room-data validated'>
            <ValidatedIcon style={{ color: '#fff' }} />
            <h3>validados</h3>
            <p>{room ? room.attendees.length : 0}</p>
            <meter
              max={room ? room.enrolled.length : 100}
              value={room ? room.attendees.length : 0}
            ></meter>
          </article>
        </section>
      </main>
      <footer>
        <div>uid {uuid}</div>
        <div>{ctx.program}</div>
        <div>del Ministerio de Energía</div>
      </footer>
    </>
  );
};

export default Vacancies;
