// why use .cjs instead of .js? see this article https://segmentfault.com/q/1010000042298464

module.exports = {
	// 一行最多 80 字符
	printWidth: 80,
	// 使用 4 個空格縮進
	tabWidth: 2,
	// 不使用 tab 縮進，而使用空格
	useTabs: false,
	// 行尾需要有分號
	semi: false,
	// 使用單引號代替雙引號
	singleQuote: true,
	// 對象的 key 僅在必要時用引號
	quoteProps: 'as-needed',
	// 末尾使用逗號
	trailingComma: 'none',
	// 大括號內的首尾需要空格 { foo: bar }
	bracketSpacing: true,
	// 箭頭函數，只有一個參數的時候，也需要括號
	arrowParens: 'always',
	// 每個文件格式化的範圍是文件的全部內容
	rangeStart: 0,
	rangeEnd: Infinity,
	// 不需要寫文件開頭的 @prettier
	requirePragma: false,
	// 不需要自動在文件開頭插入 @prettier
	insertPragma: false,
	// 使用默認的折行標準
	proseWrap: 'preserve',
	// 根據顯示樣式決定 html 要不要折行
	htmlWhitespaceSensitivity: 'css',
	// 換行符使用 lf
	endOfLine: 'auto'
}