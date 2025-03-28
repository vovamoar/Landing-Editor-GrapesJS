// import '@fortawesome/fontawesome-free/css/all.min.css'
// import axios from 'axios'
// import grapesjs, { Editor as GrapesEditor } from 'grapesjs'
// import grapesjsBlocksBootstrap4 from 'grapesjs-blocks-bootstrap4'
// import grapesjsComponentCountdown from 'grapesjs-component-countdown'
// import grapesjsCustomCode from 'grapesjs-custom-code'
// import grapesjsParserPostcss from 'grapesjs-parser-postcss'
// import grapesjsPluginExport from 'grapesjs-plugin-export'
// import grapesjsPluginForms from 'grapesjs-plugin-forms'
// import grapesjsPresetWebpage from 'grapesjs-preset-webpage'
// import grapesjsStyleBg from 'grapesjs-style-bg'
// import grapesjsTabs from 'grapesjs-tabs'
// import grapesjsTooltip from 'grapesjs-tooltip'
// import grapesjsTuiImageEditor from 'grapesjs-tui-image-editor'
// import grapesjsTyped from 'grapesjs-typed'
// import 'grapesjs/dist/css/grapes.min.css'
// import { useEffect, useRef, useState } from 'react'
// import { useSearchParams } from 'react-router-dom'

// const Editor: React.FC = () => {
// 	const [searchParams] = useSearchParams()
// 	const siteName = searchParams.get('site')
// 	const editorRef = useRef<GrapesEditor | null>(null)
// 	const panelTopRef = useRef<HTMLDivElement>(null)
// 	const [isPanelReady, setIsPanelReady] = useState(false)

// 	// Ensure the panel is ready before initializing GrapesJS
// 	useEffect(() => {
// 		if (panelTopRef.current) {
// 			setIsPanelReady(true)
// 		}
// 	}, [])

// 	// Инициализируем редактор
// 	useEffect(() => {
// 		if (!siteName || !isPanelReady) return

// 		// Загружаем HTML, CSS и изображения с бэкенда
// 		axios
// 			.get(`http://localhost:3000/sites/${siteName}/edit`)
// 			.then(response => {
// 				const { html, css, images } = response.data
// 				console.log('Полученные изображения с бэкенда:', images)

// 				// Инициализируем GrapesJS
// 				const editor = grapesjs.init({
// 					container: '#gjs',
// 					height: '100vh',
// 					width: '100%',
// 					components: html,
// 					style: css,
// 					storageManager: false,

// 					// Добавляем плагины
// 					plugins: [
// 						grapesjsPresetWebpage,
// 						grapesjsPluginForms,
// 						grapesjsPluginExport,
// 						grapesjsTuiImageEditor,
// 						grapesjsStyleBg,
// 						grapesjsBlocksBootstrap4,
// 						grapesjsTabs,
// 						grapesjsCustomCode,
// 						grapesjsParserPostcss,
// 						grapesjsTooltip,
// 						grapesjsTyped,
// 						grapesjsComponentCountdown,
// 					],

// 					// Настраиваем панели
// 					panels: {
// 						defaults: [
// 							{
// 								id: 'options',
// 								el: '#panel-top',
// 								buttons: [
// 									{
// 										id: 'save',
// 										className: 'fas fa-save',
// 										command: 'save-command',
// 										attributes: { title: 'Save Changes' },
// 									},
// 									{
// 										id: 'undo',
// 										className: 'fas fa-undo',
// 										command: 'core:undo',
// 										attributes: { title: 'Undo' },
// 									},
// 									{
// 										id: 'redo',
// 										className: 'fas fa-repeat',
// 										command: 'core:redo',
// 										attributes: { title: 'Redo' },
// 									},
// 									{
// 										id: 'export',
// 										className: 'fas fa-download',
// 										command: 'export-template',
// 										attributes: { title: 'Export Project' },
// 									},
// 								],
// 							},
// 							{
// 								id: 'views',
// 								buttons: [
// 									{
// 										id: 'open-sm',
// 										className: 'fas fa-paint-brush',
// 										command: 'open-style-manager',
// 										attributes: { title: 'Open Style Manager' },
// 										active: true,
// 									},
// 									{
// 										id: 'open-layers',
// 										className: 'fas fa-bars',
// 										command: 'open-layer-manager',
// 										attributes: { title: 'Open Layer Manager' },
// 									},
// 									{
// 										id: 'open-blocks',
// 										className: 'fas fa-th-large',
// 										command: 'open-block-manager',
// 										attributes: { title: 'Open Blocks' },
// 									},
// 								],
// 							},
// 						],
// 					},

