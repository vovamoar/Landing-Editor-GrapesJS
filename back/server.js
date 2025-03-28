// const express = require('express')
// const cors = require('cors')
// const fs = require('fs')
// const path = require('path')
// const multer = require('multer')

// const app = express()
// app.use(cors())
// app.use(express.json())

// // Настраиваем статическую папку для доступа к изображениям каждого сайта
// app.use('/sites', express.static(path.join(__dirname, 'sites')))

// const sitesDir = path.join(__dirname, 'sites')

// // Настройка multer для загрузки файлов
// const storage = multer.diskStorage({
// 	destination: (req, file, cb) => {
// 		const siteName = req.params.siteName
// 		const uploadDir = path.join(sitesDir, siteName, 'images')
// 		if (!fs.existsSync(uploadDir)) {
// 			fs.mkdirSync(uploadDir, { recursive: true })
// 		}
// 		cb(null, uploadDir)
// 	},
// 	filename: (req, file, cb) => {
// 		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
// 		cb(null, uniqueSuffix + path.extname(file.originalname))
// 	},
// })

// const fileFilter = (req, file, cb) => {
// 	const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
// 	if (allowedTypes.includes(file.mimetype)) {
// 		cb(null, true)
// 	} else {
// 		cb(new Error('Только изображения (JPEG, PNG, GIF, WEBP) разрешены!'), false)
// 	}
// }

// const upload = multer({ storage, fileFilter })

// // Получить список всех сайтов
// app.get('/sites', (req, res) => {
// 	fs.readdir(sitesDir, (err, folders) => {
// 		if (err) return res.status(500).json({ error: 'Ошибка чтения папки' })
// 		const sites = folders.map(folder => ({ name: folder }))
// 		res.json(sites)
// 	})
// })

// // Получить файлы сайта для предпросмотра
// app.get('/sites/:siteName/preview', (req, res) => {
// 	const siteName = req.params.siteName
// 	const sitePath = path.join(sitesDir, siteName)

// 	if (!fs.existsSync(sitePath)) {
// 		return res.status(404).json({ error: 'Сайт не найден' })
// 	}

// 	const indexPath = path.join(sitePath, 'index.php')
// 	let html = fs.readFileSync(indexPath, 'utf-8')

// 	const cssPath = path.join(sitePath, 'css', 'styles.css')
// 	let css = ''
// 	if (fs.existsSync(cssPath)) {
// 		css = fs.readFileSync(cssPath, 'utf-8')
// 	}

// 	const jsPath = path.join(sitePath, 'js', 'script.js')
// 	let js = ''
// 	if (fs.existsSync(jsPath)) {
// 		js = fs.readFileSync(jsPath, 'utf-8')
// 	}

// 	html = html.replace(
// 		/src="\/(?:back\/)?sites\/[^\/]+\/images\/([^"]+)"/g,
// 		`src="http://localhost:3000/sites/${siteName}/images/$1"`
// 	)

// 	const previewHtml = `
//     <!DOCTYPE html>
//     <html lang="en">
//     <head>
//       <meta charset="UTF-8">
//       <meta name="viewport" content="width=device-width, initial-scale=1.0">
//       <title>${siteName} Preview</title>
//       <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
//       <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
//       <style>${css}</style>
//     </head>
//     <body>
//       ${html}
//       <script>${js}</script>
//     </body>
//     </html>
//     `

// 	res.send(previewHtml)
// })

// // Получить HTML и CSS для редактирования
// app.get('/sites/:siteName/edit', (req, res) => {
// 	const siteName = req.params.siteName
// 	const sitePath = path.join(sitesDir, siteName)

// 	if (!fs.existsSync(sitePath)) {
// 		return res.status(404).json({ error: 'Сайт не найден' })
// 	}

// 	const indexPath = path.join(sitePath, 'index.php')
// 	let html = fs.readFileSync(indexPath, 'utf-8')

// 	// Исправляем пути к изображениям в HTML
// 	html = html.replace(
// 		/src="\/(?:back\/)?sites\/[^\/]+\/images\/([^"]+)"/g,
// 		`src="http://localhost:3000/sites/${siteName}/images/$1"`
// 	)

// 	const cssPath = path.join(sitePath, 'css', 'styles.css')
// 	let css = ''
// 	if (fs.existsSync(cssPath)) {
// 		css = fs.readFileSync(cssPath, 'utf-8')
// 	}

