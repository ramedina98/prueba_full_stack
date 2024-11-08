import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faPlusCircle, faPrint } from '@fortawesome/free-solid-svg-icons';
import '../css/index.css'

export default function UpperBar({ changeState, onChange, onClick, value, limitChange, page}){

    return (
        <div
            className="w-full bg-gray-500 py-4 flex items-center"
            style={{
                borderTopLeftRadius: '0.375rem',
                borderTopRightRadius: '0.375rem',
                justifyContent: 'space-between',
            }}
        >
            <input
                className="py-2 rounded-md w-72 text-base tracking-wide placeholder:text-gray-300 text-gray-800"
                style={{
                    marginLeft: '15px',
                    border: 'none',
                    outline: 'none',
                    paddingLeft: '6px',
                }}
                type="text"
                placeholder={changeState ? 'Busca a tu pokémon' : 'Buscar entrenador'}
                onChange={onChange}
            />
            {changeState ? (
                <span className='font-semibold text-lg text-slate-300'>
                    {page}
                </span>
            ) : (<div></div>)}
            <div>
                {changeState ?
                (
                    <div
                        className='flex justify-between items-center'
                        style={{
                            marginRight: '15px',
                            width: '200px',
                        }}
                    >
                        <button className='buttonStyle' onClick={() => onClick('previus')}>
                            <FontAwesomeIcon icon={faChevronLeft} />
                        </button>
                        <input
                            type='number'
                            className='text-black text-lg font-medium text-center'
                            style={{
                                width: '50px'
                            }}
                            value={value}
                            onChange={limitChange}
                        />
                        <button className='buttonStyle' onClick={() => onClick('next')}>
                            <FontAwesomeIcon icon={faChevronRight} />
                        </button>
                    </div>
                )
                :
                (
                    <div
                        className='flex justify-between items-center'
                        style={{
                            marginRight: '15px',
                            width: '150px',
                        }}
                    >
                        <button style={{ marginRight: '15px'}} className='buttonStyle' onClick={() => onClick('add')}>
                            <FontAwesomeIcon icon={faPlusCircle} />
                        </button>
                        <button style={{ marginRight: '15px'}} className='buttonStyle' onClick={() => onClick('print')}>
                            <FontAwesomeIcon icon={faPrint} />
                        </button>
                    </div>
                )
                }
            </div>
        </div>
    );
}