// 					// Настраиваем Asset Manager для загрузки изображений через бэкенд
// 					assetManager: {
// 						assets: images || [],
// 						upload: `http://localhost:3000/sites/${siteName}/upload-image`,
// 						uploadName: 'image',
// 						multiUpload: false,
// 						autoAdd: true,
// 						uploadFile: (e: DragEvent | Event) => {
// 							const files =
// 								e instanceof DragEvent
// 									? e.dataTransfer?.files
// 									: (e.target as HTMLInputElement).files

// 							if (!files || files.length === 0) {
// 								throw new Error('No files selected')
// 							}

// 							const formData = new FormData()
// 							formData.append('image', files[0])

// 							return axios
// 								.post(
// 									`http://localhost:3000/sites/${siteName}/upload-image`,
// 									formData,
// 									{
// 										headers: {
// 											'Content-Type': 'multipart/form-data',
// 										},
// 									}
// 								)
// 								.then(response => {
// 									console.log('Изображение загружено:', response.data.url)
// 									const newAsset = {
// 										src: response.data.url,
// 										name: files[0].name,
// 										type: 'image',
// 									}
// 									editor.AssetManager.add(newAsset)
// 									return [newAsset]
// 								})
// 								.catch(err => {
// 									console.error('Ошибка при загрузке изображения:', err)
// 									alert('Ошибка при загрузке изображения.')
// 									throw err
// 								})
// 						},
// 					},

// 					// Настройки для плагинов
// 					pluginsOpts: {
// 						'tui-image-editor': {
// 							config: {
// 								includeUI: {
// 									initMenu: 'filter',
// 									menuBarPosition: 'bottom',
// 								},
// 							},
// 						},
// 						'blocks-bootstrap4': {
// 							blocks: {
// 								bootstrap4Blocks: true,
// 								bootstrap4Components: true,
// 							},
// 						},
// 						typed: {
// 							block: {
// 								category: 'Extra',
// 								content: {
// 									type: 'typed',
// 									'type-speed': 40,
// 									strings: ['Welcome to my site!', 'This is a test!'],
// 								},
// 							},
// 						},
// 						countdown: {
// 							block: {
// 								category: 'Extra',
// 								content: {
// 									type: 'countdown',
// 									date: '2025-12-31',
// 								},
// 							},
// 						},
// 					},
// 				})

// 				editorRef.current = editor

// 				// Проверяем, что панель options добавлена
// 				const optionsPanel = editor.Panels.getPanel('options')
// 				console.log('Панель options:', optionsPanel)
// 				if (!optionsPanel) {
// 					console.error('Панель options не была добавлена!')
// 				} else {
// 					console.log('Кнопки на панели options:', optionsPanel.get('buttons'))
// 				}

// 				// Добавляем команду для сохранения
// 				editor.Commands.add('save-command', {
// 					run: (editor: GrapesEditor) => {
// 						let updatedHtml = editor.getHtml()
// 						const updatedCss = editor.getCss()

// 						// Исправляем пути к изображениям в HTML перед сохранением
// 						updatedHtml = updatedHtml.replace(
// 							/src="[^"]*\/sites\/[^/]+\/images\/([^"]+)"/g,
// 							`src="/sites/${siteName}/images/$1"`
// 						)

// 						console.log('Сохраняем изменения:', {
// 							html: updatedHtml,
// 							css: updatedCss,
// 						})

// 						// Отправляем обновлённые файлы на бэкенд
// 						axios
// 							.post(`http://localhost:3000/sites/${siteName}/update`, {
// 								html: updatedHtml,
// 								css: updatedCss,
// 							})
// 							.then(() => {
// 								console.log('Изменения успешно сохранены!')
// 								alert('Изменения сохранены!')
// 							})
// 							.catch(err => {
// 								console.error('Ошибка при сохранении:', err)
// 								alert('Ошибка при сохранении изменений.')
// 							})
// 					},
// 				})

// 				// Команда для экспорта проекта
// 				editor.Commands.add('export-template', {
// 					run: (editor: GrapesEditor) => {
// 						editor.runCommand('gjs-export-zip')
// 					},
// 				})

