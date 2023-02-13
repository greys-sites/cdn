module.exports = (data) => (
	`<img src='/${data.hid}.${data.mime}'>` +
	`<form action="/edit/${data.hid}" method="post" enctype="application/json">` +
		`<label>Image name: <br>` +
			`<input name="name" id="name" type="text" value="${data.name}">` +
		`</label>` +
		`<br>` +
		`<label>Image description:<br>` +
			`<textarea name="description" id="description" rows=5 cols=50>${data.description}</textarea>` +
		`</label>` +
		`<br>` +
		`<input value="update" type="submit">` +
	`</form>`
)