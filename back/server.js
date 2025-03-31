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
app.use(cors())

// Настройка Multer для загрузки изображений
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		const siteName = req.params.siteName
		const uploadPath = path.join(__dirname, 'sites', siteName, 'images')
		fs.mkdirSync(uploadPath, { recursive: true })
		cb(null, uploadPath)
	},
	filename: (req, file, cb) => {
		cb(null, file.originalname)
	},
})
const upload = multer({ storage })

// Путь к папке с сайтами
const sitesDir = path.join(__dirname, 'sites')

// Middleware для предоставления статических файлов (CSS, JS, изображения) с правильными MIME-типами
app.use('/sites', express.static(path.join(__dirname, 'sites')))

// Дополнительный middleware для обработки путей к файлам
app.use('/sites/:siteName', (req, res, next) => {
	const filePath = path.join(__dirname, 'sites', req.params.siteName, req.path)
	console.log(`Запрос к файлу: ${filePath}`) // Логирование для отладки
	if (fs.existsSync(filePath)) {
		const mimeType = mime.lookup(filePath) || 'application/octet-stream'
		res.setHeader('Content-Type', mimeType)
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

			// Исправляем пути к CSS, JS и изображениям
			content = content.replace(
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
		const html = fs.readFileSync(indexFilePath, 'utf8')
		const cssFiles = findFilesByExtension(sitePath, '.css')
		const css = cssFiles.map(file => file.content).join('\n')

		// Исправляем пути к изображениям в HTML
		const processedHtml = html.replace(
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

	// Проверяем, есть ли index.html или index.php
	let indexFilePath = path.join(sitePath, 'index.html')
	let fileType = 'html'

	if (!fs.existsSync(indexFilePath)) {
		indexFilePath = path.join(sitePath, 'index.php')
		fileType = 'php'
		if (!fs.existsSync(indexFilePath)) {
			return res.status(404).json({ error: 'Файл index не найден' })
		}
	}

	let htmlContent
	if (fileType === 'php') {
		// Для PHP-файлов запрашиваем обработанный HTML с PHP-сервера
		try {
			const phpServerUrl = `http://localhost:8000/${siteName}/index.php`
			const response = await axios.get(phpServerUrl)
			htmlContent = response.data
		} catch (err) {
			console.error('Ошибка при запросе к PHP-серверу:', err.message)
			return res.status(500).json({ error: 'Не удалось обработать PHP-файл' })
		}
	} else {
		// Для HTML просто читаем файл
		htmlContent = fs.readFileSync(indexFilePath, 'utf8')
	}

	// Исправляем пути к CSS и изображениям
	htmlContent = htmlContent.replace(
		/(href|src)="([^"]*)"/g,
		(match, attr, path) => {
			if (path.startsWith('http') || path.startsWith('/')) return match
			return `${attr}="/sites/${siteName}/${path}"`
		}
	)

	// Находим все CSS-файлы
	const cssFiles = findFilesByExtension(sitePath, '.css')

	// Читаем изображения
	const imagesPath = path.join(sitePath, 'images')
	let images = []
	if (fs.existsSync(imagesPath)) {
		images = fs
			.readdirSync(imagesPath)
			.filter(file => {
				const ext = path.extname(file).toLowerCase()
				return ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.ico'].includes(ext)
			})
			.map(file => {
				const imagePath = `/sites/${siteName}/images/${file}`
				console.log(`Found image for Asset Manager: ${imagePath}`) // Логирование для отладки
				return {
					src: imagePath,
					name: file,
					type: 'image',
				}
			})
	} else {
		const allImages = findFilesByExtension(sitePath, '.jpg')
			.concat(findFilesByExtension(sitePath, '.png'))
			.concat(findFilesByExtension(sitePath, '.jpeg'))
			.concat(findFilesByExtension(sitePath, '.gif'))
			.concat(findFilesByExtension(sitePath, '.ico'))
			.concat(findFilesByExtension(sitePath, '.webp'))
		images = allImages.map(file => {
			const imagePath = `/sites/${siteName}/${file.relativePath}`
			console.log(`Found image for Asset Manager: ${imagePath}`) // Логирование для отладки
			return {
				src: imagePath,
				name: path.basename(file.path),
				type: 'image',
			}
		})
	}

	res.json({
		html: htmlContent,
		cssFiles: cssFiles.map(file => ({
			path: file.relativePath,
			content: file.content,
		})),
		images,
	})
})

// Обновление сайта
app.post('/sites/:siteName/update', express.json(), (req, res) => {
	const siteName = req.params.siteName
	const sitePath = path.join(sitesDir, siteName)
	const { html, cssFiles } = req.body

	// Определяем, какой файл обновлять (index.html или index.php)
	let indexFilePath = path.join(sitePath, 'index.html')
	if (!fs.existsSync(indexFilePath)) {
		indexFilePath = path.join(sitePath, 'index.php')
		if (!fs.existsSync(indexFilePath)) {
			return res.status(404).json({ error: 'Файл index не найден' })
		}
	}

	// Сохраняем HTML (включая PHP-код, если это PHP-файл)
	fs.writeFileSync(indexFilePath, html)

	// Сохраняем CSS-файлы
	if (cssFiles) {
		cssFiles.forEach(file => {
			const filePath = path.join(sitesDir, file.path)
			fs.mkdirSync(path.dirname(filePath), { recursive: true })
			fs.writeFileSync(filePath, file.content)
		})
	}

	res.json({ message: 'Изменения сохранены' })
})

// Загрузка изображения
app.post(
	'/sites/:siteName/upload-image',
	upload.single('image'),
	(req, res) => {
		if (!req.file) {
			return res.status(400).json({ error: 'Изображение не загружено' })
		}
		const siteName = req.params.siteName
		const imageUrl = `/sites/${siteName}/images/${req.file.filename}`
		res.json({ url: imageUrl })
	}
)

app.listen(port, () => {
	console.log(`Сервер запущен на http://localhost:${port}`)
})
