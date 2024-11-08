import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPenAlt } from '@fortawesome/free-solid-svg-icons';

export default function TrainersCell({ trainer, onClick}){

    return (
        <div className="celdas-trainers">
            <ul>
                <li>{trainer.nombre}</li>
                <li>{trainer.apellidos}</li>
                <li>+{trainer.telefono}</li>
                <li>{trainer.medallas}</li>
                <li>
                    <button onClick={async () => onClick('update', trainer.id, trainer)}>
                        <FontAwesomeIcon icon={faPenAlt} />
                    </button>
                    <button onClick={async () => onClick('delete', trainer.id, trainer)}>
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                </li>
            </ul>
        </div>
    )
}