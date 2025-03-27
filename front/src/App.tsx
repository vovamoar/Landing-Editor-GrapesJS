import axios from 'axios'
import { useEffect, useState } from 'react'

interface Site {
	name: string
}

const App = () => {
	const [sites, setSites] = useState<Site[]>([])

	// Запрашиваем список сайтов с бэкенда
	useEffect(() => {
		axios.get('http://localhost:3000/sites').then(response => {
			setSites(response.data)
		})
	}, [])

	// Функция для предпросмотра сайта
	const handlePreview = (siteName: string) => {
		window.open(`http://localhost:3000/sites/${siteName}/preview`, '_blank')
	}

	// Функция для редактирования сайта
	const handleEdit = (siteName: string) => {
		window.open(`/editor?site=${siteName}`, '_blank')
	}

	return (
		<div className='min-h-screen bg-gray-900 p-6'>
			<h1 className='text-4xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500'>
				Мои лендинги
			</h1>
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
				{sites.map(site => (
					<div
						key={site.name}
						className='bg-gray-800 shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] 
						transition-all duration-300 rounded-lg p-8 flex flex-col items-center border border-cyan-500/20'
					>
						<h2 className='text-2xl font-semibold mb-6 text-cyan-400'>
							{site.name}
						</h2>
						<div className='flex space-x-4'>
							<button
								onClick={() => handlePreview(site.name)}
								className='bg-transparent border-2 border-purple-500 text-purple-400 px-6 py-2 rounded-lg
								hover:bg-purple-500 hover:text-white transition-all duration-300'
							>
								<i className='fas fa-eye mr-2'></i>
								Preview
							</button>
							<button
								onClick={() => handleEdit(site.name)}
								className='bg-transparent border-2 border-cyan-500 text-cyan-400 px-6 py-2 rounded-lg
								hover:bg-cyan-500 hover:text-white transition-all duration-300'
							>
								<i className='fas fa-pencil-alt mr-2'></i>
								Edit
							</button>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}

export default App
