import { Helmet } from 'react-helmet-async'
import NavBar from './components/NavBar'
import Hero from './components/Hero'
import Footer from './components/Footer'

function App() {
	return (
		<>
			<Helmet>
				<title>Hello Otters!</title>
				<script src="https://tally.so/widgets/embed.js"></script>
			</Helmet>
			<NavBar />
			<Hero />
			<Footer />
		</>
	)
}

export default App