// 	const imagesDir = path.join(sitePath, 'images')
// 	let images = []
// 	if (fs.existsSync(imagesDir)) {
// 		images = fs.readdirSync(imagesDir).map(file => ({
// 			src: `http://localhost:3000/sites/${siteName}/images/${file}`,
// 			name: file,
// 		}))
// 	}

// 	res.json({ html, css, images })
// })

// // Обновить файлы сайта после редактирования
// app.post('/sites/:siteName/update', (req, res) => {
// 	const siteName = req.params.siteName
// 	const sitePath = path.join(sitesDir, siteName)
// 	const { html, css } = req.body

// 	if (!fs.existsSync(sitePath)) {
// 		return res.status(404).json({ error: 'Сайт не найден' })
// 	}

// 	try {
// 		const indexPath = path.join(sitePath, 'index.php')
// 		fs.writeFileSync(indexPath, html)

// 		const cssPath = path.join(sitePath, 'css', 'styles.css')
// 		fs.writeFileSync(cssPath, css)

// 		console.log(`Сайт ${siteName} успешно обновлён`)
// 		res.json({ message: 'Сайт обновлён' })
// 	} catch (err) {
// 		console.error('Ошибка при обновлении сайта:', err)
// 		res.status(500).json({ error: 'Ошибка при обновлении сайта' })
// 	}
// })

// // Эндпоинт для загрузки изображений
// app.post(
// 	'/sites/:siteName/upload-image',
// 	upload.single('image'),
// 	(req, res) => {
// 		if (!req.file) {
// 			return res.status(400).json({ error: 'Файл не загружен' })
// 		}

// 		const siteName = req.params.siteName
// 		const imageUrl = `http://localhost:3000/sites/${siteName}/images/${req.file.filename}`
// 		console.log(`Изображение загружено для сайта ${siteName}: ${imageUrl}`)
// 		res.json({ url: imageUrl })
// 	}
// )

// app.listen(3000, () => {
// 	console.log('Бэкенд запущен на http://localhost:3000')
// })

///////////////////////////////////////////////////////////////////////

// const express = require('express')
// const cors = require('cors')
// const multer = require('multer')
// const fs = require('fs')
// const path = require('path')
// const axios = require('axios')
// const mime = require('mime-types')

// const app = express()
// const port = 3000

// // Настройка CORS
// app.use(cors())

// // Настройка Multer для загрузки изображений
// const storage = multer.diskStorage({
// 	destination: (req, file, cb) => {
// 		const siteName = req.params.siteName
// 		const uploadPath = path.join(__dirname, 'sites', siteName, 'images')
// 		fs.mkdirSync(uploadPath, { recursive: true })
// 		cb(null, uploadPath)
// 	},
// 	filename: (req, file, cb) => {
// 		cb(null, file.originalname)
// 	},
// })
// const upload = multer({ storage })

// // Путь к папке с сайтами
// const sitesDir = path.join(__dirname, 'sites')

// // Middleware для предоставления статических файлов (CSS, JS, изображения) с правильными MIME-типами
// app.use('/sites/:siteName', (req, res, next) => {
// 	const filePath = path.join(__dirname, 'sites', req.params.siteName, req.path)
// 	if (fs.existsSync(filePath)) {
// 		const mimeType = mime.lookup(filePath)
// 		if (mimeType) {
// 			res.setHeader('Content-Type', mimeType)
// 		}
// 	}
// 	express.static(path.join(__dirname, 'sites'))(req, res, next)
// })

// // Функция для рекурсивного поиска файлов по расширению
// const findFilesByExtension = (dir, extension) => {
// 	let results = []
// 	const files = fs.readdirSync(dir, { withFileTypes: true })
// 	for (const file of files) {
// 		const filePath = path.join(dir, file.name)
// 		if (file.isDirectory()) {
// 			results = results.concat(findFilesByExtension(filePath, extension))
// 		} else if (file.name.endsWith(extension)) {
// 			results.push({
// 				path: filePath,
// 				relativePath: path.relative(sitesDir, filePath),
// 				content: fs.readFileSync(filePath, 'utf8'),
// 			})
// 		}
// 	}
// 	return results
// }

// // Получение списка сайтов
// app.get('/sites', (req, res) => {
// 	fs.readdir(sitesDir, (err, siteFolders) => {
// 		if (err) {
// 			return res.status(500).json({ error: 'Не удалось загрузить сайты' })
// 		}
// 		const sites = siteFolders.map(folder => ({ name: folder }))
// 		res.json(sites)
// 	})
// })

// // Предпросмотр сайта
// app.get('/sites/:siteName/preview', async (req, res) => {
// 	const siteName = req.params.siteName
// 	const sitePath = path.join(sitesDir, siteName)

