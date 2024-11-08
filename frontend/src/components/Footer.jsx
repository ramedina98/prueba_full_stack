
export default function Footer({ text }){

    return (
        <footer className="w-full py-4 bg-gray-300 flex justify-center items-center">
            <div>
                <h2 className='text-3xl text-slate-800'>
                    {text}
                </h2>
            </div>
        </footer>
    )
}