// 				// Команда для открытия Style Manager
// 				editor.Commands.add('open-style-manager', {
// 					run: (editor: GrapesEditor) => {
// 						const button = editor.Panels.getButton('views', 'open-sm')
// 						if (button) {
// 							button.set('active', true)
// 						}
// 						editor.runCommand('core:open-styles')
// 					},
// 				})

// 				// Команда для открытия Layer Manager
// 				editor.Commands.add('open-layer-manager', {
// 					run: (editor: GrapesEditor) => {
// 						const button = editor.Panels.getButton('views', 'open-layers')
// 						if (button) {
// 							button.set('active', true)
// 						}
// 						editor.runCommand('core:open-layers')
// 					},
// 				})

// 				// Команда для открытия Block Manager
// 				editor.Commands.add('open-block-manager', {
// 					run: (editor: GrapesEditor) => {
// 						const button = editor.Panels.getButton('views', 'open-blocks')
// 						if (button) {
// 							button.set('active', true)
// 						}
// 						editor.runCommand('core:open-blocks')
// 					},
// 				})

// 				// Добавляем обработчик для замены изображения
// 				editor.on(
// 					'asset:select',
// 					(asset: { get: (prop: string) => string }) => {
// 						const selected = editor.getSelected()
// 						if (selected && selected.is('image')) {
// 							const newSrc = asset.get('src')
// 							selected.set('src', newSrc)
// 							console.log('Изображение заменено на:', newSrc)
// 						}
// 					}
// 				)

// 				// Открываем Style Manager по умолчанию
// 				editor.runCommand('core:open-styles')
// 			})
// 			.catch(err => {
// 				console.error('Ошибка при загрузке данных для редактирования:', err)
// 				alert('Не удалось загрузить сайт для редактирования.')
// 			})

// 		// Очищаем редактор при размонтировании
// 		return () => {
// 			if (editorRef.current) {
// 				editorRef.current.destroy()
// 				editorRef.current = null
// 			}
// 		}
// 	}, [siteName, isPanelReady])

// 	// Функция для сохранения изменений (для отдельной кнопки)
// 	const handleSaveChanges = () => {
// 		if (!editorRef.current) {
// 			alert('Редактор не инициализирован!')
// 			return
// 		}

// 		const editor = editorRef.current
// 		let updatedHtml = editor.getHtml()
// 		const updatedCss = editor.getCss()

// 		// Исправляем пути к изображениям в HTML перед сохранением
// 		updatedHtml = updatedHtml.replace(
// 			/src="[^"]*\/sites\/[^/]+\/images\/([^"]+)"/g,
// 			`src="/sites/${siteName}/images/$1"`
// 		)

// 		console.log('Сохраняем изменения:', {
// 			html: updatedHtml,
// 			css: updatedCss,
// 		})

// 		// Отправляем обновлённые файлы на бэкенд
// 		axios
// 			.post(`http://localhost:3000/sites/${siteName}/update`, {
// 				html: updatedHtml,
// 				css: updatedCss,
// 			})
// 			.then(() => {
// 				console.log('Изменения успешно сохранены!')
// 				alert('Изменения сохранены!')
// 			})
// 			.catch(err => {
// 				console.error('Ошибка при сохранении:', err)
// 				alert('Ошибка при сохранении изменений.')
// 			})
// 	}

// 	return (
// 		<div className='flex flex-col h-screen'>
// 			<link
// 				rel='stylesheet'
// 				href='https://unpkg.com/grapesjs/dist/css/grapes.min.css'
// 			/>
// 			<link
// 				rel='stylesheet'
// 				href='https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css'
// 			/>
// 			<nav className='bg-gray-800 text-white p-3 flex justify-between items-center'>
// 				{/* <div>
// 					<a href='/' className='mr-4'>
// 						Home
// 					</a>
// 					<a href='/page2.html'>Other page</a>
// 				</div> */}
// 				{/* Добавляем отдельную кнопку "Сохранить изменения" */}
// 				<button
// 					onClick={handleSaveChanges}
// 					className='border-2 border-white text-white font-bold py-2 px-4 rounded flex items-center'
// 				>
// 					<i className='fas fa-save mr-2'></i>
// 					Save changes
// 				</button>
// 			</nav>
// 			<div
// 				id='panel-top'
// 				ref={panelTopRef}
// 				className='panel__top'
// 				style={{
// 					display: 'flex',
// 					justifyContent: 'center',
// 					padding: '10px',
// 					background: '#333',
// 					color: '#fff',
// 					minHeight: '50px',
// 				}}
// 			></div>
// 			<main className='flex-grow flex'>
// 				<div id='gjs' className='flex-grow'></div>
// 			</main>
// 		</div>
// 	)
// }

