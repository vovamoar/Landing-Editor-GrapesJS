const express = require('express')
const cors = require('cors')
const multer = require('multer')
const fs = require('fs')
const path = require('path')
const axios = require('axios')
const mime = require('mime-types')

const app = express()
const port = 3000

// Настройка CORS
app.use(
	cors({
		origin: '*',
		methods: ['GET', 'POST', 'PUT', 'DELETE'],
		allowedHeaders: ['Content-Type', 'Authorization'],
	})
)

// Настройка Multer для загрузки изображений
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		const { siteName } = req.params
		const sitePath = path.join(__dirname, 'sites', siteName)
		const uploadDir = path.join(sitePath, 'images')

		if (!fs.existsSync(uploadDir)) {
			fs.mkdirSync(uploadDir, { recursive: true })
		}
		cb(null, uploadDir)
	},
	filename: function (req, file, cb) {
		const fileName = file.originalname
			.toLowerCase()
			.replace(/\s+/g, '-')
			.replace(/[^\w.-]+/g, '')
		cb(null, fileName)
	},
})
const upload = multer({ storage })

// Путь к папке с сайтами
const sitesDir = path.join(__dirname, 'sites')

// Middleware для предоставления статических файлов (CSS, JS, изображения) с правильными MIME-типами
app.use('/sites', express.static(path.join(__dirname, 'sites')))

// Дополнительный middleware для обработки путей к файлам
app.use('/sites', (req, res, next) => {
	const filePath = path.join(__dirname, 'sites', req.path)
	console.log(`Запрос статического файла: ${filePath}`)

	if (filePath.match(/\.(jpg|jpeg|png|gif|webp|svg|ico)$/i)) {
		res.setHeader('Access-Control-Allow-Origin', '*')
		res.setHeader('Cache-Control', 'public, max-age=3600')

		// Проверяем существование файла
		if (fs.existsSync(filePath)) {
			console.log(`Статический файл найден: ${filePath}`)
			const mimeType = mime.lookup(filePath) || 'image/jpeg'
			res.setHeader('Content-Type', mimeType)
		} else {
			console.log(`Статический файл НЕ найден: ${filePath}`)
		}
	}
	next()
})

// Функция для рекурсивного поиска файлов по расширению
const findFilesByExtension = (dir, extension) => {
	let results = []
	const files = fs.readdirSync(dir, { withFileTypes: true })
	for (const file of files) {
		const filePath = path.join(dir, file.name)
		if (file.isDirectory()) {
			results = results.concat(findFilesByExtension(filePath, extension))
		} else if (file.name.endsWith(extension)) {
			results.push({
				path: filePath,
				relativePath: path.relative(sitesDir, filePath),
				content: fs.readFileSync(filePath, 'utf8'),
			})
		}
	}
	return results
}

// Улучшенная функция для извлечения base64-изображений
const extractAndSaveBase64Images = (html, siteName) => {
	let updatedHtml = html
	let match
	// Более точное регулярное выражение для поиска base64 в различных форматах
	const regex = /src=["'](data:image\/[a-z]+;base64,[^"']*)["']/gi
	let imageIndex = 0
	const savedImages = []

	console.log('Начинаем обработку base64 изображений для сайта:', siteName)

	// Обрабатываем все совпадения
	while ((match = regex.exec(html)) !== null) {
		try {
			const fullMatch = match[0]
			const base64Data = match[1]

			console.log('Найдено base64 изображение, длина:', base64Data.length)

			// Определяем формат из данных base64
			const formatMatch = base64Data.match(/^data:image\/([a-z]+);base64,/i)
			if (!formatMatch) {
				console.log('Неверный формат base64 данных, пропускаем')
				continue
			}

			const format = formatMatch[1]
			console.log('Формат изображения:', format)

			const base64Content = base64Data.replace(
				/^data:image\/[a-z]+;base64,/i,
				''
			)

			// Проверяем длину base64 данных
			if (base64Content.length < 100) {
				console.log(
					'Слишком короткая строка base64, возможно некорректные данные, пропускаем'
				)
				continue
			}

			// Создаём имя файла с меткой времени и индексом
			const timestamp = Date.now()
			const filename = `image_${timestamp}_${imageIndex}.${format}`
			const imageDir = path.join(sitesDir, siteName, 'images')

			// Создаём папку, если она не существует
			if (!fs.existsSync(imageDir)) {
				fs.mkdirSync(imageDir, { recursive: true })
			}

			const imagePath = path.join(imageDir, filename)

			try {
				// Конвертируем base64 в бинарные данные и сохраняем
				const imageBuffer = Buffer.from(base64Content, 'base64')

				// Проверяем, что данные не пустые
				if (imageBuffer.length === 0) {
					console.log('Пустые данные изображения, пропускаем')
					continue
				}

				fs.writeFileSync(imagePath, imageBuffer)

				// Заменяем base64 на путь к файлу
				const imageUrl = `/sites/${siteName}/images/${filename}`
				updatedHtml = updatedHtml.replace(fullMatch, `src="${imageUrl}"`)
				console.log(
					`Base64 изображение сохранено: ${imageUrl}, размер: ${imageBuffer.length} байт`
				)

				savedImages.push({
					src: imageUrl,
					name: filename,
					type: 'image',
				})

				imageIndex++
			} catch (bufferErr) {
				console.error('Ошибка при обработке буфера изображения:', bufferErr)
			}
		} catch (err) {
			console.error('Ошибка при обработке base64 изображения:', err)
		}
	}

	// Дополнительный поиск по другому паттерну (для случаев с одинарными кавычками или другими вариациями)
	const altRegex =
		/style=["'][^"']*background(-image)?:\s*url\(['"]?(data:image\/[^)"']+)['"]?\)[^"']*["']/gi

	while ((match = altRegex.exec(html)) !== null) {
		try {
			const fullMatch = match[0]
			const base64Data = match[2]

			console.log(
				'Найдено base64 изображение в стиле, длина:',
				base64Data.length
			)

			// Дальше обработка аналогична предыдущему блоку...
			const formatMatch = base64Data.match(/^data:image\/([a-z]+);base64,/i)
			if (!formatMatch) continue

			const format = formatMatch[1]
			const base64Content = base64Data.replace(
				/^data:image\/[a-z]+;base64,/i,
				''
			)

			const timestamp = Date.now()
			const filename = `style_image_${timestamp}_${imageIndex}.${format}`
			const imageDir = path.join(sitesDir, siteName, 'images')

			if (!fs.existsSync(imageDir)) {
				fs.mkdirSync(imageDir, { recursive: true })
			}

			const imagePath = path.join(imageDir, filename)
			const imageBuffer = Buffer.from(base64Content, 'base64')
			fs.writeFileSync(imagePath, imageBuffer)

			const imageUrl = `/sites/${siteName}/images/${filename}`
			updatedHtml = updatedHtml.replace(base64Data, imageUrl)
			console.log(`Base64 изображение из стиля сохранено: ${imageUrl}`)

			savedImages.push({
				src: imageUrl,
				name: filename,
				type: 'image',
			})

			imageIndex++
		} catch (err) {
			console.error('Ошибка при обработке base64 из стилей:', err)
		}
	}

	console.log(
		`Обработка base64 завершена, сохранено ${savedImages.length} изображений`
	)

	return {
		html: updatedHtml,
		images: savedImages,
	}
}