// 	// Проверяем, есть ли index.html или index.php
// 	let indexFilePath = path.join(sitePath, 'index.html')
// 	let fileType = 'html'
// 	if (!fs.existsSync(indexFilePath)) {
// 		indexFilePath = path.join(sitePath, 'index.php')
// 		fileType = 'php'
// 		if (!fs.existsSync(indexFilePath)) {
// 			return res.status(404).send('Файл index не найден')
// 		}
// 	}

// 	if (fileType === 'php') {
// 		// Проксируем запрос к PHP-серверу
// 		try {
// 			const phpServerUrl = `http://localhost:8000/${siteName}/index.php`
// 			const response = await axios.get(phpServerUrl)
// 			let content = response.data

// 			// Исправляем пути к CSS, JS и изображениям
// 			content = content.replace(
// 				/(href|src)="([^"]*)"/g,
// 				(match, attr, path) => {
// 					if (path.startsWith('http') || path.startsWith('/')) return match
// 					return `${attr}="/sites/${siteName}/${path}"`
// 				}
// 			)

// 			// Находим все CSS-файлы в папке сайта
// 			const cssFiles = findFilesByExtension(sitePath, '.css')
// 			const cssContent = cssFiles.map(file => file.content).join('\n')

// 			// Вставляем CSS напрямую в <style> тег
// 			const previewHtml = `
//         <!DOCTYPE html>
//         <html lang="en">
//         <head>
//           <meta charset="UTF-8">
//           <meta name="viewport" content="width=device-width, initial-scale=1.0">
//           <title>${siteName} Preview</title>
//           <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
//           <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
//           <style>${cssContent}</style>
//         </head>
//         <body>
//           ${content}
//         </body>
//         </html>
//       `

// 			res.send(previewHtml)
// 		} catch (err) {
// 			console.error('Ошибка при запросе к PHP-серверу:', err.message)
// 			res
// 				.status(500)
// 				.send(
// 					'Ошибка при выполнении PHP. Убедитесь, что PHP-сервер запущен на localhost:8000.'
// 				)
// 		}
// 	} else {
// 		// Для index.html используем шаблон
// 		const html = fs.readFileSync(indexFilePath, 'utf8')
// 		const cssFiles = findFilesByExtension(sitePath, '.css')
// 		const css = cssFiles.map(file => file.content).join('\n')

// 		const previewHtml = `
//       <!DOCTYPE html>
//       <html lang="en">
//       <head>
//         <meta charset="UTF-8">
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <title>${siteName} Preview</title>
//         <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
//         <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
//         <style>${css}</style>
//       </head>
//       <body>
//         ${html}
//       </body>
//       </html>
//     `

// 		res.send(previewHtml)
// 	}
// })

// // Получение данных сайта для редактирования
// app.get('/sites/:siteName/edit', async (req, res) => {
// 	const siteName = req.params.siteName
// 	const sitePath = path.join(sitesDir, siteName)

// 	// Проверяем, есть ли index.html или index.php
// 	let indexFilePath = path.join(sitePath, 'index.html')
// 	let fileType = 'html'

// 	if (!fs.existsSync(indexFilePath)) {
// 		indexFilePath = path.join(sitePath, 'index.php')
// 		fileType = 'php'
// 		if (!fs.existsSync(indexFilePath)) {
// 			return res.status(404).json({ error: 'Файл index не найден' })
// 		}
// 	}

// 	let htmlContent
// 	if (fileType === 'php') {
// 		// Для PHP-файлов запрашиваем обработанный HTML с PHP-сервера
// 		try {
// 			const phpServerUrl = `http://localhost:8000/${siteName}/index.php`
// 			const response = await axios.get(phpServerUrl)
// 			htmlContent = response.data
// 		} catch (err) {
// 			console.error('Ошибка при запросе к PHP-серверу:', err.message)
// 			return res.status(500).json({ error: 'Не удалось обработать PHP-файл' })
// 		}
// 	} else {
// 		// Для HTML просто читаем файл
// 		htmlContent = fs.readFileSync(indexFilePath, 'utf8')
// 	}

// 	// Исправляем пути к CSS и изображениям
// 	htmlContent = htmlContent.replace(
// 		/(href|src)="([^"]*)"/g,
// 		(match, attr, path) => {
// 			if (path.startsWith('http') || path.startsWith('/')) return match
// 			return `${attr}="/sites/${siteName}/${path}"`
// 		}
// 	)

// 	// Находим все CSS-файлы
// 	const cssFiles = findFilesByExtension(sitePath, '.css')