// export default Editor

//////////////////////////////////////////////////////////////////////////////

import '@fortawesome/fontawesome-free/css/all.min.css'
import axios from 'axios'
import grapesjs, { Editor as GrapesEditor } from 'grapesjs'
import grapesjsBlocksBootstrap4 from 'grapesjs-blocks-bootstrap4'
import grapesjsComponentCountdown from 'grapesjs-component-countdown'
import grapesjsCustomCode from 'grapesjs-custom-code'
import grapesjsParserPostcss from 'grapesjs-parser-postcss'
import grapesjsPluginExport from 'grapesjs-plugin-export'
import grapesjsPluginForms from 'grapesjs-plugin-forms'
import grapesjsPresetWebpage from 'grapesjs-preset-webpage'
import grapesjsStyleBg from 'grapesjs-style-bg'
import grapesjsTabs from 'grapesjs-tabs'
import grapesjsTooltip from 'grapesjs-tooltip'
import grapesjsTuiImageEditor from 'grapesjs-tui-image-editor'
import grapesjsTyped from 'grapesjs-typed'
import 'grapesjs/dist/css/grapes.min.css'
import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

const Editor: React.FC = () => {
	const [searchParams] = useSearchParams()
	const siteName = searchParams.get('site')
	const editorRef = useRef<GrapesEditor | null>(null)
	const panelTopRef = useRef<HTMLDivElement>(null)
	const [isPanelReady, setIsPanelReady] = useState(false)
	const [cssFiles, setCssFiles] = useState<any[]>([])

	useEffect(() => {
		if (panelTopRef.current) {
			setIsPanelReady(true)
		}
	}, [])

	useEffect(() => {
		if (!siteName || !isPanelReady) return

		axios
			.get(`http://localhost:3000/sites/${siteName}/edit`)
			.then(response => {
				const { html, cssFiles, images } = response.data
				setCssFiles(cssFiles)

				const editor = grapesjs.init({
					container: '#gjs',
					height: '100vh',
					width: '100%',
					components: html,
					style: cssFiles.map(file => file.content).join('\n'),
					storageManager: false,
					plugins: [
						grapesjsPresetWebpage,
						grapesjsPluginForms,
						grapesjsPluginExport,
						grapesjsTuiImageEditor,
						grapesjsStyleBg,
						grapesjsBlocksBootstrap4,
						grapesjsTabs,
						grapesjsCustomCode,
						grapesjsParserPostcss,
						grapesjsTooltip,
						grapesjsTyped,
						grapesjsComponentCountdown,
					],
					panels: {
						defaults: [
							{
								id: 'options',
								el: '#panel-top',
								buttons: [
									{
										id: 'save',
										className: 'fas fa-save',
										command: 'save-command',
										attributes: { title: 'Save Changes' },
									},
									{
										id: 'undo',
										className: 'fas fa-undo',
										command: 'core:undo',
										attributes: { title: 'Undo' },
									},
									{
										id: 'redo',
										className: 'fas fa-repeat',
										command: 'core:redo',
										attributes: { title: 'Redo' },
									},
									{
										id: 'export',
										className: 'fas fa-download',
										command: 'export-template',
										attributes: { title: 'Export Project' },
									},
								],
							},
							{
								id: 'views',
								buttons: [
									{
										id: 'open-sm',
										className: 'fas fa-paint-brush',
										command: 'open-style-manager',
										attributes: { title: 'Open Style Manager' },
										active: true,
									},
									{
										id: 'open-layers',
										className: 'fas fa-bars',
										command: 'open-layer-manager',
										attributes: { title: 'Open Layer Manager' },
									},
									{
										id: 'open-blocks',
										className: 'fas fa-th-large',
										command: 'open-block-manager',
										attributes: { title: 'Open Blocks' },
									},
								],
							},
						],
					},
					assetManager: {
						assets: images || [],
						upload: `http://localhost:3000/sites/${siteName}/upload-image`,
						uploadName: 'image',
						multiUpload: false,
						autoAdd: true,
						uploadFile: (e: DragEvent | Event) => {
							const files =
								e instanceof DragEvent
									? e.dataTransfer?.files
									: (e.target as HTMLInputElement).files

							if (!files || files.length === 0) {
								throw new Error('No files selected')
							}

							const formData = new FormData()
							formData.append('image', files[0])

							return axios
								.post(
									`http://localhost:3000/sites/${siteName}/upload-image`,
									formData,
									{
										headers: {
											'Content-Type': 'multipart/form-data',
										},
									}
								)
								.then(response => {
									const newAsset = {
										src: response.data.url,
										name: files[0].name,
										type: 'image',
									}
									editor.AssetManager.add(newAsset)
									return [newAsset]
								})
								.catch(err => {
									console.error('Ошибка при загрузке изображения:', err)
									alert('Ошибка при загрузке изображения.')
									throw err
								})
						},
					},
					pluginsOpts: {
						'tui-image-editor': {
							config: {
								includeUI: {
									initMenu: 'filter',
									menuBarPosition: 'bottom',
								},
							},
						},
						'blocks-bootstrap4': {
							blocks: {
								bootstrap4Blocks: true,
								bootstrap4Components: true,
							},
						},
						typed: {
							block: {
								category: 'Extra',
								content: {
									type: 'typed',
									'type-speed': 40,
									strings: ['Welcome to my site!', 'This is a test!'],
								},
							},
						},
						countdown: {
							block: {
								category: 'Extra',
								content: {
									type: 'countdown',
									date: '2025-12-31',
								},
							},
						},
					},
				})

				editorRef.current = editor

				editor.Commands.add('save-command', {
					run: (editor: GrapesEditor) => {
						let updatedHtml = editor.getHtml()
						const updatedCss = editor.getCss()

						updatedHtml = updatedHtml.replace(
							/src="[^"]*\/sites\/[^/]+\/images\/([^"]+)"/g,
							`src="/sites/${siteName}/images/$1"`
						)

						axios
							.post(`http://localhost:3000/sites/${siteName}/update`, {
								html: updatedHtml,
								cssFiles: cssFiles.map(file => ({
									path: file.path,
									content: updatedCss,
								})),
							})
							.then(() => {
								alert('Изменения сохранены!')
							})
							.catch(err => {
								console.error('Ошибка при сохранении:', err)
								alert('Ошибка при сохранении изменений.')
							})
					},
				})

				editor.Commands.add('export-template', {
					run: (editor: GrapesEditor) => {
						editor.runCommand('gjs-export-zip')
					},
				})

				editor.runCommand('core:open-styles')
			})
			.catch(err => {
				console.error('Ошибка при загрузке данных для редактирования:', err)
				alert('Не удалось загрузить сайт для редактирования.')
			})

		return () => {
			if (editorRef.current) {
				editorRef.current.destroy()
				editorRef.current = null
			}
		}
	}, [siteName, isPanelReady])

	const handleSaveChanges = () => {
		if (!editorRef.current) {
			alert('Редактор не инициализирован!')
			return
		}

		const editor = editorRef.current
		let updatedHtml = editor.getHtml()
		const updatedCss = editor.getCss()

		updatedHtml = updatedHtml.replace(
			/src="[^"]*\/sites\/[^/]+\/images\/([^"]+)"/g,
			`src="/sites/${siteName}/images/$1"`
		)

		axios
			.post(`http://localhost:3000/sites/${siteName}/update`, {
				html: updatedHtml,
				cssFiles: cssFiles.map(file => ({
					path: file.path,
					content: updatedCss,
				})),
			})
			.then(() => {
				alert('Изменения сохранены!')
			})
			.catch(err => {
				console.error('Ошибка при сохранении:', err)
				alert('Ошибка при сохранении изменений.')
			})
	}

	return (
		<div className='flex flex-col h-screen'>
			<link
				rel='stylesheet'
				href='https://unpkg.com/grapesjs/dist/css/grapes.min.css'
			/>
			<link
				rel='stylesheet'
				href='https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css'
			/>
			<nav className='bg-gray-800 text-white p-3 flex justify-between items-center'>
				<button
					onClick={handleSaveChanges}
					className='border-2 border-white text-white font-bold py-2 px-4 rounded flex items-center'
				>
					<i className='fas fa-save mr-2'></i>
					Save changes
				</button>
			</nav>
			<div
				id='panel-top'
				ref={panelTopRef}
				className='panel__top'
				style={{
					display: 'flex',
					justifyContent: 'center',
					padding: '10px',
					background: '#333',
					color: '#fff',
					minHeight: '50px',
				}}
			></div>
			<main className='flex-grow flex'>
				<div id='gjs' className='flex-grow'></div>
			</main>
		</div>
	)
}

export default Editor