// Получение списка сайтов
app.get('/sites', (req, res) => {
	fs.readdir(sitesDir, (err, siteFolders) => {
		if (err) {
			return res.status(500).json({ error: 'Не удалось загрузить сайты' })
		}
		const sites = siteFolders.map(folder => ({ name: folder }))
		res.json(sites)
	})
})

// Предпросмотр сайта
app.get('/sites/:siteName/preview', async (req, res) => {
	const siteName = req.params.siteName
	const sitePath = path.join(sitesDir, siteName)

	// Проверяем, есть ли index.html или index.php
	let indexFilePath = path.join(sitePath, 'index.html')
	let fileType = 'html'
	if (!fs.existsSync(indexFilePath)) {
		indexFilePath = path.join(sitePath, 'index.php')
		fileType = 'php'
		if (!fs.existsSync(indexFilePath)) {
			return res.status(404).send('Файл index не найден')
		}
	}

	if (fileType === 'php') {
		try {
			const phpServerUrl = `http://localhost:8000/${siteName}/index.php`
			const response = await axios.get(phpServerUrl)
			let content = response.data

			// Обрабатываем base64-изображения
			const result = extractAndSaveBase64Images(content, siteName)

			// Исправляем пути к CSS, JS и изображениям
			content = result.html.replace(
				/(href|src)="([^"]*)"/g,
				(match, attr, path) => {
					if (path.startsWith('http') || path.startsWith('/')) return match
					console.log(
						`Преобразование пути: ${path} -> /sites/${siteName}/${path}`
					) // Отладочный лог
					return `${attr}="/sites/${siteName}/${path}"`
				}
			)

			// Находим все CSS-файлы в папке сайта
			const cssFiles = findFilesByExtension(sitePath, '.css')
			const cssContent = cssFiles.map(file => file.content).join('\n')

			const previewHtml = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>${siteName} Preview</title>
                    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
                    <style>${cssContent}</style>
                    <base href="/sites/${siteName}/" />
                </head>
                <body>
                    ${content}
                </body>
                </html>
            `
			res.send(previewHtml)
		} catch (err) {
			console.error('Ошибка при запросе к PHP-серверу:', err.message)
			res
				.status(500)
				.send(
					'Ошибка при выполнении PHP. Убедитесь, что PHP-сервер запущен на localhost:8000.'
				)
		}
	} else {
		let html = fs.readFileSync(indexFilePath, 'utf8')

		// Обрабатываем base64-изображения
		const result = extractAndSaveBase64Images(html, siteName)

		const cssFiles = findFilesByExtension(sitePath, '.css')
		const css = cssFiles.map(file => file.content).join('\n')

		// Исправляем пути к изображениям в HTML
		const processedHtml = result.html.replace(
			/(href|src)="([^"]*)"/g,
			(match, attr, path) => {
				if (path.startsWith('http') || path.startsWith('/')) return match
				console.log(
					`Преобразование пути: ${path} -> /sites/${siteName}/${path}`
				) // Отладочный лог
				return `${attr}="/sites/${siteName}/${path}"`
			}
		)

		const previewHtml = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${siteName} Preview</title>
                <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
                <style>${css}</style>
                <base href="/sites/${siteName}/" />
            </head>
            <body>
                ${processedHtml}
            </body>
            </html>
        `
		res.send(previewHtml)
	}
})

