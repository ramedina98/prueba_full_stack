import { useState } from "react"
import Header from "./components/header"
import Footer from "./components/Footer"
import PokédexContainer from "./layouts/PokédexContainer"

export default function App() {
  const [changeModuleView, setChangeModuleView] = useState(true)

  const changeView = () => {
    setChangeModuleView(!changeModuleView);
  }

  return (
    <div className="main-page">
      <Header title='Pokédex' color='black' />
      <div className='w-full py-4 flex justify-center items-center bg-pokebolRed'>
      <div
          className="w-72 bg-gray-300  flex justify-center items-start py-2 rounded-md"
        >
          <button
            className="px-5 py-3 bg-gray-500 rounded-md text-slate-100 text-base tracking-wider"
            onClick={changeView}
          >
            {changeModuleView ?
              'Ver entrenadores pokémon'
              :
              'Ver pokemones'
            }
          </button>
        </div>
      </div>
      <main
        className="w-full py-10 flex justify-center items-center"
      >
        <PokédexContainer changeState={changeModuleView} />
      </main>
      <Footer text='Atrapalos a todos'/>
    </div>
  )
}