const express = require('express')
const cors = require('cors')
const fs = require('fs')
const path = require('path')
const multer = require('multer')

const app = express()
app.use(cors())
app.use(express.json())

// Настраиваем статическую папку для доступа к изображениям каждого сайта
app.use('/sites', express.static(path.join(__dirname, 'sites')))

const sitesDir = path.join(__dirname, 'sites')

// Настройка multer для загрузки файлов
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		const siteName = req.params.siteName
		const uploadDir = path.join(sitesDir, siteName, 'images')
		// Создаём папку, если она не существует
		if (!fs.existsSync(uploadDir)) {
			fs.mkdirSync(uploadDir, { recursive: true })
		}
		cb(null, uploadDir)
	},
	filename: (req, file, cb) => {
		// Генерируем уникальное имя файла
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
		cb(null, uniqueSuffix + path.extname(file.originalname))
	},
})

// Фильтр для проверки типов файлов (разрешаем только изображения)
const fileFilter = (req, file, cb) => {
	const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
	if (allowedTypes.includes(file.mimetype)) {
		cb(null, true)
	} else {
		cb(new Error('Только изображения (JPEG, PNG, GIF, WEBP) разрешены!'), false)
	}
}

const upload = multer({ storage, fileFilter })

// Получить список всех сайтов
app.get('/sites', (req, res) => {
	fs.readdir(sitesDir, (err, folders) => {
		if (err) return res.status(500).json({ error: 'Ошибка чтения папки' })
		const sites = folders.map(folder => ({ name: folder }))
		res.json(sites)
	})
})

// Получить файлы сайта для предпросмотра
app.get('/sites/:siteName/preview', (req, res) => {
	const siteName = req.params.siteName
	const sitePath = path.join(sitesDir, siteName)

	if (!fs.existsSync(sitePath)) {
		return res.status(404).json({ error: 'Сайт не найден' })
	}

	// Читаем index.php (или другой основной файл)
	const indexPath = path.join(sitePath, 'index.php')
	let html = fs.readFileSync(indexPath, 'utf-8')

	// Читаем CSS
	const cssPath = path.join(sitePath, 'css', 'styles.css')
	let css = ''
	if (fs.existsSync(cssPath)) {
		css = fs.readFileSync(cssPath, 'utf-8')
	}

	// Читаем JS
	const jsPath = path.join(sitePath, 'js', 'script.js')
	let js = ''
	if (fs.existsSync(jsPath)) {
		js = fs.readFileSync(jsPath, 'utf-8')
	}

	// Исправляем пути к изображениям в HTML
	html = html.replace(
		/src="\/sites\/[^\/]+\/images\/([^"]+)"/g,
		`src="http://localhost:3000/sites/${siteName}/images/$1"`
	)

	// Формируем HTML-страницу для предпросмотра
	const previewHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${siteName} Preview</title>
      <style>${css}</style>
    </head>
    <body>
      ${html}
      <script>${js}</script>
    </body>
    </html>
  `

	res.send(previewHtml)
})

// Получить HTML и CSS для редактирования
app.get('/sites/:siteName/edit', (req, res) => {
	const siteName = req.params.siteName
	const sitePath = path.join(sitesDir, siteName)

	if (!fs.existsSync(sitePath)) {
		return res.status(404).json({ error: 'Сайт не найден' })
	}

	// Читаем index.php
	const indexPath = path.join(sitePath, 'index.php')
	const html = fs.readFileSync(indexPath, 'utf-8')

	// Читаем CSS
	const cssPath = path.join(sitePath, 'css', 'styles.css')
	let css = ''
	if (fs.existsSync(cssPath)) {
		css = fs.readFileSync(cssPath, 'utf-8')
	}

	// Получаем список изображений из папки images
	const imagesDir = path.join(sitePath, 'images')
	let images = []
	if (fs.existsSync(imagesDir)) {
		images = fs.readdirSync(imagesDir).map(file => ({
			src: `http://localhost:3000/sites/${siteName}/images/${file}`,
			name: file,
		}))
	}

	res.json({ html, css, images })
})

// Обновить файлы сайта после редактирования
app.post('/sites/:siteName/update', (req, res) => {
	const siteName = req.params.siteName
	const sitePath = path.join(sitesDir, siteName)
	const { html, css } = req.body

	if (!fs.existsSync(sitePath)) {
		return res.status(404).json({ error: 'Сайт не найден' })
	}

	try {
		// Обновляем index.php
		const indexPath = path.join(sitePath, 'index.php')
		fs.writeFileSync(indexPath, html)

		// Обновляем CSS
		const cssPath = path.join(sitePath, 'css', 'styles.css')
		fs.writeFileSync(cssPath, css)

		console.log(`Сайт ${siteName} успешно обновлён`)
		res.json({ message: 'Сайт обновлён' })
	} catch (err) {
		console.error('Ошибка при обновлении сайта:', err)
		res.status(500).json({ error: 'Ошибка при обновлении сайта' })
	}
})

// Эндпоинт для загрузки изображений
app.post(
	'/sites/:siteName/upload-image',
	upload.single('image'),
	(req, res) => {
		if (!req.file) {
			return res.status(400).json({ error: 'Файл не загружен' })
		}

		// Формируем URL для загруженного изображения
		const siteName = req.params.siteName
		const imageUrl = `http://localhost:3000/sites/${siteName}/images/${req.file.filename}`
		console.log(`Изображение загружено для сайта ${siteName}: ${imageUrl}`)
		res.json({ url: imageUrl })
	}
)

app.listen(3000, () => {
	console.log('Бэкенд запущен на http://localhost:3000')
})