// 	// Читаем изображения
// 	const imagesPath = path.join(sitePath, 'images')
// 	let images = []
// 	if (fs.existsSync(imagesPath)) {
// 		images = fs.readdirSync(imagesPath).map(file => ({
// 			src: `/sites/${siteName}/images/${file}`,
// 			name: file,
// 			type: 'image',
// 		}))
// 	} else {
// 		const allImages = findFilesByExtension(sitePath, '.jpg')
// 			.concat(findFilesByExtension(sitePath, '.png'))
// 			.concat(findFilesByExtension(sitePath, '.jpeg'))
// 			.concat(findFilesByExtension(sitePath, '.gif'))
// 			.concat(findFilesByExtension(sitePath, '.ico'))
// 			.concat(findFilesByExtension(sitePath, '.webp'))
// 		images = allImages.map(file => ({
// 			src: `/sites/${siteName}/${file.relativePath}`,
// 			name: path.basename(file.path),
// 			type: 'image',
// 		}))
// 	}

// 	res.json({
// 		html: htmlContent,
// 		cssFiles: cssFiles.map(file => ({
// 			path: file.relativePath,
// 			content: file.content,
// 		})),
// 		images,
// 	})
// })

// // Обновление сайта
// app.post('/sites/:siteName/update', express.json(), (req, res) => {
// 	const siteName = req.params.siteName
// 	const sitePath = path.join(sitesDir, siteName)
// 	const { html, cssFiles } = req.body

// 	// Определяем, какой файл обновлять (index.html или index.php)
// 	let indexFilePath = path.join(sitePath, 'index.html')
// 	if (!fs.existsSync(indexFilePath)) {
// 		indexFilePath = path.join(sitePath, 'index.php')
// 		if (!fs.existsSync(indexFilePath)) {
// 			return res.status(404).json({ error: 'Файл index не найден' })
// 		}
// 	}

// 	// Сохраняем HTML (включая PHP-код, если это PHP-файл)
// 	fs.writeFileSync(indexFilePath, html)

// 	// Сохраняем CSS-файлы
// 	if (cssFiles) {
// 		cssFiles.forEach(file => {
// 			const filePath = path.join(sitesDir, file.path)
// 			fs.mkdirSync(path.dirname(filePath), { recursive: true })
// 			fs.writeFileSync(filePath, file.content)
// 		})
// 	}

// 	res.json({ message: 'Изменения сохранены' })
// })

// // Загрузка изображения
// app.post(
// 	'/sites/:siteName/upload-image',
// 	upload.single('image'),
// 	(req, res) => {
// 		if (!req.file) {
// 			return res.status(400).json({ error: 'Изображение не загружено' })
// 		}
// 		const siteName = req.params.siteName
// 		const imageUrl = `/sites/${siteName}/images/${req.file.filename}`
// 		res.json({ url: imageUrl })
// 	}
// )

// app.listen(port, () => {
// 	console.log(`Сервер запущен на http://localhost:${port}`)
// })

///////////////////////////////////////////////////////////////////

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
app.use('/sites/:siteName', (req, res, next) => {
	const filePath = path.join(__dirname, 'sites', req.params.siteName, req.path)
	console.log(`Запрос к файлу: ${filePath}`) // Добавляем логирование
	if (fs.existsSync(filePath)) {
		const mimeType = mime.lookup(filePath) || 'application/octet-stream'
		res.setHeader('Content-Type', mimeType)
	}
	express.static(path.join(__dirname, 'sites'))(req, res, next)
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
		// Проксируем запрос к PHP-серверу
		try {
			const phpServerUrl = `http://localhost:8000/${siteName}/index.php`
			const response = await axios.get(phpServerUrl)
			let content = response.data

			// Исправляем пути к CSS, JS и изображениям
			content = content.replace(
				/(href|src)="([^"]*)"/g,
				(match, attr, path) => {
					if (path.startsWith('http') || path.startsWith('/')) return match
					return `${attr}="/sites/${siteName}/${path}"`
				}
			)

			// Находим все CSS-файлы в папке сайта
			const cssFiles = findFilesByExtension(sitePath, '.css')
			const cssContent = cssFiles.map(file => file.content).join('\n')

			// Вставляем CSS напрямую в <style> тег
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
		// Для index.html используем шаблон
		const html = fs.readFileSync(indexFilePath, 'utf8')
		const cssFiles = findFilesByExtension(sitePath, '.css')
		const css = cssFiles.map(file => file.content).join('\n')

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
      </head>
      <body>
        ${html}
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
