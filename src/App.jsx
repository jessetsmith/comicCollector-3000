import './App.css'
import Search from '../components/Search'
import Title from '../components/Title'
import BackgroundSlideshow from '../components/BackgroundSlideshow'

function App() {
  return (
    <div className="App">
      <BackgroundSlideshow />
      <Title />
      <Search />
    </div>
  )
}

export default App