// Получение данных сайта для редактирования
app.get('/sites/:siteName/edit', async (req, res) => {
	const siteName = req.params.siteName
	const sitePath = path.join(sitesDir, siteName)
	const indexPath = path.join(sitePath, 'index.html')
	const cssDir = path.join(sitePath, 'css')
	const imagesDir = path.join(sitePath, 'images')

	// Проверка существования сайта
	if (!fs.existsSync(sitePath) || !fs.existsSync(indexPath)) {
		return res.status(404).json({ error: 'Сайт не найден' })
	}

	// Чтение HTML
	const html = fs.readFileSync(indexPath, 'utf-8')

	// Чтение CSS файлов
	let cssFiles = []
	if (fs.existsSync(cssDir)) {
		cssFiles = fs
			.readdirSync(cssDir)
			.filter(file => file.endsWith('.css'))
			.map(file => {
				const filePath = path.join(cssDir, file)
				return {
					path: `css/${file}`,
					content: fs.readFileSync(filePath, 'utf-8'),
				}
			})
	}

	// Собираем информацию об изображениях
	let images = []
	if (fs.existsSync(imagesDir)) {
		images = fs
			.readdirSync(imagesDir)
			.filter(file => {
				const ext = path.extname(file).toLowerCase()
				return ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'].includes(ext)
			})
			.map(file => {
				return {
					type: 'image',
					name: file,
					src: `/sites/${siteName}/images/${file}`,
				}
			})
	}

	res.json({ html, cssFiles, images })
})

// Обновляем обработчик для обновления сайта
app.post('/sites/:siteName/update', express.json(), (req, res) => {
	const { siteName } = req.params
	const { html, cssFiles } = req.body
	const sitePath = path.join(sitesDir, siteName)
	const indexPath = path.join(sitePath, 'index.html')

	// Проверка существования сайта
	if (!fs.existsSync(sitePath)) {
		return res.status(404).json({ error: 'Сайт не найден' })
	}

	// Сохранение HTML
	fs.writeFileSync(indexPath, html)

	// Сохранение CSS файлов
	if (cssFiles && cssFiles.length > 0) {
		const cssDir = path.join(sitePath, 'css')
		if (!fs.existsSync(cssDir)) {
			fs.mkdirSync(cssDir, { recursive: true })
		}

		cssFiles.forEach(file => {
			const filePath = path.join(sitePath, file.path)
			fs.writeFileSync(filePath, file.content)
		})
	}

	res.json({ success: true })
})

// Эндпоинт для загрузки изображений
app.post(
	'/sites/:siteName/upload-image',
	upload.single('image'),
	(req, res) => {
		try {
			const { siteName } = req.params
			const file = req.file

			if (!file) {
				return res.status(400).json({ error: 'Файл не был загружен' })
			}

			const imageUrl = `/sites/${siteName}/images/${file.filename}`
			res.json({
				url: imageUrl,
				name: file.filename,
				type: 'image',
			})
		} catch (err) {
			console.error('Ошибка при загрузке изображения:', err)
			res.status(500).json({ error: 'Ошибка при загрузке изображения' })
		}
	}
)

// Добавляем эндпоинт для обработки base64 изображений
app.post('/sites/:siteName/upload-base64', async (req, res) => {
	try {
		const { siteName } = req.params
		const { base64, name } = req.body

		if (!base64 || !name) {
			return res
				.status(400)
				.json({ error: 'Отсутствуют обязательные параметры' })
		}

		// Создаем директорию для изображений, если она не существует
		const imagesDir = path.join(__dirname, 'sites', siteName, 'images')
		if (!fs.existsSync(imagesDir)) {
			fs.mkdirSync(imagesDir, { recursive: true })
		}

		// Проверяем формат base64
		let base64Data
		if (base64.startsWith('data:')) {
			// Удаляем префикс data:image/...;base64,
			base64Data = base64.split(',')[1]
		} else {
			base64Data = base64
		}

		// Сохраняем файл
		const filePath = path.join(imagesDir, name)
		fs.writeFileSync(filePath, base64Data, 'base64')

		// Генерируем URL с временной меткой для избежания кэширования
		const timestamp = Date.now()
		const fileUrl = `/sites/${siteName}/images/${name}?t=${timestamp}`

		console.log(`Base64 изображение успешно сохранено как ${filePath}`)
		return res.json({ url: fileUrl })
	} catch (error) {
		console.error('Ошибка при обработке base64 изображения:', error)
		return res.status(500).json({ error: 'Ошибка при обработке изображения' })
	}
})

app.listen(port, () => {
	console.log(`Сервер запущен на порту ${port}`)
})
