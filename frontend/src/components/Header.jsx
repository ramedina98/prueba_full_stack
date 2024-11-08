
export default function Header({ title, color }){

    return (
        <header>
            <div
                className={`w-full py-4 flex justify-center items-center`}
                style={{ backgroundColor: color}}
            >
                <div>
                    <h1 className='text-4xl text-slate-50'>
                        {title || ''}
                    </h1>
                </div>
            </div>
        </header>
    )
}