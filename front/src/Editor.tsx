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

// Определяем типы для компонентов GrapesJS
type GrapesComponent = {
	get: (property: string) => any
	set: (property: string, value: any) => void
	getAttributes: () => Record<string, any>
	setAttributes: (attrs: Record<string, any>) => void
}

type GrapesAsset = {
	get: (property: string) => any
	set: (property: string, value: any) => void
}

type ComponentsCollection = {
	models: GrapesComponent[]
	length: number
	forEach: (callback: (component: GrapesComponent) => void) => void
}

const Editor: React.FC = () => {
	const [searchParams] = useSearchParams()
	const siteName = searchParams.get('site')
	const editorRef = useRef<GrapesEditor | null>(null)
	const panelTopRef = useRef<HTMLDivElement>(null)
	const [isPanelReady, setIsPanelReady] = useState(false)
	const [siteFiles, setSiteFiles] = useState<{
		cssFiles: CssFile[]
		images: Array<{ src: string; name: string; type: string }>
	}>({ cssFiles: [], images: [] })

	useEffect(() => {
		if (panelTopRef.current) {
			setIsPanelReady(true)
		}
	}, [])

	// Функция для загрузки base64 изображения на сервер
	const uploadBase64Image = async (
		base64Data: string,
		fileName: string
	): Promise<string> => {
		try {
			console.log(`Загружаем base64 на сервер как ${fileName}...`)

			// Отправляем запрос на сервер
			const response = await axios.post(
				`http://localhost:3000/sites/${siteName}/upload-base64`,
				{
					base64: base64Data,
					name: fileName,
				},
				{
					timeout: 30000, // 30 секунд таймаут для больших изображений
				}
			)

			console.log('Изображение успешно загружено:', response.data.url)
			return response.data.url
		} catch (error) {
			console.error('Ошибка загрузки base64:', error)
			throw error
		}
	}

	useEffect(() => {
		if (!siteName || !isPanelReady) return

		axios
			.get(`http://localhost:3000/sites/${siteName}/edit`)
			.then(response => {
				const { html, cssFiles, images } = response.data
				console.log('Полученные данные с сервера:', { html, cssFiles, images })

				// Сохраняем файлы сайта
				setSiteFiles({ cssFiles, images })

				// Инициализируем редактор GrapesJS с полученными данными
				const editor = grapesjs.init({
					container: '#gjs',
					height: '100vh',
					width: '100%',
					components: html,
					style: cssFiles.map((file: CssFile) => file.content).join('\n'),
					storageManager: false,
					canvas: {
						styles: [
							'https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css',
							'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css',
						],
						scripts: [],
						frameStyle: `
							body { 
								box-sizing: border-box; 
								padding: 0;
								margin: 0;
							}
							
							img {
								display: inline-block;
								max-width: 100%;
								height: auto;
							}
						`,
						autoscrollLimit: 50,
					},
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
										attributes: { title: 'Сохранить изменения' },
									},
									{
										id: 'undo',
										className: 'fas fa-undo',
										command: 'core:undo',
										attributes: { title: 'Отменить' },
									},
									{
										id: 'redo',
										className: 'fas fa-repeat',
										command: 'core:redo',
										attributes: { title: 'Повторить' },
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
										attributes: { title: 'Стили' },
										active: true,
									},
									{
										id: 'open-layers',
										className: 'fas fa-bars',
										command: 'open-layer-manager',
										attributes: { title: 'Слои' },
									},
									{
										id: 'open-blocks',
										className: 'fas fa-th-large',
										command: 'open-block-manager',
										attributes: { title: 'Блоки' },
									},
								],
							},
						],
					},
					assetManager: {
						assets: images || [],
						upload: `http://localhost:3000/sites/${siteName}/upload-image`,
						uploadName: 'image',
						embedAsBase64: false, // Отключаем встраивание base64 в html
						autoAdd: true, // Автоматически добавляем изображения в ассеты
						dropzone: true,
						dropzoneContent:
							'Перетащите изображения сюда или нажмите для загрузки',
						// Обработчик добавления ассета
						handleAdd: (asset: GrapesAsset) => {
							const src = asset.get('src')

							// Если это base64 изображение, обрабатываем его
							if (
								src &&
								typeof src === 'string' &&
								src.startsWith('data:image/')
							) {
								console.log('Обнаружен base64 ассет, обрабатываем...')

								// Определяем тип изображения и имя файла
								const timestamp = Date.now()
								const extension = src.includes('svg+xml')
									? 'svg'
									: src.includes('jpeg') || src.includes('jpg')
									? 'jpg'
									: src.includes('png')
									? 'png'
									: src.includes('gif')
									? 'gif'
									: 'png'

								const fileName = `asset_${timestamp}.${extension}`

								// Загружаем на сервер
								uploadBase64Image(src, fileName)
									.then(fileUrl => {
										// Обновляем ассет
										asset.set('src', fileUrl)
										console.log('Ассет обновлен:', fileUrl)
									})
									.catch(error => {
										console.error('Ошибка обработки base64 ассета:', error)
									})
							}

							return asset
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
					},
				})

				// Настройка обработки изображений согласно документации GrapesJS
				editor.on('asset:upload:start', () => {
					console.log('Загрузка изображения началась')
				})

				editor.on('asset:upload:end', response => {
					console.log('Изображение успешно загружено', response)
				})

				editor.on('asset:upload:error', error => {
					console.error('Ошибка загрузки изображения', error)
				})

				// Когда страница загружена, проверяем все компоненты на наличие base64
				editor.on('load', () => {
					console.log('Редактор загружен, проверяем изображения...')
					setTimeout(() => processAllComponents(editor), 1000)
				})

				// При добавлении нового компонента проверяем на наличие base64
				editor.on('component:add', (component: GrapesComponent) => {
					console.log('Добавлен новый компонент, проверяем...')
					processComponentWithBase64(editor, component)
				})

				// При обновлении компонента проверяем на base64
				editor.on('component:update', (component: GrapesComponent) => {
					if (component.get('type') === 'image') {
						const src = component.get('src')
						if (
							src &&
							typeof src === 'string' &&
							src.startsWith('data:image/')
						) {
							console.log('Изображение обновлено на base64, обрабатываем...')
							processComponentWithBase64(editor, component)
						}
					}
				})

				// При выборе ассета из Asset Manager
				editor.on('asset:selected', (asset: GrapesAsset) => {
					const selected = editor.getSelected()
					if (selected && selected.get('type') === 'image') {
						const src = asset.get('src')
						console.log('Выбран ассет, устанавливаем источник:', src)
						selected.set('src', src)
					}
				})

				// Следим за DOM для обнаружения base64 изображений
				editor.on('canvas:load', () => {
					const frame = editor.Canvas.getFrameEl()
					if (frame && frame.contentDocument) {
						// Создаем наблюдатель за DOM-изменениями
						const observer = new MutationObserver(mutations => {
							// Проверяем изменения в DOM
							mutations.forEach(mutation => {
								if (
									mutation.type === 'attributes' &&
									mutation.attributeName === 'src' &&
									mutation.target instanceof HTMLImageElement
								) {
									const img = mutation.target
									const src = img.getAttribute('src')

									if (src && src.startsWith('data:image/')) {
										console.log('Обнаружено изменение src в DOM на base64')
										// Обрабатываем все компоненты
										processAllComponents(editor)
									}
								}
							})
						})

						// Настраиваем и запускаем наблюдатель
						observer.observe(frame.contentDocument, {
							attributes: true,
							childList: true,
							subtree: true,
							attributeFilter: ['src'],
						})
					}
				})

				// Простая команда сохранения
				editor.Commands.add('save-command', {
					run: () => {
						console.log('Сохраняем страницу...')

						// Проверяем все компоненты на наличие base64 перед сохранением
						const components = editor.DomComponents.getComponents()
						let hasBase64 = false

						// Рекурсивно проверяем компоненты на наличие base64
						const checkComponentForBase64 = (component: GrapesComponent) => {
							if (component.get('type') === 'image') {
								const src = component.get('src')
								if (
									src &&
									typeof src === 'string' &&
									src.startsWith('data:image/')
								) {
									hasBase64 = true
									console.warn(
										'Найдено неконвертированное base64 изображение при сохранении'
									)
								}
							}

							// Проверяем дочерние компоненты
							const children = component.get('components')
							if (children && children.length) {
								children.forEach((child: GrapesComponent) =>
									checkComponentForBase64(child)
								)
							}
						}

						// Проверяем все корневые компоненты
						components.forEach((component: GrapesComponent) =>
							checkComponentForBase64(component)
						)

						if (hasBase64) {
							// Если найдены base64, показываем предупреждение
							alert(
								'Обнаружены неконвертированные изображения. Подождите несколько секунд и попробуйте сохранить снова.'
							)
							return false
						}

						// Получаем HTML и CSS из редактора
						const html = editor.getHtml()
						const css = editor.getCss()

						// Отправляем на сервер
						axios
							.post(`http://localhost:3000/sites/${siteName}/update`, {
								html: html,
								cssFiles: siteFiles.cssFiles.map((file: CssFile) => ({
									path: file.path,
									content: css,
								})),
							})
							.then(() => {
								console.log('Страница успешно сохранена')
								alert('Изменения сохранены!')
							})
							.catch(err => {
								console.error('Ошибка сохранения:', err)
								alert('Ошибка при сохранении. См. консоль.')
							})

						return false
					},
				})

				// Перегружаем компонент изображения для лучшей работы с base64
				editor.DomComponents.addType('image', {
					isComponent: el => el.tagName === 'IMG',
					model: {
						defaults: {
							tagName: 'img',
							draggable: true,
							droppable: false,
							resizable: {
								tl: true, // top-left
								tr: true, // top-right
								bl: true, // bottom-left
								br: true, // bottom-right
							},
							style: {
								'max-width': '100%',
							},
							attributes: {
								alt: 'Image',
							},
						},
						init() {
							// Инициализация модели
							this.on('change:src', this.handleSrcChange)
						},
						handleSrcChange() {
							// Обрабатываем изменение src атрибута
							const src = this.get('src')
							if (src && typeof src === 'string') {
								// Если это base64, обрабатываем его через общий механизм
								if (src.startsWith('data:image/')) {
									console.log('Обнаружено изменение src на base64')
									processComponentWithBase64(editor, this)
								}
							}
						},
					},
					view: {
						events: {
							dblclick: 'onDblClick',
							click: 'onClick',
						},
						onDblClick() {
							// Открываем Asset Manager для выбора другого изображения
							editor.runCommand('open-assets')
						},
						onClick() {
							// Выбираем компонент
							const model = this.model
							editor.select(model)
						},
						render() {
							// Вызываем стандартный рендеринг
							const result = (this as any)._clbObj?.render?.() || this

							// Добавляем обработчики для img элемента
							const img = this.el.querySelector('img')
							if (img) {
								img.onerror = () => {
									console.error('Ошибка загрузки изображения:', img.src)
								}

								img.onload = () => {
									console.log('Изображение успешно загружено:', img.src)
								}
							}

							return result
						},
					},
				})

				// Функция для обработки base64 изображений в компонентах
				const processComponentWithBase64 = async (
					editor: GrapesEditor,
					component: GrapesComponent
				) => {
					if (!component) return

					// Проверяем, является ли компонент изображением
					if (component.get('type') === 'image') {
						const src = component.get('src')

						// Проверяем, является ли src base64 строкой
						if (
							src &&
							typeof src === 'string' &&
							src.startsWith('data:image/')
						) {
							console.log(
								'Найдено base64 изображение:',
								src.substring(0, 40) + '...'
							)

							try {
								// Определяем тип изображения и генерируем имя файла
								const timestamp = Date.now()
								const random = Math.floor(Math.random() * 10000)
								const extension = src.includes('svg+xml')
									? 'svg'
									: src.includes('jpeg') || src.includes('jpg')
									? 'jpg'
									: src.includes('png')
									? 'png'
									: src.includes('gif')
									? 'gif'
									: 'png'

								const fileName = `img_${timestamp}_${random}.${extension}`

								// Загружаем base64 на сервер
								const fileUrl = await uploadBase64Image(src, fileName)

								// Обновляем компонент, заменяя base64 на URL
								component.set('src', fileUrl)
								console.log('Изображение обновлено:', fileUrl)

								// Добавляем изображение в AssetManager
								editor.AssetManager.add({
									src: fileUrl,
									name: fileName,
									type: 'image',
								})
							} catch (error) {
								console.error('Ошибка обработки base64 изображения:', error)
							}
						}
					}

					// Рекурсивно проверяем дочерние компоненты
					const children = component.get('components')
					if (children && children.length) {
						for (let i = 0; i < children.length; i++) {
							await processComponentWithBase64(editor, children.models[i])
						}
					}
				}

				// Проверяем все компоненты на наличие base64 изображений
				const processAllComponents = async (editor: GrapesEditor) => {
					const components = editor.DomComponents.getComponents()
					for (let i = 0; i < components.length; i++) {
						await processComponentWithBase64(editor, components.models[i])
					}
				}

				// Сохраняем ссылку на редактор
				editorRef.current = editor
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

		// Вызываем команду сохранения из редактора
		editorRef.current.runCommand('save-command')
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
