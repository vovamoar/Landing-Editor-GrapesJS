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

interface CssFile {
	path: string
	content: string
}

const Editor: React.FC = () => {
	const [searchParams] = useSearchParams()
	const siteName = searchParams.get('site')
	const editorRef = useRef<GrapesEditor | null>(null)
	const panelTopRef = useRef<HTMLDivElement>(null)
	const [isPanelReady, setIsPanelReady] = useState(false)
	const [cssFiles, setCssFiles] = useState<CssFile[]>([])

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
				console.log('Загруженные изображения:', images) // Отладочный лог

				const editor = grapesjs.init({
					container: '#gjs',
					height: '100vh',
					width: '100%',
					components: html,
					style: cssFiles.map((file: CssFile) => file.content).join('\n'),
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
									console.log('Ответ от сервера при загрузке:', response.data) // Отладочный лог
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
